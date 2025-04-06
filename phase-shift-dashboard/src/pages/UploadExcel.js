// frontend/src/pages/UploadExcel.js
import React, { useState } from "react";
import '../styles/UploadExcel.css';
import axios from "axios";
import {
  Paper,
  Typography,
  Button,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const UploadExcel = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0]?.name || "");
  };

  const handleUpload = async () => {
    if (!file) {
      return setSnackbar({ open: true, message: "Please select a file", severity: "warning" });
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://ps-backend-railway-production.up.railway.app/api/students/upload-excel",
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
    <div className="upload-container">
      <Paper elevation={1} className="upload-paper">
        <Typography variant="h5" className="upload-title">
          Upload Student Excel
        </Typography>

        <Box className="upload-box">
          <label htmlFor="excel-upload" className="file-input-label">
            <CloudUploadIcon className="upload-icon" />
            {fileName || "Choose Excel file"}
          </label>

          <input
            id="excel-upload"
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            hidden
          />

          <Button
            variant="contained"
            className="upload-btn"
            onClick={handleUpload}
          >
            Upload
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </div>
  );
};

export default UploadExcel;
