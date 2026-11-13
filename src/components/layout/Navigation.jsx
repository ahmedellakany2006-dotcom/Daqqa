import React from 'react';
import { Watch, Activity, Database, Code2, Info } from 'lucide-react';

export default function Navigation({ activeTab, setActiveTab }) {
  const tabs = [
    {
      id: 'simulator',
      label: 'Garmin Wrist Unit',
      sub: 'Connect IQ Emulator & Surveys',
      icon: Watch
    },
    {
      id: 'ground',
      label: 'Flight Surgeon Station',
      sub: 'Multi-Crew Biometrics & ECG',
      icon: Activity
    },
    {
      id: 'export',
      label: 'NASA Dual-Export Hub',
      sub: 'LSDA vs LSAH Pipeline',
      icon: Database
    },
    {
      id: 'code',
      label: 'Connect IQ Monkey C',
      sub: 'Production SDK Codebase',
      icon: Code2
    },
    {
      id: 'about',
      label: 'Space Apps 2026 Brief',
      sub: 'Project Scope & Architecture',
      icon: Info
    }
  ];

  return (
    <nav className="border-b border-slate-800/80 bg-[#0A0F1D]/80 px-4 lg:px-8 py-2">
      <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 border border-cyan-500/50 text-cyan-200 shadow-[0_0_15px_rgba(0,240,255,0.15)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              <div className={`p-1.5 rounded-lg ${isActive ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-400'}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="font-semibold leading-tight">{tab.label}</div>
                <div className="text-[10px] text-slate-400 font-mono hidden sm:block">{tab.sub}</div>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
