// frontend/src/pages/AddStudent.js
import React, { useState } from "react";
import "../styles/AddStudent.css";
import {
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Snackbar,
  Alert,
  MenuItem,
} from "@mui/material";
import axios from "axios";

const AddStudent = () => {
  const [formData, setFormData] = useState({
    name: "",
    universityRollNo: "",
    year: "",
    section: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.universityRollNo ||
      !formData.year ||
      !formData.section
    ) {
      return setSnackbar({
        open: true,
        message: "All fields are required",
        severity: "warning",
      });
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/students/manual`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSnackbar({
        open: true,
        message: "Student added successfully",
        severity: "success",
      });
      setFormData({ name: "", universityRollNo: "", year: "", section: "" });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Error adding student",
        severity: "error",
      });
    }
  };

  const years = ["1st", "2nd", "3rd", "4th"];
  const sections = ["A", "B", "C"];

  return (
    <div className="add-student-container">
      <Paper elevation={1} className="add-student-paper">
        <Typography variant="h5" className="add-student-title">
          Add Student
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              name="name"
              label="Name"
              value={formData.name}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              name="universityRollNo"
              label="University Roll No"
              value={formData.universityRollNo}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={6} md={3}>
            <TextField
              select
              fullWidth
              name="year"
              label="Year"
              value={formData.year}
              onChange={handleChange}
              sx={{ minWidth: 120 }} // fix width issue
            >
              {years.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={6} md={3}>
            <TextField
              select
              fullWidth
              name="section"
              label="Section"
              value={formData.section}
              onChange={handleChange}
              sx={{ minWidth: 120 }} // fix width issue
            >
              {sections.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              className="add-student-btn"
              onClick={handleSubmit}
            >
              Add Student
            </Button>
          </Grid>
        </Grid>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
        </Snackbar>
      </Paper>
    </div>
  );
};

export default AddStudent;
