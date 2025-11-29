import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import Modal from '../../components/ui/Modal';
import { useToast } from '../../context/ToastContext';
import { MoreVertical, Edit2, Trash2, Plus, X } from 'lucide-react';

interface Resort {
    _id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    pool: boolean;
    turf: boolean;
    facilities: Record<string, boolean>;
}

interface PaginationData {
    total: number;
    page: number;
    pages: number;
}

const ManageResorts: React.FC = () => {
    const [resorts, setResorts] = useState<Resort[]>([]);
    const [pagination, setPagination] = useState<PaginationData>({ total: 0, page: 1, pages: 1 });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        image: '',
        pool: false,
        turf: false,
        facilities: [] as { key: string; value: boolean }[],
    });
    const [newFacility, setNewFacility] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const { showToast } = useToast();
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchResorts(pagination.page);
    }, [pagination.page]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenuId(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchResorts = async (page: number) => {
        try {
            const limit = 6;
            const skip = (page - 1) * limit;
            const response = await axiosInstance.get(`/resorts?limit=${limit}&skip=${skip}`);
            setResorts(response.data.data);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error('Error fetching resorts', error);
            showToast('Failed to fetch resorts', 'error');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleAddFacility = () => {
        if (newFacility.trim()) {
            setFormData({
                ...formData,
                facilities: [...formData.facilities, { key: newFacility.trim(), value: true }],
            });
            setNewFacility('');
        }
    };

    const handleRemoveFacility = (index: number) => {
        const updatedFacilities = formData.facilities.filter((_, i) => i !== index);
        setFormData({ ...formData, facilities: updatedFacilities });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const facilitiesObject: Record<string, boolean> = {};
        formData.facilities.forEach(f => {
            facilitiesObject[f.key] = f.value;
        });

        const payload = {
            ...formData,
            facilities: facilitiesObject,
        };

        try {
            if (editingId) {
                await axiosInstance.put(`/resorts/${editingId}`, payload);
                showToast('Resort updated successfully', 'success');
            } else {
                await axiosInstance.post('/resorts', payload);
                showToast('Resort added successfully', 'success');
            }
            closeModal();
            fetchResorts(pagination.page);
        } catch (error) {
            console.error('Error saving resort', error);
            showToast('Failed to save resort', 'error');
        }
    };

    const handleEdit = (resort: Resort) => {
        const facilitiesArray = resort.facilities
            ? Object.entries(resort.facilities).map(([key, value]) => ({ key, value }))
            : [];

        setFormData({
            name: resort.name,
            description: resort.description,
            price: resort.price,
            image: resort.image,
            pool: resort.pool || false,
            turf: resort.turf || false,
            facilities: facilitiesArray,
        });
        setEditingId(resort._id);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this resort?')) {
            try {
                await axiosInstance.delete(`/resorts/${id}`);
                showToast('Resort deleted successfully', 'success');
                fetchResorts(pagination.page);
            } catch (error) {
                console.error('Error deleting resort', error);
                showToast('Failed to delete resort', 'error');
            }
        }
    };

    const openModal = () => {
        setEditingId(null);
        setFormData({
            name: '',
            description: '',
            price: 0,
            image: '',
            pool: false,
            turf: false,
            facilities: []
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setFormData({
            name: '',
            description: '',
            price: 0,
            image: '',
            pool: false,
            turf: false,
            facilities: []
        });
    };

    return (
        <div className="container mx-auto p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white drop-shadow-md">Manage Resorts</h1>
                <button
                    onClick={openModal}
                    className="bg-white/20 hover:bg-white/30 text-white border border-white/30 px-6 py-2.5 rounded-xl transition-all backdrop-blur-sm shadow-lg"
                >
                    Add Resort
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {resorts.map((resort) => (
                    <div key={resort._id} className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl shadow-xl hover:transform hover:scale-[1.02] transition-all duration-300 flex flex-col">
                        <img src={resort.image} alt={resort.name} className="w-full h-48 object-cover rounded-xl mb-4 shadow-md" />
                        <h3 className="text-xl font-bold mb-2 text-white">{resort.name}</h3>
                        <p className="text-white/70 text-sm mb-4 line-clamp-3 flex-grow">{resort.description}</p>

                        <div className="flex flex-wrap gap-2 mb-4">
                            {resort.pool && <span className="bg-blue-500/30 text-blue-100 text-xs px-2 py-1 rounded-full border border-blue-500/20">Pool</span>}
                            {resort.turf && <span className="bg-green-500/30 text-green-100 text-xs px-2 py-1 rounded-full border border-green-500/20">Turf</span>}
                            {resort.facilities && Object.keys(resort.facilities).map(key => (
                                <span key={key} className="bg-white/10 text-white/80 text-xs px-2 py-1 rounded-full border border-white/10">{key}</span>
                            ))}
                        </div>

                        <div className="flex justify-between items-center mt-auto pt-4 border-t border-white/10">
                            <div className="text-white font-bold text-lg">
                                {resort.price} <span className="text-sm font-normal text-white/60">/ night</span>
                            </div>
                            <div className="relative" ref={openMenuId === resort._id ? menuRef : null}>
                                <button
                                    onClick={() => setOpenMenuId(openMenuId === resort._id ? null : resort._id)}
                                    className="text-white/70 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
                                >
                                    <MoreVertical className="w-5 h-5" />
                                </button>

                                {openMenuId === resort._id && (
                                    <div className="absolute right-0 bottom-full mb-2 w-40 bg-white/95 backdrop-blur-md rounded-lg shadow-xl border border-white/20 overflow-hidden z-10">
                                        <button
                                            onClick={() => {
                                                handleEdit(resort);
                                                setOpenMenuId(null);
                                            }}
                                            className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-blue-50 transition-colors text-gray-700"
                                        >
                                            <Edit2 className="w-4 h-4 text-blue-600" />
                                            <span>Edit</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleDelete(resort._id);
                                                setOpenMenuId(null);
                                            }}
                                            className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-red-50 transition-colors text-gray-700 border-t border-gray-100"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-600" />
                                            <span>Delete</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-10 space-x-3">
                <button
                    disabled={pagination.page === 1}
                    onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                    className={`px-4 py-2 rounded-lg backdrop-blur-sm transition-all ${pagination.page === 1 ? 'bg-white/5 text-white/30 cursor-not-allowed' : 'bg-white/20 text-white hover:bg-white/30 border border-white/20'}`}
                >
                    Previous
                </button>
                <span className="px-4 py-2 text-white font-medium bg-white/10 rounded-lg backdrop-blur-sm border border-white/10">
                    Page {pagination.page} of {pagination.pages}
                </span>
                <button
                    disabled={pagination.page === pagination.pages}
                    onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                    className={`px-4 py-2 rounded-lg backdrop-blur-sm transition-all ${pagination.page === pagination.pages ? 'bg-white/5 text-white/30 cursor-not-allowed' : 'bg-white/20 text-white hover:bg-white/30 border border-white/20'}`}
                >
                    Next
                </button>
            </div>

            <Modal isOpen={isModalOpen} onClose={closeModal} title={editingId ? 'Edit Resort' : 'Add New Resort'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Resort Name</label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Price per Night</label>
                            <input
                                name="price"
                                type="number"
                                value={formData.price}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Image URL</label>
                            <input
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={3}
                            required
                        />
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <label className="block text-gray-700 text-sm font-bold mb-3">Facilities</label>
                        <div className="flex gap-6 mb-4">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="pool"
                                    checked={formData.pool}
                                    onChange={handleChange}
                                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                                />
                                <span className="text-gray-700">Swimming Pool</span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="turf"
                                    checked={formData.turf}
                                    onChange={handleChange}
                                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                                />
                                <span className="text-gray-700">Turf Area</span>
                            </label>
                        </div>

                        <div className="border-t border-gray-200 pt-3">
                            <label className="block text-gray-600 text-xs font-bold mb-2 uppercase">Additional Facilities</label>
                            <div className="flex gap-2 mb-3">
                                <input
                                    value={newFacility}
                                    onChange={(e) => setNewFacility(e.target.value)}
                                    placeholder="e.g. Gym, Spa, WiFi"
                                    className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddFacility}
                                    className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.facilities.map((facility, index) => (
                                    <span key={index} className="bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                        {facility.key}
                                        <button type="button" onClick={() => handleRemoveFacility(index)} className="text-gray-400 hover:text-red-500">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 mr-3 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                        >
                            {editingId ? 'Update Resort' : 'Create Resort'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ManageResorts;
