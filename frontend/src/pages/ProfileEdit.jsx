import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth, API_URL } from '../context/AuthContext';
import { cn } from '../lib/utils';
import { 
    User, Mail, Phone, MapPin, Droplet, 
    Calendar, Save, ArrowLeft, Loader2, 
    CheckCircle, AlertCircle, Activity
} from 'lucide-react';

const ProfileEdit = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState({ type: null, message: '' });
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        age: '',
        bloodGroup: '',
        gender: '',
        bio: '',
        address: '',
        donationPreferences: {
            blood: true,
            organs: []
        },
        availability: true
    });


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
                // Using standardized /api/profile endpoint
                const { data } = await axios.get(`${API_URL}/profile`, config);
                setFormData({
                    name: data.name || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    age: data.age || '',
                    bloodGroup: data.bloodGroup || '',
                    gender: data.gender || '',
                    bio: data.bio || '',
                    address: data.address || '',
                    donationPreferences: data.donationPreferences || { blood: true, organs: [] },
                    availability: data.availability ?? true
                });
            } catch (error) {
                console.error('Fetch profile failed:', error);
                setStatus({ type: 'error', message: 'Failed to load profile data' });
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user, navigate, API_URL]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        if (formData.phone && !/^\+?[\d\s-]{8,15}$/.test(formData.phone)) {
            setStatus({ type: 'error', message: 'Please enter a valid phone number' });
            return;
        }

        if (formData.bio && formData.bio.length > 500) {
            setStatus({ type: 'error', message: 'Bio must be less than 500 characters' });
            return;
        }

        setSaving(true);
        setStatus({ type: null, message: '' });

        try {
            const config = {
                headers: { Authorization: `Bearer ${user.accessToken}` }
            };
            // Standardized /api/profile endpoint
            await axios.put(`${API_URL}/profile`, formData, config);
            setStatus({ type: 'success', message: 'Profile updated successfully!' });
            
            // Optional: Update local storage info if needed
            const storedUser = JSON.parse(localStorage.getItem('userInfo'));
            localStorage.setItem('userInfo', JSON.stringify({ 
                ...storedUser, 
                name: formData.name,
                email: formData.email,
                bloodGroup: formData.bloodGroup
            }));

            // Redirect to profile page after 1.5s
            setTimeout(() => {
                navigate('/profile');
            }, 1500);

        } catch (error) {
            setStatus({ type: 'error', message: error.response?.data?.message || 'Update failed' });
        } finally {
            setSaving(false);
        }
    };

    const handleOrganToggle = (organ) => {
        const currentOrgans = formData.donationPreferences.organs || [];
        const newOrgans = currentOrgans.includes(organ)
            ? currentOrgans.filter(o => o !== organ)
            : [...currentOrgans, organ];
        
        setFormData({
            ...formData,
            donationPreferences: {
                ...formData.donationPreferences,
                organs: newOrgans
            }
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-32 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen py-32 bg-gray-50 px-4">
            <div className="max-w-3xl mx-auto">
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors mb-6 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back
                </button>

                <div className="bg-white rounded-3xl shadow-xl shadow-red-100 border border-gray-100 p-8 text-left">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">Edit Profile</h2>
                            <p className="text-gray-500 mt-1">Update your personal and donation details</p>
                        </div>
                        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 text-2xl font-bold border-2 border-white shadow-lg">
                            {formData.name.charAt(0).toUpperCase()}
                        </div>
                    </div>

                    {status.message && (
                        <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 ${
                            status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                        }`}>
                            {status.type === 'success' ? <CheckCircle className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
                            <p className="text-sm font-medium">{status.message}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Section: Basic Info */}
                        <div>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <div className="h-px bg-gray-200 flex-1"></div>
                                Basic Information
                                <div className="h-px bg-gray-200 flex-1"></div>
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                                    <div className="relative text-left">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            required
                                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none text-left"
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        />
                                    </div>
                                </div>

                                <div className="text-left">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <select
                                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none appearance-none"
                                            value={formData.gender}
                                            onChange={(e) => setFormData({...formData, gender: e.target.value})}
                                        >
                                            <option value="">Select Gender</option>
                                            {['Male', 'Female', 'Other', 'Prefer not to say'].map(g => (
                                                <option key={g} value={g}>{g}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="text-left">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Age</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="number"
                                            required
                                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none"
                                            value={formData.age}
                                            onChange={(e) => setFormData({...formData, age: e.target.value})}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section: Contact */}
                        <div>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <div className="h-px bg-gray-200 flex-1"></div>
                                Contact Details
                                <div className="h-px bg-gray-200 flex-1"></div>
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="text-left">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="email"
                                            required
                                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none"
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        />
                                    </div>
                                </div>

                                <div className="text-left">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="tel"
                                            required
                                            placeholder="+1 234 567 890"
                                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                        />
                                    </div>
                                </div>

                                <div className="md:col-span-2 text-left">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Current Address</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            required
                                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none"
                                            value={formData.address}
                                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section: Donation */}
                        <div>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <div className="h-px bg-gray-200 flex-1"></div>
                                Donation Preferences
                                <div className="h-px bg-gray-200 flex-1"></div>
                            </h3>
                            <div className="space-y-6">
                                <div className="text-left">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Blood Group</label>
                                    <div className="relative max-w-sm">
                                        <Droplet className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <select
                                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none appearance-none font-bold text-red-600"
                                            value={formData.bloodGroup}
                                            onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}
                                        >
                                            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                                                <option key={bg} value={bg}>{bg}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="text-left">
                                    <label className="block text-sm font-semibold text-gray-700 mb-4">Willing to donate:</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {/* Blood Checkbox */}
                                        <label className={cn(
                                            "flex items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer",
                                            formData.donationPreferences.blood ? "bg-red-50 border-red-500 shadow-sm" : "bg-white border-gray-100"
                                        )}>
                                            <input 
                                                type="checkbox" 
                                                className="hidden" 
                                                checked={formData.donationPreferences.blood}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    donationPreferences: { ...formData.donationPreferences, blood: e.target.checked }
                                                })}
                                            />
                                            <Droplet className={cn("w-5 h-5", formData.donationPreferences.blood ? "text-red-600" : "text-gray-300")} />
                                            <span className={cn("text-xs font-bold", formData.donationPreferences.blood ? "text-red-900" : "text-gray-500")}>Blood</span>
                                        </label>

                                        {/* Organ Options */}
                                        {['Kidney', 'Liver', 'Heart', 'Cornea', 'Lungs'].map(organ => (
                                            <label key={organ} className={cn(
                                                "flex items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer",
                                                formData.donationPreferences.organs?.includes(organ) ? "bg-blue-50 border-blue-500 shadow-sm" : "bg-white border-gray-100"
                                            )}>
                                                <input 
                                                    type="checkbox" 
                                                    className="hidden" 
                                                    checked={formData.donationPreferences.organs?.includes(organ)}
                                                    onChange={() => handleOrganToggle(organ)}
                                                />
                                                <Activity className={cn("w-5 h-5", formData.donationPreferences.organs?.includes(organ) ? "text-blue-600" : "text-gray-300")} />
                                                <span className={cn("text-xs font-bold", formData.donationPreferences.organs?.includes(organ) ? "text-blue-900" : "text-gray-500")}>{organ}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section: Bio */}
                        <div className="text-left">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <div className="h-px bg-gray-200 flex-1"></div>
                                Bio / Message
                                <div className="h-px bg-gray-200 flex-1"></div>
                            </h3>
                            <div className="relative">
                                <textarea
                                    className="w-full p-6 bg-gray-50 border border-gray-200 rounded-3xl focus:ring-2 focus:ring-red-500 outline-none text-sm leading-relaxed min-h-[150px] resize-none"
                                    placeholder="Write a short bio or describe your willingness to help others..."
                                    value={formData.bio}
                                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                    maxLength={500}
                                />
                                <div className="absolute bottom-4 right-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    {formData.bio.length} / 500
                                </div>
                            </div>
                        </div>

                        {/* Availability Toggle */}
                        <div className="md:col-span-2 space-y-4">
                            <div className="flex items-center justify-between p-6 bg-gray-900 rounded-3xl border border-gray-800 shadow-lg shadow-gray-200">
                                <div>
                                    <p className="font-bold text-white uppercase tracking-wider text-xs">Availability Status</p>
                                    <p className="text-[10px] text-gray-400 mt-1">Appear as an active donor in our search network</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="sr-only peer"
                                        checked={formData.availability}
                                        onChange={(e) => setFormData({...formData, availability: e.target.checked})}
                                    />
                                    <div className="w-12 h-6.5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-600 after:border after:rounded-full after:h-5.5 after:w-5.5 after:transition-all peer-checked:bg-green-500"></div>
                                </label>
                            </div>
                        </div>

                        <div className="md:col-span-2 pt-4">
                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full py-4.5 bg-red-600 text-white rounded-2xl font-bold text-lg hover:bg-red-700 transition-all shadow-xl shadow-red-200 flex items-center justify-center gap-2 group"
                            >
                                {saving ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />}
                                {saving ? 'Saving Changes...' : 'Save Profile Details'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfileEdit;
