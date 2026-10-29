import { useForm, Link, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import AppLayout from '@/Layouts/AppLayout';

export default function Create({ employees = [], isAdmin = false }) {
    const { auth } = usePage().props;

    const urlParams = new URLSearchParams(window.location.search);
    const initialAssignedTo = urlParams.get('assigned_to') || '';

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        due_date: '',
        assigned_to: initialAssignedTo,
    });

    useEffect(() => {
        const preselected = new URLSearchParams(window.location.search).get('assigned_to');
        if (preselected) {
            setData('assigned_to', preselected);
        }
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post('/tasks');
    };

    return (
        <AppLayout currentTab="dashboard">
            <div className="p-8 lg:p-10 max-w-3xl w-full mx-auto space-y-6">
                <div>
                    <h1 className="text-3xl font-black text-[#030407] tracking-tight">
                        {isAdmin ? 'Create and assign task' : 'Create task'}
                    </h1>
                    <p className="text-xs font-medium text-slate-500 mt-1">
                        Add a new task and set priority and due dates
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 p-8">
                    <form onSubmit={submit} className="space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-2">
                                TITLE
                            </label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1568c9]/20 focus:border-[#1568c9] transition ${
                                    errors.title ? 'border-red-500 bg-red-50/20' : 'border-slate-300'
                                }`}
                                placeholder="e.g. Prepare client proposal"
                            />
                            {errors.title && (
                                <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.title}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-2">
                                DESCRIPTION
                            </label>
                            <textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Optional details..."
                                rows="4"
                                className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1568c9]/20 focus:border-[#1568c9] transition ${
                                    errors.description ? 'border-red-500 bg-red-50/20' : 'border-slate-300'
                                }`}
                            />
                            {errors.description && (
                                <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.description}</p>
                            )}
                        </div>

                        {/* Assignee (Admin only) */}
                        {isAdmin && (
                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-2">
                                    ASSIGNED TO
                                </label>
                                <select
                                    value={data.assigned_to}
                                    onChange={(e) => setData('assigned_to', e.target.value)}
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1568c9]/20 focus:border-[#1568c9] transition bg-white"
                                >
                                    <option value="">Unassigned</option>
                                    {employees.map((emp) => (
                                        <option key={emp.id} value={emp.id}>
                                            {emp.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.assigned_to && (
                                    <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.assigned_to}</p>
                                )}
                            </div>
                        )}

                        {/* Status and Priority */}
                        <div className="grid grid-cols-2 gap-5">
                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-2">
                                    STATUS
                                </label>
                                <select
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1568c9]/20 focus:border-[#1568c9] transition bg-white"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="in_progress">In progress</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-2">
                                    PRIORITY
                                </label>
                                <select
                                    value={data.priority}
                                    onChange={(e) => setData('priority', e.target.value)}
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1568c9]/20 focus:border-[#1568c9] transition bg-white"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                        </div>

                        {/* Due Date */}
                        <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-2">
                                DUE DATE
                            </label>
                            <input
                                type="date"
                                value={data.due_date}
                                onChange={(e) => setData('due_date', e.target.value)}
                                className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1568c9]/20 focus:border-[#1568c9] transition ${
                                    errors.due_date ? 'border-red-500 bg-red-50/20' : 'border-slate-300'
                                }`}
                            />
                            {errors.due_date && (
                                <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.due_date}</p>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end space-x-3 pt-3">
                            <Link
                                href="/tasks"
                                className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 text-xs font-bold transition"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2.5 bg-[#1568c9] hover:bg-[#10529e] text-white rounded-xl text-xs font-bold shadow-md shadow-[#1568c9]/25 transition cursor-pointer disabled:opacity-50 active:scale-95"
                            >
                                Save task
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
