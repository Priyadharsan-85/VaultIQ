import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import FraudAlertCard from '../components/FraudAlertCard';

const FraudAlerts = () => {
  const [alerts, setAlerts] = useState([]);

  const fetchAlerts = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/fraud/alerts`);
      setAlerts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleReview = async (id, status) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/fraud/alerts/${id}/review`, { status });
      fetchAlerts();
    } catch (err) {
      alert('Failed to update alert');
    }
  };

  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold">Security Alerts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {alerts.map((alert) => (
          <FraudAlertCard 
            key={alert.id} 
            alert={alert} 
            onReview={(status) => handleReview(alert.id, status)} 
          />
        ))}
        {alerts.length === 0 && (
          <div className="col-span-full text-center py-20 text-[#8892b0]">
            No pending security alerts. Your account is secure.
          </div>
        )}
      </div>
    </div>
  );
};

export default FraudAlerts;
