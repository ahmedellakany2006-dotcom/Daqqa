/**
 * DAQQA Dashboard CSV Data Extraction Engine
 * Converts comprehensive astronaut telemetry, personalized anomaly scores, sensor reliability,
 * and multimodal risk indicators into clean, standardized CSV files for researchers and flight surgeons.
 */

export function exportDashboardTelemetryToCsv(astronaut, telemetryHistory, personalizedAnomaly, sensorReliability, multimodalRisk, trendForecast, surveyHistory) {
  const headers = [
    "Timestamp_UTC",
    "Astronaut_ID",
    "Astronaut_Name",
    "Flight_Day",
    "Heart_Rate_BPM",
    "HR_Baseline_BPM",
    "HR_ZScore",
    "SpO2_Percent",
    "SpO2_Baseline_Percent",
    "SpO2_ZScore",
    "HRV_RMSSD_ms",
    "HRV_Baseline_ms",
    "HRV_ZScore",
    "Autonomic_Stress_Index",
    "Muscle_Fatigue_Index",
    "Skin_Temperature_C",
    "Signal_Quality_Index_Pct",
    "Sensor_Reliability_Status",
    "Motion_Artifact_Level",
    "Perfusion_Index_Pct",
    "Subjective_Sleep_Quality",
    "Subjective_POMS_Focus",
    "Multimodal_Risk_Score_MMRS",
    "Clinical_Syndrome_Diagnosis",
    "Predicted_Recovery_Index_24h",
    "Deterioration_Probability_24h_Pct"
  ];

  const sleepSurvey = surveyHistory.find(s => s.type === "SLEEP_QUALITY");
  const pomsSurvey = surveyHistory.find(s => s.type === "POMS_PSYCHOLOGICAL");
  const sleepVal = sleepSurvey?.ratings?.sleepQuality ?? 4;
  const focusVal = pomsSurvey?.ratings?.focusScore ?? 4;

  const rows = telemetryHistory.map((tick) => {
    return [
      tick.timestamp,
      astronaut.id,
      `"${astronaut.name}"`,
      astronaut.flightDay,
      tick.hr,
      personalizedAnomaly.baseline.restingHR.mean,
      personalizedAnomaly.zScores.hr,
      tick.spo2,
      personalizedAnomaly.baseline.spo2Pct.mean,
      personalizedAnomaly.zScores.spo2,
      tick.hrv,
      personalizedAnomaly.baseline.hrvRMSSD.mean,
      personalizedAnomaly.zScores.hrv,
      tick.stress,
      tick.fatigue,
      tick.skinTemp,
      sensorReliability.sqi,
      sensorReliability.reliabilityStatus,
      sensorReliability.motionLevel,
      sensorReliability.perfusionIndex,
      sleepVal,
      focusVal,
      multimodalRisk.mmrs,
      `"${multimodalRisk.syndromeLabel}"`,
      trendForecast.forecastPoints.find(p => p.hour === "+24h")?.predictedRecovery ?? trendForecast.currentRecoveryIndex,
      trendForecast.deteriorationProb24h
    ].join(",");
  });

  return headers.join(",") + "\n" + rows.join("\n");
}

/**
 * Triggers browser download of CSV string
 */
export function downloadCsvFile(csvContent, filename) {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
