import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import axios from '../utils/axios';
import { toast } from 'react-toastify';

const AdminTheaters = () => {
  // FIX: All hooks are now at the top-level of the component.
  const { user, isAuthenticated } = useAuth();
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTheater, setEditingTheater] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    address: '',
    screens: []
  });

  const fetchTheaters = async () => {
    try {
      const response = await axios.get('/api/theaters');
      setTheaters(response.data);
    } catch (error) {
      toast.error('Failed to fetch theaters');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // We only want to fetch data if the user is authenticated and an admin.
    if (isAuthenticated && user?.isAdmin) {
      fetchTheaters();
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
      // Format the data for submission
      const submitData = {
        ...formData,
        screens: formData.screens.map(screen => ({
          name: screen.name,
          capacity: parseInt(screen.capacity),
          seats: []
        }))
      };

      if (editingTheater) {
        await axios.put(`/api/theaters/${editingTheater._id}`, submitData);
        toast.success('Theater updated successfully!');
      } else {
        await axios.post('/api/theaters', submitData);
        toast.success('Theater added successfully!');
      }
      setShowModal(false);
      setEditingTheater(null);
      resetForm();
      fetchTheaters();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (theater) => {
    setEditingTheater(theater);
    setFormData({
      name: theater.name,
      location: theater.location,
      address: theater.address,
      screens: theater.screens || []
    });
    setShowModal(true);
  };

  const handleDelete = async (theaterId) => {
    if (window.confirm('Are you sure you want to delete this theater?')) {
      try {
        await axios.delete(`/api/theaters/${theaterId}`);
        toast.success('Theater deleted successfully!');
        fetchTheaters();
      } catch (error) {
        toast.error('Failed to delete theater');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      location: '',
      address: '',
      screens: []
    });
  };

  const openAddModal = () => {
    setEditingTheater(null);
    resetForm();
    setShowModal(true);
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
          <h1 className="text-3xl font-bold text-gray-900">Theaters Management</h1>
          <button
            onClick={openAddModal}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Add New Theater
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Screens
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {theaters.map((theater) => (
                  <tr key={theater._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{theater.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {theater.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {theater.address}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {theater.screens?.length || 0} screens
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(theater)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(theater._id)}
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
                  {editingTheater ? 'Edit Theater' : 'Add New Theater'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <textarea
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      rows="3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Screens</label>
                    <div className="space-y-2">
                      {formData.screens.map((screen, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Screen name"
                            value={screen.name}
                            onChange={(e) => {
                              const newScreens = [...formData.screens];
                              newScreens[index].name = e.target.value;
                              setFormData({...formData, screens: newScreens});
                            }}
                            className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                            required
                          />
                          <input
                            type="number"
                            placeholder="Capacity"
                            value={screen.capacity}
                            onChange={(e) => {
                              const newScreens = [...formData.screens];
                              newScreens[index].capacity = e.target.value;
                              setFormData({...formData, screens: newScreens});
                            }}
                            className="w-24 border border-gray-300 rounded-md px-3 py-2"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newScreens = formData.screens.filter((_, i) => i !== index);
                              setFormData({...formData, screens: newScreens});
                            }}
                            className="px-2 py-2 text-red-600 hover:text-red-800"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => setFormData({
                          ...formData, 
                          screens: [...formData.screens, { name: '', capacity: '' }]
                        })}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        + Add Screen
                      </button>
                    </div>
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
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      {editingTheater ? 'Update' : 'Add'}
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

export default AdminTheaters;