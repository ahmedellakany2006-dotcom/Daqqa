import React from 'react';
import { Rocket, ShieldCheck, HeartPulse, Brain, Database, Cpu, Calendar, Award } from 'lucide-react';

export default function ProjectBrief() {
  return (
    <div className="space-y-6 relative z-20">
      
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-white via-sky-50/60 to-blue-50/70 border border-sky-200/90 rounded-3xl p-6 lg:p-8 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-800 font-mono text-xs font-bold border border-sky-300 flex items-center gap-1.5 shadow-xs">
              <Award className="w-3.5 h-3.5 text-sky-700" />
              NASA SPACE APPS CHALLENGE 2026
            </span>
            <span className="text-xs text-amber-800 font-mono bg-amber-100 px-2.5 py-1 rounded-full border border-amber-300 font-bold">
              Software for Healthcare Track
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 font-mono tracking-tight">
            DAQQA <span className="text-sky-700">(دِقَّة)</span>: Autonomous Space Health & Garmin Telemetry
          </h1>

          <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed font-medium">
            A comprehensive astronaut health monitoring ecosystem deployed on Garmin smartwatches (Connect IQ / Monkey C) 
            tailored for long-duration deep space exploration. DAQQA ensures uninterrupted physiological vigilance during communication 
            blackouts with Earth while providing seamless research and medical synchronization upon signal acquisition.
          </p>
        </div>

        {/* Ambient aerospace rocket watermark */}
        <div className="absolute -right-6 -bottom-6 w-80 h-80 opacity-[0.12] pointer-events-none text-sky-900">
          <Rocket className="w-full h-full" />
        </div>
      </div>

      {/* Core Capabilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Capability 1 */}
        <div className="bg-white/95 border border-slate-200/90 rounded-2xl p-5 shadow-xs flex items-start gap-4">
          <div className="p-2.5 rounded-xl bg-red-100 text-red-700 shrink-0 border border-red-200">
            <HeartPulse className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 font-mono">1. Continuous Biometrics</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Passive, real-time tracking of Heart Rate (HR), Heart Rate Variability (HRV / RMSSD), and Blood Oxygen Saturation (SpO2) 
              via Garmin Elevate optical sensors to preemptively detect physical stress, cardiovascular deconditioning, and muscle fatigue in microgravity.
            </p>
          </div>
        </div>

        {/* Capability 2 */}
        <div className="bg-white/95 border border-slate-200/90 rounded-2xl p-5 shadow-xs flex items-start gap-4">
          <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-700 shrink-0 border border-indigo-200">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 font-mono">2. Behavioral Integration</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              A custom Task UI to deliver short psychological and sleep quality surveys directly on the watch face, 
              allowing subjective behavioral data to be timestamped alongside physiological readings for multi-modal cognitive strain evaluation.
            </p>
          </div>
        </div>

        {/* Capability 3 */}
        <div className="bg-white/95 border border-slate-200/90 rounded-2xl p-5 shadow-xs flex items-start gap-4">
          <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700 shrink-0 border border-amber-200">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 font-mono">3. Autonomous Operations</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Offline data processing and persistent storage (using the Monkey C Storage module) that triggers instant haptic/vibration 
              and visual alerts on the wrist to warn astronauts of critical health thresholds during deep space communication blackouts (LOS) with Earth.
            </p>
          </div>
        </div>

        {/* Capability 4 */}
        <div className="bg-white/95 border border-slate-200/90 rounded-2xl p-5 shadow-xs flex items-start gap-4">
          <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700 shrink-0 border border-emerald-200">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 font-mono">4. Database Architecture (NASA Dual-Export)</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              A dual-export system designed to sync localized data to Earth once network connectivity is restored:
              <br />• <strong>LSDA (Life Sciences Data Archive):</strong> De-identified, aggregated biometric and behavioral metrics for human spaceflight research.
              <br />• <strong>LSAH (Lifetime Surveillance of Astronaut Health):</strong> Identified, encrypted medical telemetry for long-term clinical monitoring.
            </p>
          </div>
        </div>

      </div>

      {/* Development Timeline & Technical Stack */}
      <div className="bg-white/95 border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 font-mono uppercase tracking-wider mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-sky-700" />
          <span>Project Timeline & Technical Stack Alignment</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-sky-700 font-bold block mb-1">September 2026</span>
            <div className="text-slate-900 font-bold">Initial Research & Concept Design</div>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Microgravity cardiovascular deconditioning literature review, Garmin Connect IQ sensor API benchmarks, and astronaut workflow scoping.
            </p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-amber-700 font-bold block mb-1">November 2026</span>
            <div className="text-slate-900 font-bold">System Architecture & NASA Alignment</div>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Formalization of offline Monkey C Storage buffering, dual-export schema alignment (LSDA vs LSAH), and high-frequency sensor simulation.
            </p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-emerald-700 font-bold block mb-1">Production Tech Stack</span>
            <div className="text-slate-900 font-bold">Garmin CIQ & React Telemetry</div>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Monkey C 4.2+, Toybox.Sensor, Toybox.SensorHistory, Toybox.Application.Storage, React 18, Tailwind CSS, 60fps Canvas PPG.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
