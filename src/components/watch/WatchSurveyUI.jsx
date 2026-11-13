import React, { useState } from 'react';
import { useMission } from '../../context/MissionContext';
import { CheckCircle2, ChevronLeft, Moon, Brain, Sparkles, Send, ShieldCheck } from 'lucide-react';

export default function WatchSurveyUI({ onBack }) {
  const { submitSurvey, activeAstronaut } = useMission();
  const [activeSurveyType, setActiveSurveyType] = useState('SLEEP_QUALITY');
  const [submitted, setSubmitted] = useState(false);

  // Sleep survey fields
  const [sleepQuality, setSleepQuality] = useState(4);
  const [sleepLatency, setSleepLatency] = useState(15);
  const [awakenings, setAwakenings] = useState(1);
  const [grogginess, setGrogginess] = useState(2);

  // Psychological survey fields
  const [focusScore, setFocusScore] = useState(4);
  const [fatigueScore, setFatigueScore] = useState(2);
  const [stressScore, setStressScore] = useState(2);
  const [moraleScore, setMoraleScore] = useState(4);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (activeSurveyType === 'SLEEP_QUALITY') {
      submitSurvey({
        type: 'SLEEP_QUALITY',
        ratings: {
          sleepQuality,
          sleepLatencyMin: Number(sleepLatency),
          nightAwakenings: Number(awakenings),
          morningGrogginess: Number(grogginess),
          notes: 'Submitted via Garmin Connect IQ on-wrist Task UI'
        }
      });
    } else {
      submitSurvey({
        type: 'POMS_PSYCHOLOGICAL',
        ratings: {
          focusScore: Number(focusScore),
          muscleFatigue: Number(fatigueScore),
          anxietyLevel: Number(stressScore),
          moraleScore: Number(moraleScore),
          notes: 'Submitted via Garmin Connect IQ on-wrist Task UI'
        }
      });
    }

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onBack();
    }, 1500);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-3 select-none relative text-slate-100 font-sans overflow-hidden">
      
      {/* Circular Safe Inset Container */}
      <div className="w-[82%] h-[86%] flex flex-col items-center justify-between z-10 py-1">
        
        {/* Top Header Row (Constrained Width for Curve) */}
        <div className="w-[82%] flex items-center justify-between border-b border-slate-700/80 pb-1.5 pt-0.5">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-[11px] text-cyan-400 font-mono font-bold hover:text-cyan-300 bg-slate-900/90 px-2.5 py-0.5 rounded-lg border border-slate-700/70"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>HUD</span>
          </button>
          <span className="text-[10px] font-mono tracking-wider text-cyan-300 font-extrabold uppercase flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-cyan-400" />
            <span>TASK UI</span>
          </span>
        </div>

        {submitted ? (
          <div className="w-[90%] flex flex-col items-center justify-center my-auto text-center p-4 bg-slate-900/95 rounded-2xl border border-emerald-500/50 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mb-2 shadow-[0_0_18px_rgba(16,185,129,0.5)]">
              <CheckCircle2 className="w-7 h-7 text-emerald-400" />
            </div>
            <div className="font-extrabold text-xs text-emerald-300 font-mono tracking-wide">
              BEHAVIORAL RECORD STAMPED
            </div>
            <div className="text-[10px] text-slate-300 font-mono mt-1">
              HR {activeAstronaut.current.hr} BPM • HRV {activeAstronaut.current.hrv} ms
            </div>
            <div className="text-[9px] text-cyan-300 font-mono mt-1 bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-500/30">
              Cached to Offline Storage
            </div>
          </div>
        ) : (
          <div className="w-[94%] flex flex-col justify-between my-auto py-1 space-y-2.5">
            
            {/* Survey Type Switcher */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900/95 rounded-xl border border-slate-700/80">
              <button
                onClick={() => setActiveSurveyType('SLEEP_QUALITY')}
                className={`flex items-center justify-center gap-1 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                  activeSurveyType === 'SLEEP_QUALITY'
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Moon className="w-3 h-3" />
                <span>Sleep Check</span>
              </button>
              <button
                onClick={() => setActiveSurveyType('POMS_PSYCHOLOGICAL')}
                className={`flex items-center justify-center gap-1 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                  activeSurveyType === 'POMS_PSYCHOLOGICAL'
                    ? 'bg-cyan-500 text-black shadow-sm font-extrabold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Brain className="w-3 h-3" />
                <span>Mood / Stress</span>
              </button>
            </div>

            {/* Questions Form with Proper Breathing Space */}
            <form onSubmit={handleSubmit} className="space-y-2 text-xs">
              {activeSurveyType === 'SLEEP_QUALITY' ? (
                <>
                  <div className="flex items-center justify-between bg-slate-900/85 px-2.5 py-1.5 rounded-xl border border-slate-800">
                    <span className="text-slate-300 text-[11px] font-medium">Quality (1-5):</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(val => (
                        <button
                          type="button"
                          key={val}
                          onClick={() => setSleepQuality(val)}
                          className={`w-5 h-5 rounded-md font-mono text-[10px] font-extrabold transition-transform active:scale-90 ${
                            sleepQuality === val ? 'bg-cyan-400 text-black shadow-[0_0_6px_#00F0FF]' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-slate-900/85 px-2.5 py-1.5 rounded-xl border border-slate-800">
                    <span className="text-slate-300 text-[11px] font-medium">Latency:</span>
                    <div className="flex items-center gap-1.5 font-mono text-xs">
                      <input
                        type="range"
                        min="5"
                        max="60"
                        step="5"
                        value={sleepLatency}
                        onChange={(e) => setSleepLatency(e.target.value)}
                        className="w-16 accent-cyan-400 h-1 bg-slate-800 rounded-lg cursor-pointer"
                      />
                      <span className="text-cyan-300 font-bold text-[11px] w-8 text-right">{sleepLatency}m</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-slate-900/85 px-2.5 py-1.5 rounded-xl border border-slate-800">
                    <span className="text-slate-300 text-[11px] font-medium">Awakenings:</span>
                    <div className="flex gap-1 font-mono text-xs">
                      {[0, 1, 2, 3, 4].map(val => (
                        <button
                          type="button"
                          key={val}
                          onClick={() => setAwakenings(val)}
                          className={`w-5 h-5 rounded-md text-[10px] font-extrabold transition-transform active:scale-90 ${
                            awakenings === val ? 'bg-indigo-400 text-black shadow-[0_0_6px_#818CF8]' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between bg-slate-900/85 px-2.5 py-1.5 rounded-xl border border-slate-800">
                    <span className="text-slate-300 text-[11px] font-medium">Focus:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(val => (
                        <button
                          type="button"
                          key={val}
                          onClick={() => setFocusScore(val)}
                          className={`w-5 h-5 rounded-md font-mono text-[10px] font-extrabold transition-transform active:scale-90 ${
                            focusScore === val ? 'bg-cyan-400 text-black shadow-[0_0_6px_#00F0FF]' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-slate-900/85 px-2.5 py-1.5 rounded-xl border border-slate-800">
                    <span className="text-slate-300 text-[11px] font-medium">Fatigue:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(val => (
                        <button
                          type="button"
                          key={val}
                          onClick={() => setFatigueScore(val)}
                          className={`w-5 h-5 rounded-md font-mono text-[10px] font-extrabold transition-transform active:scale-90 ${
                            fatigueScore === val ? 'bg-amber-400 text-black shadow-[0_0_6px_#F59E0B]' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-slate-900/85 px-2.5 py-1.5 rounded-xl border border-slate-800">
                    <span className="text-slate-300 text-[11px] font-medium">Stress:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(val => (
                        <button
                          type="button"
                          key={val}
                          onClick={() => setStressScore(val)}
                          className={`w-5 h-5 rounded-md font-mono text-[10px] font-extrabold transition-transform active:scale-90 ${
                            stressScore === val ? 'bg-rose-500 text-white shadow-[0_0_6px_#F43F5E]' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Submit Button (Centered, with safe margins) */}
              <div className="pt-1">
                <button
                  type="submit"
                  className="w-full py-1.5 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 hover:from-cyan-300 hover:to-sky-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.35)] active:scale-95 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Record & Stamp</span>
                </button>
              </div>
            </form>

          </div>
        )}

        {/* Bottom Protocol Note (Constrained Width) */}
        <div className="text-[9px] text-slate-400 font-mono flex items-center gap-1 pt-0.5 pb-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>LSDA & LSAH Dual Protocol</span>
        </div>

      </div>

    </div>
  );
}
