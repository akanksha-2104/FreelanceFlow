import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import * as invoiceService  from '../../services/invoiceService';
import * as projectService  from '../../services/projectService';
import * as timeLogService  from '../../services/timeLogService';
import { formatCurrency }   from '../../utils/formatters';
import * as aiService from '../../services/aiService';


export default function InvoiceBuilder({ onSave, onClose }) {

    // ── Data state ────────────────────────────────────────────
    const [projects, setProjects] = useState([]);
    const [loadingProjects, setLoadingProjects] = useState(true);

    // ── UI state ──────────────────────────────────────────────
    const [selectedProject,      setSelectedProject]      = useState(null);
    const [logsImported,         setLogsImported]         = useState(false);
    const [importing,            setImporting]            = useState(false);
    const [totalImportedHours,   setTotalImportedHours]   = useState(0);
    const [noLogsFound,          setNoLogsFound]          = useState(false);
    const [saving,               setSaving]               = useState(false);
    const [error,                setError]                = useState('');


    const [suggesting, setSuggesting] = useState(false);
    const [aiError, setAiError]       = useState('');



    // ── React Hook Form setup ─────────────────────────────────
    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            projectId:  '',
            clientId:   '',
            taxPercent: 18,
            issueDate:  new Date().toISOString().split('T')[0],
            dueDate:    '',
            notes:      '',
            items: [{ description: '', quantity: 1, unitPrice: '' }],
        },
    });

    const { fields, append, remove, replace } = useFieldArray({
        control,
        name: 'items',
    });

    // ── Load projects on mount ────────────────────────────────
    useEffect(() => {
        const load = async () => {
            try {
                const p = await projectService.getAll();
                setProjects(p);
            } catch (err) {
                console.error('Failed to load projects:', err);
            } finally {
                setLoadingProjects(false);
            }
        };
        load();
    }, []);

    // ── Watch form values ─────────────────────────────────────
    const watchedProjectId = watch('projectId');
    const watchedItems     = watch('items');
    const watchedTax       = watch('taxPercent');

    // ── When project changes — auto-fill client ───────────────
    useEffect(() => {
        if (watchedProjectId) {
            const proj = projects.find(
                (p) => p.projectId === parseInt(watchedProjectId)
            );

            if (proj) {
                setSelectedProject(proj);
                setValue('clientId', proj.clientId);
            } else {
                setSelectedProject(null);
                setValue('clientId', '');
            }

            // reset import state when project changes
            setLogsImported(false);
            setNoLogsFound(false);
            setTotalImportedHours(0);

        } else {
            setSelectedProject(null);
            setValue('clientId', '');
            setLogsImported(false);
            setNoLogsFound(false);
        }
    }, [watchedProjectId, projects, setValue]);

    // ── Import time logs handler ──────────────────────────────
    const handleImportLogs = async () => {
        if (!watchedProjectId) return;

        setImporting(true);
        setNoLogsFound(false);
        setLogsImported(false);

        try {
            const logs = await timeLogService.getByProject(watchedProjectId);

            if (!logs || logs.length === 0) {
                setNoLogsFound(true);
                return;
            }

            // group logs by task name
            const grouped = {};
            logs.forEach((log) => {
                const key = log.taskTitle
                    ? log.taskTitle.trim()
                    : 'General Work';
                if (!grouped[key]) grouped[key] = 0;
                grouped[key] = parseFloat(
                    (grouped[key] + log.hoursLogged).toFixed(2)
                );
            });

            // convert to line items
            const lineItems = Object.entries(grouped).map(
                ([name, hours]) => ({
                    description: name,
                    quantity:    hours,
                    unitPrice:   '',   // user enters their hourly rate
                })
            );

            // replace all current line items
            replace(lineItems);

            // calculate total hours for display
            const total = logs.reduce(
                (sum, l) => sum + l.hoursLogged, 0
            );
            setTotalImportedHours(parseFloat(total.toFixed(2)));
            setLogsImported(true);

        } catch (err) {
            console.error('Failed to import time logs:', err);
            setError('Failed to import time logs. Please try again.');
        } finally {
            setImporting(false);
        }
    };


            


            


    // ── Live totals calculation ───────────────────────────────
    const subtotal = (watchedItems || []).reduce((sum, item) => {
        const qty   = parseFloat(item.quantity)  || 0;
        const price = parseFloat(item.unitPrice) || 0;
        return sum + qty * price;
    }, 0);

    const taxAmount   = subtotal * (parseFloat(watchedTax) || 0) / 100;
    const totalAmount = subtotal + taxAmount;

    // ── Form submit ───────────────────────────────────────────
    const onSubmit = async (data) => {
        // validate line items before submitting
        const hasEmptyDescription = data.items.some(
            (item) => !item.description || item.description.trim() === ''
        );
        if (hasEmptyDescription) {
            setError('All line items must have a description.');
            return;
        }

        const hasEmptyPrice = data.items.some(
            (item) => !item.unitPrice || parseFloat(item.unitPrice) <= 0
        );
        if (hasEmptyPrice) {
            setError(
                'All line items must have a unit price greater than 0. ' +
                'Please enter your hourly rate.'
            );
            return;
        }

        setSaving(true);
        setError('');

        try {
            await invoiceService.create({
                projectId:  parseInt(data.projectId),
                clientId:   parseInt(data.clientId),
                issueDate:  data.issueDate,
                dueDate:    data.dueDate || null,
                taxPercent: parseFloat(data.taxPercent) || 0,
                notes:      data.notes || '',
                items: data.items.map((item) => ({
                    description: item.description,
                    quantity:    parseFloat(item.quantity),
                    unitPrice:   parseFloat(item.unitPrice),
                })),
            });
            onSave();
        } catch (err) {
            console.error('Invoice creation error:', err);
            setError('Failed to create invoice. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    // ─────────────────────────────────────────────────────────
    // RENDER
    // ─────────────────────────────────────────────────────────
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

                    {/* ── Header ── */}
                    <div className="modal-header">
                        <h5 className="modal-title fw-bold">
                            Create Invoice
                        </h5>
                        <button
                            className="btn-close"
                            onClick={onClose}
                            type="button"
                        />
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="modal-body">

                            {/* ── Error alert ── */}
                            {error && (
                                <div className="alert alert-danger py-2 small">
                                    {error}
                                </div>
                            )}

                            {/* ── Project + Client row ── */}
                            <div className="row g-3 mb-3">

                                {/* Project dropdown */}
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">
                                        Project{' '}
                                        <span className="text-danger">*</span>
                                    </label>
                                    <select
                                        className={`form-select ${
                                            errors.projectId ? 'is-invalid' : ''
                                        }`}
                                        {...register('projectId', {
                                            required: 'Please select a project',
                                        })}
                                        disabled={loadingProjects}
                                    >
                                        <option value="">
                                            {loadingProjects
                                                ? 'Loading projects...'
                                                : 'Select a project'}
                                        </option>
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

                                {/* Client — auto-filled, read only */}
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">
                                        Client
                                    </label>
                                    <div
                                        className={`form-control ${
                                            selectedProject
                                                ? 'bg-light text-dark'
                                                : 'bg-light text-muted'
                                        }`}
                                        style={{ minHeight: '38px' }}
                                    >
                                        {selectedProject
                                            ? selectedProject.clientName
                                            : 'Auto-filled from project'}
                                    </div>
                                    {/* hidden input carries clientId in form data */}
                                    <input
                                        type="hidden"
                                        {...register('clientId', {
                                            required: true,
                                        })}
                                    />
                                </div>
                            </div>

                            {/* ── Import Time Logs button ── */}
                            {selectedProject && (
                                <div className="mb-3 p-3 border rounded bg-light">
                                    <div className="d-flex align-items-center gap-3 flex-wrap">
                                        <div>
                                            <div className="small text-muted mb-1">
                                                Project selected:{' '}
                                                <strong>
                                                    {selectedProject.title}
                                                </strong>
                                            </div>
                                            <div className="d-flex gap-2 flex-wrap">
                                            {/* Import logs */}
                                            <button
                                                type="button"
                                                className="btn btn-primary btn-sm"
                                                onClick={handleImportLogs}
                                                disabled={importing}
                                            >
                                                {importing ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-1" />
                                                        Importing...
                                                    </>
                                                ) : (
                                                    '↓ Import Logs'
                                                )}
                                            </button>

                                            
                                        </div>
                                        </div>

                                        {/* Success message */}
                                        {logsImported && (
                                            <div className="alert alert-success py-1 px-2 mb-0 small">
                                                ✓{' '}
                                                <strong>
                                                    {fields.length} line items
                                                </strong>{' '}
                                                imported —{' '}
                                                <strong>
                                                    {totalImportedHours}h
                                                </strong>{' '}
                                                total hours. Enter your hourly
                                                rate in the Unit Price column.
                                            </div>
                                        )}

                                        {/* No logs warning */}
                                        {noLogsFound && (
                                            <div className="alert alert-warning py-1 px-2 mb-0 small">
                                                No time logs found for this
                                                project. Add line items manually
                                                below.
                                            </div>
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
                                        min="0"
                                        max="100"
                                        className="form-control"
                                        {...register('taxPercent')}
                                    />
                                </div>
                            </div>

                            {/* ── Line Items table ── */}
                            <div className="mb-3">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <label className="form-label fw-semibold mb-0">
                                        Line Items
                                    </label>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-secondary"
                                        onClick={() =>
                                            append({
                                                description: '',
                                                quantity: 1,
                                                unitPrice: '',
                                            })
                                        }
                                    >
                                        + Add Row
                                    </button>
                                </div>

                                <div className="table-responsive">
                                    <table className="table table-bordered table-sm align-middle">
                                        <thead className="table-dark">
                                            <tr>
                                                <th>Description</th>
                                                <th style={{ width: '90px' }}>
                                                    Qty (hrs)
                                                </th>
                                                <th style={{ width: '130px' }}>
                                                    Rate / hr (₹)
                                                </th>
                                                <th style={{ width: '120px' }}>
                                                    Amount
                                                </th>
                                                <th style={{ width: '50px' }}>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {fields.map((field, index) => {
                                                const qty = parseFloat(
                                                    watchedItems?.[index]
                                                        ?.quantity
                                                ) || 0;
                                                const price = parseFloat(
                                                    watchedItems?.[index]
                                                        ?.unitPrice
                                                ) || 0;
                                                const amount = qty * price;

                                                return (
                                                    <tr key={field.id}>
                                                        <td>
                                                            <div className="d-flex align-items-center gap-2">
                                                                <input
                                                                    className="form-control form-control-sm"
                                                                    placeholder="e.g. homepage fixes"
                                                                    {...register(`items.${index}.description`)}
                                                                />

                                                                
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="number"
                                                                step="0.01"
                                                                min="0"
                                                                className="form-control form-control-sm"
                                                                {...register(
                                                                    `items.${index}.quantity`
                                                                )}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="number"
                                                                step="0.01"
                                                                min="0"
                                                                className="form-control form-control-sm"
                                                                placeholder="e.g. 1000"
                                                                {...register(
                                                                    `items.${index}.unitPrice`
                                                                )}
                                                            />
                                                        </td>
                                                        <td className="text-end fw-semibold">
                                                            {formatCurrency(amount)}
                                                        </td>
                                                        <td className="text-center">
                                                            {fields.length > 1 && (
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm btn-outline-danger"
                                                                    onClick={() =>
                                                                        remove(index)
                                                                    }
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
                                </div>

                                {/* ── Live totals ── */}
                                <div className="d-flex flex-column align-items-end gap-1 mt-2 pe-1">
                                    <div className="d-flex gap-5">
                                        <span className="text-muted">
                                            Subtotal
                                        </span>
                                        <span
                                            className="fw-semibold"
                                            style={{ minWidth: '110px', textAlign: 'right' }}
                                        >
                                            {formatCurrency(subtotal)}
                                        </span>
                                    </div>
                                    <div className="d-flex gap-5">
                                        <span className="text-muted">
                                            Tax ({watchedTax || 0}%)
                                        </span>
                                        <span
                                            className="fw-semibold"
                                            style={{ minWidth: '110px', textAlign: 'right' }}
                                        >
                                            {formatCurrency(taxAmount)}
                                        </span>
                                    </div>
                                    <div
                                        className="d-flex gap-5 pt-2 border-top"
                                        style={{ minWidth: '250px' }}
                                    >
                                        <span className="fw-bold fs-6">
                                            Total
                                        </span>
                                        <span
                                            className="fw-bold text-primary fs-6"
                                            style={{ minWidth: '110px', textAlign: 'right' }}
                                        >
                                            {formatCurrency(totalAmount)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* ── Notes — INSIDE modal-body ── */}
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

                        </div>
                        {/* end modal-body */}

                        {/* ── Footer ── */}
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
                                {saving ? (
                                    <>
                                        <span
                                            className="spinner-border spinner-border-sm me-1"
                                            role="status"
                                        />
                                        Creating...
                                    </>
                                ) : (
                                    'Create Invoice'
                                )}
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
}