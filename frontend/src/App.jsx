import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Donors from './pages/Donors';
import Register from './pages/Register';
import Eligibility from './pages/Eligibility';
import HowItWorks from './pages/HowItWorks';
import Chatbot from './components/Chatbot';
import ProfileEdit from './pages/ProfileEdit';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import DonorProfile from './pages/DonorProfile';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-white selection:bg-red-100 selection:text-red-900">
        <Navbar />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/donors" element={<Donors />} />
          <Route path="/eligibility" element={<Eligibility />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/edit-profile" element={<ProfileEdit />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/donor/:id" element={<DonorProfile />} />
        </Routes>
        
        <Chatbot />
      </div>
    </AuthProvider>
  );
}

export default App;
