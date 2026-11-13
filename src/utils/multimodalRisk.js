/**
 * DAQQA Multimodal Risk Assessment Fusion Engine
 * Synchronously analyzes correlations across continuous physiological channels (HR, HRV, SpO2)
 * and subjective behavioral telemetry (Sleep surveys, POMS psychological check-ins).
 */

export function computeMultimodalRisk(personalizedAnomaly, sensorReliability, surveyHistory, currentMetrics) {
  const { zScores, baseline } = personalizedAnomaly;
  const sqi = sensorReliability.sqi;

  // Retrieve most recent sleep and psychological surveys
  const sleepSurvey = surveyHistory.find(s => s.type === "SLEEP_QUALITY");
  const pomsSurvey = surveyHistory.find(s => s.type === "POMS_PSYCHOLOGICAL");

  const sleepQuality = sleepSurvey?.ratings?.sleepQuality ?? 4; // 1 (terrible) - 5 (great)
  const sleepLatency = sleepSurvey?.ratings?.sleepLatencyMin ?? 15; // min
  const nightAwakenings = sleepSurvey?.ratings?.nightAwakenings ?? 1;

  const focusScore = pomsSurvey?.ratings?.focusScore ?? 4; // 1 - 5
  const fatigueScore = pomsSurvey?.ratings?.muscleFatigue ?? 2; // 1 (fresh) - 5 (exhausted)
  const anxietyScore = pomsSurvey?.ratings?.anxietyLevel ?? 2; // 1 - 5

  // 1. Modality Strain Weights (0 - 100)
  // Autonomic strain: derived from negative HRV z-score
  const autonomicStrain = Math.min(100, Math.max(0, Math.round(-zScores.hrv * 28 + (currentMetrics.stress || 20) * 0.5)));

  // Cardiovascular strain: derived from positive HR z-score
  const cardioStrain = Math.min(100, Math.max(0, Math.round(Math.max(0, zScores.hr * 26))));

  // Hypoxic strain: derived from SpO2 drop
  const hypoxicStrain = currentMetrics.spo2 < 90 
    ? Math.min(100, Math.round((90 - currentMetrics.spo2) * 12 + 40))
    : Math.min(100, Math.max(0, Math.round(-zScores.spo2 * 20)));

  // Behavioral sleep strain: inverted sleep quality & awakenings
  const behavioralSleepStrain = Math.min(100, Math.round((5 - sleepQuality) * 18 + nightAwakenings * 8 + (sleepLatency > 20 ? 15 : 0)));

  // Cognitive / POMS psychological strain: fatigue & anxiety
  const cognitiveStrain = Math.min(100, Math.round((fatigueScore * 12) + (anxietyScore * 10) + (5 - focusScore) * 8));

  // 2. Multimodal Convergence Coefficient: Check if strains occur SYNCHRONOUSLY
  // If multiple modalities elevate simultaneously, risk compounds exponentially
  const elevatedModalities = [
    autonomicStrain > 50,
    cardioStrain > 50,
    hypoxicStrain > 50,
    behavioralSleepStrain > 50,
    cognitiveStrain > 50
  ].filter(Boolean).length;

  const synergyMultiplier = elevatedModalities >= 3 ? 1.35 : elevatedModalities === 2 ? 1.15 : 1.0;

  // Composite Multimodal Risk Score (MMRS)
  const weightedSum = (
    autonomicStrain * 0.25 +
    cardioStrain * 0.25 +
    hypoxicStrain * 0.25 +
    behavioralSleepStrain * 0.15 +
    cognitiveStrain * 0.10
  ) * synergyMultiplier;

  // If sensor is unreliable, discount false positive spike
  const reliabilityFactor = sensorReliability.isTrustworthy ? 1.0 : 0.65;
  const mmrs = Math.min(100, Math.max(0, Math.round(weightedSum * reliabilityFactor)));

  // 3. Clinical Syndromic Pattern Diagnosis
  let syndrome = "NOMINAL_PHYSIOLOGICAL_HOMEOSTASIS";
  let syndromeLabel = "Nominal Homeostasis";
  let clinicalSeverity = "LOW";
  let recommendations = ["Continue scheduled flight protocol", "Hydration and nutrition intake nominal"];

  if (hypoxicStrain > 65 && cardioStrain > 55) {
    syndrome = "ACUTE_HYPOXIC_DECOMPENSATION";
    syndromeLabel = "Acute Hypoxic Decompensation";
    clinicalSeverity = "CRITICAL";
    recommendations = [
      "CRITICAL: Immediate suit / cabin O2 partial pressure check",
      "Terminate non-essential physical tasks",
      "Engage backup O2 supply system"
    ];
  } else if (autonomicStrain > 65 && behavioralSleepStrain > 60 && cardioStrain > 50) {
    syndrome = "AUTONOMIC_EXHAUSTION_SYNDROME";
    syndromeLabel = "Autonomic Exhaustion Syndrome";
    clinicalSeverity = "HIGH";
    recommendations = [
      "Prescribe mandatory 45-minute rest protocol in crew quarter",
      "Reduce scheduled EVA or manual robotics workload",
      "Administer circadian light-therapy cycle readjustment"
    ];
  } else if (cardioStrain > 60 && sensorReliability.motionLevel === "HIGH") {
    syndrome = "EXERTIONAL_WORKOUT_HOMEOSTASIS";
    syndromeLabel = "Exertional Countermeasure Protocol";
    clinicalSeverity = "MONITORED";
    recommendations = [
      "Aerobic countermeasure (ARED / CEVIS) detected",
      "Monitor post-exercise heart rate recovery (HRR) at 120s"
    ];
  } else if (behavioralSleepStrain > 65 && cognitiveStrain > 60) {
    syndrome = "CIRCADIAN_DESYNCHRONIZATION";
    syndromeLabel = "Circadian Desynchronization & Sleep Deficit";
    clinicalSeverity = "MODERATE";
    recommendations = [
      "Advance sleep phase bedtime by 30 minutes",
      "Dim cabin blue wavelengths 2 hours prior to scheduled sleep",
      "Assess cognitive vigilance before safety-critical tasks"
    ];
  }

  return {
    mmrs, // 0 - 100
    clinicalSeverity, // LOW | MONITORED | MODERATE | HIGH | CRITICAL
    syndrome,
    syndromeLabel,
    elevatedModalitiesCount: elevatedModalities,
    modalityBreakdown: {
      autonomic: autonomicStrain,
      cardiovascular: cardioStrain,
      hypoxic: hypoxicStrain,
      behavioralSleep: behavioralSleepStrain,
      cognitive: cognitiveStrain
    },
    recommendations
  };
}
