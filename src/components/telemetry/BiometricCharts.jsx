import React, { useState } from 'react';
import { useMission } from '../../context/MissionContext';
import { LineChart, Heart, Wind, Activity, Zap } from 'lucide-react';

export default function BiometricCharts() {
  const { telemetryLogs, activeAstronautId, activeAstronaut } = useMission();
  const logs = telemetryLogs[activeAstronautId] || [];
  const recentLogs = logs.slice(-30);

  // SVG Chart Helper
  const renderSparkline = (dataKey, strokeColor, label, unit, minVal, maxVal, thresholdLine) => {
    const values = recentLogs.map(l => l[dataKey]);
    if (!values.length) return null;

    const currentVal = values[values.length - 1];
    const dataMin = Math.min(...values);
    const dataMax = Math.max(...values);
    const computedMin = minVal !== undefined ? minVal : Math.floor(dataMin * 0.95);
    const computedMax = maxVal !== undefined ? maxVal : Math.ceil(dataMax * 1.05);
    const range = Math.max(1, computedMax - computedMin);

    const width = 360;
    const height = 90;

    const points = values.map((val, idx) => {
      const x = (idx / Math.max(1, values.length - 1)) * width;
      const normalizedY = (val - computedMin) / range;
      const y = height - normalizedY * (height - 14) - 7;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');

    let thresholdY = null;
    if (thresholdLine !== undefined) {
      const normThresh = (thresholdLine - computedMin) / range;
      thresholdY = height - normThresh * (height - 14) - 7;
    }

    return (
      <div className="bg-slate-50/90 border border-slate-200 rounded-xl p-3 flex flex-col justify-between shadow-xs">
        <div className="flex items-center justify-between mb-1">
          <div>
            <span className="text-xs font-mono font-bold text-slate-800">{label}</span>
            <span className="text-[10px] text-slate-500 font-mono ml-1">({unit})</span>
          </div>
          <div className="text-sm font-mono font-extrabold" style={{ color: strokeColor }}>
            {currentVal} {unit}
          </div>
        </div>

        <div className="w-full h-[90px] relative overflow-hidden flex items-center justify-center bg-white rounded-lg p-1 border border-slate-200 shadow-inner">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
            {/* Grid horizontal markers */}
            <line x1="0" y1="20" x2={width} y2="20" stroke="rgba(0,0,0,0.06)" strokeDasharray="2 2" />
            <line x1="0" y1="65" x2={width} y2="65" stroke="rgba(0,0,0,0.06)" strokeDasharray="2 2" />

            {/* Threshold limit line if applicable */}
            {thresholdY !== null && thresholdY >= 0 && thresholdY <= height && (
              <line
                x1="0"
                y1={thresholdY}
                x2={width}
                y2={thresholdY}
                stroke="#DC2626"
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
              points={points}
            />

            {/* Current point circle */}
            {values.length > 0 && (
              <circle
                cx={width}
                cy={height - ((currentVal - computedMin) / range) * (height - 14) - 7}
                r="4"
                fill={strokeColor}
              />
            )}
          </svg>
        </div>

        <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono mt-1.5 font-medium">
          <span>Min: <strong className="text-slate-800">{dataMin}</strong></span>
          {thresholdLine !== undefined && (
            <span className="text-red-600 font-bold">Limit: {thresholdLine} {unit}</span>
          )}
          <span>Max: <strong className="text-slate-800">{dataMax}</strong></span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white/95 border border-slate-200/90 rounded-2xl p-4 lg:p-5 shadow-sm backdrop-blur-sm relative z-20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-sky-100 text-sky-700">
            <LineChart className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold tracking-wide text-slate-800 uppercase font-mono">
            Continuous Physiological Telemetry Channels
          </h2>
        </div>
        <div className="text-xs text-slate-500 font-mono">
          Sampling Rate: <span className="text-sky-700 font-bold">1 Hz</span> (Garmin Elevate SDK)
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {renderSparkline('hr', '#0284C7', 'Heart Rate (PPG)', 'BPM', 40, 180, 150)}
        {renderSparkline('spo2', '#059669', 'Pulse Oximetry (SpO2)', '%', 80, 100, 90)}
        {renderSparkline('hrv', '#D97706', 'Heart Rate Variability', 'ms', 10, 100, 20)}
        {renderSparkline('stress', '#7C3AED', 'Autonomic Stress Index', 'pts', 0, 100, 75)}
      </div>
    </div>
  );
}
