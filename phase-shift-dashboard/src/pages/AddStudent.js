import React, { useState } from 'react';
import {
  Paper, Typography, TextField, Button, Grid, Snackbar, Alert
} from '@mui/material';
import axios from 'axios';

const AddStudent = () => {
  const [formData, setFormData] = useState({
    name: '',
    universityRollNo: '',
    year: '',
    section: '',
  });

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/students/manual', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSnackbar({ open: true, message: "Student added successfully", severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: error.response?.data?.message || "Error adding student", severity: 'error' });
    }
  };

  return (
    <Paper elevation={3} style={{ padding: '2rem' }}>
      <Typography variant="h5" gutterBottom>Add Student</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField fullWidth name="name" label="Name" value={formData.name} onChange={handleChange} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth name="universityRollNo" label="University Roll No" value={formData.universityRollNo} onChange={handleChange} />
        </Grid>
        <Grid item xs={6} md={3}>
          <TextField fullWidth name="year" label="Year" value={formData.year} onChange={handleChange} />
        </Grid>
        <Grid item xs={6} md={3}>
          <TextField fullWidth name="section" label="Section" value={formData.section} onChange={handleChange} />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>Add</Button>
        </Grid>
      </Grid>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Paper>
  );
};

export default AddStudent;
