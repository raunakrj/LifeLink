import React from 'react';
import { Search, Heart, ShieldCheck, Zap, HandHeart, Repeat } from 'lucide-react';

const HowItWorks = () => {
    const steps = [
        {
            title: "Join the Network",
            desc: "Register as a donor or a patient. Our secure platform verifies profiles using AI to ensure trust and safety.",
            icon: <Heart className="w-8 h-8" />
        },
        {
            title: "Post a Request",
            desc: "In case of emergency, post a request. Our AI Matching Engine analyzes location, blood group, and urgency.",
            icon: <Zap className="w-8 h-8" />
        },
        {
            title: "AI Matching",
            desc: "Claude AI ranks donors based on proximity and suitability, notifying the most relevant life-savers instantly.",
            icon: <ShieldCheck className="w-8 h-8" />
        },
        {
            title: "Direct Connect",
            desc: "Chat securely with donors and coordinate the life-saving donation through our tracked system.",
            icon: <HandHeart className="w-8 h-8" />
        }
    ];

    return (
        <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
            <div className="text-center mb-20">
                <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-6">How LifeLink Works</h1>
                <p className="text-xl text-gray-500 max-w-3xl mx-auto">Using advanced AI to bridge the gap between emergency medical needs and self-less donors in real-time.</p>
            </div>

            <div className="relative">
                {/* Connector Line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-red-100 hidden md:block -translate-x-1/2"></div>
                
                <div className="space-y-16">
                    {steps.map((step, idx) => (
                        <div key={idx} className={`flex items-center gap-8 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                            {/* Icon Circle */}
                            <div className="absolute md:relative left-1/2 md:left-auto -translate-x-1/2 md:translate-x-0 w-20 h-20 bg-red-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-red-200 z-10 shrink-0">
                                {step.icon}
                            </div>

                            {/* Content */}
                            <div className={`flex-1 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-50 ${idx % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                                <p className="text-gray-500 leading-relaxed text-lg">
                                    {step.desc}
                                </p>
                            </div>

                            {/* Spacer for desktop */}
                            <div className="hidden md:block flex-1"></div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-24 text-center">
                <div className="inline-flex items-center gap-4 p-2 pl-6 bg-gray-50 rounded-full border border-gray-100 shadow-sm">
                    <span className="text-gray-600 font-medium">Ready to save a life?</span>
                    <button className="bg-red-600 text-white px-8 py-3 rounded-full font-bold hover:bg-red-700 transition-all active:scale-95 shadow-lg shadow-red-100">
                        Register Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HowItWorks;
