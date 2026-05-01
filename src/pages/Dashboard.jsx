import { useState, useEffect } from 'react';
import { getSummary } from '../services/dashboardService';
import { formatCurrency } from '../utils/formatters';
import AIChatWidget from '../components/dashboard/AIChatWidget';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

export default function Dashboard() {
    const [data, setData]       = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState('');

    useEffect(() => {
        const load = async () => {
            try {
                const summary = await getSummary();
                setData(summary);
            } catch {
                setError('Failed to load dashboard.');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" />
            </div>
        );
    }

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    const revenueChart = {
        labels: data?.monthlyRevenue?.map((m) => m.month) || [],
        datasets: [{
            label: 'Revenue',
            data: data?.monthlyRevenue?.map((m) => m.amount) || [],
            backgroundColor: '#1A56DB',
            borderRadius: 4,
        }],
    };

    const statusChart = {
        labels: ['Active', 'Completed', 'On Hold'],
        datasets: [{
            data: [
                data?.activeProjects    || 0,
                data?.completedProjects || 0,
                data?.onHoldProjects    || 0,
            ],
            backgroundColor: ['#1A56DB', '#1D9E75', '#6B7280'],
        }],
    };

    return (
        <div>
            {/* <h4 className="fw-bold mb-4">Dashboard</h4> */}

            {/* ── KPI Cards ── */}
            <div className="row g-3 mb-4">
                {[
                    {
                        label: 'Total Revenue',
                        value: formatCurrency(data?.totalRevenue || 0),
                        color: 'text-primary',
                        bg: 'bg-primary bg-opacity-10',
                    },
                    {
                        label: 'Active Projects',
                        value: data?.activeProjects || 0,
                        color: 'text-success',
                        bg: 'bg-success bg-opacity-10',
                    },
                    {
                        label: 'Unpaid Invoices',
                        value: data?.unpaidInvoices || 0,
                        color: 'text-danger',
                        bg: 'bg-danger bg-opacity-10',
                    },
                    {
                        label: 'Hours This Month',
                        value: `${data?.hoursThisMonth || 0}h`,
                        color: 'text-warning',
                        bg: 'bg-warning bg-opacity-10',
                    },
                ].map((kpi) => (
                    <div className="col-6 col-md-3" key={kpi.label}>
                        <div className={`card border-0 ${kpi.bg} h-100`}>
                            <div className="card-body text-center">
                                <div className={`fs-3 fw-bold ${kpi.color}`}>
                                    {kpi.value}
                                </div>
                                <div className="small text-muted mt-1">
                                    {kpi.label}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Charts ── */}
            <div className="row g-4 mb-4">
                <div className="col-md-8">
                    <div className="card shadow-sm h-100">
                        <div className="card-body">
                            <h6 className="fw-bold mb-3">Monthly Revenue</h6>
                            {revenueChart.labels.length > 0 ? (
                                <Bar
                                    data={revenueChart}
                                    options={{
                                        responsive: true,
                                        plugins: { legend: { display: false } },
                                    }}
                                />
                            ) : (
                                <div className="text-muted text-center py-4">
                                    No revenue data yet
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card shadow-sm h-100">
                        <div className="card-body">
                            <h6 className="fw-bold mb-3">Project Status</h6>
                            <Doughnut
                                data={statusChart}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: { position: 'bottom' },
                                    },
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Upcoming Deadlines ── */}
            <div className="card shadow-sm">
                <div className="card-body">
                    <h6 className="fw-bold mb-3">Upcoming Deadlines</h6>
                    {data?.upcomingDeadlines?.length > 0 ? (
                        <table className="table table-sm table-hover">
                            <thead>
                                <tr>
                                    <th>Project</th>
                                    <th>Client</th>
                                    <th>Deadline</th>
                                    <th>Days Left</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.upcomingDeadlines.map((p) => {
                                    const days = Math.ceil(
                                        (new Date(p.deadline) - new Date()) /
                                        (1000 * 60 * 60 * 24)
                                    );
                                    return (
                                        <tr key={p.projectId}>
                                            <td>{p.title}</td>
                                            <td>{p.clientName}</td>
                                            <td>{p.deadline}</td>
                                            <td>
                                                <span className={`badge ${days <= 3 ? 'bg-danger' : 'bg-warning text-dark'}`}>
                                                    {days}d
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    ) : (
                        <div className="text-muted text-center py-3">
                            No upcoming deadlines
                        </div>
                    )}
                </div>
            </div>

            <AIChatWidget />

        </div>
    );
}