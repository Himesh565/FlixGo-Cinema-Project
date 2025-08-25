import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert } from 'react-bootstrap';
import { FaTicketAlt, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaTimes } from 'react-icons/fa';
import { useMovie } from '../context/MovieContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const MyBookings = () => {
  const { fetchUserBookings, cancelBooking } = useMovie();
  const { isAuthenticated } = useAuth();
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      loadBookings();
    }
  }, [isAuthenticated]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const bookingsData = await fetchUserBookings();
      setBookings(bookingsData);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await cancelBooking(bookingId);
      toast.success('Booking cancelled successfully!');
      loadBookings(); // Reload bookings
    } catch (error) {
      toast.error('Failed to cancel booking. Please try again.');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <Badge bg="success">Confirmed</Badge>;
      case 'cancelled':
        return <Badge bg="danger">Cancelled</Badge>;
      case 'pending':
        return <Badge bg="warning">Pending</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  if (!isAuthenticated) {
    return (
      <Container className="py-5 mt-5">
        <Alert variant="warning">
          Please log in to view your bookings.
        </Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container className="py-5 mt-5">
        <div className="loading-spinner">
          <div className="spinner-border text-light" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5 mt-5">
      <Row className="mb-4">
        <Col>
          <h1 className="text-center text-white mb-4">
            <FaTicketAlt className="me-2" />
            My Bookings
          </h1>
        </Col>
      </Row>

      {bookings.length === 0 ? (
        <Row>
          <Col>
            <Card className="booking-summary">
              <Card.Body className="text-center">
                <h5 className="text-muted">No bookings found</h5>
                <p className="text-muted">
                  You haven't made any bookings yet. Start by browsing our movies!
                </p>
                <Button href="/movies" variant="primary">
                  Browse Movies
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : (
        <Row>
          {bookings.map((booking) => (
            <Col key={booking._id} lg={6} md={12} className="mb-4">
              <Card className="booking-summary h-100">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-0">Booking #{booking.bookingCode}</h6>
                    <small className="text-muted">
                      {new Date(booking.bookingDate).toLocaleDateString()}
                    </small>
                  </div>
                  {getStatusBadge(booking.status)}
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={4} className="mb-3">
                      <img
                        src={booking.show?.movie?.poster || 'https://via.placeholder.com/150x200'}
                        alt="Movie Poster"
                        className="img-fluid rounded"
                        style={{ width: '100%', maxWidth: '150px' }}
                      />
                    </Col>
                    <Col md={8}>
                      <h6 className="fw-bold">{booking.show?.movie?.title}</h6>
                      <div className="mb-2">
                        <small className="text-muted">
                          <FaMapMarkerAlt className="me-1" />
                          {booking.show?.theater?.name} - {booking.show?.theater?.location}
                        </small>
                      </div>
                      <div className="mb-2">
                        <small className="text-muted">
                          <FaCalendarAlt className="me-1" />
                          {new Date(booking.show?.date).toLocaleDateString()}
                        </small>
                      </div>
                      <div className="mb-2">
                        <small className="text-muted">
                          <FaClock className="me-1" />
                          {booking.show?.time} | Screen {booking.show?.screen}
                        </small>
                      </div>
                      <div className="mb-2">
                        <small className="text-muted">
                          <FaTicketAlt className="me-1" />
                          Seats: {booking.seats.join(', ')}
                        </small>
                      </div>
                      <div className="mb-3">
                        <strong>Total: ${booking.totalAmount}</strong>
                      </div>
                      
                      {booking.status === 'confirmed' && (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleCancelBooking(booking._id)}
                        >
                          <FaTimes className="me-1" />
                          Cancel Booking
                        </Button>
                      )}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default MyBookings; 