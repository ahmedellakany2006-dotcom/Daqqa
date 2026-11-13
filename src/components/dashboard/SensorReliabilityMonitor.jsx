import React from 'react';
import { useMission } from '../../context/MissionContext';
import { ShieldCheck, AlertTriangle, Activity, Waves, Gauge, RefreshCw, HandMetal } from 'lucide-react';

export default function SensorReliabilityMonitor() {
  const { sensorReliability, simulateLowContact, toggleLowContactSimulation } = useMission();
  const { sqi, perfusionIndex, motionLevel, motionScore, contactQuality, reliabilityStatus, isTrustworthy, recommendation, opticalNoiseFloorDb } = sensorReliability;

  return (
    <div className="bg-white/95 border border-slate-200/90 rounded-2xl p-5 shadow-sm backdrop-blur-sm relative z-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 font-mono uppercase tracking-wide">
              2. Sensor Reliability & Signal Quality Index (SQI)
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Validates optical PPG & Pulse Ox trustworthiness before triggering medical protocols
            </p>
          </div>
        </div>

        {/* Interactive Simulation Button */}
        <button
          onClick={toggleLowContactSimulation}
          className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold border transition-all flex items-center gap-1.5 shadow-xs ${
            simulateLowContact
              ? 'bg-rose-100 border-rose-300 text-rose-800 ring-2 ring-rose-200'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
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
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col items-center justify-center text-center shadow-xs">
          <span className="text-[10px] font-mono uppercase font-bold text-slate-500">Signal Quality Index</span>
          <div className="text-4xl font-black font-mono my-1" style={{
            color: sqi >= 85 ? '#059669' : sqi >= 65 ? '#D97706' : '#DC2626'
          }}>
            {sqi}%
          </div>
          <span className={`text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full ${
            sqi >= 85 ? 'bg-emerald-100 text-emerald-800' : sqi >= 65 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
          }`}>
            {reliabilityStatus.replace('_', ' ')}
          </span>
        </div>

        {/* 2. Motion Artifact Level */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-700 mb-1">
              <span>Accelerometer Motion</span>
              <Waves className="w-4 h-4 text-sky-600" />
            </div>
            <div className="text-xl font-black text-slate-900 font-mono mt-1">
              {motionLevel}
            </div>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5">
              Motion Index: <strong className="text-slate-800">{motionScore}/100</strong>
            </p>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-2">
            <div 
              className={`h-full ${motionScore > 60 ? 'bg-amber-500' : 'bg-sky-500'}`} 
              style={{ width: `${motionScore}%` }} 
            />
          </div>
        </div>

        {/* 3. Perfusion Index & Noise Floor */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-700 mb-1">
              <span>Perfusion Index (PI)</span>
              <Activity className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xl font-black text-slate-900 font-mono mt-1">
              {perfusionIndex}%
            </div>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5">
              Optical Noise Floor: <strong className="text-slate-800">{opticalNoiseFloorDb} dB</strong>
            </p>
          </div>
          <div className="text-[10px] font-mono text-emerald-700 font-bold mt-2">
            Pulsatile SNR: Nominal
          </div>
        </div>

        {/* 4. Skin Contact Impedance */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-700 mb-1">
              <span>Watch Skin Contact</span>
              <Gauge className="w-4 h-4 text-indigo-600" />
            </div>
            <div className={`text-xl font-black font-mono mt-1 ${
              contactQuality === 'POOR' ? 'text-red-600 animate-pulse' : 'text-slate-900'
            }`}>
              {contactQuality}
            </div>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5">
              Strap Tension: {contactQuality === 'POOR' ? 'Insufficient' : 'Calibrated'}
            </p>
          </div>
          <div className="text-[10px] font-mono font-bold text-slate-600 mt-2">
            Alarm Gating: {isTrustworthy ? 'Enabled (Active)' : 'Suppressed (Safety)'}
          </div>
        </div>

      </div>

      {/* Actionable Guidance Note */}
      <div className="mt-3 p-3 bg-slate-100 rounded-xl border border-slate-200 text-xs font-mono text-slate-700 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: sqi >= 85 ? '#059669' : '#D97706' }} />
          <span>{recommendation}</span>
        </span>
        <span className="text-[10px] text-slate-500 font-semibold hidden sm:inline">
          Filtering Mode: 4th-Order Butterworth Band-pass
        </span>
      </div>

    </div>
  );
}
