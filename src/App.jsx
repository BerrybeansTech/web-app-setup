import React, { useState, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ViewClient from './pages/ViewClient';
import ReportPage from './pages/ReportPage';
import Login from './pages/Login';
import ConsultationForm from './components/ConsultationForm';
import './index.css';

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" replace />;
};

const AppLayout = ({ children, isSidebarOpen, toggleSidebar, showSidebar = true }) => (
  <div className="app">
    <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
    <div className="app-container">
      {showSidebar && (
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      )}
      <main className={`main-content ${isSidebarOpen && showSidebar ? 'sidebar-open' : ''}`}>
        {children}
      </main>
    </div>
    {showSidebar && (
      <div
        className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`}
        onClick={toggleSidebar}
        aria-hidden="true"
      />
    )}
  </div>
);

const NotFound = () => (
  <div className="not-found">
    <h2>404 - Page Not Found</h2>
    <p>The requested page does not exist.</p>
  </div>
);

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Only ConsultationForm, no Navbar, no Sidebar */}
          <Route path="/" element={<ConsultationForm />} />

          {/* Login Page - no layout */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes with Navbar and Sidebar */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AppLayout
                  isSidebarOpen={isSidebarOpen}
                  toggleSidebar={toggleSidebar}
                  showSidebar={true}
                >
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/view-client/:id" element={<ViewClient />} />
                    <Route path="/reportPage" element={<ReportPage />} />
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

export default App;
