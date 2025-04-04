import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Paper, Typography, TextField, Button, Grid, Snackbar, Alert,
  FormControlLabel, Checkbox, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
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
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get(`http://localhost:5000/api/students/roll/${rollNo}`, config);
        setStudent(res.data);
      } catch (error) {
        console.error("Failed to fetch student:", error);
        setSnackbar({ open: true, message: "Failed to fetch student details", severity: 'error' });
      }
    };
    if (rollNo) fetchStudent();
  }, [rollNo]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async () => {
    const data = new FormData();
    data.append('studentRollNo', rollNo);
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
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

      setTimeout(() => {
        navigate('/view-all-students');
      }, 1500);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Billing failed",
        severity: 'error',
      });
    }
  };

  return (
    <Paper elevation={3} style={{ padding: '2rem' }}>
      {student ? (
        <>
          <Typography variant="h5" gutterBottom>
            Bill for {student.name} ({student.universityRollNo})
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Year: {student.year} | Section: {student.section} | Payment Status: {student.hasPaid ? '✅ Paid' : '❌ Not Paid'}
          </Typography>
          <Grid container spacing={2}>
            {/* ✅ Fixed width for Payment Mode dropdown */}
            <Grid item xs={12} sm={6}>
              <FormControl sx={{ width: 300 }}>
                <InputLabel id="payment-mode-label">Payment Mode</InputLabel>
                <Select
                  labelId="payment-mode-label"
                  name="paymentMode"
                  value={formData.paymentMode}
                  label="Payment Mode"
                  onChange={handleChange}
                >
                  <MenuItem value="Cash">Cash</MenuItem>
                  <MenuItem value="Online">Online</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="transactionId"
                label="Transaction ID"
                fullWidth
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="phone"
                label="Phone"
                fullWidth
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="email"
                label="Email"
                fullWidth
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.foodCoupon}
                    onChange={handleChange}
                    name="foodCoupon"
                  />
                }
                label="Includes Food Coupon?"
              />
            </Grid>

            <Grid item xs={12}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setScreenshot(e.target.files[0])}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </>
      ) : (
        <Typography variant="h5">Loading student details...</Typography>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Paper>
  );
};

export default Billing;
