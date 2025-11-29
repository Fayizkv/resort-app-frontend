import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Lock, ArrowRight } from 'lucide-react';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const menus = await login(email, password);
            if (menus && menus.length > 0) {
                navigate(menus[0].path);
            } else {
                navigate('/');
            }
        } catch (err) {
            setError('Invalid credentials');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="relative z-10 bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-96 border border-white/20">
                <div className="flex justify-center mb-6">
                    <div className="bg-white/20 p-3 rounded-full">
                        <ArrowRight className="text-white w-6 h-6" />
                    </div>
                </div>

                <h2 className="text-3xl font-bold mb-2 text-center text-white">Welcome Back</h2>
                {/* <p className="text-center text-white/80 mb-8 text-sm">Sign in to manage your resort</p> */}

                {error && (
                    <div className="bg-red-500/80 text-white p-3 rounded-lg mb-4 text-sm text-center backdrop-blur-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-white/60" />
                        </div>
                        <input
                            type="email"
                            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent transition-all"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-white/60" />
                        </div>
                        <input
                            type="password"
                            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent transition-all"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-white text-blue-900 font-bold py-3 px-4 rounded-xl hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-blue-900 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg"
                    >
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                {/* <div className="mt-6 text-center">
                    <a href="#" className="text-sm text-white/70 hover:text-white transition-colors">
                        Forgot your password?
                    </a>
                </div> */}
            </div>

            <div className="absolute bottom-4 text-white/40 text-xs">
                © 2024 Resort Management System
            </div>
        </div>
    );
};

export default Login;
