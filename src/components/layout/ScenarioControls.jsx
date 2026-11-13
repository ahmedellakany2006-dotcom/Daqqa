import React from 'react';
import { useMission } from '../../context/MissionContext';
import { MISSION_SCENARIOS } from '../../utils/sensorSimulator';
import { Play, Sparkles, Orbit, Space as SpaceIcon, ShieldAlert, Moon, WifiOff } from 'lucide-react';

export default function ScenarioControls() {
  const { activeScenario, setScenario, activeAstronaut } = useMission();

  const scenarioIcons = {
    NOMINAL: Orbit,
    EVA: Sparkles,
    BLACKOUT: WifiOff,
    HYPOXIA: ShieldAlert,
    DESYNC: Moon
  };

  return (
    <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-4 lg:p-5 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <h2 className="text-sm font-semibold tracking-wide text-slate-200 uppercase font-mono">
            Mission Scenario Simulator (NASA Flight Protocol)
          </h2>
        </div>
        <div className="text-xs text-slate-400 font-mono">
          Monitoring: <span className="text-cyan-300 font-semibold">{activeAstronaut.name}</span> ({activeAstronaut.role})
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {Object.values(MISSION_SCENARIOS).map((scen) => {
          const isSelected = activeScenario === scen.id;
          const Icon = scenarioIcons[scen.id] || Orbit;

          let badgeColor = "bg-slate-800 text-slate-400";
          if (scen.severity === "critical") badgeColor = "bg-red-500/20 text-red-300 border-red-500/30";
          if (scen.severity === "warning") badgeColor = "bg-amber-500/20 text-amber-300 border-amber-500/30";
          if (scen.severity === "blackout") badgeColor = "bg-indigo-500/20 text-indigo-300 border-indigo-500/30";
          if (scen.severity === "normal") badgeColor = "bg-cyan-500/20 text-cyan-300 border-cyan-500/30";

          return (
            <button
              key={scen.id}
              onClick={() => setScenario(scen.id)}
              className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all relative overflow-hidden group ${
                isSelected
                  ? 'bg-slate-900 border-cyan-400/80 shadow-[0_0_15px_rgba(0,240,255,0.2)] ring-1 ring-cyan-400/50'
                  : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900/60 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <div className={`p-1.5 rounded-lg border ${badgeColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
                {isSelected && (
                  <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-cyan-500 text-black">
                    ACTIVE
                  </span>
                )}
              </div>
              <div className="font-semibold text-xs text-slate-200 line-clamp-1 group-hover:text-cyan-300 transition-colors">
                {scen.title}
              </div>
              <div className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {scen.description}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
