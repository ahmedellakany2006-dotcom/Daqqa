/**
 * DAQQA Biometric Sensor Simulator
 * Simulates microgravity physiological dynamics as recorded by Garmin Elevate PPG & Pulse Ox sensors
 */

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
    baseSpO2: 98,
    current: {
      hr: 64,
      hrv: 66,
      spo2: 98.4,
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
    current: {
      hr: 72,
      hrv: 52,
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
    current: {
      hr: 60,
      hrv: 71,
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
    current: {
      hr: 68,
      hrv: 59,
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
    stressTarget: 24,
    fatigueTarget: 18,
    isBlackout: false,
    severity: "normal"
  },
  EVA: {
    id: "EVA",
    title: "High-Exertion EVA (Spacewalk)",
    description: "Extravehicular activity outside ISS / Lunar Gateway. Elevated workload, physical strain and muscle fatigue.",
    hrDelta: 48,
    hrvFactor: 0.55,
    spo2Target: 95.5,
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
    stressTarget: 46,
    fatigueTarget: 32,
    isBlackout: true,
    severity: "blackout"
  },
  HYPOXIA: {
    id: "HYPOXIA",
    title: "Acute Hypoxia / Micro-Decompression",
    description: "Suit or airlock oxygen drop triggering critical SpO2 plunge below 90% and compensatory tachycardia. Instant on-wrist alarm.",
    hrDelta: 65,
    hrvFactor: 0.28,
    spo2Target: 86.5,
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
    stressTarget: 82,
    fatigueTarget: 89,
    isBlackout: false,
    severity: "warning"
  }
};

/**
 * Generate next physiological tick
 */
export function generateSensorTick(astronaut, scenario, prevMetrics, isBlackout) {
  const scen = MISSION_SCENARIOS[scenario] || MISSION_SCENARIOS.NOMINAL;
  
  // Random jitter
  const jitterHR = (Math.random() - 0.5) * 3;
  const jitterHRV = (Math.random() - 0.5) * 4;
  const jitterSpO2 = (Math.random() - 0.5) * 0.4;
  
  // Target values based on scenario and baseline
  const targetHR = astronaut.baseHR + scen.hrDelta + jitterHR;
  const targetHRV = Math.max(12, astronaut.baseHRV * scen.hrvFactor + jitterHRV);
  const targetSpO2 = Math.min(100, Math.max(82, scen.spo2Target + jitterSpO2));
  const targetStress = Math.min(100, Math.max(5, scen.stressTarget + (Math.random() - 0.5) * 6));
  const targetFatigue = Math.min(100, Math.max(5, scen.fatigueTarget + (Math.random() - 0.5) * 4));

  // Smooth lerp
  const currentHR = Math.round(prevMetrics.hr + (targetHR - prevMetrics.hr) * 0.25);
  const currentHRV = Math.round(prevMetrics.hrv + (targetHRV - prevMetrics.hrv) * 0.2);
  const currentSpO2 = Number((prevMetrics.spo2 + (targetSpO2 - prevMetrics.spo2) * 0.2).toFixed(1));
  const currentStress = Math.round(prevMetrics.stress + (targetStress - prevMetrics.stress) * 0.2);
  const currentFatigue = Math.round(prevMetrics.fatigue + (targetFatigue - prevMetrics.fatigue) * 0.15);

  // Status computation
  let status = "NOMINAL";
  let alertMessage = null;
  let isAlert = false;

  if (currentSpO2 < 90) {
    status = "CRITICAL HYPOXIA";
    alertMessage = "CRITICAL: SpO2 DROP DETECTED (" + currentSpO2 + "%). CHECK O2 SUPPLY!";
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

  // Respiration rate correlates with HR
  const respiration = Math.round(12 + (currentHR - 60) * 0.15);
  const skinTemp = Number((36.5 + (currentStress > 60 ? 0.6 : 0) + (Math.random() - 0.5) * 0.2).toFixed(1));

  return {
    timestamp: new Date().toISOString(),
    epoch: Date.now(),
    hr: currentHR,
    hrv: currentHRV,
    spo2: currentSpO2,
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
