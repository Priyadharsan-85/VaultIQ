import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import FraudAlertCard from '../components/FraudAlertCard';
import { ShieldCheck, Fingerprint, Activity } from 'lucide-react';

const FraudAlerts = () => {
  const [alerts, setAlerts] = useState([]);

  const fetchAlerts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/fraud/alerts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAlerts(res.data);
    } catch (err) { console.error(err); }
  };

  const handleClearLogs = () => {
    if (alerts.length === 0) return;
    if (window.confirm("Are you sure you want to purge security logs? This action is irreversible.")) {
      setAlerts([]);
      alert("Security logs purged from active memory.");
    }
  };

  const handleExportReport = () => {
    if (alerts.length === 0) return alert("No threat data to export.");
    
    const headers = ['ID', 'Transaction ID', 'Merchant', 'Amount', 'Confidence', 'Timestamp', 'Status'];
    const csvRows = [
      headers.join(','),
      ...alerts.map(a => [
        a.id,
        a.transactionId,
        `"${a.Transaction?.merchantName || 'Unknown'}"`,
        a.Transaction?.amount || 0,
        `${(a.Transaction?.fraudConfidence * 100 || 0).toFixed(2)}%`,
        new Date(a.createdAt).toISOString(),
        a.status
      ].join(','))
    ];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `NexaGuard_Security_Report_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  useEffect(() => { fetchAlerts(); }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 lg:p-10 max-w-[1400px] mx-auto space-y-12"
    >
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <span className="text-gold text-[10px] font-black uppercase tracking-[0.3em] mb-2 block">Threat Intelligence</span>
          <h1 className="text-4xl font-black text-white tracking-tighter">Security <span className="text-gold/50">Command</span></h1>
        </div>
        <div className="flex gap-4">
           <div className="flex items-center gap-3 bg-success/5 border border-success/20 px-6 py-3.5 rounded-2xl">
            <Fingerprint size={20} className="text-success" />
            <span className="text-[10px] font-black text-success uppercase tracking-[0.2em]">Biometric Guard Active</span>
          </div>
           <div className="flex items-center gap-3 bg-gold/5 border border-gold/20 px-6 py-3.5 rounded-2xl">
            <Activity size={20} className="text-gold" />
            <span className="text-[10px] font-black text-gold uppercase tracking-[0.2em] animate-pulse">Monitoring Nodes</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {alerts.map((alert, i) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <FraudAlertCard alert={alert} />
            </motion.div>
          ))}
        </AnimatePresence>
        
        {alerts.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-span-full glass-card p-24 flex flex-col items-center justify-center text-center space-y-8 relative overflow-hidden"
          >
            {/* Handcrafted Radar Effect */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
               <div className="w-[400px] h-[400px] border border-success/10 rounded-full animate-ping opacity-20" />
               <div className="w-[600px] h-[600px] border border-success/5 rounded-full animate-ping opacity-10" style={{ animationDelay: '1s' }} />
            </div>

            <div className="w-32 h-32 bg-success/10 rounded-[2.5rem] flex items-center justify-center text-success relative z-10 border border-success/20 shadow-2xl">
              <ShieldCheck size={56} className="drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
              <div className="absolute inset-0 bg-success/20 blur-3xl rounded-full" />
            </div>
            
            <div className="relative z-10">
              <h3 className="text-3xl font-black text-white mb-3 tracking-tight">Systems <span className="text-success/50">Nominal</span></h3>
              <p className="text-textSecondary text-sm max-w-md mx-auto leading-relaxed">
                NexaGuard Threat Radar reports clear airspace. Your assets are currently isolated within our encrypted sovereign cloud nodes.
              </p>
            </div>

            <div className="flex gap-4 relative z-10">
               <button onClick={handleClearLogs} className="px-8 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-textSecondary transition-all">Clear Logs</button>
               <button onClick={handleExportReport} className="px-8 py-3 bg-success/20 hover:bg-success/30 rounded-xl text-[10px] font-black uppercase tracking-widest text-success transition-all">Export Report</button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default FraudAlerts;
