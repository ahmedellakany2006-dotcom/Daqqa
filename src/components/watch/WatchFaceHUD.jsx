import React, { useState, useEffect } from 'react';
import { useMission } from '../../context/MissionContext';
import { Heart, Activity, Wind, Battery, Radio, Shield, Zap, Sparkles } from 'lucide-react';

export default function WatchFaceHUD({ onOpenSurveys, onOpenGraph, onOpenStorage }) {
  const { activeAstronaut, isCommBlackout, storageBuffers, activeAstronautId } = useMission();
  const [timeStr, setTimeStr] = useState('14:28');
  const [secStr, setSecStr] = useState('32');
  const [secondNumber, setSecondNumber] = useState(32);

  useEffect(() => {
    const timer = setInterval(() => {
      const d = new Date();
      setTimeStr(d.toTimeString().slice(0, 5));
      setSecStr(d.toTimeString().slice(6, 8));
      setSecondNumber(d.getSeconds());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const metrics = activeAstronaut.current;
  const bufferCount = storageBuffers[activeAstronautId] || 0;

  // Pulse animation rate based on heart rate
  const pulseDuration = Math.max(0.35, (60 / (metrics.hr || 70))).toFixed(2);

  // Seconds arc calculation (0 - 60 sec -> 0 - 360 deg)
  const secAngle = (secondNumber / 60) * 360;
  const secStrokeDash = ((secondNumber / 60) * 880).toFixed(1);

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-5 sm:p-7 select-none relative text-slate-100 font-mono overflow-hidden">
      
      {/* Sweeping Seconds Radial Perimeter Arc (Garmin Signature Aviation Bezel) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 -rotate-90">
        <circle
          cx="50%"
          cy="50%"
          r="47%"
          fill="none"
          stroke="rgba(0, 240, 255, 0.08)"
          strokeWidth="3"
        />
        <circle
          cx="50%"
          cy="50%"
          r="47%"
          fill="none"
          stroke="#00F0FF"
          strokeWidth="3.5"
          strokeDasharray={`${secStrokeDash} 999`}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-linear shadow-[0_0_10px_#00F0FF]"
        />
      </svg>

      {/* TOP COMPLICATION: Comm Status, Mission Flight Day, Battery */}
      <div className="w-full flex items-center justify-between text-xs px-6 pt-3 z-20">
        
        {/* Comm Indicator */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 px-2.5 py-1 rounded-full border border-slate-700/80 shadow-xs">
          <div className={`w-2 h-2 rounded-full ${isCommBlackout ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
          <span className={`text-[10px] font-extrabold ${isCommBlackout ? 'text-amber-400' : 'text-emerald-400'}`}>
            {isCommBlackout ? 'LOS (OFFLINE)' : 'AOS (ONLINE)'}
          </span>
        </div>

        {/* NASA Flight Mission Tag */}
        <div className="text-[10px] text-cyan-300 font-bold tracking-widest bg-cyan-950/80 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
          FD-{activeAstronaut.flightDay}
        </div>

        {/* Battery with Micro-Gauge */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 px-2.5 py-1 rounded-full border border-slate-700/80 text-slate-300 text-[10px] font-bold shadow-xs">
          <Battery className="w-3.5 h-3.5 text-emerald-400" />
          <span>84%</span>
        </div>

      </div>

      {/* CENTER DIGITAL CLOCK & VITAL STATUS CAPSULE */}
      <div className="flex flex-col items-center justify-center my-auto z-20 pt-1">
        
        <div className="text-[10px] uppercase tracking-widest text-slate-400 font-sans font-bold flex items-center gap-1">
          <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
          <span>LUNAR TRANSIT • UTC</span>
        </div>
        
        {/* Giant Time Display with Neon Depth */}
        <div className="flex items-baseline gap-2 mt-0.5">
          <span className="text-5xl sm:text-6xl font-black tracking-tight text-white font-mono drop-shadow-[0_0_20px_rgba(255,255,255,0.45)]">
            {timeStr}
          </span>
          <span className="text-xl font-extrabold text-cyan-400 font-mono drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]">
            {secStr}
          </span>
        </div>

        {/* Status Pill */}
        <div 
          className="text-xs px-3.5 py-1 rounded-full mt-2 font-bold uppercase tracking-wider text-center shadow-md flex items-center gap-1.5"
          style={{
            backgroundColor: metrics.status.includes('CRITICAL') ? 'rgba(239,68,68,0.3)' : metrics.status.includes('WARN') ? 'rgba(245,158,11,0.3)' : 'rgba(0,240,255,0.18)',
            color: metrics.status.includes('CRITICAL') ? '#FCA5A5' : metrics.status.includes('WARN') ? '#FCD34D' : '#67E8F9',
            border: `1.5px solid ${metrics.status.includes('CRITICAL') ? '#EF4444' : metrics.status.includes('WARN') ? '#F59E0B' : 'rgba(0,240,255,0.45)'}`
          }}
        >
          <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: metrics.status.includes('CRITICAL') ? '#EF4444' : metrics.status.includes('WARN') ? '#F59E0B' : '#00F0FF' }} />
          <span>{metrics.status}</span>
        </div>

      </div>

      {/* 3 CIRCULAR AEROSPACE SUBDIALS (HR, SpO2, HRV) */}
      <div className="w-full grid grid-cols-3 gap-2.5 px-4 z-20 text-center">
        
        {/* 1. HEART RATE SUBDIAL */}
        <div className="bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-700/80 rounded-2xl p-2.5 flex flex-col items-center justify-between shadow-lg relative overflow-hidden group">
          <div className="flex items-center gap-1 text-[11px] text-red-400 font-bold">
            <Heart 
              className="w-3.5 h-3.5 text-red-500 fill-red-500" 
              style={{ animation: `pulse ${pulseDuration}s ease-in-out infinite` }} 
            />
            <span>HR</span>
          </div>
          
          <div className="text-2xl font-black text-white leading-tight my-0.5">
            {metrics.hr}
          </div>

          <div className="text-[10px] text-slate-400 font-semibold uppercase">
            BPM
          </div>

          {/* Glowing bottom progress indicator */}
          <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden mt-1">
            <div 
              className="h-full bg-gradient-to-r from-red-500 to-rose-400" 
              style={{ width: `${Math.min(100, (metrics.hr / 180) * 100)}%` }} 
            />
          </div>
        </div>

        {/* 2. SpO2 PULSE OX SUBDIAL */}
        <div className="bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-700/80 rounded-2xl p-2.5 flex flex-col items-center justify-between shadow-lg relative overflow-hidden group">
          <div className="flex items-center gap-1 text-[11px] text-cyan-400 font-bold">
            <Wind className="w-3.5 h-3.5 text-cyan-400" />
            <span>SpO2</span>
          </div>
          
          <div className={`text-2xl font-black leading-tight my-0.5 ${metrics.spo2 < 90 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
            {metrics.spo2}%
          </div>

          <div className="text-[10px] text-slate-400 font-semibold uppercase">
            O2 SAT
          </div>

          {/* Glowing bottom progress indicator */}
          <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden mt-1">
            <div 
              className={`h-full ${metrics.spo2 < 90 ? 'bg-red-500 animate-pulse' : 'bg-gradient-to-r from-cyan-500 to-sky-400'}`} 
              style={{ width: `${Math.min(100, metrics.spo2)}%` }} 
            />
          </div>
        </div>

        {/* 3. HRV RMSSD SUBDIAL */}
        <div className="bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-700/80 rounded-2xl p-2.5 flex flex-col items-center justify-between shadow-lg relative overflow-hidden group">
          <div className="flex items-center gap-1 text-[11px] text-amber-400 font-bold">
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            <span>HRV</span>
          </div>
          
          <div className="text-2xl font-black text-white leading-tight my-0.5">
            {metrics.hrv}
          </div>

          <div className="text-[10px] text-slate-400 font-semibold uppercase">
            RMSSD
          </div>

          {/* Glowing bottom progress indicator */}
          <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden mt-1">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-400" 
              style={{ width: `${Math.min(100, (metrics.hrv / 100) * 100)}%` }} 
            />
          </div>
        </div>

      </div>

      {/* BOTTOM GLASSMORPHIC QUICK ACTION TOUCH BUTTONS */}
      <div className="w-full flex items-center justify-between px-6 pb-2 z-20 text-xs">
        
        <button
          onClick={onOpenGraph}
          className="px-3.5 py-1.5 rounded-xl bg-slate-800/90 hover:bg-cyan-950/90 hover:border-cyan-400 text-cyan-300 border border-slate-700 font-bold transition-all shadow-sm flex items-center gap-1 active:scale-95"
        >
          <span>📈 Wave</span>
        </button>

        <button
          onClick={onOpenSurveys}
          className="px-5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold tracking-wider transition-all shadow-[0_0_15px_rgba(0,240,255,0.4)] active:scale-95 flex items-center gap-1.5"
        >
          <span>📋 TASK UI</span>
        </button>

        <button
          onClick={onOpenStorage}
          className="px-3.5 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
        >
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>{bufferCount}</span>
        </button>

      </div>

    </div>
  );
}
