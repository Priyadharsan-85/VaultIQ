import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Smartphone, CheckCircle, RefreshCw, Landmark } from 'lucide-react';

const IndianBankConnect = ({ onSyncSuccess }) => {
  const [phone, setPhone] = useState('');
  const [isLinked, setIsLinked] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [consentId, setConsentId] = useState(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/setu/status`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.isLinked) {
          setIsLinked(true);
          setPhone(res.data.phone || '');
        }
      } catch (err) {
        console.error('Failed to check Setu status', err);
      }
    };
    checkStatus();
  }, []);

  const requestConsent = async () => {
    if (!phone || phone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/setu/create_consent`, { phone }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setConsentId(response.data.consentId);
      
      // Simulate the Setu OTP WebView Redirect Flow
      setTimeout(() => {
        setIsLinked(true);
        setLoading(false);
        syncTransactions();
      }, 2000);

    } catch (err) {
      console.error('Error creating Setu consent:', err);
      setErrorMsg('Failed to initialize Account Aggregator. Ensure backend is running.');
      setLoading(false);
    }
  };

  const syncTransactions = async () => {
    setSyncing(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/setu/sync_data`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (onSyncSuccess) onSyncSuccess(response.data.transactions);
    } catch (err) {
      console.error('Error syncing AA data:', err);
      setErrorMsg('Failed to sync Indian Bank data.');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="bg-cardBg rounded-xl p-6 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-white font-bold mb-1 flex items-center gap-2">
            Indian Bank Connect (AA)
            {isLinked && <CheckCircle size={16} className="text-success" />}
          </h3>
          <p className="text-textSecondary text-xs max-w-xs">
            {isLinked ? 'Securely linked via Setu Account Aggregator' : 'Link HDFC, SBI, ICICI, or others via mobile OTP.'}
          </p>
        </div>

        {!isLinked ? (
          <div className="flex flex-col gap-2 w-full md:w-auto">
            {errorMsg && <p className="text-red-500 text-xs">{errorMsg}</p>}
            
            <div className="flex items-center gap-2">
              <div className="relative flex-1 md:w-48">
                <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-textSecondary" size={16} />
                <input
                  type="tel"
                  placeholder="Enter Mobile Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-darkBg border border-borderHighlight text-white text-sm rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:border-gold"
                  disabled={loading}
                />
              </div>
              <button
                onClick={requestConsent}
                disabled={loading || !phone}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-gold/10 text-gold rounded-lg text-sm font-semibold hover:bg-gold/20 transition-colors disabled:opacity-50 whitespace-nowrap"
              >
                {loading ? <RefreshCw size={16} className="animate-spin" /> : <Landmark size={16} />}
                {loading ? 'Connecting...' : 'Connect Bank'}
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={syncTransactions}
            disabled={syncing}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-success/10 text-success rounded-lg text-sm font-semibold hover:bg-success/20 transition-colors disabled:opacity-50 whitespace-nowrap w-full md:w-auto"
          >
            <RefreshCw size={16} className={syncing ? 'animate-spin' : ''} />
            {syncing ? 'Syncing...' : 'Sync Live Data'}
          </button>
        )}
      </div>
    </div>
  );
};

export default IndianBankConnect;
