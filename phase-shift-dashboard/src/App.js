import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UploadExcel from './pages/UploadExcel';
import AddStudent from './pages/AddStudent';
import Billing from './pages/Billing';
import ViewAllStudents from './pages/ViewAllStudents';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <div style={{ display: 'flex' }}>
                  <Sidebar />
                  <div style={{ marginLeft: 240, padding: 20, width: '100%' }}>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/upload" element={<UploadExcel />} />
                      <Route path="/add-student" element={<AddStudent />} />
                      <Route path="/view-all-students" element={<ViewAllStudents />} />
                      <Route path="/billing/:rollNo" element={<Billing />} />
                    </Routes>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
