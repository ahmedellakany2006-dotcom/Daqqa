import React, { useState, useEffect } from 'react';
import { useMission } from '../../context/MissionContext';
import { Heart, Activity, Wind, Battery, Radio, Shield, Zap } from 'lucide-react';

export default function WatchFaceHUD({ onOpenSurveys, onOpenGraph, onOpenStorage }) {
  const { activeAstronaut, isCommBlackout, storageBuffers, activeAstronautId } = useMission();
  const [timeStr, setTimeStr] = useState('14:28');
  const [secStr, setSecStr] = useState('32');

  useEffect(() => {
    const timer = setInterval(() => {
      const d = new Date();
      setTimeStr(d.toTimeString().slice(0, 5));
      setSecStr(d.toTimeString().slice(6, 8));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const metrics = activeAstronaut.current;
  const bufferCount = storageBuffers[activeAstronautId] || 0;

  // Pulse animation rate based on heart rate
  const pulseDuration = Math.max(0.35, (60 / (metrics.hr || 70))).toFixed(2);

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-6 sm:p-8 select-none relative text-slate-100 font-mono">
      
      {/* Top Status Arc: Comm status & Battery */}
      <div className="w-full flex items-center justify-between text-xs sm:text-sm px-6 pt-2 z-10">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${isCommBlackout ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
          <span className={`font-bold ${isCommBlackout ? 'text-amber-400' : 'text-emerald-400'}`}>
            {isCommBlackout ? 'LOS' : 'AOS'}
          </span>
        </div>

        <div className="text-xs text-cyan-400 tracking-wider font-extrabold">
          NASA-CIQ 7
        </div>

        <div className="flex items-center gap-1.5 text-slate-300">
          <Battery className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold">84%</span>
        </div>
      </div>

      {/* Main Digital Clock - SCALED UP */}
      <div className="flex flex-col items-center justify-center my-auto z-10">
        <div className="text-[11px] sm:text-xs uppercase tracking-widest text-slate-400 font-sans font-bold">
          MISSION ELAPSED DAY {activeAstronaut.flightDay}
        </div>
        
        <div className="flex items-baseline gap-1.5 mt-1">
          <span className="text-5xl sm:text-6xl font-extrabold tracking-tight text-white font-mono drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
            {timeStr}
          </span>
          <span className="text-base sm:text-lg font-bold text-cyan-400">
            {secStr}
          </span>
        </div>

        <div className="text-xs px-3 py-0.5 rounded-full mt-2 font-bold uppercase tracking-wider text-center shadow-sm"
          style={{
            backgroundColor: metrics.status.includes('CRITICAL') ? 'rgba(239,68,68,0.25)' : metrics.status.includes('WARN') ? 'rgba(245,158,11,0.25)' : 'rgba(0,240,255,0.15)',
            color: metrics.status.includes('CRITICAL') ? '#FCA5A5' : metrics.status.includes('WARN') ? '#FCD34D' : '#67E8F9',
            border: `1px solid ${metrics.status.includes('CRITICAL') ? '#EF4444' : metrics.status.includes('WARN') ? '#F59E0B' : 'rgba(0,240,255,0.3)'}`
          }}
        >
          {metrics.status}
        </div>
      </div>

      {/* Circular Biometric Gauge Rings & Values - SPACIOUS */}
      <div className="w-full grid grid-cols-3 gap-2.5 sm:gap-3 px-4 z-10 text-center">
        
        {/* Heart Rate */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-2 sm:p-2.5 flex flex-col items-center shadow-inner">
          <div className="flex items-center gap-1 text-[11px] text-red-400 font-bold">
            <Heart 
              className="w-4 h-4 text-red-500 fill-red-500" 
              style={{ animation: `pulse ${pulseDuration}s ease-in-out infinite` }} 
            />
            <span>HR</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-white leading-tight mt-0.5">
            {metrics.hr}
          </div>
          <div className="text-[10px] text-slate-400 font-semibold">BPM</div>
        </div>

        {/* SpO2 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-2 sm:p-2.5 flex flex-col items-center shadow-inner">
          <div className="flex items-center gap-1 text-[11px] text-cyan-400 font-bold">
            <Wind className="w-4 h-4 text-cyan-400" />
            <span>SpO2</span>
          </div>
          <div className={`text-xl sm:text-2xl font-black leading-tight mt-0.5 ${metrics.spo2 < 90 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
            {metrics.spo2}%
          </div>
          <div className="text-[10px] text-slate-400 font-semibold">PULSE OX</div>
        </div>

        {/* HRV / Stress */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-2 sm:p-2.5 flex flex-col items-center shadow-inner">
          <div className="flex items-center gap-1 text-[11px] text-amber-400 font-bold">
            <Activity className="w-4 h-4 text-amber-400" />
            <span>HRV</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-white leading-tight mt-0.5">
            {metrics.hrv}
          </div>
          <div className="text-[10px] text-slate-400 font-semibold">RMSSD ms</div>
        </div>

      </div>

      {/* Bottom Quick-Action Buttons */}
      <div className="w-full flex items-center justify-between px-6 pb-2 z-10 text-xs">
        <button
          onClick={onOpenGraph}
          className="px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 font-bold transition-all shadow-sm"
        >
          📈 Waveform
        </button>

        <button
          onClick={onOpenSurveys}
          className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/30 to-blue-500/30 hover:from-cyan-500/40 hover:to-blue-500/40 text-cyan-200 border border-cyan-400/60 font-extrabold tracking-wide transition-all shadow-[0_0_15px_rgba(0,240,255,0.25)]"
        >
          📋 Task UI
        </button>

        <button
          onClick={onOpenStorage}
          className="px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold transition-all flex items-center gap-1.5 shadow-sm"
        >
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>{bufferCount}</span>
        </button>
      </div>

      {/* Circular Ambient Accent Grid */}
      <div className="absolute inset-0 rounded-full border border-cyan-500/20 pointer-events-none" />
      <div className="absolute inset-2.5 rounded-full border border-dashed border-cyan-500/10 pointer-events-none" />
    </div>
  );
}
