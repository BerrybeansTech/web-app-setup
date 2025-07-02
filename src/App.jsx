import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ViewClient from './pages/ViewClient';
import ReportPage from './pages/ReportPage';
import Login from './pages/Login';
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

  return (
    <BrowserRouter>
      <Routes>
        {/* Only ConsultationForm, no Navbar, no Sidebar */}
        <Route path="/" element={<ConsultationForm />} />

        {/* Login Page - no layout */}
        <Route path="/login" element={<Login />} />

        {/* Main App Layout */}
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
