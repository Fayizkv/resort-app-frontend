import React, { createContext, useState, useContext, ReactNode } from 'react';
import axiosInstance from '../utils/axiosInstance';

interface User {
    id: string;
    email: string;
    role: 'admin' | 'user';
}

interface MenuItem {
    label: string;
    path: string;
}

interface AuthContextType {
    user: User | null;
    menus: MenuItem[];
    login: (email: string, password: string) => Promise<MenuItem[]>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [menus, setMenus] = useState<MenuItem[]>([]);

    const login = async (email: string, password: string) => {
        const response = await axiosInstance.post('/auth/login', { email, password });
        const { token, user, menus } = response.data;

        localStorage.setItem('token', token);
        setUser(user);
        setMenus(menus);
        return menus;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setMenus([]);
    };

    return (
        <AuthContext.Provider value={{ user, menus, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
