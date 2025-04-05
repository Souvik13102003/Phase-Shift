// frontend/src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Dashboard.css";
import { Paper, Typography, CircularProgress, Box, Grid } from "@mui/material";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import GroupIcon from "@mui/icons-material/Group";
import SchoolIcon from "@mui/icons-material/School";
import PaidIcon from "@mui/icons-material/Paid";
import CancelIcon from "@mui/icons-material/Cancel";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import FastfoodIcon from "@mui/icons-material/Fastfood";

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

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchAll = async () => {
      try {
        const [fundRes, userRes, studentRes, paymentRes] = await Promise.all([
          axios.get("http://localhost:5000/api/fund", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/users/count", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/students/stats", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/billings/stats", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setFund(fundRes.data.totalFund);
        setUserCount(userRes.data.totalUsers);
        setStudentStats(studentRes.data);
        setPaymentStats(paymentRes.data);
      } catch (err) {
        console.error("Dashboard loading error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const metrics = [
    { label: "Total Fund", value: `₹${fund}`, icon: <MonetizationOnIcon /> },
    { label: "Users", value: userCount, icon: <GroupIcon /> },
    {
      label: "Total Students",
      value: studentStats.total,
      icon: <SchoolIcon />,
    },
    { label: "Students Paid", value: studentStats.paid, icon: <PaidIcon /> },
    {
      label: "Students Not Paid",
      value: studentStats.notPaid,
      icon: <CancelIcon />,
    },
    {
      label: "Online Payments",
      value: paymentStats.totalOnline,
      icon: <CreditCardIcon />,
    },
    {
      label: "Cash Payments",
      value: paymentStats.totalCash,
      icon: <AttachMoneyIcon />,
    },
    {
      label: "Food Coupons",
      value: paymentStats.totalFoodCoupons,
      icon: <FastfoodIcon />,
    },
  ];

  return (
    <div className="dashboard-container">
      <Box className="dashboard-wrapper">
        <Typography variant="h5" className="dashboard-heading">
          Dashboard Overview
        </Typography>
        <Typography variant="body2" className="dashboard-subtext">
          Phase Shift Billing System
        </Typography>

        {loading ? (
          <Box className="dashboard-loader">
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={2} justifyContent="center">
            {metrics.map((item, index) => (
              <Grid item key={index}>
                <Paper className="dashboard-card">
                  <Box className="dashboard-icon">{item.icon}</Box>
                  <Typography className="dashboard-label">
                    {item.label}
                  </Typography>
                  <Typography className="dashboard-value">
                    {item.value}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </div>
  );
};

export default Dashboard;
