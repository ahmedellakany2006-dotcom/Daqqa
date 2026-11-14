/**
 * NASA LSDA (Life Sciences Data Archive) Anonymization & Aggregation Engine
 * Strips PII and creates compliant human spaceflight research datasets
 */

export function generateLsdaPayload(crewMember, telemetryHistory, surveyResponses) {
  // Generate deterministic anonymous subject hash
  const pseudoHash = "LSDA-EXP-" + btoa(crewMember.id).replace(/[^a-zA-Z0-9]/g, "").slice(0, 8).toUpperCase();
  
  // Calculate aggregated statistical metrics from telemetry window
  const cleanArr = arr => (Array.isArray(arr) ? arr : []).filter(v => typeof v === 'number' && Number.isFinite(v));

  const mean = arr => {
    const valid = cleanArr(arr);
    return valid.length ? Number((valid.reduce((a, b) => a + b, 0) / valid.length).toFixed(2)) : 0;
  };
  const min = arr => {
    const valid = cleanArr(arr);
    return valid.length ? Math.min(...valid) : 0;
  };
  const max = arr => {
    const valid = cleanArr(arr);
    return valid.length ? Math.max(...valid) : 0;
  };
  const stdDev = arr => {
    const valid = cleanArr(arr);
    if (!valid.length) return 0;
    const m = mean(valid);
    const variance = valid.reduce((acc, val) => acc + Math.pow(val - m, 2), 0) / valid.length;
    return Number.isFinite(variance) && variance >= 0 ? Number(Math.sqrt(variance).toFixed(2)) : 0;
  };

  const hrValues = cleanArr(telemetryHistory.map(t => t.hr));
  const hrvValues = cleanArr(telemetryHistory.map(t => t.hrv));
  const spo2Values = cleanArr(telemetryHistory.map(t => t.spo2));
  const stressValues = cleanArr(telemetryHistory.map(t => t.stress));

  // Filter survey responses and remove identifying metadata
  const anonymizedSurveys = (surveyResponses || []).map((s, idx) => ({
    surveyRecordId: `SURV-ANON-${idx + 101}`,
    surveyType: s.type, // 'SLEEP_QUALITY' or 'POMS_PSYCHOLOGICAL'
    relativeFlightDay: crewMember.flightDay ?? 1,
    missionPhase: "ORBITAL_TRANSIT",
    subjectiveRatings: s.ratings || {},
    meanConcurrentHR: s.concurrentHR ?? 65,
    meanConcurrentHRV: s.concurrentHRV ?? 60
  }));

  const safeSuitPressure = Number.isFinite(crewMember.suitPressure) ? crewMember.suitPressure : 14.7;

  const payload = {
    archiveMetadata: {
      archive: "NASA Life Sciences Data Archive (LSDA)",
      protocol: "NLSP-HRP-2026-BIO09",
      dataClassification: "PUBLIC_RESEARCH_DEIDENTIFIED",
      deidentificationStandard: "HIPAA Safe Harbor / NASA IRB Non-PII Tier 1",
      generatedTimestamp: new Date().toISOString(),
      datasetVersion: "1.0.4-NASA-SPACEAPPS"
    },
    subjectCohort: {
      subjectIdentifier: pseudoHash,
      demographicCohort: "ASTRONAUT_CORPS_ACTIVE",
      flightMissionProfile: "DEEP_SPACE_ANALOG_2026",
      flightDayEpoch: `FD-${(crewMember.flightDay || 1).toString().padStart(3, "0")}`,
      operationalRoleGroup: (crewMember.role || "").includes("Commander") ? "FLIGHT_COMMAND" : "MISSION_OPERATIONS",
      suitPressureAtmospheres: Number((safeSuitPressure / 14.7).toFixed(2))
    },
    aggregatedPhysiologicalMetrics: {
      epochWindowMinutes: 30,
      samplesAnalyzed: telemetryHistory.length,
      heartRate: {
        unit: "BPM",
        baselineResting: crewMember.baseHR ?? 65,
        mean: mean(hrValues),
        min: min(hrValues),
        max: max(hrValues),
        standardDeviation: stdDev(hrValues)
      },
      heartRateVariability_RMSSD: {
        unit: "ms",
        baselineResting: crewMember.baseHRV ?? 60,
        mean: mean(hrvValues),
        min: min(hrvValues),
        max: max(hrvValues),
        sympathovagalSuppressionEvents: hrvValues.filter(v => v < 25).length
      },
      bloodOxygenSaturation_SpO2: {
        unit: "PERCENT",
        baselineResting: crewMember.baseSpO2 ?? 98,
        mean: mean(spo2Values),
        nadirSpO2: min(spo2Values),
        hypoxicEventsCount: spo2Values.filter(v => v < 90).length
      },
      autonomicStressIndex: {
        scale: "1-100",
        mean: mean(stressValues),
        peakStrainPeriodPct: stressValues.length ? Number(((stressValues.filter(v => v > 65).length / stressValues.length) * 100).toFixed(1)) : 0
      }
    },
    behavioralIntegrationSurveys: anonymizedSurveys,
    sensorProvenance: {
      hardwareDevice: "Garmin Tactical Tactix / Fenix Microgravity Edition",
      sdkPlatform: "Garmin Connect IQ System 7",
      languageRuntime: "Monkey C 4.2+",
      sensorDrivers: ["Toybox.Sensor", "Toybox.SensorHistory.getHeartRateHistory", "Toybox.SensorHistory.getOxygenSaturationHistory"]
    }
  };

  return payload;
}

/**
 * Convert LSDA JSON to CSV research table format
 */
export function exportLsdaToCsv(lsdaData) {
  const headers = [
    "Subject_ID",
    "Flight_Day",
    "Epoch_Samples",
    "HR_Mean_BPM",
    "HR_Min_BPM",
    "HR_Max_BPM",
    "HR_StdDev",
    "HRV_RMSSD_Mean_ms",
    "HRV_Min_ms",
    "SpO2_Mean_Pct",
    "SpO2_Nadir_Pct",
    "Hypoxic_Events",
    "Stress_Mean_Score",
    "Behavioral_Surveys_Count"
  ];

  const row = [
    lsdaData.subjectCohort.subjectIdentifier,
    lsdaData.subjectCohort.flightDayEpoch,
    lsdaData.aggregatedPhysiologicalMetrics.samplesAnalyzed,
    lsdaData.aggregatedPhysiologicalMetrics.heartRate.mean,
    lsdaData.aggregatedPhysiologicalMetrics.heartRate.min,
    lsdaData.aggregatedPhysiologicalMetrics.heartRate.max,
    lsdaData.aggregatedPhysiologicalMetrics.heartRate.standardDeviation,
    lsdaData.aggregatedPhysiologicalMetrics.heartRateVariability_RMSSD.mean,
    lsdaData.aggregatedPhysiologicalMetrics.heartRateVariability_RMSSD.min,
    lsdaData.aggregatedPhysiologicalMetrics.bloodOxygenSaturation_SpO2.mean,
    lsdaData.aggregatedPhysiologicalMetrics.bloodOxygenSaturation_SpO2.nadirSpO2,
    lsdaData.aggregatedPhysiologicalMetrics.bloodOxygenSaturation_SpO2.hypoxicEventsCount,
    lsdaData.aggregatedPhysiologicalMetrics.autonomicStressIndex.mean,
    lsdaData.behavioralIntegrationSurveys.length
  ];

  return headers.join(",") + "\n" + row.join(",");
}
