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
    <div className="flex flex-col items-center justify-center p-2 lg:p-6 select-none">
      
      {/* Astronaut Wrist Selector */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-4 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
        <span className="text-xs font-mono text-slate-400 px-2 font-semibold">ASTRONAUT WRIST:</span>
        {crew.map((astro) => (
          <button
            key={astro.id}
            onClick={() => setActiveAstronautId(astro.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all ${
              activeAstronautId === astro.id
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
            }`}
          >
            <span>{astro.avatar}</span>
            <span>{astro.name.split(' ')[1]}</span>
            <span className="text-[10px] text-slate-400 font-normal">({astro.id})</span>
          </button>
        ))}
      </div>

      {/* Physical Smartwatch Assembly */}
      <div className="relative flex items-center justify-center">
        
        {/* Watch Straps (Silicone Spaceflight Ribbed Band) */}
        <div className="absolute -top-12 w-32 h-16 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 rounded-t-2xl border-t border-x border-slate-700/60 shadow-lg flex flex-col items-center justify-around py-1">
          <div className="w-20 h-1 bg-slate-950/60 rounded" />
          <div className="w-20 h-1 bg-slate-950/60 rounded" />
          <div className="w-20 h-1 bg-slate-950/60 rounded" />
        </div>
        <div className="absolute -bottom-12 w-32 h-16 bg-gradient-to-t from-slate-900 via-slate-800 to-slate-900 rounded-b-2xl border-b border-x border-slate-700/60 shadow-lg flex flex-col items-center justify-around py-1">
          <div className="w-20 h-1 bg-slate-950/60 rounded" />
          <div className="w-20 h-1 bg-slate-950/60 rounded" />
          <div className="w-20 h-1 bg-slate-950/60 rounded" />
        </div>

        {/* Physical Buttons (Left Side: LIGHT, UP, DOWN) */}
        <div className="absolute -left-3.5 top-14 flex flex-col gap-7 z-20">
          {/* LIGHT */}
          <button
            onClick={handleLight}
            className="w-4 h-9 rounded-l-md bg-gradient-to-r from-slate-600 to-slate-800 border-l border-y border-slate-500 hover:brightness-125 active:scale-95 transition-transform flex items-center justify-center group"
            title="LIGHT: Toggle Backlight / Glow"
          >
            <span className="sr-only">LIGHT</span>
            <div className="w-1 h-5 bg-slate-400/50 rounded-full group-hover:bg-cyan-400" />
          </button>
          {/* UP */}
          <button
            onClick={handleUp}
            className="w-4 h-9 rounded-l-md bg-gradient-to-r from-slate-600 to-slate-800 border-l border-y border-slate-500 hover:brightness-125 active:scale-95 transition-transform flex items-center justify-center group"
            title="UP: Cycle Previous Screen"
          >
            <span className="sr-only">UP</span>
            <div className="w-1 h-5 bg-slate-400/50 rounded-full group-hover:bg-cyan-400" />
          </button>
          {/* DOWN */}
          <button
            onClick={handleDown}
            className="w-4 h-9 rounded-l-md bg-gradient-to-r from-slate-600 to-slate-800 border-l border-y border-slate-500 hover:brightness-125 active:scale-95 transition-transform flex items-center justify-center group"
            title="DOWN: Cycle Next Screen"
          >
            <span className="sr-only">DOWN</span>
            <div className="w-1 h-5 bg-slate-400/50 rounded-full group-hover:bg-cyan-400" />
          </button>
        </div>

        {/* Physical Buttons (Right Side: START/STOP, BACK) */}
        <div className="absolute -right-3.5 top-16 flex flex-col gap-12 z-20">
          {/* START/STOP (Red Accent) */}
          <button
            onClick={handleStartStop}
            className="w-4 h-11 rounded-r-md bg-gradient-to-l from-red-600 to-red-800 border-r border-y border-red-500 hover:brightness-125 active:scale-95 transition-transform flex items-center justify-center group shadow-[0_0_8px_rgba(239,68,68,0.4)]"
            title="START/STOP: Open Task Survey / Select"
          >
            <span className="sr-only">START/STOP</span>
            <div className="w-1 h-6 bg-red-300 rounded-full" />
          </button>
          {/* BACK */}
          <button
            onClick={handleBack}
            className="w-4 h-9 rounded-r-md bg-gradient-to-l from-slate-600 to-slate-800 border-r border-y border-slate-500 hover:brightness-125 active:scale-95 transition-transform flex items-center justify-center group"
            title="BACK: Return to Watchface HUD"
          >
            <span className="sr-only">BACK</span>
            <div className="w-1 h-5 bg-slate-400/50 rounded-full group-hover:bg-cyan-400" />
          </button>
        </div>

        {/* Bezel Ring (Titanium with Torx Screws & Engravings) */}
        <div className="relative w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-gradient-to-br from-slate-700 via-slate-800 to-slate-950 p-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_20px_rgba(0,240,255,0.1)] border-2 border-slate-600/80">
          
          {/* Bezel Inner Ring with Minute Indices */}
          <div className="relative w-full h-full rounded-full bg-slate-900 border-4 border-slate-800 p-2.5 flex items-center justify-center shadow-inner">
            
            {/* Screws and Engravings */}
            <div className="absolute top-2 w-2 h-2 rounded-full bg-slate-600 border border-slate-400 shadow" />
            <div className="absolute bottom-2 w-2 h-2 rounded-full bg-slate-600 border border-slate-400 shadow" />
            <div className="absolute left-2 w-2 h-2 rounded-full bg-slate-600 border border-slate-400 shadow" />
            <div className="absolute right-2 w-2 h-2 rounded-full bg-slate-600 border border-slate-400 shadow" />

            {/* Tactical Engravings */}
            <div className="absolute top-4 font-mono text-[9px] text-slate-400 font-bold tracking-widest uppercase">
              GARMIN TACTIX 7
            </div>
            <div className="absolute bottom-4 font-mono text-[8px] text-cyan-400 font-bold tracking-widest uppercase">
              CONNECT IQ • MONKEY C
            </div>

            {/* Circular AMOLED Display Screen */}
            <div className={`relative w-full h-full rounded-full bg-black overflow-hidden flex items-center justify-center transition-all ${
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
      <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-[11px] font-mono text-slate-400 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800">
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">LIGHT</kbd>
          Glow
        </span>
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">UP/DOWN</kbd>
          Cycle Screens
        </span>
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-red-900/80 text-red-200 border border-red-700 font-bold">START</kbd>
          Task UI
        </span>
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">BACK</kbd>
          Home HUD
        </span>
      </div>

    </div>
  );
}
