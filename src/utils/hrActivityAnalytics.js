/**
 * DAQQA Cardiorespiratory Exertion & HR vs Activity Analytics Engine
 * Analyzes synchronous Pulse Oximetry (SpO2) and Heart Rate (HR) co-registration,
 * Activity Level (METs), Resting Heart Rate (RHR) baselines, and Exertion Concordance.
 */

// Spaceflight Activity Classification Table
export const ACTIVITY_CATEGORIES = {
  REST: {
    id: "REST",
    label: "Rest / Sleep",
    metsMin: 1.0,
    metsMax: 1.5,
    defaultMets: 1.1,
    intensityPct: 8,
    color: "#64748B",
    bgClass: "bg-slate-100 text-slate-700 border-slate-300",
    description: "Reclining in sleep pod or passive physiological rest. Basal metabolic demand."
  },
  LIGHT_IVA: {
    id: "LIGHT_IVA",
    label: "Light Intravehicular",
    metsMin: 1.6,
    metsMax: 2.9,
    defaultMets: 2.1,
    intensityPct: 24,
    color: "#0284C7",
    bgClass: "bg-sky-100 text-sky-800 border-sky-300",
    description: "Console operations, mission logging, meal prep, and light maintenance."
  },
  MODERATE_WORK: {
    id: "MODERATE_WORK",
    label: "Moderate Cargo / Ops",
    metsMin: 3.0,
    metsMax: 5.9,
    defaultMets: 4.2,
    intensityPct: 52,
    color: "#D97706",
    bgClass: "bg-amber-100 text-amber-800 border-amber-300",
    description: "Cargo transfer, robotic arm manipulation, manual payload assembly."
  },
  VIGOROUS_EVA: {
    id: "VIGOROUS_EVA",
    label: "Vigorous EVA / Countermeasure",
    metsMin: 6.0,
    metsMax: 9.5,
    defaultMets: 7.4,
    intensityPct: 85,
    color: "#DC2626",
    bgClass: "bg-rose-100 text-rose-800 border-rose-300",
    description: "Extravehicular spacewalk in pressurized suit, CEVIS cycle ergometer, or ARED workout."
  }
};

/**
 * Calculates Karvonen Expected Heart Rate for a given Activity Level (METs)
 * Based on learned resting HR baseline and estimated maximum HR for astronauts (typically ~185 - 195 bpm).
 */
export function calculateExpectedHR(baseRHR, currentMets, maxHR = 185) {
  const safeBaseRHR = (typeof baseRHR === 'number' && Number.isFinite(baseRHR)) ? baseRHR : 65;
  const safeMets = (typeof currentMets === 'number' && Number.isFinite(currentMets)) ? currentMets : 1.2;
  const safeMaxHR = (typeof maxHR === 'number' && Number.isFinite(maxHR)) ? maxHR : 185;

  const clampedMets = Math.max(1.0, Math.min(9.5, safeMets));
  // Normalized exertion fraction from 1.0 (rest) to 8.5 (max operational METs)
  const exertionFraction = Math.max(0, Math.min(1.0, (clampedMets - 1.0) / 7.5));
  
  // Karvonen formula: HR_expected = RHR + (HR_max - RHR) * exertionFraction
  const expectedHR = safeBaseRHR + (safeMaxHR - safeBaseRHR) * exertionFraction;
  return Number.isFinite(expectedHR) ? Math.round(expectedHR) : Math.round(safeBaseRHR);
}

/**
 * Evaluates Cardiorespiratory Concordance between Heart Rate and Activity Level
 * Detects physiological coupling versus acute uncoupling (e.g., inappropriate tachycardia).
 */
export function evaluateHRActivityConcordance(currentHR, baseRHR, currentMets, currentSpO2 = 98) {
  const safeBaseRHR = (typeof baseRHR === 'number' && Number.isFinite(baseRHR)) ? baseRHR : 65;
  const safeHR = (typeof currentHR === 'number' && Number.isFinite(currentHR)) ? currentHR : safeBaseRHR;
  const safeMets = (typeof currentMets === 'number' && Number.isFinite(currentMets)) ? currentMets : 1.2;
  const safeSpO2 = (typeof currentSpO2 === 'number' && Number.isFinite(currentSpO2)) ? currentSpO2 : 98;

  const expectedHR = calculateExpectedHR(safeBaseRHR, safeMets);
  const hrDeltaFromRest = safeHR - safeBaseRHR;
  const hrDeltaFromExpected = safeHR - expectedHR;

  // Exertion Strain Ratio (ESR): Ratio of actual HR increase to expected HR increase
  const expectedElevation = Math.max(8, expectedHR - safeBaseRHR);
  const actualElevation = Math.max(0, safeHR - safeBaseRHR);
  const rawESR = actualElevation / expectedElevation;
  const exertionStrainRatio = Number.isFinite(rawESR) ? Number(rawESR.toFixed(2)) : 1.0;

  // Determine concordance status
  let status = "CONCORDANT";
  let severity = "normal";
  let clinicalDiagnosis = "Normal physiological cardiorespiratory coupling. Heart rate matches metabolic demand.";

  if (safeMets <= 2.0 && safeHR > (safeBaseRHR + 35)) {
    // UNCOUPLED: High HR during low physical activity
    status = "INAPPROPRIATE_TACHYCARDIA_UNCOUPLED";
    severity = "critical";
    if (safeSpO2 < 91) {
      clinicalDiagnosis = "CRITICAL: Acute Hypoxic Tachycardia uncoupling! Heart rate is elevated to compensate for low SpO2 while astronaut is sedentary.";
    } else {
      clinicalDiagnosis = "ALERT: Inappropriate Tachycardia at rest. Possible autonomic distress, acute anxiety/panic, or paroxysmal arrhythmia.";
    }
  } else if (hrDeltaFromExpected > 22) {
    // DISPROPORTIONATE: HR higher than expected for activity
    status = "EXERTIONAL_STRAIN_DRIFT";
    severity = "warning";
    clinicalDiagnosis = "Elevated cardiac cost for current workload. Suggests cardiovascular deconditioning, dehydration, or heat accumulation.";
  } else if (safeMets >= 5.5 && safeHR < (safeBaseRHR + 20)) {
    // CHRONOTROPIC INCOMPETENCE: High activity, but HR fails to rise
    status = "CHRONOTROPIC_INCOMPETENCE";
    severity = "critical";
    clinicalDiagnosis = "Blunted chronotropic response. Cardiac output may be insufficient for high-exertion EVA workload.";
  } else if (Math.abs(hrDeltaFromExpected) <= 12) {
    status = "CONCORDANT";
    severity = "normal";
    clinicalDiagnosis = "Optimal cardiorespiratory concordance. Heart rate is strictly coupled to physical activity.";
  } else if (hrDeltaFromExpected < -12) {
    status = "SUPERIOR_AEROBIC_EFFICIENCY";
    severity = "normal";
    clinicalDiagnosis = "High cardiovascular efficiency. Heart rate is lower than average for this workload level.";
  }

  // Cardio-Oxygen Saturation Index (COSI): SpO2 / HR * 100
  // Normal resting range: ~1.40 - 1.70. Under hypoxia + tachycardia: drops below 0.85
  const hrDenominator = Math.max(40, safeHR);
  const rawCOSI = (safeSpO2 / hrDenominator) * 100;
  const cosi = Number.isFinite(rawCOSI) ? Number(rawCOSI.toFixed(2)) : 1.40;

  return {
    expectedHR,
    hrDeltaFromRest,
    hrDeltaFromExpected,
    exertionStrainRatio,
    concordanceStatus: status,
    severity,
    clinicalDiagnosis,
    cosi
  };
}

/**
 * Computes moving window resting heart rate (RHR) filtered strictly during low-activity intervals
 */
export function computeRestingHRWindow(telemetryLogs, baseRHR) {
  const safeBaseRHR = (typeof baseRHR === 'number' && Number.isFinite(baseRHR)) ? baseRHR : 65;

  if (!telemetryLogs || !telemetryLogs.length) {
    return {
      baselineRHR: safeBaseRHR,
      currentRHR: safeBaseRHR,
      deltaRHR: 0,
      status: "STABLE_BASELINE"
    };
  }

  // Filter samples where activity was resting or light (METs <= 1.8)
  const validLogs = (Array.isArray(telemetryLogs) ? telemetryLogs : []).filter(t => t != null);
  const restingSamples = validLogs.filter(t => typeof t === 'object' && (t.activityMets ?? 1.5) <= 1.8);
  const targetSamples = restingSamples.length >= 3 ? restingSamples : validLogs.slice(-10);

  // Take the 10th percentile (robust nadir) as measured resting HR
  const sortedHR = targetSamples
    .map(s => (typeof s === 'object' ? s?.hr : s))
    .filter(h => typeof h === 'number' && Number.isFinite(h))
    .sort((a, b) => a - b);

  const nadirIndex = sortedHR.length ? Math.floor(sortedHR.length * 0.1) : 0;
  const currentRHR = sortedHR.length ? sortedHR[nadirIndex] : safeBaseRHR;
  const deltaRHR = currentRHR - safeBaseRHR;

  let status = "STABLE_BASELINE";
  if (deltaRHR >= 10) {
    status = "ACUTE_ELEVATION_DECONDITIONING";
  } else if (deltaRHR >= 5) {
    status = "MILD_RESTING_ELEVATION";
  } else if (deltaRHR <= -5) {
    status = "BRADYCARDIA_DRIFT";
  }

  return {
    baselineRHR: safeBaseRHR,
    currentRHR,
    deltaRHR,
    status
  };
}

/**
 * Returns Category Object for a given METs value
 */
export function getActivityCategory(mets) {
  const safeMets = (typeof mets === 'number' && Number.isFinite(mets)) ? mets : 1.0;
  if (safeMets < 1.6) return ACTIVITY_CATEGORIES.REST;
  if (safeMets < 3.0) return ACTIVITY_CATEGORIES.LIGHT_IVA;
  if (safeMets < 6.0) return ACTIVITY_CATEGORIES.MODERATE_WORK;
  return ACTIVITY_CATEGORIES.VIGOROUS_EVA;
}
