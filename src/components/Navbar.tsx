import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BriefcaseIcon, LogOutIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <BriefcaseIcon className="h-8 w-8" />
              <span className="font-bold text-xl">JobHub</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/jobs" className="hover:text-indigo-200">Jobs</Link>
            {user ? (
              <>
                <span className="text-indigo-200">Welcome, {user.firstName}</span>
                {user.isAdmin && (
                  <Link to="/admin/dashboard" className="hover:text-indigo-200">
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 hover:text-indigo-200"
                >
                  <LogOutIcon className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-indigo-200">Login</Link>
                <Link 
                  to="/register" 
                  className="bg-white text-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-100"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}