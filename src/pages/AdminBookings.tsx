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
            const response = await axiosInstance.get(`/bookings?page=${pageNum}&limit=5`);
            setBookings(response.data.data);
            setTotalPages(response.data.pagination.pages);
        } catch (error) {
            console.error('Error fetching bookings', error);
        }
    };

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard - Bookings</h1>
            <div className="overflow-x-auto mb-4">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-4 border-b">User</th>
                            <th className="py-2 px-4 border-b">Resort</th>
                            <th className="py-2 px-4 border-b">Check-In</th>
                            <th className="py-2 px-4 border-b">Check-Out</th>
                            <th className="py-2 px-4 border-b">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((booking) => (
                            <tr key={booking._id} className="hover:bg-gray-50">
                                <td className="py-2 px-4 border-b">{booking.user?.email || 'N/A'}</td>
                                <td className="py-2 px-4 border-b">{booking.resort?.name || 'N/A'}</td>
                                <td className="py-2 px-4 border-b">{new Date(booking.checkInDate).toLocaleDateString()}</td>
                                <td className="py-2 px-4 border-b">{new Date(booking.checkOutDate).toLocaleDateString()}</td>
                                <td className="py-2 px-4 border-b">{booking.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-center space-x-2">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="px-4 py-2">Page {page} of {totalPages}</span>
                <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default AdminBookings;
