import React, { useState, useEffect, useRef } from 'react';
import { Compass, Globe, Sparkles, Orbit, Radio, Camera, ChevronUp, ChevronDown, CheckCircle2, RotateCcw } from 'lucide-react';

export const CELESTIAL_DESTINATIONS = {
  simulator: {
    id: "EARTH",
    tabKey: "simulator",
    name: "Planet Earth & Low Earth Orbit",
    subtitle: "ISS Orbit Track • Altitude 408 km",
    image: "/planets/earth.jpg",
    type: "sphere",
    beacon: "ISS • 28.5°N",
    beaconSub: "Alpha Station",
    altitude: "408 km",
    velocity: "27,600 km/h",
    inclination: "51.6°",
    primaryColor: "#0284C7",
    glowColor: "rgba(2, 132, 199, 0.35)",
    atmosphereColor: "rgba(56, 189, 248, 0.32)",
    tag: "SECTOR 01: LEO ORBITAL STATION",
    citation: "NASA Blue Marble • Suomi NPP Satellite Imagery"
  },
  intelligence: {
    id: "MOON",
    tabKey: "intelligence",
    name: "The Moon & Lunar Gateway",
    subtitle: "Artemis Halo Orbit • Shackleton Basin",
    image: "/planets/moon.jpg",
    type: "sphere",
    beacon: "GATEWAY • NRHO",
    beaconSub: "Artemis Relay",
    altitude: "384,400 km",
    velocity: "3,683 km/h",
    inclination: "5.14°",
    primaryColor: "#94A3B8",
    glowColor: "rgba(148, 163, 184, 0.3)",
    atmosphereColor: "rgba(241, 245, 249, 0.22)",
    tag: "SECTOR 02: LUNAR GATEWAY ARCHITECTURE",
    citation: "NASA Lunar Reconnaissance Orbiter (LRO)"
  },
  ground: {
    id: "MARS",
    tabKey: "ground",
    name: "Planet Mars & Deep Space Transit",
    subtitle: "Elysium Planitia • Ares Trajectory",
    image: "/planets/mars.jpg",
    type: "sphere",
    beacon: "ARES-1 • TRANSIT",
    beaconSub: "Perseverance Relay",
    altitude: "225,000,000 km",
    velocity: "24,100 km/h",
    inclination: "1.85°",
    primaryColor: "#DC2626",
    glowColor: "rgba(220, 38, 38, 0.35)",
    atmosphereColor: "rgba(249, 115, 22, 0.26)",
    tag: "SECTOR 03: MARS EXPEDITION TRANSIT",
    citation: "NASA Viking Orbiter Global True-Color Mosaic"
  },
  export: {
    id: "JUPITER",
    tabKey: "export",
    name: "Jupiter & Europa Relay",
    subtitle: "Jovian Magnetosphere • Deep Space Relay",
    image: "/planets/jupiter.jpg",
    type: "sphere",
    beacon: "EUROPA • PASS",
    beaconSub: "Juno Clipper",
    altitude: "628,730,000 km",
    velocity: "47,000 km/h",
    inclination: "1.31°",
    primaryColor: "#D97706",
    glowColor: "rgba(217, 119, 6, 0.35)",
    atmosphereColor: "rgba(251, 191, 36, 0.26)",
    tag: "SECTOR 04: DEEP PLANETARY TELEMETRY RELAY",
    citation: "NASA Cassini Spacecraft Jovian Flyby"
  },
  code: {
    id: "SATURN",
    tabKey: "code",
    name: "Saturn & Ring System",
    subtitle: "Cassini Resonances • Ring Plane",
    image: "/planets/saturn.jpg",
    type: "saturn",
    beacon: "CASSINI • GAP",
    beaconSub: "Ring Plane Vector",
    altitude: "1,200,000,000 km",
    velocity: "34,800 km/h",
    inclination: "2.49°",
    primaryColor: "#CA8A04",
    glowColor: "rgba(202, 138, 4, 0.35)",
    atmosphereColor: "rgba(253, 224, 71, 0.24)",
    tag: "SECTOR 05: ORBITAL HARMONICS CODEBASE",
    citation: "NASA Cassini Equinox True-Color Portrait"
  },
  about: {
    id: "NEBULA",
    tabKey: "about",
    name: "Cosmic Cliffs & Deep Space",
    subtitle: "Carina Nebula • Interstellar Core",
    image: "/planets/nebula.jpg",
    type: "nebula",
    beacon: "JWST • DEEP FIELD",
    beaconSub: "NIRCam Target",
    altitude: "7,600 Light Years",
    velocity: "Relativistic Vector",
    inclination: "Galactic Plane",
    primaryColor: "#9333EA",
    glowColor: "rgba(147, 51, 234, 0.35)",
    atmosphereColor: "rgba(236, 72, 153, 0.24)",
    tag: "SECTOR 06: NASA SPACE APPS GALAXY",
    citation: "NASA James Webb Space Telescope (JWST) NIRCam"
  }
};

export default function GalaxyBackground({ activeTab = 'simulator' }) {
  const [smoothY, setSmoothY] = useState(0);
  const [manualDestinationKey, setManualDestinationKey] = useState(null);
  const [isOrreryExpanded, setIsOrreryExpanded] = useState(false);

  const targetYRef = useRef(0);
  const currentYRef = useRef(0);

  // Smooth Low-Sensitivity Parallax Drift Engine
  useEffect(() => {
    let animationFrameId;

    const handleScroll = () => {
      // Very low sensitivity: capped at 48px maximum shift across the entire scroll height
      targetYRef.current = Math.min(48, window.scrollY * 0.022);
    };

    const updateSmooth = () => {
      // Low-pass exponential moving average for ultra-smooth gliding
      currentYRef.current += (targetYRef.current - currentYRef.current) * 0.06;
      setSmoothY(currentYRef.current);
      animationFrameId = requestAnimationFrame(updateSmooth);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    animationFrameId = requestAnimationFrame(updateSmooth);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // When activeTab changes, reset any manual lock to follow the mission navigation seamlessly
  useEffect(() => {
    setManualDestinationKey(null);
  }, [activeTab]);

  const activeKey = manualDestinationKey || (CELESTIAL_DESTINATIONS[activeTab] ? activeTab : 'simulator');
  const activeDestination = CELESTIAL_DESTINATIONS[activeKey];

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[#030712]">
      
      {/* 1. Deep Space Cosmic Nebulae Gradients (Ultra-smooth ambient breathing) */}
      <div 
        className="absolute inset-0 opacity-30 transition-all duration-1000 ease-out pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 75% 25%, ${activeDestination.glowColor} 0%, transparent 65%),
            radial-gradient(circle at 20% 70%, rgba(99, 102, 241, 0.12) 0%, transparent 55%),
            radial-gradient(circle at 50% 85%, rgba(168, 85, 247, 0.09) 0%, transparent 50%)
          `
        }}
      />

      {/* 2. Multi-Layer Subtle Twinkling Starfields */}
      {/* Layer A: Tiny distant stars (Calm background) */}
      <div 
        className="absolute inset-0 opacity-55 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(1px 1px at 25px 35px, #FFFFFF, transparent),
            radial-gradient(1px 1px at 120px 80px, #E0F2FE, transparent),
            radial-gradient(1.2px 1.2px at 220px 190px, #FFFFFF, transparent),
            radial-gradient(1px 1px at 340px 110px, #93C5FD, transparent),
            radial-gradient(1.2px 1.2px at 460px 240px, #FFFFFF, transparent),
            radial-gradient(1px 1px at 580px 70px, #FDE68A, transparent),
            radial-gradient(1.2px 1.2px at 700px 320px, #FFFFFF, transparent),
            radial-gradient(1px 1px at 840px 150px, #E0F2FE, transparent),
            radial-gradient(1.2px 1.2px at 960px 280px, #FFFFFF, transparent),
            radial-gradient(1px 1px at 1080px 90px, #93C5FD, transparent)
          `,
          backgroundSize: '450px 450px'
        }}
      />

      {/* Layer B: Medium twinkling stars with gentle pulse */}
      <div 
        className="absolute inset-0 opacity-60 animate-star-twinkle pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(1.5px 1.5px at 80px 140px, #00F0FF, transparent),
            radial-gradient(2px 2px at 260px 40px, #FFFFFF, transparent),
            radial-gradient(1.5px 1.5px at 410px 310px, #E0F2FE, transparent),
            radial-gradient(2px 2px at 620px 180px, #FDE68A, transparent),
            radial-gradient(1.5px 1.5px at 810px 90px, #FFFFFF, transparent),
            radial-gradient(2px 2px at 980px 240px, #00F0FF, transparent)
          `,
          backgroundSize: '650px 650px'
        }}
      />

      {/* Layer C: Delicate celestial starbursts */}
      <div className="absolute inset-0 opacity-50 animate-star-twinkle-delayed pointer-events-none">
        <div className="absolute top-[18%] left-[12%] w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_#00F0FF]" />
        <div className="absolute top-[42%] right-[18%] w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_12px_#FFFFFF]" />
        <div className="absolute top-[68%] left-[8%] w-1.5 h-1.5 rounded-full bg-amber-200 shadow-[0_0_10px_#F59E0B]" />
        <div className="absolute top-[82%] right-[14%] w-1.5 h-1.5 rounded-full bg-sky-200 shadow-[0_0_10px_#38BDF8]" />
      </div>

      {/* 3. Deep Space Orbital Trajectory Guidelines (Faint, elegant reference arcs) */}
      <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <ellipse 
          cx="60%" 
          cy="40%" 
          rx="760" 
          ry="340" 
          fill="none" 
          stroke={activeDestination.primaryColor} 
          strokeWidth="1" 
          strokeDasharray="6 14" 
        />
        <ellipse 
          cx="60%" 
          cy="40%" 
          rx="1020" 
          ry="460" 
          fill="none" 
          stroke="#64748B" 
          strokeWidth="0.8" 
          strokeDasharray="4 10" 
        />
      </svg>

      {/* ============================================================== */}
      {/* 4. REAL PHOTOGRAPHIC PLANETARY ENGINE (NASA Mission Imagery)     */}
      {/* ============================================================== */}
      
      <div 
        className="absolute top-16 right-4 sm:right-12 lg:right-20 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[460px] lg:h-[460px] pointer-events-none"
        style={{
          transform: `translate3d(0, ${smoothY.toFixed(2)}px, 0)`,
          willChange: 'transform'
        }}
      >
        
        {/* Atmospheric Glow Backlight */}
        <div 
          className="absolute inset-0 rounded-full blur-3xl transition-all duration-1000 pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${activeDestination.atmosphereColor} 0%, transparent 72%)`,
            opacity: 0.85
          }}
        />

        {/* ----------------------------------------------------------------- */}
        {/* CINEMATIC PLANETARY STACK (Full Cross-Fade Transitions for All 6) */}
        {/* ----------------------------------------------------------------- */}
        {Object.entries(CELESTIAL_DESTINATIONS).map(([key, dest]) => {
          const isCurrent = activeKey === key;

          return (
            <div
              key={dest.id}
              className="absolute inset-0 transition-all duration-1000 ease-out pointer-events-none"
              style={{
                opacity: isCurrent ? 1 : 0,
                transform: isCurrent ? 'scale(1) rotate(0deg)' : 'scale(0.92) rotate(-3deg)',
                pointerEvents: 'none'
              }}
            >
              {/* SPHERICAL PLANETS (Earth, Moon, Mars, Jupiter) */}
              {dest.type === "sphere" && (
                <div className="relative w-full h-full rounded-full overflow-hidden shadow-2xl">
                  {/* Real NASA Mission Photograph */}
                  <img 
                    src={dest.image} 
                    alt={dest.name}
                    className="w-full h-full object-cover rounded-full select-none"
                    loading="eager"
                  />

                  {/* Authentic 3D Planetary Sphere Shading (Terminator Line & Shadow) */}
                  <div 
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{
                      background: 'radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.08) 0%, transparent 45%, rgba(3, 7, 18, 0.65) 75%, rgba(3, 7, 18, 0.96) 98%)'
                    }}
                  />

                  {/* True Rayleigh Atmospheric Scattering Rim Glow */}
                  <div 
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{
                      boxShadow: `inset -20px -20px 48px rgba(3,7,18,0.92), 0 0 55px ${dest.atmosphereColor}`,
                      border: '1px solid rgba(255, 255, 255, 0.08)'
                    }}
                  />
                </div>
              )}

              {/* SATURN WITH REAL RINGS (NASA Cassini) */}
              {dest.type === "saturn" && (
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="relative w-[118%] h-[118%] flex items-center justify-center overflow-hidden rounded-3xl">
                    <img 
                      src={dest.image} 
                      alt="Saturn with Rings"
                      className="w-full h-full object-contain filter drop-shadow-[0_0_50px_rgba(251,191,36,0.35)] select-none"
                      style={{
                        maskImage: 'radial-gradient(ellipse at center, black 62%, transparent 96%)',
                        WebkitMaskImage: 'radial-gradient(ellipse at center, black 62%, transparent 96%)'
                      }}
                      loading="eager"
                    />
                  </div>
                </div>
              )}

              {/* DEEP SPACE NEBULA (JWST Cosmic Cliffs) */}
              {dest.type === "nebula" && (
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="relative w-[118%] h-[118%] rounded-3xl overflow-hidden shadow-2xl">
                    <img 
                      src={dest.image} 
                      alt="Carina Nebula Cosmic Cliffs"
                      className="w-full h-full object-cover filter drop-shadow-[0_0_60px_rgba(147,51,234,0.4)] select-none"
                      style={{
                        maskImage: 'radial-gradient(ellipse at center, black 55%, transparent 95%)',
                        WebkitMaskImage: 'radial-gradient(ellipse at center, black 55%, transparent 95%)'
                      }}
                      loading="eager"
                    />
                    <div 
                      className="absolute inset-0 rounded-3xl pointer-events-none"
                      style={{
                        background: 'radial-gradient(circle at center, transparent 35%, rgba(3,7,18,0.65) 85%, rgba(3,7,18,0.98) 100%)'
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Orbiting Spacecraft / Mission Beacon Overlay */}
              <div className="absolute inset-[-18px] rounded-full border border-dashed border-cyan-400/25 pointer-events-none">
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-slate-950/90 border border-cyan-500/50 px-2 py-0.5 rounded-full shadow-[0_0_12px_rgba(0,240,255,0.4)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  <span className="font-mono text-[9px] text-cyan-300 font-bold whitespace-nowrap">
                    {dest.beacon}
                  </span>
                </div>
              </div>

            </div>
          );
        })}

      </div>

      {/* ============================================================== */}
      {/* 5. COSMIC ORBIT TELEMETRY HUD & ORRERY CONTROLLER               */}
      {/* ============================================================== */}
      <div className="absolute bottom-4 right-4 sm:right-8 z-30 pointer-events-auto flex flex-col items-end gap-2">
        
        {/* Expandable Mini Orrery Planet Selector Drawer */}
        {isOrreryExpanded && (
          <div className="galaxy-glass-card rounded-2xl p-3 border border-slate-700/80 shadow-2xl backdrop-blur-2xl mb-1 w-72 sm:w-80 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-700/60">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-white">
                <Orbit className="w-3.5 h-3.5 text-cyan-400" />
                <span>CELESTIAL ORRERY OBSERVER</span>
              </div>
              {manualDestinationKey && (
                <button
                  onClick={() => setManualDestinationKey(null)}
                  className="flex items-center gap-1 text-[10px] font-mono text-cyan-400 hover:text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/40"
                  title="Return to auto tab-tracking mode"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                  <span>Auto Tab</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {Object.entries(CELESTIAL_DESTINATIONS).map(([key, dest]) => {
                const isSelected = activeKey === key;
                return (
                  <button
                    key={dest.id}
                    onClick={() => setManualDestinationKey(key)}
                    className={`p-2 rounded-xl border text-left transition-all flex items-center gap-2 font-mono text-[11px] ${
                      isSelected
                        ? 'bg-cyan-950/90 border-cyan-400 text-white shadow-[0_0_12px_rgba(0,240,255,0.3)] ring-1 ring-cyan-400'
                        : 'bg-slate-900/60 border-slate-700/60 text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <img 
                      src={dest.image} 
                      alt={dest.name} 
                      className="w-6 h-6 rounded-full object-cover shrink-0 border border-slate-600"
                    />
                    <div className="overflow-hidden">
                      <div className="font-bold truncate text-[10px] leading-tight">{dest.id}</div>
                      <div className="text-[9px] text-slate-400 truncate">{dest.altitude}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Main Floating Celestial Telemetry HUD Pill */}
        <div className="bg-slate-900/85 border border-slate-700/60 backdrop-blur-2xl rounded-2xl p-2.5 sm:px-4 sm:py-2.5 shadow-2xl flex items-center gap-3 font-mono text-xs">
          <div 
            className="w-2.5 h-2.5 rounded-full animate-ping shrink-0" 
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
              {manualDestinationKey && (
                <span className="text-[8px] px-1 rounded bg-amber-950/80 text-amber-300 border border-amber-500/40 font-bold">
                  MANUAL LOCK
                </span>
              )}
            </div>
            <div className="text-white font-extrabold text-xs sm:text-sm">
              {activeDestination.name}
            </div>
            <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
              <span>Alt: <strong className="text-slate-200">{activeDestination.altitude}</strong></span>
              <span>•</span>
              <span>Vel: <strong className="text-slate-200">{activeDestination.velocity}</strong></span>
            </div>
            <div className="text-[9px] text-slate-400 flex items-center gap-1 mt-1 border-t border-slate-800 pt-0.5">
              <Camera className="w-2.5 h-2.5 text-cyan-400" />
              <span className="truncate max-w-[210px] sm:max-w-[280px]">{activeDestination.citation}</span>
            </div>
          </div>

          {/* Orrery Drawer Toggle Button */}
          <button
            onClick={() => setIsOrreryExpanded(prev => !prev)}
            className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 border border-slate-700 transition-all shrink-0 ml-1"
            title="Toggle Celestial Orrery Selector"
          >
            {isOrreryExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>

      </div>

    </div>
  );
}
