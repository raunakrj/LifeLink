import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, API_URL } from '../context/AuthContext';
import { cn } from '../lib/utils';
import { Search, Droplet, MapPin, Phone, User, Activity, Loader2, Mail, Heart } from 'lucide-react';

const Donors = () => {
    const [donors, setDonors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({
        bloodGroup: '',
        organType: '',
        radius: ''
    });
    const { user } = useAuth();
    const navigate = useNavigate();

    const fetchDonors = async () => {
        setLoading(true);
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.accessToken}` }
            };
            const params = new URLSearchParams();
            if (filter.bloodGroup) params.append('bloodGroup', filter.bloodGroup);
            if (filter.organType) params.append('organType', filter.organType);
            if (filter.radius) params.append('radius', filter.radius);
            
            // Pass user's own coordinates if available for ranking
            if (user?.location?.coordinates) {
                params.append('lng', user.location.coordinates[0]);
                params.append('lat', user.location.coordinates[1]);
            }

            params.append('limit', '50');

            const BASE_URL = API_URL;
            const url = `${BASE_URL}/donors/search?${params.toString()}`;
            
            const { data } = await axios.get(url, config);
            setDonors(data);
        } catch (error) {
            console.error('[ERROR] Failed to fetch donors:', error.response?.data || error.message);
            setDonors([]); // Clear on error
        } finally {
            setLoading(false);
        }
    };

    const handleContact = async (donorId) => {
        try {
            const BASE_URL = API_URL;
            const { data } = await axios.post(`${BASE_URL}/chats/create`, { 
                receiverId: donorId 
            }, {
                headers: { Authorization: `Bearer ${user.accessToken}` }
            });
            navigate(`/messages?chatId=${data._id}`);
        } catch (error) {
            alert('Failed to start conversation');
        }
    };

    useEffect(() => {
        if (user) fetchDonors();
    }, [user, filter]);

    if (!user) {
        return (
            <div className="pt-32 pb-20 px-4 text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view donors</h1>
                <p className="text-gray-500 mb-6">Donor availability is sensitive information.</p>
                <Link to="/login" className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold">Log In</Link>
            </div>
        );
    }

    return (
        <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 text-left">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">Find Donors</h1>
                    <p className="text-gray-500">Nearest donors appear first based on your location.</p>
                </div>

                <div className="flex flex-wrap gap-4">
                    <select 
                        className="bg-white border border-gray-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-red-500 text-sm font-medium"
                        value={filter.bloodGroup}
                        onChange={(e) => setFilter({...filter, bloodGroup: e.target.value})}
                    >
                        <option value="">All Blood Groups</option>
                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                            <option key={bg} value={bg}>{bg}</option>
                        ))}
                    </select>

                    <select 
                        className="bg-white border border-gray-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-red-500 text-sm font-medium"
                        value={filter.radius}
                        onChange={(e) => setFilter({...filter, radius: e.target.value})}
                    >
                        <option value="">Within Any Distance</option>
                        <option value="5">Within 5 km</option>
                        <option value="10">Within 10 km</option>
                        <option value="25">Within 25 km</option>
                        <option value="50">Within 50 km</option>
                        <option value="100">Within 100 km</option>
                    </select>

                    <select 
                        className="bg-white border border-gray-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-red-500 text-sm font-medium"
                        value={filter.organType}
                        onChange={(e) => setFilter({...filter, organType: e.target.value})}
                    >
                        <option value="">Any Service</option>
                        <option value="Blood">Blood Only</option>
                        <option value="Kidney">Kidney</option>
                        <option value="Liver">Liver</option>
                        <option value="Heart">Heart</option>
                        <option value="Cornea">Cornea</option>
                        <option value="Lungs">Lungs</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {donors.length > 0 ? donors.map((donor) => (
                        <div 
                            key={donor._id} 
                            onClick={() => navigate(`/donor/${donor._id}`)}
                            className="bg-white rounded-3xl p-6 border border-gray-100 hover:border-red-200 hover:shadow-xl hover:shadow-red-50/50 transition-all group relative overflow-hidden text-left cursor-pointer"
                        >
                            <div className="absolute top-0 right-0 p-1">
                                {donor.matchScore ? (
                                    <div className="bg-red-600 text-white px-3 py-1 rounded-bl-xl rounded-tr-xl text-[10px] font-bold shadow-lg">
                                        MATCH: {donor.matchScore}%
                                    </div>
                                ) : (
                                    <div className="bg-green-500 text-white px-3 py-1 rounded-bl-xl rounded-tr-xl text-[10px] font-bold shadow-lg">
                                        {donor.availability ? 'AVAILABLE' : 'OFFLINE'}
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex items-center gap-4 mb-6">
                                <div className="relative">
                                    <img 
                                        src={donor.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${donor.email}`} 
                                        alt={donor.name}
                                        className="w-16 h-16 rounded-2xl object-cover bg-gray-100"
                                    />
                                    <div className={cn(
                                        "absolute -bottom-1 -right-1 w-4 h-4 border-2 border-white rounded-full",
                                        donor.availability ? "bg-green-500" : "bg-gray-300"
                                    )}></div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg group-hover:text-red-600 transition-colors line-clamp-1">{donor.name}</h3>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <MapPin className="w-3 h-3" />
                                        {donor.distance ? `${(donor.distance / 1000).toFixed(1)} km away` : donor.address || 'Unknown'}
                                    </div>
                                </div>
                                <div className="ml-auto bg-red-50 text-red-600 font-bold px-3 py-1 rounded-xl text-sm">
                                    {donor.bloodGroup}
                                </div>
                            </div>

                            <div className="space-y-2 mb-6">
                                <div className="flex items-center gap-3 text-xs text-gray-500">
                                    <Activity className="w-3.5 h-3.5 text-red-400" />
                                    <span>Age: {donor.age} • Verified Donor</span>
                                </div>
                                {donor.donationPreferences?.organs?.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {donor.donationPreferences.organs.map(o => (
                                            <span key={o} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{o}</span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="w-full py-3 bg-gray-50 text-gray-900 rounded-2xl font-bold group-hover:bg-red-600 group-hover:text-white transition-all flex items-center justify-center gap-2 text-sm border border-gray-100">
                                View Profile
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-full text-center py-20 bg-gray-50 rounded-3xl">
                            <p className="text-gray-500">No donors found matching your criteria.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Donors;
