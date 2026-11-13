import React from 'react';
import { useMission } from '../../context/MissionContext';
import LsdaExporter from './LsdaExporter';
import LsahExporter from './LsahExporter';
import { Database, ArrowRight, ShieldCheck, Lock, Radio, Sparkles } from 'lucide-react';

export default function DualExportHub() {
  const { isCommBlackout, activeAstronaut } = useMission();

  return (
    <div className="space-y-6 relative z-20">
      
      {/* Educational Architecture Banner */}
      <div className="bg-white/95 border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-sm backdrop-blur-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 font-mono font-bold border border-sky-300">
                NASA INTEGRATION PROTOCOL
              </span>
              <span className="text-xs text-slate-500 font-mono font-medium">
                Software for Healthcare Track
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 font-mono mt-1.5">
              Dual-Export Database Architecture (LSDA & LSAH)
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              In deep space missions (Lunar Gateway, Mars transit), telemetry cannot be continuously streamed due to communication blackouts (LOS). 
              DAQQA captures continuous biometrics and behavioral surveys in on-wrist persistent storage. 
              Once the communication link is restored (AOS), the <strong>Dual-Export Dispatcher</strong> bifurcates the dataset into two distinct NASA archives:
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 font-mono text-xs shadow-xs">
            <Radio className={`w-4 h-4 ${isCommBlackout ? 'text-amber-600 animate-pulse' : 'text-emerald-600'}`} />
            <div>
              <div className="text-[10px] text-slate-500 font-bold uppercase">GROUND LINK</div>
              <div className={isCommBlackout ? 'text-amber-800 font-extrabold' : 'text-emerald-800 font-extrabold'}>
                {isCommBlackout ? 'LOS (QUEUED IN WATCH)' : 'AOS (SYNCHRONIZED)'}
              </div>
            </div>
          </div>
        </div>

        {/* Visual Pipeline Flowchart */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5 pt-4 border-t border-slate-200 text-center font-mono text-xs">
          
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col justify-between shadow-xs">
            <div className="text-[10px] text-sky-700 font-bold uppercase mb-1">1. SENSORS & SURVEYS</div>
            <div className="text-slate-900 font-bold">Garmin Tactix 7</div>
            <div className="text-[10px] text-slate-500 mt-1">HR, HRV, SpO2 & Behavioral Task UI</div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col justify-between shadow-xs">
            <div className="text-[10px] text-amber-700 font-bold uppercase mb-1">2. AUTONOMOUS BUFFER</div>
            <div className="text-slate-900 font-bold">Monkey C Storage</div>
            <div className="text-[10px] text-slate-500 mt-1">Local NVRAM caching during LOS blackout</div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col justify-between shadow-xs">
            <div className="text-[10px] text-emerald-700 font-bold uppercase mb-1">3. RESTORED LINK (AOS)</div>
            <div className="text-slate-900 font-bold">Burst Telemetry Sync</div>
            <div className="text-[10px] text-slate-500 mt-1">High-speed burst dispatch to Earth</div>
          </div>

          <div className="bg-gradient-to-r from-sky-50 to-amber-50 p-3 rounded-xl border border-slate-300 flex flex-col justify-between shadow-xs">
            <div className="text-[10px] text-indigo-700 font-bold uppercase mb-1">4. DUAL DISPATCH</div>
            <div className="text-slate-900 font-bold">LSDA & LSAH</div>
            <div className="text-[10px] text-slate-600 mt-1">Public Research vs Clinical Surveillance</div>
          </div>

        </div>
      </div>

      {/* Side-by-Side Live Exporters */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LsdaExporter />
        <LsahExporter />
      </div>

    </div>
  );
}
