import React, { useState, useContext } from 'react';
import { TextField, Button, Container, Typography, Paper } from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await api.post('/auth/login', { email, password });
  
      // Store token in localStorage
      localStorage.setItem('token', res.data.token);
  
      // If you're using context, still call login()
      login(res.data.token);
  
      navigate('/');
    } catch (err) {
      alert('Invalid Credentials');
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper style={{ padding: 30, marginTop: 80 }}>
        <Typography variant="h5" align="center" gutterBottom>Admin Login</Typography>
        <TextField label="Email" fullWidth margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextField label="Password" fullWidth margin="normal" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button variant="contained" color="primary" fullWidth onClick={handleLogin}>Login</Button>
      </Paper>
    </Container>
  );
};

export default Login;
