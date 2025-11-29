import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

interface Resort {
    _id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    images: string[];
    pool: boolean;
    turf: boolean;
    facilities: Record<string, boolean>;
}

const ResortList: React.FC = () => {
    const [resorts, setResorts] = useState<Resort[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedResort, setSelectedResort] = useState<Resort | null>(null);
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

    const openModal = (resort: Resort) => {
        setSelectedResort(resort);
    };

    const closeModal = () => {
        setSelectedResort(null);
    };

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-8 text-white drop-shadow-md">Available Resorts</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                {resorts.map((resort) => (
                    <div key={resort._id} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl overflow-hidden hover:transform hover:scale-[1.02] transition-all duration-300 flex flex-col">
                        <div
                            className="cursor-pointer"
                            onClick={() => openModal(resort)}
                        >
                            <img src={resort.image} alt={resort.name} className="w-full h-48 object-cover" />
                        </div>
                        <div className="p-5 flex flex-col flex-grow">
                            <h3 className="text-xl font-bold mb-2 text-white">{resort.name}</h3>
                            <p className="text-blue-200 mb-2 font-semibold">₹{resort.price} / night</p>
                            <p className="text-sm text-white/70 mb-4 line-clamp-1">{resort.description}</p>

                            {/* Facilities Badges */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {resort.pool && <span className="bg-blue-500/30 text-blue-100 text-[10px] px-2 py-0.5 rounded-full border border-blue-500/20">Pool</span>}
                                {resort.turf && <span className="bg-green-500/30 text-green-100 text-[10px] px-2 py-0.5 rounded-full border border-green-500/20">Turf</span>}
                                {resort.facilities && Object.keys(resort.facilities).slice(0, 3).map(key => (
                                    <span key={key} className="bg-white/10 text-white/80 text-[10px] px-2 py-0.5 rounded-full border border-white/10">{key}</span>
                                ))}
                                {resort.facilities && Object.keys(resort.facilities).length > 3 && (
                                    <span className="text-white/60 text-[10px] px-1">+{Object.keys(resort.facilities).length - 3} more</span>
                                )}
                            </div>

                            <div className="flex gap-2 mt-auto">
                                <button
                                    onClick={() => openModal(resort)}
                                    className="flex-1 bg-white/20 text-white font-bold py-2.5 rounded-xl hover:bg-white/30 transition-colors border border-white/20"
                                >
                                    View Details
                                </button>
                                <button
                                    onClick={() => navigate('/book', { state: { resort } })}
                                    className="flex-1 bg-white text-blue-900 font-bold py-2.5 rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
                                >
                                    Book Now
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
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

            {/* Resort Details Modal */}
            {selectedResort && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={closeModal}>
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 md:p-8">
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-3xl font-bold text-white">{selectedResort.name}</h2>
                                <button onClick={closeModal} className="text-white/70 hover:text-white transition-colors">
                                    <X size={32} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div>
                                    <img src={selectedResort.image} alt={selectedResort.name} className="w-full h-64 object-cover rounded-xl shadow-lg mb-4" />
                                    <p className="text-blue-200 text-xl font-semibold mb-2">₹{selectedResort.price} / night</p>
                                    <p className="text-white/80 leading-relaxed">{selectedResort.description}</p>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-4">Gallery</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {selectedResort.images && selectedResort.images.length > 0 ? (
                                            selectedResort.images.map((img, index) => (
                                                <img key={index} src={img} alt={`Gallery ${index}`} className="w-full h-32 object-cover rounded-lg shadow-md hover:scale-105 transition-transform" />
                                            ))
                                        ) : (
                                            <p className="text-white/50 col-span-2">No additional images available.</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4 border-t border-white/10">
                                <button
                                    onClick={() => navigate('/book', { state: { resort: selectedResort } })}
                                    className="bg-white text-blue-900 px-8 py-3 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all shadow-lg"
                                >
                                    Book Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResortList;
