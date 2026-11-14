import React from 'react';
import { Watch, Activity, Database, Code2, Info, BrainCircuit, Globe } from 'lucide-react';

export default function Navigation({ activeTab, setActiveTab }) {
  const tabs = [
    {
      id: 'simulator',
      label: 'Garmin Wrist Unit',
      planet: '🌍 Earth (LEO)',
      sub: 'Connect IQ Emulator & Surveys',
      icon: Watch
    },
    {
      id: 'intelligence',
      label: 'NASA Predictive ML AI',
      planet: '🌕 Lunar Gateway',
      sub: '3-Day Early Warning & HRP Diagnostics',
      icon: BrainCircuit
    },
    {
      id: 'ground',
      label: 'Flight Surgeon Station',
      planet: '🔴 Mars Transit',
      sub: 'Multi-Crew Biometrics & ECG',
      icon: Activity
    },
    {
      id: 'export',
      label: 'NASA Dual-Export Hub',
      planet: '🪐 Jupiter Relay',
      sub: 'LSDA vs LSAH Pipeline',
      icon: Database
    },
    {
      id: 'code',
      label: 'Connect IQ Monkey C',
      planet: '💫 Saturn Plane',
      sub: 'Production SDK Codebase',
      icon: Code2
    },
    {
      id: 'about',
      label: 'Space Apps 2026 Brief',
      planet: '✨ Nebula Core',
      sub: 'Mission Scope & Architecture',
      icon: Info
    }
  ];

  return (
    <nav className="border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl px-4 lg:px-8 py-2.5 shadow-2xl relative z-30">
      <div className="max-w-7xl mx-auto flex items-center gap-2.5 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-950/90 via-slate-900/90 to-blue-950/90 border border-cyan-500/50 text-cyan-200 shadow-lg shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              <div className={`p-2 rounded-lg transition-all ${
                isActive 
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_#00F0FF]' 
                  : 'bg-slate-900 border border-slate-800 text-slate-400'
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold leading-tight tracking-wide">{tab.label}</span>
                  <span className="text-[9px] font-mono font-semibold px-1.5 py-0.2 rounded bg-slate-800/80 text-slate-300 border border-slate-700">
                    {tab.planet}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono hidden sm:block mt-0.5">{tab.sub}</div>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
