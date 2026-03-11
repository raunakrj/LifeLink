import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
    Heart, MapPin, Droplet, Activity, 
    MessageSquare, Phone, User, ShieldCheck, 
    ArrowLeft, Loader2, Calendar, FileText
} from 'lucide-react';
import { cn } from '../lib/utils';

const DonorProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [donor, setDonor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        const fetchDonor = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.accessToken}` }
                };
                const { data } = await axios.get(`${API_URL}/donors/${id}`, config);
                setDonor(data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load donor profile');
            } finally {
                setLoading(false);
            }
        };

        if (user && id) fetchDonor();
    }, [id, user]);

    const handleChat = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.accessToken}` }
            };
            const { data } = await axios.post(`${API_URL}/chats/create`, { 
                receiverId: donor._id 
            }, config);
            navigate(`/messages?chatId=${data._id}`);
        } catch (err) {
            alert('Failed to start conversation');
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center pt-20">
            <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
        </div>
    );

    if (error || !donor) return (
        <div className="min-h-screen flex flex-col items-center justify-center pt-20 px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{error || 'Donor not found'}</h2>
            <button 
                onClick={() => navigate('/donors')}
                className="bg-red-600 text-white px-6 py-2 rounded-xl font-bold"
            >
                Back to Search
            </button>
        </div>
    );

    return (
        <div className="min-h-screen pt-28 pb-20 bg-gray-50/50">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header/Back Navigation */}
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors mb-8 group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium text-sm">Back</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Core Profile Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm sticky top-32">
                            <div className="relative mb-6">
                                <img 
                                    src={donor.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${donor.email}`} 
                                    alt={donor.name}
                                    className="w-full aspect-square rounded-2xl object-cover bg-gray-100 shadow-lg"
                                />
                                {donor.availability && (
                                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-lg border-2 border-white">
                                        AVAILABLE
                                    </div>
                                )}
                            </div>

                            <div className="text-center mb-6 text-left">
                                <div className="flex items-center justify-center gap-2 mb-1">
                                    <h1 className="text-2xl font-bold text-gray-900">{donor.name}</h1>
                                    {donor.isVerified && <ShieldCheck className="w-5 h-5 text-blue-500" />}
                                </div>
                                <p className="text-gray-500 text-sm flex items-center justify-center gap-1">
                                    <MapPin className="w-3.5 h-3.5" /> {donor.address || 'Location Unknown'}
                                </p>
                            </div>

                            <div className="flex gap-2 mb-8">
                                <div className="flex-1 bg-red-50 p-4 rounded-2xl text-center">
                                    <Droplet className="w-5 h-5 text-red-600 mx-auto mb-1" />
                                    <span className="text-lg font-bold text-red-700 block">{donor.bloodGroup}</span>
                                    <span className="text-[10px] text-red-400 font-medium uppercase tracking-wider">Group</span>
                                </div>
                                <div className="flex-1 bg-blue-50 p-4 rounded-2xl text-center">
                                    <Calendar className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                                    <span className="text-lg font-bold text-blue-700 block">{donor.age}</span>
                                    <span className="text-[10px] text-blue-400 font-medium uppercase tracking-wider">Age</span>
                                </div>
                            </div>

                            <button 
                                onClick={handleChat}
                                className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-red-600 transition-all flex items-center justify-center gap-2 shadow-xl shadow-gray-200"
                            >
                                <MessageSquare className="w-5 h-5" />
                                Chat with Donor
                            </button>
                        </div>
                    </div>

                    {/* Right Column - Detailed Info */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Summary Section */}
                        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm text-left">
                            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <User className="w-5 h-5 text-red-600" />
                                Donor Information
                            </h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
                                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                            <div className={cn("w-2 h-2 rounded-full", donor.availability ? "bg-green-500" : "bg-gray-300")}></div>
                                            {donor.availability ? 'Ready to Donate' : 'Currently Unavailable'}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Verified Member</p>
                                        <p className="text-sm font-medium text-gray-700">Since {new Date(donor.createdAt).getFullYear()}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Contact Email</p>
                                        <p className="text-sm font-medium text-gray-700 truncate">{donor.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Gender</p>
                                        <p className="text-sm font-medium text-gray-700">{donor.gender || 'Not specified'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Preferences & Bio */}
                        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm text-left">
                            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Activity className="w-5 h-5 text-red-600" />
                                Donation Preferences
                            </h2>
                            
                            <div className="mb-8">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 italic">Eligible for donating:</p>
                                <div className="flex flex-wrap gap-2">
                                    {donor.donationPreferences?.organs?.length > 0 ? (
                                        donor.donationPreferences.organs.map(organ => (
                                            <span key={organ} className="px-4 py-2 bg-gray-50 text-gray-700 rounded-xl text-xs font-bold border border-gray-100 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                                                {organ}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-400 text-sm">No preferences set</span>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-gray-400" />
                                    Bio & Description
                                </h3>
                                <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-2xl border border-dashed border-gray-200">
                                    {donor.bio || `${donor.name} is a committed LifeLink community member willing to help in medical emergencies. Contact them to discuss donation requirements.`}
                                </p>
                            </div>
                        </div>

                        {/* Safety Warning */}
                        <div className="bg-yellow-50/50 rounded-3xl p-6 border border-yellow-100 text-left">
                            <div className="flex gap-4">
                                <div className="bg-yellow-100 p-2 rounded-xl flex-shrink-0 h-fit">
                                    <ShieldCheck className="w-5 h-5 text-yellow-600" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-yellow-800 text-sm mb-1">Safety First</h4>
                                    <p className="text-xs text-yellow-700 leading-relaxed">
                                        For your safety, always coordinate donations through authorized medical facilities. Never share sensitive personal documents outside the secure platform.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DonorProfile;
