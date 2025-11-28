import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import Modal from '../../components/ui/Modal';
import { useToast } from '../../context/ToastContext';

interface Resort {
    _id: string;
    name: string;
    description: string;
    price: number;
    amenities: string[];
    image: string;
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
        amenities: '',
        image: '',
    });
    const [editingId, setEditingId] = useState<string | null>(null);
    const { showToast } = useToast();

    useEffect(() => {
        fetchResorts(pagination.page);
    }, [pagination.page]);

    const fetchResorts = async (page: number) => {
        try {
            const response = await axiosInstance.get(`/resorts?page=${page}&limit=6`);
            setResorts(response.data.data);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error('Error fetching resorts', error);
            showToast('Failed to fetch resorts', 'error');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            ...formData,
            amenities: formData.amenities.split(',').map((item) => item.trim()),
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
        setFormData({
            name: resort.name,
            description: resort.description,
            price: resort.price,
            amenities: resort.amenities.join(', '),
            image: resort.image,
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
        setFormData({ name: '', description: '', price: 0, amenities: '', image: '' });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setFormData({ name: '', description: '', price: 0, amenities: '', image: '' });
    };

    return (
        <div className="container mx-auto p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Manage Resorts</h1>
                <button
                    onClick={openModal}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
                >
                    Add Resort
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resorts.map((resort) => (
                    <div key={resort._id} className="bg-white p-4 rounded shadow hover:shadow-lg transition duration-300">
                        <img src={resort.image} alt={resort.name} className="w-full h-48 object-cover rounded mb-4" />
                        <h3 className="text-xl font-bold mb-2">{resort.name}</h3>
                        <p className="text-blue-600 font-semibold mb-2">${resort.price} / night</p>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{resort.description}</p>
                        <div className="flex justify-between mt-auto">
                            <button onClick={() => handleEdit(resort)} className="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
                            <button onClick={() => handleDelete(resort._id)} className="text-red-600 hover:text-red-800 font-medium">Delete</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-8 space-x-2">
                <button
                    disabled={pagination.page === 1}
                    onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                    className={`px-4 py-2 rounded ${pagination.page === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                >
                    Previous
                </button>
                <span className="px-4 py-2 text-gray-700">
                    Page {pagination.page} of {pagination.pages}
                </span>
                <button
                    disabled={pagination.page === pagination.pages}
                    onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                    className={`px-4 py-2 rounded ${pagination.page === pagination.pages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                >
                    Next
                </button>
            </div>

            <Modal isOpen={isModalOpen} onClose={closeModal} title={editingId ? 'Edit Resort' : 'Add New Resort'}>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Resort Name</label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Price per Night</label>
                        <input
                            name="price"
                            type="number"
                            value={formData.price}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            rows={4}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Amenities (comma separated)</label>
                        <input
                            name="amenities"
                            value={formData.amenities}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Image URL</label>
                        <input
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mr-2"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            {editingId ? 'Update Resort' : 'Add Resort'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ManageResorts;
