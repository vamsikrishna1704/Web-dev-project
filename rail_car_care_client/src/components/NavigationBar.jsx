import React from "react";
import { Link } from "react-router-dom";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import Logo from "../images/Logo.PNG";
import './NavigationBar.css';

function NavigationBar({ onLogout }) {

    return (
        <Navbar className="navigation" bg="dark"  expand="lg" fixed="top">
            <Navbar.Brand className="brand"><img className="image-logo" src={Logo} />RailCarCare</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="custom-nav"> {/* Use ml-auto to float navigation items right */}
                    <Link to="/assignments" className="nav-link">Assignments</Link>
                    <Link to="/orders" className="nav-link">Orders</Link>
                    <Link to="/complaints" className="nav-link">Complaints</Link>
                    <Link to="/profile" className="nav-link">Profile</Link>
                    <Button variant="danger" onClick={onLogout}>Logout</Button>
                </Nav>
               
            </Navbar.Collapse>
        </Navbar>
    );
}

export default NavigationBar;