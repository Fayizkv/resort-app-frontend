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
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        fetchBookings(page, statusFilter);
    }, [page, statusFilter]);

    const fetchBookings = async (pageNum: number, status: string) => {
        try {
            const limit = 5;
            const skip = (pageNum - 1) * limit;
            const response = await axiosInstance.get(`/bookings/my?limit=${limit}&skip=${skip}&status=${status}`);
            setBookings(response.data.data);
            setTotalPages(response.data.pagination.pages);
        } catch (error) {
            console.error('Error fetching bookings', error);
        }
    };

    return (
        <div className="container mx-auto p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white drop-shadow-md">My Bookings</h1>
                <select
                    value={statusFilter}
                    onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setPage(1);
                    }}
                    className="bg-white/20 text-white border border-white/30 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                >
                    <option value="all" className="text-gray-800">All Statuses</option>
                    <option value="pending" className="text-gray-800">Pending</option>
                    <option value="confirmed" className="text-gray-800">Confirmed</option>
                    <option value="cancelled" className="text-gray-800">Cancelled</option>
                </select>
            </div>
            <div className="space-y-6 mb-10">
                {bookings.map((booking) => (
                    <div key={booking._id} className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl shadow-xl flex items-center gap-6 hover:bg-white/15 transition-all">
                        <img src={booking.resort.image} alt={booking.resort.name} className="w-28 h-28 object-cover rounded-xl shadow-md" />
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-white mb-1">{booking.resort.name}</h3>
                            <p className="text-blue-200 mb-2">
                                {new Date(booking.checkInDate).toLocaleDateString()} - {new Date(booking.checkOutDate).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-white/70">Guests: {booking.numberOfGuests}</p>
                        </div>
                        <div>
                            <span className={`px-4 py-1.5 rounded-full text-white text-sm font-medium backdrop-blur-sm shadow-sm ${booking.status === 'confirmed' ? 'bg-green-500/80' :
                                booking.status === 'cancelled' ? 'bg-red-500/80' : 'bg-yellow-500/80'
                                }`}>
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                        </div>
                    </div>
                ))}
                {bookings.length === 0 && <p className="text-white/60 text-center py-8 bg-white/5 rounded-xl border border-white/10">No bookings found.</p>}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className={`px-4 py-2 rounded-lg backdrop-blur-sm transition-all ${page === 1 ? 'bg-white/5 text-white/30 cursor-not-allowed' : 'bg-white/20 text-white hover:bg-white/30 border border-white/20'}`}
                    >
                        Previous
                    </button>

                    {/* Page Numbers */}
                    <div className="flex space-x-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                            <button
                                key={pageNum}
                                onClick={() => setPage(pageNum)}
                                className={`px-3 py-2 rounded-lg backdrop-blur-sm transition-all ${page === pageNum
                                    ? 'bg-blue-500/80 text-white border border-blue-400/50'
                                    : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                                    }`}
                            >
                                {pageNum}
                            </button>
                        ))}
                    </div>

                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                        className={`px-4 py-2 rounded-lg backdrop-blur-sm transition-all ${page === totalPages ? 'bg-white/5 text-white/30 cursor-not-allowed' : 'bg-white/20 text-white hover:bg-white/30 border border-white/20'}`}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default MyBookings;
