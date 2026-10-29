import { Link, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function Employees({ employees = [] }) {
    const { auth } = usePage().props;

    // Calculate aggregated stats across all employees
    const totalEmployees = employees.length;
    const openTasks = employees.reduce((sum, emp) => sum + (emp.pending_count + emp.in_progress_count), 0);
    const completedTasks = employees.reduce((sum, emp) => sum + emp.completed_count, 0);

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

    return (
        <AppLayout currentTab="employees">
            <div className="p-8 lg:p-10 max-w-7xl w-full mx-auto space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-black text-[#030407] tracking-tight">Employees</h1>
                    <p className="text-xs font-medium text-slate-500 mt-1">
                        Team workload and individual progress
                    </p>
                </div>

                {/* Top 3 Stat Cards with Colored Top Borders */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Employees Card */}
                    <div className="bg-white rounded-2xl border-t-4 border-[#030407] border-x border-b border-slate-200/80 p-6 shadow-sm">
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">EMPLOYEES</p>
                        <p className="text-3xl font-black text-[#030407] mt-3">{totalEmployees}</p>
                    </div>

                    {/* Open Tasks Card */}
                    <div className="bg-white rounded-2xl border-t-4 border-amber-500 border-x border-b border-slate-200/80 p-6 shadow-sm">
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">OPEN TASKS</p>
                        <p className="text-3xl font-black text-[#030407] mt-3">{openTasks}</p>
                    </div>

                    {/* Completed Card */}
                    <div className="bg-white rounded-2xl border-t-4 border-[#d4ff24] border-x border-b border-slate-200/80 p-6 shadow-sm">
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">COMPLETED</p>
                        <p className="text-3xl font-black text-[#030407] mt-3">{completedTasks}</p>
                    </div>
                </div>

                {/* Employee Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {employees.map((emp) => {
                        const avatar = getEmployeeAvatar(emp.name);
                        const total = emp.total_count || 0;
                        const percent = total > 0 ? Math.round((emp.completed_count / total) * 100) : 0;

                        const pendingWidth = total > 0 ? (emp.pending_count / total) * 100 : 0;
                        const inProgressWidth = total > 0 ? (emp.in_progress_count / total) * 100 : 0;
                        const completedWidth = total > 0 ? (emp.completed_count / total) * 100 : 0;

                        return (
                            <div
                                key={emp.id}
                                className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                            >
                                <div>
                                    {/* Top Profile Row & Completion % */}
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-10 h-10 rounded-full ${avatar.bg} ${avatar.text} font-black text-xs flex items-center justify-center shrink-0 shadow-sm`}>
                                                {avatar.initials}
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-extrabold text-[#030407] leading-snug">
                                                    {emp.name}
                                                </h3>
                                                <p className="text-xs text-slate-400 mt-0.5">
                                                    {emp.email}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <span className="text-2xl font-black text-[#030407] tracking-tight">
                                                {percent}%
                                            </span>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                done
                                            </p>
                                        </div>
                                    </div>

                                    {/* Multi-segment Progress Bar */}
                                    <div className="w-full h-2 rounded-full overflow-hidden flex bg-slate-100 my-4.5">
                                        {pendingWidth > 0 && (
                                            <div
                                                className="bg-amber-500 h-full"
                                                style={{ width: `${pendingWidth}%` }}
                                            ></div>
                                        )}
                                        {inProgressWidth > 0 && (
                                            <div
                                                className="bg-[#1568c9] h-full"
                                                style={{ width: `${inProgressWidth}%` }}
                                            ></div>
                                        )}
                                        {completedWidth > 0 && (
                                            <div
                                                className="bg-[#d4ff24] h-full"
                                                style={{ width: `${completedWidth}%` }}
                                            ></div>
                                        )}
                                    </div>

                                    {/* Task Counts Summary */}
                                    <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-6">
                                        <span><strong className="text-slate-900">{emp.pending_count}</strong> pending</span>
                                        <span><strong className="text-slate-900">{emp.in_progress_count}</strong> in progress</span>
                                        <span><strong className="text-slate-900">{emp.completed_count}</strong> completed</span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center space-x-3 pt-2">
                                    <Link
                                        href={`/tasks?employee_id=${emp.id}`}
                                        className="flex-1 py-2.5 px-4 bg-[#030407] hover:bg-[#1a1f2c] text-white text-xs font-black rounded-xl text-center transition shadow-sm"
                                    >
                                        View tasks
                                    </Link>
                                    <Link
                                        href={`/tasks/create?assigned_to=${emp.id}`}
                                        className="flex-1 py-2.5 px-4 bg-white border border-slate-300 hover:bg-slate-50 text-[#030407] text-xs font-black rounded-xl text-center transition shadow-sm"
                                    >
                                        Assign task
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom Legend */}
                <div className="flex items-center space-x-6 pt-4 text-xs font-semibold text-slate-600">
                    <div className="flex items-center space-x-2">
                        <span className="w-3 h-3 rounded-sm bg-amber-500 inline-block"></span>
                        <span>Pending</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="w-3 h-3 rounded-sm bg-[#1568c9] inline-block"></span>
                        <span>In progress</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="w-3 h-3 rounded-sm bg-[#d4ff24] inline-block border border-slate-300"></span>
                        <span>Completed</span>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
