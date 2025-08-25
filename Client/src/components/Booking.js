import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, Alert, Badge } from 'react-bootstrap';
import { FaTicketAlt, FaCreditCard, FaPaypal, FaMoneyBillWave } from 'react-icons/fa';
import { useMovie } from '../context/MovieContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Booking = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const { createBooking } = useMovie();
  const { isAuthenticated } = useAuth();

  const [show, setShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadShowData();
  }, [showId]);

  const loadShowData = async () => {
    try {
      // In a real app, you would fetch show data from API
      // For demo purposes, creating mock data
      setShow({
        _id: showId,
        movie: {
          title: 'F1',
          poster: 'https://via.placeholder.com/300x450'
        },
        theater: {
          name: 'Sample Theater',
          location: 'Sample Location'
        },
        screen: 'Screen 1',
        date: '2024-01-15',
        time: '7:00 PM',
        price: 100,
        totalSeats: 100,
        availableSeats: 85,
        bookedSeats: ['A1', 'A2', 'B5', 'C3', 'D7']
      });
    } catch (error) {
      console.error('Error loading show data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSeats = () => {
    const seats = [];
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const cols = 12;

    for (let row of rows) {
      for (let col = 1; col <= cols; col++) {
        const seatId = `${row}${col}`;
        const isBooked = show.bookedSeats.includes(seatId);
        seats.push({
          id: seatId,
          row: row,
          col: col,
          isBooked: isBooked,
          isSelected: selectedSeats.includes(seatId)
        });
      }
    }
    return seats;
  };

  const handleSeatClick = (seatId) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const calculateTotal = () => {
    return selectedSeats.length * show.price;
  };

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat');
      return;
    }

    setBookingLoading(true);
    try {
      const bookingData = {
        showId: show._id,
        seats: selectedSeats,
        totalAmount: calculateTotal(),
        paymentMethod: paymentMethod
      };

      await createBooking(bookingData);
      toast.success('Booking successful!');
      navigate('/my-bookings');
    } catch (error) {
      toast.error('Booking failed. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

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

  if (!show) {
    return (
      <Container className="py-5 mt-5">
        <Alert variant="danger">Show not found!</Alert>
      </Container>
    );
  }

  const seats = generateSeats();

  return (
    <Container className="py-5 mt-5">
      <Row>
        <Col lg={8}>
          <Card className="booking-summary mb-4">
            <Card.Header>
              <h4 className="mb-0">
                <FaTicketAlt className="me-2" />
                Select Your Seats
              </h4>
            </Card.Header>
            <Card.Body>
              <div className="screen mb-4">
                <h5 className="text-center mb-0">SCREEN</h5>
              </div>

              <div className="text-center mb-4">
                {seats.map((seat) => (
                  <button
                    key={seat.id}
                    className={`seat ${seat.isBooked ? 'booked' : seat.isSelected ? 'selected' : 'available'}`}
                    onClick={() => !seat.isBooked && handleSeatClick(seat.id)}
                    disabled={seat.isBooked}
                    title={seat.id}
                  >
                    {seat.id}
                  </button>
                ))}
              </div>

              <div className="row text-center">
                <div className="col-md-4">
                  <div className="d-flex align-items-center justify-content-center mb-2">
                    <div className="seat available me-2"></div>
                    <span>Available</span>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="d-flex align-items-center justify-content-center mb-2">
                    <div className="seat selected me-2"></div>
                    <span>Selected</span>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="d-flex align-items-center justify-content-center mb-2">
                    <div className="seat booked me-2"></div>
                    <span>Booked</span>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="booking-summary">
            <Card.Header>
              <h5 className="mb-0">Booking Summary</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <h6>{show.movie.title}</h6>
                <p className="text-muted mb-1">
                  {show.theater.name} - {show.theater.location}
                </p>
                <p className="text-muted mb-1">
                  Screen {show.screen} | {show.time}
                </p>
                <p className="text-muted">
                  {new Date(show.date).toLocaleDateString()}
                </p>
              </div>

              <div className="mb-3">
                <h6>Selected Seats</h6>
                {selectedSeats.length > 0 ? (
                  <div className="d-flex flex-wrap gap-1">
                    {selectedSeats.map(seat => (
                      <Badge key={seat} bg="primary">{seat}</Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted">No seats selected</p>
                )}
              </div>

              <div className="mb-3">
                <h6>Payment Method</h6>
                <Form.Select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="card">
                    <FaCreditCard className="me-2" />
                    Credit Card
                  </option>
                  <option value="paypal">
                    <FaPaypal className="me-2" />
                    PayPal
                  </option>
                  <option value="cash">
                    <FaMoneyBillWave className="me-2" />
                    Cash at Theater
                  </option>
                </Form.Select>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span>Price per seat:</span>
                  <span>${show.price}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Number of seats:</span>
                  <span>{selectedSeats.length}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between fw-bold">
                  <span>Total:</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>

              <Button
                variant="primary"
                className="w-100"
                onClick={handleBooking}
                disabled={selectedSeats.length === 0 || bookingLoading}
              >
                {bookingLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FaTicketAlt className="me-2" />
                    Confirm Booking
                  </>
                )}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Booking; 