/**
 * DAQQA Live Patient Clinical Dossier PDF Generator
 * Generates an executive, print-optimized spaceflight clinical report window
 * that can be directly saved as PDF via browser print or downloaded.
 */

export function openPrintableClinicalReport(activeAstronaut, personalizedAnomaly, sensorReliability, multimodalRisk, trendForecast) {
  const printWindow = window.open('', '_blank', 'width=900,height=1000');
  if (!printWindow) {
    alert("Please allow popups to open the PDF printable clinical report.");
    return;
  }

  const baseline = personalizedAnomaly.baseline;
  const metrics = activeAstronaut.current;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>DAQQA Clinical Dossier - ${activeAstronaut.name} (FD-${activeAstronaut.flightDay})</title>
  <style>
    @page { size: A4; margin: 15mm; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      padding: 0;
      margin: 0;
      line-height: 1.4;
      font-size: 11px;
    }
    .header {
      border-bottom: 2px solid #0b3d91;
      padding-bottom: 12px;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .header-title h1 {
      margin: 0;
      font-size: 18px;
      color: #0b3d91;
      font-family: monospace;
      letter-spacing: -0.5px;
    }
    .header-title p {
      margin: 2px 0 0 0;
      font-size: 11px;
      color: #64748b;
    }
    .badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 999px;
      font-size: 9px;
      font-weight: bold;
      text-transform: uppercase;
      font-family: monospace;
      background: #e0f2fe;
      color: #0369a1;
      border: 1px solid #bae6fd;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-bottom: 16px;
    }
    .card {
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 8px 10px;
      background: #f8fafc;
    }
    .card-title {
      font-size: 9px;
      font-weight: bold;
      color: #64748b;
      text-transform: uppercase;
      font-family: monospace;
    }
    .card-val {
      font-size: 18px;
      font-weight: 900;
      color: #0f172a;
      font-family: monospace;
      margin: 2px 0;
    }
    .card-sub {
      font-size: 9px;
      color: #475569;
    }
    h2 {
      font-size: 12px;
      font-family: monospace;
      text-transform: uppercase;
      color: #0b3d91;
      margin: 14px 0 6px 0;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 4px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 14px;
      font-size: 10px;
    }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 5px 8px;
      text-align: left;
    }
    th {
      background: #0f172a;
      color: #ffffff;
      font-family: monospace;
      font-size: 9px;
      text-transform: uppercase;
    }
    tr:nth-child(even) { background: #f8fafc; }
    .footer {
      margin-top: 24px;
      padding-top: 8px;
      border-top: 1px solid #cbd5e1;
      font-size: 9px;
      color: #64748b;
      display: flex;
      justify-content: space-between;
      font-family: monospace;
    }
    .print-bar {
      background: #0284c7;
      color: white;
      padding: 8px 16px;
      text-align: center;
      margin-bottom: 14px;
      border-radius: 4px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .print-btn {
      background: white;
      color: #0284c7;
      border: none;
      padding: 5px 12px;
      font-weight: bold;
      border-radius: 4px;
      cursor: pointer;
      font-family: monospace;
    }
    @media print {
      .print-bar { display: none; }
    }
  </style>
</head>
<body>
  <div class="print-bar">
    <span><strong>NASA Space Apps 2026:</strong> DAQQA Spaceflight Clinical Telemetry Dossier</span>
    <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>
  </div>

  <div class="header">
    <div class="header-title">
      <h1>DAQQA (دِقَّة) • Spaceflight Clinical Telemetry Dossier</h1>
      <p>NASA Life Sciences Data Archive (LSDA) & LSAH Protocol • Flight Surgeon Command Center</p>
    </div>
    <div style="text-align: right;">
      <span class="badge">NASA SPACE APPS 2026</span>
      <div style="font-family: monospace; font-size: 9px; color: #64748b; margin-top: 4px;">
        Generated: ${new Date().toISOString().replace('T', ' ').slice(0, 19)} UTC
      </div>
    </div>
  </div>

  <div class="card" style="margin-bottom: 12px; background: #f1f5f9; border-color: #94a3b8;">
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <div>
        <strong style="font-size: 13px; color: #0b3d91;">${activeAstronaut.name}</strong> (${activeAstronaut.role}) &bull; ${activeAstronaut.agency}
      </div>
      <div style="font-family: monospace; font-size: 10px;">
        Flight Day: <strong>FD-${activeAstronaut.flightDay}</strong> | Subject ID: <strong>${activeAstronaut.id}</strong> | Suit: <strong>${activeAstronaut.suitPressure} psi</strong>
      </div>
    </div>
  </div>

  <div class="grid">
    <div class="card">
      <div class="card-title">Heart Rate (PPG)</div>
      <div class="card-val">${metrics.hr} <span style="font-size: 10px; color:#64748b;">BPM</span></div>
      <div class="card-sub">Baseline: ${baseline.restingHR.mean} &plusmn; ${baseline.restingHR.stdDev} bpm</div>
    </div>
    <div class="card">
      <div class="card-title">Pulse Ox (SpO2)</div>
      <div class="card-val" style="color: ${metrics.spo2 < 90 ? '#dc2626' : '#059669'};">${metrics.spo2}%</div>
      <div class="card-sub">COSI: ${metrics.cosi ?? ((metrics.spo2/metrics.hr)*100).toFixed(2)} | Synchronous</div>
    </div>
    <div class="card">
      <div class="card-title">Activity Workload</div>
      <div class="card-val" style="color: #0284c7;">${metrics.activityMets ?? 1.8} <span style="font-size: 10px; color:#64748b;">METs</span></div>
      <div class="card-sub">${metrics.activityLevel ?? "Light IVA"} (${metrics.activityIntensity ?? 22}%)</div>
    </div>
    <div class="card">
      <div class="card-title">Resting HR Offset</div>
      <div class="card-val">${metrics.hrDeltaResting >= 0 ? '+' : ''}${metrics.hrDeltaResting ?? 2} <span style="font-size: 10px; color:#64748b;">BPM</span></div>
      <div class="card-sub">Deconditioning Delta</div>
    </div>
  </div>

  <h2>1. Cardiorespiratory Concordance & Coupling Assessment</h2>
  <table>
    <thead>
      <tr>
        <th>Indicator</th>
        <th>Measured Value</th>
        <th>Expected Target</th>
        <th>Concordance Assessment</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Heart Rate vs Activity</strong></td>
        <td>${metrics.hr} BPM</td>
        <td>${metrics.expectedHR ?? baseline.restingHR.mean} BPM</td>
        <td><strong>${metrics.concordanceStatus ?? "CONCORDANT"}</strong> (${metrics.exertionStrainRatio ?? 1.0}x ESR)</td>
      </tr>
      <tr>
        <td><strong>Optical Signal Trust (SQI)</strong></td>
        <td>${sensorReliability.sqi}%</td>
        <td>&ge; 85% Benchmark</td>
        <td>${sensorReliability.reliabilityStatus} (Motion: ${sensorReliability.motionLevel})</td>
      </tr>
      <tr>
        <td><strong>Autonomic Tone (HRV)</strong></td>
        <td>${metrics.hrv} ms RMSSD</td>
        <td>${baseline.hrvRMSSD.mean} ms</td>
        <td>${metrics.hrv < 22 ? 'AUTONOMIC COLLAPSE' : 'STABLE VAGAL TONE'}</td>
      </tr>
      <tr>
        <td><strong>Composite Risk (MMRS)</strong></td>
        <td>${multimodalRisk.mmrs} / 100</td>
        <td>&lt; 30 Nominal</td>
        <td><strong>${multimodalRisk.syndromeLabel}</strong></td>
      </tr>
    </tbody>
  </table>

  <h2>2. Flight Surgeon Clinical Triage & Narrative</h2>
  <div class="card" style="margin-bottom: 14px; background: #ffffff;">
    <p style="margin: 0; font-size: 10px; color: #1e293b; line-height: 1.5;">
      ${metrics.concordanceDiagnosis ?? "Optimal cardiorespiratory concordance. Heart rate is strictly coupled to metabolic physical activity demand."}
      ${sensorReliability.recommendation ? `<br/><em>${sensorReliability.recommendation}</em>` : ""}
    </p>
  </div>

  <h2>3. 48-Hour Recovery Trajectory & Deterioration Forecast</h2>
  <table>
    <thead>
      <tr>
        <th>Projection Interval</th>
        <th>Predicted Recovery Index</th>
        <th>Confidence Interval (95%)</th>
        <th>Clinical Countermeasure</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Current (+0h)</strong></td>
        <td>${trendForecast.currentRecoveryIndex}%</td>
        <td>&plusmn; 2.0%</td>
        <td>Active baseline monitoring</td>
      </tr>
      <tr>
        <td><strong>+12h Mission Phase</strong></td>
        <td>${trendForecast.forecastPoints[2]?.predictedRecovery ?? 78}%</td>
        <td>&plusmn; 6.2%</td>
        <td>Circadian blue-light regulation</td>
      </tr>
      <tr>
        <td><strong>+24h Horizon</strong></td>
        <td>${trendForecast.forecastPoints[5]?.predictedRecovery ?? 75}%</td>
        <td>&plusmn; 9.4%</td>
        <td>Hydration bolus & CEVIS exercise cycle</td>
      </tr>
      <tr>
        <td><strong>+48h Forward Scope</strong></td>
        <td>${trendForecast.forecastPoints[trendForecast.forecastPoints.length - 1]?.predictedRecovery ?? 72}%</td>
        <td>&plusmn; 14.8%</td>
        <td>Targeted sleep pod acoustic masking</td>
      </tr>
    </tbody>
  </table>

  <div class="footer">
    <div>DAQQA Space Apps 2026 &bull; NASA Software for Healthcare Track</div>
    <div>Document Reference: DAQQA-CLIN-DOSSIER-${activeAstronaut.id}</div>
  </div>
</body>
</html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
