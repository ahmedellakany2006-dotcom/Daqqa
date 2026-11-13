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
    <div className="w-full h-full flex flex-col items-center justify-between p-6 sm:p-7 text-slate-100 font-sans select-none relative overflow-y-auto no-scrollbar">
      
      {/* Top Header with Back button */}
      <div className="w-full flex items-center justify-between border-b border-slate-700/80 pb-2.5 z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-xs text-cyan-400 font-mono font-bold hover:text-cyan-300 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-700/60"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>HUD</span>
        </button>
        <span className="text-[11px] font-mono tracking-widest text-cyan-300 font-extrabold uppercase flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>ASTRONAUT TASK UI</span>
        </span>
      </div>

      {submitted ? (
        <div className="flex flex-col items-center justify-center my-auto text-center z-10 animate-fade-in p-4 bg-slate-900/90 rounded-2xl border border-emerald-500/50 shadow-2xl">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mb-2 shadow-[0_0_20px_rgba(16,185,129,0.5)]">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          </div>
          <div className="font-extrabold text-sm text-emerald-300 font-mono tracking-wide">
            BEHAVIORAL RECORD STAMPED
          </div>
          <div className="text-[11px] text-slate-300 font-mono mt-1.5">
            Synchronized with live HR {activeAstronaut.current.hr} BPM & HRV {activeAstronaut.current.hrv} ms
          </div>
          <div className="text-[10px] text-cyan-300 font-mono mt-1 bg-cyan-950/80 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
            Cached to Monkey C Offline Storage
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col justify-between my-auto py-1 z-10 space-y-2.5">
          
          {/* Survey Type Switcher */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900/90 rounded-xl border border-slate-700/80">
            <button
              onClick={() => setActiveSurveyType('SLEEP_QUALITY')}
              className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-mono font-bold transition-all ${
                activeSurveyType === 'SLEEP_QUALITY'
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Sleep Check</span>
            </button>
            <button
              onClick={() => setActiveSurveyType('POMS_PSYCHOLOGICAL')}
              className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-mono font-bold transition-all ${
                activeSurveyType === 'POMS_PSYCHOLOGICAL'
                  ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/30 font-extrabold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Brain className="w-3.5 h-3.5" />
              <span>Mood / Stress</span>
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="space-y-2 text-xs">
            {activeSurveyType === 'SLEEP_QUALITY' ? (
              <>
                <div className="flex items-center justify-between bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                  <span className="text-slate-300 font-medium">Sleep Quality:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(val => (
                      <button
                        type="button"
                        key={val}
                        onClick={() => setSleepQuality(val)}
                        className={`w-6 h-6 rounded-md font-mono text-[11px] font-extrabold transition-transform active:scale-90 ${
                          sleepQuality === val ? 'bg-cyan-400 text-black shadow-[0_0_8px_#00F0FF]' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                  <span className="text-slate-300 font-medium">Sleep Latency:</span>
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <input
                      type="range"
                      min="5"
                      max="60"
                      step="5"
                      value={sleepLatency}
                      onChange={(e) => setSleepLatency(e.target.value)}
                      className="w-20 accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                    />
                    <span className="text-cyan-300 font-bold w-9 text-right">{sleepLatency}m</span>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                  <span className="text-slate-300 font-medium">Night Awakenings:</span>
                  <div className="flex gap-1.5 font-mono text-xs">
                    {[0, 1, 2, 3, 4].map(val => (
                      <button
                        type="button"
                        key={val}
                        onClick={() => setAwakenings(val)}
                        className={`w-6 h-6 rounded-md font-extrabold transition-transform active:scale-90 ${
                          awakenings === val ? 'bg-indigo-400 text-black shadow-[0_0_8px_#818CF8]' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
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
                <div className="flex items-center justify-between bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                  <span className="text-slate-300 font-medium">Cognitive Focus:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(val => (
                      <button
                        type="button"
                        key={val}
                        onClick={() => setFocusScore(val)}
                        className={`w-6 h-6 rounded-md font-mono text-[11px] font-extrabold transition-transform active:scale-90 ${
                          focusScore === val ? 'bg-cyan-400 text-black shadow-[0_0_8px_#00F0FF]' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                  <span className="text-slate-300 font-medium">Physical Fatigue:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(val => (
                      <button
                        type="button"
                        key={val}
                        onClick={() => setFatigueScore(val)}
                        className={`w-6 h-6 rounded-md font-mono text-[11px] font-extrabold transition-transform active:scale-90 ${
                          fatigueScore === val ? 'bg-amber-400 text-black shadow-[0_0_8px_#F59E0B]' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                  <span className="text-slate-300 font-medium">Stress & Anxiety:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(val => (
                      <button
                        type="button"
                        key={val}
                        onClick={() => setStressScore(val)}
                        className={`w-6 h-6 rounded-md font-mono text-[11px] font-extrabold transition-transform active:scale-90 ${
                          stressScore === val ? 'bg-rose-500 text-white shadow-[0_0_8px_#F43F5E]' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full py-2 mt-1 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 hover:from-cyan-300 hover:to-sky-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.4)] active:scale-95 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Record & Stamp on Watch</span>
            </button>
          </form>

        </div>
      )}

      <div className="text-[10px] text-slate-400 font-mono z-10 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
        <span>Autonomous Sync: LSDA & LSAH Protocol</span>
      </div>
    </div>
  );
}
