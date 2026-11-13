import React, { useState, useEffect } from 'react';
import { useMission } from '../../context/MissionContext';
import { Radio, AlertTriangle, RefreshCw, Zap, ShieldCheck, HeartPulse } from 'lucide-react';

export default function Header() {
  const { isCommBlackout, toggleCommStatus, isBurstSyncing, activeWristAlert, storageBuffers, activeAstronautId } = useMission();
  const [metSeconds, setMetSeconds] = useState(42 * 86400 + 14 * 3600 + 22 * 60 + 40);
  const [utcTime, setUtcTime] = useState(new Date().toUTCString().slice(17, 25));

  useEffect(() => {
    const timer = setInterval(() => {
      setMetSeconds(prev => prev + 1);
      setUtcTime(new Date().toUTCString().slice(17, 25));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format MET
  const days = Math.floor(metSeconds / 86400);
  const hours = Math.floor((metSeconds % 86400) / 3600);
  const mins = Math.floor((metSeconds % 3600) / 60);
  const secs = metSeconds % 60;
  const metString = `T+${days.toString().padStart(3, '0')}:${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  const currentBufferCount = storageBuffers[activeAstronautId] || 0;

  return (
    <header className="border-b border-cyan-950/60 bg-[#070D18]/95 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left: Branding & Mission Info */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,240,255,0.25)]">
              <HeartPulse className="w-6 h-6 text-cyan-400 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300">
                  DAQQA
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 font-mono">
                  دِقَّة
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono uppercase tracking-wider">
                  NASA Space Apps 2026
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Garmin Connect IQ Astronaut Space Health Monitoring
              </p>
            </div>
          </div>
        </div>

        {/* Center: Mission Clock & Telemetry Timers */}
        <div className="flex items-center gap-4 bg-slate-950/80 border border-slate-800/80 rounded-xl px-4 py-2 font-mono text-xs shadow-inner">
          <div className="text-center border-r border-slate-800 pr-4">
            <div className="text-[10px] uppercase tracking-wider text-slate-400">Mission Elapsed Time</div>
            <div className="text-cyan-300 font-bold tracking-wider text-sm">{metString}</div>
          </div>
          <div className="text-center pl-1">
            <div className="text-[10px] uppercase tracking-wider text-slate-400">Station UTC</div>
            <div className="text-slate-200 font-semibold">{utcTime} UTC</div>
          </div>
        </div>

        {/* Right: Deep Space Comm Blackout State & Sync Control */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          
          {/* Comm Status Toggle Button */}
          <button
            onClick={toggleCommStatus}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg border font-mono text-xs font-semibold transition-all shadow-md ${
              isCommBlackout
                ? 'bg-amber-950/50 border-amber-500/70 text-amber-300 hover:bg-amber-900/60 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                : 'bg-emerald-950/40 border-emerald-500/60 text-emerald-300 hover:bg-emerald-900/50 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
            }`}
            title="Click to toggle Deep Space Communication Blackout (LOS / AOS)"
          >
            <Radio className={`w-3.5 h-3.5 ${isCommBlackout ? 'animate-pulse text-amber-400' : 'text-emerald-400'}`} />
            <span>COMM: {isCommBlackout ? 'LOS (BLACKOUT)' : 'AOS (ONLINE)'}</span>
          </button>

          {/* Burst Sync Status */}
          {isBurstSyncing ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/60 border border-cyan-400 text-cyan-300 font-mono text-xs animate-pulse">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
              <span>BURST SYNC...</span>
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-mono text-xs">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Queue: {currentBufferCount} pkts</span>
            </div>
          )}

          {/* Wrist Alarm Indicator */}
          {activeWristAlert && (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-red-950/80 border border-red-500 text-red-300 font-mono text-xs animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.5)]">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden sm:inline">ALARM ACTIVE</span>
            </div>
          )}

        </div>

      </div>
    </header>
  );
}
