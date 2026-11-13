import React from 'react';
import { useMission } from '../../context/MissionContext';
import { AlertOctagon, BellOff, Vibrate, Volume2 } from 'lucide-react';

export default function WatchAlertModal() {
  const { activeWristAlert, dismissWristAlert } = useMission();

  if (!activeWristAlert) return null;

  return (
    <div className="absolute inset-4 rounded-full bg-red-950/95 border-4 border-red-500 z-30 flex flex-col items-center justify-between p-6 text-center text-white select-none animate-pulse-fast watch-screen-alert backdrop-blur-md shadow-[0_0_50px_rgba(239,68,68,0.7)]">
      
      {/* Top alert badge */}
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white font-mono text-[10px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(239,68,68,0.9)]">
        <Vibrate className="w-3.5 h-3.5 animate-bounce" />
        <span>HAPTIC VIBRATION</span>
      </div>

      {/* Main warning icon & diagnostic */}
      <div className="flex flex-col items-center my-auto px-2">
        <AlertOctagon className="w-10 h-10 text-red-400 drop-shadow-[0_0_20px_rgba(239,68,68,1)] mb-1 animate-pulse" />
        <div className="font-mono text-xs font-black text-red-200 tracking-wider uppercase">
          {activeWristAlert.status}
        </div>
        <div className="text-[11px] font-sans text-white font-bold mt-1 px-2 leading-tight">
          {activeWristAlert.message}
        </div>
        <div className="text-[9px] font-mono text-red-300 font-semibold mt-1 bg-red-900/80 px-2.5 py-0.5 rounded-full border border-red-500/40">
          Autonomous Watch Alert (Blackout)
        </div>
      </div>

      {/* Dismiss / Acknowledge button */}
      <div className="w-[85%] pb-1">
        <button
          onClick={dismissWristAlert}
          className="w-full py-2 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 text-white font-black font-mono text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg transition-transform active:scale-95 border border-red-300"
        >
          <BellOff className="w-3.5 h-3.5" />
          <span>ACKNOWLEDGE</span>
        </button>
      </div>

    </div>
  );
}
