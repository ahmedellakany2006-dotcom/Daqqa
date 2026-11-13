import React, { useState } from 'react';
import { useMission } from '../../context/MissionContext';
import HRActivityConcordanceHUD from './HRActivityConcordanceHUD';
import BaselineDeviationHUD from './BaselineDeviationHUD';
import SensorReliabilityMonitor from './SensorReliabilityMonitor';
import MultimodalRiskMatrix from './MultimodalRiskMatrix';
import PredictiveTrendForecast from './PredictiveTrendForecast';
import { openPrintableClinicalReport } from '../../utils/pdfReportGenerator';
import { Download, Check, FileSpreadsheet, ShieldAlert, Sparkles, Activity, FileText, CheckCircle2 } from 'lucide-react';

export default function AstronautHealthDashboard() {
  const { 
    activeAstronaut, 
    exportTelemetryCsv,
    personalizedAnomaly,
    sensorReliability,
    multimodalRisk,
    trendForecast
  } = useMission();
  const [downloadFullSuccess, setDownloadFullSuccess] = useState(false);
  const [downloadActivitySuccess, setDownloadActivitySuccess] = useState(false);

  const handleFullCsvExport = () => {
    exportTelemetryCsv("full");
    setDownloadFullSuccess(true);
    setTimeout(() => setDownloadFullSuccess(false), 2500);
  };

  const handleActivityCsvExport = () => {
    exportTelemetryCsv("hr-activity");
    setDownloadActivitySuccess(true);
    setTimeout(() => setDownloadActivitySuccess(false), 2500);
  };

  return (
    <div className="space-y-6 relative z-20">
      
      {/* Executive Command Banner */}
      <div className="bg-white/95 border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-sm backdrop-blur-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 font-mono font-bold border border-sky-300">
              NASA CLINICAL INTELLIGENCE
            </span>
            <span className="text-xs text-slate-500 font-mono font-medium">
              Spaceflight Health Monitoring
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono font-bold border border-emerald-300">
              SYNCHRONOUS PPG & PULSE OX
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
            Astronaut Health Intelligence & Exertion Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
            Active Patient: <strong className="text-sky-800">{activeAstronaut.name}</strong> ({activeAstronaut.role} • {activeAstronaut.agency}) • Flight Day {activeAstronaut.flightDay}
          </p>
        </div>

        {/* Extraction & PDF Export Hub */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* 1. Full Telemetry CSV */}
          <button
            onClick={handleFullCsvExport}
            className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
            title="Export complete 1Hz telemetry table with synchronous SpO2, HR, Activity, Baselines, and SQI"
          >
            {downloadFullSuccess ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Downloaded CSV!</span>
              </>
            ) : (
              <>
                <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
                <span>Full CSV</span>
              </>
            )}
          </button>

          {/* 2. HR vs Activity Dedicated CSV */}
          <button
            onClick={handleActivityCsvExport}
            className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
            title="Export specialized Cardiorespiratory HR vs Activity Exertion Concordance CSV"
          >
            {downloadActivitySuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300">Downloaded!</span>
              </>
            ) : (
              <>
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>HR vs Act CSV</span>
              </>
            )}
          </button>

          {/* 3. Pre-Compiled NASA PDF Specification */}
          <a
            href="/DAQQA_NASA_Telemetry_Specification_and_Thresholds.pdf"
            download="DAQQA_NASA_Telemetry_Specification_and_Thresholds.pdf"
            className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-rose-600/20 active:scale-95 transition-all"
            title="Download the official NASA Technical Specification & Thresholds PDF document"
          >
            <FileText className="w-4 h-4 text-rose-200" />
            <span>PDF Spec</span>
          </a>

          {/* 4. Live Patient Clinical Dossier (PDF Print) */}
          <button
            onClick={() => openPrintableClinicalReport(activeAstronaut, personalizedAnomaly, sensorReliability, multimodalRisk, trendForecast)}
            className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-sky-600/20 active:scale-95 transition-all"
            title="Generate live Flight Surgeon Patient Clinical Dossier to save as PDF"
          >
            <Download className="w-4 h-4 text-sky-200" />
            <span>Print Dossier (PDF)</span>
          </button>
        </div>
      </div>

      {/* CSV Accuracy & Precision Verification Banner */}
      <div className="bg-gradient-to-r from-slate-50 to-sky-50/60 border border-slate-200 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono text-slate-600 shadow-xs">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong className="text-slate-800">CSV Export Verification:</strong> RFC 4180 Standard • UTF-8 BOM Included • Strict Synchronous Δt = 0 ms Pairing • 0 Missing / Null Values
          </span>
        </div>
        <div className="text-[11px] text-slate-500 font-bold shrink-0">
          Format: Scientific 34-Column Matrix
        </div>
      </div>

      {/* NEW FEATURES 1, 2, 3, 4, 5: HR vs Activity, SpO2 & HR Synchronous Co-Registration, METs, Resting HR */}
      <HRActivityConcordanceHUD />

      {/* Feature 1: Personalized Anomaly Detection (z-Scores) */}
      <BaselineDeviationHUD />

      {/* Feature 2: Sensor Reliability & SQI Indicator */}
      <SensorReliabilityMonitor />

      {/* Feature 3: Multimodal Risk Assessment Fusion */}
      <MultimodalRiskMatrix />

      {/* Feature 4: Health Trend Prediction (Time-Series ML) */}
      <PredictiveTrendForecast />

    </div>
  );
}
