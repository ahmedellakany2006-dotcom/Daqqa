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
    <div className="bg-white/95 border border-sky-300/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
      
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-sky-100 text-sky-700">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 font-mono flex items-center gap-2">
                <span>LSDA PIPELINE</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-300 font-bold">
                  PUBLIC RESEARCH
                </span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                NASA Life Sciences Data Archive (De-Identified & Aggregated)
              </p>
            </div>
          </div>
        </div>

        {/* Security & De-identification Badges */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-2 mb-4 text-xs font-mono">
          <div className="flex items-center justify-between text-slate-700">
            <span className="text-slate-500">PII Removal:</span>
            <span className="text-emerald-700 flex items-center gap-1 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Stripped (HIPAA Non-PII Tier 1)
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-700">
            <span className="text-slate-500">Anonymous Subject ID:</span>
            <span className="text-sky-800 font-extrabold bg-white px-2 py-0.5 rounded border border-slate-300 shadow-xs">
              {lsdaData.subjectCohort.subjectIdentifier}
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-700">
            <span className="text-slate-500">Aggregation Window:</span>
            <span className="text-slate-800 font-semibold">30-Min Statistical Bins</span>
          </div>
          <div className="flex items-center justify-between text-slate-700">
            <span className="text-slate-500">Target Audience:</span>
            <span className="text-slate-800 font-semibold">NASA Human Research Program (HRP)</span>
          </div>
        </div>

        {/* Aggregated Statistical Snapshot */}
        <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono mb-4">
          <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
            <span className="text-[10px] text-slate-500 block">Mean Heart Rate</span>
            <span className="text-sm font-extrabold text-sky-800">{lsdaData.aggregatedPhysiologicalMetrics.heartRate.mean} BPM</span>
          </div>
          <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
            <span className="text-[10px] text-slate-500 block">HRV RMSSD Mean</span>
            <span className="text-sm font-extrabold text-amber-800">{lsdaData.aggregatedPhysiologicalMetrics.heartRateVariability_RMSSD.mean} ms</span>
          </div>
          <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
            <span className="text-[10px] text-slate-500 block">Mean SpO2</span>
            <span className="text-sm font-extrabold text-emerald-800">{lsdaData.aggregatedPhysiologicalMetrics.bloodOxygenSaturation_SpO2.mean}%</span>
          </div>
          <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
            <span className="text-[10px] text-slate-500 block">Surveys Correlated</span>
            <span className="text-sm font-extrabold text-indigo-800">{lsdaData.behavioralIntegrationSurveys.length} Records</span>
          </div>
        </div>

        {/* JSON Preview Window */}
        <div className="bg-slate-900 rounded-xl p-3 border border-slate-800 h-44 overflow-y-auto font-mono text-[11px] text-cyan-300 leading-relaxed shadow-inner">
          <pre>{JSON.stringify(lsdaData, null, 2)}</pre>
        </div>
      </div>

      {/* Export Format Selector & Download Button */}
      <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between gap-3">
        <div className="flex gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200">
          <button
            onClick={() => setFormat('json')}
            className={`px-3 py-1 rounded text-[11px] font-mono font-bold transition-all ${
              format === 'json' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            JSON
          </button>
          <button
            onClick={() => setFormat('csv')}
            className={`px-3 py-1 rounded text-[11px] font-mono font-bold transition-all ${
              format === 'csv' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            CSV
          </button>
        </div>

        <button
          onClick={handleDownload}
          className="flex-1 py-2 px-4 rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white font-bold font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-sky-600/20 transition-all"
        >
          {downloadSuccess ? (
            <>
              <Check className="w-4 h-4" />
              <span>Exported {format.toUpperCase()}</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Export LSDA Dataset</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
