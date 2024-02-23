import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './Login.css'; // Import the CSS for styling

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch('http://localhost:8080/api/v1/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        });
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            window.dispatchEvent(new Event('storage'));
            navigate('/watchList');
        } else {
            console.log('Login failed');
        }
    } catch (error) {
      console.error('Login failed:', error.response.data);
    }
  };

  return (
    <div className="login-container">
      <Form onSubmit={handleLogin} className="login-form">
        <Form.Group className="mb-3" controlId="formBasicUsername">
          <Form.Label className="form-label">Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="form-control"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label className="form-label">Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="btn-primary">
          Login
        </Button>
      </Form>
    </div>
  );
};

export default Login;
