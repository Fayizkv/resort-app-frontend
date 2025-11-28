import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
    const { user, menus, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <nav className="bg-blue-600 p-4 text-white">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-xl font-bold">Resort Booking</div>
                <div className="flex space-x-4">
                    {menus.map((menu) => (
                        <Link key={menu.path} to={menu.path} className="hover:text-blue-200">
                            {menu.label}
                        </Link>
                    ))}
                    <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
