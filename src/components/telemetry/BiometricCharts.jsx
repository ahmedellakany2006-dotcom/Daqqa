import React, { useState } from 'react';
import { useMission } from '../../context/MissionContext';
import { LineChart, Heart, Wind, Activity, Zap, Compass } from 'lucide-react';

export default function BiometricCharts() {
  const { telemetryLogs, activeAstronautId, activeAstronaut } = useMission();
  const logs = telemetryLogs[activeAstronautId] || [];
  const recentLogs = logs.slice(-30);

  // SVG Chart Helper
  const renderSparkline = (dataKey, strokeColor, label, unit, minVal, maxVal, thresholdLine) => {
    const values = recentLogs
      .map(l => l[dataKey])
      .filter(v => typeof v === 'number' && Number.isFinite(v));
    if (!values.length) return null;

    const currentVal = values[values.length - 1];
    const dataMin = Math.min(...values);
    const dataMax = Math.max(...values);
    const computedMin = minVal !== undefined ? minVal : Math.floor(dataMin * 0.95);
    const computedMax = maxVal !== undefined ? maxVal : Math.ceil(dataMax * 1.05);
    const range = Math.max(0.1, (Number.isFinite(computedMax) && Number.isFinite(computedMin)) ? computedMax - computedMin : 0.1);

    const width = 360;
    const height = 90;

    const denominator = Math.max(1, values.length - 1);
    const points = values.map((val, idx) => {
      const x = (idx / denominator) * width;
      const normalizedY = (val - computedMin) / range;
      const safeNormY = Number.isFinite(normalizedY) ? normalizedY : 0.5;
      const y = height - safeNormY * (height - 14) - 7;
      return `${(Number.isFinite(x) ? x : 0).toFixed(1)},${(Number.isFinite(y) ? y : 0).toFixed(1)}`;
    }).join(' ');

    let thresholdY = null;
    if (thresholdLine !== undefined && Number.isFinite(thresholdLine)) {
      const normThresh = (thresholdLine - computedMin) / range;
      if (Number.isFinite(normThresh)) {
        thresholdY = height - normThresh * (height - 14) - 7;
      }
    }

    return (
      <div className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-3 flex flex-col justify-between shadow-lg">
        <div className="flex items-center justify-between mb-1">
          <div>
            <span className="text-xs font-mono font-bold text-slate-200">{label}</span>
            <span className="text-[10px] text-slate-400 font-mono ml-1">({unit})</span>
          </div>
          <div className="text-sm font-mono font-black" style={{ color: strokeColor }}>
            {currentVal} {unit}
          </div>
        </div>

        <div className="w-full h-[90px] relative overflow-hidden flex items-center justify-center bg-slate-950/80 rounded-lg p-1 border border-slate-800 shadow-inner">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
            {/* Grid horizontal markers */}
            <line x1="0" y1="20" x2={width} y2="20" stroke="rgba(255,255,255,0.06)" strokeDasharray="2 2" />
            <line x1="0" y1="65" x2={width} y2="65" stroke="rgba(255,255,255,0.06)" strokeDasharray="2 2" />

            {/* Threshold limit line if applicable */}
            {thresholdY !== null && thresholdY >= 0 && thresholdY <= height && (
              <line
                x1="0"
                y1={thresholdY}
                x2={width}
                y2={thresholdY}
                stroke="#F43F5E"
                strokeWidth="1.5"
                strokeDasharray="4 2"
                opacity="0.8"
              />
            )}

            {/* Data line */}
            <polyline
              fill="none"
              stroke={strokeColor}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="filter drop-shadow-[0_0_4px_currentColor]"
              points={points}
            />

            {/* Current point circle */}
            {values.length > 0 && (
              <circle
                cx={width}
                cy={height - ((currentVal - computedMin) / range) * (height - 14) - 7}
                r="4"
                fill={strokeColor}
                stroke="#030712"
                strokeWidth="1.5"
              />
            )}
          </svg>
        </div>

        <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono mt-1.5 font-medium">
          <span>Min: <strong className="text-slate-200">{dataMin}</strong></span>
          {thresholdLine !== undefined && (
            <span className="text-rose-400 font-bold">Limit: {thresholdLine} {unit}</span>
          )}
          <span>Max: <strong className="text-slate-200">{dataMax}</strong></span>
        </div>
      </div>
    );
  };

  return (
    <div className="galaxy-glass-card rounded-2xl p-4 lg:p-5 shadow-2xl relative z-20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.2)]">
            <LineChart className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-extrabold tracking-wide text-white uppercase font-mono">
            Synchronous Multi-Channel Physiological Telemetry
          </h2>
        </div>
        <div className="text-xs text-slate-400 font-mono flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 font-bold border border-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.2)]">
            1 Hz Co-Registered Dual Stream
          </span>
          <span className="text-slate-400">(Garmin Elevate Gen 5 SDK)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {renderSparkline('hr', '#00F0FF', 'Heart Rate (PPG)', 'BPM', 40, 180, 150)}
        {renderSparkline('spo2', '#10B981', 'Pulse Oximetry (SpO2)', '%', 80, 100, 90)}
        {renderSparkline('activityMets', '#818CF8', 'Activity Workload', 'METs', 1.0, 9.0, 7.5)}
        {renderSparkline('cosi', '#38BDF8', 'Cardio-Oxygen Ratio (COSI)', 'ratio', 0.5, 2.5, 1.0)}
        {renderSparkline('hrv', '#F59E0B', 'Heart Rate Variability', 'ms', 10, 100, 20)}
        {renderSparkline('stress', '#C084FC', 'Autonomic Stress Index', 'pts', 0, 100, 75)}
      </div>
    </div>
  );
}
