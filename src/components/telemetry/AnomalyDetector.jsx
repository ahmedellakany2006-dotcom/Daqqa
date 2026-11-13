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
    <div className="bg-white/95 border border-slate-200/90 rounded-2xl p-4 lg:p-5 shadow-sm backdrop-blur-sm relative z-20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold tracking-wide text-slate-800 uppercase font-mono">
            Autonomous Spaceflight Health Risk Triage
          </h2>
        </div>
        <span className="text-xs font-mono text-slate-500 font-semibold">
          Target: {activeAstronaut.name}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        
        {/* Risk 1: Hypoxia & Decompression */}
        <div className={`p-3.5 rounded-xl border flex flex-col justify-between ${
          isHypoxic
            ? 'bg-red-50 border-red-300 text-red-900 shadow-sm animate-pulse'
            : 'bg-slate-50/80 border-slate-200 text-slate-800'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-mono text-xs font-bold uppercase">Hypoxia Index</span>
              {isHypoxic ? (
                <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded border border-red-200 uppercase">CRITICAL</span>
              ) : (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200 uppercase">NOMINAL</span>
              )}
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
              {isHypoxic
                ? `Immediate SpO2 drop to ${m.spo2}%. Risk of acute micro-decompression or scrubber failure.`
                : `Oxygenation saturation stable at ${m.spo2}%. Cabin O2 partial pressure verified.`}
            </p>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-200 font-mono text-[10px] text-slate-500 flex justify-between">
            <span>Threshold: &lt;90%</span>
            <span className={isHypoxic ? 'text-red-700 font-bold' : 'text-slate-800 font-bold'}>{m.spo2}% SpO2</span>
          </div>
        </div>

        {/* Risk 2: Muscle Fatigue & Physical Strain */}
        <div className={`p-3.5 rounded-xl border flex flex-col justify-between ${
          isSevereFatigue
            ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-sm'
            : 'bg-slate-50/80 border-slate-200 text-slate-800'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-mono text-xs font-bold uppercase">Muscle & EVA Fatigue</span>
              {isSevereFatigue ? (
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-200 uppercase">HIGH STRAIN</span>
              ) : (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200 uppercase">SAFE</span>
              )}
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
              {isSevereFatigue
                ? `Fatigue index at ${m.fatigue}%. Extended microgravity countermeasure or EVA exertion flagged.`
                : `Fatigue score at ${m.fatigue}%. Muscle metabolic recovery within expected boundaries.`}
            </p>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-200 font-mono text-[10px] text-slate-500 flex justify-between">
            <span>Limit: &gt;70%</span>
            <span className={isSevereFatigue ? 'text-amber-800 font-bold' : 'text-slate-800 font-bold'}>{m.fatigue}% Index</span>
          </div>
        </div>

        {/* Risk 3: Autonomic Stress & Circadian Drift */}
        <div className={`p-3.5 rounded-xl border flex flex-col justify-between ${
          isHighStress || isHrvSuppressed
            ? 'bg-indigo-50 border-indigo-300 text-indigo-900 shadow-sm'
            : 'bg-slate-50/80 border-slate-200 text-slate-800'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-mono text-xs font-bold uppercase">Autonomic Sympathetic Tone</span>
              {(isHighStress || isHrvSuppressed) ? (
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded border border-indigo-200 uppercase">ELEVATED</span>
              ) : (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200 uppercase">BALANCED</span>
              )}
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
              {(isHighStress || isHrvSuppressed)
                ? `Sympathovagal imbalance: HRV at ${m.hrv} ms. High sympathetic cortisol activation.`
                : `Vagal tone intact: RMSSD ${m.hrv} ms. Rest and cognitive load well balanced.`}
            </p>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-200 font-mono text-[10px] text-slate-500 flex justify-between">
            <span>HRV Baseline: {activeAstronaut.baseHRV} ms</span>
            <span className={(isHighStress || isHrvSuppressed) ? 'text-indigo-800 font-bold' : 'text-slate-800 font-bold'}>{m.hrv} ms</span>
          </div>
        </div>

      </div>
    </div>
  );
}
