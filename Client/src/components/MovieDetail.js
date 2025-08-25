import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Alert } from 'react-bootstrap';
import { FaStar, FaCalendarAlt, FaClock, FaUser, FaPlay, FaTicketAlt } from 'react-icons/fa';
import { useMovie } from '../context/MovieContext';
import { useAuth } from '../context/AuthContext';

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchMovieById, fetchTheaters, fetchShows } = useMovie();
  const { isAuthenticated } = useAuth();
  
  const [movie, setMovie] = useState(null);
  const [theaters, setTheaters] = useState([]);
  const [shows, setShows] = useState([]);
  const [selectedTheater, setSelectedTheater] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMovieData();
  }, [id]);

  const loadMovieData = async () => {
    try {
      setLoading(true);
      const movieData = await fetchMovieById(id);
      const theatersData = await fetchTheaters();
      
      setMovie(movieData);
      setTheaters(theatersData);
      
      if (theatersData.length > 0) {
        setSelectedTheater(theatersData[0]._id);
      }
    } catch (error) {
      console.error('Error loading movie data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedTheater && selectedDate) {
      loadShows();
    }
  }, [selectedTheater, selectedDate]);

  const loadShows = async () => {
    try {
      const showsData = await fetchShows(selectedTheater, selectedDate, id);
      setShows(showsData);
    } catch (error) {
      console.error('Error loading shows:', error);
    }
  };

  const handleBookNow = (showId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate(`/booking/${showId}`);
  };

  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
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

  if (!movie) {
    return (
      <Container className="py-5 mt-5">
        <Alert variant="danger">
          Movie not found!
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5 mt-5">
      <Row>
        <Col lg={4} md={5} className="mb-4">
          <Card className="movie-card">
            <Card.Img
              variant="top"
              src={movie.poster}
              alt={movie.title}
              className="movie-poster"
            />
          </Card>
        </Col>
        
        <Col lg={8} md={7}>
          <div className="movie-details">
            <h1 className="mb-3">{movie.title}</h1>
            
            <div className="mb-3">
              <Badge bg="primary" className="me-2">{movie.genre}</Badge>
              <Badge bg="secondary" className="me-2">{movie.language}</Badge>
              <span className="rating ms-2">
                <FaStar className="me-1" />
                {movie.rating}/10
              </span>
            </div>
            
            <p className="mb-3">{movie.description}</p>
            
            <Row className="mb-4">
              <Col md={6}>
                <div className="d-flex align-items-center mb-2">
                  <FaClock className="me-2 text-muted" />
                  <span>{movie.duration} minutes</span>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <FaCalendarAlt className="me-2 text-muted" />
                  <span>Released: {new Date(movie.releaseDate).toLocaleDateString()}</span>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <FaUser className="me-2 text-muted" />
                  <span>Director: {movie.director}</span>
                </div>
              </Col>
              <Col md={6}>
                <h6>Cast:</h6>
                <p className="text-muted">{movie.cast.join(', ')}</p>
              </Col>
            </Row>

            {movie.trailer && (
              <div className="mb-4">
                <Button variant="outline-primary" href={movie.trailer} target="_blank">
                  <FaPlay className="me-2" />
                  Watch Trailer
                </Button>
              </div>
            )}
          </div>
        </Col>
      </Row>

      {/* Booking Section */}
      <Row className="mt-5">
        <Col>
          <Card className="booking-summary">
            <Card.Header>
              <h4 className="mb-0">
                <FaTicketAlt className="me-2" />
                Book Tickets
              </h4>
            </Card.Header>
            <Card.Body>
              <Row className="mb-4">
                <Col md={6} className="mb-3">
                  <label className="form-label">Select Theater</label>
                  <select
                    className="form-select"
                    value={selectedTheater}
                    onChange={(e) => setSelectedTheater(e.target.value)}
                  >
                    {theaters.map(theater => (
                      <option key={theater._id} value={theater._id}>
                        {theater.name} - {theater.location}
                      </option>
                    ))}
                  </select>
                </Col>
                <Col md={6} className="mb-3">
                  <label className="form-label">Select Date</label>
                  <select
                    className="form-select"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  >
                    <option value="">Choose a date</option>
                    {getAvailableDates().map(date => (
                      <option key={date} value={date}>
                        {new Date(date).toLocaleDateString()}
                      </option>
                    ))}
                  </select>
                </Col>
              </Row>

              {shows.length > 0 ? (
                <Row>
                  {shows.map(show => (
                    <Col key={show._id} md={4} className="mb-3">
                      <Card className="h-100">
                        <Card.Body className="text-center">
                          <h6>{show.time}</h6>
                          <p className="text-muted mb-2">Screen {show.screen}</p>
                          <p className="text-success fw-bold">${show.price}</p>
                          <p className="text-muted small">
                            {show.availableSeats} seats available
                          </p>
                          <Button
                            variant="primary"
                            onClick={() => handleBookNow(show._id)}
                            disabled={show.availableSeats === 0}
                          >
                            {show.availableSeats === 0 ? 'Sold Out' : 'Book Now'}
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : selectedDate && (
                <Alert variant="info">
                  No shows available for the selected date and theater.
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default MovieDetail; 