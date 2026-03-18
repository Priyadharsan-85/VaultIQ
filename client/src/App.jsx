import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import FraudAlerts from './pages/FraudAlerts';
import Market from './pages/Market';
import Budget from './pages/Budget';

import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import AuroraBackground from './components/AuroraBackground';

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden">
      <AuroraBackground />
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 z-10">
        <Navbar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useContext(AuthContext);
  if (loading) return <div className="min-h-screen bg-[#0a1628] flex items-center justify-center text-[#c8a84b]">Loading...</div>;
  if (!token) return <Navigate to="/login" />;
  return <Layout>{children}</Layout>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {/* All protected routes will be wrapped in Layout via ProtectedRoute */}
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
      <Route path="/fraud" element={<ProtectedRoute><FraudAlerts /></ProtectedRoute>} />
      <Route path="/market" element={<ProtectedRoute><Market /></ProtectedRoute>} />
      <Route path="/budget" element={<ProtectedRoute><Budget /></ProtectedRoute>} />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;
