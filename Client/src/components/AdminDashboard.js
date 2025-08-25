import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user, isAuthenticated } = useAuth();

  // Redirect if not admin
  if (!isAuthenticated || !user?.isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const adminCards = [
    {
      title: 'Movies Management',
      description: 'Add, edit, and manage movies',
      icon: '🎬',
      link: '/admin/movies',
      color: 'bg-blue-500'
    },
    {
      title: 'Theaters Management',
      description: 'Manage theaters and screens',
      icon: '🏢',
      link: '/admin/theaters',
      color: 'bg-green-500'
    },
    {
      title: 'Shows Management',
      description: 'Schedule and manage movie shows',
      icon: '🎭',
      link: '/admin/shows',
      color: 'bg-purple-500'
    },
    {
      title: 'Bookings Overview',
      description: 'View and manage all bookings',
      icon: '📋',
      link: '/admin/bookings',
      color: 'bg-orange-500'
    },
    {
      title: 'Users Management',
      description: 'Manage user accounts',
      icon: '👥',
      link: '/admin/users',
      color: 'bg-red-500'
    },
    {
      title: 'Analytics',
      description: 'View booking statistics and reports',
      icon: '📊',
      link: '/admin/analytics',
      color: 'bg-indigo-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user.name}!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminCards.map((card, index) => (
            <Link
              key={index}
              to={card.link}
              className="block transform transition-all duration-200 hover:scale-105"
            >
              <div className={`${card.color} rounded-lg shadow-lg p-6 text-white`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                    <p className="text-white/90 text-sm">{card.description}</p>
                  </div>
                  <div className="text-4xl">{card.icon}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">0</div>
              <div className="text-sm text-gray-600">Total Movies</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">0</div>
              <div className="text-sm text-gray-600">Active Theaters</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">0</div>
              <div className="text-sm text-gray-600">Today's Shows</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">0</div>
              <div className="text-sm text-gray-600">Total Bookings</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 