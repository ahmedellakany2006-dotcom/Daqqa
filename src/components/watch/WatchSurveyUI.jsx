import React, { useState } from 'react';
import { useMission } from '../../context/MissionContext';
import { CheckCircle2, ChevronLeft, Moon, Brain, Sparkles, Send } from 'lucide-react';

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
    }, 1400);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-5 text-slate-100 font-sans select-none relative overflow-y-auto no-scrollbar">
      
      {/* Top Header with Back button */}
      <div className="w-full flex items-center justify-between border-b border-slate-800 pb-2 z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-[11px] text-cyan-400 font-mono hover:text-cyan-300"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>ESC</span>
        </button>
        <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">
          TASK UI (CONNECT IQ)
        </span>
      </div>

      {submitted ? (
        <div className="flex flex-col items-center justify-center my-auto text-center z-10 animate-fade-in">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(16,185,129,0.4)]">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          </div>
          <div className="font-bold text-sm text-emerald-300">BEHAVIORAL RECORD STAMPED</div>
          <div className="text-[10px] text-slate-400 font-mono mt-1">
            Linked to concurrent HR {activeAstronaut.current.hr} BPM & HRV {activeAstronaut.current.hrv} ms
          </div>
          <div className="text-[10px] text-cyan-400 font-mono mt-1">
            Cached in Monkey C Storage Buffer
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col justify-between my-auto py-1 z-10 space-y-2.5">
          
          {/* Survey Type Switcher */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveSurveyType('SLEEP_QUALITY')}
              className={`flex items-center justify-center gap-1 py-1 rounded-lg text-[10px] font-mono font-semibold transition-all ${
                activeSurveyType === 'SLEEP_QUALITY'
                  ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Moon className="w-3 h-3" />
              <span>Sleep Check</span>
            </button>
            <button
              onClick={() => setActiveSurveyType('POMS_PSYCHOLOGICAL')}
              className={`flex items-center justify-center gap-1 py-1 rounded-lg text-[10px] font-mono font-semibold transition-all ${
                activeSurveyType === 'POMS_PSYCHOLOGICAL'
                  ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Brain className="w-3 h-3" />
              <span>Mood / Stress</span>
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="space-y-2 text-[11px]">
            {activeSurveyType === 'SLEEP_QUALITY' ? (
              <>
                <div className="flex items-center justify-between bg-slate-900/60 p-1.5 rounded-lg border border-slate-800/80">
                  <span className="text-slate-300">Sleep Quality (1-5):</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(val => (
                      <button
                        type="button"
                        key={val}
                        onClick={() => setSleepQuality(val)}
                        className={`w-5 h-5 rounded font-mono text-[10px] font-bold ${
                          sleepQuality === val ? 'bg-cyan-400 text-black' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between bg-slate-900/60 p-1.5 rounded-lg border border-slate-800/80">
                  <span className="text-slate-300">Sleep Latency:</span>
                  <div className="flex items-center gap-1 font-mono text-[10px]">
                    <input
                      type="range"
                      min="5"
                      max="60"
                      step="5"
                      value={sleepLatency}
                      onChange={(e) => setSleepLatency(e.target.value)}
                      className="w-16 accent-cyan-400 h-1"
                    />
                    <span className="text-cyan-300 w-8 text-right">{sleepLatency}m</span>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-slate-900/60 p-1.5 rounded-lg border border-slate-800/80">
                  <span className="text-slate-300">Night Awakenings:</span>
                  <div className="flex gap-1 font-mono text-[10px]">
                    {[0, 1, 2, 3, 4].map(val => (
                      <button
                        type="button"
                        key={val}
                        onClick={() => setAwakenings(val)}
                        className={`w-5 h-5 rounded font-bold ${
                          awakenings === val ? 'bg-indigo-400 text-black' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
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
                <div className="flex items-center justify-between bg-slate-900/60 p-1.5 rounded-lg border border-slate-800/80">
                  <span className="text-slate-300">Cognitive Focus:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(val => (
                      <button
                        type="button"
                        key={val}
                        onClick={() => setFocusScore(val)}
                        className={`w-5 h-5 rounded font-mono text-[10px] font-bold ${
                          focusScore === val ? 'bg-cyan-400 text-black' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between bg-slate-900/60 p-1.5 rounded-lg border border-slate-800/80">
                  <span className="text-slate-300">Physical Fatigue:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(val => (
                      <button
                        type="button"
                        key={val}
                        onClick={() => setFatigueScore(val)}
                        className={`w-5 h-5 rounded font-mono text-[10px] font-bold ${
                          fatigueScore === val ? 'bg-amber-400 text-black' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between bg-slate-900/60 p-1.5 rounded-lg border border-slate-800/80">
                  <span className="text-slate-300">Stress & Anxiety:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(val => (
                      <button
                        type="button"
                        key={val}
                        onClick={() => setStressScore(val)}
                        className={`w-5 h-5 rounded font-mono text-[10px] font-bold ${
                          stressScore === val ? 'bg-red-400 text-black' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
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
              className="w-full py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(0,240,255,0.3)] transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Record & Stamp</span>
            </button>
          </form>

        </div>
      )}

      <div className="text-[9px] text-slate-400 font-mono z-10">
        Autonomous Sync: LSDA / LSAH Dual Protocol
      </div>
    </div>
  );
}
