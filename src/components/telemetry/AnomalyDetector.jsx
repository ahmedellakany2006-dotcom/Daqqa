import React from 'react';
import { useMission } from '../../context/MissionContext';
import { AlertCircle, ShieldAlert, CheckCircle, Activity, Brain, Flame } from 'lucide-react';

export default function AnomalyDetector() {
  const { activeAstronaut } = useMission();
  const m = activeAstronaut.current;

  // Diagnostic algorithms
  const isHypoxic = m.spo2 < 90;
  const isTachycardia = m.hr > 140;
  const isSevereFatigue = m.fatigue > 70;
  const isHighStress = m.stress > 70;
  const isHrvSuppressed = m.hrv < 25;

  return (
    <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-4 lg:p-5 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-semibold tracking-wide text-slate-200 uppercase font-mono">
            Autonomous Spaceflight Health Risk Triage
          </h2>
        </div>
        <span className="text-xs font-mono text-slate-400">
          Target: {activeAstronaut.name}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        
        {/* Risk 1: Hypoxia & Decompression */}
        <div className={`p-3 rounded-xl border flex flex-col justify-between ${
          isHypoxic
            ? 'bg-red-950/40 border-red-500/60 text-red-200 shadow-[0_0_12px_rgba(239,68,68,0.3)] animate-pulse'
            : 'bg-slate-900/60 border-slate-800 text-slate-300'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-xs font-bold uppercase">Hypoxia Index</span>
              {isHypoxic ? (
                <span className="text-[10px] font-bold text-red-400 uppercase">CRITICAL</span>
              ) : (
                <span className="text-[10px] font-bold text-emerald-400 uppercase">NOMINAL</span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {isHypoxic
                ? `Immediate SpO2 drop to ${m.spo2}%. Risk of acute micro-decompression or scrubber failure.`
                : `Oxygenation saturation stable at ${m.spo2}%. Cabin O2 partial pressure verified.`}
            </p>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-800/80 font-mono text-[10px] text-slate-400 flex justify-between">
            <span>Threshold: &lt;90%</span>
            <span className={isHypoxic ? 'text-red-400 font-bold' : 'text-slate-300'}>{m.spo2}% SpO2</span>
          </div>
        </div>

        {/* Risk 2: Muscle Fatigue & Physical Strain */}
        <div className={`p-3 rounded-xl border flex flex-col justify-between ${
          isSevereFatigue
            ? 'bg-amber-950/40 border-amber-500/60 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
            : 'bg-slate-900/60 border-slate-800 text-slate-300'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-xs font-bold uppercase">Muscle & EVA Fatigue</span>
              {isSevereFatigue ? (
                <span className="text-[10px] font-bold text-amber-400 uppercase">HIGH STRAIN</span>
              ) : (
                <span className="text-[10px] font-bold text-emerald-400 uppercase">SAFE</span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {isSevereFatigue
                ? `Fatigue index at ${m.fatigue}%. Extended microgravity countermeasure or EVA exertion flagged.`
                : `Fatigue score at ${m.fatigue}%. Muscle metabolic recovery within expected boundaries.`}
            </p>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-800/80 font-mono text-[10px] text-slate-400 flex justify-between">
            <span>Limit: &gt;70%</span>
            <span className={isSevereFatigue ? 'text-amber-400 font-bold' : 'text-slate-300'}>{m.fatigue}% Index</span>
          </div>
        </div>

        {/* Risk 3: Autonomic Stress & Circadian Drift */}
        <div className={`p-3 rounded-xl border flex flex-col justify-between ${
          isHighStress || isHrvSuppressed
            ? 'bg-indigo-950/40 border-indigo-500/60 text-indigo-200 shadow-[0_0_12px_rgba(99,102,241,0.25)]'
            : 'bg-slate-900/60 border-slate-800 text-slate-300'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-xs font-bold uppercase">Autonomic Sympathetic Tone</span>
              {(isHighStress || isHrvSuppressed) ? (
                <span className="text-[10px] font-bold text-indigo-300 uppercase">ELEVATED</span>
              ) : (
                <span className="text-[10px] font-bold text-emerald-400 uppercase">BALANCED</span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {(isHighStress || isHrvSuppressed)
                ? `Sympathovagal imbalance: HRV at ${m.hrv} ms. High sympathetic cortisol activation.`
                : `Vagal tone intact: RMSSD ${m.hrv} ms. Rest and cognitive load well balanced.`}
            </p>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-800/80 font-mono text-[10px] text-slate-400 flex justify-between">
            <span>HRV Baseline: {activeAstronaut.baseHRV} ms</span>
            <span className={(isHighStress || isHrvSuppressed) ? 'text-indigo-300 font-bold' : 'text-slate-300'}>{m.hrv} ms</span>
          </div>
        </div>

      </div>
    </div>
  );
}
