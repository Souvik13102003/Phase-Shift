// src/pages/AllBills.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  Box,
  Button,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  TablePagination,
} from "@mui/material";

const AllBills = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchBills = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/billings/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBills(res.data);
    } catch (error) {
      console.error("Failed to fetch bills:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const filteredBills = bills.filter((bill) => {
    const roll = bill.rollNo?.toLowerCase() || "";
    const name = bill.studentName?.toLowerCase() || "";
    return (
      roll.includes(searchTerm.toLowerCase()) ||
      name.includes(searchTerm.toLowerCase())
    );
  });

  const viewBill = (billFileName) => {
    const filePath = `http://localhost:5000/bills/${billFileName}`;
    window.open(filePath, "_blank");
  };

  const exportToExcel = () => {
    const currentTime = new Date();
    const formattedTime = currentTime.toLocaleString().replace(/[/,: ]/g, "_");
    const fileName = `Bills_${formattedTime}.xlsx`;

    const excelData = filteredBills.map((bill) => ({
      "Student Name": bill.studentName,
      "Roll Number": bill.rollNo,
      "Payment Mode": bill.paymentMode,
      "Food Coupon": bill.foodCoupon ? "Yes" : "No",
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bills");

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

      {loading ? (
        <p>Loading...</p>
      ) : filteredBills.length === 0 ? (
        <p>No bills found.</p>
      ) : (
        <>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student Name</TableCell>
                  <TableCell>Roll Number</TableCell>
                  <TableCell>Payment Mode</TableCell>
                  <TableCell>Food Coupon</TableCell>
                  <TableCell>View Bill</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBills
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((bill, index) => (
                    <TableRow key={index}>
                      <TableCell>{bill.studentName}</TableCell>
                      <TableCell>{bill.rollNo}</TableCell>
                      <TableCell>{bill.paymentMode}</TableCell>
                      <TableCell>
                        {bill.foodCoupon ? (
                          <Chip label="Yes" color="success" />
                        ) : (
                          <Chip label="No" color="error" />
                        )}
                      </TableCell>
                      <TableCell>
                        <Button variant="outlined" onClick={() => viewBill(bill.billFileName)}>
                          View Bill
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredBills.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
    </Paper>
  );
};

export default AllBills;
