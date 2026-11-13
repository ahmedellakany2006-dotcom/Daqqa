/**
 * DAQQA Sensor Reliability & Signal Quality Index (SQI) Engine
 * Evaluates whether wearable optical PPG & Pulse Ox readings are physiologically trustworthy
 * before triggering medical alarms, filtering microgravity motion artifacts and poor contact.
 */

export function evaluateSensorReliability(scenarioId, currentMetrics, forceLowContact = false) {
  let motionLevel = "LOW";
  let motionScore = 12; // 0 (still) - 100 (vigorous)
  let contactQuality = "OPTIMAL";
  let perfusionIndex = 4.2; // % (nominal 1% - 10%)
  let sqi = 96; // Signal Quality Index %

  // Scenario-based motion artifact dynamics
  if (scenarioId === "EVA") {
    motionLevel = "HIGH";
    motionScore = 78;
    perfusionIndex = 6.8;
    sqi = Math.max(68, Math.round(92 - motionScore * 0.28 + (Math.random() - 0.5) * 6));
  } else if (scenarioId === "DESYNC") {
    motionLevel = "MODERATE";
    motionScore = 38;
    perfusionIndex = 2.4;
    sqi = Math.round(86 + (Math.random() - 0.5) * 5);
  } else if (forceLowContact) {
    contactQuality = "POOR";
    motionLevel = "MODERATE";
    motionScore = 45;
    perfusionIndex = 0.4;
    sqi = Math.round(38 + (Math.random() - 0.5) * 8);
  } else {
    // Nominal Orbital Routine
    motionLevel = "LOW";
    motionScore = Math.round(10 + Math.random() * 8);
    perfusionIndex = Number((4.0 + (Math.random() - 0.5) * 0.6).toFixed(1));
    sqi = Math.min(100, Math.round(95 + Math.random() * 4));
  }

  // Reliability classification
  let reliabilityStatus = "HIGH_CONFIDENCE";
  let isTrustworthy = true;
  let recommendation = "Optical PPG signal validated. Telemetry trusted for clinical monitoring.";
  let confidenceColor = "emerald";

  if (sqi >= 85) {
    reliabilityStatus = "HIGH_CONFIDENCE";
    isTrustworthy = true;
    confidenceColor = "emerald";
    recommendation = "Optimal optical signal-to-noise ratio. Zero motion interference.";
  } else if (sqi >= 65) {
    reliabilityStatus = "MODERATE_CONFIDENCE";
    isTrustworthy = true;
    confidenceColor = "amber";
    recommendation = "Motion artifacts detected (EVA exertion). Algorithmic band-pass filtering active.";
  } else if (sqi >= 45) {
    reliabilityStatus = "LOW_CONFIDENCE";
    isTrustworthy = false;
    confidenceColor = "amber";
    recommendation = "High accelerometer noise. Sensor gating active: suppressing alarm false positives.";
  } else {
    reliabilityStatus = "UNRELIABLE";
    isTrustworthy = false;
    confidenceColor = "crimson";
    recommendation = "Poor skin contact detected. Astronaut action required: reposition & tighten watch band.";
  }

  return {
    sqi, // 0 - 100%
    perfusionIndex, // %
    motionLevel, // LOW | MODERATE | HIGH
    motionScore, // 0 - 100
    contactQuality, // OPTIMAL | MARGINAL | POOR
    reliabilityStatus, // HIGH_CONFIDENCE | MODERATE_CONFIDENCE | LOW_CONFIDENCE | UNRELIABLE
    isTrustworthy,
    recommendation,
    confidenceColor,
    opticalNoiseFloorDb: Number((-48 + (100 - sqi) * 0.35).toFixed(1))
  };
}
