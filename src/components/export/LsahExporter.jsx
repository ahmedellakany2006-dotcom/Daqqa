import React, { useState } from 'react';
import { useMission } from '../../context/MissionContext';
import { generateLsahPayload } from '../../utils/cryptoSimulator';
import { Lock, ShieldAlert, KeyRound, Download, Check, FileCode, CheckCircle2 } from 'lucide-react';

export default function LsahExporter() {
  const { activeAstronaut, telemetryLogs, activeAstronautId, surveyHistory } = useMission();
  const logs = telemetryLogs[activeAstronautId] || [];
  const astroSurveys = surveyHistory.filter(s => s.astronautId === activeAstronautId);

  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const lsahEnvelope = generateLsahPayload(activeAstronaut, logs, astroSurveys);

  const handleDownload = () => {
    const content = JSON.stringify(lsahEnvelope, null, 2);
    const filename = `NASA_LSAH_CLINICAL_SECURE_${activeAstronaut.id}_FD${activeAstronaut.flightDay}.json`;
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2000);
  };

  return (
    <div className="galaxy-glass-card border-amber-500/40 rounded-2xl p-5 shadow-2xl flex flex-col justify-between">
      
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-950/80 border border-amber-500/40 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white font-mono flex items-center gap-2">
                <span>LSAH PIPELINE</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/50 font-bold shadow-[0_0_6px_rgba(245,158,11,0.2)]">
                  ENCRYPTED CLINICAL
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                Lifetime Surveillance of Astronaut Health (Identified & Encrypted)
              </p>
            </div>
          </div>
        </div>

        {/* Security & Encryption Container Specs */}
        <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-700/60 space-y-2 mb-4 text-xs font-mono shadow-lg">
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-slate-400">Identified Astronaut:</span>
            <span className="text-amber-300 font-bold flex items-center gap-1">
              <span>{activeAstronaut.name}</span>
              <span className="text-slate-400 font-medium">({activeAstronaut.id})</span>
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-slate-400">Encryption Cipher:</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <KeyRound className="w-3.5 h-3.5" />
              {lsahEnvelope.envelopeHeader.encryptionCipher}
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-slate-400">SHA-256 Digest:</span>
            <span className="text-cyan-400 font-bold text-[10px] truncate max-w-[190px]">
              {lsahEnvelope.envelopeHeader.integrityDigestSHA256}
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-slate-400">Flight Surgeon Clearance:</span>
            <span className="text-slate-200 font-semibold">JSC Flight Medicine Active</span>
          </div>
        </div>

        {/* Clinical Surveillance Highlights */}
        <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono mb-4">
          <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-700/60">
            <span className="text-[10px] text-slate-400 block">Identified Records</span>
            <span className="text-sm font-black text-amber-300">{lsahEnvelope.payload.longitudinalTelemetryLog.length} Ticks</span>
          </div>
          <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-700/60">
            <span className="text-[10px] text-slate-400 block">Surveys Linked</span>
            <span className="text-sm font-black text-cyan-300">{lsahEnvelope.payload.identifiedBehavioralSurveys.length} Assessments</span>
          </div>
          <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-700/60">
            <span className="text-[10px] text-slate-400 block">Watch Calibration</span>
            <span className="text-sm font-black text-emerald-300">PPG Validated</span>
          </div>
          <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-700/60">
            <span className="text-[10px] text-slate-400 block">Security Status</span>
            <span className="text-sm font-black text-indigo-300">Level 3 Classified</span>
          </div>
        </div>

        {/* JSON Preview Window */}
        <div className="bg-slate-950/90 rounded-xl p-3 border border-slate-800 h-44 overflow-y-auto font-mono text-[11px] text-amber-300 leading-relaxed shadow-inner">
          <pre>{JSON.stringify(lsahEnvelope, null, 2)}</pre>
        </div>
      </div>

      {/* Export Action Button */}
      <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-end">
        <button
          onClick={handleDownload}
          className="w-full py-2 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-600/30 transition-all"
        >
          {downloadSuccess ? (
            <>
              <Check className="w-4 h-4" />
              <span>Exported LSAH Encrypted Bundle</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Export LSAH Clinical Archive</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
