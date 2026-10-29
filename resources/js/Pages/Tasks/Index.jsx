import { usePage, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import AppLayout from '@/Layouts/AppLayout';

export default function Index({ tasks = [], employees = [], isAdmin = false }) {
    const { auth } = usePage().props;

    const urlParams = new URLSearchParams(window.location.search);
    const initialEmployeeFilter = urlParams.get('employee_id') || 'all';

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [employeeFilter, setEmployeeFilter] = useState(initialEmployeeFilter);

    useEffect(() => {
        const param = new URLSearchParams(window.location.search).get('employee_id');
        if (param) {
            setEmployeeFilter(param);
        }
    }, []);

    const getNormalizedStatus = (status) => {
        if (!status) return 'pending';
        return status.toLowerCase().replace(' ', '_');
    };

    const getNormalizedPriority = (priority) => {
        if (!priority) return 'medium';
        return priority.toLowerCase();
    };

    // Calculate statistics
    const totalTasks = tasks.length;
    const pendingTasks = tasks.filter(t => getNormalizedStatus(t.status) === 'pending').length;
    const inProgressTasks = tasks.filter(t => getNormalizedStatus(t.status) === 'in_progress').length;
    const completedTasks = tasks.filter(t => getNormalizedStatus(t.status) === 'completed').length;
    const unassignedTasks = tasks.filter(t => !t.assigned_to).length;

    // Progress percentage
    const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Filter tasks
    const filteredTasks = tasks.filter(task => {
        const normStatus = getNormalizedStatus(task.status);
        const normPriority = getNormalizedPriority(task.priority);

        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase().trim());
        const matchesStatus = statusFilter === 'all' || normStatus === statusFilter;
        const matchesPriority = priorityFilter === 'all' || normPriority === priorityFilter;

        let matchesEmployee = true;
        if (isAdmin && employeeFilter !== 'all') {
            if (employeeFilter === 'unassigned') {
                matchesEmployee = !task.assigned_to;
            } else {
                matchesEmployee = task.assigned_to && String(task.assigned_to) === String(employeeFilter);
            }
        }

        return matchesSearch && matchesStatus && matchesPriority && matchesEmployee;
    });

    const getStatusBadge = (status) => {
        const norm = getNormalizedStatus(status);
        if (norm === 'in_progress') {
            return (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#dbeafe] text-[#1e40af]">
                    In progress
                </span>
            );
        }
        if (norm === 'completed') {
            return (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black bg-[#d4ff24] text-[#030407]">
                    Completed
                </span>
            );
        }
        return (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#fef3c7] text-[#92400e]">
                Pending
            </span>
        );
    };

    const getPriorityLabel = (priority) => {
        const norm = getNormalizedPriority(priority);
        if (norm === 'high') {
            return <span className="text-rose-600 font-extrabold text-xs uppercase tracking-wider">HIGH</span>;
        }
        if (norm === 'low') {
            return <span className="text-slate-500 font-bold text-xs uppercase tracking-wider">LOW</span>;
        }
        return <span className="text-[#92400e] font-extrabold text-xs uppercase tracking-wider">MEDIUM</span>;
    };

    const formatDueInfo = (dateString) => {
        if (!dateString) return { date: '-', isTomorrow: false };
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return { date: dateString, isTomorrow: false };

        const formatted = date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });

        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const isTomorrow = date.toDateString() === tomorrow.toDateString();

        return { date: formatted, isTomorrow };
    };

    const getEmployeeAvatar = (name) => {
        if (!name) return { initials: 'U', bg: 'bg-slate-900', text: 'text-white' };
        const parts = name.trim().split(' ');
        const initials = (parts.length >= 2 ? parts[0][0] + parts[1][0] : name.substring(0, 2)).toUpperCase();

        if (initials === 'AS' || name.toLowerCase().includes('amit')) {
            return { initials, bg: 'bg-[#d4ff24]', text: 'text-[#030407]' };
        }
        if (initials === 'PV' || name.toLowerCase().includes('priya')) {
            return { initials, bg: 'bg-[#1568c9]', text: 'text-white' };
        }
        if (initials === 'RS' || name.toLowerCase().includes('rahul')) {
            return { initials, bg: 'bg-[#030407]', text: 'text-white' };
        }
        return { initials, bg: 'bg-[#1568c9]', text: 'text-white' };
    };

    const handleComplete = (task) => {
        router.patch(`/tasks/${task.id}`, {
            title: task.title,
            description: task.description,
            status: 'completed',
            priority: getNormalizedPriority(task.priority),
            due_date: task.due_date ? task.due_date.substring(0, 10) : null,
            assigned_to: task.assigned_to,
        });
    };

    const handleDelete = (taskId) => {
        if (confirm('Delete this task?')) {
            router.delete(`/tasks/${taskId}`);
        }
    };

    return (
        <AppLayout currentTab="dashboard">
            <div className="p-8 lg:p-10 max-w-7xl w-full mx-auto space-y-6">
                {/* Header & New Task Button */}
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-black text-[#030407] tracking-tight">
                            {isAdmin ? 'All tasks' : 'Dashboard'}
                        </h1>
                        <p className="text-xs font-medium text-slate-500 mt-1">
                            {isAdmin ? 'Manage, assign and track team progress' : 'Your personal task overview and status'}
                        </p>
                    </div>

                    <Link
                        href="/tasks/create"
                        className="inline-flex items-center px-4 py-2.5 bg-[#d4ff24] hover:bg-[#c2ed14] text-[#030407] text-xs font-black rounded-xl shadow-sm transition active:scale-95"
                    >
                        <span className="mr-1.5 text-base leading-none font-black">+</span>
                        {isAdmin ? 'Create and assign task' : 'New task'}
                    </Link>
                </div>

                {/* Team Progress Hero Banner (Cobalt Navy Blue) */}
                <div className="bg-gradient-to-r from-[#0c357a] to-[#124599] rounded-2xl p-6 text-white shadow-md">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <div>
                            <p className="text-[11px] font-bold text-blue-200 uppercase tracking-widest">
                                {isAdmin ? 'TEAM PROGRESS' : 'YOUR PROGRESS'}
                            </p>
                            <div className="flex items-baseline space-x-3 mt-1">
                                <span className="text-4xl font-black text-white tracking-tight">
                                    {progressPercent}%
                                </span>
                                <span className="text-sm font-semibold text-blue-200">
                                    done · {completedTasks} of {totalTasks} tasks
                                </span>
                            </div>
                        </div>

                        {isAdmin && unassignedTasks > 0 && (
                            <div className="flex items-center space-x-3">
                                <span className="bg-[#d4ff24] text-[#030407] font-black text-xs px-3.5 py-1.5 rounded-full shadow-sm">
                                    {unassignedTasks} tasks need an owner
                                </span>
                                <button
                                    onClick={() => setEmployeeFilter('unassigned')}
                                    className="bg-white hover:bg-slate-100 text-[#030407] font-extrabold text-xs px-4 py-2 rounded-xl transition shadow-sm cursor-pointer"
                                >
                                    Assign now
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Progress Bar Track */}
                    <div className="w-full bg-[#082352] h-2.5 rounded-full overflow-hidden">
                        <div
                            className="bg-[#d4ff24] h-2.5 rounded-full transition-all duration-500 shadow-sm"
                            style={{ width: `${progressPercent}%` }}
                        ></div>
                    </div>
                </div>

                {/* 4 Stat Cards with Top Colored Borders */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {/* Total Tasks */}
                    <div className="bg-white rounded-2xl border-t-4 border-[#030407] border-x border-b border-slate-200/80 p-5 shadow-sm">
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">TOTAL TASKS</p>
                        <p className="text-3xl font-black text-[#030407] mt-3">{totalTasks}</p>
                    </div>

                    {/* Pending */}
                    <div className="bg-white rounded-2xl border-t-4 border-amber-500 border-x border-b border-slate-200/80 p-5 shadow-sm">
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">PENDING</p>
                        <p className="text-3xl font-black text-[#030407] mt-3">{pendingTasks}</p>
                    </div>

                    {/* In Progress */}
                    <div className="bg-white rounded-2xl border-t-4 border-[#1568c9] border-x border-b border-slate-200/80 p-5 shadow-sm">
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">IN PROGRESS</p>
                        <p className="text-3xl font-black text-[#030407] mt-3">{inProgressTasks}</p>
                    </div>

                    {/* Completed */}
                    <div className="bg-white rounded-2xl border-t-4 border-[#d4ff24] border-x border-b border-slate-200/80 p-5 shadow-sm">
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">COMPLETED</p>
                        <p className="text-3xl font-black text-[#030407] mt-3">{completedTasks}</p>
                    </div>
                </div>

                {/* Filters Row: Filter Capsules + Search + Dropdowns */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
                    {/* Status Filter Capsules */}
                    <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                        <button
                            onClick={() => setStatusFilter('all')}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                                statusFilter === 'all'
                                    ? 'bg-[#030407] text-white shadow-sm'
                                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                        >
                            All {totalTasks}
                        </button>
                        <button
                            onClick={() => setStatusFilter('pending')}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                                statusFilter === 'pending'
                                    ? 'bg-[#030407] text-white shadow-sm'
                                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                        >
                            Pending {pendingTasks}
                        </button>
                        <button
                            onClick={() => setStatusFilter('in_progress')}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                                statusFilter === 'in_progress'
                                    ? 'bg-[#030407] text-white shadow-sm'
                                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                        >
                            In progress {inProgressTasks}
                        </button>
                        <button
                            onClick={() => setStatusFilter('completed')}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                                statusFilter === 'completed'
                                    ? 'bg-[#030407] text-white shadow-sm'
                                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                        >
                            Completed {completedTasks}
                        </button>
                    </div>

                    {/* Search & Select Controls */}
                    <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                        <input
                            type="text"
                            placeholder="Search by title..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#1568c9]/20 focus:border-[#1568c9] transition min-w-[200px]"
                        />

                        <select
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                            className="px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#1568c9]/20 focus:border-[#1568c9] transition bg-white"
                        >
                            <option value="all">All priorities</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>

                        {isAdmin && (
                            <select
                                value={employeeFilter}
                                onChange={(e) => setEmployeeFilter(e.target.value)}
                                className="px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#1568c9]/20 focus:border-[#1568c9] transition bg-white"
                            >
                                <option value="all">All employees</option>
                                <option value="unassigned">Unassigned</option>
                                {employees.map(emp => (
                                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                                ))}
                            </select>
                        )}
                    </div>
                </div>

                {/* Tasks Table */}
                <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
                    {filteredTasks.length === 0 ? (
                        <div className="p-12 text-center text-slate-500">
                            <p className="text-sm font-semibold">No tasks found matching your filters.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-white">
                                        <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                            TITLE
                                        </th>
                                        {isAdmin && (
                                            <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                                ASSIGNED TO
                                            </th>
                                        )}
                                        <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                            STATUS
                                        </th>
                                        <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                            PRIORITY
                                        </th>
                                        <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                            DUE
                                        </th>
                                        <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                            ACTIONS
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredTasks.map((task) => {
                                        const isCompleted = getNormalizedStatus(task.status) === 'completed';
                                        const dueInfo = formatDueInfo(task.due_date);
                                        const avatar = getEmployeeAvatar(task.assignee?.name);

                                        return (
                                            <tr key={task.id} className="hover:bg-slate-50/70 transition">
                                                {/* Title */}
                                                <td className="px-6 py-4.5 max-w-xs">
                                                    <p className="text-sm font-extrabold text-[#030407] leading-snug">{task.title}</p>
                                                    {task.description && (
                                                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{task.description}</p>
                                                    )}
                                                </td>

                                                {/* Assigned to */}
                                                {isAdmin && (
                                                    <td className="px-6 py-4.5 whitespace-nowrap">
                                                        {task.assignee ? (
                                                            <div className="flex items-center space-x-2.5">
                                                                <div className={`w-7 h-7 rounded-full ${avatar.bg} ${avatar.text} font-black text-[10px] flex items-center justify-center shrink-0`}>
                                                                    {avatar.initials}
                                                                </div>
                                                                <span className="text-xs font-bold text-slate-800">
                                                                    {task.assignee.name}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <Link
                                                                href={`/tasks/${task.id}/edit`}
                                                                className="inline-flex items-center space-x-1 px-3 py-1 border border-dashed border-slate-300 hover:border-[#1568c9] text-slate-600 hover:text-[#1568c9] text-xs font-bold rounded-lg transition"
                                                            >
                                                                <span>+ Assign</span>
                                                            </Link>
                                                        )}
                                                    </td>
                                                )}

                                                {/* Status */}
                                                <td className="px-6 py-4.5 whitespace-nowrap">
                                                    {getStatusBadge(task.status)}
                                                </td>

                                                {/* Priority */}
                                                <td className="px-6 py-4.5 whitespace-nowrap">
                                                    {getPriorityLabel(task.priority)}
                                                </td>

                                                {/* Due Date */}
                                                <td className="px-6 py-4.5 whitespace-nowrap">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-semibold text-slate-700">
                                                            {dueInfo.date}
                                                        </span>
                                                        {dueInfo.isTomorrow && (
                                                            <span className="bg-amber-50 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-md inline-block w-fit mt-0.5">
                                                                Tomorrow
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Actions */}
                                                <td className="px-6 py-4.5 whitespace-nowrap">
                                                    <div className="flex items-center space-x-2">
                                                        {!isCompleted && (
                                                            <button
                                                                onClick={() => handleComplete(task)}
                                                                className="text-xs font-bold px-3 py-1.5 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg transition cursor-pointer"
                                                            >
                                                                Complete
                                                            </button>
                                                        )}
                                                        <Link
                                                            href={`/tasks/${task.id}/edit`}
                                                            className="text-xs font-bold px-3 py-1.5 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg transition inline-block"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(task.id)}
                                                            className="text-xs font-bold px-3 py-1.5 border border-slate-300 text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
