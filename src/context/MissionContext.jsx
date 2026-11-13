import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_CREW, MISSION_SCENARIOS, generateSensorTick } from '../utils/sensorSimulator';
import { evaluatePersonalizedAnomaly } from '../utils/personalizedAnomaly';
import { evaluateSensorReliability } from '../utils/sensorReliability';
import { computeMultimodalRisk } from '../utils/multimodalRisk';
import { computePredictiveTrendForecast } from '../utils/predictiveForecasting';
import { exportDashboardTelemetryToCsv, exportHRActivityAnalysisCsv, downloadCsvFile } from '../utils/dashboardCsvExporter';

const MissionContext = createContext();

export function MissionProvider({ children }) {
  const [crew, setCrew] = useState(INITIAL_CREW);
  const [activeAstronautId, setActiveAstronautId] = useState("ASTRO-01");
  const [activeScenario, setActiveScenario] = useState("NOMINAL");
  const [isCommBlackout, setIsCommBlackout] = useState(false);
  const [isBurstSyncing, setIsBurstSyncing] = useState(false);
  const [activeWristAlert, setActiveWristAlert] = useState(null);
  const [simulateLowContact, setSimulateLowContact] = useState(false);
  const [manualMetsOverride, setManualMetsOverride] = useState(null);
  
  // Historical telemetry log per astronaut
  const [telemetryLogs, setTelemetryLogs] = useState(() => {
    const initial = {};
    INITIAL_CREW.forEach(a => {
      const initialTick = {
        timestamp: new Date().toISOString(),
        epoch: Date.now(),
        hr: a.current.hr,
        hrv: a.current.hrv,
        spo2: a.current.spo2,
        stress: a.current.stress,
        fatigue: a.current.fatigue,
        skinTemp: a.current.skinTemp,
        respiration: a.current.respiration,
        status: a.current.status,
        isAlert: false,
        alertMessage: null
      };
      initial[a.id] = [initialTick];
    });
    return initial;
  });

  // Offline buffer packet counts per astronaut (Monkey C Storage)
  const [storageBuffers, setStorageBuffers] = useState({
    "ASTRO-01": 14,
    "ASTRO-02": 8,
    "ASTRO-03": 21,
    "ASTRO-04": 11
  });

  // Behavioral survey responses
  const [surveyHistory, setSurveyHistory] = useState([
    {
      id: "SURV-INIT-01",
      astronautId: "ASTRO-01",
      type: "SLEEP_QUALITY",
      timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
      ratings: {
        sleepQuality: 4,
        sleepLatencyMin: 12,
        nightAwakenings: 1,
        morningGrogginess: 2,
        notes: "Good rest in sleep pod B. Sound masking functional."
      },
      concurrentHR: 58,
      concurrentHRV: 72
    },
    {
      id: "SURV-INIT-02",
      astronautId: "ASTRO-01",
      type: "POMS_PSYCHOLOGICAL",
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      ratings: {
        focusScore: 5,
        moodValence: 4,
        muscleFatigue: 2,
        anxietyLevel: 1,
        notes: "Ready for robotic arm inspection cycle."
      },
      concurrentHR: 62,
      concurrentHRV: 68
    }
  ]);

  const activeAstronaut = crew.find(a => a.id === activeAstronautId) || crew[0];
  const activeLogs = telemetryLogs[activeAstronautId] || [];

  // Continuous sensor loop (simulating 1Hz watch polling)
  useEffect(() => {
    const timer = setInterval(() => {
      setCrew(prevCrew => {
        return prevCrew.map(astro => {
          const prevLog = telemetryLogs[astro.id] || [];
          const lastTick = prevLog[prevLog.length - 1] || astro.current;
          
          const scen = (astro.id === activeAstronautId) ? activeScenario : "NOMINAL";
          const metsOverride = (astro.id === activeAstronautId) ? manualMetsOverride : null;
          const newTick = generateSensorTick(astro, scen, lastTick, isCommBlackout, metsOverride);

          setTelemetryLogs(prevLogs => {
            const currentAstroLogs = prevLogs[astro.id] || [];
            const updated = [...currentAstroLogs.slice(-50), newTick];
            return { ...prevLogs, [astro.id]: updated };
          });

          if (isCommBlackout || MISSION_SCENARIOS[activeScenario]?.isBlackout) {
            setStorageBuffers(prev => ({
              ...prev,
              [astro.id]: (prev[astro.id] || 0) + 1
            }));
          }

          if (astro.id === activeAstronautId && newTick.isAlert) {
            setActiveWristAlert({
              astronautName: astro.name,
              message: newTick.alertMessage,
              timestamp: new Date().toLocaleTimeString(),
              severity: newTick.status.includes("CRITICAL") ? "critical" : "warning",
              status: newTick.status
            });
          }

          return {
            ...astro,
            current: {
              ...newTick,
              storagePacketsCached: storageBuffers[astro.id] || 0
            }
          };
        });
      });
    }, 1200);

    return () => clearInterval(timer);
  }, [activeAstronautId, activeScenario, isCommBlackout, telemetryLogs, storageBuffers, manualMetsOverride]);

  // Derived Advanced Health Intelligence
  const personalizedAnomaly = evaluatePersonalizedAnomaly(activeAstronautId, activeAstronaut.current);
  const sensorReliability = evaluateSensorReliability(activeScenario, activeAstronaut.current, simulateLowContact);
  const multimodalRisk = computeMultimodalRisk(personalizedAnomaly, sensorReliability, surveyHistory, activeAstronaut.current);
  const trendForecast = computePredictiveTrendForecast(activeAstronaut, activeLogs, multimodalRisk, personalizedAnomaly);

  // Scenario switch handler
  const setScenario = (scenarioId) => {
    setActiveScenario(scenarioId);
    const scen = MISSION_SCENARIOS[scenarioId];
    if (scen?.isBlackout) {
      setIsCommBlackout(true);
    } else if (scenarioId === "NOMINAL") {
      setIsCommBlackout(false);
    }
  };

  // Toggle Loss of Signal (LOS) vs Acquisition of Signal (AOS)
  const toggleCommStatus = () => {
    if (isCommBlackout) {
      flushStorageBuffers();
      setIsCommBlackout(false);
    } else {
      setIsCommBlackout(true);
    }
  };

  // Toggle Low Contact / Poor Snugness Simulation
  const toggleLowContactSimulation = () => {
    setSimulateLowContact(prev => !prev);
  };

  // Flush offline storage buffers with high speed burst animation
  const flushStorageBuffers = () => {
    setIsBurstSyncing(true);
    setTimeout(() => {
      setStorageBuffers({
        "ASTRO-01": 0,
        "ASTRO-02": 0,
        "ASTRO-03": 0,
        "ASTRO-04": 0
      });
      setIsBurstSyncing(false);
    }, 1800);
  };

  // Submit on-watch behavioral survey
  const submitSurvey = (surveyData) => {
    const lastTick = activeLogs[activeLogs.length - 1] || activeAstronaut.current;

    const newRecord = {
      id: `SURV-${Date.now().toString().slice(-6)}`,
      astronautId: activeAstronautId,
      timestamp: new Date().toISOString(),
      type: surveyData.type,
      ratings: surveyData.ratings,
      concurrentHR: lastTick.hr,
      concurrentHRV: lastTick.hrv
    };

    setSurveyHistory(prev => [newRecord, ...prev]);

    setStorageBuffers(prev => ({
      ...prev,
      [activeAstronautId]: (prev[activeAstronautId] || 0) + 1
    }));
  };

  const dismissWristAlert = () => {
    setActiveWristAlert(null);
  };

  // High-Precision Clean CSV Telemetry Exporter
  const exportTelemetryCsv = (mode = "full") => {
    if (mode === "hr-activity") {
      const baseRHR = personalizedAnomaly?.baseline?.restingHR?.mean ?? activeAstronaut.baseHR ?? 62;
      const csvData = exportHRActivityAnalysisCsv(activeAstronaut, activeLogs, baseRHR);
      const filename = `DAQQA_HR_vs_Activity_${activeAstronaut.id}_FD${activeAstronaut.flightDay}.csv`;
      downloadCsvFile(csvData, filename);
      return filename;
    }

    const csvData = exportDashboardTelemetryToCsv(
      activeAstronaut,
      activeLogs,
      personalizedAnomaly,
      sensorReliability,
      multimodalRisk,
      trendForecast,
      surveyHistory
    );
    const filename = `DAQQA_Synchronous_Telemetry_${activeAstronaut.id}_FD${activeAstronaut.flightDay}.csv`;
    downloadCsvFile(csvData, filename);
    return filename;
  };

  return (
    <MissionContext.Provider
      value={{
        crew,
        activeAstronaut,
        activeAstronautId,
        setActiveAstronautId,
        activeScenario,
        setScenario,
        isCommBlackout,
        toggleCommStatus,
        isBurstSyncing,
        flushStorageBuffers,
        telemetryLogs,
        storageBuffers,
        surveyHistory,
        submitSurvey,
        activeWristAlert,
        dismissWristAlert,
        // Advanced Health Intelligence Features
        personalizedAnomaly,
        sensorReliability,
        multimodalRisk,
        trendForecast,
        simulateLowContact,
        toggleLowContactSimulation,
        manualMetsOverride,
        setManualMetsOverride,
        exportTelemetryCsv
      }}
    >
      {children}
    </MissionContext.Provider>
  );
}

export function useMission() {
  const context = useContext(MissionContext);
  if (!context) {
    throw new Error("useMission must be used within a MissionProvider");
  }
  return context;
}
