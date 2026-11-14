import React from 'react';
import { useMission } from '../../context/MissionContext';
import { UserCheck, Activity, Heart, Wind, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function BaselineDeviationHUD() {
  const { activeAstronaut, personalizedAnomaly } = useMission();
  
  const safeBaseline = personalizedAnomaly?.baseline || {
    restingHR: { mean: 65, stdDev: 5 },
    hrvRMSSD: { mean: 60, stdDev: 6 },
    spo2Pct: { mean: 98.4, stdDev: 0.6 },
    stressIndex: { mean: 20, stdDev: 5 }
  };
  const safeZ = personalizedAnomaly?.zScores || { hr: 0, hrv: 0, spo2: 0, stress: 0 };
  const safeDeltas = personalizedAnomaly?.deltas || { hrDelta: 0, hrvDelta: 0, spo2Delta: 0 };
  const isPersonalizedAnomaly = Boolean(personalizedAnomaly?.isPersonalizedAnomaly);
  const severity = personalizedAnomaly?.severity || "NOMINAL";
  const diagnosticNarrative = personalizedAnomaly?.diagnosticNarrative || "Physiological vitals align with individual baseline.";
  
  const current = activeAstronaut?.current || {};

  const fmtNum = (val, dec = 1, fallback = '0.0') => {
    return (typeof val === 'number' && Number.isFinite(val)) ? val.toFixed(dec) : fallback;
  };

  const fmtDelta = (val, dec = 1, fallback = '0.0') => {
    if (typeof val !== 'number' || !Number.isFinite(val)) return fallback;
    return (val >= 0 ? `+${val.toFixed(dec)}` : val.toFixed(dec));
  };

  const fmtZScore = (z) => {
    if (typeof z !== 'number' || !Number.isFinite(z)) return '+0.00σ';
    return (z >= 0 ? `+${z.toFixed(2)}` : z.toFixed(2)) + 'σ';
  };

  const renderMetricCard = (label, currentVal, unit, mean, stdDev, zScore, delta) => {
    const safeZVal = (typeof zScore === 'number' && Number.isFinite(zScore)) ? zScore : 0;
    const isAnomalous = Math.abs(safeZVal) >= 2.0;
    const displayVal = (typeof currentVal === 'number' && Number.isFinite(currentVal)) ? currentVal : (unit === '%' ? 98 : 65);

    return (
      <div className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
        isAnomalous 
          ? 'bg-rose-950/40 border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.25)]' 
          : 'bg-slate-900/60 border-slate-700/60 hover:border-slate-600'
      }`}>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">{label}</span>
          <span className={`text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full ${
            Math.abs(safeZVal) >= 3.0 
              ? 'bg-rose-900/80 text-rose-200 border border-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]'
              : Math.abs(safeZVal) >= 2.0 
              ? 'bg-amber-900/80 text-amber-200 border border-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'
              : 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/60'
          }`}>
            {fmtZScore(safeZVal)}
          </span>
        </div>

        <div className="flex items-baseline justify-between my-1">
          <div className="text-2xl font-black text-white font-mono tracking-tight">
            {displayVal} <span className="text-xs font-normal text-slate-400">{unit}</span>
          </div>
          <div className={`text-xs font-mono font-bold ${Number(delta) >= 0 ? 'text-rose-400' : 'text-cyan-400'}`}>
            {fmtDelta(delta, 1)} {unit}
          </div>
        </div>

        <div className="pt-2 border-t border-slate-700/60 text-[10px] font-mono text-slate-400 flex justify-between">
          <span className="text-slate-400">Baseline Target:</span>
          <span className="font-bold text-slate-200">{fmtNum(mean, 1)} ± {fmtNum(stdDev, 1)} {unit}</span>
        </div>
      </div>
    );
  };

  const stressDelta = (Number.isFinite(current.stress) && Number.isFinite(safeBaseline.stressIndex?.mean))
    ? Number((current.stress - safeBaseline.stressIndex.mean).toFixed(1))
    : 0;

  return (
    <div className="galaxy-glass-card rounded-2xl p-5 shadow-2xl relative z-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.2)]">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white font-mono uppercase tracking-wide flex items-center gap-2">
              1. Personalized Anomaly Detection <span className="text-[10px] text-cyan-400 font-normal">($z$-score ML)</span>
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">
              Dynamic individual baseline tolerance replacing static population thresholds
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg border flex items-center gap-1.5 ${
            isPersonalizedAnomaly
              ? 'bg-rose-950/80 text-rose-200 border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.4)] animate-pulse'
              : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/60 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
          }`}>
            {isPersonalizedAnomaly ? <ShieldAlert className="w-3.5 h-3.5 text-rose-400" /> : <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
            <span>STATUS: {severity}</span>
          </span>
        </div>
      </div>

      {/* Narrative Alert Banner */}
      <div className={`p-3 rounded-xl border mb-4 text-xs font-mono flex items-center gap-2 ${
        isPersonalizedAnomaly
          ? 'bg-rose-950/60 border-rose-500/40 text-rose-200'
          : 'bg-slate-900/60 border-slate-700/60 text-slate-300'
      }`}>
        <span className="font-bold text-cyan-400">Clinical Triage:</span>
        <span className="font-medium">{diagnosticNarrative}</span>
      </div>

      {/* Individual Standardized Metric Gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {renderMetricCard("Resting Heart Rate", current.hr, "BPM", safeBaseline.restingHR?.mean, safeBaseline.restingHR?.stdDev, safeZ.hr, safeDeltas.hrDelta)}
        {renderMetricCard("Heart Rate Variability", current.hrv, "ms", safeBaseline.hrvRMSSD?.mean, safeBaseline.hrvRMSSD?.stdDev, safeZ.hrv, safeDeltas.hrvDelta)}
        {renderMetricCard("Blood Oxygen (SpO2)", current.spo2, "%", safeBaseline.spo2Pct?.mean, safeBaseline.spo2Pct?.stdDev, safeZ.spo2, safeDeltas.spo2Delta)}
        {renderMetricCard("Autonomic Stress", current.stress, "pts", safeBaseline.stressIndex?.mean, safeBaseline.stressIndex?.stdDev, safeZ.stress, stressDelta)}
      </div>

    </div>
  );
}
