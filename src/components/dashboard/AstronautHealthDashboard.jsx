import React, { useState } from 'react';
import { useMission } from '../../context/MissionContext';
import BaselineDeviationHUD from './BaselineDeviationHUD';
import SensorReliabilityMonitor from './SensorReliabilityMonitor';
import MultimodalRiskMatrix from './MultimodalRiskMatrix';
import PredictiveTrendForecast from './PredictiveTrendForecast';
import { Download, Check, FileSpreadsheet, ShieldAlert, Sparkles, UserCheck } from 'lucide-react';

export default function AstronautHealthDashboard() {
  const { activeAstronaut, exportTelemetryCsv } = useMission();
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleCsvExport = () => {
    exportTelemetryCsv();
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 relative z-20">
      
      {/* Executive Command Banner */}
      <div className="bg-white/95 border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-sm backdrop-blur-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 font-mono font-bold border border-sky-300">
              NASA CLINICAL INTELLIGENCE
            </span>
            <span className="text-xs text-slate-500 font-mono font-medium">
              Spaceflight Health Monitoring
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
            Astronaut Health Intelligence Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
            Active Patient: <strong className="text-sky-800">{activeAstronaut.name}</strong> ({activeAstronaut.role} • {activeAstronaut.agency}) • Flight Day {activeAstronaut.flightDay}
          </p>
        </div>

        {/* Feature 5: Prominent CSV Extraction Button */}
        <button
          onClick={handleCsvExport}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2.5 shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
          title="Extract full telemetry, personalized baselines, SQI, and multimodal risk scores to CSV"
        >
          {downloadSuccess ? (
            <>
              <Check className="w-4 h-4 text-white" />
              <span>Extracted & Downloaded CSV!</span>
            </>
          ) : (
            <>
              <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
              <span>Extract & Export Health CSV</span>
            </>
          )}
        </button>
      </div>

      {/* Feature 1: Personalized Anomaly Detection */}
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
