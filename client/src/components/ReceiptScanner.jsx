import React, { useState, useRef } from 'react';
import { Upload, X, FileImage, Loader2 } from 'lucide-react';
import axios from 'axios';

const ReceiptScanner = ({ onScanComplete, onClose }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFile = (file) => {
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      setError("Please select a valid image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target.result);
      scanReceipt(e.target.result);
    };
    reader.onerror = () => {
      setError("Failed to read file.");
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  const handleFileChange = (e) => {
    setError(null);
    const file = e.target.files[0];
    processFile(file);
  };

  const scanReceipt = async (base64) => {
    setIsScanning(true);
    setError(null);
    try {
      // Need to attach token just like other authenticated requests
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/transactions/scan`,
        { imageBase64: base64 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      onScanComplete(response.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to parse receipt. Please try again.");
      setPreviewUrl(null);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <span className="text-gold text-[10px] font-black uppercase tracking-[0.4em] mb-1 block">AI Vision</span>
          <h3 className="text-2xl font-black text-white tracking-tighter">Smart Receipt <span className="text-gold/50">Scanner</span></h3>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-2 text-textSecondary hover:text-white transition-colors">
            <X size={20} />
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium">
          {error}
        </div>
      )}

      {!previewUrl ? (
        <div 
          className={`border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300 ${
            isDragging 
              ? 'border-gold bg-gold/5 scale-[1.02]' 
              : 'border-white/10 hover:border-gold/30 hover:bg-white/[0.02]'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
          
          <div className="w-20 h-20 rounded-full bg-white/[0.03] flex items-center justify-center mx-auto mb-6 text-gold group-hover:scale-110 transition-transform">
            <Upload size={32} />
          </div>
          <h4 className="text-white font-bold text-lg mb-2">Drop receipt here</h4>
          <p className="text-textSecondary text-sm mb-6 max-w-xs mx-auto">Upload an image of your receipt and Omni-Vault AI will automatically extract the transaction details.</p>
          
          <button className="px-6 py-3 bg-white/5 hover:bg-gold hover:text-darkBg rounded-xl text-white text-xs font-black uppercase tracking-widest transition-all">
            Browse Files
          </button>
        </div>
      ) : (
        <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-white/[0.02]">
          <div className="relative h-[300px] w-full flex items-center justify-center p-4">
             <img src={previewUrl} alt="Receipt preview" className="max-h-full max-w-full rounded-xl object-contain opacity-50" />
             
             {isScanning && (
               <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                 <div className="absolute inset-0 bg-darkBg/60 backdrop-blur-sm"></div>
                 <Loader2 size={48} className="text-gold animate-spin mb-4 relative z-10" />
                 <p className="text-white font-black tracking-widest text-sm relative z-10 animate-pulse">ANALYZING RECEIPT...</p>
                 <p className="text-textSecondary text-xs mt-2 relative z-10">Extracting merchant, amount, and category</p>
               </div>
             )}
          </div>
          
          {!isScanning && (
            <div className="p-4 bg-darkBg/50 border-t border-white/5 flex justify-end gap-4">
              <button 
                onClick={() => setPreviewUrl(null)}
                className="px-6 py-3 text-xs font-black text-textSecondary hover:text-white uppercase tracking-widest transition-colors"
              >
                Scan Another
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReceiptScanner;
