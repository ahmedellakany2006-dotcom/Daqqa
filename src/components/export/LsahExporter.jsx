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
    <div className="bg-white/95 border border-amber-300/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
      
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 font-mono flex items-center gap-2">
                <span>LSAH PIPELINE</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 font-bold">
                  ENCRYPTED CLINICAL
                </span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Lifetime Surveillance of Astronaut Health (Identified & Encrypted)
              </p>
            </div>
          </div>
        </div>

        {/* Security & Encryption Container Specs */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-2 mb-4 text-xs font-mono">
          <div className="flex items-center justify-between text-slate-700">
            <span className="text-slate-500">Identified Astronaut:</span>
            <span className="text-amber-800 font-bold flex items-center gap-1">
              <span>{activeAstronaut.name}</span>
              <span className="text-slate-500 font-medium">({activeAstronaut.id})</span>
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-700">
            <span className="text-slate-500">Encryption Cipher:</span>
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <KeyRound className="w-3.5 h-3.5" />
              {lsahEnvelope.envelopeHeader.encryptionCipher}
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-700">
            <span className="text-slate-500">SHA-256 Digest:</span>
            <span className="text-sky-800 font-bold text-[10px] truncate max-w-[190px]">
              {lsahEnvelope.envelopeHeader.integrityDigestSHA256}
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-700">
            <span className="text-slate-500">Flight Surgeon Clearance:</span>
            <span className="text-slate-800 font-semibold">JSC Flight Medicine Active</span>
          </div>
        </div>

        {/* Clinical Surveillance Highlights */}
        <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono mb-4">
          <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
            <span className="text-[10px] text-slate-500 block">Identified Records</span>
            <span className="text-sm font-extrabold text-amber-800">{lsahEnvelope.payload.longitudinalTelemetryLog.length} Ticks</span>
          </div>
          <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
            <span className="text-[10px] text-slate-500 block">Surveys Linked</span>
            <span className="text-sm font-extrabold text-sky-800">{lsahEnvelope.payload.identifiedBehavioralSurveys.length} Assessments</span>
          </div>
          <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
            <span className="text-[10px] text-slate-500 block">Watch Calibration</span>
            <span className="text-sm font-extrabold text-emerald-800">PPG Validated</span>
          </div>
          <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
            <span className="text-[10px] text-slate-500 block">Security Status</span>
            <span className="text-sm font-extrabold text-indigo-800">Level 3 Classified</span>
          </div>
        </div>

        {/* JSON Preview Window */}
        <div className="bg-slate-900 rounded-xl p-3 border border-slate-800 h-44 overflow-y-auto font-mono text-[11px] text-amber-300 leading-relaxed shadow-inner">
          <pre>{JSON.stringify(lsahEnvelope, null, 2)}</pre>
        </div>
      </div>

      {/* Export Action Button */}
      <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-end">
        <button
          onClick={handleDownload}
          className="w-full py-2 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-amber-600/20 transition-all"
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
