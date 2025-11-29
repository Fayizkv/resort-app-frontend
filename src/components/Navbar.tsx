import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, LogOut, ChevronDown } from 'lucide-react';

const Navbar: React.FC = () => {
    const { user, menus, logout } = useAuth();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!user) return null;

    return (
        <nav className="bg-white/10 backdrop-blur-md border-b border-white/20 p-4 text-white sticky top-0 z-50">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-xl font-bold tracking-wide">Resort Booking</div>
                <div className="flex items-center space-x-6">
                    <div className="flex space-x-4">
                        {menus.map((menu) => (
                            <Link key={menu.path} to={menu.path} className="hover:text-blue-200 transition-colors">
                                {menu.label}
                            </Link>
                        ))}
                    </div>

                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-full transition-all border border-white/10 focus:outline-none"
                        >
                            <div className="bg-blue-500/80 p-1.5 rounded-full">
                                <User className="w-4 h-4 text-white" />
                            </div>
                            <ChevronDown className={`w-4 h-4 text-white/70 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 overflow-hidden transform origin-top-right transition-all animate-fade-in-down">
                                <div className="p-4 border-b border-gray-100">
                                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Signed in as</p>
                                    <p className="text-sm font-medium text-gray-800 truncate" title={user.email}>{user.email}</p>
                                </div>
                                <div className="p-2">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
