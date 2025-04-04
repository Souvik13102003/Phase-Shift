import React, { useState } from "react";
import axios from "axios";
import {
  Paper,
  Typography,
  Button,
  Box,
  Input,
  Snackbar,
  Alert,
} from "@mui/material";

const UploadExcel = () => {
  const [file, setFile] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      return alert("Please select a file");
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      console.log("Token sent:", token); // Add this for debugging

      const response = await axios.post(
        "http://localhost:5000/api/students/upload-excel",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSnackbar({
        open: true,
        message: response.data.message || "Upload successful",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Upload failed",
        severity: "error",
      });
    }
  };

  return (
    <Paper elevation={3} style={{ padding: "2rem" }}>
      <Typography variant="h5" gutterBottom>
        Upload Student Excel
      </Typography>
      <Box mt={2}>
        <Input type="file" onChange={handleFileChange} />
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          style={{ marginLeft: "1rem" }}
        >
          Upload
        </Button>
      </Box>

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

export default UploadExcel;
