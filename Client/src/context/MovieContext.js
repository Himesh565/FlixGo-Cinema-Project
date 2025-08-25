import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const MovieContext = createContext();

export const useMovie = () => {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error('useMovie must be used within a MovieProvider');
  }
  return context;
};

export const MovieProvider = ({ children }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMovies = async (filters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      });

      const response = await axios.get(`/api/movies?${params.toString()}`);
      setMovies(response.data);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMovieById = async (id) => {
    try {
      const response = await axios.get(`/api/movies/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching movie:', error);
      return null;
    }
  };

  const fetchTheaters = async () => {
    try {
      const response = await axios.get('/api/theaters');
      return response.data;
    } catch (error) {
      console.error('Error fetching theaters:', error);
      return [];
    }
  };

  const fetchShows = async (theaterId, date, movieId) => {
    try {
      const params = new URLSearchParams();
      if (date) params.append('date', date);
      if (movieId) params.append('movieId', movieId);

      const response = await axios.get(`/api/theaters/${theaterId}/shows?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching shows:', error);
      return [];
    }
  };

  const createBooking = async (bookingData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/bookings', bookingData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const fetchUserBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/bookings/my-bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      return [];
    }
  };

  const cancelBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`/api/bookings/${bookingId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    movies,
    loading,
    fetchMovies,
    fetchMovieById,
    fetchTheaters,
    fetchShows,
    createBooking,
    fetchUserBookings,
    cancelBooking
  };

  return (
    <MovieContext.Provider value={value}>
      {children}
    </MovieContext.Provider>
  );
}; 