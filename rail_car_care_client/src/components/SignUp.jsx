import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import './SignUp.css'; // Import a custom CSS file for transitions

function SignUpPage({ onSignupSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [isCardVisible, setIsCardVisible] = useState(true);
  const [validationErrors, setValidationErrors] = useState({}); // Initialize validation errors state

  useEffect(() => {
    // Add any additional initialization logic here if needed
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const errors = {};

    if (formData.name.trim() === '') {
      errors.name = 'Name is required';
    }

    if (formData.email.trim() === '') {
      errors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      errors.email = 'Invalid email format';
    }

    if (formData.password.trim() === '') {
      errors.password = 'Password is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    return emailRegex.test(email);
  };

  const handleSignUp = () => {
    if (validateForm()) {
      localStorage.setItem('signupData', JSON.stringify(formData));
      onSignupSuccess();
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className={`signup-card p-4 ${isCardVisible ? 'visible' : 'hidden'}`} style={{ backgroundColor: 'white' }}>
        <h2 className="mb-4">Sign-up</h2>
        {validationErrors.name && <Alert variant="danger">{validationErrors.name}</Alert>}
        <Form>
          <Form.Group>
            <Form.Label>Name:</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>
          {validationErrors.email && <Alert variant="danger">{validationErrors.email}</Alert>}
          <Form.Group>
            <Form.Label>Email:</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>
          {validationErrors.password && <Alert variant="danger">{validationErrors.password}</Alert>}
          <Form.Group>
            <Form.Label>Password:</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Button variant="primary" onClick={handleSignUp}>
            Sign Up
          </Button>
        </Form>
      </Card>
    </Container>
  );
}

export default SignUpPage;
