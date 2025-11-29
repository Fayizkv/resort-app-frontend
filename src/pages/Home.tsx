import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useLocation, useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const resort = location.state?.resort;

    const [formData, setFormData] = useState({
        checkInDate: '',
        checkOutDate: '',
        numberOfGuests: 1,
    });
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!resort) {
            // If no resort selected, redirect to resort list
            // But wait, the requirement says "user should be able to see the list of resorts and be able to book"
            // So Home might just be the booking form for a specific resort.
            // If accessed directly, maybe show a message or redirect.
            // Let's assume this page is now /book
        }
    }, [resort]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!resort) return;

        try {
            await axiosInstance.post('/bookings', {
                ...formData,
                resort: resort._id,
            });
            setMessage('Booking successful!');
            setTimeout(() => navigate('/my-bookings'), 2000);
        } catch (error) {
            setMessage('Error creating booking.');
        }
    };

    if (!resort) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-white">
                <p className="text-xl mb-4">Please select a resort to book.</p>
                <button
                    onClick={() => navigate('/resorts')}
                    className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-xl backdrop-blur-sm transition-all border border-white/30"
                >
                    View Resorts
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-8 text-center text-white drop-shadow-md">Book {resort.name}</h1>
            {message && <p className="text-center mb-6 text-green-300 font-semibold bg-green-900/30 py-2 rounded-lg backdrop-blur-sm border border-green-500/30 max-w-lg mx-auto">{message}</p>}
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20">
                <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-white/90 mb-2 font-medium">Check-In</label>
                        <input
                            name="checkInDate"
                            type="date"
                            value={formData.checkInDate}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/20 p-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-white/90 mb-2 font-medium">Check-Out</label>
                        <input
                            name="checkOutDate"
                            type="date"
                            value={formData.checkOutDate}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/20 p-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all"
                            required
                        />
                    </div>
                </div>
                <div className="mb-6">
                    <label className="block text-white/90 mb-2 font-medium">Guests</label>
                    <input
                        name="numberOfGuests"
                        type="number"
                        min="1"
                        value={formData.numberOfGuests}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/20 p-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all"
                        required
                    />
                </div>
                <div className="mb-8 p-5 bg-white/5 rounded-xl border border-white/10">
                    <p className="font-bold text-white mb-1">Total Price Estimate</p>
                    <p className="text-sm text-blue-200">${resort.price} per night</p>
                </div>
                <button
                    type="submit"
                    className="w-full bg-white text-blue-900 font-bold p-3.5 rounded-xl hover:bg-blue-50 transition-all shadow-lg"
                >
                    Confirm Booking
                </button>
            </form>
        </div>
    );
};

export default Home;
