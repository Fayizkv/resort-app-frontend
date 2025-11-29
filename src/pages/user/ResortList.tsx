import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';

interface Resort {
    _id: string;
    name: string;
    description: string;
    price: number;
    image: string;
}

const ResortList: React.FC = () => {
    const [resorts, setResorts] = useState<Resort[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        fetchResorts(page);
    }, [page]);

    const fetchResorts = async (pageNum: number) => {
        try {
            const limit = 9;
            const skip = (pageNum - 1) * limit;
            const response = await axiosInstance.get(`/resorts?limit=${limit}&skip=${skip}`);
            setResorts(response.data.data);
            setTotalPages(response.data.pagination.pages);
        } catch (error) {
            console.error('Error fetching resorts', error);
        }
    };

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-8 text-white drop-shadow-md">Available Resorts</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                {resorts.map((resort) => (
                    <div key={resort._id} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl overflow-hidden hover:transform hover:scale-[1.02] transition-all duration-300">
                        <img src={resort.image} alt={resort.name} className="w-full h-48 object-cover" />
                        <div className="p-5">
                            <h3 className="text-xl font-bold mb-2 text-white">{resort.name}</h3>
                            <p className="text-blue-200 mb-2 font-semibold">${resort.price} / night</p>
                            <p className="text-sm text-white/70 mb-4 line-clamp-3">{resort.description}</p>
                            <button
                                onClick={() => navigate('/book', { state: { resort } })}
                                className="w-full bg-white text-blue-900 font-bold py-2.5 rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
                            >
                                Book Now
                            </button>
                        </div>
                    </div>
                ))}
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

export default ResortList;
