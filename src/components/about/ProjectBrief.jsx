import React from 'react';
import { Rocket, ShieldCheck, HeartPulse, Brain, Database, Cpu, Calendar, Award } from 'lucide-react';

export default function ProjectBrief() {
  return (
    <div className="space-y-6 relative z-20">
      
      {/* Hero Banner */}
      <div className="galaxy-glass-card border-cyan-500/40 rounded-3xl p-6 lg:p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full bg-cyan-950/80 text-cyan-300 font-mono text-xs font-bold border border-cyan-500/50 flex items-center gap-1.5 shadow-[0_0_10px_rgba(0,240,255,0.25)]">
              <Award className="w-3.5 h-3.5 text-cyan-400" />
              NASA SPACE APPS CHALLENGE 2026
            </span>
            <span className="text-xs text-amber-300 font-mono bg-amber-950/80 px-2.5 py-1 rounded-full border border-amber-500/50 font-bold shadow-[0_0_8px_rgba(245,158,11,0.2)]">
              Software for Healthcare Track
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white font-mono tracking-tight">
            DAQQA <span className="text-cyan-400">(دِقَّة)</span>: Autonomous Space Health & Garmin Telemetry
          </h1>

          <p className="text-sm sm:text-base text-slate-300 mt-3 leading-relaxed font-medium">
            A comprehensive astronaut health monitoring ecosystem deployed on Garmin smartwatches (Connect IQ / Monkey C) 
            tailored for long-duration deep space exploration. DAQQA ensures uninterrupted physiological vigilance during communication 
            blackouts with Earth while providing seamless research and medical synchronization upon signal acquisition.
          </p>
        </div>

        {/* Ambient aerospace rocket watermark */}
        <div className="absolute -right-6 -bottom-6 w-80 h-80 opacity-[0.12] pointer-events-none text-cyan-400 filter drop-shadow-[0_0_20px_#00F0FF]">
          <Rocket className="w-full h-full" />
        </div>
      </div>

      {/* Core Capabilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Capability 1 */}
        <div className="galaxy-glass-card rounded-2xl p-5 shadow-lg flex items-start gap-4">
          <div className="p-2.5 rounded-xl bg-rose-950/80 text-rose-400 shrink-0 border border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.2)]">
            <HeartPulse className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white font-mono">1. Continuous Biometrics</h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Passive, real-time tracking of Heart Rate (HR), Heart Rate Variability (HRV / RMSSD), and Blood Oxygen Saturation (SpO2) 
              via Garmin Elevate optical sensors to preemptively detect physical stress, cardiovascular deconditioning, and muscle fatigue in microgravity.
            </p>
          </div>
        </div>

        {/* Capability 2 */}
        <div className="galaxy-glass-card rounded-2xl p-5 shadow-lg flex items-start gap-4">
          <div className="p-2.5 rounded-xl bg-indigo-950/80 text-indigo-400 shrink-0 border border-indigo-500/40 shadow-[0_0_10px_rgba(99,102,241,0.2)]">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white font-mono">2. Behavioral Integration</h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              A custom Task UI to deliver short psychological and sleep quality surveys directly on the watch face, 
              allowing subjective behavioral data to be timestamped alongside physiological readings for multi-modal cognitive strain evaluation.
            </p>
          </div>
        </div>

        {/* Capability 3 */}
        <div className="galaxy-glass-card rounded-2xl p-5 shadow-lg flex items-start gap-4">
          <div className="p-2.5 rounded-xl bg-amber-950/80 text-amber-400 shrink-0 border border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white font-mono">3. Autonomous Operations</h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Offline data processing and persistent storage (using the Monkey C Storage module) that triggers instant haptic/vibration 
              and visual alerts on the wrist to warn astronauts of critical health thresholds during deep space communication blackouts (LOS) with Earth.
            </p>
          </div>
        </div>

        {/* Capability 4 */}
        <div className="galaxy-glass-card rounded-2xl p-5 shadow-lg flex items-start gap-4">
          <div className="p-2.5 rounded-xl bg-emerald-950/80 text-emerald-400 shrink-0 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white font-mono">4. Database Architecture (NASA Dual-Export)</h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              A dual-export system designed to sync localized data to Earth once network connectivity is restored:
              <br />• <strong className="text-cyan-400">LSDA (Life Sciences Data Archive):</strong> De-identified, aggregated biometric and behavioral metrics for human spaceflight research.
              <br />• <strong className="text-amber-400">LSAH (Lifetime Surveillance of Astronaut Health):</strong> Identified, encrypted medical telemetry for long-term clinical monitoring.
            </p>
          </div>
        </div>

      </div>

      {/* Development Timeline & Technical Stack */}
      <div className="galaxy-glass-card rounded-2xl p-5 sm:p-6 shadow-2xl">
        <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-cyan-400" />
          <span>Project Timeline & Technical Stack Alignment</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-700/60 shadow-lg">
            <span className="text-cyan-400 font-bold block mb-1">September 2026</span>
            <div className="text-white font-bold">Initial Research & Concept Design</div>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              Microgravity cardiovascular deconditioning literature review, Garmin Connect IQ sensor API benchmarks, and astronaut workflow scoping.
            </p>
          </div>

          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-700/60 shadow-lg">
            <span className="text-amber-400 font-bold block mb-1">November 2026</span>
            <div className="text-white font-bold">System Architecture & NASA Alignment</div>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              Formalization of offline Monkey C Storage buffering, dual-export schema alignment (LSDA vs LSAH), and high-frequency sensor simulation.
            </p>
          </div>

          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-700/60 shadow-lg">
            <span className="text-emerald-400 font-bold block mb-1">Production Tech Stack</span>
            <div className="text-white font-bold">Garmin CIQ & React Telemetry</div>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              Monkey C 4.2+, Toybox.Sensor, Toybox.SensorHistory, Toybox.Application.Storage, React 18, Tailwind CSS, 60fps Canvas PPG.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
