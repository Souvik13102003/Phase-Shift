// frontend/src/pages/Billing.js
import React, { useState, useEffect } from 'react';
import '../styles/Billing.css';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Paper, Typography, TextField, Button, Grid, Snackbar, Alert,
  FormControlLabel, Checkbox, FormControl, InputLabel, Select, MenuItem, Box,
  CircularProgress
} from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material';
import axios from 'axios';

const Billing = () => {
  const { rollNo } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [formData, setFormData] = useState({
    paymentMode: '',
    transactionId: '',
    foodCoupon: false,
    phone: '',
    email: '',
  });
  const [screenshot, setScreenshot] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false); // Loader state

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/students/roll/${rollNo}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudent(res.data);
      } catch (error) {
        setSnackbar({ open: true, message: "Failed to fetch student details", severity: 'error' });
      }
    };
    fetchStudent();
  }, [rollNo]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    const data = new FormData();
    data.append('studentRollNo', rollNo);
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    if (screenshot) data.append('screenshot', screenshot);

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      };

      const response = await axios.post('http://localhost:5000/api/billings/bill', data, config);
      await axios.put(`http://localhost:5000/api/students/mark-paid/${rollNo}`, {}, config);

      setSnackbar({ open: true, message: response.data.message, severity: 'success' });
      setTimeout(() => navigate('/view-all-students'), 1500);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Billing failed",
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper className="billing-container">
      {student ? (
        <>
          <Typography variant="h5" className="billing-title">
            Billing for {student.name} ({student.universityRollNo})
          </Typography>
          <Box className="student-details">
            <Typography variant="body1">
              <strong>Year:</strong> {student.year} | <strong>Section:</strong> {student.section}
              <br />
              <strong>Status:</strong>{" "}
              {student.hasPaid ? <CheckCircle color="success" /> : <Cancel color="error" />}
              {student.hasPaid ? ' Paid' : ' Not Paid'}
            </Typography>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth sx={{ minWidth: 150 }} size="small">
                <InputLabel>Payment Mode</InputLabel>
                <Select name="paymentMode" value={formData.paymentMode} label="Payment Mode" onChange={handleChange}>
                  <MenuItem value="Cash">Cash</MenuItem>
                  <MenuItem value="Online">Online</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField name="transactionId" label="Transaction ID" fullWidth size="small" onChange={handleChange} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField name="phone" label="Phone" fullWidth size="small" onChange={handleChange} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField name="email" label="Email" fullWidth size="small" onChange={handleChange} />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox checked={formData.foodCoupon} onChange={handleChange} name="foodCoupon" />}
                label="Include Food Coupon?"
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body2">Upload Payment Screenshot (optional):</Typography>
              <input type="file" accept="image/*" onChange={(e) => setScreenshot(e.target.files[0])} />
            </Grid>

            <Grid item xs={12} className="submit-button">
              <Button variant="contained" onClick={handleSubmit} disabled={loading} fullWidth>
                {loading ? <CircularProgress size={22} color="inherit" /> : 'Submit Payment'}
              </Button>
            </Grid>
          </Grid>
        </>
      ) : (
        <Typography variant="h6">Loading student details...</Typography>
      )}

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Paper>
  );
};

export default Billing;
