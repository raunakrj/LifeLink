import { Heart, Menu, User, Bell, LogOut, MoreVertical, Edit3, MessageSquare } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';
import { useState, useRef, useEffect } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = () => {
    logout();
    setShowMenu(false);
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-red-100 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-red-500 p-2 rounded-lg shadow-lg shadow-red-200">
            <Heart className="text-white w-6 h-6 fill-current" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-gray-900">
            Life<span className="text-red-600">Link</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link to="/donors" className="hover:text-red-600 transition-colors">Find Donors</Link>
          <Link to="/eligibility" className="hover:text-red-600 transition-colors">Eligibility</Link>
          <Link to="/how-it-works" className="hover:text-red-600 transition-colors">How it Works</Link>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3 relative" ref={menuRef}>
              <Link to="/messages" className="p-2 text-gray-400 hover:text-red-500 transition-colors relative">
                <MessageSquare className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-600 rounded-full border-2 border-white"></span>
              </Link>
              <button className="p-2 text-gray-400 hover:text-red-500 transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-600 rounded-full border-2 border-white"></span>
              </button>
              
              <div className="flex items-center gap-2 bg-gray-50 pl-3 pr-1 py-1.5 rounded-full border border-gray-100">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold uppercase">
                  {user.name.charAt(0)}
                </div>
                <span className="text-sm font-bold text-gray-700 hidden sm:block">{user.name}</span>
                <button 
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1.5 hover:bg-gray-200 rounded-full transition-colors ml-1 text-gray-500"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {showMenu && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <button 
                      onClick={() => { navigate('/profile'); setShowMenu(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      My Profile
                    </button>
                    <button 
                      onClick={() => { navigate('/edit-profile'); setShowMenu(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit Profile
                    </button>
                    <div className="h-px bg-gray-100 my-1 mx-2"></div>
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <button 
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 bg-red-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-red-700 transition-all shadow-md shadow-red-100 hover:shadow-lg active:scale-95"
            >
              <User className="w-4 h-4" />
              Sign In
            </button>
          )}
          <button className="md:hidden p-2 text-gray-600">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
