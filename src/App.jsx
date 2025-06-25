import React, { useState, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import AddClient from './pages/AddClient';
import ViewClient from './pages/ViewClient';
import ReportPage from './pages/ReportPage';
import Login from './pages/Login';
import ConsultationForm from './components/ConsultationForm';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" replace />;
};

const AppLayout = ({ children, isSidebarOpen, toggleSidebar }) => (
  <div className="app">
    <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
    <div className="app-container">
      <Sidebar isOpen={isSidebarOpen} />
      <main className={`main-content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        {children}
      </main>
    </div>
    <div
      className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`}
      onClick={toggleSidebar}
      aria-hidden="true"
    />
  </div>
);

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AppLayout isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}>
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/clients" element={<Clients />} />
                    <Route path="/add-client" element={<AddClient />} />
                    <Route path="/view-client/:id" element={<ViewClient />} />
                    <Route path="/reportPage" element={<ReportPage />} />
                    <Route path="/consultation" element={<ConsultationForm />} />
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </AppLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

// Simple NotFound component for 404 errors
const NotFound = () => (
  <div className="not-found">
    <h2>404 - Page Not Found</h2>
    <p>The requested page does not exist.</p>
  </div>
);

export default App;