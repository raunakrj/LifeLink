import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';
import { 
    User, Mail, Phone, MapPin, Droplet, 
    Calendar, Edit3, Loader2, ArrowLeft, 
    ShieldCheck, Activity, Heart, Globe,
    Twitter, Linkedin, Github
} from 'lucide-react';

const Profile = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [profileData, setProfileData] = useState(null);
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) {
                navigate('/login');
                return;
            }

            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.accessToken}` }
                };
                const { data } = await axios.get(`${API_URL}/users/profile`, config);
                setProfileData(data);
            } catch (error) {
                console.error('Fetch profile failed:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user, navigate, API_URL]);

    if (loading) {
        return (
            <div className="min-h-screen pt-32 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
            </div>
        );
    }

    if (!profileData) {
        return (
            <div className="min-h-screen pt-32 flex flex-col items-center justify-center">
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl text-center">
                    <ShieldCheck className="w-16 h-16 text-red-100 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
                    <p className="text-gray-500 mb-6">We couldn't retrieve your profile information.</p>
                    <button 
                        onClick={() => navigate('/')}
                        className="bg-red-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-red-700 transition-all"
                    >
                        Return Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-32 bg-gray-50 px-4">
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Header Card */}
                <div className="bg-white rounded-[40px] shadow-xl shadow-red-100/50 border border-gray-100 overflow-hidden relative">
                    <div className="h-48 bg-gradient-to-r from-red-600 to-red-400"></div>
                    <div className="px-8 pb-8">
                        <div className="flex flex-col md:flex-row items-end gap-6 -mt-20 mb-8 relative z-10">
                            <div className="relative">
                                <div className="w-40 h-40 bg-white rounded-[40px] p-2 shadow-2xl">
                                    <div className="w-full h-full bg-red-50 rounded-[32px] flex items-center justify-center text-red-600 text-5xl font-bold border-4 border-white overflow-hidden">
                                        {profileData.photoUrl ? (
                                            <img src={profileData.photoUrl} alt={profileData.name} className="w-full h-full object-cover" />
                                        ) : (
                                            profileData.name.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                </div>
                                <div className="absolute bottom-4 right-4 bg-green-500 w-6 h-6 rounded-full border-4 border-white"></div>
                            </div>
                            <div className="flex-1 pb-2">
                                <div className="flex items-center gap-3 mb-2">
                                    <h1 className="text-4xl font-bold text-gray-900">{profileData.name}</h1>
                                    <ShieldCheck className="w-6 h-6 text-blue-500 fill-current" />
                                </div>
                                <div className="flex flex-wrap items-center gap-4 text-gray-500 font-medium">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-red-500" />
                                        {profileData.address || 'Location Not Set'}
                                    </div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                                    <div className="flex items-center gap-2 uppercase tracking-widest text-xs font-bold text-gray-400">
                                        Active since {new Date().getFullYear()}
                                    </div>
                                </div>
                            </div>
                            <div className="w-full md:w-auto flex items-center gap-3">
                                <button 
                                    onClick={() => navigate('/edit-profile')}
                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-lg active:scale-95"
                                >
                                    <Edit3 className="w-4 h-4" />
                                    Edit Profile
                                </button>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gray-50 rounded-[32px] border border-gray-100">
                            <div className="text-center group">
                                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-1">Blood Group</p>
                                <p className="text-2xl font-black text-red-600 group-hover:scale-110 transition-transform">{profileData.bloodGroup}</p>
                            </div>
                            <div className="text-center border-l border-gray-200">
                                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-1">Gender</p>
                                <p className="text-xl font-bold text-gray-900">{profileData.gender || '—'}</p>
                            </div>
                            <div className="text-center border-l border-gray-200">
                                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-1">Age</p>
                                <p className="text-xl font-bold text-gray-900">{profileData.age}</p>
                            </div>
                            <div className="text-center border-l border-gray-200">
                                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-1">Status</p>
                                <span className={cn(
                                    "inline-flex items-center gap-1 text-[10px] font-bold px-3 py-1 rounded-full",
                                    profileData.availability ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                                )}>
                                    <div className={cn("w-1.5 h-1.5 rounded-full", profileData.availability ? "bg-green-500" : "bg-gray-400")}></div>
                                    {profileData.availability ? 'AVAILABLE' : 'OFFLINE'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column: Info */}
                    <div className="md:col-span-2 space-y-8">
                        {/* Bio Section */}
                        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-xl shadow-red-50/50">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                <Heart className="w-6 h-6 text-red-500" />
                                About Me
                            </h3>
                            <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
                                {profileData.bio || "This user hasn't added a bio yet."}
                            </p>
                        </div>

                        {/* Donation Preference Section */}
                        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-xl shadow-red-50/50">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                <ShieldCheck className="w-6 h-6 text-blue-500" />
                                Donation Preferences
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className={cn(
                                    "p-6 rounded-3xl border-2 transition-all",
                                    profileData.donationPreferences?.blood ? "bg-red-50/50 border-red-500/20" : "bg-gray-50 border-transparent opacity-50"
                                )}>
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md">
                                            <Droplet className={cn("w-6 h-6", profileData.donationPreferences?.blood ? "text-red-500" : "text-gray-300")} />
                                        </div>
                                        <p className="font-bold text-gray-900">Blood Donation</p>
                                    </div>
                                    <p className="text-sm text-gray-500">Willing to donate blood and plasma in emergencies.</p>
                                </div>

                                <div className={cn(
                                    "p-6 rounded-3xl border-2 transition-all",
                                    profileData.donationPreferences?.organs?.length > 0 ? "bg-blue-50/50 border-blue-500/20" : "bg-gray-50 border-transparent opacity-50"
                                )}>
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md">
                                            <Activity className={cn("w-6 h-6", profileData.donationPreferences?.organs?.length > 0 ? "text-blue-500" : "text-gray-300")} />
                                        </div>
                                        <p className="font-bold text-gray-900">Organ Donation</p>
                                    </div>
                                    {profileData.donationPreferences?.organs?.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {profileData.donationPreferences.organs.map(organ => (
                                                <span key={organ} className="bg-white px-3 py-1 rounded-full text-xs font-bold text-blue-600 shadow-sm border border-blue-100">
                                                    {organ}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500">No specific organs selected.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sidebar */}
                    <div className="space-y-8">
                        {/* Contact Card */}
                        <div className="bg-gray-900 p-8 rounded-[40px] shadow-2xl text-white">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                                <Phone className="w-5 h-5 text-red-500" />
                                Contact Info
                            </h3>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                                    <Mail className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Email Address</p>
                                        <p className="text-sm font-medium">{profileData.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                                    <Phone className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Phone Number</p>
                                        <p className="text-sm font-medium">{profileData.phone || 'Not Shared'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 bg-red-600/10 rounded-2xl border border-red-500/20">
                                    <ShieldCheck className="w-5 h-5 text-red-500" />
                                    <div className="flex-1">
                                        <p className="text-[10px] text-red-300 font-bold uppercase tracking-widest">Verified Badge</p>
                                        <p className="text-sm font-medium">Secured & Verified</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Social/Stats Sidebar */}
                        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-xl text-center">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Network Visibility</p>
                            <div className="flex justify-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
                                    <Twitter className="w-5 h-5" />
                                </div>
                                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
                                    <Linkedin className="w-5 h-5" />
                                </div>
                                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
                                    <Globe className="w-5 h-5" />
                                </div>
                            </div>
                            <div className="h-px bg-gray-100 mb-6"></div>
                            <div className="flex items-center justify-between px-4">
                                <div className="text-left">
                                    <p className="text-xl font-bold text-gray-900">12</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Matches</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-bold text-gray-900">4.9</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Rating</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
