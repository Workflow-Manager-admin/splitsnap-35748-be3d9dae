import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider, useAuth } from "./components/AuthContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import ReceiptUpload from "./pages/ReceiptUpload";
import ItemAssignment from "./pages/ItemAssignment";
import SettleUp from "./pages/SettleUp";
import History from "./pages/History";
import ReceiptDetails from "./pages/ReceiptDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Loader from "./components/Loader";

import "./index.css";
import "./tailwind-output.css";

/**
 * Top-level SplitSnap App container - handles layout, routing, and context providers.
 */
function App() {
  return (
    <AuthProvider>
      <Router>
        <MainLayout />
      </Router>
    </AuthProvider>
  );
}

/**
 * MainLayout conditionally renders nav, sidebar, and protected app content.
 * Handles redirecting to login/register when unauthenticated.
 */
function MainLayout() {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) return <Loader />;

  // Routes that don't require authentication
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex flex-1 pt-16">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        <main className="flex-1 p-4 md:p-8 transition-all duration-200">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/upload" element={<ReceiptUpload />} />
            <Route path="/receipt/:id" element={<ReceiptDetails />} />
            <Route path="/assign/:id" element={<ItemAssignment />} />
            <Route path="/settle" element={<SettleUp />} />
            <Route path="/history" element={<History />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
