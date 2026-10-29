import { useForm, Link, usePage, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function Edit({ task, employees = [], isAdmin = false }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    const { data, setData, patch, processing, errors } = useForm({
        title: task.title || '',
        description: task.description || '',
        status: task.status ? task.status.toLowerCase().replace(' ', '_') : 'pending',
        priority: task.priority ? task.priority.toLowerCase() : 'medium',
        due_date: task.due_date ? task.due_date.substring(0, 10) : '',
        assigned_to: task.assigned_to !== null && task.assigned_to !== undefined ? String(task.assigned_to) : '',
    });

    const submit = (e) => {
        e.preventDefault();
        patch(`/tasks/${task.id}`);
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this task?')) {
            router.delete(`/tasks/${task.id}`);
        }
    };

    // Find currently assigned employee
    const currentAssignee = employees.find(e => String(e.id) === String(data.assigned_to)) 
        || (task.assignee && String(task.assignee.id) === String(data.assigned_to) ? task.assignee : null);

    // Get initials & badge style
    const getEmployeeAvatar = (name) => {
        if (!name) return { initials: '?', bg: 'bg-slate-200', text: 'text-slate-600' };
        const parts = name.trim().split(' ');
        const initials = (parts.length >= 2 ? parts[0][0] + parts[1][0] : name.substring(0, 2)).toUpperCase();
        if (initials === 'AS' || name.toLowerCase().includes('amit')) return { initials, bg: 'bg-[#d4ff24]', text: 'text-[#030407]' };
        if (initials === 'PV' || name.toLowerCase().includes('priya')) return { initials, bg: 'bg-[#1568c9]', text: 'text-white' };
        if (initials === 'RS' || name.toLowerCase().includes('rahul')) return { initials, bg: 'bg-[#030407]', text: 'text-white' };
        return { initials, bg: 'bg-[#1568c9]', text: 'text-white' };
    };

    const assigneeAvatar = getEmployeeAvatar(currentAssignee?.name);

    // Format display due date
    const formatDueDisplay = (dateString) => {
        if (!dateString) return '-';
        const parts = dateString.split('-');
        if (parts.length === 3) {
            const year = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1;
            const day = parseInt(parts[2], 10);
            const due = new Date(year, month, day);

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const diffTime = due.getTime() - today.getTime();
            const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                return <span className="text-[#92400e] font-black">Tomorrow</span>;
            }
            if (diffDays === 0) {
                return <span className="text-rose-600 font-black">Today</span>;
            }

            return due.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        }
        return dateString;
    };

    // Format created date
    const formatCreatedDate = (dateString) => {
        if (!dateString) return 'Today';
        const d = new Date(dateString);
        if (isNaN(d.getTime())) return 'Today';
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    return (
        <AppLayout currentTab="dashboard">
            <div className="p-8 lg:p-10 max-w-6xl w-full mx-auto space-y-6">
                {/* Breadcrumbs */}
                <nav className="flex items-center space-x-2 text-xs font-medium text-slate-400">
                    <Link href="/tasks" className="text-[#1568c9] font-bold hover:underline">
                        All tasks
                    </Link>
                    <span>/</span>
                    <span className="text-slate-500">Edit task</span>
                </nav>

                {/* Page Header */}
                <div>
                    <h1 className="text-3xl font-black text-[#030407] tracking-tight">
                        Edit task
                    </h1>
                    <p className="text-xs font-medium text-slate-500 mt-1">
                        Modify task details, assignee, status or due date
                    </p>
                </div>

                {/* Two-Column Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    {/* Left Column: Form Card (2/3 width) */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200/90 p-7 lg:p-8">
                        <form onSubmit={submit} className="space-y-6">
                            {/* TITLE */}
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
                                    placeholder="Fix backend issues"
                                />
                                {errors.title && (
                                    <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.title}</p>
                                )}
                            </div>

                            {/* DESCRIPTION */}
                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-2">
                                    DESCRIPTION
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Fix the configuration and integration related issues"
                                    rows="4"
                                    className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1568c9]/20 focus:border-[#1568c9] transition ${
                                        errors.description ? 'border-red-500 bg-red-50/20' : 'border-slate-300'
                                    }`}
                                />
                                {errors.description && (
                                    <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.description}</p>
                                )}
                            </div>

                            {/* ASSIGNED TO (Admin only) */}
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

                            {/* STATUS Segmented Buttons */}
                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-2">
                                    STATUS
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setData('status', 'pending')}
                                        className={`py-2.5 px-3 rounded-xl text-xs font-bold transition text-center cursor-pointer border ${
                                            data.status === 'pending'
                                                ? 'border-amber-400 bg-amber-50 text-amber-900 shadow-xs'
                                                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                                        }`}
                                    >
                                        Pending
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setData('status', 'in_progress')}
                                        className={`py-2.5 px-3 rounded-xl text-xs font-bold transition text-center cursor-pointer border ${
                                            data.status === 'in_progress'
                                                ? 'border-blue-400 bg-blue-50 text-blue-900 shadow-xs'
                                                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                                        }`}
                                    >
                                        In Progress
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setData('status', 'completed')}
                                        className={`py-2.5 px-3 rounded-xl text-xs font-bold transition text-center cursor-pointer border ${
                                            data.status === 'completed'
                                                ? 'border-[#bfee10] bg-[#d4ff24]/20 text-[#030407] shadow-xs'
                                                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                                        }`}
                                    >
                                        Completed
                                    </button>
                                </div>
                            </div>

                            {/* PRIORITY Segmented Buttons */}
                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-2">
                                    PRIORITY
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setData('priority', 'low')}
                                        className={`py-2.5 px-3 rounded-xl text-xs font-bold transition text-center cursor-pointer border ${
                                            data.priority === 'low'
                                                ? 'border-slate-400 bg-slate-100 text-slate-800 shadow-xs'
                                                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                                        }`}
                                    >
                                        Low
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setData('priority', 'medium')}
                                        className={`py-2.5 px-3 rounded-xl text-xs font-bold transition text-center cursor-pointer border ${
                                            data.priority === 'medium'
                                                ? 'border-amber-400 bg-amber-50 text-amber-900 shadow-xs'
                                                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                                        }`}
                                    >
                                        Medium
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setData('priority', 'high')}
                                        className={`py-2.5 px-3 rounded-xl text-xs font-bold transition text-center cursor-pointer border ${
                                            data.priority === 'high'
                                                ? 'border-rose-300 bg-rose-50 text-rose-600 shadow-xs'
                                                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                                        }`}
                                    >
                                        High
                                    </button>
                                </div>
                            </div>

                            {/* DUE DATE */}
                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-2">
                                    DUE DATE
                                </label>
                                <input
                                    type="date"
                                    value={data.due_date}
                                    onChange={(e) => setData('due_date', e.target.value)}
                                    className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1568c9]/20 focus:border-[#1568c9] transition bg-white ${
                                        errors.due_date ? 'border-red-500 bg-red-50/20' : 'border-slate-300'
                                    }`}
                                />
                                {errors.due_date && (
                                    <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.due_date}</p>
                                )}
                            </div>

                            {/* Bottom Actions Row */}
                            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                <div>
                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        className="px-4 py-2 border border-slate-200 text-rose-500 hover:border-rose-300 hover:bg-rose-50 rounded-xl text-xs font-bold transition cursor-pointer"
                                    >
                                        Delete task
                                    </button>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Link
                                        href="/tasks"
                                        className="px-4 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold transition"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-6 py-2.5 bg-[#d4ff24] hover:bg-[#bfee10] text-[#030407] rounded-xl text-xs font-black shadow-sm transition cursor-pointer disabled:opacity-50 active:scale-95"
                                    >
                                        Save changes
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Right Column: TASK SUMMARY & Tip Cards (1/3 width) */}
                    <div className="space-y-5">
                        {/* TASK SUMMARY Card with Blue Top Border */}
                        <div className="bg-white rounded-2xl border-t-4 border-[#1568c9] border-x border-b border-slate-200/80 p-6 shadow-sm space-y-4">
                            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                TASK SUMMARY
                            </p>

                            {/* Assignee Row */}
                            <div className="flex items-center space-x-3 py-1">
                                <div className={`w-10 h-10 rounded-full ${assigneeAvatar.bg} ${assigneeAvatar.text} font-black text-xs flex items-center justify-center shrink-0 shadow-xs`}>
                                    {assigneeAvatar.initials}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-slate-900 leading-tight truncate">
                                        {currentAssignee ? currentAssignee.name : 'Unassigned'}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        {currentAssignee ? 'Currently assigned' : 'No employee assigned'}
                                    </p>
                                </div>
                            </div>

                            {/* Key-Value Breakdown */}
                            <div className="border-t border-slate-100 pt-3 space-y-3">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-500 font-medium">Status</span>
                                    {data.status === 'completed' && (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-black bg-[#d4ff24] text-[#030407]">
                                            Completed
                                        </span>
                                    )}
                                    {data.status === 'in_progress' && (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#dbeafe] text-[#1e40af]">
                                            In Progress
                                        </span>
                                    )}
                                    {data.status === 'pending' && (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#fef3c7] text-[#92400e]">
                                            Pending
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-500 font-medium">Due</span>
                                    <span className="font-bold text-slate-900">{formatDueDisplay(data.due_date)}</span>
                                </div>

                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-500 font-medium">Created by</span>
                                    <span className="font-black text-xs text-[#030407]">
                                        {task?.creator?.name || user?.name || 'admin'}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-500 font-medium">Created at</span>
                                    <span className="font-black text-xs text-[#030407]">
                                        {formatCreatedDate(task?.created_at)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Tip Card */}
                        <div className="bg-[#030407] rounded-2xl p-5 text-white shadow-sm space-y-2">
                            <p className="text-sm font-black text-white">Tip</p>
                            <p className="text-xs text-slate-300 leading-relaxed">
                                Reassigning a task or changing its status is saved right away for the employee.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
