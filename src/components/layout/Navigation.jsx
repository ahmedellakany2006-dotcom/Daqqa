import React from 'react';
import { Watch, Activity, Database, Code2, Info, BrainCircuit } from 'lucide-react';

export default function Navigation({ activeTab, setActiveTab }) {
  const tabs = [
    {
      id: 'simulator',
      label: 'Garmin Wrist Unit',
      sub: 'Connect IQ Emulator & Surveys',
      icon: Watch
    },
    {
      id: 'intelligence',
      label: 'Health Intelligence',
      sub: 'Personalized AI & CSV Export',
      icon: BrainCircuit
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
    <nav className="border-b border-slate-200/90 bg-white/90 backdrop-blur-md px-4 lg:px-8 py-2 shadow-sm relative z-30">
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
                  ? 'bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-300 text-sky-900 shadow-sm shadow-sky-500/10'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-transparent'
              }`}
            >
              <div className={`p-1.5 rounded-lg ${isActive ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="font-bold leading-tight">{tab.label}</div>
                <div className="text-[10px] text-slate-500 font-mono hidden sm:block">{tab.sub}</div>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
