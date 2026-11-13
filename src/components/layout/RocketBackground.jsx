import React from 'react';

export default function RocketBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      
      {/* 1. Large Rocket (Left Side - Launching Upward) */}
      <div className="absolute -left-10 top-20 w-80 h-[580px] opacity-[0.14] text-sky-800 animate-float-slow">
        <svg viewBox="0 0 200 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Rocket Nosecone & Capsule */}
          <path d="M100 20 C100 20 80 80 80 140 L120 140 C120 80 100 20 100 20 Z" fill="currentColor" />
          <circle cx="100" cy="100" r="10" fill="#F8FAFC" />
          <circle cx="100" cy="100" r="6" fill="currentColor" />
          
          {/* Main Core Body */}
          <rect x="80" y="140" width="40" height="260" rx="3" fill="currentColor" />
          {/* Panel lines */}
          <line x1="80" y1="180" x2="120" y2="180" stroke="#F8FAFC" strokeWidth="2" />
          <line x1="80" y1="240" x2="120" y2="240" stroke="#F8FAFC" strokeWidth="2" />
          <line x1="80" y1="320" x2="120" y2="320" stroke="#F8FAFC" strokeWidth="2" />
          <line x1="100" y1="140" x2="100" y2="400" stroke="#F8FAFC" strokeWidth="1" strokeDasharray="4 4" />

          {/* Left Solid Rocket Booster */}
          <path d="M60 200 C60 170 68 150 68 150 L68 390 L52 390 L52 230 C52 210 60 200 60 200 Z" fill="currentColor" />
          <polygon points="52,390 68,390 70,420 50,420" fill="currentColor" />
          {/* Right Solid Rocket Booster */}
          <path d="M140 200 C140 170 132 150 132 150 L132 390 L148 390 L148 230 C148 210 140 200 140 200 Z" fill="currentColor" />
          <polygon points="132,390 148,390 150,420 130,420" fill="currentColor" />

          {/* Core Engine Nozzles */}
          <polygon points="82,400 96,400 93,425 85,425" fill="currentColor" />
          <polygon points="104,400 118,400 115,425 107,425" fill="currentColor" />

          {/* Exhaust Plume Trail */}
          <path d="M85 425 Q100 520 80 580 Q100 540 115 425 Z" fill="url(#exhaustGrad)" opacity="0.6" />

          {/* Gradient for exhaust */}
          <defs>
            <linearGradient id="exhaustGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0284C7" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0284C7" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* 2. Sleek Deep Space Exploration Vessel (Right Side - Angled Ascent) */}
      <div className="absolute -right-8 top-44 w-96 h-[540px] opacity-[0.12] text-indigo-900 animate-float-reverse rotate-12">
        <svg viewBox="0 0 240 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Starship styled aerodynamic nosecone */}
          <path d="M120 30 C120 30 90 110 90 260 L150 260 C150 110 120 30 120 30 Z" fill="currentColor" />
          
          {/* Forward Aerodynamic Flaps */}
          <polygon points="90,110 50,140 90,160" fill="currentColor" />
          <polygon points="150,110 190,140 150,160" fill="currentColor" />

          {/* Lower Hull */}
          <rect x="90" y="260" width="60" height="150" fill="currentColor" />
          
          {/* Aft Steering Fins */}
          <polygon points="90,320 30,410 90,400" fill="currentColor" />
          <polygon points="150,320 210,410 150,400" fill="currentColor" />

          {/* Windows / Viewports */}
          <circle cx="120" cy="90" r="5" fill="#F8FAFC" />
          <circle cx="120" cy="110" r="5" fill="#F8FAFC" />
          <circle cx="120" cy="130" r="5" fill="#F8FAFC" />

          {/* Engine Cluster */}
          <rect x="95" y="410" width="12" height="15" rx="2" fill="currentColor" />
          <rect x="114" y="410" width="12" height="15" rx="2" fill="currentColor" />
          <rect x="133" y="410" width="12" height="15" rx="2" fill="currentColor" />

          {/* Trajectory Arc */}
          <path d="M120 425 Q130 520 180 580" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" />
        </svg>
      </div>

      {/* 3. Orbital Trajectory Paths & Celestial Grid in the Background */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.09]" xmlns="http://www.w3.org/2000/svg">
        {/* Orbital Ellipses */}
        <ellipse cx="50%" cy="40%" rx="620" ry="240" fill="none" stroke="#0284C7" strokeWidth="1.5" strokeDasharray="8 8" />
        <ellipse cx="50%" cy="40%" rx="850" ry="360" fill="none" stroke="#0F172A" strokeWidth="1" strokeDasharray="12 12" />
        <circle cx="75%" cy="25%" r="6" fill="#0284C7" />
        <circle cx="25%" cy="55%" r="4" fill="#0284C7" />
        <circle cx="40%" cy="15%" r="5" fill="#0369A1" />
        <circle cx="85%" cy="65%" r="7" fill="#0369A1" />
      </svg>

      {/* 4. Small Rocket Flying in Center Top (High Altitude Transit) */}
      <div className="absolute left-1/4 top-8 opacity-[0.16] text-sky-700 animate-float-slow -rotate-45">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.5s-4 4.5-4 10.5c0 1.5.5 3 1.5 4l-2.5 3 3.5-1.5c1 .5 2 .5 3 .5s2 0 3-.5l3.5 1.5-2.5-3c1-1 1.5-2.5 1.5-4 0-6-4-10.5-4-10.5z" />
          <circle cx="12" cy="9" r="1.5" fill="#F8FAFC" />
        </svg>
      </div>

      {/* 5. Additional Rocket in Bottom Right */}
      <div className="absolute right-1/4 bottom-12 opacity-[0.13] text-blue-800 animate-float-reverse rotate-[25deg]">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.5s-4 4.5-4 10.5c0 1.5.5 3 1.5 4l-2.5 3 3.5-1.5c1 .5 2 .5 3 .5s2 0 3-.5l3.5 1.5-2.5-3c1-1 1.5-2.5 1.5-4 0-6-4-10.5-4-10.5z" />
          <circle cx="12" cy="9" r="1.5" fill="#F8FAFC" />
        </svg>
      </div>

    </div>
  );
}
