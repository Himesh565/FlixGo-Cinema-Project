import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
import { FaUser, FaSignOutAlt, FaTicketAlt, FaCog } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const NavigationBar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <FaTicketAlt className="me-2" />
          FlixGo
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/movies">Movies</Nav.Link>
          </Nav>
          
          <Nav>
            {isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/my-bookings">My Bookings</Nav.Link>
                {user?.isAdmin && (
                  <Dropdown align="end">
                    <Dropdown.Toggle variant="outline-light" id="admin-dropdown">
                      <FaCog className="me-1" />
                      Admin
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item as={Link} to="/admin">Dashboard</Dropdown.Item>
                      <Dropdown.Item as={Link} to="/admin/movies">Movies</Dropdown.Item>
                      <Dropdown.Item as={Link} to="/admin/theaters">Theaters</Dropdown.Item>
                      <Dropdown.Item as={Link} to="/admin/shows">Shows</Dropdown.Item>
                      <Dropdown.Item as={Link} to="/admin/bookings">Bookings</Dropdown.Item>
                      <Dropdown.Item as={Link} to="/admin/users">Users</Dropdown.Item>
                      <Dropdown.Item as={Link} to="/admin/analytics">Analytics</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                )}
                <Dropdown align="end">
                  <Dropdown.Toggle variant="outline-light" id="dropdown-basic">
                    <FaUser className="me-1" />
                    {user?.name}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to="/my-bookings">
                      My Bookings
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout}>
                      <FaSignOutAlt className="me-2" />
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            ) : (
              <>
                <Button as={Link} to="/login" variant="outline-light" className="me-2">
                  Login
                </Button>
                <Button as={Link} to="/register" variant="primary">
                  Register
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar; 