import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bed, Compass, Sparkles, ArrowRight, User, Lock, X } from 'lucide-react';
import axiosInstance from '../utils/axiosInstance';
import { useAuth } from '../context/AuthContext';

interface Resort {
    _id: string;
    name: string;
    image: string;
    description: string;
}

const heroImages = [
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1920&q=80',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920&q=80',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1920&q=80',
    'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1920&q=80',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80',
    'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1920&q=80'
];

const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const { login, user } = useAuth();
    const [featuredResorts, setFeaturedResorts] = useState<Resort[]>([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    // Login Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [isLoginLoading, setIsLoginLoading] = useState(false);

    useEffect(() => {
        fetchFeaturedResorts();
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchFeaturedResorts = async () => {
        try {
            const response = await axiosInstance.get('/resorts?limit=3');
            setFeaturedResorts(response.data.data);
        } catch (error) {
            console.error('Error fetching resorts', error);
        }
    };

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoginLoading(true);
        setLoginError('');
        try {
            const menus = await login(email, password);
            setIsLoginModalOpen(false);
            if (menus && menus.length > 0) {
                navigate(menus[0].path);
            } else {
                navigate('/');
            }
        } catch (err) {
            setLoginError('Invalid credentials');
        } finally {
            setIsLoginLoading(false);
        }
    };

    return (
        <div className="min-h-screen text-white relative">
            {/* Background Slider */}
            <div className="fixed inset-0 -z-10">
                {heroImages.map((img, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
                        style={{ backgroundImage: `url('${img}')` }}
                    />
                ))}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
            </div>

            {/* Login Button (Top Right) - Only show if not logged in */}
            {!user && (
                <div className="absolute top-6 right-6 z-20">
                    <button
                        onClick={() => setIsLoginModalOpen(true)}
                        className="bg-white/20 hover:bg-white/30 text-white px-6 py-2.5 rounded-full font-semibold backdrop-blur-md border border-white/20 transition-all shadow-lg"
                    >
                        Login
                    </button>
                </div>
            )}

            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center text-center px-4">
                <div className="max-w-4xl mx-auto z-10">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg animate-fade-in-up">
                        Paradise Resorts
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 text-white/90 drop-shadow-md max-w-2xl mx-auto">
                        Experience the ultimate escape where luxury meets nature. Your journey to relaxation begins here.
                    </p>
                    <button
                        onClick={() => navigate('/resorts')}
                        className="bg-white text-blue-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition-all transform hover:scale-105 shadow-xl flex items-center mx-auto gap-2"
                    >
                        Book Now <ArrowRight size={20} />
                    </button>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-20 px-4 bg-black/20 backdrop-blur-sm">
                <div className="container mx-auto">
                    <h2 className="text-4xl font-bold text-center mb-16 drop-shadow-md">Our Services</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Accommodation */}
                        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 hover:bg-white/20 transition-all text-center group">
                            <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                <Bed size={32} className="text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Luxury Accommodation</h3>
                            <p className="text-white/70">
                                Stay in our premium suites and villas designed for comfort and elegance, offering breathtaking views.
                            </p>
                        </div>

                        {/* Adventure */}
                        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 hover:bg-white/20 transition-all text-center group">
                            <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                <Compass size={32} className="text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Adventure Activities</h3>
                            <p className="text-white/70">
                                Explore nature with guided tours, hiking, water sports, and thrilling outdoor experiences.
                            </p>
                        </div>

                        {/* Wellness */}
                        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 hover:bg-white/20 transition-all text-center group">
                            <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                <Sparkles size={32} className="text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Wellness & Spa</h3>
                            <p className="text-white/70">
                                Rejuvenate your mind and body with our world-class spa treatments, yoga sessions, and wellness programs.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Gallery Section */}
            <section className="py-20 px-4">
                <div className="container mx-auto">
                    <h2 className="text-4xl font-bold text-center mb-16 drop-shadow-md">Gallery & Featured Resorts</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {featuredResorts.map((resort) => (
                            <div
                                key={resort._id}
                                className="group relative overflow-hidden rounded-2xl aspect-[4/3] cursor-pointer shadow-2xl"
                                onClick={() => navigate('/resorts')}
                            >
                                <img
                                    src={resort.image}
                                    alt={resort.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                    <h3 className="text-2xl font-bold">{resort.name}</h3>
                                    <p className="text-white/80 line-clamp-2">{resort.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-12">
                        <button
                            onClick={() => navigate('/resorts')}
                            className="border border-white/30 bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-full font-semibold backdrop-blur-sm transition-all"
                        >
                            View All Resorts
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-black/40 backdrop-blur-md py-12 text-white/80">
                <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-4">Paradise Resorts</h3>
                        <p className="text-sm">
                            Creating unforgettable memories in the heart of nature.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Resorts</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Services</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-4">Contact Us</h4>
                        <ul className="space-y-2 text-sm">
                            <li>123 Resort Drive, Paradise City</li>
                            <li>+1 (555) 123-4567</li>
                            <li>info@paradiseresorts.com</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-4">Newsletter</h4>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 w-full focus:outline-none focus:border-white/50"
                            />
                            <button className="bg-white text-blue-900 px-4 py-2 rounded-lg font-bold hover:bg-blue-50 transition-colors">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>
                <div className="border-t border-white/10 mt-12 pt-8 text-center text-sm">
                    <p>&copy; 2025 Paradise Resorts. All rights reserved.</p>
                </div>
            </footer>

            {/* Login Modal */}
            {isLoginModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setIsLoginModalOpen(false)}>
                    <div
                        className="relative z-10 bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-96 border border-white/20"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setIsLoginModalOpen(false)}
                            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <div className="flex justify-center mb-6">
                            <div className="bg-white/20 p-3 rounded-full">
                                <ArrowRight className="text-white w-6 h-6" />
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold mb-2 text-center text-white">Welcome Back</h2>

                        {loginError && (
                            <div className="bg-red-500/80 text-white p-3 rounded-lg mb-4 text-sm text-center backdrop-blur-sm">
                                {loginError}
                            </div>
                        )}

                        <form onSubmit={handleLoginSubmit} className="space-y-5">
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
                                disabled={isLoginLoading}
                                className="w-full bg-white text-blue-900 font-bold py-3 px-4 rounded-xl hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-blue-900 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg"
                            >
                                {isLoginLoading ? 'Signing in...' : 'Sign In'}
                            </button>
                        </form>

                        <div className="absolute bottom-4 left-0 right-0 text-center text-white/40 text-xs">
                            © 2024 Resort Management System
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LandingPage;
