import { useForm, Link } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl shadow-slate-900/5 border border-slate-200/80 p-8">
                {/* Brand Header */}
                <div className="flex flex-col items-center justify-center mb-6">
                    <div className="w-10 h-10 rounded-xl bg-[#030407] flex items-center justify-center shadow-md shadow-[#030407]/20 mb-3">
                        <span className="w-3.5 h-3.5 rounded-sm bg-[#d4ff24] shadow-sm shadow-[#d4ff24]/50"></span>
                    </div>
                    <h2 className="text-2xl font-extrabold text-[#030407] tracking-tight">
                        Create an account
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">Register as employee</p>
                </div>

                <form className="space-y-4" onSubmit={submit}>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                            Name
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className={`w-full px-3.5 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1568c9]/20 focus:border-[#1568c9] transition ${
                                errors.name ? 'border-red-500 bg-red-50/20' : 'border-slate-300'
                            }`}
                        />
                        {errors.name && (
                            <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.name}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                            Email
                        </label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className={`w-full px-3.5 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1568c9]/20 focus:border-[#1568c9] transition ${
                                errors.email ? 'border-red-500 bg-red-50/20' : 'border-slate-300'
                            }`}
                        />
                        {errors.email && (
                            <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.email}</p>
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
                                errors.password ? 'border-red-500 bg-red-50/20' : 'border-slate-300'
                            }`}
                        />
                        {errors.password && (
                            <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.password}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1568c9]/20 focus:border-[#1568c9] transition"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-[#1568c9] hover:bg-[#10529e] shadow-md shadow-[#1568c9]/25 transition cursor-pointer mt-2 disabled:opacity-50 active:scale-[0.99]"
                    >
                        Register
                    </button>

                    <p className="text-center text-xs text-slate-500 pt-3">
                        Already have an account?{' '}
                        <Link href="/login" className="font-bold text-[#1568c9] hover:underline">
                            Log in
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
