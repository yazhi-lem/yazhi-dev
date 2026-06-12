import React from 'react';

const YazhiLogo = ({ className = "" }) => {
  return (
    <svg 
      viewBox="0 0 200 200" 
      className={`w-full h-full ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>
        {`
          @keyframes float1 {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(-2px, -8px); }
          }
          @keyframes float2 {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(3px, -6px); }
          }
          @keyframes float3 {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(-1px, 5px); }
          }
          .bubble-1 { animation: float1 4s ease-in-out infinite; transform-origin: center; }
          .bubble-2 { animation: float2 5s ease-in-out infinite; transform-origin: center; animation-delay: 1s; }
          .bubble-3 { animation: float3 6s ease-in-out infinite; transform-origin: center; animation-delay: 0.5s; }
        `}
      </style>
      
      {/* Top left bubble */}
      <circle 
        cx="50" 
        cy="50" 
        r="26" 
        fill="currentColor" 
        className="bubble-1"
      />
      
      {/* Top right bubble */}
      <circle 
        cx="140" 
        cy="40" 
        r="35" 
        fill="currentColor" 
        className="bubble-2"
      />
      
      {/* Bottom middle bubble */}
      <circle 
        cx="95" 
        cy="145" 
        r="48" 
        fill="currentColor" 
        className="bubble-3"
      />
    </svg>
  );
};

export default YazhiLogo;
