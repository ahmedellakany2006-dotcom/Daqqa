import React from 'react';
import { useMission } from '../../context/MissionContext';
import { ChevronLeft, Database, RefreshCw, HardDrive, Check, Radio } from 'lucide-react';

export default function WatchStorageBuffer({ onBack }) {
  const { storageBuffers, activeAstronautId, isCommBlackout, isBurstSyncing, flushStorageBuffers, surveyHistory } = useMission();
  const bufferCount = storageBuffers[activeAstronautId] || 0;
  const astroSurveys = surveyHistory.filter(s => s.astronautId === activeAstronautId);

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-5 text-slate-100 font-mono select-none relative">
      
      {/* Header */}
      <div className="w-full flex items-center justify-between border-b border-slate-800 pb-2 z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>HUD</span>
        </button>
        <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1">
          <HardDrive className="w-3 h-3" />
          <span>MONKEY C STORAGE</span>
        </span>
      </div>

      {/* Buffer Status & Metrics */}
      <div className="w-full flex flex-col items-center my-auto z-10 space-y-2">
        
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col items-center justify-center text-center shadow-[0_0_15px_rgba(245,158,11,0.2)]">
          <Database className="w-5 h-5 text-amber-400 mb-0.5" />
          <span className="text-xs font-bold text-amber-200">{bufferCount}</span>
        </div>

        <div className="text-center">
          <div className="text-xs font-bold text-white">OFFLINE TELEMETRY QUEUE</div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Module: <code className="text-cyan-300 font-bold">Toybox.Application.Storage</code>
          </div>
        </div>

        <div className="w-full bg-slate-900/90 rounded-xl border border-slate-800 p-2.5 text-[10px] space-y-1.5">
          <div className="flex justify-between text-slate-300">
            <span>Blackout Status:</span>
            <span className={isCommBlackout ? "text-amber-400 font-bold" : "text-emerald-400 font-bold"}>
              {isCommBlackout ? "LOS (AUTONOMOUS)" : "AOS (SYNC READY)"}
            </span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Biometric Ticks Cached:</span>
            <span className="text-cyan-300 font-bold">{Math.max(0, bufferCount - astroSurveys.length)}</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Behavioral Surveys Cached:</span>
            <span className="text-indigo-300 font-bold">{astroSurveys.length}</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Storage Quota Used:</span>
            <span className="text-slate-200 font-bold">{((bufferCount / 2000) * 100).toFixed(1)}% / 128KB</span>
          </div>
        </div>

        {/* Sync Burst Action */}
        <button
          onClick={flushStorageBuffers}
          disabled={isBurstSyncing || bufferCount === 0}
          className={`w-full py-1.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md ${
            bufferCount === 0
              ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
              : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black border border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
          }`}
        >
          {isBurstSyncing ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-black" />
              <span>Transmitting Burst...</span>
            </>
          ) : bufferCount === 0 ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Buffer In Sync (0 Pkts)</span>
            </>
          ) : (
            <>
              <Radio className="w-3.5 h-3.5" />
              <span>Flush to Earth Ground</span>
            </>
          )}
        </button>

      </div>

      <div className="text-[9px] text-slate-400 text-center z-10">
        Encrypted local flash NVRAM persistence
      </div>
    </div>
  );
}
