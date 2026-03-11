import React from 'react';
import { ArrowRight, Droplets, Activity, HeartPulse } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="relative pt-32 pb-20 overflow-hidden bg-white">
      {/* Background Blobs */}
      <div className="absolute top-0 -left-20 w-72 h-72 bg-red-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute top-0 -right-20 w-72 h-72 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-700"></div>

      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-600 text-sm font-semibold mb-6 border border-red-100">
            <Activity className="w-4 h-4" />
            Real-time Emergency Response
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">
            Connecting Life, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-pink-600">
              One Link at a Time.
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-xl text-gray-500 mb-10 leading-relaxed">
            The world's most advanced AI-powered platform for blood and organ donation. 
            Providing real-time matching, transit tracking, and instant notifications 
            when seconds count.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => navigate('/donors')}
              className="w-full sm:w-auto px-8 py-4 bg-red-600 text-white rounded-2xl font-bold text-lg hover:bg-red-700 transition-all shadow-xl shadow-red-200 flex items-center justify-center gap-2 group"
            >
              Find Immediate Donor
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 border-2 border-gray-100 rounded-2xl font-bold text-lg hover:border-red-200 transition-all flex items-center justify-center gap-2"
            >
              Register as Donor
              <HeartPulse className="w-5 h-5 text-red-500" />
            </button>
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:border-red-100 transition-colors group">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4 text-red-600 group-hover:scale-110 transition-transform">
                <Droplets className="w-6 h-6" />
              </div>
              <div className="text-2xl font-bold text-gray-900">2,400+</div>
              <div className="text-sm text-gray-500">Daily Matches</div>
            </div>
            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:border-red-100 transition-colors group">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4 text-red-600 group-hover:scale-110 transition-transform">
                <HeartPulse className="w-6 h-6" />
              </div>
              <div className="text-2xl font-bold text-gray-900">120k+</div>
              <div className="text-sm text-gray-500">Lives Saved</div>
            </div>
            {/* Add more stats if needed */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
