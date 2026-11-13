import React from 'react';
import { useMission } from '../../context/MissionContext';
import { Heart, Wind, Activity, Zap, Shield, AlertTriangle } from 'lucide-react';

export default function CrewRoster() {
  const { crew, activeAstronautId, setActiveAstronautId, storageBuffers } = useMission();

  return (
    <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-4 lg:p-5 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-semibold tracking-wide text-slate-200 uppercase font-mono">
            Active Crew Biometric Roster (Artemis Mission)
          </h2>
        </div>
        <span className="text-xs font-mono text-slate-400">
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
                  ? 'bg-slate-900 border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.2)] ring-1 ring-cyan-400/50'
                  : 'bg-slate-950/70 border-slate-800/80 hover:bg-slate-900/60 hover:border-slate-700'
              }`}
            >
              {/* Top Row: Avatar, Name, Role */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{astro.avatar}</span>
                    <div>
                      <div className="font-semibold text-xs text-white leading-tight">
                        {astro.name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {astro.role} • {astro.agency}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="mb-2">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                    isCritical
                      ? 'bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse'
                      : isWarning
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {isCritical && <AlertTriangle className="w-2.5 h-2.5" />}
                    <span>{current.status}</span>
                  </span>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-slate-800/80 text-center font-mono">
                <div className="bg-slate-900/60 rounded-lg p-1">
                  <div className="text-[9px] text-slate-400 flex items-center justify-center gap-0.5">
                    <Heart className="w-2.5 h-2.5 text-red-400" />
                    <span>HR</span>
                  </div>
                  <div className="text-xs font-bold text-white">{current.hr}</div>
                </div>

                <div className="bg-slate-900/60 rounded-lg p-1">
                  <div className="text-[9px] text-slate-400 flex items-center justify-center gap-0.5">
                    <Wind className="w-2.5 h-2.5 text-cyan-400" />
                    <span>SpO2</span>
                  </div>
                  <div className={`text-xs font-bold ${current.spo2 < 90 ? 'text-red-400' : 'text-cyan-300'}`}>
                    {current.spo2}%
                  </div>
                </div>

                <div className="bg-slate-900/60 rounded-lg p-1">
                  <div className="text-[9px] text-slate-400 flex items-center justify-center gap-0.5">
                    <Activity className="w-2.5 h-2.5 text-amber-400" />
                    <span>HRV</span>
                  </div>
                  <div className="text-xs font-bold text-amber-300">{current.hrv}</div>
                </div>
              </div>

              {/* Bottom footer: Offline Queue */}
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mt-2 pt-1 border-t border-slate-800/60">
                <span className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-cyan-400" />
                  <span>Queue: {packets} pkts</span>
                </span>
                <span className="text-[9px] text-slate-400">FD-{astro.flightDay}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
