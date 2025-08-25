import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaSearch, FaStar, FaCalendarAlt, FaFilter } from 'react-icons/fa';
import { useMovie } from '../context/MovieContext';

const Movies = () => {
  const { movies, loading, fetchMovies } = useMovie();
  const [filters, setFilters] = useState({
    type: 'now-showing',
    genre: '',
    language: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMovies(filters);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movie.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 'Thriller'];
  const languages = ['English', 'Hindi', 'Spanish', 'French', 'German'];

  return (
    <Container className="py-5 mt-5">
      <Row className="mb-4">
        <Col>
          <h1 className="text-center text-white mb-4">Movies</h1>
        </Col>
      </Row>

      {/* Filters and Search */}
      <Row className="mb-4">
        <Col lg={8} md={6} className="mb-3">
          <InputGroup>
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search movies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col lg={4} md={6} className="mb-3">
          <Form.Select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
          >
            <option value="now-showing">Now Showing</option>
            <option value="coming-soon">Coming Soon</option>
          </Form.Select>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6} className="mb-3">
          <Form.Select
            value={filters.genre}
            onChange={(e) => handleFilterChange('genre', e.target.value)}
          >
            <option value="">All Genres</option>
            {genres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </Form.Select>
        </Col>
        <Col md={6} className="mb-3">
          <Form.Select
            value={filters.language}
            onChange={(e) => handleFilterChange('language', e.target.value)}
          >
            <option value="">All Languages</option>
            {languages.map(language => (
              <option key={language} value={language}>{language}</option>
            ))}
          </Form.Select>
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
          {filteredMovies.map((movie) => (
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
                    {movie.description.substring(0, 120)}...
                  </Card.Text>
                  <div className="mt-auto">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <small className="text-muted">
                        <FaCalendarAlt className="me-1" />
                        {new Date(movie.releaseDate).toLocaleDateString()}
                      </small>
                      <small className="text-muted">{movie.duration} min</small>
                    </div>
                    <div className="d-flex gap-2">
                      <Button
                        as={Link}
                        to={`/movies/${movie._id}`}
                        variant="primary"
                        className="flex-fill"
                      >
                        View Details
                      </Button>
                      <Button
                        as={Link}
                        to={`/movies/${movie._id}`}
                        variant="outline-primary"
                      >
                        Book
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {!loading && filteredMovies.length === 0 && (
        <div className="text-center text-white">
          <h4>No movies found</h4>
          <p>Try adjusting your search or filters</p>
        </div>
      )}
    </Container>
  );
};

export default Movies; 