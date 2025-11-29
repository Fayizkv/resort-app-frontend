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
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        fetchBookings(page, statusFilter);
    }, [page, statusFilter]);

    const fetchBookings = async (pageNum: number, status: string) => {
        try {
            const limit = 5;
            const skip = (pageNum - 1) * limit;
            const response = await axiosInstance.get(`/bookings?limit=${limit}&skip=${skip}&status=${status}`);
            setBookings(response.data.data);
            setTotalPages(response.data.pagination.pages);
        } catch (error) {
            console.error('Error fetching bookings', error);
        }
    };

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            await axiosInstance.patch(`/bookings/${id}/status`, { status: newStatus });
            fetchBookings(page, statusFilter);
        } catch (error) {
            console.error('Error updating booking status', error);
        }
    };

    return (
        <div className="container mx-auto p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white drop-shadow-md">Admin Dashboard - Bookings</h1>
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
            <div className="overflow-x-auto mb-8 rounded-2xl shadow-xl border border-white/20">
                <table className="min-w-full bg-white/10 backdrop-blur-md text-white">
                    <thead>
                        <tr className="bg-white/20 border-b border-white/10">
                            <th className="py-4 px-6 text-left font-semibold">User</th>
                            <th className="py-4 px-6 text-left font-semibold">Resort</th>
                            <th className="py-4 px-6 text-left font-semibold">Check-In</th>
                            <th className="py-4 px-6 text-left font-semibold">Check-Out</th>
                            <th className="py-4 px-6 text-left font-semibold">Status</th>
                            <th className="py-4 px-6 text-left font-semibold">Actions</th>
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
                                <td className="py-4 px-6">
                                    {booking.status === 'pending' && (
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleStatusUpdate(booking._id, 'confirmed')}
                                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm transition-colors shadow-sm"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm transition-colors shadow-sm"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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

export default AdminBookings;
