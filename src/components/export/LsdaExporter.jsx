import React, { useState } from 'react';
import { useMission } from '../../context/MissionContext';
import { generateLsdaPayload, exportLsdaToCsv } from '../../utils/anonymizer';
import { Download, ShieldCheck, Database, Eye, FileText, Check } from 'lucide-react';

export default function LsdaExporter() {
  const { activeAstronaut, telemetryLogs, activeAstronautId, surveyHistory } = useMission();
  const logs = telemetryLogs[activeAstronautId] || [];
  const astroSurveys = surveyHistory.filter(s => s.astronautId === activeAstronautId);

  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [format, setFormat] = useState('json'); // 'json' | 'csv'

  const lsdaData = generateLsdaPayload(activeAstronaut, logs, astroSurveys);
  const lsdaCsv = exportLsdaToCsv(lsdaData);

  const handleDownload = () => {
    let content, filename, mime;
    if (format === 'json') {
      content = JSON.stringify(lsdaData, null, 2);
      filename = `NASA_LSDA_${lsdaData.subjectCohort.subjectIdentifier}_FD${activeAstronaut.flightDay}.json`;
      mime = 'application/json';
    } else {
      content = lsdaCsv;
      filename = `NASA_LSDA_${lsdaData.subjectCohort.subjectIdentifier}_FD${activeAstronaut.flightDay}.csv`;
      mime = 'text/csv';
    }

    const blob = new Blob([content], { type: mime });
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
    <div className="galaxy-glass-card border-cyan-500/40 rounded-2xl p-5 shadow-2xl flex flex-col justify-between">
      
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.2)]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white font-mono flex items-center gap-2">
                <span>LSDA PIPELINE</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/50 font-bold shadow-[0_0_6px_rgba(0,240,255,0.2)]">
                  PUBLIC RESEARCH
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                NASA Life Sciences Data Archive (De-Identified & Aggregated)
              </p>
            </div>
          </div>
        </div>

        {/* Security & De-identification Badges */}
        <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-700/60 space-y-2 mb-4 text-xs font-mono shadow-lg">
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-slate-400">PII Removal:</span>
            <span className="text-emerald-400 flex items-center gap-1 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Stripped (HIPAA Non-PII Tier 1)
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-slate-400">Anonymous Subject ID:</span>
            <span className="text-cyan-300 font-extrabold bg-slate-950/90 px-2 py-0.5 rounded border border-cyan-500/40 shadow-xs">
              {lsdaData.subjectCohort.subjectIdentifier}
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-slate-400">Aggregation Window:</span>
            <span className="text-slate-200 font-semibold">30-Min Statistical Bins</span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-slate-400">Target Audience:</span>
            <span className="text-slate-200 font-semibold">NASA Human Research Program (HRP)</span>
          </div>
        </div>

        {/* Aggregated Statistical Snapshot */}
        <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono mb-4">
          <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-700/60">
            <span className="text-[10px] text-slate-400 block">Mean Heart Rate</span>
            <span className="text-sm font-black text-cyan-300">{lsdaData.aggregatedPhysiologicalMetrics.heartRate.mean} BPM</span>
          </div>
          <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-700/60">
            <span className="text-[10px] text-slate-400 block">HRV RMSSD Mean</span>
            <span className="text-sm font-black text-amber-300">{lsdaData.aggregatedPhysiologicalMetrics.heartRateVariability_RMSSD.mean} ms</span>
          </div>
          <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-700/60">
            <span className="text-[10px] text-slate-400 block">Mean SpO2</span>
            <span className="text-sm font-black text-emerald-300">{lsdaData.aggregatedPhysiologicalMetrics.bloodOxygenSaturation_SpO2.mean}%</span>
          </div>
          <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-700/60">
            <span className="text-[10px] text-slate-400 block">Surveys Correlated</span>
            <span className="text-sm font-black text-indigo-300">{lsdaData.behavioralIntegrationSurveys.length} Records</span>
          </div>
        </div>

        {/* JSON Preview Window */}
        <div className="bg-slate-950/90 rounded-xl p-3 border border-slate-800 h-44 overflow-y-auto font-mono text-[11px] text-cyan-300 leading-relaxed shadow-inner">
          <pre>{JSON.stringify(lsdaData, null, 2)}</pre>
        </div>
      </div>

      {/* Export Format Selector & Download Button */}
      <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between gap-3">
        <div className="flex gap-1 p-1 bg-slate-900/80 rounded-lg border border-slate-700/70">
          <button
            onClick={() => setFormat('json')}
            className={`px-3 py-1 rounded text-[11px] font-mono font-bold transition-all ${
              format === 'json' ? 'bg-cyan-600 text-white shadow-[0_0_8px_rgba(0,240,255,0.4)]' : 'text-slate-400 hover:text-white'
            }`}
          >
            JSON
          </button>
          <button
            onClick={() => setFormat('csv')}
            className={`px-3 py-1 rounded text-[11px] font-mono font-bold transition-all ${
              format === 'csv' ? 'bg-cyan-600 text-white shadow-[0_0_8px_rgba(0,240,255,0.4)]' : 'text-slate-400 hover:text-white'
            }`}
          >
            CSV
          </button>
        </div>

        <button
          onClick={handleDownload}
          className="py-2 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold font-mono text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-600/30 transition-all"
        >
          {downloadSuccess ? (
            <>
              <Check className="w-4 h-4" />
              <span>Exported LSDA Bundle</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Export LSDA Archive ({format.toUpperCase()})</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
