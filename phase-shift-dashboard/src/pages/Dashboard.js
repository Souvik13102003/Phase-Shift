import React from 'react';
import { Paper, Typography } from '@mui/material';

const Dashboard = () => {
  return (
    <Paper elevation={3} style={{ padding: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Typography variant="body1">
        Welcome to the Phase Shift Billing System.
      </Typography>
    </Paper>
  );
};

export default Dashboard;
