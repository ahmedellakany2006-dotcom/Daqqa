import React from 'react';
import { useMission } from '../../context/MissionContext';
import { Network, Brain, Heart, Wind, Moon, Flame, ShieldAlert, CheckCircle } from 'lucide-react';

export default function MultimodalRiskMatrix() {
  const { multimodalRisk } = useMission();
  const { mmrs, clinicalSeverity, syndromeLabel, elevatedModalitiesCount, modalityBreakdown, recommendations } = multimodalRisk;

  const getSeverityBadge = () => {
    switch (clinicalSeverity) {
      case "CRITICAL":
        return "bg-red-100 text-red-800 border-red-300 animate-pulse";
      case "HIGH":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "MODERATE":
        return "bg-indigo-100 text-indigo-800 border-indigo-300";
      case "MONITORED":
        return "bg-sky-100 text-sky-800 border-sky-300";
      default:
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
    }
  };

  const renderModalityBar = (label, value, icon) => {
    const Icon = icon;
    const isHigh = value >= 60;

    return (
      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-700 mb-1">
          <span className="flex items-center gap-1.5">
            <Icon className="w-3.5 h-3.5 text-slate-500" />
            <span>{label}</span>
          </span>
          <span className={isHigh ? 'text-rose-600 font-extrabold' : 'text-slate-800'}>
            {value}/100
          </span>
        </div>
        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-1.5">
          <div 
            className={`h-full ${
              value >= 75 ? 'bg-red-500' : value >= 50 ? 'bg-amber-500' : 'bg-sky-500'
            }`} 
            style={{ width: `${value}%` }} 
          />
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white/95 border border-slate-200/90 rounded-2xl p-5 shadow-sm backdrop-blur-sm relative z-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
            <Network className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 font-mono uppercase tracking-wide">
              3. Multimodal Risk Assessment (Cross-Correlation)
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
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
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-50 to-indigo-50/40 p-4 rounded-xl border border-slate-200 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-mono uppercase font-bold text-slate-500">
                Multimodal Risk Score (MMRS)
              </span>
              <span className="text-[10px] font-mono text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded font-bold">
                {elevatedModalitiesCount} Co-Occurring Strains
              </span>
            </div>

            <div className="flex items-baseline gap-2 my-2">
              <span className="text-4xl font-black font-mono text-slate-900">
                {mmrs}
              </span>
              <span className="text-sm font-mono text-slate-500 font-medium">/ 100</span>
            </div>

            <div className="mt-1 pt-2 border-t border-slate-200">
              <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold block">Syndromic Pattern Diagnosis:</span>
              <div className="text-sm font-bold text-indigo-900 font-mono mt-0.5">
                {syndromeLabel}
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-200/80 text-[11px] font-mono text-slate-600 space-y-1">
            <div className="font-bold text-slate-800">Flight Surgeon Action Protocol:</div>
            {recommendations.slice(0, 2).map((rec, i) => (
              <div key={i} className="flex items-start gap-1.5 text-[10px] text-slate-700">
                <span className="text-indigo-600 font-bold">•</span>
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
