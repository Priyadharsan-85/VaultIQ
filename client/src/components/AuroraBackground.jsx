import React from 'react';

const AuroraBackground = () => {
  return (
    <div className="aurora-container">
      <div className="aurora-blob blob-1"></div>
      <div className="aurora-blob blob-2"></div>
      <div className="aurora-blob blob-3"></div>
      {/* Subtle Grain Overlay for texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
    </div>
  );
};

export default AuroraBackground;
