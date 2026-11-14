import React from 'react';
import { useMission } from '../../context/MissionContext';
import { Network, Brain, Heart, Wind, Moon, Flame, ShieldAlert, CheckCircle } from 'lucide-react';

export default function MultimodalRiskMatrix() {
  const { multimodalRisk } = useMission();
  const { mmrs, clinicalSeverity, syndromeLabel, elevatedModalitiesCount, modalityBreakdown, recommendations } = multimodalRisk;

  const getSeverityBadge = () => {
    switch (clinicalSeverity) {
      case "CRITICAL":
        return "bg-rose-950/90 text-rose-300 border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.4)] animate-pulse";
      case "HIGH":
        return "bg-amber-950/90 text-amber-300 border-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.3)]";
      case "MODERATE":
        return "bg-indigo-950/90 text-indigo-300 border-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.3)]";
      case "MONITORED":
        return "bg-cyan-950/90 text-cyan-300 border-cyan-500/60 shadow-[0_0_10px_rgba(0,240,255,0.2)]";
      default:
        return "bg-emerald-950/90 text-emerald-300 border-emerald-500/60 shadow-[0_0_10px_rgba(16,185,129,0.2)]";
    }
  };

  const renderModalityBar = (label, value, icon) => {
    const Icon = icon;
    const isHigh = value >= 60;

    return (
      <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/60 shadow-lg">
        <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-300 mb-1">
          <span className="flex items-center gap-1.5">
            <Icon className="w-3.5 h-3.5 text-cyan-400" />
            <span>{label}</span>
          </span>
          <span className={isHigh ? 'text-rose-400 font-extrabold' : 'text-slate-200'}>
            {value}/100
          </span>
        </div>
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-1.5">
          <div 
            className={`h-full ${
              value >= 75 ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]' : value >= 50 ? 'bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'bg-cyan-400 shadow-[0_0_8px_#00F0FF]'
            }`} 
            style={{ width: `${value}%` }} 
          />
        </div>
      </div>
    );
  };

  return (
    <div className="galaxy-glass-card rounded-2xl p-5 shadow-2xl relative z-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-950/80 border border-indigo-500/40 text-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.2)]">
            <Network className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white font-mono uppercase tracking-wide flex items-center gap-2">
              3. Multimodal Risk Assessment <span className="text-[10px] text-indigo-400 font-normal">(Cross-Correlation)</span>
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">
              Investigates synchronous co-occurrence of changes across physiological & behavioral indicators
            </p>
          </div>
        </div>

        <span className={`text-xs font-mono font-extrabold px-3 py-1 rounded-xl border ${getSeverityBadge()}`}>
          {clinicalSeverity} SEVERITY
        </span>
      </div>

      {/* Main Composite Score & Diagnostic Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4">
        
        {/* Left Column: Composite Multimodal Score & Syndrome */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900/90 to-indigo-950/40 p-4 rounded-xl border border-slate-700/70 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider">
                Multimodal Risk Score (MMRS)
              </span>
              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/80 border border-cyan-500/40 px-2 py-0.5 rounded font-bold shadow-[0_0_6px_rgba(0,240,255,0.2)]">
                {elevatedModalitiesCount} Co-Occurring Strains
              </span>
            </div>

            <div className="flex items-baseline gap-2 my-2">
              <span className="text-4xl font-black font-mono text-white tracking-tight">
                {mmrs}
              </span>
              <span className="text-sm font-mono text-slate-400 font-medium">/ 100</span>
            </div>

            <div className="mt-1 pt-2 border-t border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold block">Syndromic Pattern Diagnosis:</span>
              <div className="text-sm font-bold text-cyan-300 font-mono mt-0.5 tracking-wide">
                {syndromeLabel}
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] font-mono text-slate-300 space-y-1">
            <div className="font-bold text-white uppercase text-[10px] tracking-wider">Flight Surgeon Action Protocol:</div>
            {recommendations.slice(0, 2).map((rec, i) => (
              <div key={i} className="flex items-start gap-1.5 text-[10px] text-slate-300">
                <span className="text-cyan-400 font-bold">•</span>
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: 5 Synchronous Modality Strain Bars */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {renderModalityBar("Autonomic Vagal (HRV)", modalityBreakdown.autonomic, Flame)}
          {renderModalityBar("Cardiovascular Load (HR)", modalityBreakdown.cardiovascular, Heart)}
          {renderModalityBar("Hypoxic Oxygenation", modalityBreakdown.hypoxic, Wind)}
          {renderModalityBar("Sleep Quality & Latency", modalityBreakdown.behavioralSleep, Moon)}
          <div className="sm:col-span-2">
            {renderModalityBar("Cognitive & Affective Load (POMS)", modalityBreakdown.cognitive, Brain)}
          </div>
        </div>

      </div>

    </div>
  );
}
