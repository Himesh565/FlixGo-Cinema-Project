import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import axios from '../utils/axios';
import { toast } from 'react-toastify';

const AdminShows = () => {
  // FIX: All hooks are now at the top-level of the component.
  const { user, isAuthenticated } = useAuth();
  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingShow, setEditingShow] = useState(null);
  const [formData, setFormData] = useState({
    movieId: '',
    theaterId: '',
    screenNumber: '',
    date: '',
    time: '',
    price: '',
    totalSeats: ''
  });

  const fetchData = async () => {
    try {
      const [showsRes, moviesRes, theatersRes] = await Promise.all([
        axios.get('/api/shows'),
        axios.get('/api/movies'),
        axios.get('/api/theaters')
      ]);
      setShows(showsRes.data);
      setMovies(moviesRes.data);
      setTheaters(theatersRes.data);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // We only want to fetch data if the user is authenticated and an admin.
    if (isAuthenticated && user?.isAdmin) {
      fetchData();
    } else {
      // If not authenticated, we can stop the loading indicator.
      setLoading(false);
    }
  }, [isAuthenticated, user]); // Rerun effect if auth state changes

  // FIX: The conditional return has been moved AFTER all hook calls.
  if (!isAuthenticated || !user?.isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingShow) {
        await axios.put(`/api/shows/${editingShow._id}`, formData);
        toast.success('Show updated successfully!');
      } else {
        await axios.post('/api/shows', formData);
        toast.success('Show added successfully!');
      }
      setShowModal(false);
      setEditingShow(null);
      resetForm();
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (show) => {
    setEditingShow(show);
    setFormData({
      movieId: show.movie?._id || show.movieId,
      theaterId: show.theater?._id || show.theaterId,
      screenNumber: show.screen || show.screenNumber,
      date: show.date?.split('T')[0] || '',
      time: show.time,
      price: show.price,
      totalSeats: show.totalSeats
    });
    setShowModal(true);
  };

  const handleDelete = async (showId) => {
    if (window.confirm('Are you sure you want to delete this show?')) {
      try {
        await axios.delete(`/api/shows/${showId}`);
        toast.success('Show deleted successfully!');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete show');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      movieId: '',
      theaterId: '',
      screenNumber: '',
      date: '',
      time: '',
      price: '',
      totalSeats: ''
    });
  };

  const openAddModal = () => {
    setEditingShow(null);
    resetForm();
    setShowModal(true);
  };

  const getMovieTitle = (movieId) => {
    const movie = movies.find(m => m._id === movieId);
    return movie ? movie.title : 'Unknown Movie';
  };

  const getTheaterName = (theaterId) => {
    const theater = theaters.find(t => t._id === theaterId);
    return theater ? theater.name : 'Unknown Theater';
  };

  const getMovieTitleFromShow = (show) => {
    if (show.movie?.title) return show.movie.title;
    if (show.movieId) return getMovieTitle(show.movieId);
    return 'Unknown Movie';
  };

  const getTheaterNameFromShow = (show) => {
    if (show.theater?.name) return show.theater.name;
    if (show.theaterId) return getTheaterName(show.theaterId);
    return 'Unknown Theater';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shows Management</h1>
          <button
            onClick={openAddModal}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Add New Show
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Movie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Theater
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Screen
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Seats
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {shows.map((show) => (
                  <tr key={show._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {getMovieTitleFromShow(show)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getTheaterNameFromShow(show)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {show.screen || show.screenNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(show.date).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">{show.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{show.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {show.totalSeats}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(show)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(show._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {editingShow ? 'Edit Show' : 'Add New Show'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Movie</label>
                    <select
                      value={formData.movieId}
                      onChange={(e) => setFormData({...formData, movieId: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    >
                      <option value="">Select Movie</option>
                      {movies.map((movie) => (
                        <option key={movie._id} value={movie._id}>
                          {movie.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Theater</label>
                    <select
                      value={formData.theaterId}
                      onChange={(e) => setFormData({...formData, theaterId: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    >
                      <option value="">Select Theater</option>
                      {theaters.map((theater) => (
                        <option key={theater._id} value={theater._id}>
                          {theater.name} - {theater.location}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Screen Number</label>
                      <input
                        type="number"
                        value={formData.screenNumber}
                        onChange={(e) => setFormData({...formData, screenNumber: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Total Seats</label>
                      <input
                        type="number"
                        value={formData.totalSeats}
                        onChange={(e) => setFormData({...formData, totalSeats: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date</label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Time</label>
                      <input
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData({...formData, time: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                    >
                      {editingShow ? 'Update' : 'Add'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminShows;