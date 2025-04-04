import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Chip,
  Button,
  Box,
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
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const { data } = await axios.get("http://localhost:5000/api/students", config);
      setStudents(data);
    };
    fetchStudents();
  }, []);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleYearChange = (e) => setYearFilter(e.target.value);
  const handleSectionChange = (e) => setSectionFilter(e.target.value);
  const handlePaidChange = (e) => setPaidFilter(e.target.value);
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const filteredStudents = students.filter((student) => {
    const searchMatch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.universityRollNo.toLowerCase().includes(searchTerm.toLowerCase());
    const yearMatch = yearFilter ? student.year === yearFilter : true;
    const sectionMatch = sectionFilter ? student.section === sectionFilter : true;
    const paidMatch =
      paidFilter === ""
        ? true
        : paidFilter === "paid"
        ? student.hasPaid
        : !student.hasPaid;
    return searchMatch && yearMatch && sectionMatch && paidMatch;
  });

  const handleRedirect = (rollNo, hasPaid) => {
    if (!hasPaid) navigate(`/billing/${rollNo}`);
  };

  // 💾 Export to Excel
  const exportToExcel = () => {
    const currentTime = new Date();
    const formattedTime = currentTime.toLocaleString().replace(/[/,: ]/g, "_");
    const fileName = `Students_${formattedTime}.xlsx`;

    const excelData = filteredStudents.map((student) => ({
      RollNo: student.universityRollNo,
      Name: student.name,
      Year: student.year,
      Section: student.section,
      PaymentStatus: student.hasPaid ? "Paid" : "Not Paid",
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, fileName);
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <TextField
          label="Search by Name or Roll No"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          fullWidth
        />
        <Button variant="contained" sx={{ ml: 2 }} onClick={exportToExcel}>
          Export to Excel
        </Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth sx={{ minWidth: 200 }}>
            <InputLabel>Filter by Year</InputLabel>
            <Select value={yearFilter} onChange={handleYearChange} label="Filter by Year">
              <MenuItem value="">All</MenuItem>
              <MenuItem value="1st">1st</MenuItem>
              <MenuItem value="2nd">2nd</MenuItem>
              <MenuItem value="3rd">3rd</MenuItem>
              <MenuItem value="4th">4th</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth sx={{ minWidth: 200 }}>
            <InputLabel>Filter by Section</InputLabel>
            <Select value={sectionFilter} onChange={handleSectionChange} label="Filter by Section">
              <MenuItem value="">All</MenuItem>
              <MenuItem value="A">A</MenuItem>
              <MenuItem value="B">B</MenuItem>
              <MenuItem value="C">C</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth sx={{ minWidth: 200 }}>
            <InputLabel>Filter by Payment</InputLabel>
            <Select value={paidFilter} onChange={handlePaidChange} label="Filter by Payment">
              <MenuItem value="">All</MenuItem>
              <MenuItem value="paid">Paid</MenuItem>
              <MenuItem value="notPaid">Not Paid</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Roll No</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Year</TableCell>
              <TableCell>Section</TableCell>
              <TableCell>Payment Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((student) => (
                <TableRow key={student._id}>
                  <TableCell
                    sx={{ cursor: !student.hasPaid ? "pointer" : "default", color: !student.hasPaid ? "blue" : "black" }}
                    onClick={() => handleRedirect(student.universityRollNo, student.hasPaid)}
                  >
                    {student.universityRollNo}
                  </TableCell>
                  <TableCell
                    sx={{ cursor: !student.hasPaid ? "pointer" : "default", color: !student.hasPaid ? "blue" : "black" }}
                    onClick={() => handleRedirect(student.universityRollNo, student.hasPaid)}
                  >
                    {student.name}
                  </TableCell>
                  <TableCell>{student.year}</TableCell>
                  <TableCell>{student.section}</TableCell>
                  <TableCell>
                    {student.hasPaid ? (
                      <Chip label="Paid" color="success" />
                    ) : (
                      <Chip label="Not Paid" color="error" />
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredStudents.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default ViewAllStudents;
