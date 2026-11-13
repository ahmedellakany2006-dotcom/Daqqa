import React from 'react';
import { useMission } from '../../context/MissionContext';
import { ACTIVITY_CATEGORIES, getActivityCategory } from '../../utils/hrActivityAnalytics';
import { Heart, Wind, Flame, Activity, Zap, ShieldAlert, CheckCircle2, AlertTriangle, Compass, ArrowUpRight } from 'lucide-react';

export default function HRActivityConcordanceHUD() {
  const { 
    activeAstronaut, 
    personalizedAnomaly, 
    manualMetsOverride, 
    setManualMetsOverride 
  } = useMission();

  const metrics = activeAstronaut.current;
  const baseRHR = personalizedAnomaly?.baseline?.restingHR?.mean ?? activeAstronaut.baseHR ?? 62;
  const currentHR = metrics.hr || baseRHR;
  const currentSpO2 = metrics.spo2 || 98.4;
  const currentMets = metrics.activityMets ?? 1.8;
  const expectedHR = metrics.expectedHR ?? baseRHR;
  const cosi = metrics.cosi ?? ((currentSpO2 / Math.max(40, currentHR)) * 100).toFixed(2);
  const esr = metrics.exertionStrainRatio ?? 1.0;
  const deltaResting = metrics.hrDeltaResting ?? (currentHR - baseRHR);
  const currentCategory = getActivityCategory(currentMets);

  const isUncoupled = metrics.concordanceStatus === "INAPPROPRIATE_TACHYCARDIA_UNCOUPLED";
  const isStrainDrift = metrics.concordanceStatus === "EXERTIONAL_STRAIN_DRIFT";
  const isChronotropic = metrics.concordanceStatus === "CHRONOTROPIC_INCOMPETENCE";

  // Coordinates for 2D Scatter Matrix
  // SVG Canvas: width = 460, height = 220
  // X-axis: METs from 1.0 to 9.0
  // Y-axis: HR from 50 to 180 bpm
  const mapMetsToX = (m) => 40 + ((Math.max(1.0, Math.min(9.0, m)) - 1.0) / 8.0) * 390;
  const mapHRToY = (hr) => 200 - ((Math.max(50, Math.min(180, hr)) - 50) / 130) * 170;

  const currentX = mapMetsToX(currentMets);
  const currentY = mapHRToY(currentHR);
  const expectedY = mapHRToY(expectedHR);

  return (
    <div className="bg-white/95 border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-sm backdrop-blur-sm relative z-20 space-y-6">
      
      {/* 1. Header with Synchronous Badge */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-mono font-bold border border-indigo-300">
              FEATURE 1 & 2 • SYNCHRONOUS PAIRING
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono font-bold border border-emerald-300 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>CO-REGISTERED Δt = 0 ms</span>
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 font-mono">
            Cardiorespiratory Exertion & HR vs. Activity Concordance
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5 font-medium">
            Simultaneous optical Pulse Ox (SpO2) and PPG (HR) synchronization with dynamic METs workload coupling
          </p>
        </div>

        {/* Global Concordance Status Pill */}
        <div className={`px-3.5 py-2 rounded-xl border font-mono text-xs font-bold flex items-center gap-2 shadow-xs ${
          isUncoupled
            ? 'bg-rose-50 border-rose-300 text-rose-800 animate-pulse'
            : isStrainDrift
            ? 'bg-amber-50 border-amber-300 text-amber-800'
            : 'bg-emerald-50 border-emerald-300 text-emerald-800'
        }`}>
          {isUncoupled ? (
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          ) : isStrainDrift ? (
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          )}
          <div>
            <div className="text-[10px] text-slate-500 uppercase">COUPLING STATUS</div>
            <div>{metrics.concordanceStatus || "CONCORDANT"}</div>
          </div>
        </div>
      </div>

      {/* 2. Top Grid: 4 Interactive Clinical Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Synchronous SpO2 & HR at Same Moment */}
        <div className="bg-slate-50/90 border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-slate-600 uppercase flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5 text-cyan-600" />
              <span>SpO2 & HR (Synced)</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-100 text-cyan-800 font-bold border border-cyan-200">
              1:1 Sync
            </span>
          </div>
          
          <div className="flex items-baseline justify-between my-1">
            <div>
              <div className="text-2xl font-black text-slate-900 font-mono">
                {currentHR} <span className="text-xs text-slate-500 font-medium">BPM</span>
              </div>
              <div className="text-[11px] text-slate-500 font-mono">Heart Rate</div>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-black font-mono ${currentSpO2 < 90 ? 'text-rose-600 animate-pulse' : 'text-cyan-700'}`}>
                {currentSpO2}%
              </div>
              <div className="text-[11px] text-slate-500 font-mono">Pulse Oximetry</div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-500">COSI Ratio:</span>
            <strong className={`font-bold ${Number(cosi) < 1.0 ? 'text-rose-600' : 'text-slate-800'}`}>
              {cosi}
            </strong>
          </div>
        </div>

        {/* Card 2: Activity Level (METs & Intensity) */}
        <div className="bg-slate-50/90 border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-slate-600 uppercase flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-sky-600" />
              <span>Activity Level</span>
            </span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${currentCategory.bgClass}`}>
              {currentCategory.id}
            </span>
          </div>

          <div className="my-1">
            <div className="text-2xl font-black text-sky-800 font-mono">
              {currentMets} <span className="text-xs text-slate-500 font-medium">METs</span>
            </div>
            <div className="text-xs text-slate-600 font-medium">
              {currentCategory.label}
            </div>
          </div>

          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1.5">
            <div 
              className="h-full bg-gradient-to-r from-sky-500 to-indigo-600 transition-all duration-300" 
              style={{ width: `${Math.min(100, ((currentMets - 1.0) / 7.5) * 100)}%` }} 
            />
          </div>
        </div>

        {/* Card 3: Resting Heart Rate (Baseline vs Measured) */}
        <div className="bg-slate-50/90 border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-slate-600 uppercase flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-600" />
              <span>Resting HR (RHR)</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold border border-rose-200">
              Decond. Index
            </span>
          </div>

          <div className="my-1">
            <div className="text-2xl font-black text-slate-900 font-mono flex items-baseline gap-1">
              <span>{baseRHR}</span>
              <span className="text-xs text-slate-500 font-medium">BPM base</span>
            </div>
            <div className="text-xs text-slate-600 font-medium">
              Elevation: <strong className={`font-mono font-bold ${deltaResting > 15 ? 'text-rose-600' : deltaResting > 5 ? 'text-amber-600' : 'text-slate-800'}`}>
                {deltaResting >= 0 ? `+${deltaResting}` : deltaResting} BPM
              </strong>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-500">Max Reserve:</span>
            <strong className="text-slate-800">{185 - baseRHR} BPM</strong>
          </div>
        </div>

        {/* Card 4: HR vs Activity Coupling Ratio */}
        <div className="bg-slate-50/90 border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-slate-600 uppercase flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-600" />
              <span>HR vs Activity</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold border border-amber-200">
              ESR {esr}x
            </span>
          </div>

          <div className="my-1">
            <div className="text-2xl font-black text-slate-900 font-mono">
              {currentHR} / {expectedHR} <span className="text-xs text-slate-500 font-medium">exp</span>
            </div>
            <div className="text-xs text-slate-600 font-medium">
              Strain Concordance: <strong className={isUncoupled ? 'text-rose-600' : 'text-emerald-700'}>{esr}x</strong>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-500">Expected HR:</span>
            <strong className="text-slate-800">{expectedHR} BPM</strong>
          </div>
        </div>

      </div>

      {/* 3. Interactive 2D Cardiorespiratory Concordance Scatter Canvas */}
      <div className="bg-slate-900 text-white rounded-xl p-4 sm:p-5 shadow-inner">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
          <div>
            <h4 className="text-sm font-bold font-mono text-cyan-300 flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>2D Cardiorespiratory Coupling Matrix: Workload (METs) vs. Heart Rate (BPM)</span>
            </h4>
            <p className="text-[11px] text-slate-400 font-medium">
              Real-time physiological cursor tracking actual exertion response versus expected spaceflight envelope
            </p>
          </div>
          <div className="text-xs font-mono text-slate-400">
            Current: <span className="text-cyan-300 font-bold">{currentMets} METs</span> • <span className="text-rose-400 font-bold">{currentHR} BPM</span>
          </div>
        </div>

        {/* 2D SVG Plot */}
        <div className="w-full h-56 relative overflow-hidden bg-slate-950 rounded-lg border border-slate-800 p-2">
          <svg viewBox="0 0 460 220" className="w-full h-full overflow-visible font-mono text-[9px]">
            {/* Grid Lines */}
            <line x1="40" y1="30" x2="430" y2="30" stroke="#334155" strokeDasharray="3 3" opacity="0.4" />
            <line x1="40" y1="85" x2="430" y2="85" stroke="#334155" strokeDasharray="3 3" opacity="0.4" />
            <line x1="40" y1="140" x2="430" y2="140" stroke="#334155" strokeDasharray="3 3" opacity="0.4" />
            <line x1="40" y1="195" x2="430" y2="195" stroke="#334155" strokeDasharray="3 3" opacity="0.4" />

            <line x1="40" y1="30" x2="40" y2="200" stroke="#475569" strokeWidth="1.5" />
            <line x1="40" y1="200" x2="430" y2="200" stroke="#475569" strokeWidth="1.5" />

            {/* Y-Axis Labels (HR BPM) */}
            <text x="35" y="35" fill="#94A3B8" textAnchor="end">180</text>
            <text x="35" y="90" fill="#94A3B8" textAnchor="end">135</text>
            <text x="35" y="145" fill="#94A3B8" textAnchor="end">90</text>
            <text x="35" y="198" fill="#94A3B8" textAnchor="end">50</text>

            {/* X-Axis Labels (METs) */}
            <text x="40" y="214" fill="#94A3B8" textAnchor="middle">1.0</text>
            <text x="137" y="214" fill="#94A3B8" textAnchor="middle">3.0</text>
            <text x="235" y="214" fill="#94A3B8" textAnchor="middle">5.0</text>
            <text x="332" y="214" fill="#94A3B8" textAnchor="middle">7.0</text>
            <text x="430" y="214" fill="#94A3B8" textAnchor="middle">9.0 METs</text>

            {/* Danger Zone: Top Left (Inappropriate Tachycardia at Rest / Hypoxia) */}
            <polygon
              points="40,30 160,30 160,110 40,110"
              fill="rgba(239, 68, 68, 0.12)"
              stroke="rgba(239, 68, 68, 0.3)"
              strokeDasharray="4 2"
            />
            <text x="45" y="46" fill="#F87171" fontWeight="bold">UNCOUPLED TACHYCARDIA ZONE</text>
            <text x="45" y="58" fill="#FCA5A5" fontSize="8">(Hypoxia / Panic / Cardiac Arrhythmia)</text>

            {/* Expected Physiological Coupling Corridor (Green Corridor) */}
            <polygon
              points="40,165 430,45 430,75 40,195"
              fill="rgba(16, 185, 129, 0.15)"
              stroke="rgba(16, 185, 129, 0.4)"
            />
            <line x1="40" y1="180" x2="430" y2="60" stroke="#10B981" strokeWidth="2" strokeDasharray="5 3" />
            <text x="280" y="90" fill="#34D399" transform="rotate(-15 280, 90)">Expected Physiological Coupling Line</text>

            {/* Danger Zone: Bottom Right (Chronotropic Incompetence) */}
            <polygon
              points="280,150 430,150 430,200 280,200"
              fill="rgba(217, 119, 6, 0.12)"
              stroke="rgba(217, 119, 6, 0.3)"
              strokeDasharray="4 2"
            />
            <text x="285" y="165" fill="#FBBF24" fontWeight="bold">CHRONOTROPIC INCOMPETENCE</text>
            <text x="285" y="177" fill="#FCD34D" fontSize="8">(Insufficient Output for High Exertion)</text>

            {/* Expected Position Marker */}
            <circle cx={currentX} cy={expectedY} r="4" fill="none" stroke="#10B981" strokeWidth="2" />
            <line x1={currentX} y1={currentY} x2={currentX} y2={expectedY} stroke="#F43F5E" strokeWidth="1.5" strokeDasharray="2 2" />

            {/* Live Astronaut Position Cursor */}
            <circle
              cx={currentX}
              cy={currentY}
              r="8"
              fill={isUncoupled ? "#EF4444" : "#00F0FF"}
              className="animate-ping"
              opacity="0.6"
            />
            <circle
              cx={currentX}
              cy={currentY}
              r="6"
              fill={isUncoupled ? "#DC2626" : "#0284C7"}
              stroke="#FFFFFF"
              strokeWidth="2"
            />
            <text 
              x={currentX + 10} 
              y={currentY - 6} 
              fill="#FFFFFF" 
              fontWeight="bold" 
              fontSize="10"
              className="drop-shadow-md"
            >
              {activeAstronaut.name.split(' ')[0]} ({currentHR} bpm)
            </text>
          </svg>
        </div>

        {/* Narrative Clinical Triage */}
        <div className="mt-3 bg-slate-950/80 border border-slate-800 rounded-lg p-3 text-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-bold uppercase text-[10px]">Flight Surgeon Triage:</span>
            <span className={isUncoupled ? 'text-rose-400 font-bold' : 'text-slate-200'}>
              {metrics.concordanceDiagnosis || "Optimal cardiorespiratory coupling. Heart rate matches metabolic demand."}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono hidden md:inline">
            Delta vs Expected: <strong className={currentHR - expectedHR > 15 ? 'text-rose-400' : 'text-cyan-400'}>{currentHR - expectedHR >= 0 ? `+${currentHR - expectedHR}` : currentHR - expectedHR} BPM</strong>
          </span>
        </div>
      </div>

      {/* 4. Interactive Activity Simulator Selector */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-mono font-bold text-slate-800 uppercase">
              Flight Surgeon Workload Override (Test Activity Responses)
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            {manualMetsOverride !== null ? (
              <span className="text-amber-700 font-bold">Manual METs Active: {manualMetsOverride}</span>
            ) : (
              <span>Automated Scenario Mode</span>
            )}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          <button
            onClick={() => setManualMetsOverride(1.1)}
            className={`px-3 py-2 rounded-lg text-xs font-mono font-bold border transition-all ${
              manualMetsOverride === 1.1
                ? 'bg-slate-700 text-white border-slate-900 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            💤 Rest (1.1 METs)
          </button>

          <button
            onClick={() => setManualMetsOverride(2.1)}
            className={`px-3 py-2 rounded-lg text-xs font-mono font-bold border transition-all ${
              manualMetsOverride === 2.1
                ? 'bg-sky-600 text-white border-sky-800 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            🛰️ Light IVA (2.1 METs)
          </button>

          <button
            onClick={() => setManualMetsOverride(4.2)}
            className={`px-3 py-2 rounded-lg text-xs font-mono font-bold border transition-all ${
              manualMetsOverride === 4.2
                ? 'bg-amber-600 text-white border-amber-800 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            📦 Moderate (4.2 METs)
          </button>

          <button
            onClick={() => setManualMetsOverride(7.4)}
            className={`px-3 py-2 rounded-lg text-xs font-mono font-bold border transition-all ${
              manualMetsOverride === 7.4
                ? 'bg-rose-600 text-white border-rose-800 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            🚀 EVA Workout (7.4 METs)
          </button>

          <button
            onClick={() => setManualMetsOverride(null)}
            className={`col-span-2 sm:col-span-1 px-3 py-2 rounded-lg text-xs font-mono font-bold border transition-all ${
              manualMetsOverride === null
                ? 'bg-emerald-600 text-white border-emerald-800 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            🔄 Scenario Auto
          </button>
        </div>
      </div>

    </div>
  );
}
