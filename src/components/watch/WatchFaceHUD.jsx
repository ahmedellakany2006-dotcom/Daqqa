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
    <div className="w-full h-full flex flex-col items-center justify-between p-6 select-none relative text-slate-100 font-mono">
      
      {/* Top Status Arc: Comm status & Battery */}
      <div className="w-full flex items-center justify-between text-[11px] px-4 pt-1 z-10">
        <div className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${isCommBlackout ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
          <span className={`font-semibold ${isCommBlackout ? 'text-amber-400' : 'text-emerald-400'}`}>
            {isCommBlackout ? 'LOS' : 'AOS'}
          </span>
        </div>

        <div className="text-[10px] text-cyan-400 tracking-wider font-bold">
          NASA-CIQ 7
        </div>

        <div className="flex items-center gap-1 text-slate-300">
          <Battery className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[10px]">84%</span>
        </div>
      </div>

      {/* Main Digital Clock */}
      <div className="flex flex-col items-center justify-center my-auto z-10">
        <div className="text-[10px] uppercase tracking-widest text-slate-400 font-sans">
          MISSION ELAPSED DAY {activeAstronaut.flightDay}
        </div>
        
        <div className="flex items-baseline gap-1 mt-0.5">
          <span className="text-4xl sm:text-5xl font-bold tracking-tight text-white font-mono drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">
            {timeStr}
          </span>
          <span className="text-sm font-semibold text-cyan-400">
            {secStr}
          </span>
        </div>

        <div className="text-[11px] px-2.5 py-0.5 rounded-full mt-1 font-semibold uppercase tracking-wider text-center"
          style={{
            backgroundColor: metrics.status.includes('CRITICAL') ? 'rgba(239,68,68,0.25)' : metrics.status.includes('WARN') ? 'rgba(245,158,11,0.25)' : 'rgba(0,240,255,0.15)',
            color: metrics.status.includes('CRITICAL') ? '#FCA5A5' : metrics.status.includes('WARN') ? '#FCD34D' : '#67E8F9',
            border: `1px solid ${metrics.status.includes('CRITICAL') ? '#EF4444' : metrics.status.includes('WARN') ? '#F59E0B' : 'rgba(0,240,255,0.3)'}`
          }}
        >
          {metrics.status}
        </div>
      </div>

      {/* Circular Biometric Gauge Rings & Values */}
      <div className="w-full grid grid-cols-3 gap-2 px-3 z-10 text-center">
        
        {/* Heart Rate */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-1.5 flex flex-col items-center">
          <div className="flex items-center gap-1 text-[10px] text-red-400">
            <Heart 
              className="w-3.5 h-3.5 text-red-500 fill-red-500" 
              style={{ animation: `pulse ${pulseDuration}s ease-in-out infinite` }} 
            />
            <span>HR</span>
          </div>
          <div className="text-lg font-bold text-white leading-tight">
            {metrics.hr}
          </div>
          <div className="text-[9px] text-slate-400">BPM</div>
        </div>

        {/* SpO2 */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-1.5 flex flex-col items-center">
          <div className="flex items-center gap-1 text-[10px] text-cyan-400">
            <Wind className="w-3.5 h-3.5 text-cyan-400" />
            <span>SpO2</span>
          </div>
          <div className={`text-lg font-bold leading-tight ${metrics.spo2 < 90 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
            {metrics.spo2}%
          </div>
          <div className="text-[9px] text-slate-400">PULSE OX</div>
        </div>

        {/* HRV / Stress */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-1.5 flex flex-col items-center">
          <div className="flex items-center gap-1 text-[10px] text-amber-400">
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            <span>HRV</span>
          </div>
          <div className="text-lg font-bold text-white leading-tight">
            {metrics.hrv}
          </div>
          <div className="text-[9px] text-slate-400">RMSSD ms</div>
        </div>

      </div>

      {/* Bottom Quick-Action Buttons */}
      <div className="w-full flex items-center justify-between px-4 pb-2 z-10 text-[10px]">
        <button
          onClick={onOpenGraph}
          className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 font-semibold transition-colors"
        >
          📈 Waveform
        </button>

        <button
          onClick={onOpenSurveys}
          className="px-3 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 border border-cyan-400/50 font-bold tracking-wide transition-all shadow-[0_0_10px_rgba(0,240,255,0.2)]"
        >
          📋 Task UI
        </button>

        <button
          onClick={onOpenStorage}
          className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 font-semibold transition-colors flex items-center gap-1"
        >
          <Zap className="w-3 h-3 text-amber-400" />
          <span>{bufferCount}</span>
        </button>
      </div>

      {/* Circular Ambient Accent Grid */}
      <div className="absolute inset-0 rounded-full border border-cyan-500/20 pointer-events-none" />
      <div className="absolute inset-2 rounded-full border border-dashed border-cyan-500/10 pointer-events-none" />
    </div>
  );
}
