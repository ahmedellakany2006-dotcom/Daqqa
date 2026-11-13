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
    <div className="flex flex-col items-center justify-center p-2 sm:p-4 select-none w-full max-w-3xl mx-auto">
      
      {/* Astronaut Wrist Selector */}
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
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25 ring-2 ring-sky-300'
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

      {/* Physical Smartwatch Assembly - BIGGER SIZE */}
      <div className="relative flex items-center justify-center my-6">
        
        {/* Watch Straps (Silicone Spaceflight Ribbed Band) - Scaled Up */}
        <div className="absolute -top-16 w-44 h-24 bg-gradient-to-b from-slate-800 via-slate-700 to-slate-900 rounded-t-3xl border-t border-x border-slate-600/60 shadow-xl flex flex-col items-center justify-around py-2">
          <div className="w-28 h-1.5 bg-slate-950/70 rounded-full" />
          <div className="w-28 h-1.5 bg-slate-950/70 rounded-full" />
          <div className="w-28 h-1.5 bg-slate-950/70 rounded-full" />
        </div>
        <div className="absolute -bottom-16 w-44 h-24 bg-gradient-to-t from-slate-800 via-slate-700 to-slate-900 rounded-b-3xl border-b border-x border-slate-600/60 shadow-xl flex flex-col items-center justify-around py-2">
          <div className="w-28 h-1.5 bg-slate-950/70 rounded-full" />
          <div className="w-28 h-1.5 bg-slate-950/70 rounded-full" />
          <div className="w-28 h-1.5 bg-slate-950/70 rounded-full" />
        </div>

        {/* Physical Buttons (Left Side: LIGHT, UP, DOWN) - Scaled Up */}
        <div className="absolute -left-5 top-20 flex flex-col gap-10 z-20">
          {/* LIGHT */}
          <button
            onClick={handleLight}
            className="w-5 h-12 rounded-l-lg bg-gradient-to-r from-slate-500 to-slate-700 border-l border-y border-slate-400 hover:brightness-125 active:scale-95 transition-transform flex items-center justify-center group shadow-md"
            title="LIGHT: Toggle Backlight / Glow"
          >
            <span className="sr-only">LIGHT</span>
            <div className="w-1.5 h-6 bg-slate-300/60 rounded-full group-hover:bg-cyan-300" />
          </button>
          {/* UP */}
          <button
            onClick={handleUp}
            className="w-5 h-12 rounded-l-lg bg-gradient-to-r from-slate-500 to-slate-700 border-l border-y border-slate-400 hover:brightness-125 active:scale-95 transition-transform flex items-center justify-center group shadow-md"
            title="UP: Cycle Previous Screen"
          >
            <span className="sr-only">UP</span>
            <div className="w-1.5 h-6 bg-slate-300/60 rounded-full group-hover:bg-cyan-300" />
          </button>
          {/* DOWN */}
          <button
            onClick={handleDown}
            className="w-5 h-12 rounded-l-lg bg-gradient-to-r from-slate-500 to-slate-700 border-l border-y border-slate-400 hover:brightness-125 active:scale-95 transition-transform flex items-center justify-center group shadow-md"
            title="DOWN: Cycle Next Screen"
          >
            <span className="sr-only">DOWN</span>
            <div className="w-1.5 h-6 bg-slate-300/60 rounded-full group-hover:bg-cyan-300" />
          </button>
        </div>

        {/* Physical Buttons (Right Side: START/STOP, BACK) - Scaled Up */}
        <div className="absolute -right-5 top-24 flex flex-col gap-16 z-20">
          {/* START/STOP (Red Accent) */}
          <button
            onClick={handleStartStop}
            className="w-5 h-14 rounded-r-lg bg-gradient-to-l from-red-600 to-red-800 border-r border-y border-red-400 hover:brightness-125 active:scale-95 transition-transform flex items-center justify-center group shadow-lg shadow-red-500/30"
            title="START/STOP: Open Task Survey / Select"
          >
            <span className="sr-only">START/STOP</span>
            <div className="w-1.5 h-8 bg-red-200 rounded-full" />
          </button>
          {/* BACK */}
          <button
            onClick={handleBack}
            className="w-5 h-12 rounded-r-lg bg-gradient-to-l from-slate-500 to-slate-700 border-r border-y border-slate-400 hover:brightness-125 active:scale-95 transition-transform flex items-center justify-center group shadow-md"
            title="BACK: Return to Watchface HUD"
          >
            <span className="sr-only">BACK</span>
            <div className="w-1.5 h-6 bg-slate-300/60 rounded-full group-hover:bg-cyan-300" />
          </button>
        </div>

        {/* Bezel Ring (Titanium with Torx Screws & Engravings) - PROMINENT & BIGGER */}
        <div className="relative w-[340px] h-[340px] sm:w-[460px] sm:h-[460px] md:w-[520px] md:h-[520px] rounded-full bg-gradient-to-br from-slate-700 via-slate-800 to-slate-950 p-4 sm:p-5 shadow-[0_25px_60px_rgba(15,23,42,0.4),0_0_30px_rgba(2,132,199,0.2)] border-4 border-slate-600/90">
          
          {/* Bezel Inner Ring with Minute Indices */}
          <div className="relative w-full h-full rounded-full bg-slate-900 border-4 sm:border-[6px] border-slate-800 p-3 sm:p-4 flex items-center justify-center shadow-inner">
            
            {/* Screws and Engravings */}
            <div className="absolute top-3 w-2.5 h-2.5 rounded-full bg-slate-500 border border-slate-300 shadow" />
            <div className="absolute bottom-3 w-2.5 h-2.5 rounded-full bg-slate-500 border border-slate-300 shadow" />
            <div className="absolute left-3 w-2.5 h-2.5 rounded-full bg-slate-500 border border-slate-300 shadow" />
            <div className="absolute right-3 w-2.5 h-2.5 rounded-full bg-slate-500 border border-slate-300 shadow" />

            {/* Tactical Engravings */}
            <div className="absolute top-5 font-mono text-[10px] sm:text-xs text-slate-300 font-extrabold tracking-widest uppercase">
              GARMIN TACTIX 7
            </div>
            <div className="absolute bottom-5 font-mono text-[9px] sm:text-[11px] text-cyan-400 font-extrabold tracking-widest uppercase">
              CONNECT IQ • MONKEY C
            </div>

            {/* Circular AMOLED Display Screen */}
            <div className={`relative w-full h-full rounded-full bg-[#050811] overflow-hidden flex items-center justify-center transition-all ${
              backlightOn ? 'watch-screen-glow brightness-125' : 'watch-screen-glow'
            }`}>
              
              {/* Glass Glare Highlight */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-cyan-400/5 to-white/10 rounded-full pointer-events-none z-20" />
              
              {/* Autonomous Wrist Alert Overlay */}
              <WatchAlertModal />

              {/* Screen Content Switcher */}
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

      {/* Button Guide Labels */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-xs font-mono text-slate-600 bg-white/95 px-5 py-2.5 rounded-2xl border border-slate-200 shadow-sm">
        <span className="flex items-center gap-1.5">
          <kbd className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-300 font-bold">LIGHT</kbd>
          Glow
        </span>
        <span className="flex items-center gap-1.5">
          <kbd className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-300 font-bold">UP / DOWN</kbd>
          Cycle Screens
        </span>
        <span className="flex items-center gap-1.5">
          <kbd className="px-2 py-0.5 rounded bg-red-100 text-red-700 border border-red-300 font-bold">START</kbd>
          Task UI
        </span>
        <span className="flex items-center gap-1.5">
          <kbd className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-300 font-bold">BACK</kbd>
          Home HUD
        </span>
      </div>

    </div>
  );
}
