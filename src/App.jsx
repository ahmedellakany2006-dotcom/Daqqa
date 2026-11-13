import React, { useState } from 'react';
import { MissionProvider } from './context/MissionContext';
import Header from './components/layout/Header';
import Navigation from './components/layout/Navigation';
import ScenarioControls from './components/layout/ScenarioControls';
import GarminWatchFrame from './components/watch/GarminWatchFrame';
import RealtimeECGCanvas from './components/telemetry/RealtimeECGCanvas';
import CrewRoster from './components/telemetry/CrewRoster';
import BiometricCharts from './components/telemetry/BiometricCharts';
import AnomalyDetector from './components/telemetry/AnomalyDetector';
import EnvironmentalHUD from './components/telemetry/EnvironmentalHUD';
import DualExportHub from './components/export/DualExportHub';
import CodeViewer from './components/monkeyc/CodeViewer';
import ProjectBrief from './components/about/ProjectBrief';
import { Activity, Watch, ShieldAlert, HeartHandshake } from 'lucide-react';

function AppContent() {
  const [activeTab, setActiveTab] = useState('simulator'); // 'simulator' | 'ground' | 'export' | 'code' | 'about'

  return (
    <div className="min-h-screen flex flex-col bg-[#050914] text-slate-100 aerospace-grid">
      
      {/* Top Header */}
      <Header />

      {/* Main Tab Navigation */}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Central Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Scenario Controls (Always readily accessible to simulate conditions) */}
        <ScenarioControls />

        {/* Tab 1: Garmin Smartwatch Simulator */}
        {activeTab === 'simulator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Physical Tactical Watch */}
            <div className="lg:col-span-6 bg-[#0B1120] border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col items-center justify-center">
              <div className="text-center mb-2">
                <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-full border border-cyan-800/80 uppercase">
                  Astronaut Wearable Hardware Unit
                </span>
                <h3 className="text-sm font-semibold text-slate-200 mt-1">
                  Garmin tactix 7 / fenix 7 (Connect IQ System 7)
                </h3>
              </div>

              <GarminWatchFrame />
            </div>

            {/* Right Column: Live Physiological Feedback & Quick Stats */}
            <div className="lg:col-span-6 space-y-5">
              <RealtimeECGCanvas />
              <AnomalyDetector />
              <EnvironmentalHUD />
            </div>

          </div>
        )}

        {/* Tab 2: Ground Station / Flight Surgeon HUD */}
        {activeTab === 'ground' && (
          <div className="space-y-6">
            <CrewRoster />
            <RealtimeECGCanvas />
            <BiometricCharts />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AnomalyDetector />
              <EnvironmentalHUD />
            </div>
          </div>
        )}

        {/* Tab 3: NASA Dual-Export Hub (LSDA & LSAH) */}
        {activeTab === 'export' && (
          <DualExportHub />
        )}

        {/* Tab 4: Garmin Connect IQ Monkey C Source Code */}
        {activeTab === 'code' && (
          <CodeViewer />
        )}

        {/* Tab 5: Mission & Challenge Overview */}
        {activeTab === 'about' && (
          <ProjectBrief />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#070D18]/90 py-5 px-4 text-center text-xs font-mono text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 font-bold">DAQQA (دقة)</span>
            <span>•</span>
            <span>2026 NASA Space Apps Challenge</span>
            <span>•</span>
            <span className="text-slate-300">Software for Healthcare Track</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Garmin Connect IQ • Monkey C • NASA LSDA & LSAH Dual Integration Architecture
          </div>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <MissionProvider>
      <AppContent />
    </MissionProvider>
  );
}
