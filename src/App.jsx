import React, { useState } from 'react';
import { MissionProvider } from './context/MissionContext';
import Header from './components/layout/Header';
import Navigation from './components/layout/Navigation';
import ScenarioControls from './components/layout/ScenarioControls';
import RocketBackground from './components/layout/RocketBackground';
import GarminWatchFrame from './components/watch/GarminWatchFrame';
import RealtimeECGCanvas from './components/telemetry/RealtimeECGCanvas';
import CrewRoster from './components/telemetry/CrewRoster';
import BiometricCharts from './components/telemetry/BiometricCharts';
import AnomalyDetector from './components/telemetry/AnomalyDetector';
import EnvironmentalHUD from './components/telemetry/EnvironmentalHUD';
import DualExportHub from './components/export/DualExportHub';
import CodeViewer from './components/monkeyc/CodeViewer';
import ProjectBrief from './components/about/ProjectBrief';
import { Activity, Watch, ShieldAlert, HeartHandshake, Rocket } from 'lucide-react';

function AppContent() {
  const [activeTab, setActiveTab] = useState('simulator'); // 'simulator' | 'ground' | 'export' | 'code' | 'about'

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-800 aerospace-light-grid relative">
      
      {/* Background Aerospace Rockets & Orbital Trajectories */}
      <RocketBackground />

      {/* Top Header */}
      <Header />

      {/* Main Tab Navigation */}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Central Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8 relative z-10">
        
        {/* Scenario Controls (NASA Flight Protocol Simulator) */}
        <ScenarioControls />

        {/* Tab 1: Garmin Smartwatch Simulator (BIGGER WATCH CENTERED + DASHBOARD UNDER IT) */}
        {activeTab === 'simulator' && (
          <div className="space-y-8">
            
            {/* BIGGER SMARTWATCH PROMINENTLY IN THE MIDDLE OF THE SCREEN */}
            <section className="bg-white/90 border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-sm backdrop-blur-md flex flex-col items-center justify-center text-center relative overflow-hidden">
              
              {/* Header Label */}
              <div className="mb-4">
                <span className="text-xs font-mono font-extrabold text-sky-800 bg-sky-100 px-3.5 py-1.5 rounded-full border border-sky-300 uppercase tracking-wider inline-flex items-center gap-1.5 shadow-xs">
                  <Rocket className="w-3.5 h-3.5 text-sky-700" />
                  <span>Astronaut Wearable Hardware Unit</span>
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-mono mt-2">
                  Garmin tactix 7 / fenix 7 Spaceflight Edition
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto mt-1 font-medium">
                  Connect IQ System 7 • Interactive 5-Button Tactical Interface with Autonomous Blackout Alarms & Task UI
                </p>
              </div>

              {/* The Big Watch Frame */}
              <GarminWatchFrame />

            </section>

            {/* DASHBOARD DIRECTLY UNDER THE SMARTWATCH */}
            <section className="space-y-6">
              
              <div className="flex items-center gap-2 pt-2">
                <div className="h-0.5 flex-1 bg-slate-200" />
                <span className="text-xs font-mono font-extrabold text-slate-500 uppercase tracking-widest px-3">
                  Telemetry & Mission Control Telemetry Dashboard
                </span>
                <div className="h-0.5 flex-1 bg-slate-200" />
              </div>

              {/* 1. Real-time Lead II ECG Canvas */}
              <RealtimeECGCanvas />

              {/* 2. Multi-Channel Continuous Telemetry Charts (HR, SpO2, HRV, Stress) */}
              <BiometricCharts />

              {/* 3. Anomaly Detector & Environmental Status */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AnomalyDetector />
                <EnvironmentalHUD />
              </div>

              {/* 4. Active Crew Biometric Roster */}
              <CrewRoster />

            </section>

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
      <footer className="border-t border-slate-200/90 bg-white/95 py-6 px-4 text-center text-xs font-mono text-slate-500 relative z-10 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sky-700 font-extrabold">DAQQA (دقة)</span>
            <span>•</span>
            <span className="text-slate-800 font-semibold">2026 NASA Space Apps Challenge</span>
            <span>•</span>
            <span className="text-sky-800 font-bold bg-sky-100 px-2 py-0.5 rounded border border-sky-200">
              Healthcare Track
            </span>
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            Garmin Connect IQ • Monkey C 4.2+ • NASA LSDA & LSAH Dual Integration Architecture
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
