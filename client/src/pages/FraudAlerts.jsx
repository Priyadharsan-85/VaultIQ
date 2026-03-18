import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import FraudAlertCard from '../components/FraudAlertCard';
import { ShieldCheck, ShieldAlert, Fingerprint } from 'lucide-react';

const FraudAlerts = () => {
  const [alerts, setAlerts] = useState([]);

  const fetchAlerts = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/fraud/alerts`);
      setAlerts(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchAlerts(); }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 space-y-12"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-white">Security Command</h2>
          <p className="text-textSecondary text-sm">Real-time threat monitoring and anomaly detection</p>
        </div>
        <div className="flex items-center space-x-3 bg-success/5 border border-success/20 px-6 py-3 rounded-2xl">
          <Fingerprint size={20} className="text-success" />
          <span className="text-xs font-black text-success uppercase tracking-widest">Biometric Guard Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {alerts.map((alert, i) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: i * 0.1 }}
            >
              <FraudAlertCard alert={alert} />
            </motion.div>
          ))}
        </AnimatePresence>
        
        {alerts.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-span-full glass p-20 flex flex-col items-center justify-center text-center space-y-6"
          >
            <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center text-success relative">
              <ShieldCheck size={48} />
              <div className="absolute inset-0 bg-success/20 blur-2xl animate-pulse rounded-full" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white mb-2">Systems Nominal</h3>
              <p className="text-textSecondary text-sm max-w-sm mx-auto">
                No active threats detected. Your account is being monitored by our real-time isolation forest algorithm.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default FraudAlerts;
