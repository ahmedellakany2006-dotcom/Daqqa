import React from 'react';
import { useMission } from '../../context/MissionContext';
import { ChevronLeft, Activity, Heart, Wind, Shield } from 'lucide-react';

export default function WatchSensorGraph({ onBack }) {
  const { telemetryLogs, activeAstronautId, activeAstronaut } = useMission();
  const logs = telemetryLogs[activeAstronautId] || [];
  const recentLogs = logs.slice(-25);

  const hrVals = recentLogs.map(l => l.hr);
  const minHR = hrVals.length ? Math.min(...hrVals) : 60;
  const maxHR = hrVals.length ? Math.max(...hrVals) : 100;
  const currentTick = recentLogs[recentLogs.length - 1] || activeAstronaut.current;

  // Build SVG path for Heart Rate curve
  const svgWidth = 240;
  const svgHeight = 85;
  const range = Math.max(15, maxHR - minHR);

  const points = recentLogs.map((l, index) => {
    const x = (index / Math.max(1, recentLogs.length - 1)) * svgWidth;
    const normalizedY = (l.hr - minHR) / range;
    const y = svgHeight - normalizedY * (svgHeight - 14) - 7;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-6 sm:p-7 text-slate-100 font-mono select-none relative">
      
      {/* Header */}
      <div className="w-full flex items-center justify-between border-b border-slate-700/80 pb-2 z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-xs text-cyan-400 font-bold hover:text-cyan-300 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-700/60"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>HUD</span>
        </button>
        <div className="flex items-center gap-1.5 text-xs font-black text-red-400">
          <Heart className="w-4 h-4 fill-red-500 animate-pulse" />
          <span className="tracking-wider">PPG WAVE OSCILLOSCOPE</span>
        </div>
      </div>

      {/* Main Graph Area */}
      <div className="w-full flex flex-col items-center my-auto z-10 space-y-2">
        <div className="w-full flex justify-between items-baseline px-2">
          <div className="text-3xl font-black text-white flex items-baseline gap-1">
            <span>{currentTick.hr}</span>
            <span className="text-xs text-slate-400 font-normal">BPM</span>
          </div>
          <div className="text-[11px] text-slate-400 font-medium">
            Min: <span className="text-cyan-400 font-bold">{minHR}</span> | Max: <span className="text-red-400 font-bold">{maxHR}</span>
          </div>
        </div>

        {/* SVG Sparkline Oscilloscope */}
        <div className="w-full h-[95px] bg-[#030712] rounded-2xl border border-cyan-900/60 p-1.5 relative overflow-hidden flex items-center justify-center shadow-inner">
          
          {/* Subtle radar scanline */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent w-full h-8 animate-scanline pointer-events-none" />

          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full overflow-visible">
            {/* Grid lines */}
            <line x1="0" y1="20" x2={svgWidth} y2="20" stroke="rgba(0,240,255,0.08)" strokeDasharray="3 3" />
            <line x1="0" y1="45" x2={svgWidth} y2="45" stroke="rgba(0,240,255,0.08)" strokeDasharray="3 3" />
            <line x1="0" y1="70" x2={svgWidth} y2="70" stroke="rgba(0,240,255,0.08)" strokeDasharray="3 3" />
            
            {points && (
              <>
                <polyline
                  fill="none"
                  stroke="#00F0FF"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={points}
                  className="drop-shadow-[0_0_8px_#00F0FF]"
                />
                {/* Glowing area under curve */}
                <polygon
                  fill="url(#watchGrad)"
                  opacity="0.3"
                  points={`0,${svgHeight} ${points} ${svgWidth},${svgHeight}`}
                />
              </>
            )}
            
            <defs>
              <linearGradient id="watchGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#00F0FF" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Secondary metrics below graph */}
        <div className="w-full grid grid-cols-2 gap-2 mt-1 text-center text-xs">
          <div className="bg-slate-900/90 rounded-xl p-2 border border-slate-800 shadow-xs">
            <span className="text-[10px] text-slate-400 font-semibold block">HRV RMSSD</span>
            <span className="text-amber-300 font-black text-sm">{currentTick.hrv} ms</span>
          </div>
          <div className="bg-slate-900/90 rounded-xl p-2 border border-slate-800 shadow-xs">
            <span className="text-[10px] text-slate-400 font-semibold block">Pulse Ox SpO2</span>
            <span className={`font-black text-sm ${currentTick.spo2 < 90 ? 'text-red-400 animate-pulse' : 'text-cyan-300'}`}>
              {currentTick.spo2}%
            </span>
          </div>
        </div>
      </div>

      <div className="text-[10px] text-slate-400 text-center z-10 font-mono">
        Garmin Elevate 5 Optical Sensor • 1 Hz Polling
      </div>
    </div>
  );
}
