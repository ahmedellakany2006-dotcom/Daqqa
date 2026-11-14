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
    <div className="galaxy-glass-card rounded-2xl p-4 lg:p-5 shadow-2xl relative z-20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-amber-950/80 border border-amber-500/40 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-extrabold tracking-wide text-white uppercase font-mono">
            Autonomous Spaceflight Health Risk Triage
          </h2>
        </div>
        <span className="text-xs font-mono text-cyan-300 font-semibold px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30">
          Target: {activeAstronaut.name}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        
        {/* Risk 1: Hypoxia & Decompression */}
        <div className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
          isHypoxic
            ? 'bg-rose-950/50 border-rose-500 text-rose-200 shadow-[0_0_15px_rgba(244,63,94,0.3)] animate-pulse'
            : 'bg-slate-900/60 border-slate-700/60 text-slate-200'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-300">Hypoxia Index</span>
              {isHypoxic ? (
                <span className="text-[10px] font-bold text-rose-200 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-500 uppercase shadow-[0_0_8px_rgba(244,63,94,0.4)]">CRITICAL</span>
              ) : (
                <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/60 uppercase">NOMINAL</span>
              )}
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
              {isHypoxic
                ? `Immediate SpO2 drop to ${m.spo2}%. Risk of acute micro-decompression or scrubber failure.`
                : `Oxygenation saturation stable at ${m.spo2}%. Cabin O2 partial pressure verified.`}
            </p>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-700/60 font-mono text-[10px] text-slate-400 flex justify-between">
            <span>Threshold: &lt;90%</span>
            <span className={isHypoxic ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>{m.spo2}% SpO2</span>
          </div>
        </div>

        {/* Risk 2: Muscle Fatigue & Physical Strain */}
        <div className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
          isSevereFatigue
            ? 'bg-amber-950/50 border-amber-500 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
            : 'bg-slate-900/60 border-slate-700/60 text-slate-200'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-300">Muscle & EVA Fatigue</span>
              {isSevereFatigue ? (
                <span className="text-[10px] font-bold text-amber-200 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500 uppercase shadow-[0_0_8px_rgba(245,158,11,0.4)]">HIGH STRAIN</span>
              ) : (
                <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/60 uppercase">SAFE</span>
              )}
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
              {isSevereFatigue
                ? `Fatigue index at ${m.fatigue}%. Extended microgravity countermeasure or EVA exertion flagged.`
                : `Fatigue score at ${m.fatigue}%. Muscle metabolic recovery within expected boundaries.`}
            </p>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-700/60 font-mono text-[10px] text-slate-400 flex justify-between">
            <span>Limit: &gt;70%</span>
            <span className={isSevereFatigue ? 'text-amber-400 font-bold' : 'text-slate-200 font-bold'}>{m.fatigue}% Index</span>
          </div>
        </div>

        {/* Risk 3: Autonomic Stress & Circadian Drift */}
        <div className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
          isHighStress || isHrvSuppressed
            ? 'bg-indigo-950/50 border-indigo-500 text-indigo-200 shadow-[0_0_15px_rgba(99,102,241,0.3)]'
            : 'bg-slate-900/60 border-slate-700/60 text-slate-200'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-300">Autonomic Sympathetic Tone</span>
              {(isHighStress || isHrvSuppressed) ? (
                <span className="text-[10px] font-bold text-indigo-200 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-500 uppercase shadow-[0_0_8px_rgba(99,102,241,0.4)]">ELEVATED</span>
              ) : (
                <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/60 uppercase">BALANCED</span>
              )}
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
              {(isHighStress || isHrvSuppressed)
                ? `Sympathovagal imbalance: HRV at ${m.hrv} ms. High sympathetic cortisol activation.`
                : `Vagal tone intact: RMSSD ${m.hrv} ms. Rest and cognitive load well balanced.`}
            </p>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-700/60 font-mono text-[10px] text-slate-400 flex justify-between">
            <span>HRV Baseline: {activeAstronaut.baseHRV} ms</span>
            <span className={(isHighStress || isHrvSuppressed) ? 'text-indigo-400 font-bold' : 'text-cyan-400 font-bold'}>{m.hrv} ms</span>
          </div>
        </div>

      </div>
    </div>
  );
}
