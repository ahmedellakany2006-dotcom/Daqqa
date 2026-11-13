import React from 'react';
import { useMission } from '../../context/MissionContext';
import { ChevronLeft, Database, RefreshCw, HardDrive, Check, Radio, Zap } from 'lucide-react';

export default function WatchStorageBuffer({ onBack }) {
  const { storageBuffers, activeAstronautId, isCommBlackout, isBurstSyncing, flushStorageBuffers, surveyHistory } = useMission();
  const bufferCount = storageBuffers[activeAstronautId] || 0;
  const astroSurveys = surveyHistory.filter(s => s.astronautId === activeAstronautId);

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-6 sm:p-7 text-slate-100 font-mono select-none relative">
      
      {/* Header */}
      <div className="w-full flex items-center justify-between border-b border-slate-700/80 pb-2 z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-xs text-cyan-400 font-bold hover:text-cyan-300 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-700/60"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>HUD</span>
        </button>
        <span className="text-[11px] text-amber-400 font-extrabold uppercase tracking-wider flex items-center gap-1.5">
          <HardDrive className="w-3.5 h-3.5" />
          <span>MONKEY C STORAGE</span>
        </span>
      </div>

      {/* Buffer Status & Metrics */}
      <div className="w-full flex flex-col items-center my-auto z-10 space-y-2.5">
        
        {/* Animated Storage Pod */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-b from-amber-500/20 to-amber-900/30 border-2 border-amber-400/50 flex flex-col items-center justify-center text-center shadow-[0_0_25px_rgba(245,158,11,0.3)]">
          <Database className="w-6 h-6 text-amber-400 mb-0.5 animate-pulse" />
          <span className="text-sm font-black text-amber-200">{bufferCount}</span>
        </div>

        <div className="text-center">
          <div className="text-xs font-black text-white tracking-wide">AUTONOMOUS BLACKOUT QUEUE</div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Module: <code className="text-cyan-300 font-bold">Toybox.Application.Storage</code>
          </div>
        </div>

        <div className="w-full bg-slate-900/90 rounded-2xl border border-slate-700/80 p-3 text-xs space-y-1.5 shadow-md">
          <div className="flex justify-between text-slate-300">
            <span>Comm Link State:</span>
            <span className={isCommBlackout ? "text-amber-400 font-bold" : "text-emerald-400 font-bold"}>
              {isCommBlackout ? "LOS (AUTONOMOUS)" : "AOS (SYNC READY)"}
            </span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Telemetry Ticks Cached:</span>
            <span className="text-cyan-300 font-extrabold">{Math.max(0, bufferCount - astroSurveys.length)}</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Behavioral Surveys Cached:</span>
            <span className="text-indigo-300 font-extrabold">{astroSurveys.length}</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>NVRAM Quota Used:</span>
            <span className="text-slate-200 font-bold">{((bufferCount / 2000) * 100).toFixed(1)}% / 128KB</span>
          </div>
        </div>

        {/* Sync Burst Action */}
        <button
          onClick={flushStorageBuffers}
          disabled={isBurstSyncing || bufferCount === 0}
          className={`w-full py-2 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 ${
            bufferCount === 0
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              : 'bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 border border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
          }`}
        >
          {isBurstSyncing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
              <span>Transmitting Burst...</span>
            </>
          ) : bufferCount === 0 ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Buffer In Sync (0 Pkts)</span>
            </>
          ) : (
            <>
              <Radio className="w-4 h-4" />
              <span>Flush to Earth Ground</span>
            </>
          )}
        </button>

      </div>

      <div className="text-[10px] text-slate-400 text-center z-10 font-mono">
        Encrypted local flash NVRAM persistence
      </div>
    </div>
  );
}
