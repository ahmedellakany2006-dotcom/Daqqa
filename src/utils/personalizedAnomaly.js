/**
 * DAQQA Personalized Anomaly Detection Engine
 * Learns individual astronaut physiological baselines and detects statistically
 * significant deviations using standardized z-scores rather than static thresholds.
 */

export const CREW_BASELINES = {
  "ASTRO-01": {
    name: "Dr. Elena Rostova",
    role: "Commander",
    restingHR: { mean: 62.4, stdDev: 4.8 },
    hrvRMSSD: { mean: 68.2, stdDev: 7.1 },
    spo2Pct: { mean: 98.4, stdDev: 0.6 },
    stressIndex: { mean: 22.0, stdDev: 5.5 },
    circadianPhaseOffsetHours: 0.0
  },
  "ASTRO-02": {
    name: "Marcus Vance",
    role: "Flight Engineer",
    restingHR: { mean: 70.2, stdDev: 5.4 },
    hrvRMSSD: { mean: 55.0, stdDev: 6.8 },
    spo2Pct: { mean: 97.6, stdDev: 0.7 },
    stressIndex: { mean: 32.0, stdDev: 6.2 },
    circadianPhaseOffsetHours: -0.5
  },
  "ASTRO-03": {
    name: "Dr. Kenji Sato",
    role: "Science Specialist",
    restingHR: { mean: 58.1, stdDev: 4.2 },
    hrvRMSSD: { mean: 74.0, stdDev: 8.0 },
    spo2Pct: { mean: 99.0, stdDev: 0.5 },
    stressIndex: { mean: 18.5, stdDev: 4.8 },
    circadianPhaseOffsetHours: +0.5
  },
  "ASTRO-04": {
    name: "Amina Al-Mansoor",
    role: "Mission Specialist",
    restingHR: { mean: 65.8, stdDev: 4.6 },
    hrvRMSSD: { mean: 62.5, stdDev: 6.5 },
    spo2Pct: { mean: 98.1, stdDev: 0.6 },
    stressIndex: { mean: 26.0, stdDev: 5.2 },
    circadianPhaseOffsetHours: 0.0
  }
};

/**
 * Calculate z-score: z = (value - mean) / stdDev
 */
export function calculateZScore(value, mean, stdDev) {
  if (!stdDev || stdDev === 0) return 0;
  return Number(((value - mean) / stdDev).toFixed(2));
}

/**
 * Evaluate personalized deviations for current reading
 */
export function evaluatePersonalizedAnomaly(astronautId, currentMetrics) {
  const baseline = CREW_BASELINES[astronautId] || CREW_BASELINES["ASTRO-01"];

  const hrZ = calculateZScore(currentMetrics.hr, baseline.restingHR.mean, baseline.restingHR.stdDev);
  const hrvZ = calculateZScore(currentMetrics.hrv, baseline.hrvRMSSD.mean, baseline.hrvRMSSD.stdDev);
  const spo2Z = calculateZScore(currentMetrics.spo2, baseline.spo2Pct.mean, baseline.spo2Pct.stdDev);
  const stressZ = calculateZScore(currentMetrics.stress, baseline.stressIndex.mean, baseline.stressIndex.stdDev);

  // Personalized classification
  let isPersonalizedAnomaly = false;
  let severity = "NOMINAL";
  let diagnosticNarrative = "Physiological vitals align with individual baseline.";
  const flaggedMetrics = [];

  // HR deviation (|z| > 2.0 = moderate, |z| > 3.0 = severe)
  if (hrZ > 3.0) {
    isPersonalizedAnomaly = true;
    severity = "CRITICAL";
    flaggedMetrics.push(`HR +${hrZ}σ above personal baseline (${currentMetrics.hr} vs ${baseline.restingHR.mean.toFixed(1)} BPM)`);
  } else if (hrZ > 2.0) {
    isPersonalizedAnomaly = true;
    severity = severity === "CRITICAL" ? "CRITICAL" : "ELEVATED";
    flaggedMetrics.push(`HR +${hrZ}σ elevated`);
  }

  // HRV suppression (z < -2.0 = significant autonomic strain)
  if (hrvZ < -2.5) {
    isPersonalizedAnomaly = true;
    severity = severity === "CRITICAL" ? "CRITICAL" : "ELEVATED";
    flaggedMetrics.push(`HRV ${hrvZ}σ collapsed below rest baseline (${currentMetrics.hrv} vs ${baseline.hrvRMSSD.mean.toFixed(1)} ms)`);
  }

  // SpO2 drop (z < -3.0 or absolute < 90%)
  if (spo2Z < -3.0 || currentMetrics.spo2 < 90) {
    isPersonalizedAnomaly = true;
    severity = "CRITICAL";
    flaggedMetrics.push(`SpO2 ${spo2Z}σ nadir (${currentMetrics.spo2}% vs ${baseline.spo2Pct.mean.toFixed(1)}%)`);
  }

  if (isPersonalizedAnomaly) {
    diagnosticNarrative = `Personalized deviation detected: ${flaggedMetrics.join(" • ")}`;
  }

  return {
    baseline,
    zScores: {
      hr: hrZ,
      hrv: hrvZ,
      spo2: spo2Z,
      stress: stressZ
    },
    deltas: {
      hrDelta: Number((currentMetrics.hr - baseline.restingHR.mean).toFixed(1)),
      hrvDelta: Number((currentMetrics.hrv - baseline.hrvRMSSD.mean).toFixed(1)),
      spo2Delta: Number((currentMetrics.spo2 - baseline.spo2Pct.mean).toFixed(1))
    },
    isPersonalizedAnomaly,
    severity,
    flaggedMetrics,
    diagnosticNarrative
  };
}
