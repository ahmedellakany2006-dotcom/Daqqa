import React from 'react';
import { useMission } from '../../context/MissionContext';
import { TrendingUp, AlertCircle, Clock, Sparkles, Shield, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function PredictiveTrendForecast() {
  const { trendForecast } = useMission();
  const { currentRecoveryIndex, deteriorationProb24h, hrSlope, hrvSlope, forecastPoints, preventiveCountermeasures, modelConfidenceScore, algorithm } = trendForecast;

  // Build SVG Points for Forecast Trajectory
  const svgWidth = 520;
  const svgHeight = 110;

  const points = forecastPoints.map((pt, idx) => {
    const x = (idx / (forecastPoints.length - 1)) * (svgWidth - 40) + 20;
    const y = svgHeight - (pt.predictedRecovery / 100) * (svgHeight - 30) - 15;
    return { x, y, pt };
  });

  const polylineStr = points.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

  // Shaded confidence band polygon
  const upperPoints = points.map(p => {
    const y = svgHeight - (p.pt.confidenceUpper / 100) * (svgHeight - 30) - 15;
    return `${p.x.toFixed(1)},${y.toFixed(1)}`;
  });
  const lowerPoints = points.map(p => {
    const y = svgHeight - (p.pt.confidenceLower / 100) * (svgHeight - 30) - 15;
    return `${p.x.toFixed(1)},${y.toFixed(1)}`;
  }).reverse();
  const polygonStr = `${upperPoints.join(' ')} ${lowerPoints.join(' ')}`;

  return (
    <div className="bg-white/95 border border-slate-200/90 rounded-2xl p-5 shadow-sm backdrop-blur-sm relative z-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-100 text-cyan-800">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 font-mono uppercase tracking-wide">
              4. Health Trend Prediction (Time-Series Machine Learning)
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              48-hour forward projection of recovery trajectory and acute deterioration probability
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
          <span>Model Confidence: <strong className="text-sky-700">{modelConfidenceScore}%</strong></span>
        </div>
      </div>

      {/* Main Grid: Forecast Chart & Deterioration Probability */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left: 48-Hour Trajectory Forecast Chart */}
        <div className="lg:col-span-8 bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-xs font-mono font-bold text-slate-800 uppercase">
                48-Hour Physiological Recovery Index Trajectory
              </span>
              <span className="text-[10px] text-slate-500 font-mono block">
                {algorithm}
              </span>
            </div>
            
            <div className="flex items-center gap-3 text-[10px] font-mono font-bold">
              <span className="flex items-center gap-1 text-slate-600">
                <span className="w-2.5 h-1 bg-sky-500 rounded" />
                <span>Forecast</span>
              </span>
              <span className="flex items-center gap-1 text-slate-500">
                <span className="w-2.5 h-2 bg-sky-200 rounded opacity-60" />
                <span>95% CI</span>
              </span>
            </div>
          </div>

          {/* SVG Trajectory Chart */}
          <div className="w-full h-32 relative overflow-hidden bg-white rounded-lg p-1 border border-slate-200 shadow-inner flex items-center justify-center">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full overflow-visible">
              {/* Horizontal scale lines */}
              <line x1="10" y1="20" x2={svgWidth - 10} y2="20" stroke="rgba(0,0,0,0.06)" strokeDasharray="3 3" />
              <line x1="10" y1="55" x2={svgWidth - 10} y2="55" stroke="rgba(0,0,0,0.06)" strokeDasharray="3 3" />
              <line x1="10" y1="90" x2={svgWidth - 10} y2="90" stroke="rgba(0,0,0,0.06)" strokeDasharray="3 3" />

              {/* Shaded Confidence Corridor */}
              <polygon
                points={polygonStr}
                fill="#0284C7"
                opacity="0.12"
              />

              {/* Primary Trajectory Polyline */}
              <polyline
                fill="none"
                stroke="#0284C7"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={polylineStr}
              />

              {/* Points & Labels */}
              {points.map((p, i) => (
                <g key={i}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="4"
                    fill="#0284C7"
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                  />
                  <text
                    x={p.x}
                    y={svgHeight - 2}
                    textAnchor="middle"
                    className="text-[9px] fill-slate-500 font-mono font-bold"
                  >
                    {p.pt.hour}
                  </text>
                  <text
                    x={p.x}
                    y={p.y - 7}
                    textAnchor="middle"
                    className="text-[9px] fill-slate-800 font-mono font-black"
                  >
                    {p.pt.predictedRecovery}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          {/* Micro Slopes */}
          <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 mt-2 pt-2 border-t border-slate-200">
            <span className="flex items-center gap-1">
              <span>HR Drift Velocity:</span>
              <strong className={hrSlope > 0 ? "text-rose-600 flex items-center" : "text-sky-600 flex items-center"}>
                {hrSlope > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {hrSlope > 0 ? `+${hrSlope}` : hrSlope} BPM/epoch
              </strong>
            </span>
            <span className="flex items-center gap-1">
              <span>HRV Slope:</span>
              <strong className={hrvSlope < 0 ? "text-amber-600 flex items-center" : "text-emerald-600 flex items-center"}>
                {hrvSlope < 0 ? <ArrowDownRight className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                {hrvSlope > 0 ? `+${hrvSlope}` : hrvSlope} ms/epoch
              </strong>
            </span>
          </div>
        </div>

        {/* Right: Deterioration Probability & Preventative Protocols */}
        <div className="lg:col-span-4 bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between shadow-xs">
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-slate-500">
              24h-48h Deterioration Probability
            </span>
            
            <div className="flex items-baseline gap-2 my-1.5">
              <span className={`text-4xl font-black font-mono ${
                deteriorationProb24h >= 60 ? 'text-red-600' : deteriorationProb24h >= 30 ? 'text-amber-600' : 'text-emerald-600'
              }`}>
                {deteriorationProb24h}%
              </span>
              <span className="text-xs font-mono text-slate-500 font-bold">Risk Probability</span>
            </div>

            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-3">
              <div 
                className={`h-full ${deteriorationProb24h >= 60 ? 'bg-red-500' : deteriorationProb24h >= 30 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                style={{ width: `${deteriorationProb24h}%` }} 
              />
            </div>

            <div className="pt-2 border-t border-slate-200 text-[11px] font-mono">
              <div className="font-bold text-slate-800 mb-1">Prescriptive Countermeasures:</div>
              <div className="space-y-1.5">
                {preventiveCountermeasures.map((cm, i) => (
                  <div key={i} className="flex items-start gap-1.5 text-[10px] text-slate-600">
                    <span className="text-cyan-600 font-bold">›</span>
                    <span>{cm}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-200 text-[9px] font-mono text-slate-500">
            Forecasting Window: Artemis-V Orbital Horizon
          </div>
        </div>

      </div>

    </div>
  );
}
