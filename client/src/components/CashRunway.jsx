import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';
import { Loader2, TrendingUp, TrendingDown } from 'lucide-react';

const CashRunway = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({ current: 0, projected30: 0, projected90: 0, trend: 'neutral' });

  useEffect(() => {
    const fetchRunway = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/dashboard/runway`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const rawData = res.data;
        
        // Process data for Recharts (split into historical and projected series to style them differently)
        let processedData = [];
        let todayDate = null;

        for (let i = 0; i < rawData.length; i++) {
          const point = rawData[i];
          const dateObj = new Date(point.date);
          const formattedDate = dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

          if (!point.isProjection) {
            todayDate = formattedDate;
            processedData.push({
              name: formattedDate,
              historical: point.balance,
              projected: null,
              rawDate: point.date
            });
          } else {
            // For the very first projected point, we want to copy the historical value to connect the line
            if (processedData[processedData.length - 1].projected === null) {
              processedData[processedData.length - 1].projected = processedData[processedData.length - 1].historical;
            }
            processedData.push({
              name: formattedDate,
              historical: null,
              projected: point.balance,
              rawDate: point.date
            });
          }
        }

        setData(processedData);

        // Calculate simple metrics for the header
        const currentBalance = rawData.find(d => !d.isProjection && d === rawData.filter(x => !x.isProjection).pop())?.balance || 0;
        const proj30 = rawData[30 + 30]?.balance || 0; // 30 past + 30 future
        const proj90 = rawData[rawData.length - 1]?.balance || 0;
        
        setMetrics({
          current: currentBalance,
          projected30: proj30,
          projected90: proj90,
          trend: proj90 >= currentBalance ? 'up' : 'down'
        });

      } catch (err) {
        console.error('Failed to fetch runway data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRunway();
  }, []);

  if (loading) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <Loader2 className="text-gold animate-spin" size={32} />
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const isProj = payload[0].dataKey === 'projected' || (payload[1] && payload[1].dataKey === 'projected');
      const val = payload[0].value !== undefined ? payload[0].value : (payload[1] ? payload[1].value : 0);
      
      return (
        <div className="glass p-4 border border-white/10 shadow-2xl">
          <p className="text-textSecondary text-[10px] font-black uppercase tracking-widest mb-1">{label} {isProj && '(Predicted)'}</p>
          <p className="text-white text-lg font-black tracking-tighter">₹{(val || 0).toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-start mb-6">
        <div>
          <span className="text-gold text-[10px] font-black uppercase tracking-[0.4em] mb-1 block">Predictive Analytics</span>
          <h3 className="text-xl font-black text-white tracking-tighter">Cash <span className="text-gold/50">Runway</span></h3>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-textSecondary uppercase tracking-widest mb-1">90-Day Forecast</p>
          <div className={`flex items-center gap-2 justify-end ${metrics.trend === 'up' ? 'text-success' : 'text-red-400'}`}>
            {metrics.trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span className="font-black">₹{metrics.projected90.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full relative" style={{ minHeight: '300px' }}>
        <ResponsiveContainer width="99%" height="100%" debounce={100} minWidth={100} minHeight={100}>
          <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorHistorical" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#C6A87C" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#C6A87C" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#C6A87C" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#C6A87C" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis 
              dataKey="name" 
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 800 }} 
              tickLine={false} 
              axisLine={false} 
              minTickGap={30}
            />
            <YAxis 
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 800 }} 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={(val) => `₹${(val/1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            
            <ReferenceLine x={data.find(d => d.projected !== null && d.historical !== null)?.name} stroke="rgba(255,255,255,0.2)" strokeDasharray="3 3" />

            <Area 
              type="monotone" 
              dataKey="historical" 
              stroke="#C6A87C" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorHistorical)" 
              isAnimationActive={true}
            />
            <Area 
              type="monotone" 
              dataKey="projected" 
              stroke="#C6A87C" 
              strokeWidth={2}
              strokeDasharray="5 5"
              fillOpacity={1} 
              fill="url(#colorProjected)" 
              isAnimationActive={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CashRunway;
