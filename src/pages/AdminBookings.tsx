import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';

interface Booking {
    _id: string;
    user: { email: string };
    resort: { name: string };
    checkInDate: string;
    checkOutDate: string;
    status: string;
}

const AdminBookings: React.FC = () => {
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
            const response = await axiosInstance.get(`/bookings?limit=${limit}&skip=${skip}`);
            setBookings(response.data.data);
            setTotalPages(response.data.pagination.pages);
        } catch (error) {
            console.error('Error fetching bookings', error);
        }
    };

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-8 text-white drop-shadow-md">Admin Dashboard - Bookings</h1>
            <div className="overflow-x-auto mb-8 rounded-2xl shadow-xl border border-white/20">
                <table className="min-w-full bg-white/10 backdrop-blur-md text-white">
                    <thead>
                        <tr className="bg-white/20 border-b border-white/10">
                            <th className="py-4 px-6 text-left font-semibold">User</th>
                            <th className="py-4 px-6 text-left font-semibold">Resort</th>
                            <th className="py-4 px-6 text-left font-semibold">Check-In</th>
                            <th className="py-4 px-6 text-left font-semibold">Check-Out</th>
                            <th className="py-4 px-6 text-left font-semibold">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {bookings.map((booking) => (
                            <tr key={booking._id} className="hover:bg-white/5 transition-colors">
                                <td className="py-4 px-6">{booking.user?.email || 'N/A'}</td>
                                <td className="py-4 px-6 font-medium">{booking.resort?.name || 'N/A'}</td>
                                <td className="py-4 px-6 text-white/80">{new Date(booking.checkInDate).toLocaleDateString()}</td>
                                <td className="py-4 px-6 text-white/80">{new Date(booking.checkOutDate).toLocaleDateString()}</td>
                                <td className="py-4 px-6">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm shadow-sm ${booking.status === 'confirmed' ? 'bg-green-500/80 text-white' :
                                            booking.status === 'cancelled' ? 'bg-red-500/80 text-white' : 'bg-yellow-500/80 text-white'
                                        }`}>
                                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center space-x-3">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className={`px-4 py-2 rounded-lg backdrop-blur-sm transition-all ${page === 1 ? 'bg-white/5 text-white/30 cursor-not-allowed' : 'bg-white/20 text-white hover:bg-white/30 border border-white/20'}`}
                    >
                        Previous
                    </button>
                    <span className="px-4 py-2 text-white font-medium bg-white/10 rounded-lg backdrop-blur-sm border border-white/10">Page {page} of {totalPages}</span>
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

export default AdminBookings;
