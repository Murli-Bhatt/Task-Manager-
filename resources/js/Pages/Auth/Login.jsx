import { useForm, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Login() {
    const pageProps = usePage().props;
    const [selectedRole, setSelectedRole] = useState('employee');

    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        role: 'employee',
    });

    const handleRoleChange = (role) => {
        setSelectedRole(role);
        setData('role', role);
    };

    const submit = (e) => {
        e.preventDefault();
        post('/login');
    };

    const combinedErrors = { ...(pageProps.errors || {}), ...errors };
    const authErrorMessage = combinedErrors.role || combinedErrors.email || combinedErrors.password;

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl shadow-slate-900/5 border border-slate-200/80 p-8">
                {/* Brand Header */}
                <div className="flex flex-col items-center justify-center mb-6">
                    <div className="w-10 h-10 rounded-xl bg-[#030407] flex items-center justify-center shadow-md shadow-[#030407]/20 mb-3">
                        <span className="w-3.5 h-3.5 rounded-sm bg-[#d4ff24] shadow-sm shadow-[#d4ff24]/50"></span>
                    </div>
                    <h2 className="text-2xl font-extrabold text-[#030407] tracking-tight">
                        Log in to TaskManager
                    </h2>
                </div>

                {/* Role Switcher Toggle */}
                <div className="bg-slate-100 p-1 rounded-xl flex space-x-1 mb-4 border border-slate-200">
                    <button
                        type="button"
                        onClick={() => handleRoleChange('employee')}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                            selectedRole === 'employee'
                                ? 'bg-[#030407] text-[#d4ff24] shadow-sm'
                                : 'text-slate-600 hover:text-[#030407]'
                        }`}
                    >
                        Employee
                    </button>
                    <button
                        type="button"
                        onClick={() => handleRoleChange('admin')}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                            selectedRole === 'admin'
                                ? 'bg-[#030407] text-[#d4ff24] shadow-sm'
                                : 'text-slate-600 hover:text-[#030407]'
                        }`}
                    >
                        Admin
                    </button>
                </div>

                <p className="text-xs text-slate-500 mb-5 text-center">
                    Logging in as <span className="font-bold text-[#1568c9]">{selectedRole === 'admin' ? 'Admin' : 'Employee'}</span>
                </p>

                {/* Error Banner Line */}
                {authErrorMessage && (
                    <div className="mb-5 p-3.5 bg-red-50 border-l-4 border-red-500 rounded-r-xl text-red-700 text-xs font-semibold flex items-center space-x-2">
                        <svg className="w-4 h-4 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span>{authErrorMessage}</span>
                    </div>
                )}

                <form className="space-y-4" onSubmit={submit}>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                            Email
                        </label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className={`w-full px-3.5 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1568c9]/20 focus:border-[#1568c9] transition ${
                                combinedErrors.email ? 'border-red-500 bg-red-50/20' : 'border-slate-300'
                            }`}
                            placeholder="amit@example.com"
                        />
                        {combinedErrors.email && (
                            <p className="mt-1.5 text-xs text-red-600 font-medium">{combinedErrors.email}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                            Password
                        </label>
                        <input
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className={`w-full px-3.5 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1568c9]/20 focus:border-[#1568c9] transition ${
                                combinedErrors.password || combinedErrors.email ? 'border-red-500 bg-red-50/20' : 'border-slate-300'
                            }`}
                        />
                        {combinedErrors.password && (
                            <p className="mt-1.5 text-xs text-red-600 font-medium">{combinedErrors.password}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-[#1568c9] hover:bg-[#10529e] shadow-md shadow-[#1568c9]/25 transition cursor-pointer mt-2 disabled:opacity-50 active:scale-[0.99]"
                    >
                        Log in
                    </button>

                    <p className="text-center text-xs text-slate-500 pt-3">
                        No account?{' '}
                        <Link href="/register" className="font-bold text-[#1568c9] hover:underline">
                            Register as employee
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
