import React, { useEffect } from 'react';

interface ToastProps {
    message: string;
    type: 'success' | 'error' | 'info';
    onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    const bgColors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500',
    };

    return (
        <div className={`fixed top-4 right-4 ${bgColors[type]} text-white px-6 py-3 rounded shadow-lg z-50 animate-fade-in-down flex items-center`}>
            <span>{message}</span>
            <button onClick={onClose} className="ml-4 text-white font-bold focus:outline-none">
                &times;
            </button>
        </div>
    );
};

export default Toast;
