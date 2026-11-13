import React from 'react';
import { useMission } from '../../context/MissionContext';
import LsdaExporter from './LsdaExporter';
import LsahExporter from './LsahExporter';
import { Database, ArrowRight, ShieldCheck, Lock, Radio, Sparkles } from 'lucide-react';

export default function DualExportHub() {
  const { isCommBlackout, activeAstronaut } = useMission();

  return (
    <div className="space-y-6">
      
      {/* Educational Architecture Banner */}
      <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold">
                NASA INTEGRATION PROTOCOL
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Software for Healthcare Track
              </span>
            </div>
            <h2 className="text-lg font-bold text-white font-mono mt-1">
              Dual-Export Database Architecture (LSDA & LSAH)
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
              In deep space missions (Lunar Gateway, Mars transit), telemetry cannot be continuously streamed due to communication blackouts (LOS). 
              DAQQA captures continuous biometrics and behavioral surveys in on-wrist persistent storage. 
              Once the communication link is restored (AOS), the <strong>Dual-Export Dispatcher</strong> bifurcates the dataset into two distinct NASA archives:
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-2 font-mono text-xs">
            <Radio className={`w-4 h-4 ${isCommBlackout ? 'text-amber-400 animate-pulse' : 'text-emerald-400'}`} />
            <div>
              <div className="text-[10px] text-slate-400">GROUND LINK</div>
              <div className={isCommBlackout ? 'text-amber-300 font-bold' : 'text-emerald-300 font-bold'}>
                {isCommBlackout ? 'LOS (QUEUED IN WATCH)' : 'AOS (SYNCHRONIZED)'}
              </div>
            </div>
          </div>
        </div>

        {/* Visual Pipeline Flowchart */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 pt-3 border-t border-slate-800 text-center font-mono text-xs">
          
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div className="text-[10px] text-cyan-400 font-bold uppercase mb-1">1. SENSORS & SURVEYS</div>
            <div className="text-slate-200 font-semibold">Garmin Tactix 7</div>
            <div className="text-[10px] text-slate-400 mt-1">HR, HRV, SpO2 & Behavioral Task UI</div>
          </div>

          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div className="text-[10px] text-amber-400 font-bold uppercase mb-1">2. AUTONOMOUS BUFFER</div>
            <div className="text-slate-200 font-semibold">Monkey C Storage</div>
            <div className="text-[10px] text-slate-400 mt-1">Local NVRAM caching during LOS blackout</div>
          </div>

          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div className="text-[10px] text-emerald-400 font-bold uppercase mb-1">3. RESTORED LINK (AOS)</div>
            <div className="text-slate-200 font-semibold">Burst Telemetry Sync</div>
            <div className="text-[10px] text-slate-400 mt-1">High-speed burst dispatch to Earth</div>
          </div>

          <div className="bg-gradient-to-r from-cyan-950/60 to-amber-950/60 p-3 rounded-xl border border-slate-700 flex flex-col justify-between">
            <div className="text-[10px] text-indigo-300 font-bold uppercase mb-1">4. DUAL DISPATCH</div>
            <div className="text-white font-semibold">LSDA & LSAH</div>
            <div className="text-[10px] text-slate-300 mt-1">Public Research vs Clinical Surveillance</div>
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
