import React, { useState, useEffect } from 'react';
import { useMission } from '../../context/MissionContext';
import { Heart, Activity, Wind, Battery, Radio, Shield, Zap, Sparkles, CheckCircle2 } from 'lucide-react';

export default function WatchFaceHUD({ onOpenSurveys, onOpenGraph, onOpenStorage }) {
  const { activeAstronaut, isCommBlackout, storageBuffers, activeAstronautId, personalizedAnomaly, sensorReliability } = useMission();
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

  // Seconds arc calculation
  const secStrokeDash = ((secondNumber / 60) * 880).toFixed(1);

  const hrZ = personalizedAnomaly?.zScores?.hr ?? 0;
  const sqiVal = sensorReliability?.sqi ?? 96;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-3 select-none relative text-slate-100 font-mono overflow-hidden">
      
      {/* Sweeping Seconds Radial Perimeter Arc */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 -rotate-90">
        <circle
          cx="50%"
          cy="50%"
          r="47.5%"
          fill="none"
          stroke="rgba(0, 240, 255, 0.08)"
          strokeWidth="3"
        />
        <circle
          cx="50%"
          cy="50%"
          r="47.5%"
          fill="none"
          stroke="#00F0FF"
          strokeWidth="3.5"
          strokeDasharray={`${secStrokeDash} 999`}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-linear shadow-[0_0_10px_#00F0FF]"
        />
      </svg>

      {/* ============================================================== */}
      {/* CIRCULAR SAFE INSET CONTAINER (Fits perfectly inside horizon)  */}
      {/* ============================================================== */}
      <div className="w-[84%] h-[86%] flex flex-col items-center justify-between z-20 py-1">
        
        {/* 1. TOP ROW: Comm, Synchronous Sync / SQI, Activity METs */}
        <div className="w-[86%] flex items-center justify-between text-xs pt-0.5">
          {/* Comm Status Pill */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 px-2 py-0.5 rounded-full border border-slate-700/80 shadow-xs">
            <div className={`w-1.5 h-1.5 rounded-full ${isCommBlackout ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
            <span className={`text-[9px] font-extrabold ${isCommBlackout ? 'text-amber-400' : 'text-emerald-400'}`}>
              {isCommBlackout ? 'LOS' : 'AOS'}
            </span>
          </div>

          {/* Synchronous HR+SpO2 & SQI Badge */}
          <div className="text-[9px] text-cyan-300 font-bold tracking-wider bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-500/40 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>SYNC {sqiVal}%</span>
          </div>

          {/* Feature 3: Activity Level (METs) on Watch Face */}
          <div className="flex items-center gap-1 bg-slate-900/90 px-2 py-0.5 rounded-full border border-slate-700/80 text-amber-300 text-[9px] font-bold shadow-xs">
            <Activity className="w-3 h-3 text-amber-400" />
            <span>{metrics.activityMets ?? 1.8}M</span>
          </div>
        </div>

        {/* 2. CENTER DIGITAL CLOCK & STATUS */}
        <div className="flex flex-col items-center justify-center my-0.5">
          <div className="text-[9px] uppercase tracking-widest text-slate-400 font-sans font-bold flex items-center gap-1 mb-0.5">
            <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
            <span>FD-{activeAstronaut.flightDay} • UTC</span>
          </div>
          
          {/* Giant Time Display */}
          <div className="flex items-baseline gap-1.5">
            <span className="text-4xl sm:text-5xl font-black tracking-tight text-white font-mono drop-shadow-[0_0_18px_rgba(255,255,255,0.45)]">
              {timeStr}
            </span>
            <span className="text-lg font-extrabold text-cyan-400 font-mono drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]">
              {secStr}
            </span>
          </div>

          {/* Status Badge */}
          <div 
            className="text-[11px] px-3.5 py-0.5 rounded-full mt-1 font-bold uppercase tracking-wider text-center shadow-md flex items-center gap-1.5"
            style={{
              backgroundColor: metrics.status.includes('CRITICAL') ? 'rgba(239,68,68,0.3)' : metrics.status.includes('WARN') ? 'rgba(245,158,11,0.3)' : 'rgba(0,240,255,0.18)',
              color: metrics.status.includes('CRITICAL') ? '#FCA5A5' : metrics.status.includes('WARN') ? '#FCD34D' : '#67E8F9',
              border: `1.5px solid ${metrics.status.includes('CRITICAL') ? '#EF4444' : metrics.status.includes('WARN') ? '#F59E0B' : 'rgba(0,240,255,0.45)'}`
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: metrics.status.includes('CRITICAL') ? '#EF4444' : metrics.status.includes('WARN') ? '#F59E0B' : '#00F0FF' }} />
            <span>{metrics.status}</span>
          </div>
        </div>

        {/* 3. SUB-DIALS (With Personalized Baseline Tagging) */}
        <div className="w-[96%] grid grid-cols-3 gap-2.5 my-1 text-center">
          
          {/* Heart Rate Sub-dial with Feature 1: Personalized z-Score */}
          <div className="bg-gradient-to-b from-slate-900/95 to-slate-950/95 border border-slate-700/80 rounded-2xl p-2 flex flex-col items-center justify-between shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between w-full px-1">
              <div className="flex items-center gap-0.5 text-[10px] text-red-400 font-bold">
                <Heart 
                  className="w-3 h-3 text-red-500 fill-red-500" 
                  style={{ animation: `pulse ${pulseDuration}s ease-in-out infinite` }} 
                />
                <span>HR</span>
              </div>
              <span className={`text-[8px] font-mono font-bold ${Math.abs(hrZ) >= 2.0 ? 'text-rose-400 font-extrabold' : 'text-slate-400'}`}>
                {hrZ >= 0 ? `+${hrZ}σ` : `${hrZ}σ`}
              </span>
            </div>
            
            <div className="text-xl font-black text-white leading-tight my-0.5">
              {metrics.hr}
            </div>

            <div className="text-[8px] text-slate-400 font-semibold uppercase">
              BASE {Math.round(personalizedAnomaly?.baseline?.restingHR?.mean || 62)}
            </div>

            <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden mt-1">
              <div 
                className="h-full bg-gradient-to-r from-red-500 to-rose-400" 
                style={{ width: `${Math.min(100, (metrics.hr / 180) * 100)}%` }} 
              />
            </div>
          </div>

          {/* SpO2 Sub-dial */}
          <div className="bg-gradient-to-b from-slate-900/95 to-slate-950/95 border border-slate-700/80 rounded-2xl p-2 flex flex-col items-center justify-between shadow-lg relative overflow-hidden">
            <div className="flex items-center gap-1 text-[10px] text-cyan-400 font-bold">
              <Wind className="w-3 h-3 text-cyan-400" />
              <span>SpO2</span>
            </div>
            
            <div className={`text-xl font-black leading-tight my-0.5 ${metrics.spo2 < 90 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
              {metrics.spo2}%
            </div>

            <div className="text-[9px] text-slate-400 font-semibold uppercase">
              PULSE OX
            </div>

            <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden mt-1">
              <div 
                className={`h-full ${metrics.spo2 < 90 ? 'bg-red-500 animate-pulse' : 'bg-gradient-to-r from-cyan-500 to-sky-400'}`} 
                style={{ width: `${Math.min(100, metrics.spo2)}%` }} 
              />
            </div>
          </div>

          {/* HRV Sub-dial */}
          <div className="bg-gradient-to-b from-slate-900/95 to-slate-950/95 border border-slate-700/80 rounded-2xl p-2 flex flex-col items-center justify-between shadow-lg relative overflow-hidden">
            <div className="flex items-center gap-1 text-[10px] text-amber-400 font-bold">
              <Activity className="w-3 h-3 text-amber-400" />
              <span>HRV</span>
            </div>
            
            <div className="text-xl font-black text-white leading-tight my-0.5">
              {metrics.hrv}
            </div>

            <div className="text-[9px] text-slate-400 font-semibold uppercase">
              RMSSD ms
            </div>

            <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden mt-1">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-yellow-400" 
                style={{ width: `${Math.min(100, (metrics.hrv / 100) * 100)}%` }} 
              />
            </div>
          </div>

        </div>

        {/* 4. BOTTOM ACTION BUTTONS */}
        <div className="w-[82%] flex items-center justify-between gap-2 pb-1 text-xs">
          
          <button
            onClick={onOpenGraph}
            className="flex-1 py-1.5 rounded-xl bg-slate-800/90 hover:bg-cyan-950/90 hover:border-cyan-400 text-cyan-300 border border-slate-700 font-bold transition-all shadow-sm flex items-center justify-center gap-1 active:scale-95 text-[11px]"
          >
            <span>📈 Wave</span>
          </button>

          <button
            onClick={onOpenSurveys}
            className="flex-[1.3] py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-black tracking-wider transition-all shadow-[0_0_15px_rgba(0,240,255,0.4)] active:scale-95 flex items-center justify-center gap-1 text-[11px]"
          >
            <span>📋 TASK UI</span>
          </button>

          <button
            onClick={onOpenStorage}
            className="flex-1 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold transition-all flex items-center justify-center gap-1 shadow-sm active:scale-95 text-[11px]"
          >
            <Zap className="w-3 h-3 text-amber-400" />
            <span>{bufferCount}</span>
          </button>

        </div>

      </div>

    </div>
  );
}
