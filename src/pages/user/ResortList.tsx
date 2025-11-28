import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';

interface Resort {
    _id: string;
    name: string;
    description: string;
    price: number;
    amenities: string[];
    image: string;
}

const ResortList: React.FC = () => {
    const [resorts, setResorts] = useState<Resort[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchResorts = async () => {
            try {
                const response = await axiosInstance.get('/resorts');
                setResorts(response.data.data);
            } catch (error) {
                console.error('Error fetching resorts', error);
            }
        };
        fetchResorts();
    }, []);

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6">Available Resorts</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {resorts.map((resort) => (
                    <div key={resort._id} className="bg-white rounded shadow overflow-hidden">
                        <img src={resort.image} alt={resort.name} className="w-full h-48 object-cover" />
                        <div className="p-4">
                            <h3 className="text-xl font-bold mb-2">{resort.name}</h3>
                            <p className="text-gray-600 mb-2">${resort.price} / night</p>
                            <p className="text-sm text-gray-500 mb-4">{resort.description}</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {resort.amenities.map((amenity, index) => (
                                    <span key={index} className="bg-gray-200 text-xs px-2 py-1 rounded">{amenity}</span>
                                ))}
                            </div>
                            <button
                                onClick={() => navigate('/book', { state: { resort } })}
                                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                            >
                                Book Now
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ResortList;
