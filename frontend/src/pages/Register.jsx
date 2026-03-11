import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, User, Mail, Lock, Phone, Droplet, Calendar, MapPin, Loader2 } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Donor',
        age: '',
        bloodGroup: '',
        phone: '',
        address: '',
        donationPreferences: {
            blood: true,
            organs: []
        },
        location: {
            type: 'Point',
            coordinates: [77.2090, 28.6139] // Delhi default
        }
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Basic Validation
        if (!formData.bloodGroup) {
            alert('Please select a blood group');
            return;
        }

        const ageNum = parseInt(formData.age);
        if (isNaN(ageNum) || ageNum < 18) {
            alert('Please enter a valid age (18+)');
            return;
        }

        setIsSubmitting(true);
        try {
            await register({
                ...formData,
                age: ageNum
            });
            navigate('/');
        } catch (error) {
            alert(error.response?.data?.message || 'Registration failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen py-32 flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl shadow-red-100 border border-gray-100 p-8">
                <div className="text-center mb-10">
                    <div className="bg-red-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-200">
                        <Heart className="text-white w-8 h-8 fill-current" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">Join LifeLink</h2>
                    <p className="text-gray-500 mt-2">Become part of our life-saving network</p>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                required
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="email"
                                required
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none"
                                placeholder="john@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="tel"
                                required
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none"
                                placeholder="+91 9876543210"
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                required
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none"
                                placeholder="City, State, Country"
                                value={formData.address}
                                onChange={(e) => setFormData({...formData, address: e.target.value})}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="password"
                                required
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Age</label>
                        <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="number"
                                required
                                min="18"
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none"
                                placeholder="25"
                                value={formData.age}
                                onChange={(e) => setFormData({...formData, age: e.target.value})}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Blood Group</label>
                        <div className="relative">
                            <Droplet className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <select
                                required
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none appearance-none"
                                value={formData.bloodGroup}
                                onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}
                            >
                                <option value="">Select Group</option>
                                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                                    <option key={bg} value={bg}>{bg}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                        <select
                            required
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none"
                            value={formData.role}
                            onChange={(e) => setFormData({...formData, role: e.target.value})}
                        >
                            <option value="Donor">Donor</option>
                            <option value="Receiver">Receiver</option>
                            <option value="Both">Both</option>
                        </select>
                    </div>

                    {['Donor', 'Both'].includes(formData.role) && (
                        <div className="md:col-span-2 bg-red-50 p-6 rounded-3xl border border-red-100 mb-4">
                            <label className="block text-sm font-bold text-red-900 mb-4 text-left">I am willing to donate:</label>
                            <div className="flex flex-wrap gap-4">
                                {['Kidney', 'Liver', 'Heart', 'Cornea', 'Lungs'].map(organ => (
                                    <label key={organ} className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-red-200 cursor-pointer hover:bg-red-100 transition-colors">
                                        <input 
                                            type="checkbox"
                                            className="accent-red-600"
                                            checked={formData.donationPreferences.organs.includes(organ)}
                                            onChange={(e) => {
                                                const organs = e.target.checked 
                                                    ? [...formData.donationPreferences.organs, organ]
                                                    : formData.donationPreferences.organs.filter(o => o !== organ);
                                                setFormData({
                                                    ...formData,
                                                    donationPreferences: { ...formData.donationPreferences, organs }
                                                });
                                            }}
                                        />
                                        <span className="text-sm font-medium text-gray-700">{organ}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="md:col-span-2">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold text-lg hover:bg-red-700 transition-all shadow-xl shadow-red-200 flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" /> : 'Create Account'}
                        </button>
                    </div>
                </form>

                <p className="text-center mt-8 text-gray-500">
                    Already have an account? <Link to="/login" className="text-red-600 font-bold hover:underline">Log In</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
