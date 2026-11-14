import React, { useState, useEffect } from 'react';
import { Compass, Globe, Sparkles, Orbit, Radio, Eye } from 'lucide-react';

export const CELESTIAL_DESTINATIONS = {
  simulator: {
    id: "EARTH",
    name: "Planet Earth & LEO",
    subtitle: "Low Earth Orbit • ISS Station Track",
    altitude: "408 km",
    velocity: "27,600 km/h",
    inclination: "51.6°",
    primaryColor: "#0284C7",
    glowColor: "rgba(2, 132, 199, 0.45)",
    atmosphereColor: "rgba(56, 189, 248, 0.35)",
    tag: "SECTOR 01: LEO ORBITAL STATION"
  },
  intelligence: {
    id: "MOON",
    name: "The Moon & Lunar Gateway",
    subtitle: "Artemis Halo Orbit • Shackleton Basin",
    altitude: "384,400 km",
    velocity: "3,683 km/h",
    inclination: "5.14°",
    primaryColor: "#94A3B8",
    glowColor: "rgba(148, 163, 184, 0.4)",
    atmosphereColor: "rgba(241, 245, 249, 0.25)",
    tag: "SECTOR 02: LUNAR GATEWAY ARCHITECTURE"
  },
  ground: {
    id: "MARS",
    name: "Planet Mars & Deep Transit",
    subtitle: "Elysium Planitia • Ares Trajectory",
    altitude: "225,000,000 km",
    velocity: "24,100 km/h",
    inclination: "1.85°",
    primaryColor: "#DC2626",
    glowColor: "rgba(220, 38, 38, 0.45)",
    atmosphereColor: "rgba(249, 115, 22, 0.3)",
    tag: "SECTOR 03: MARS EXPEDITION TRANSIT"
  },
  export: {
    id: "JUPITER",
    name: "Jupiter & Europa Relay",
    subtitle: "Jovian Magnetosphere • Deep Space Relay",
    altitude: "628,730,000 km",
    velocity: "47,000 km/h",
    inclination: "1.31°",
    primaryColor: "#D97706",
    glowColor: "rgba(217, 119, 6, 0.45)",
    atmosphereColor: "rgba(251, 191, 36, 0.25)",
    tag: "SECTOR 04: DEEP PLANETARY TELEMETRY RELAY"
  },
  code: {
    id: "SATURN",
    name: "Saturn & Ring System",
    subtitle: "Cassini Resonances • Ring Plane",
    altitude: "1,200,000,000 km",
    velocity: "34,800 km/h",
    inclination: "2.49°",
    primaryColor: "#CA8A04",
    glowColor: "rgba(202, 138, 4, 0.45)",
    atmosphereColor: "rgba(253, 224, 71, 0.25)",
    tag: "SECTOR 05: ORBITAL HARMONICS CODEBASE"
  },
  about: {
    id: "NEBULA",
    name: "Deep Space Orion Nebula",
    subtitle: "Stellar Nursery • Interstellar Core",
    altitude: "1,344 Light Years",
    velocity: "Relativistic Vector",
    inclination: "Galactic Plane",
    primaryColor: "#9333EA",
    glowColor: "rgba(147, 51, 234, 0.5)",
    atmosphereColor: "rgba(236, 72, 153, 0.3)",
    tag: "SECTOR 06: NASA SPACE APPS GALAXY"
  }
};

export default function GalaxyBackground({ activeTab = 'simulator' }) {
  const [scrollY, setScrollY] = useState(0);
  const [manualPlanet, setManualPlanet] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeDestination = manualPlanet 
    ? CELESTIAL_DESTINATIONS[manualPlanet] 
    : (CELESTIAL_DESTINATIONS[activeTab] || CELESTIAL_DESTINATIONS.simulator);

  // Parallax calculations
  const planetTranslateY = Math.min(220, scrollY * 0.12);
  const planetRotation = (scrollY * 0.04) % 360;
  const starfieldShift = (scrollY * 0.05) % 100;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[#030712]">
      
      {/* 1. Deep Space Cosmic Nebulae Gradients */}
      <div 
        className="absolute inset-0 opacity-40 transition-all duration-1000 ease-out"
        style={{
          background: `
            radial-gradient(circle at 75% 25%, ${activeDestination.glowColor} 0%, transparent 60%),
            radial-gradient(circle at 20% 70%, rgba(99, 102, 241, 0.15) 0%, transparent 55%),
            radial-gradient(circle at 50% 85%, rgba(168, 85, 247, 0.12) 0%, transparent 50%)
          `
        }}
      />

      {/* 2. Multi-Layer Twinkling Starfields */}
      {/* Layer A: Tiny distant stars */}
      <div 
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage: `
            radial-gradient(1px 1px at 25px 35px, #FFFFFF, transparent),
            radial-gradient(1px 1px at 120px 80px, #E0F2FE, transparent),
            radial-gradient(1.5px 1.5px at 220px 190px, #FFFFFF, transparent),
            radial-gradient(1px 1px at 340px 110px, #93C5FD, transparent),
            radial-gradient(1.5px 1.5px at 460px 240px, #FFFFFF, transparent),
            radial-gradient(1px 1px at 580px 70px, #FDE68A, transparent),
            radial-gradient(1.5px 1.5px at 700px 320px, #FFFFFF, transparent),
            radial-gradient(1px 1px at 840px 150px, #E0F2FE, transparent),
            radial-gradient(1.5px 1.5px at 960px 280px, #FFFFFF, transparent),
            radial-gradient(1px 1px at 1080px 90px, #93C5FD, transparent)
          `,
          backgroundSize: '400px 400px',
          transform: `translateY(-${starfieldShift}px)`
        }}
      />

      {/* Layer B: Medium twinkling stars with CSS pulse */}
      <div 
        className="absolute inset-0 opacity-80 animate-star-twinkle"
        style={{
          backgroundImage: `
            radial-gradient(2px 2px at 80px 140px, #00F0FF, transparent),
            radial-gradient(2.5px 2.5px at 260px 40px, #FFFFFF, transparent),
            radial-gradient(2px 2px at 410px 310px, #E0F2FE, transparent),
            radial-gradient(3px 3px at 620px 180px, #FDE68A, transparent),
            radial-gradient(2px 2px at 810px 90px, #FFFFFF, transparent),
            radial-gradient(2.5px 2.5px at 980px 240px, #00F0FF, transparent)
          `,
          backgroundSize: '650px 650px'
        }}
      />

      {/* Layer C: Prominent celestial starbursts */}
      <div className="absolute inset-0 opacity-75 animate-star-twinkle-delayed">
        <div className="absolute top-[18%] left-[12%] w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_12px_#00F0FF]" />
        <div className="absolute top-[42%] right-[18%] w-2 h-2 rounded-full bg-white shadow-[0_0_16px_#FFFFFF]" />
        <div className="absolute top-[68%] left-[8%] w-1.5 h-1.5 rounded-full bg-amber-200 shadow-[0_0_12px_#F59E0B]" />
        <div className="absolute top-[82%] right-[14%] w-2 h-2 rounded-full bg-sky-200 shadow-[0_0_14px_#38BDF8]" />
      </div>

      {/* 3. Deep Space Orbital Coordinate Trajectories */}
      <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <ellipse 
          cx="50%" 
          cy="45%" 
          rx="720" 
          ry="320" 
          fill="none" 
          stroke={activeDestination.primaryColor} 
          strokeWidth="1.2" 
          strokeDasharray="8 12" 
        />
        <ellipse 
          cx="50%" 
          cy="45%" 
          rx="980" 
          ry="440" 
          fill="none" 
          stroke="#475569" 
          strokeWidth="0.8" 
          strokeDasharray="4 8" 
        />
        {/* Tangent vectors */}
        <line x1="15%" y1="20%" x2="45%" y2="20%" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" strokeDasharray="3 3" />
        <line x1="60%" y1="80%" x2="85%" y2="80%" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" strokeDasharray="3 3" />
      </svg>

      {/* ============================================================== */}
      {/* 4. PLANETARY SYSTEM ENGINE (Substituted per page & scroll)      */}
      {/* ============================================================== */}
      
      <div 
        className="absolute top-20 right-4 sm:right-12 lg:right-24 w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] lg:w-[480px] lg:h-[480px] transition-all duration-1000 ease-out"
        style={{
          transform: `translateY(${planetTranslateY}px) rotate(${planetRotation * 0.15}deg)`,
          opacity: 0.88
        }}
      >
        
        {/* Atmospheric Glow Halo */}
        <div 
          className="absolute inset-0 rounded-full blur-2xl transition-all duration-1000"
          style={{
            background: `radial-gradient(circle, ${activeDestination.atmosphereColor} 0%, transparent 70%)`
          }}
        />

        {/* ----------------- PLANET 1: EARTH (LEO) ----------------- */}
        {activeDestination.id === "EARTH" && (
          <div className="relative w-full h-full rounded-full overflow-hidden shadow-[0_0_80px_rgba(2,132,199,0.5)] border border-sky-400/30">
            {/* Deep ocean base */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-[#0284C7] to-[#0369A1]" />
            
            {/* Continents & Landmass Vector */}
            <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full opacity-70">
              <path d="M120,80 Q160,70 190,110 T240,180 Q200,220 170,200 T110,140 Z" fill="#059669" opacity="0.8" />
              <path d="M220,100 Q260,80 300,120 T320,200 Q270,220 250,180 Z" fill="#047857" opacity="0.8" />
              <path d="M140,240 Q180,220 210,270 T190,340 Q150,350 130,300 Z" fill="#065F46" opacity="0.8" />
              
              {/* Cloud Swirls */}
              <path d="M80,120 Q180,90 280,140 T360,110" stroke="#FFFFFF" strokeWidth="18" strokeLinecap="round" opacity="0.45" fill="none" filter="blur(4px)" />
              <path d="M110,210 Q210,180 320,240" stroke="#FFFFFF" strokeWidth="22" strokeLinecap="round" opacity="0.4" fill="none" filter="blur(6px)" />
              <path d="M140,290 Q220,280 290,320" stroke="#FFFFFF" strokeWidth="14" strokeLinecap="round" opacity="0.35" fill="none" filter="blur(4px)" />
            </svg>

            {/* Atmosphere Horizon Limb Light */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-transparent to-cyan-300/40" />
            <div className="absolute inset-0 rounded-full shadow-[inset_-30px_-30px_70px_rgba(3,7,18,0.95)]" />
          </div>
        )}

        {/* ----------------- PLANET 2: THE MOON ----------------- */}
        {activeDestination.id === "MOON" && (
          <div className="relative w-full h-full rounded-full overflow-hidden shadow-[0_0_70px_rgba(148,163,184,0.4)] border border-slate-400/30">
            {/* Lunar Regolith Base */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#1E293B] via-[#475569] to-[#94A3B8]" />
            
            {/* Crater Basins & Tycho Rays */}
            <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full opacity-60">
              {/* Basalt Maria */}
              <circle cx="150" cy="140" r="55" fill="#1E293B" opacity="0.7" />
              <circle cx="240" cy="180" r="70" fill="#334155" opacity="0.6" />
              <circle cx="180" cy="270" r="45" fill="#1E293B" opacity="0.65" />
              
              {/* Tycho Impact Crater & Ejecta Rays */}
              <circle cx="280" cy="290" r="14" fill="#F8FAFC" />
              <line x1="280" y1="290" x2="160" y2="180" stroke="#F1F5F9" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.7" />
              <line x1="280" y1="290" x2="360" y2="200" stroke="#F1F5F9" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.7" />
              <line x1="280" y1="290" x2="220" y2="380" stroke="#F1F5F9" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.7" />
            </svg>

            <div className="absolute inset-0 rounded-full shadow-[inset_-35px_-35px_80px_rgba(3,7,18,0.95)]" />
          </div>
        )}

        {/* ----------------- PLANET 3: MARS ----------------- */}
        {activeDestination.id === "MARS" && (
          <div className="relative w-full h-full rounded-full overflow-hidden shadow-[0_0_80px_rgba(220,38,38,0.5)] border border-red-500/30">
            {/* Martian Rust Base */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#450A0A] via-[#991B1B] to-[#EA580C]" />
            
            {/* Canyons & Polar Cap */}
            <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full opacity-65">
              {/* North Polar Ice Cap */}
              <ellipse cx="200" cy="30" rx="60" ry="15" fill="#F8FAFC" opacity="0.9" filter="blur(2px)" />
              
              {/* Valles Marineris Canyon */}
              <path d="M120,200 Q200,230 290,190 T340,210" stroke="#450A0A" strokeWidth="8" strokeLinecap="round" fill="none" opacity="0.8" />
              {/* Olympus Mons Caldera */}
              <circle cx="110" cy="140" r="22" fill="#7F1D1D" stroke="#EA580C" strokeWidth="2" opacity="0.8" />
              <circle cx="110" cy="140" r="8" fill="#450A0A" />
            </svg>

            {/* Ochre Haze Limb */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-transparent to-amber-400/30" />
            <div className="absolute inset-0 rounded-full shadow-[inset_-30px_-30px_75px_rgba(3,7,18,0.95)]" />
          </div>
        )}

        {/* ----------------- PLANET 4: JUPITER & EUROPA ----------------- */}
        {activeDestination.id === "JUPITER" && (
          <div className="relative w-full h-full rounded-full overflow-hidden shadow-[0_0_80px_rgba(217,119,6,0.5)] border border-amber-500/30">
            {/* Banded Gas Layers */}
            <div 
              className="absolute inset-0"
              style={{
                background: `linear-gradient(180deg, 
                  #78350F 0%, #D97706 15%, #FEF3C7 28%, #92400E 42%, 
                  #B45309 55%, #FDE68A 68%, #78350F 85%, #451A03 100%)`
              }}
            />

            {/* Great Red Spot */}
            <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full">
              <ellipse cx="260" cy="270" rx="38" ry="24" fill="#B91C1C" stroke="#7F1D1D" strokeWidth="2" opacity="0.9" />
              <ellipse cx="260" cy="270" rx="26" ry="14" fill="#DC2626" opacity="0.8" />
            </svg>

            <div className="absolute inset-0 rounded-full shadow-[inset_-30px_-30px_75px_rgba(3,7,18,0.95)]" />
          </div>
        )}

        {/* ----------------- PLANET 5: SATURN WITH RINGS ----------------- */}
        {activeDestination.id === "SATURN" && (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Back Half of Saturn Rings */}
            <div 
              className="absolute w-[560px] h-[160px] rounded-full border-[18px] border-amber-300/40 -rotate-[22deg] pointer-events-none"
              style={{
                boxShadow: '0 0 40px rgba(251, 191, 36, 0.3)',
                background: 'radial-gradient(ellipse, transparent 65%, rgba(245, 158, 11, 0.25) 75%, transparent 85%)'
              }}
            />

            {/* Saturn Body */}
            <div className="relative w-[70%] h-[70%] rounded-full overflow-hidden shadow-[0_0_70px_rgba(202,138,4,0.5)] border border-amber-400/30">
              <div 
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(180deg, 
                    #854D0E 0%, #CA8A04 20%, #FEF08A 40%, #A16207 60%, #EAB308 80%, #713F12 100%)`
                }}
              />
              <div className="absolute inset-0 rounded-full shadow-[inset_-25px_-25px_60px_rgba(3,7,18,0.95)]" />
            </div>

            {/* Front Half of Saturn Rings (Casts Shadow) */}
            <div 
              className="absolute w-[560px] h-[160px] rounded-full border-[18px] border-amber-200/50 -rotate-[22deg] pointer-events-none"
              style={{
                clipPath: 'polygon(0% 50%, 100% 50%, 100% 100%, 0% 100%)',
                boxShadow: '0 0 30px rgba(251, 191, 36, 0.4)'
              }}
            />
          </div>
        )}

        {/* ----------------- PLANET 6: DEEP SPACE NEBULA ----------------- */}
        {activeDestination.id === "NEBULA" && (
          <div className="relative w-full h-full rounded-full flex items-center justify-center">
            <div 
              className="w-full h-full rounded-full blur-xl animate-pulse"
              style={{
                background: 'radial-gradient(circle, #EC4899 0%, #8B5CF6 35%, #06B6D4 70%, transparent 95%)'
              }}
            />
            <div className="absolute w-[80%] h-[80%] rounded-full border border-purple-400/40 animate-planet-spin" />
            <div className="absolute w-6 h-6 rounded-full bg-white shadow-[0_0_30px_#FFFFFF]" />
          </div>
        )}

      </div>

      {/* ============================================================== */}
      {/* 5. COSMIC ORBIT TELEMETRY HUD (Floating Celestial Status)       */}
      {/* ============================================================== */}
      <div className="absolute bottom-4 right-4 sm:right-8 z-30 pointer-events-auto flex items-center gap-2">
        <div className="bg-slate-900/90 border border-slate-700/80 backdrop-blur-md rounded-2xl p-2.5 sm:px-4 sm:py-2.5 shadow-2xl flex items-center gap-3 font-mono text-xs">
          <div 
            className="w-3 h-3 rounded-full animate-ping shrink-0" 
            style={{ backgroundColor: activeDestination.primaryColor }} 
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                {activeDestination.tag}
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-cyan-300 border border-slate-700 font-bold">
                {activeDestination.id}
              </span>
            </div>
            <div className="text-white font-extrabold text-xs sm:text-sm">
              {activeDestination.name}
            </div>
            <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
              <span>Alt: <strong className="text-slate-200">{activeDestination.altitude}</strong></span>
              <span>•</span>
              <span>Vel: <strong className="text-slate-200">{activeDestination.velocity}</strong></span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
