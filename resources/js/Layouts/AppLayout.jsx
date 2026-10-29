import { Link, usePage } from '@inertiajs/react';

export default function AppLayout({ children, currentTab = 'dashboard' }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const isAdmin = user?.role === 'admin';

    // Get initials for user avatar
    const getInitials = (name) => {
        if (!name) return 'U';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    return (
        <div className="flex h-full w-full overflow-hidden bg-[#f4f6fa]">
            {/* 
              FIXED Left Sidebar (Midnight Black #030407)
              - Fixed h-full with zero page scroll
              - Pinned bottom section so user & Log out are ALWAYS visible without scrolling
            */}
            <aside className="w-64 h-full bg-[#030407] text-white flex flex-col justify-between shrink-0 border-r border-slate-900 select-none z-50">
                <div className="flex flex-col">
                    {/* Brand Header */}
                    <div className="px-6 py-6 flex items-center space-x-3">
                        <span className="w-3 h-3 rounded-full bg-[#d4ff24] shadow-sm shadow-[#d4ff24]/90"></span>
                        <span className="text-lg font-black tracking-tight text-white">
                            TaskManager
                        </span>
                    </div>

                    {/* Navigation Menu */}
                    <nav className="mt-2 px-3 space-y-1.5">
                        <Link
                            href="/tasks"
                            className={`flex items-center px-4 py-3 text-sm font-bold rounded-xl transition ${
                                currentTab === 'dashboard'
                                    ? 'bg-[#141824] text-white border-l-4 border-[#d4ff24] shadow-sm'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                            }`}
                        >
                            Dashboard
                        </Link>

                        {isAdmin && (
                            <Link
                                href="/employees"
                                className={`flex items-center px-4 py-3 text-sm font-bold rounded-xl transition ${
                                    currentTab === 'employees'
                                        ? 'bg-[#141824] text-white border-l-4 border-[#d4ff24] shadow-sm'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                                }`}
                            >
                                Employees
                            </Link>
                        )}
                    </nav>
                </div>

                {/* 
                  Bottom Section Pinned to Viewport Bottom:
                  User initials avatar, name, ADMIN/EMPLOYEE pill, and Log out button
                  NEVER scrolls away!
                */}
                <div className="p-4 border-t border-slate-850 bg-[#030407] shrink-0">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center space-x-2.5 min-w-0">
                            <div className="w-8 h-8 rounded-full bg-[#d4ff24] text-[#030407] font-black text-xs flex items-center justify-center shrink-0 shadow-sm">
                                {getInitials(user?.name)}
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-bold text-white truncate leading-tight">
                                    {user?.name || 'User'}
                                </p>
                                <span className={`inline-block text-[9px] font-black uppercase px-1.5 py-0.5 rounded tracking-wider mt-0.5 ${
                                    isAdmin ? 'bg-[#1568c9] text-white' : 'bg-slate-800 text-slate-300'
                                }`}>
                                    {isAdmin ? 'ADMIN' : 'EMPLOYEE'}
                                </span>
                            </div>
                        </div>

                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="text-xs font-bold text-white border border-slate-700 hover:border-slate-500 hover:bg-slate-800 px-3 py-1.5 rounded-xl transition shrink-0 cursor-pointer"
                        >
                            Log out
                        </Link>
                    </div>
                </div>
            </aside>

            {/* 
              Scrollable Main Content Area:
              Only this container scrolls when content exceeds screen height.
            */}
            <main className="flex-1 h-full overflow-y-auto min-w-0">
                {children}
            </main>
        </div>
    );
}
