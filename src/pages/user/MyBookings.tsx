import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';

interface Booking {
    _id: string;
    resort: {
        name: string;
        image: string;
    };
    checkInDate: string;
    checkOutDate: string;
    status: string;
    numberOfGuests: number;
}

const MyBookings: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axiosInstance.get('/bookings/my');
                setBookings(response.data.data);
            } catch (error) {
                console.error('Error fetching bookings', error);
            }
        };
        fetchBookings();
    }, []);

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
            <div className="space-y-4">
                {bookings.map((booking) => (
                    <div key={booking._id} className="bg-white p-4 rounded shadow flex items-center gap-4">
                        <img src={booking.resort.image} alt={booking.resort.name} className="w-24 h-24 object-cover rounded" />
                        <div className="flex-1">
                            <h3 className="text-xl font-bold">{booking.resort.name}</h3>
                            <p className="text-gray-600">
                                {new Date(booking.checkInDate).toLocaleDateString()} - {new Date(booking.checkOutDate).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-500">Guests: {booking.numberOfGuests}</p>
                        </div>
                        <div>
                            <span className={`px-3 py-1 rounded text-white ${booking.status === 'confirmed' ? 'bg-green-500' :
                                    booking.status === 'cancelled' ? 'bg-red-500' : 'bg-yellow-500'
                                }`}>
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                        </div>
                    </div>
                ))}
                {bookings.length === 0 && <p className="text-gray-500">No bookings found.</p>}
            </div>
        </div>
    );
};

export default MyBookings;
