import React from "react";
import {Link, useLocation} from "react-router-dom";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import Logo from "../images/Logo.PNG";
import './NavigationBar.css';

function NavBar({ onLogout }) {

    const location = useLocation();
    const path = location.pathname;
    const role = localStorage.getItem('userRole');

    return (
        <Navbar className="navigation" bg="dark" variant="dark" expand="lg" fixed="top">
            <Navbar.Brand className="brand"><img className="image-logo" src={Logo} alt='RailCarCareLogo'/>RailCarCare</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="custom-nav">
                    { path === '/home' ? null :( 
                    <Link to= "/home" className="nav-link">Home</Link>)}
                    { path === '/assignments' ? null :(
                    <Link to="/assignments" className="nav-link">Assignments</Link>)}
                    { path === '/orders' ? null :(
                    <Link to="/orders" className="nav-link">Orders</Link>)}
                    {path === '/complaints' ? null : (
                    <Link to="/complaints" className="nav-link">Complaints</Link>)}
                    {path === '/profile' ? null :(
                    <Link to="/profile" className="nav-link">Profile</Link>)}
                    { (role === 'manager'&&path === '/create-employee') ? null :(
                        <Link to="/create-employee" className="nav-link">Create Employee</Link>
                    ) }
                    
                    <Button variant="danger" onClick={onLogout}>Logout</Button>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default NavBar;