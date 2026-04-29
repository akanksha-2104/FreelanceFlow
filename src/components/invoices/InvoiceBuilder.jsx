import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import * as invoiceService from '../../services/invoiceService';
import * as projectService from '../../services/projectService';
import * as clientService from '../../services/clientService';
import * as timeLogService from '../../services/timeLogService'; 
import { formatCurrency } from '../../utils/formatters';

export default function InvoiceBuilder({ onSave, onClose }) {
    const [projects, setProjects] = useState([]);
    const [clients, setClients]   = useState([]);
    const [saving, setSaving]     = useState(false);
    const [error, setError]       = useState('');

    const [selectedProject, setSelectedProject] = useState(null);
    const [logsImported, setLogsImported]       = useState(false);
    const [importing, setImporting]             = useState(false);
    const [totalImportedHours, setTotalImportedHours] = useState(0);
    const [noLogsFound, setNoLogsFound]         = useState(false);


    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            taxPercent: 18,
            issueDate: new Date().toISOString().split('T')[0],
            items: [{ description: '', quantity: 1, unitPrice: 0 }],
        },
    });

    const { fields, append, remove, replace } = useFieldArray({
        control,
        name: 'items',
    });

    useEffect(() => {
        const load = async () => {
            const [p, c] = await Promise.all([
                projectService.getAll(),
                clientService.getAll(),
            ]);
            setProjects(p);
            setClients(c);
        };
        load();
    }, []);

    //WATCH PROJECT
    const watchedProjectId = watch('projectId');

    // HANDLE PROJECT CHANGE
    useEffect(() => {
        if (watchedProjectId) {
            const proj = projects.find(
                p => p.projectId === parseInt(watchedProjectId)
            );

            setSelectedProject(proj || null);
            setLogsImported(false);
            setNoLogsFound(false);

            if (proj) {
            setValue('clientId', proj.clientId);
            }

        } else {
            setSelectedProject(null);
            setLogsImported(false);
            setValue('clientId', '');
        }
    }, [watchedProjectId, projects, setValue]);

     // IMPORT LOGS FUNCTION
    const handleImportLogs = async () => {
        if (!watchedProjectId) return;

        setImporting(true);
        setNoLogsFound(false);

        try {
            const logs = await timeLogService.getByProject(watchedProjectId);

            if (logs.length === 0) {
                setNoLogsFound(true);
                setImporting(false);
                return;
            }

            const grouped = {};
            logs.forEach(log => {
                const key = log.taskTitle || 'General Work';
                if (!grouped[key]) grouped[key] = 0;
                grouped[key] += log.hoursLogged;
            });

            const lineItems = Object.entries(grouped).map(([name, hours]) => ({
                description: name,
                quantity: parseFloat(hours.toFixed(2)),
                unitPrice: '',
            }));

            replace(lineItems);

            const total = logs.reduce((sum, l) => sum + l.hoursLogged, 0);
            setTotalImportedHours(parseFloat(total.toFixed(2)));
            setLogsImported(true);

        } catch (err) {
            console.error('Failed to import time logs:', err);
        } finally {
            setImporting(false);
        }
    };


    // live calculation
    const watchedItems = watch('items');
    const watchedTax   = watch('taxPercent');

    const subtotal = (watchedItems || []).reduce((sum, item) => {
        const qty   = parseFloat(item.quantity)  || 0;
        const price = parseFloat(item.unitPrice) || 0;
        return sum + qty * price;
    }, 0);

    const taxAmount   = subtotal * (parseFloat(watchedTax) || 0) / 100;
    const totalAmount = subtotal + taxAmount;

    const onSubmit = async (data) => {
        console.log("FORM DATA:", data);

        setSaving(true);
        setError('');
        try {
            await invoiceService.create({
                projectId:  parseInt(data.projectId),
                clientId:   parseInt(data.clientId),
                issueDate:  data.issueDate,
                dueDate:    data.dueDate,
                taxPercent: parseFloat(data.taxPercent),
                notes:      data.notes || '',
                items: data.items.map((item) => ({
                    description: item.description,
                    quantity:    parseFloat(item.quantity),
                    unitPrice:   parseFloat(item.unitPrice),
                })),
            });
            onSave();
        } catch {
            setError('Failed to create invoice. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div
            className="modal d-block"
            style={{
                backgroundColor: 'rgba(0,0,0,0.5)',
                position: 'fixed',
                top: 0, left: 0,
                width: '100%', height: '100%',
                zIndex: 1050,
                overflowY: 'auto',
            }}
        >
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title fw-bold">Create Invoice</h5>
                        <button className="btn-close" onClick={onClose} />
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="modal-body">
                            {error && (
                                <div className="alert alert-danger py-2">
                                    {error}
                                </div>
                            )}

                            {/* ── Project and Client ── */}
                            <div className="row g-3 mb-3">
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">
                                        Project <span className="text-danger">*</span>
                                    </label>
                                    <select
                                        className={`form-select ${errors.projectId ? 'is-invalid' : ''}`}
                                        {...register('projectId', {
                                            required: 'Select a project',
                                        })}
                                    >
                                        <option value="">Select project</option>
                                        {projects.map((p) => (
                                            <option
                                                key={p.projectId}
                                                value={p.projectId}
                                            >
                                                {p.title}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.projectId && (
                                        <div className="invalid-feedback">
                                            {errors.projectId.message}
                                        </div>
                                    )}
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">Client</label>
                                    <div className={`form-control ${
                                        selectedProject ? 'bg-light' : 'bg-light text-muted'
                                    }`}>
                                        {selectedProject
                                            ? selectedProject.clientName
                                            : 'Auto-filled when project is selected'}
                                    </div>
                                    

                                    <input
                                        type="hidden"
                                        {...register('clientId')}
        
                                    />
                                </div>

                            </div>

                            {/* ✅ IMPORT BUTTON */}
                            {selectedProject && (
                                <div className="mb-3">
                                    <div className="d-flex align-items-center gap-3">
                                        <button
                                            type="button"
                                            className="btn btn-outline-primary btn-sm"
                                            onClick={handleImportLogs}
                                            disabled={importing}
                                        >
                                            {importing ? 'Importing...' : '↓ Import Time Logs'}
                                        </button>

                                        {logsImported && (
                                            <span className="text-success small fw-semibold">
                                                ✓ {fields.length} tasks imported — {totalImportedHours}h total.
                                            </span>
                                        )}

                                        {noLogsFound && (
                                            <span className="text-warning small">
                                                No time logs found. Add manually.
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}


                            {/* ── Dates and Tax ── */}
                            <div className="row g-3 mb-3">
                                <div className="col-md-4">
                                    <label className="form-label fw-semibold">
                                        Issue Date
                                    </label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        {...register('issueDate')}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label fw-semibold">
                                        Due Date
                                    </label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        {...register('dueDate')}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label fw-semibold">
                                        Tax %
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="form-control"
                                        {...register('taxPercent')}
                                    />
                                </div>
                            </div>

                            {/* ── Line Items ── */}
                            <table className="table table-bordered table-sm">
                                <thead className="table-light">
                                    <tr>
                                        <th>Description</th>
                                        <th>Qty</th>
                                        <th>Unit Price</th>
                                        <th>Amount</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {fields.map((field, index) => {
                                        const qty = parseFloat(watchedItems?.[index]?.quantity) || 0;
                                        const price = parseFloat(watchedItems?.[index]?.unitPrice) || 0;
                                        const amount = qty * price;

                                        return (
                                            <tr key={field.id}>
                                                <td>
                                                    <input
                                                        className="form-control form-control-sm"
                                                        {...register(`items.${index}.description`)}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        className="form-control form-control-sm"
                                                        {...register(`items.${index}.quantity`)}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        className="form-control form-control-sm"
                                                        placeholder="Rate/hr" // ✅ ADDED
                                                        {...register(`items.${index}.unitPrice`)}
                                                    />
                                                </td>
                                                <td>{formatCurrency(amount)}</td>
                                                {/* <td>
                                                    {fields.length > 1 && (
                                                        <button onClick={() => remove(index)}>✕</button>
                                                    )}
                                                </td> */}

                                                <td className="text-center align-middle">
                                                    {fields.length > 1 && (
                                                        <button
                                                            type="button"   // ✅ IMPORTANT (prevents form submit)
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() => remove(index)}
                                                        >
                                                            ✕
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>

                            {/* Totals */}
                            <div className="text-end">
                                <div>Subtotal: {formatCurrency(subtotal)}</div>
                                <div>Tax: {formatCurrency(taxAmount)}</div>
                                <div className="fw-bold">Total: {formatCurrency(totalAmount)}</div>
                            </div>
                        </div>


                            {/* ── Notes ── */}
                            <div className="mb-2">
                                <label className="form-label fw-semibold">
                                    Notes
                                </label>
                                <textarea
                                    className="form-control"
                                    rows={2}
                                    placeholder="e.g. Payment due within 30 days"
                                    {...register('notes')}
                                />
                            </div>
                        

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={saving}
                            >
                                {saving ? 'Creating...' : 'Create Invoice'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}