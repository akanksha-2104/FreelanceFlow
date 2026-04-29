import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as invoiceService from '../services/invoiceService';
import { formatDate, formatCurrency } from '../utils/formatters';
import InvoiceBuilder from '../components/invoices/InvoiceBuilder';

const statusBadge = {
    DRAFT:    'bg-secondary',
    SENT:     'bg-primary',
    PAID:     'bg-success',
    OVERDUE:  'bg-danger',
};

export default function Invoices() {
    const [invoices, setInvoices]       = useState([]);
    const [loading, setLoading]         = useState(true);
    const [showBuilder, setShowBuilder] = useState(false);
    const [error, setError]             = useState('');

    useEffect(() => { loadInvoices(); }, []);

    const loadInvoices = async () => {
        setLoading(true);
        try {
            const data = await invoiceService.getAll();
            setInvoices(data);
        } catch {
            setError('Failed to load invoices.');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (id) => {
        try {
            await invoiceService.downloadPDF(id);
        } catch {
            alert('Failed to download PDF.');
        }
    };

    const handleSendEmail = async (id) => {
        try {
            await invoiceService.sendEmail(id);
            alert('Invoice sent successfully!');
            loadInvoices();
        } catch {
            alert('Failed to send email.');
        }
    };

    const handleMarkPaid = async (id) => {
        try {
            await invoiceService.updateStatus(id, 'PAID');
            console.log('Update successful');
            loadInvoices();
        } catch {
            alert('Failed to update status.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this invoice?')) return;
        try {
            await invoiceService.remove(id);
            loadInvoices();
        } catch {
            alert('Failed to delete invoice.');
        }
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" />
            </div>
        );
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold mb-0">Invoices</h4>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowBuilder(true)}
                >
                    + Create Invoice
                </button>
            </div>

            {error && (
                <div className="alert alert-danger">{error}</div>
            )}

            {invoices.length === 0 ? (
                <div className="text-center py-5 text-muted">
                    <p>No invoices yet. Create your first invoice.</p>
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-dark">
                            <tr>
                                <th>Invoice #</th>
                                <th>Client</th>
                                <th>Project</th>
                                <th>Amount</th>
                                <th>Issue Date</th>
                                <th>Due Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.map((inv) => (
                                <tr key={inv.invoiceId}>
                                    <td className="fw-semibold">
                                        {inv.invoiceNumber}
                                    </td>
                                    <td>{inv.clientName}</td>
                                    <td>{inv.projectTitle}</td>
                                    <td className="fw-semibold">
                                        {formatCurrency(inv.totalAmount)}
                                    </td>
                                    <td>{formatDate(inv.issueDate)}</td>
                                    <td>{formatDate(inv.dueDate)}</td>
                                    <td>
                                        <span className={`badge ${statusBadge[inv.invoiceStatus]}`}>
                                            {inv.invoiceStatus}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="d-flex gap-1 flex-wrap">
                                            <button
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() => handleDownload(inv.invoiceId)}
                                            >
                                                PDF
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-info"
                                                onClick={() => handleSendEmail(inv.invoiceId)}
                                            >
                                                Email
                                            </button>
                                            {inv.status !== 'PAID' && (
                                                <button
                                                    className="btn btn-sm btn-outline-success"
                                                    onClick={() => handleMarkPaid(inv.invoiceId)}
                                                >
                                                    Paid
                                                </button>
                                            )}
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => handleDelete(inv.invoiceId)}
                                            >
                                                Del
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showBuilder && (
                <InvoiceBuilder
                    onSave={() => {
                        setShowBuilder(false);
                        loadInvoices();
                    }}
                    onClose={() => setShowBuilder(false)}
                />
            )}
        </div>
    );
}