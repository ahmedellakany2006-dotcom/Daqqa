import React, { useState } from 'react';
import { useMission } from '../../context/MissionContext';
import WatchFaceHUD from './WatchFaceHUD';
import WatchSurveyUI from './WatchSurveyUI';
import WatchSensorGraph from './WatchSensorGraph';
import WatchStorageBuffer from './WatchStorageBuffer';
import WatchAlertModal from './WatchAlertModal';

export default function GarminWatchFrame() {
  const { crew, activeAstronautId, setActiveAstronautId, activeAstronaut } = useMission();
  const [currentScreen, setCurrentScreen] = useState('hud'); // 'hud' | 'survey' | 'graph' | 'storage'
  const [backlightOn, setBacklightOn] = useState(false);

  // Button handlers emulating Garmin 5-button interface
  const handleLight = () => setBacklightOn(prev => !prev);
  
  const handleUp = () => {
    if (currentScreen === 'hud') setCurrentScreen('storage');
    else if (currentScreen === 'storage') setCurrentScreen('graph');
    else if (currentScreen === 'graph') setCurrentScreen('survey');
    else setCurrentScreen('hud');
  };

  const handleDown = () => {
    if (currentScreen === 'hud') setCurrentScreen('survey');
    else if (currentScreen === 'survey') setCurrentScreen('graph');
    else if (currentScreen === 'graph') setCurrentScreen('storage');
    else setCurrentScreen('hud');
  };

  const handleStartStop = () => {
    if (currentScreen === 'hud') setCurrentScreen('survey');
    else setCurrentScreen('hud');
  };

  const handleBack = () => setCurrentScreen('hud');

  return (
    <div className="flex flex-col items-center justify-center p-2 select-none w-full max-w-4xl mx-auto">
      
      {/* Astronaut Selector Bar */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-6 bg-white/95 p-2 rounded-2xl border border-slate-200/90 shadow-sm backdrop-blur-sm">
        <span className="text-xs font-mono text-slate-500 px-2 font-bold uppercase tracking-wider">
          ASTRONAUT WRIST:
        </span>
        {crew.map((astro) => (
          <button
            key={astro.id}
            onClick={() => setActiveAstronautId(astro.id)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
              activeAstronautId === astro.id
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25 ring-2 ring-sky-300 scale-105'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span className="text-base">{astro.avatar}</span>
            <span>{astro.name.split(' ')[1]}</span>
            <span className={`text-[10px] ${activeAstronautId === astro.id ? 'text-sky-100' : 'text-slate-400'}`}>
              ({astro.id})
            </span>
          </button>
        ))}
      </div>

      {/* Luxury Garmin Physical Smartwatch Housing */}
      <div className="relative flex items-center justify-center my-4">
        
        {/* Top Spaceflight Silicone Strap with Carbon Lugs */}
        <div className="absolute -top-16 w-52 h-28 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 rounded-t-3xl border-t-2 border-x-2 border-slate-700/80 shadow-2xl flex flex-col items-center justify-around py-2.5 z-0">
          <div className="w-36 h-2 bg-slate-950/90 rounded-full border-b border-slate-700/50" />
          <div className="w-36 h-2 bg-slate-950/90 rounded-full border-b border-slate-700/50" />
          <div className="w-36 h-2 bg-slate-950/90 rounded-full border-b border-slate-700/50" />
          <div className="w-16 h-1 bg-cyan-500/40 rounded-full shadow-[0_0_8px_rgba(0,240,255,0.4)]" />
        </div>

        {/* Bottom Spaceflight Silicone Strap */}
        <div className="absolute -bottom-16 w-52 h-28 bg-gradient-to-t from-slate-900 via-slate-800 to-slate-900 rounded-b-3xl border-b-2 border-x-2 border-slate-700/80 shadow-2xl flex flex-col items-center justify-around py-2.5 z-0">
          <div className="w-16 h-1 bg-cyan-500/40 rounded-full shadow-[0_0_8px_rgba(0,240,255,0.4)]" />
          <div className="w-36 h-2 bg-slate-950/90 rounded-full border-t border-slate-700/50" />
          <div className="w-36 h-2 bg-slate-950/90 rounded-full border-t border-slate-700/50" />
          <div className="w-36 h-2 bg-slate-950/90 rounded-full border-t border-slate-700/50" />
        </div>

        {/* ============================================================== */}
        {/* LEFT PHYSICAL BUTTONS (Integrated with Titanium Crown Guards) */}
        {/* ============================================================== */}
        <div className="absolute -left-6 sm:-left-7 top-24 flex flex-col gap-12 z-20">
          
          {/* 1. LIGHT BUTTON */}
          <div className="flex items-center group">
            <button
              onClick={handleLight}
              className="relative w-6 sm:w-7 h-14 rounded-l-xl bg-gradient-to-r from-slate-400 via-slate-200 to-slate-500 border-l-2 border-y-2 border-slate-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),-3px_4px_10px_rgba(0,0,0,0.6)] active:translate-x-1.5 transition-all flex items-center justify-start pl-1 cursor-pointer overflow-hidden"
              title="LIGHT: Toggle AMOLED Backlight Glow"
            >
              {/* Knurled Metal Grips */}
              <div className="w-3 h-10 knurled-btn rounded-xs border-r border-slate-400/60" />
              {/* Mini Glow Accent */}
              <div className={`absolute top-1 left-1.5 w-1.5 h-1.5 rounded-full ${backlightOn ? 'bg-cyan-400 shadow-[0_0_6px_#00F0FF]' : 'bg-slate-400'}`} />
            </button>
            <span className="hidden sm:inline-block font-mono text-[9px] font-extrabold text-slate-400 ml-1.5 uppercase tracking-tighter opacity-70 group-hover:opacity-100 group-hover:text-cyan-500 transition-opacity">
              LIGHT
            </span>
          </div>

          {/* 2. UP BUTTON */}
          <div className="flex items-center group">
            <button
              onClick={handleUp}
              className="relative w-6 sm:w-7 h-14 rounded-l-xl bg-gradient-to-r from-slate-400 via-slate-200 to-slate-500 border-l-2 border-y-2 border-slate-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),-3px_4px_10px_rgba(0,0,0,0.6)] active:translate-x-1.5 transition-all flex items-center justify-start pl-1 cursor-pointer overflow-hidden"
              title="UP: Cycle Previous Screen (Storage -> Graph -> Survey -> HUD)"
            >
              <div className="w-3 h-10 knurled-btn rounded-xs border-r border-slate-400/60" />
            </button>
            <span className="hidden sm:inline-block font-mono text-[9px] font-extrabold text-slate-400 ml-1.5 uppercase tracking-tighter opacity-70 group-hover:opacity-100 group-hover:text-cyan-500 transition-opacity">
              UP
            </span>
          </div>

          {/* 3. DOWN BUTTON */}
          <div className="flex items-center group">
            <button
              onClick={handleDown}
              className="relative w-6 sm:w-7 h-14 rounded-l-xl bg-gradient-to-r from-slate-400 via-slate-200 to-slate-500 border-l-2 border-y-2 border-slate-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),-3px_4px_10px_rgba(0,0,0,0.6)] active:translate-x-1.5 transition-all flex items-center justify-start pl-1 cursor-pointer overflow-hidden"
              title="DOWN: Cycle Next Screen (HUD -> Survey -> Graph -> Storage)"
            >
              <div className="w-3 h-10 knurled-btn rounded-xs border-r border-slate-400/60" />
            </button>
            <span className="hidden sm:inline-block font-mono text-[9px] font-extrabold text-slate-400 ml-1.5 uppercase tracking-tighter opacity-70 group-hover:opacity-100 group-hover:text-cyan-500 transition-opacity">
              DOWN
            </span>
          </div>

        </div>

        {/* ============================================================== */}
        {/* RIGHT PHYSICAL BUTTONS (START/STOP & BACK) */}
        {/* ============================================================== */}
        <div className="absolute -right-6 sm:-right-7 top-28 flex flex-col gap-20 z-20">
          
          {/* 1. START / STOP BUTTON (SIGNATURE GARMIN RED ANODIZED PUSHER) */}
          <div className="flex items-center justify-end group">
            <span className="hidden sm:inline-block font-mono text-[9px] font-extrabold text-red-500 mr-1.5 uppercase tracking-tighter opacity-90 group-hover:opacity-100 transition-opacity">
              START
            </span>
            <button
              onClick={handleStartStop}
              className="relative w-6 sm:w-7 h-16 rounded-r-xl bg-gradient-to-l from-red-600 via-red-500 to-rose-700 border-r-2 border-y-2 border-red-400 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),3px_4px_14px_rgba(225,29,72,0.6)] active:-translate-x-1.5 transition-all flex items-center justify-end pr-1 cursor-pointer overflow-hidden ring-1 ring-red-400/50"
              title="START / STOP: Launch Behavioral Task Survey UI"
            >
              {/* Knurled Red Grip */}
              <div className="w-3.5 h-11 knurled-red-btn rounded-xs border-l border-red-300/60" />
              {/* Glowing Crimson Center Line */}
              <div className="absolute top-1/2 right-1.5 -translate-y-1/2 w-1 h-8 bg-red-200 rounded-full shadow-[0_0_8px_#FF4D4D]" />
            </button>
          </div>

          {/* 2. BACK / LAP BUTTON */}
          <div className="flex items-center justify-end group">
            <span className="hidden sm:inline-block font-mono text-[9px] font-extrabold text-slate-400 mr-1.5 uppercase tracking-tighter opacity-70 group-hover:opacity-100 group-hover:text-cyan-500 transition-opacity">
              BACK
            </span>
            <button
              onClick={handleBack}
              className="relative w-6 sm:w-7 h-14 rounded-r-xl bg-gradient-to-l from-slate-400 via-slate-200 to-slate-500 border-r-2 border-y-2 border-slate-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),3px_4px_10px_rgba(0,0,0,0.6)] active:-translate-x-1.5 transition-all flex items-center justify-end pr-1 cursor-pointer overflow-hidden"
              title="BACK: Return to Main Watch Face HUD"
            >
              <div className="w-3 h-10 knurled-btn rounded-xs border-l border-slate-400/60" />
            </button>
          </div>

        </div>

        {/* ============================================================== */}
        {/* TITANIUM WATCH CHASSIS & CNC ROTATING-STYLE BEZEL */}
        {/* ============================================================== */}
        <div className="relative w-[340px] h-[340px] sm:w-[470px] sm:h-[470px] md:w-[530px] md:h-[530px] rounded-full titanium-case p-4 sm:p-5 border-[3px] border-slate-500/70 z-10 flex items-center justify-center">
          
          {/* Outer Bezel with CNC Minute Chapter Ring */}
          <div className="relative w-full h-full rounded-full bezel-ring p-3 sm:p-4 border-[3px] border-slate-700/80 flex items-center justify-center">
            
            {/* CNC Chapter Engravings: 24-Hour UTC Indicators */}
            <div className="absolute top-1 font-mono text-[9px] sm:text-[10px] text-cyan-400 font-extrabold tracking-widest">▲ 24</div>
            <div className="absolute right-2 font-mono text-[9px] sm:text-[10px] text-slate-400 font-bold">06</div>
            <div className="absolute bottom-1 font-mono text-[9px] sm:text-[10px] text-slate-400 font-bold">12</div>
            <div className="absolute left-2 font-mono text-[9px] sm:text-[10px] text-slate-400 font-bold">18</div>

            {/* 5 Authentic Garmin Torx Screws */}
            <div className="absolute top-6 left-12 w-2.5 h-2.5 rounded-full bg-slate-500 border border-slate-300 shadow flex items-center justify-center">
              <div className="w-1.5 h-0.5 bg-slate-800 rotate-45" />
            </div>
            <div className="absolute top-6 right-12 w-2.5 h-2.5 rounded-full bg-slate-500 border border-slate-300 shadow flex items-center justify-center">
              <div className="w-1.5 h-0.5 bg-slate-800 -rotate-12" />
            </div>
            <div className="absolute bottom-7 left-14 w-2.5 h-2.5 rounded-full bg-slate-500 border border-slate-300 shadow flex items-center justify-center">
              <div className="w-1.5 h-0.5 bg-slate-800 rotate-90" />
            </div>
            <div className="absolute bottom-7 right-14 w-2.5 h-2.5 rounded-full bg-slate-500 border border-slate-300 shadow flex items-center justify-center">
              <div className="w-1.5 h-0.5 bg-slate-800 rotate-30" />
            </div>
            <div className="absolute top-2 w-2.5 h-2.5 rounded-full bg-slate-500 border border-slate-300 shadow flex items-center justify-center">
              <div className="w-1.5 h-0.5 bg-slate-800 rotate-60" />
            </div>

            {/* Aerospace Markings */}
            <div className="absolute top-9 font-mono text-[8px] sm:text-[9px] text-slate-400 font-black tracking-widest uppercase">
              GARMIN • TACTIX 7
            </div>
            <div className="absolute bottom-9 font-mono text-[8px] sm:text-[9px] text-sky-400 font-black tracking-widest uppercase">
              CONNECT IQ • MONKEY C
            </div>

            {/* ============================================================== */}
            {/* SAPPHIRE CRYSTAL LENS & AMOLED DISPLAY */}
            {/* ============================================================== */}
            <div className={`relative w-full h-full rounded-full sapphire-lens overflow-hidden flex items-center justify-center transition-all ${
              backlightOn ? 'brightness-125' : ''
            }`}>
              
              {/* Curved Sapphire Crystal Lens Reflection */}
              <div className="absolute inset-0 rounded-full sapphire-glare pointer-events-none z-30" />
              
              {/* Outer Minute Track Ring */}
              <div className="absolute inset-3 rounded-full border border-slate-800/80 pointer-events-none z-10" />
              <div className="absolute inset-5 rounded-full border border-dashed border-cyan-500/15 pointer-events-none z-10" />

              {/* Autonomous Wrist Alert Modal */}
              <WatchAlertModal />

              {/* Interactive Screen Switcher */}
              <div className="relative z-20 w-full h-full">
                {currentScreen === 'hud' && (
                  <WatchFaceHUD
                    onOpenSurveys={() => setCurrentScreen('survey')}
                    onOpenGraph={() => setCurrentScreen('graph')}
                    onOpenStorage={() => setCurrentScreen('storage')}
                  />
                )}
                {currentScreen === 'survey' && (
                  <WatchSurveyUI onBack={() => setCurrentScreen('hud')} />
                )}
                {currentScreen === 'graph' && (
                  <WatchSensorGraph onBack={() => setCurrentScreen('hud')} />
                )}
                {currentScreen === 'storage' && (
                  <WatchStorageBuffer onBack={() => setCurrentScreen('hud')} />
                )}
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Button Operation Guide Footer */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 mt-4 text-xs font-mono text-slate-600 bg-white/95 px-6 py-2.5 rounded-2xl border border-slate-200 shadow-sm">
        <span className="flex items-center gap-1.5">
          <kbd className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-300 font-bold shadow-xs">LIGHT</kbd>
          <span>Glow Screen</span>
        </span>
        <span className="flex items-center gap-1.5">
          <kbd className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-300 font-bold shadow-xs">UP / DOWN</kbd>
          <span>Switch Mode</span>
        </span>
        <span className="flex items-center gap-1.5">
          <kbd className="px-2.5 py-0.5 rounded bg-rose-600 text-white border border-rose-500 font-extrabold shadow-xs">START</kbd>
          <span>Behavioral Task UI</span>
        </span>
        <span className="flex items-center gap-1.5">
          <kbd className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-300 font-bold shadow-xs">BACK</kbd>
          <span>Main HUD</span>
        </span>
      </div>

    </div>
  );
}
