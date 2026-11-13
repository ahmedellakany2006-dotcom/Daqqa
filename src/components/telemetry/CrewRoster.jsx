import React from 'react';
import { useMission } from '../../context/MissionContext';
import { Heart, Wind, Activity, Zap, Shield, AlertTriangle } from 'lucide-react';

export default function CrewRoster() {
  const { crew, activeAstronautId, setActiveAstronautId, storageBuffers } = useMission();

  return (
    <div className="bg-white/95 border border-slate-200/90 rounded-2xl p-4 lg:p-5 shadow-sm backdrop-blur-sm relative z-20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-sky-100 text-sky-700">
            <Shield className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold tracking-wide text-slate-800 uppercase font-mono">
            Active Crew Biometric Roster (Artemis Mission)
          </h2>
        </div>
        <span className="text-xs font-mono text-slate-500 font-semibold">
          4 Astronauts Monitored
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {crew.map((astro) => {
          const isSelected = activeAstronautId === astro.id;
          const current = astro.current;
          const packets = storageBuffers[astro.id] || 0;

          const isCritical = current.status.includes('CRITICAL');
          const isWarning = current.status.includes('WARN');

          return (
            <button
              key={astro.id}
              onClick={() => setActiveAstronautId(astro.id)}
              className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'bg-sky-50/90 border-sky-400 shadow-md shadow-sky-500/10 ring-2 ring-sky-300'
                  : 'bg-slate-50/70 border-slate-200/80 hover:bg-slate-100/90 hover:border-slate-300'
              }`}
            >
              {/* Top Row: Avatar, Name, Role */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{astro.avatar}</span>
                    <div>
                      <div className="font-bold text-xs text-slate-900 leading-tight">
                        {astro.name}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono font-medium">
                        {astro.role} • {astro.agency}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="mb-2">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                    isCritical
                      ? 'bg-red-100 text-red-800 border border-red-300 animate-pulse'
                      : isWarning
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  }`}>
                    {isCritical && <AlertTriangle className="w-2.5 h-2.5 text-red-600" />}
                    <span>{current.status}</span>
                  </span>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-slate-200/90 text-center font-mono">
                <div className="bg-white rounded-lg p-1 border border-slate-200/80 shadow-xs">
                  <div className="text-[9px] text-slate-500 flex items-center justify-center gap-0.5">
                    <Heart className="w-2.5 h-2.5 text-red-500" />
                    <span>HR</span>
                  </div>
                  <div className="text-xs font-bold text-slate-900">{current.hr}</div>
                </div>

                <div className="bg-white rounded-lg p-1 border border-slate-200/80 shadow-xs">
                  <div className="text-[9px] text-slate-500 flex items-center justify-center gap-0.5">
                    <Wind className="w-2.5 h-2.5 text-sky-600" />
                    <span>SpO2</span>
                  </div>
                  <div className={`text-xs font-bold ${current.spo2 < 90 ? 'text-red-600' : 'text-sky-700'}`}>
                    {current.spo2}%
                  </div>
                </div>

                <div className="bg-white rounded-lg p-1 border border-slate-200/80 shadow-xs">
                  <div className="text-[9px] text-slate-500 flex items-center justify-center gap-0.5">
                    <Activity className="w-2.5 h-2.5 text-amber-600" />
                    <span>HRV</span>
                  </div>
                  <div className="text-xs font-bold text-amber-700">{current.hrv}</div>
                </div>
              </div>

              {/* Bottom footer: Offline Queue */}
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mt-2 pt-1 border-t border-slate-200/70">
                <span className="flex items-center gap-1 font-semibold">
                  <Zap className="w-3 h-3 text-sky-600" />
                  <span>Queue: {packets} pkts</span>
                </span>
                <span className="text-[9px] text-slate-400 font-bold">FD-{astro.flightDay}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
