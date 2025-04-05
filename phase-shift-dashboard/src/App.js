// frontend/src/App.js
import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UploadExcel from './pages/UploadExcel';
import AddStudent from './pages/AddStudent';
import Billing from './pages/Billing';
import ViewAllStudents from './pages/ViewAllStudents';
import AllBills from './pages/AllBills';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { Box, Toolbar, useMediaQuery, useTheme } from '@mui/material';

const drawerWidth = 240;

const App = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const drawerVariant = isMobile ? 'temporary' : 'permanent';

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Box sx={{ display: 'flex' }}>
                  <Sidebar variant={drawerVariant} />
                  <Box
                    component="main"
                    sx={{
                      flexGrow: 1,
                      padding: 3,
                      ...(drawerVariant === 'permanent' && {
                        marginLeft: `${drawerWidth}px`,
                      }),
                    }}
                  >
                    {/* Toolbar spacing only for mobile AppBar */}
                    {drawerVariant === 'temporary' && <Toolbar />}
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/upload" element={<UploadExcel />} />
                      <Route path="/add-student" element={<AddStudent />} />
                      <Route path="/view-all-students" element={<ViewAllStudents />} />
                      <Route path="/all-bills" element={<AllBills />} />
                      <Route path="/billing/:rollNo" element={<Billing />} />
                    </Routes>
                  </Box>
                </Box>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
