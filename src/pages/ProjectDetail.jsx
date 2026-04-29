


import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as projectService from '../services/projectService';
import * as taskService from '../services/taskService';
import * as timeLogService from '../services/timeLogService';
import ProjectHeader from '../components/projects/ProjectHeader';
import KanbanBoard from '../components/task/KanbanBoard';
import TimeTracker from '../components/time/TimeTracker';
import TaskForm from '../components/task/TaskForm';

export default function ProjectDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [project, setProject]         = useState(null);
    const [tasks, setTasks]             = useState([]);
    const [logs, setLogs]               = useState([]);
    const [totalHours, setTotalHours]   = useState(0);
    const [loading, setLoading]         = useState(true);
    const [error, setError]             = useState('');
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [defaultStatus, setDefaultStatus] = useState('TODO');

    useEffect(() => {
        loadAll();
    }, [id]);

    const loadAll = async () => {
        setLoading(true);
        try {
            const [proj, taskList, logList, totalData] = await Promise.all([
                projectService.getById(id),
                taskService.getByProject(id),
                timeLogService.getByProject(id),
                timeLogService.getTotalHours(id),
            ]);
            setProject(proj);
            setTasks(taskList);
            setLogs(logList);
            setTotalHours(totalData.totalHours ?? 0);
        } catch (err) {
            setError('Failed to load project details.');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (taskId, newStatus) => {
        const previous = tasks.find((t) => t.taskId === taskId)?.status;
        // optimistic update
        setTasks((prev) =>
            prev.map((t) =>
                t.taskId === taskId ? { ...t, status: newStatus } : t
            )
        );
        try {
            await taskService.updateStatus(taskId, newStatus);
        } catch {
            // revert on failure
            setTasks((prev) =>
                prev.map((t) =>
                    t.taskId === taskId ? { ...t, status: previous } : t
                )
            );
        }
    };

    const handleAddTask = (status) => {
        setDefaultStatus(status);
        setShowTaskModal(true);
    };

    const handleTaskSaved = async () => {
        setShowTaskModal(false);
        const updated = await taskService.getByProject(id);
        setTasks(updated);
    };

    const handleDeleteTask = async (taskId) => {
        if (!window.confirm('Delete this task?')) return;
        await taskService.remove(taskId);
        setTasks((prev) => prev.filter((t) => t.taskId !== taskId));
    };

    const handleLogSaved = async () => {
        const [logList, totalData] = await Promise.all([
            timeLogService.getByProject(id),
            timeLogService.getTotalHours(id),
        ]);
        setLogs(logList);
        setTotalHours(totalData.totalHours ?? 0);
    };

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

    return (
        <div>
            <button
                className="btn btn-sm btn-outline-secondary mb-3"
                onClick={() => navigate('/projects')}
            >
                ← Back to Projects
            </button>

            <ProjectHeader project={project} totalHours={totalHours} />

            <div className="row g-4 mt-1">
                <div className="col-lg-8">
                    <KanbanBoard
                        tasks={tasks}
                        onStatusChange={handleStatusChange}
                        onAddTask={handleAddTask}
                        onDeleteTask={handleDeleteTask}
                    />
                </div>
                <div className="col-lg-4">
                    <TimeTracker
                        projectId={id}
                        tasks={tasks}
                        logs={logs}
                        totalHours={totalHours}
                        onLogSaved={handleLogSaved}
                    />
                </div>
            </div>

            {showTaskModal && (
                <TaskForm
                    projectId={id}
                    defaultStatus={defaultStatus}
                    onSave={handleTaskSaved}
                    onClose={() => setShowTaskModal(false)}
                />
            )}
        </div>
    );
}