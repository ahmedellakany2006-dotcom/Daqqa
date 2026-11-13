import React from 'react';
import { useMission } from '../../context/MissionContext';
import { Gauge, Radiation, Compass, Thermometer } from 'lucide-react';

export default function EnvironmentalHUD() {
  const { activeAstronaut, activeScenario } = useMission();
  const isEva = activeScenario === 'EVA';

  return (
    <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-4 lg:p-5 shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Gauge className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-semibold tracking-wide text-slate-200 uppercase font-mono">
            Spacecraft Habitation & Suit Micro-Environment
          </h2>
        </div>
        <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60">
          {isEva ? 'EVA SUIT ENVIRONMENT' : 'HABITAT MODULE ALPHA'}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-mono">
        
        {/* Atmosphere Pressure */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
          <div className="text-[10px] text-slate-400 uppercase font-mono">Atmospheric Pressure</div>
          <div className="text-lg font-bold text-white font-mono mt-0.5">
            {isEva ? '4.3 psi' : '14.7 psi'}
          </div>
          <div className="text-[10px] text-emerald-400 font-mono mt-1">
            {isEva ? '100% O2 Low-P Suit' : 'Standard 1 atm Sea-Level'}
          </div>
        </div>

        {/* Ambient O2 & CO2 */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
          <div className="text-[10px] text-slate-400 uppercase font-mono">O2 / CO2 Scrubbers</div>
          <div className="text-lg font-bold text-cyan-300 font-mono mt-0.5">
            20.9% / 0.28%
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-1">
            CO2 Scrubber Nominal
          </div>
        </div>

        {/* Ambient Radiation Dose */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 uppercase font-mono">Ionizing Radiation</span>
            <Radiation className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-lg font-bold text-amber-300 font-mono mt-0.5">
            0.48 mSv/day
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-1">
            GCR / SPE Storm Warning: Nil
          </div>
        </div>

        {/* Core Skin Temp */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 uppercase font-mono">Skin Thermometry</span>
            <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-lg font-bold text-slate-100 font-mono mt-0.5">
            {activeAstronaut.current.skinTemp} °C
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-1">
            Thermal equilibrium maintained
          </div>
        </div>

      </div>
    </div>
  );
}
