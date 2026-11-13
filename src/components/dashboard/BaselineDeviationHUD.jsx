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
          ? 'bg-rose-50 border-rose-300 shadow-sm' 
          : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-mono font-bold text-slate-700 uppercase">{label}</span>
          <span className={`text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full ${
            Math.abs(zScore) >= 3.0 
              ? 'bg-red-100 text-red-800 border border-red-300'
              : Math.abs(zScore) >= 2.0 
              ? 'bg-amber-100 text-amber-800 border border-amber-300'
              : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
          }`}>
            {zScore >= 0 ? `+${zScore}σ` : `${zScore}σ`}
          </span>
        </div>

        <div className="flex items-baseline justify-between my-1">
          <div className="text-2xl font-black text-slate-900 font-mono">
            {currentVal} <span className="text-xs font-normal text-slate-500">{unit}</span>
          </div>
          <div className={`text-xs font-mono font-bold ${delta >= 0 ? 'text-rose-600' : 'text-sky-600'}`}>
            {delta >= 0 ? `+${delta}` : delta} {unit}
          </div>
        </div>

        <div className="pt-2 border-t border-slate-200 text-[10px] font-mono text-slate-500 flex justify-between">
          <span>Personal Baseline:</span>
          <span className="font-bold text-slate-800">{mean.toFixed(1)} ± {stdDev.toFixed(1)} {unit}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white/95 border border-slate-200/90 rounded-2xl p-5 shadow-sm backdrop-blur-sm relative z-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-sky-100 text-sky-700">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 font-mono uppercase tracking-wide">
              1. Personalized Anomaly Detection (Learned Baselines)
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Dynamic individual tolerance ($z$-score standardization) replacing static fixed thresholds
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg border flex items-center gap-1.5 ${
            isPersonalizedAnomaly
              ? 'bg-rose-50 text-rose-800 border-rose-300 shadow-xs animate-pulse'
              : 'bg-emerald-50 text-emerald-800 border-emerald-300'
          }`}>
            {isPersonalizedAnomaly ? <ShieldAlert className="w-3.5 h-3.5 text-rose-600" /> : <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
            <span>STATUS: {severity}</span>
          </span>
        </div>
      </div>

      {/* Narrative Alert Banner */}
      <div className={`p-3 rounded-xl border mb-4 text-xs font-mono flex items-center gap-2 ${
        isPersonalizedAnomaly
          ? 'bg-rose-50/90 border-rose-200 text-rose-900'
          : 'bg-slate-50 border-slate-200 text-slate-700'
      }`}>
        <span className="font-bold">Clinical Triage:</span>
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
