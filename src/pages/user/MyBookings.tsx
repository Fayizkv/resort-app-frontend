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
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchBookings(page);
    }, [page]);

    const fetchBookings = async (pageNum: number) => {
        try {
            const limit = 5;
            const skip = (pageNum - 1) * limit;
            const response = await axiosInstance.get(`/bookings/my?limit=${limit}&skip=${skip}`);
            setBookings(response.data.data);
            setTotalPages(response.data.pagination.pages);
        } catch (error) {
            console.error('Error fetching bookings', error);
        }
    };

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
            <div className="space-y-4 mb-8">
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

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center space-x-2">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition"
                    >
                        Previous
                    </button>
                    <span className="px-4 py-2 text-gray-700">Page {page} of {totalPages}</span>
                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default MyBookings;
