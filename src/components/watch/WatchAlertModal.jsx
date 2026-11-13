import React from 'react';
import { useMission } from '../../context/MissionContext';
import { AlertOctagon, BellOff, Vibrate, Volume2 } from 'lucide-react';

export default function WatchAlertModal() {
  const { activeWristAlert, dismissWristAlert } = useMission();

  if (!activeWristAlert) return null;

  return (
    <div className="absolute inset-2 rounded-full bg-red-950/95 border-2 border-red-500 z-30 flex flex-col items-center justify-between p-6 text-center text-white select-none animate-pulse-fast watch-screen-alert backdrop-blur-md">
      
      {/* Top alert badge */}
      <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-red-600/80 text-white font-mono text-[10px] font-bold uppercase tracking-widest shadow-[0_0_10px_rgba(239,68,68,0.8)]">
        <Vibrate className="w-3.5 h-3.5 animate-bounce" />
        <span>HAPTIC VIBE ACTIVE</span>
      </div>

      {/* Main warning icon & diagnostic */}
      <div className="flex flex-col items-center my-auto">
        <AlertOctagon className="w-10 h-10 text-red-400 drop-shadow-[0_0_15px_rgba(239,68,68,0.9)] mb-1" />
        <div className="font-mono text-xs font-bold text-red-200 tracking-wider uppercase">
          {activeWristAlert.status}
        </div>
        <div className="text-[11px] font-sans text-white font-semibold mt-1 px-2 leading-tight">
          {activeWristAlert.message}
        </div>
        <div className="text-[9px] font-mono text-red-300/80 mt-1">
          Autonomous Watch Alert (Deep Space Blackout Mode)
        </div>
      </div>

      {/* Dismiss / Acknowledge button */}
      <button
        onClick={dismissWristAlert}
        className="w-full py-1.5 rounded-xl bg-red-500 hover:bg-red-400 text-black font-bold font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg transition-transform active:scale-95"
      >
        <BellOff className="w-3.5 h-3.5" />
        <span>ACKNOWLEDGE ALARM</span>
      </button>

    </div>
  );
}
