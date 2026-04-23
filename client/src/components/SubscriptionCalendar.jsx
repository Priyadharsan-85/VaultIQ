import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, getDay } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, RefreshCw, AlertCircle, TrendingUp } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const SubscriptionCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [subscriptions, setSubscriptions] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchSubscriptions = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/subscriptions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubscriptions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const scanSubscriptions = async () => {
    setIsScanning(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.REACT_APP_API_URL}/api/subscriptions/scan`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchSubscriptions();
    } catch (err) {
      console.error(err);
    } finally {
      setIsScanning(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayIndex = getDay(monthStart);

  const getDaySubs = (day) => {
    return subscriptions.filter(sub => isSameDay(new Date(sub.nextBillingDate), day));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <span className="text-gold text-[10px] font-black uppercase tracking-[0.4em] mb-1 block">Recurring Flux</span>
          <h3 className="text-2xl font-black text-white tracking-tighter">Bill <span className="text-gold/50">Matrix</span></h3>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={scanSubscriptions}
            disabled={isScanning}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-gold hover:text-darkBg rounded-xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50"
          >
            <RefreshCw size={14} className={isScanning ? 'animate-spin' : ''} />
            {isScanning ? 'Scanning...' : 'Scan Node'}
          </button>
          <div className="flex items-center gap-2 bg-white/5 rounded-xl p-1">
            <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:text-gold transition-colors"><ChevronLeft size={16}/></button>
            <span className="text-[10px] font-black uppercase tracking-widest px-2">{format(currentMonth, 'MMMM yyyy')}</span>
            <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:text-gold transition-colors"><ChevronRight size={16}/></button>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-7 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/5">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="bg-darkBg/50 p-2 text-center text-[10px] font-black uppercase tracking-widest text-textSecondary border-b border-white/5">
            {day}
          </div>
        ))}
        {/* Empty padding days */}
        {[...Array(startDayIndex)].map((_, i) => (
          <div key={`empty-${i}`} className="bg-darkBg/10 p-2 min-h-[80px] opacity-20" />
        ))}
        {days.map(day => {
          const daySubs = getDaySubs(day);
          return (
            <div key={day.toString()} className="bg-darkBg/30 p-2 min-h-[80px] hover:bg-white/[0.02] transition-colors relative">
              <span className="text-[10px] font-bold text-textSecondary/50">{format(day, 'd')}</span>
              <div className="mt-1 space-y-1">
                {daySubs.map(sub => (
                  <div key={sub.id} className="text-[9px] p-1 bg-gold/10 border border-gold/20 rounded text-gold truncate flex flex-col">
                    <span className="font-black truncate">{sub.merchantName}</span>
                    <span>₹{sub.amount}</span>
                    {sub.amount > sub.previousAmount && (
                      <span className="text-[8px] text-red-400 flex items-center gap-1 font-bold mt-0.5">
                        <TrendingUp size={8} /> HIKE
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 space-y-4">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-textSecondary">Anomalies Detected</h4>
        {subscriptions.filter(s => s.amount > s.previousAmount).map(sub => (
          <div key={sub.id} className="glass border-red-500/20 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/10 rounded-lg text-red-400">
                <AlertCircle size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{sub.merchantName} Price Surge</p>
                <p className="text-[10px] text-textSecondary uppercase tracking-widest">
                  Increased from ₹{sub.previousAmount} to ₹{sub.amount}
                </p>
              </div>
            </div>
            <button className="text-[10px] font-black text-gold uppercase tracking-widest hover:underline">Resolve</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionCalendar;
