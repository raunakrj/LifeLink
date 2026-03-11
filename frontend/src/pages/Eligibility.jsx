import React from 'react';
import { ShieldCheck, Scale, Heart, AlertCircle, CheckCircle2 } from 'lucide-react';

const Eligibility = () => {
    const rules = [
        {
            title: "Age Requirements",
            desc: "Donors must be between 18 and 65 years of age.",
            icon: <Calendar className="w-6 h-6 text-red-500" />,
            rules: ["Aged between 18-65 years", "Parental consent for 17 year olds (varies by region)", "Senior donors up to 70 with physician approval"]
        },
        {
            title: "Physical Health",
            desc: "Basic health markers for safe donation.",
            icon: <Activity className="w-6 h-6 text-red-500" />,
            rules: ["Minimum weight of 50kg (110 lbs)", "Normal heartbeat and blood pressure", "Hemoglobin count of at least 12.5 g/dl"]
        },
        {
            title: "Medical History",
            desc: "To ensure safety of both donor and receiver.",
            icon: <ShieldCheck className="w-6 h-6 text-red-500" />,
            rules: ["No recent heavy medication", "No history of Hepatitis B/C", "Wait 6 months after major surgery"]
        }
    ];

    return (
        <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
            <div className="text-center mb-16">
                <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-4">Are you Eligible?</h1>
                <p className="text-xl text-gray-500 max-w-2xl mx-auto">Quickly check if you can save a life today. Standard health guidelines for blood and organ donation.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                {rules.map((item, idx) => (
                    <div key={idx} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-50 flex flex-col items-center text-center">
                        <div className="bg-red-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                            {item.icon || <Heart className="w-6 h-6 text-red-500" />}
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                        <p className="text-gray-500 mb-8">{item.desc}</p>
                        <ul className="space-y-3 text-left w-full">
                            {item.rules.map((r, i) => (
                                <li key={i} className="flex gap-3 text-sm text-gray-700">
                                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                                    {r}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="bg-red-600 rounded-[3rem] p-8 md:p-16 text-white text-center relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Still Unsure about Eligibility?</h2>
                    <p className="text-red-100 text-lg mb-10 max-w-xl mx-auto">Talk to our medical AI assistant to get instant answers regarding your specific medical conditions.</p>
                    <button className="bg-white text-red-600 px-10 py-4 rounded-2xl font-extrabold text-lg hover:bg-red-50 transition-all active:scale-95 shadow-2xl">
                        Chat with Medical AI
                    </button>
                </div>
                <Heart className="absolute -bottom-10 -right-10 w-64 h-64 text-red-500/30 rotate-12" />
            </div>
        </div>
    );
};

const Calendar = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
);

const Activity = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
);

export default Eligibility;
