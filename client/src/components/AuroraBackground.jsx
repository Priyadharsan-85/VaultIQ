import React from 'react';

const AuroraBackground = () => {
  return (
    <div className="aurora-container">
      <div className="aurora-blob blob-1"></div>
      <div className="aurora-blob blob-2"></div>
      <div className="aurora-blob blob-3"></div>
      {/* Subtle Grain Overlay for texture - Using class from index.css to avoid JSX syntax issues */}
      <div className="grain-overlay opacity-[0.03]"></div>
    </div>
  );
};

export default AuroraBackground;
