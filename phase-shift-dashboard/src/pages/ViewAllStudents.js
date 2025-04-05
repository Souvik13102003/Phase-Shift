// frontend/src/pages/ViewAllStudents.js
import React, { useState, useEffect } from "react";
import '../styles/ViewAllStudents.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, TextField, TablePagination, FormControl,
  InputLabel, Select, MenuItem, Grid, Chip, Button, Box, Typography,
} from "@mui/material";

const ViewAllStudents = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [sectionFilter, setSectionFilter] = useState("");
  const [paidFilter, setPaidFilter] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("https://billing-backend-ss94.onrender.com/api/students", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(data);
    };
    fetchStudents();
  }, []);

  const filteredStudents = students.filter((student) => (
    (student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.universityRollNo.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (yearFilter ? student.year === yearFilter : true) &&
    (sectionFilter ? student.section === sectionFilter : true) &&
    (paidFilter === "" ? true : paidFilter === "paid" ? student.hasPaid : !student.hasPaid)
  ));

  const handleRedirect = (rollNo, hasPaid) => {
    if (!hasPaid) navigate(`/billing/${rollNo}`);
  };

  const exportToExcel = () => {
    const excelData = filteredStudents.map(({ universityRollNo, name, year, section, hasPaid }) => ({
      RollNo: universityRollNo, Name: name, Year: year, Section: section, Status: hasPaid ? "Paid" : "Not Paid"
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const fileName = `Students_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.xlsx`;

    saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), fileName);
  };

  return (
    <Paper className="view-students-container">
      <Box className="header-actions">
        <Typography variant="h5">Students List</Typography>
        <Button variant="contained" onClick={exportToExcel}>Export to Excel</Button>
      </Box>

      <Grid container spacing={2} className="filters-container">
  <Grid item xs={12} md={3}>
    <TextField
      label="Search by Name/Roll No"
      variant="outlined"
      size="small"
      fullWidth
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  </Grid>

  <Grid item xs={12} sm={4} md={3}>
    <FormControl fullWidth size="small" sx={{ minWidth: 120 }}>
      <InputLabel>Year</InputLabel>
      <Select value={yearFilter} label="Year" onChange={(e) => setYearFilter(e.target.value)}>
        <MenuItem value="">All</MenuItem>
        {["1st", "2nd", "3rd", "4th"].map((yr) => (
          <MenuItem key={yr} value={yr}>{yr}</MenuItem>
        ))}
      </Select>
    </FormControl>
  </Grid>

  <Grid item xs={12} sm={4} md={3}>
    <FormControl fullWidth size="small" sx={{ minWidth: 120 }}>
      <InputLabel>Section</InputLabel>
      <Select value={sectionFilter} label="Section" onChange={(e) => setSectionFilter(e.target.value)}>
        <MenuItem value="">All</MenuItem>
        {["A", "B", "C"].map((sec) => (
          <MenuItem key={sec} value={sec}>{sec}</MenuItem>
        ))}
      </Select>
    </FormControl>
  </Grid>

  <Grid item xs={12} sm={4} md={3}>
    <FormControl fullWidth size="small" sx={{ minWidth: 140 }}>
      <InputLabel>Payment</InputLabel>
      <Select value={paidFilter} label="Payment" onChange={(e) => setPaidFilter(e.target.value)}>
        <MenuItem value="">All</MenuItem>
        <MenuItem value="paid">Paid</MenuItem>
        <MenuItem value="notPaid">Not Paid</MenuItem>
      </Select>
    </FormControl>
  </Grid>
</Grid>


      <TableContainer className="students-table">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Roll No</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Year</TableCell>
              <TableCell>Section</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((student) => (
              <TableRow key={student._id}>
                <TableCell
                  className={student.hasPaid ? "" : "clickable-cell"}
                  onClick={() => handleRedirect(student.universityRollNo, student.hasPaid)}
                >
                  {student.universityRollNo}
                </TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.year}</TableCell>
                <TableCell>{student.section}</TableCell>
                <TableCell>
                  <Chip label={student.hasPaid ? "Paid" : "Not Paid"} color={student.hasPaid ? "success" : "error"} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        count={filteredStudents.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(e, p) => setPage(p)}
        onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value)); setPage(0); }}
      />
    </Paper>
  );
};

export default ViewAllStudents;
