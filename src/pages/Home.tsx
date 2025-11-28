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
        return <div className="p-8 text-center">Please select a resort to book. <button onClick={() => navigate('/resorts')} className="text-blue-600 underline">View Resorts</button></div>;
    }

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-8 text-center">Book {resort.name}</h1>
            {message && <p className="text-center mb-4 text-green-600">{message}</p>}
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded shadow">
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-gray-700">Check-In</label>
                        <input name="checkInDate" type="date" value={formData.checkInDate} onChange={handleChange} className="w-full border p-2 rounded" required />
                    </div>
                    <div>
                        <label className="block text-gray-700">Check-Out</label>
                        <input name="checkOutDate" type="date" value={formData.checkOutDate} onChange={handleChange} className="w-full border p-2 rounded" required />
                    </div>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Guests</label>
                    <input name="numberOfGuests" type="number" min="1" value={formData.numberOfGuests} onChange={handleChange} className="w-full border p-2 rounded" required />
                </div>
                <div className="mb-6 p-4 bg-gray-50 rounded">
                    <p className="font-bold">Total Price Estimate</p>
                    <p className="text-sm text-gray-600">${resort.price} per night</p>
                </div>
                <button type="submit" className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">Confirm Booking</button>
            </form>
        </div>
    );
};

export default Home;
