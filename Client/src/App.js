import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Navbar from './components/Navbar';
import Home from './components/Home';
import Movies from './components/Movies';
import MovieDetail from './components/MovieDetail';
import Login from './components/Login';
import Register from './components/Register';
import Booking from './components/Booking';
import MyBookings from './components/MyBookings';
import Footer from './components/Footer';

// Admin Components
import AdminDashboard from './components/AdminDashboard';
import AdminMovies from './components/AdminMovies';
import AdminTheaters from './components/AdminTheaters';
import AdminShows from './components/AdminShows';
import AdminBookings from './components/AdminBookings';
import AdminUsers from './components/AdminUsers';
import AdminAnalytics from './components/AdminAnalytics';

// Context
import { AuthProvider } from './context/AuthContext';
import { MovieProvider } from './context/MovieContext';

function App() {
  return (
    <AuthProvider>
      <MovieProvider>
        <Router>
          <div className="App">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/movies" element={<Movies />} />
                <Route path="/movies/:id" element={<MovieDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/booking/:showId" element={<Booking />} />
                <Route path="/my-bookings" element={<MyBookings />} />
                
                {/* Admin Routes */}
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/movies" element={<AdminMovies />} />
                <Route path="/admin/theaters" element={<AdminTheaters />} />
                <Route path="/admin/shows" element={<AdminShows />} />
                <Route path="/admin/bookings" element={<AdminBookings />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/analytics" element={<AdminAnalytics />} />
              </Routes>
            </main>
            <Footer />
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </div>
        </Router>
      </MovieProvider>
    </AuthProvider>
  );
}

export default App; 
