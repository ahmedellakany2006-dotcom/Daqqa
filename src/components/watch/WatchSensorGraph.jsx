import React from 'react';
import { useMission } from '../../context/MissionContext';
import { ChevronLeft, Activity, Heart } from 'lucide-react';

export default function WatchSensorGraph({ onBack }) {
  const { telemetryLogs, activeAstronautId, activeAstronaut } = useMission();
  const logs = telemetryLogs[activeAstronautId] || [];
  const recentLogs = logs.slice(-25);

  const hrVals = recentLogs.map(l => l.hr);
  const minHR = hrVals.length ? Math.min(...hrVals) : 60;
  const maxHR = hrVals.length ? Math.max(...hrVals) : 100;
  const currentTick = recentLogs[recentLogs.length - 1] || activeAstronaut.current;

  // Build SVG path for Heart Rate curve
  const svgWidth = 200;
  const svgHeight = 65;
  const range = Math.max(15, maxHR - minHR);

  const points = recentLogs.map((l, index) => {
    const x = (index / Math.max(1, recentLogs.length - 1)) * svgWidth;
    const normalizedY = (l.hr - minHR) / range;
    const y = svgHeight - normalizedY * (svgHeight - 10) - 5;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-5 text-slate-100 font-mono select-none relative">
      
      {/* Header */}
      <div className="w-full flex items-center justify-between border-b border-slate-800 pb-2 z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>HUD</span>
        </button>
        <div className="flex items-center gap-1.5 text-xs font-bold text-red-400">
          <Heart className="w-3.5 h-3.5 fill-red-500 animate-pulse" />
          <span>HR LIVE WAVEFORM</span>
        </div>
      </div>

      {/* Main Graph Area */}
      <div className="w-full flex flex-col items-center my-auto z-10">
        <div className="w-full flex justify-between items-baseline px-2 mb-1">
          <div className="text-2xl font-bold text-white">
            {currentTick.hr} <span className="text-xs text-slate-400 font-normal">BPM</span>
          </div>
          <div className="text-[10px] text-slate-400">
            Min: <span className="text-cyan-400">{minHR}</span> | Max: <span className="text-red-400">{maxHR}</span>
          </div>
        </div>

        {/* SVG Sparkline */}
        <div className="w-full h-[70px] bg-slate-900/90 rounded-xl border border-slate-800/80 p-1 relative overflow-hidden flex items-center justify-center">
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full overflow-visible">
            {/* Grid lines */}
            <line x1="0" y1="15" x2={svgWidth} y2="15" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
            <line x1="0" y1="45" x2={svgWidth} y2="45" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
            
            {points && (
              <>
                <polyline
                  fill="none"
                  stroke="#00F0FF"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={points}
                />
                {/* Glowing area under curve */}
                <polygon
                  fill="url(#grad)"
                  opacity="0.25"
                  points={`0,${svgHeight} ${points} ${svgWidth},${svgHeight}`}
                />
              </>
            )}
            
            <defs>
              <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#00F0FF" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Secondary metrics below graph */}
        <div className="w-full grid grid-cols-2 gap-2 mt-2 text-center text-[10px]">
          <div className="bg-slate-900/60 rounded-lg p-1.5 border border-slate-800">
            <span className="text-slate-400 block">HRV RMSSD</span>
            <span className="text-amber-300 font-bold text-xs">{currentTick.hrv} ms</span>
          </div>
          <div className="bg-slate-900/60 rounded-lg p-1.5 border border-slate-800">
            <span className="text-slate-400 block">Pulse Ox SpO2</span>
            <span className={`font-bold text-xs ${currentTick.spo2 < 90 ? 'text-red-400' : 'text-cyan-300'}`}>
              {currentTick.spo2}%
            </span>
          </div>
        </div>
      </div>

      <div className="text-[9px] text-slate-400 text-center z-10">
        Sensor: Garmin Elevate 5 Optical PPG (Continuous)
      </div>
    </div>
  );
}
