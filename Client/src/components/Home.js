import React, { useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaPlay, FaStar, FaCalendarAlt, FaTicketAlt } from 'react-icons/fa';
import { useMovie } from '../context/MovieContext';

const Home = () => {
  const { movies, loading, fetchMovies } = useMovie();

  useEffect(() => {
    fetchMovies({ type: 'now-showing' });
  }, []);

  const featuredMovies = movies.slice(0, 6);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <h1 className="display-4 fw-bold mb-4">
                Book Your Favorite Movies
              </h1>
              <p className="lead mb-4">
                Experience the magic of cinema with our easy-to-use movie booking platform.
                Choose from the latest releases and secure your seats instantly.
              </p>
              <Button as={Link} to="/movies" size="lg" className="me-3">
                <FaPlay className="me-2" />
                Browse Movies
              </Button>
              <Button as={Link} to="/register" variant="outline-light" size="lg">
                Get Started
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Featured Movies Section */}
      <section className="py-5">
        <Container>
          <Row className="mb-4">
            <Col>
              <h2 className="text-center text-white mb-4">Now Showing</h2>
            </Col>
          </Row>
          
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner-border text-light" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <Row>
              {featuredMovies.map((movie) => (
                <Col key={movie._id} lg={4} md={6} className="mb-4">
                  <Card className="movie-card h-100">
                    <Card.Img
                      variant="top"
                      src={movie.poster}
                      alt={movie.title}
                      className="movie-poster"
                    />
                    <Card.Body className="d-flex flex-column">
                      <Card.Title className="fw-bold">{movie.title}</Card.Title>
                      <div className="mb-2">
                        <span className="rating">
                          <FaStar className="me-1" />
                          {movie.rating}/10
                        </span>
                        <span className="genre-badge ms-2">{movie.genre}</span>
                      </div>
                      <Card.Text className="text-muted mb-3">
                        {movie.description.substring(0, 100)}...
                      </Card.Text>
                      <div className="mt-auto">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <small className="text-muted">
                            <FaCalendarAlt className="me-1" />
                            {new Date(movie.releaseDate).toLocaleDateString()}
                          </small>
                          <small className="text-muted">{movie.duration} min</small>
                        </div>
                        <Button
                          as={Link}
                          to={`/movies/${movie._id}`}
                          variant="primary"
                          className="w-100"
                        >
                          Book Now
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-white">
        <Container>
          <Row className="text-center">
            <Col md={4} className="mb-4">
              <div className="p-4">
                <FaTicketAlt size={48} className="text-primary mb-3" />
                <h4>Easy Booking</h4>
                <p className="text-muted">
                  Book your tickets in just a few clicks with our user-friendly interface.
                </p>
              </div>
            </Col>
            <Col md={4} className="mb-4">
              <div className="p-4">
                <FaStar size={48} className="text-warning mb-3" />
                <h4>Latest Movies</h4>
                <p className="text-muted">
                  Get access to the newest releases and blockbuster movies.
                </p>
              </div>
            </Col>
            <Col md={4} className="mb-4">
              <div className="p-4">
                <FaPlay size={48} className="text-success mb-3" />
                <h4>Instant Confirmation</h4>
                <p className="text-muted">
                  Receive instant booking confirmation and e-tickets.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Home; 