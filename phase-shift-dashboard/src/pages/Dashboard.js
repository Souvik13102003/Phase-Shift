// frontend/src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Dashboard.css';
import {
  Paper,
  Typography,
  CircularProgress,
  Box,
  Grid,
} from '@mui/material';

const Dashboard = () => {
  const [fund, setFund] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [studentStats, setStudentStats] = useState({
    total: 0,
    paid: 0,
    notPaid: 0,
  });

  const [paymentStats, setPaymentStats] = useState({
    totalOnline: 0,
    totalCash: 0,
    totalFoodCoupons: 0,
  });

  const [loadingFund, setLoadingFund] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingStudentStats, setLoadingStudentStats] = useState(true);
  const [loadingPaymentStats, setLoadingPaymentStats] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchFund = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/fund', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFund(response.data.totalFund);
      } catch (error) {
        console.error('Error fetching fund:', error);
      } finally {
        setLoadingFund(false);
      }
    };

    const fetchUserCount = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/count', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserCount(response.data.totalUsers);
      } catch (error) {
        console.error('Error fetching user count:', error);
      } finally {
        setLoadingUsers(false);
      }
    };

    const fetchStudentStats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/students/stats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudentStats(response.data);
      } catch (error) {
        console.error('Error fetching student stats:', error);
      } finally {
        setLoadingStudentStats(false);
      }
    };

    const fetchPaymentStats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/billings/stats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPaymentStats(response.data);
      } catch (error) {
        console.error('Error fetching payment stats:', error);
      } finally {
        setLoadingPaymentStats(false);
      }
    };

    fetchFund();
    fetchUserCount();
    fetchStudentStats();
    fetchPaymentStats();
  }, []);

  return (
    <div className="dashboard-container">
      <Paper elevation={1} className="dashboard-paper">
        <Typography variant="h4" className="dashboard-title">
          Management Dashboard
        </Typography>
        <Typography variant="body1" className="dashboard-subtext">
          Welcome to the Phase Shift Billing System.
        </Typography>

        <Box mt={4}>
          <Grid container spacing={3}>
            {/* Total Fund */}
            <Grid item xs={12} md={6}>
              {loadingFund ? (
                <CircularProgress />
              ) : (
                <Paper elevation={0} className="fund-box">
                  <Typography variant="h6" className="fund-label">
                    💰 Total Fund Collected:
                  </Typography>
                  <Typography variant="h4" color="primary">
                    ₹ {fund}
                  </Typography>
                </Paper>
              )}
            </Grid>

            {/* Total Users */}
            <Grid item xs={12} md={6}>
              {loadingUsers ? (
                <CircularProgress />
              ) : (
                <Paper elevation={0} className="fund-box">
                  <Typography variant="h6" className="fund-label">
                    👥 Total Users (Management):
                  </Typography>
                  <Typography variant="h4" color="secondary">
                    {userCount}
                  </Typography>
                </Paper>
              )}
            </Grid>

            {/* Student Stats */}
            <Grid item xs={12} md={4}>
              {loadingStudentStats ? (
                <CircularProgress />
              ) : (
                <Paper elevation={0} className="fund-box">
                  <Typography variant="h6" className="fund-label">
                    🎓 Total Students:
                  </Typography>
                  <Typography variant="h4" color="info.main">
                    {studentStats.total}
                  </Typography>
                </Paper>
              )}
            </Grid>

            <Grid item xs={12} md={4}>
              {loadingStudentStats ? (
                <CircularProgress />
              ) : (
                <Paper elevation={0} className="fund-box">
                  <Typography variant="h6" className="fund-label">
                    ✅ Students Paid:
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {studentStats.paid}
                  </Typography>
                </Paper>
              )}
            </Grid>

            <Grid item xs={12} md={4}>
              {loadingStudentStats ? (
                <CircularProgress />
              ) : (
                <Paper elevation={0} className="fund-box">
                  <Typography variant="h6" className="fund-label">
                    ❌ Students Not Paid:
                  </Typography>
                  <Typography variant="h4" color="error.main">
                    {studentStats.notPaid}
                  </Typography>
                </Paper>
              )}
            </Grid>

            {/* Payment Stats */}
            <Grid item xs={12} md={4}>
              {loadingPaymentStats ? (
                <CircularProgress />
              ) : (
                <Paper elevation={0} className="fund-box">
                  <Typography variant="h6" className="fund-label">
                    💳 Online Payments
                  </Typography>
                  <Typography variant="h4" color="info.main">
                    {paymentStats.totalOnline}
                  </Typography>
                </Paper>
              )}
            </Grid>

            <Grid item xs={12} md={4}>
              {loadingPaymentStats ? (
                <CircularProgress />
              ) : (
                <Paper elevation={0} className="fund-box">
                  <Typography variant="h6" className="fund-label">
                    💵 Cash Payments
                  </Typography>
                  <Typography variant="h4" color="warning.main">
                    {paymentStats.totalCash}
                  </Typography>
                </Paper>
              )}
            </Grid>

            <Grid item xs={12} md={4}>
              {loadingPaymentStats ? (
                <CircularProgress />
              ) : (
                <Paper elevation={0} className="fund-box">
                  <Typography variant="h6" className="fund-label">
                    🍱 Food Coupons
                  </Typography>
                  <Typography variant="h4" color="secondary">
                    {paymentStats.totalFoodCoupons}
                  </Typography>
                </Paper>
              )}
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </div>
  );
};

export default Dashboard;
