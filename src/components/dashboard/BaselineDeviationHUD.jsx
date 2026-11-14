import React from 'react';
import { useMission } from '../../context/MissionContext';
import { UserCheck, Activity, Heart, Wind, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function BaselineDeviationHUD() {
  const { activeAstronaut, personalizedAnomaly } = useMission();
  const { baseline, zScores, deltas, isPersonalizedAnomaly, severity, diagnosticNarrative } = personalizedAnomaly;
  const current = activeAstronaut.current;

  const renderMetricCard = (label, currentVal, unit, mean, stdDev, zScore, delta, color) => {
    const isAnomalous = Math.abs(zScore) >= 2.0;

    return (
      <div className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
        isAnomalous 
          ? 'bg-rose-950/40 border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.25)]' 
          : 'bg-slate-900/60 border-slate-700/60 hover:border-slate-600'
      }`}>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">{label}</span>
          <span className={`text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full ${
            Math.abs(zScore) >= 3.0 
              ? 'bg-rose-900/80 text-rose-200 border border-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]'
              : Math.abs(zScore) >= 2.0 
              ? 'bg-amber-900/80 text-amber-200 border border-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'
              : 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/60'
          }`}>
            {zScore >= 0 ? `+${zScore}σ` : `${zScore}σ`}
          </span>
        </div>

        <div className="flex items-baseline justify-between my-1">
          <div className="text-2xl font-black text-white font-mono tracking-tight">
            {currentVal} <span className="text-xs font-normal text-slate-400">{unit}</span>
          </div>
          <div className={`text-xs font-mono font-bold ${delta >= 0 ? 'text-rose-400' : 'text-cyan-400'}`}>
            {delta >= 0 ? `+${delta}` : delta} {unit}
          </div>
        </div>

        <div className="pt-2 border-t border-slate-700/60 text-[10px] font-mono text-slate-400 flex justify-between">
          <span className="text-slate-400">Baseline Target:</span>
          <span className="font-bold text-slate-200">{mean.toFixed(1)} ± {stdDev.toFixed(1)} {unit}</span>
        </div>
      </div>
    );
  };

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
        {renderMetricCard("Resting Heart Rate", current.hr, "BPM", baseline.restingHR.mean, baseline.restingHR.stdDev, zScores.hr, deltas.hrDelta, "rose")}
        {renderMetricCard("Heart Rate Variability", current.hrv, "ms", baseline.hrvRMSSD.mean, baseline.hrvRMSSD.stdDev, zScores.hrv, deltas.hrvDelta, "amber")}
        {renderMetricCard("Blood Oxygen (SpO2)", current.spo2, "%", baseline.spo2Pct.mean, baseline.spo2Pct.stdDev, zScores.spo2, deltas.spo2Delta, "emerald")}
        {renderMetricCard("Autonomic Stress", current.stress, "pts", baseline.stressIndex.mean, baseline.stressIndex.stdDev, zScores.stress, Number((current.stress - baseline.stressIndex.mean).toFixed(1)), "indigo")}
      </div>

    </div>
  );
}
