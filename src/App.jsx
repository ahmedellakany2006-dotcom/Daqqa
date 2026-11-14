import React, { useState } from 'react';
import { MissionProvider } from './context/MissionContext';
import Header from './components/layout/Header';
import Navigation from './components/layout/Navigation';
import ScenarioControls from './components/layout/ScenarioControls';
import GalaxyBackground from './components/layout/GalaxyBackground';
import GarminWatchFrame from './components/watch/GarminWatchFrame';
import RealtimeECGCanvas from './components/telemetry/RealtimeECGCanvas';
import CrewRoster from './components/telemetry/CrewRoster';
import BiometricCharts from './components/telemetry/BiometricCharts';
import AnomalyDetector from './components/telemetry/AnomalyDetector';
import EnvironmentalHUD from './components/telemetry/EnvironmentalHUD';
import DualExportHub from './components/export/DualExportHub';
import CodeViewer from './components/monkeyc/CodeViewer';
import ProjectBrief from './components/about/ProjectBrief';
import AstronautHealthDashboard from './components/dashboard/AstronautHealthDashboard';
import { Activity, Watch, ShieldAlert, HeartHandshake, Rocket, BrainCircuit, Sparkles } from 'lucide-react';

function AppContent() {
  const [activeTab, setActiveTab] = useState('simulator'); // 'simulator' | 'intelligence' | 'ground' | 'export' | 'code' | 'about'

  return (
    <div className="min-h-screen flex flex-col bg-[#030712] text-slate-100 galaxy-deep-space relative selection:bg-cyan-500 selection:text-black">
      
      {/* Background Cosmic Galaxy & Scroll-Responsive Planetary Systems */}
      <GalaxyBackground activeTab={activeTab} />

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
            
            {/* BIGGER SMARTWATCH PROMINENTLY IN THE MIDDLE OF THE SCREEN OVER PLANETARY HORIZON */}
            <section className="galaxy-glass-card rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl flex flex-col items-center justify-center text-center relative overflow-hidden border border-slate-700/70">
              
              {/* Header Label */}
              <div className="mb-4">
                <span className="text-xs font-mono font-extrabold text-cyan-300 bg-cyan-950/80 px-3.5 py-1.5 rounded-full border border-cyan-500/40 uppercase tracking-wider inline-flex items-center gap-1.5 shadow-sm shadow-cyan-500/20">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Astronaut Wearable Hardware Unit • Orbit Station LEO</span>
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white font-mono mt-2 drop-shadow-md">
                  Garmin tactix 7 / fenix 7 Spaceflight Edition
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto mt-1 font-medium">
                  Connect IQ System 7 • Interactive 5-Button Tactical Interface with Autonomous Blackout Alarms & Task UI
                </p>
              </div>

              {/* The Big Watch Frame */}
              <GarminWatchFrame />

            </section>

            {/* DASHBOARD DIRECTLY UNDER THE SMARTWATCH */}
            <section className="space-y-6">
              
              <div className="flex items-center gap-2 pt-2">
                <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
                <span className="text-xs font-mono font-extrabold text-cyan-400 uppercase tracking-widest px-3 flex items-center gap-1.5">
                  <Rocket className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Astronaut Health Intelligence & Telemetry Dashboard</span>
                </span>
                <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
              </div>

              {/* 5 Core Features: Personalized Baselines, SQI, Multimodal Risk, Trend Forecast & CSV Export */}
              <AstronautHealthDashboard />

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

        {/* Tab 2: Dedicated Health Intelligence (Personalized AI & CSV Extraction) */}
        {activeTab === 'intelligence' && (
          <AstronautHealthDashboard />
        )}

        {/* Tab 3: Ground Station / Flight Surgeon HUD */}
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
      <footer className="border-t border-slate-800/80 bg-slate-950/90 backdrop-blur-md py-6 px-4 text-center text-xs font-mono text-slate-400 relative z-10 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 font-extrabold tracking-wider">DAQQA (دِقَّة)</span>
            <span>•</span>
            <span className="text-slate-200 font-semibold">2026 NASA Space Apps Challenge</span>
            <span>•</span>
            <span className="text-cyan-300 font-bold bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
              Healthcare Track
            </span>
          </div>
          <div className="text-[11px] text-slate-400 font-medium">
            Garmin Connect IQ System 7 • Monkey C 4.2+ • NASA LSDA & LSAH Galaxy Architecture
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
