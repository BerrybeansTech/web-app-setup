import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ViewClient from './pages/ViewClient';
import ReportPage from './pages/ReportPage';
import LoginForm from './components/LoginForm'; // adjust path based on your structure
import ConsultationForm from './components/ConsultationForm';
import './index.css';

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

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginForm setIsLoggedIn={setIsLoggedIn} />} />

        {isLoggedIn ? (
          <>
            {/* ConsultationForm only on /consultation */}
            <Route path="/consultation" element={<ConsultationForm />} />

            {/* Main Layout for other routes */}
            <Route
              path="/*"
              element={
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
              }
            />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
