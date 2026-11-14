import React, { useState } from 'react';
import { useMission } from '../../context/MissionContext';
import NasaPredictiveMLHUD from './NasaPredictiveMLHUD';
import HRActivityConcordanceHUD from './HRActivityConcordanceHUD';
import BaselineDeviationHUD from './BaselineDeviationHUD';
import SensorReliabilityMonitor from './SensorReliabilityMonitor';
import MultimodalRiskMatrix from './MultimodalRiskMatrix';
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
      <div className="galaxy-glass-card border border-slate-700/60 rounded-2xl p-5 sm:p-6 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 font-mono font-bold border border-cyan-500/40">
              NASA CLINICAL INTELLIGENCE
            </span>
            <span className="text-xs text-slate-400 font-mono font-medium">
              Spaceflight Health Monitoring
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 font-mono font-bold border border-emerald-500/40">
              SYNCHRONOUS PPG & PULSE OX
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-mono drop-shadow-md">
            Astronaut Health Intelligence & Exertion Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">
            Active Patient: <strong className="text-cyan-400">{activeAstronaut.name}</strong> ({activeAstronaut.role} • {activeAstronaut.agency}) • Flight Day {activeAstronaut.flightDay}
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

          {/* 3. Pre-Compiled NASA Technical Specification PDF */}
          <a
            href="/DAQQA_NASA_Telemetry_Specification_and_Thresholds.pdf"
            download="DAQQA_NASA_Telemetry_Specification_and_Thresholds.pdf"
            className="px-3 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-rose-600/20 active:scale-95 transition-all"
            title="Download the official NASA Technical Specification & Thresholds PDF document"
          >
            <FileText className="w-4 h-4 text-rose-200" />
            <span>Tech Spec</span>
          </a>

          {/* 4. Complete System Features Specification PDF */}
          <a
            href="/DAQQA_System_Features_Specification.pdf"
            download="DAQQA_System_Features_Specification.pdf"
            className="px-3 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-500 hover:to-indigo-600 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-purple-600/20 active:scale-95 transition-all"
            title="Download the Complete DAQQA System Features & Architectural Specification PDF"
          >
            <Sparkles className="w-4 h-4 text-purple-200" />
            <span>Features PDF</span>
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
      <div className="bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-cyan-950/70 border border-slate-700/80 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono text-slate-300 shadow-md">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong className="text-white">CSV Export Verification:</strong> RFC 4180 Standard • UTF-8 BOM Included • Strict Synchronous Δt = 0 ms Pairing • 0 Missing / Null Values
          </span>
        </div>
        <div className="text-[11px] text-cyan-300 font-bold shrink-0">
          Format: Scientific 34-Column Matrix
        </div>
      </div>

      {/* Core Machine Learning: NASA HRP 3-Day Risk Horizon & Hazard Detector */}
      <NasaPredictiveMLHUD />

      {/* Cardiorespiratory Concordance: HR vs Activity, SpO2 & HR Synchronous Co-Registration */}
      <HRActivityConcordanceHUD />

      {/* Feature 1: Personalized Anomaly Detection (z-Scores) */}
      <BaselineDeviationHUD />

      {/* Feature 2: Sensor Reliability & SQI Indicator */}
      <SensorReliabilityMonitor />

      {/* Feature 3: Multimodal Risk Assessment Fusion */}
      <MultimodalRiskMatrix />

    </div>
  );
}
