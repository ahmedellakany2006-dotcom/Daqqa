/**
 * DAQQA Biometric Sensor Simulator
 * Simulates microgravity physiological dynamics as recorded by Garmin Elevate PPG & Pulse Ox sensors
 * Synchronous dual-stream telemetry: HR and SpO2 co-registered at the exact same moment.
 */

import { evaluateHRActivityConcordance, getActivityCategory } from './hrActivityAnalytics.js';

export const INITIAL_CREW = [
  {
    id: "ASTRO-01",
    name: "Dr. Elena Rostova",
    role: "Commander (CDR)",
    agency: "NASA / ESA",
    avatar: "👩‍🚀",
    flightDay: 42,
    suitPressure: 4.3, // psi (EVA suit nominal)
    cabinO2: 20.9,
    baseHR: 62,
    baseHRV: 68,
    baseSpO2: 98.4,
    restingHR: 62,
    current: {
      hr: 64,
      hrv: 66,
      spo2: 98.4,
      cosi: 1.54,
      activityCategory: "LIGHT_IVA",
      activityLevel: "Light Intravehicular",
      activityMets: 1.8,
      activityIntensity: 22,
      accelMagnitude: 1.04,
      restingHRBaseline: 62,
      restingHRCurrent: 62,
      hrDeltaResting: 2,
      expectedHR: 65,
      exertionStrainRatio: 1.0,
      concordanceStatus: "CONCORDANT",
      concordanceDiagnosis: "Optimal cardiorespiratory concordance.",
      concordanceSeverity: "normal",
      stress: 22,
      fatigue: 14,
      skinTemp: 36.6,
      respiration: 14,
      status: "NOMINAL",
      storagePacketsCached: 12
    }
  },
  {
    id: "ASTRO-02",
    name: "Marcus Vance",
    role: "Flight Engineer (FE)",
    agency: "NASA",
    avatar: "👨‍🚀",
    flightDay: 42,
    suitPressure: 14.7, // Habitation nominal
    cabinO2: 20.8,
    baseHR: 70,
    baseHRV: 55,
    baseSpO2: 97.5,
    restingHR: 70,
    current: {
      hr: 72,
      hrv: 52,
      spo2: 97.6,
      cosi: 1.36,
      activityCategory: "LIGHT_IVA",
      activityLevel: "Light Intravehicular",
      activityMets: 2.1,
      activityIntensity: 25,
      accelMagnitude: 1.08,
      restingHRBaseline: 70,
      restingHRCurrent: 70,
      hrDeltaResting: 2,
      expectedHR: 73,
      exertionStrainRatio: 1.0,
      concordanceStatus: "CONCORDANT",
      concordanceDiagnosis: "Optimal cardiorespiratory concordance.",
      concordanceSeverity: "normal",
      stress: 34,
      fatigue: 28,
      skinTemp: 36.8,
      respiration: 16,
      status: "NOMINAL",
      storagePacketsCached: 8
    }
  },
  {
    id: "ASTRO-03",
    name: "Dr. Kenji Sato",
    role: "Science Specialist (MS)",
    agency: "JAXA / NASA",
    avatar: "👨‍🔬",
    flightDay: 42,
    suitPressure: 14.7,
    cabinO2: 20.9,
    baseHR: 58,
    baseHRV: 74,
    baseSpO2: 99.0,
    restingHR: 58,
    current: {
      hr: 60,
      hrv: 71,
      spo2: 99.1,
      cosi: 1.65,
      activityCategory: "LIGHT_IVA",
      activityLevel: "Light Intravehicular",
      activityMets: 1.7,
      activityIntensity: 20,
      accelMagnitude: 1.02,
      restingHRBaseline: 58,
      restingHRCurrent: 58,
      hrDeltaResting: 2,
      expectedHR: 61,
      exertionStrainRatio: 1.0,
      concordanceStatus: "CONCORDANT",
      concordanceDiagnosis: "Optimal cardiorespiratory concordance.",
      concordanceSeverity: "normal",
      stress: 19,
      fatigue: 18,
      skinTemp: 36.4,
      respiration: 13,
      status: "NOMINAL",
      storagePacketsCached: 15
    }
  },
  {
    id: "ASTRO-04",
    name: "Amina Al-Mansoor",
    role: "Mission Specialist (SP)",
    agency: "MBRSC / NASA",
    avatar: "👩‍🔬",
    flightDay: 42,
    suitPressure: 14.7,
    cabinO2: 20.9,
    baseHR: 66,
    baseHRV: 62,
    baseSpO2: 98.0,
    restingHR: 66,
    current: {
      hr: 68,
      hrv: 59,
      spo2: 98.2,
      cosi: 1.44,
      activityCategory: "LIGHT_IVA",
      activityLevel: "Light Intravehicular",
      activityMets: 1.9,
      activityIntensity: 23,
      accelMagnitude: 1.05,
      restingHRBaseline: 66,
      restingHRCurrent: 66,
      hrDeltaResting: 2,
      expectedHR: 69,
      exertionStrainRatio: 1.0,
      concordanceStatus: "CONCORDANT",
      concordanceDiagnosis: "Optimal cardiorespiratory concordance.",
      concordanceSeverity: "normal",
      stress: 28,
      fatigue: 22,
      skinTemp: 36.7,
      respiration: 15,
      status: "NOMINAL",
      storagePacketsCached: 9
    }
  }
];

export const MISSION_SCENARIOS = {
  NOMINAL: {
    id: "NOMINAL",
    title: "Nominal Orbital Routine",
    description: "Standard intra-vehicular habitation in microgravity. Vitals within calm baseline limits.",
    hrDelta: 0,
    hrvFactor: 1.0,
    spo2Target: 98.5,
    baseMets: 1.8,
    stressTarget: 24,
    fatigueTarget: 18,
    isBlackout: false,
    severity: "normal"
  },
  EVA: {
    id: "EVA",
    title: "High-Exertion EVA (Spacewalk)",
    description: "Extravehicular activity outside ISS / Lunar Gateway. Elevated workload, physical strain and muscle fatigue.",
    hrDelta: 52,
    hrvFactor: 0.55,
    spo2Target: 95.5,
    baseMets: 7.4,
    stressTarget: 68,
    fatigueTarget: 76,
    isBlackout: false,
    severity: "warning"
  },
  BLACKOUT: {
    id: "BLACKOUT",
    title: "Deep Space Comm Blackout (LOS)",
    description: "Lunar far-side or Mars transit radio loss of signal (LOS). Watch runs fully autonomous with local offline caching.",
    hrDelta: 6,
    hrvFactor: 0.85,
    spo2Target: 97.8,
    baseMets: 2.1,
    stressTarget: 46,
    fatigueTarget: 32,
    isBlackout: true,
    severity: "blackout"
  },
  HYPOXIA: {
    id: "HYPOXIA",
    title: "Acute Hypoxia / Micro-Decompression",
    description: "Suit or airlock oxygen drop triggering critical SpO2 plunge below 90% and compensatory tachycardia. Instant on-wrist alarm.",
    hrDelta: 68,
    hrvFactor: 0.28,
    spo2Target: 86.5,
    baseMets: 1.1, // Key spaceflight paradox: sedentary astronaut with critical tachycardia!
    stressTarget: 94,
    fatigueTarget: 65,
    isBlackout: false,
    severity: "critical"
  },
  DESYNC: {
    id: "DESYNC",
    title: "Circadian Rhythm Desync & Fatigue",
    description: "16 sunrises/day causing sleep fragmentation, high morning cortisol, suppressed HRV, and severe cognitive exhaustion.",
    hrDelta: 16,
    hrvFactor: 0.45,
    spo2Target: 96.0,
    baseMets: 2.3,
    stressTarget: 82,
    fatigueTarget: 89,
    isBlackout: false,
    severity: "warning"
  }
};

/**
 * Generate next physiological tick
 * Ensures strict synchronous pairing between Heart Rate (PPG) and SpO2 (Pulse Ox)
 */
export function generateSensorTick(astronaut, scenario, prevMetrics = {}, isBlackout, manualMetsOverride = null) {
  const scen = MISSION_SCENARIOS[scenario] || MISSION_SCENARIOS.NOMINAL;
  const safeAstro = astronaut || { baseHR: 65, baseHRV: 60, baseSpO2: 98.4 };
  const safePrev = prevMetrics || {};
  
  // Random jitter
  const jitterHR = (Math.random() - 0.5) * 3;
  const jitterHRV = (Math.random() - 0.5) * 4;
  const jitterSpO2 = (Math.random() - 0.5) * 0.4;
  
  // Target values based on scenario and baseline
  const baseHR = Number.isFinite(safeAstro.baseHR) ? safeAstro.baseHR : 65;
  const baseHRV = Number.isFinite(safeAstro.baseHRV) ? safeAstro.baseHRV : 60;
  const baseSpO2 = Number.isFinite(safeAstro.baseSpO2) ? safeAstro.baseSpO2 : 98.4;

  const targetHR = baseHR + (scen.hrDelta || 0) + jitterHR;
  const targetHRV = Math.max(12, baseHRV * (scen.hrvFactor || 1.0) + jitterHRV);
  const targetSpO2 = Math.min(100, Math.max(82, (scen.spo2Target || 98.5) + jitterSpO2));
  const targetStress = Math.min(100, Math.max(5, (scen.stressTarget || 24) + (Math.random() - 0.5) * 6));
  const targetFatigue = Math.min(100, Math.max(5, (scen.fatigueTarget || 18) + (Math.random() - 0.5) * 4));

  // Activity METs calculation (support manual test override or scenario default)
  const targetMets = manualMetsOverride !== null ? manualMetsOverride : (scen.baseMets || 1.8) + (Math.random() - 0.5) * 0.25;
  const prevMets = Number.isFinite(safePrev.activityMets) ? safePrev.activityMets : (scen.baseMets || 1.8);
  const currentMets = Number((prevMets + (targetMets - prevMets) * 0.2).toFixed(2));
  const activityCategory = getActivityCategory(currentMets);
  const currentIntensity = Math.round(Math.min(100, Math.max(5, ((currentMets - 1.0) / 7.5) * 100)));

  // Microgravity accelerometer vector magnitude (g-force)
  const accelMagnitude = Number((0.98 + (currentMets / 9.0) * 1.2 + (Math.random() - 0.5) * 0.08).toFixed(2));

  // Smooth lerp
  const prevHR = Number.isFinite(safePrev.hr) ? safePrev.hr : baseHR;
  const prevHRV = Number.isFinite(safePrev.hrv) ? safePrev.hrv : baseHRV;
  const prevSpO2 = Number.isFinite(safePrev.spo2) ? safePrev.spo2 : baseSpO2;
  const prevStress = Number.isFinite(safePrev.stress) ? safePrev.stress : 24;
  const prevFatigue = Number.isFinite(safePrev.fatigue) ? safePrev.fatigue : 18;

  const currentHR = Math.round(prevHR + (targetHR - prevHR) * 0.25);
  const currentHRV = Math.round(prevHRV + (targetHRV - prevHRV) * 0.2);
  const currentSpO2 = Number((prevSpO2 + (targetSpO2 - prevSpO2) * 0.2).toFixed(1));
  const currentStress = Math.round(prevStress + (targetStress - prevStress) * 0.2);
  const currentFatigue = Math.round(prevFatigue + (targetFatigue - prevFatigue) * 0.15);

  // Evaluate Cardiorespiratory Concordance (HR vs Activity)
  const concordance = evaluateHRActivityConcordance(currentHR, baseHR, currentMets, currentSpO2);

  // Status computation
  let status = "NOMINAL";
  let alertMessage = null;
  let isAlert = false;

  if (currentSpO2 < 90) {
    status = "CRITICAL HYPOXIA";
    alertMessage = "CRITICAL: SpO2 DROP DETECTED (" + currentSpO2 + "%). CHECK O2 SUPPLY!";
    isAlert = true;
  } else if (concordance.concordanceStatus === "INAPPROPRIATE_TACHYCARDIA_UNCOUPLED") {
    status = "UNCOUPLED TACHYCARDIA";
    alertMessage = "WARNING: INAPPROPRIATE TACHYCARDIA AT REST (" + currentHR + " BPM @ " + currentMets + " METs).";
    isAlert = true;
  } else if (currentHR > 145) {
    status = "TACHYCARDIA / HIGH STRAIN";
    alertMessage = "WARNING: SUSTAINED HIGH HEART RATE (" + currentHR + " BPM). PAUSE ACTIVITY!";
    isAlert = true;
  } else if (currentHRV < 22) {
    status = "ACUTE PHYSICAL STRESS";
    alertMessage = "ALERT: HRV COLLAPSE (" + currentHRV + " ms). ELEVATED AUTONOMIC STRAIN.";
    isAlert = true;
  } else if (currentStress > 80 || currentFatigue > 80) {
    status = "HIGH FATIGUE";
  }

  // Respiration rate correlates with HR and activity
  const respiration = Math.round(12 + (currentHR - 60) * 0.12 + (currentMets - 1.0) * 1.8);
  const skinTemp = Number((36.5 + (currentStress > 60 || currentMets > 5.0 ? 0.7 : 0) + (Math.random() - 0.5) * 0.2).toFixed(1));

  // Common identical timestamp for synchronous co-registration
  const nowIso = new Date().toISOString();
  const epoch = Date.now();

  return {
    timestamp: nowIso,
    syncTimestamp: nowIso,
    epoch,
    // Synchronous primary vitals
    hr: currentHR,
    spo2: currentSpO2,
    cosi: concordance.cosi,
    // Activity level metrics
    activityCategory: activityCategory.id,
    activityLevel: activityCategory.label,
    activityMets: currentMets,
    activityIntensity: currentIntensity,
    accelMagnitude,
    // Resting HR & Exertion dynamics
    restingHRBaseline: baseHR,
    hrDeltaResting: (Number.isFinite(currentHR) && Number.isFinite(baseHR)) ? (currentHR - baseHR) : 0,
    expectedHR: concordance.expectedHR,
    exertionStrainRatio: concordance.exertionStrainRatio,
    concordanceStatus: concordance.concordanceStatus,
    concordanceDiagnosis: concordance.clinicalDiagnosis,
    concordanceSeverity: concordance.severity,
    // General vitals
    hrv: currentHRV,
    stress: currentStress,
    fatigue: currentFatigue,
    skinTemp,
    respiration,
    status,
    isAlert,
    alertMessage,
    isBlackout: isBlackout || scen.isBlackout
  };
}
