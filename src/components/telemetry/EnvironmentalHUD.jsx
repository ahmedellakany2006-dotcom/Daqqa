import React from 'react';
import { useMission } from '../../context/MissionContext';
import { Gauge, Radiation, Compass, Thermometer } from 'lucide-react';

export default function EnvironmentalHUD() {
  const { activeAstronaut, activeScenario } = useMission();
  const isEva = activeScenario === 'EVA';

  return (
    <div className="bg-white/95 border border-slate-200/90 rounded-2xl p-4 lg:p-5 shadow-sm backdrop-blur-sm relative z-20">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-sky-100 text-sky-700">
            <Gauge className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold tracking-wide text-slate-800 uppercase font-mono">
            Spacecraft Habitation & Suit Micro-Environment
          </h2>
        </div>
        <span className="text-xs font-mono font-bold text-sky-800 bg-sky-100 px-2.5 py-1 rounded-lg border border-sky-300">
          {isEva ? 'EVA SUIT ENVIRONMENT' : 'HABITAT MODULE ALPHA'}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-mono">
        
        {/* Atmosphere Pressure */}
        <div className="bg-slate-50/90 border border-slate-200 rounded-xl p-3 shadow-xs">
          <div className="text-[10px] text-slate-500 uppercase font-mono font-semibold">Atmospheric Pressure</div>
          <div className="text-lg font-extrabold text-slate-900 font-mono mt-0.5">
            {isEva ? '4.3 psi' : '14.7 psi'}
          </div>
          <div className="text-[10px] text-emerald-700 font-mono font-bold mt-1">
            {isEva ? '100% O2 Low-P Suit' : 'Standard 1 atm Sea-Level'}
          </div>
        </div>

        {/* Ambient O2 & CO2 */}
        <div className="bg-slate-50/90 border border-slate-200 rounded-xl p-3 shadow-xs">
          <div className="text-[10px] text-slate-500 uppercase font-mono font-semibold">O2 / CO2 Scrubbers</div>
          <div className="text-lg font-extrabold text-sky-800 font-mono mt-0.5">
            20.9% / 0.28%
          </div>
          <div className="text-[10px] text-slate-500 font-mono font-medium mt-1">
            CO2 Scrubber Nominal
          </div>
        </div>

        {/* Ambient Radiation Dose */}
        <div className="bg-slate-50/90 border border-slate-200 rounded-xl p-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500 uppercase font-mono font-semibold">Ionizing Radiation</span>
            <Radiation className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="text-lg font-extrabold text-amber-700 font-mono mt-0.5">
            0.48 mSv/day
          </div>
          <div className="text-[10px] text-slate-500 font-mono font-medium mt-1">
            GCR / SPE Storm Warning: Nil
          </div>
        </div>

        {/* Core Skin Temp */}
        <div className="bg-slate-50/90 border border-slate-200 rounded-xl p-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500 uppercase font-mono font-semibold">Skin Thermometry</span>
            <Thermometer className="w-3.5 h-3.5 text-sky-600" />
          </div>
          <div className="text-lg font-extrabold text-slate-900 font-mono mt-0.5">
            {activeAstronaut.current.skinTemp} °C
          </div>
          <div className="text-[10px] text-slate-500 font-mono font-medium mt-1">
            Thermal equilibrium ok
          </div>
        </div>

      </div>
    </div>
  );
}
