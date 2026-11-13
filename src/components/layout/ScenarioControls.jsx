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
    <div className="bg-white/90 border border-slate-200/90 rounded-2xl p-4 lg:p-5 shadow-sm backdrop-blur-sm relative z-20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-ping" />
          <h2 className="text-sm font-bold tracking-wide text-slate-800 uppercase font-mono">
            Mission Scenario Simulator (NASA Flight Protocol)
          </h2>
        </div>
        <div className="text-xs text-slate-500 font-mono">
          Monitoring: <span className="text-sky-700 font-bold">{activeAstronaut.name}</span> ({activeAstronaut.role})
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {Object.values(MISSION_SCENARIOS).map((scen) => {
          const isSelected = activeScenario === scen.id;
          const Icon = scenarioIcons[scen.id] || Orbit;

          let badgeColor = "bg-slate-100 text-slate-600 border-slate-200";
          if (scen.severity === "critical") badgeColor = "bg-red-100 text-red-700 border-red-300";
          if (scen.severity === "warning") badgeColor = "bg-amber-100 text-amber-700 border-amber-300";
          if (scen.severity === "blackout") badgeColor = "bg-indigo-100 text-indigo-700 border-indigo-300";
          if (scen.severity === "normal") badgeColor = "bg-sky-100 text-sky-700 border-sky-300";

          return (
            <button
              key={scen.id}
              onClick={() => setScenario(scen.id)}
              className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all relative overflow-hidden group ${
                isSelected
                  ? 'bg-sky-50/90 border-sky-400 shadow-md shadow-sky-500/10 ring-1 ring-sky-300'
                  : 'bg-white border-slate-200/80 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <div className={`p-1.5 rounded-lg border ${badgeColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
                {isSelected && (
                  <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-sky-600 text-white shadow-xs">
                    ACTIVE
                  </span>
                )}
              </div>
              <div className="font-bold text-xs text-slate-800 line-clamp-1 group-hover:text-sky-700 transition-colors">
                {scen.title}
              </div>
              <div className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                {scen.description}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
