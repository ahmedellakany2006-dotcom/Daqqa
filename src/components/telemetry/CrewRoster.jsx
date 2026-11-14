import React from 'react';
import { useMission } from '../../context/MissionContext';
import { Heart, Wind, Activity, Zap, Shield, AlertTriangle } from 'lucide-react';

export default function CrewRoster() {
  const { crew, activeAstronautId, setActiveAstronautId, storageBuffers } = useMission();

  return (
    <div className="galaxy-glass-card rounded-2xl p-4 lg:p-5 shadow-2xl relative z-20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.2)]">
            <Shield className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-extrabold tracking-wide text-white uppercase font-mono">
            Active Crew Biometric Roster (Artemis Mission)
          </h2>
        </div>
        <span className="text-xs font-mono text-cyan-300 font-semibold px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30">
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
                  ? 'bg-cyan-950/70 border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.3)] ring-1 ring-cyan-400'
                  : 'bg-slate-900/60 border-slate-700/60 hover:bg-slate-850/80 hover:border-slate-600'
              }`}
            >
              {/* Top Row: Avatar, Name, Role */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl filter drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">{astro.avatar}</span>
                    <div>
                      <div className="font-bold text-xs text-white leading-tight">
                        {astro.name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono font-medium">
                        {astro.role} • {astro.agency}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="mb-2">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 border ${
                    isCritical
                      ? 'bg-rose-950/90 text-rose-300 border-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)] animate-pulse'
                      : isWarning
                      ? 'bg-amber-950/90 text-amber-300 border-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.3)]'
                      : 'bg-emerald-950/90 text-emerald-300 border-emerald-500/60 shadow-[0_0_6px_rgba(16,185,129,0.2)]'
                  }`}>
                    {isCritical && <AlertTriangle className="w-2.5 h-2.5 text-rose-400" />}
                    <span>{current.status}</span>
                  </span>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-slate-700/60 text-center font-mono">
                <div className="bg-slate-950/80 rounded-lg p-1 border border-slate-800 shadow-inner">
                  <div className="text-[9px] text-slate-400 flex items-center justify-center gap-0.5">
                    <Heart className="w-2.5 h-2.5 text-rose-400" />
                    <span>HR</span>
                  </div>
                  <div className="text-xs font-black text-white">{current.hr}</div>
                </div>

                <div className="bg-slate-950/80 rounded-lg p-1 border border-slate-800 shadow-inner">
                  <div className="text-[9px] text-slate-400 flex items-center justify-center gap-0.5">
                    <Wind className="w-2.5 h-2.5 text-cyan-400" />
                    <span>SpO2</span>
                  </div>
                  <div className={`text-xs font-black ${current.spo2 < 90 ? 'text-rose-400' : 'text-cyan-400'}`}>
                    {current.spo2}%
                  </div>
                </div>

                <div className="bg-slate-950/80 rounded-lg p-1 border border-slate-800 shadow-inner">
                  <div className="text-[9px] text-slate-400 flex items-center justify-center gap-0.5">
                    <Activity className="w-2.5 h-2.5 text-amber-400" />
                    <span>HRV</span>
                  </div>
                  <div className="text-xs font-black text-amber-400">{current.hrv}</div>
                </div>
              </div>

              {/* Bottom footer: Offline Queue */}
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mt-2 pt-1.5 border-t border-slate-700/60">
                <span className="flex items-center gap-1 font-semibold text-cyan-300">
                  <Zap className="w-3 h-3 text-cyan-400" />
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
