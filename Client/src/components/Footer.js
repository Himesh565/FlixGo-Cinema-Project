import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col lg={4} md={6} className="mb-4">
            <h5 className="mb-3">FlixGo</h5>
            <p className="text-muted">
              Experience the magic of cinema with our easy-to-use movie booking platform. 
              Book your favorite movies online and enjoy the best cinematic experience.
            </p>
            <div className="d-flex gap-3">
              <a href="#" className="text-white text-decoration-none">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-white text-decoration-none">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-white text-decoration-none">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-white text-decoration-none">
                <FaLinkedin size={20} />
              </a>
            </div>
          </Col>
          
          <Col lg={2} md={6} className="mb-4">
            <h6 className="mb-3">Quick Links</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="/" className="text-muted text-decoration-none">Home</a>
              </li>
              <li className="mb-2">
                <a href="/movies" className="text-muted text-decoration-none">Movies</a>
              </li>
              <li className="mb-2">
                <a href="/my-bookings" className="text-muted text-decoration-none">My Bookings</a>
              </li>
            </ul>
          </Col>
          
          <Col lg={3} md={6} className="mb-4">
            <h6 className="mb-3">Contact Info</h6>
            <div className="d-flex align-items-center mb-2">
              <FaMapMarkerAlt className="me-2" />
              <span className="text-muted">123 Cinema Street, Movie City, MC 12345</span>
            </div>
            <div className="d-flex align-items-center mb-2">
              <FaPhone className="me-2" />
              <span className="text-muted">+91 8128677032</span>
            </div>
            <div className="d-flex align-items-center mb-2">
              <FaEnvelope className="me-2" />
              <span className="text-muted">info@moviebooking.com</span>
            </div>
          </Col>
        </Row>
        
        <hr className="my-4" />
        
        <Row>
          <Col className="text-center">
            <p className="text-muted mb-0">
              © 2025 FlixGo. All rights reserved. | 
              <a href="/privacy" className="text-muted text-decoration-none ms-1">Privacy Policy</a>
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer; 