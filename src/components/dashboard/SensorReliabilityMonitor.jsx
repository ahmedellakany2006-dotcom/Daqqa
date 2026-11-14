import React from 'react';
import { useMission } from '../../context/MissionContext';
import { ShieldCheck, AlertTriangle, Activity, Waves, Gauge, RefreshCw, HandMetal } from 'lucide-react';

export default function SensorReliabilityMonitor() {
  const { sensorReliability, simulateLowContact, toggleLowContactSimulation } = useMission();
  const { 
    sqi = 96, 
    perfusionIndex = 4.2, 
    motionLevel = "LOW", 
    motionScore = 12, 
    contactQuality = "OPTIMAL", 
    reliabilityStatus = "HIGH_CONFIDENCE", 
    isTrustworthy = true, 
    recommendation = "", 
    opticalNoiseFloorDb = -48 
  } = sensorReliability || {};

  const safeMotion = Number.isFinite(motionScore) ? Math.min(100, Math.max(0, motionScore)) : 0;

  return (
    <div className="galaxy-glass-card rounded-2xl p-5 shadow-2xl relative z-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white font-mono uppercase tracking-wide flex items-center gap-2">
              2. Sensor Reliability & SQI Validation <span className="text-[10px] text-emerald-400 font-normal">(Noise Gating)</span>
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">
              Validates optical PPG & Pulse Ox trustworthiness before triggering medical alarms
            </p>
          </div>
        </div>

        {/* Interactive Simulation Button */}
        <button
          onClick={toggleLowContactSimulation}
          className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold border transition-all flex items-center gap-1.5 shadow-xs ${
            simulateLowContact
              ? 'bg-rose-950/90 border-rose-500 text-rose-200 shadow-[0_0_12px_rgba(244,63,94,0.4)] ring-1 ring-rose-400'
              : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border-slate-700 shadow-[0_0_8px_rgba(0,0,0,0.3)]'
          }`}
          title="Click to test poor watch contact and see alarm gating in action"
        >
          <HandMetal className="w-3.5 h-3.5" />
          <span>{simulateLowContact ? 'Simulating: Loose Strap' : 'Simulate Loose Contact'}</span>
        </button>
      </div>

      {/* Main Grid: SQI Gauge & Diagnostic Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        
        {/* 1. Large SQI Meter */}
        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/60 flex flex-col items-center justify-center text-center shadow-lg">
          <span className="text-[10px] font-mono uppercase font-bold text-slate-400">Signal Quality Index</span>
          <div className="text-4xl font-black font-mono my-1 tracking-tight" style={{
            color: sqi >= 85 ? '#34D399' : sqi >= 65 ? '#FBBF24' : '#F87171'
          }}>
            {sqi}%
          </div>
          <span className={`text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full border ${
            sqi >= 85 
              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.3)]' 
              : sqi >= 65 
              ? 'bg-amber-950/80 text-amber-300 border-amber-500/50 shadow-[0_0_8px_rgba(245,158,11,0.3)]' 
              : 'bg-rose-950/80 text-rose-300 border-rose-500/50 shadow-[0_0_8px_rgba(244,63,94,0.3)]'
          }`}>
            {(reliabilityStatus || '').replace('_', ' ')}
          </span>
        </div>

        {/* 2. Motion Artifact Level */}
        <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-700/60 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-300 mb-1">
              <span>IMU Motion Level</span>
              <Waves className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-xl font-black text-white font-mono mt-1">
              {motionLevel}
            </div>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">
              Motion Index: <strong className="text-slate-200">{safeMotion}/100</strong>
            </p>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
            <div 
              className={`h-full ${safeMotion > 60 ? 'bg-amber-400' : 'bg-cyan-400 shadow-[0_0_8px_#00F0FF]'}`} 
              style={{ width: `${safeMotion}%` }} 
            />
          </div>
        </div>

        {/* 3. Perfusion Index & Noise Floor */}
        <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-700/60 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-300 mb-1">
              <span>Perfusion Index (PI)</span>
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl font-black text-white font-mono mt-1">
              {perfusionIndex}%
            </div>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">
              Optical Noise Floor: <strong className="text-slate-200">{opticalNoiseFloorDb} dB</strong>
            </p>
          </div>
          <div className="text-[10px] font-mono text-emerald-400 font-bold mt-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10B981]"></span>
            Pulsatile SNR: Nominal
          </div>
        </div>

        {/* 4. Skin Contact Impedance */}
        <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-700/60 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-300 mb-1">
              <span>Watch Skin Contact</span>
              <Gauge className="w-4 h-4 text-indigo-400" />
            </div>
            <div className={`text-xl font-black font-mono mt-1 ${
              contactQuality === 'POOR' ? 'text-rose-400 animate-pulse' : 'text-white'
            }`}>
              {contactQuality}
            </div>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">
              Strap Tension: <span className={contactQuality === 'POOR' ? 'text-rose-400 font-bold' : 'text-slate-200'}>{contactQuality === 'POOR' ? 'Insufficient' : 'Calibrated'}</span>
            </p>
          </div>
          <div className="text-[10px] font-mono font-bold text-slate-400 mt-2">
            Alarm Gating: <span className={isTrustworthy ? 'text-cyan-400 font-bold' : 'text-amber-400 font-bold'}>{isTrustworthy ? 'Active (Trustworthy)' : 'Suppressed (Artifact)'}</span>
          </div>
        </div>

      </div>

      {/* Actionable Guidance Note */}
      <div className="mt-3 p-3 bg-slate-900/80 rounded-xl border border-slate-700/60 text-xs font-mono text-slate-300 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: sqi >= 85 ? '#34D399' : '#FBBF24', color: sqi >= 85 ? '#34D399' : '#FBBF24' }} />
          <span>{recommendation}</span>
        </span>
        <span className="text-[10px] text-slate-400 font-semibold hidden sm:inline">
          Filtering Mode: 4th-Order Butterworth Band-pass
        </span>
      </div>

    </div>
  );
}
