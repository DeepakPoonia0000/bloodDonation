import React, { useEffect, useState, useRef } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import logo from './images/iinsaf.png';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Navbarjs = ({ setToken }) => {
  const navigate = useNavigate();
  const [token, settoken] = useState('');
  const [navbarExpanded, setNavbarExpanded] = useState(false);
  const navbarRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    settoken(token);
  },);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    navigate('/');
  };

  // Close navbar on outside click
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (navbarExpanded && navbarRef.current && !navbarRef.current.contains(event.target)) {
        setNavbarExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [navbarExpanded]);

  return (
    <Navbar
      expand="lg"
      className="bg-body-tertiary border h-20 z-20 font-montserrat lg:text-lg"
      expanded={navbarExpanded}
      ref={navbarRef}
    >
      <Container fluid>
        <Navbar.Brand as={Link} to="/home">
          <img style={{ height: '40px' }} src={logo} alt="logo" />
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="navbarScroll"
          onClick={() => setNavbarExpanded(!navbarExpanded)} // Toggle navbar state
        />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="ms-auto my-2 my-lg-0 bg-body-tertiary" style={{ maxHeight: '300px' }} navbarScroll>
            {token ? (
              <>
                <Nav.Link as={Link} to="/bloodRequirement">Post Request Blood Requirement </Nav.Link>
                <Nav.Link as={Link} to="/home">Home</Nav.Link>
                <Nav.Link as={Link} to="/about">About</Nav.Link>
                <Nav.Link>Services</Nav.Link>
                <button className=' bg-indigo-500 px-5 text-white rounded-3xl hover:bg-indigo-600' onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/" className=' !bg-indigo-500 px-5 text-white rounded-3xl !hover:bg-indigo-600'>Login</Nav.Link>
                <Nav.Link as={Link} to="/">Sign Up</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navbarjs;
