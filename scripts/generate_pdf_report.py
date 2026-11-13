"""
DAQQA - NASA Space Apps Challenge 2026
Technical Specification PDF Generator: Telemetry Data Sources & Physiological Thresholds
"""

import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(54, 755, "DAQQA (دِقَّة) • NASA Space Apps Challenge 2026 • Technical Specification")
            self.drawRightString(612 - 54, 755, "DOC: DAQQA-SPEC-HRP09-V2")
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.5)
            self.line(54, 747, 612 - 54, 747)
        
        # Footer (all pages)
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.5)
        self.line(54, 45, 612 - 54, 45)
        self.setFont("Helvetica", 8)
        self.drawString(54, 32, "NASA Life Sciences Data Archive (LSDA) & LSAH Integration Protocol • Confidential / Flight Surgeon Clearance")
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(612 - 54, 32, page_text)
        self.restoreState()

def build_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=22,
        leading=26,
        textColor=colors.HexColor('#0F172A')
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#0369A1')
    )

    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=colors.HexColor('#0F172A'),
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#0284C7'),
        spaceBefore=8,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#334155'),
        spaceAfter=6
    )

    body_bold = ParagraphStyle(
        'BodyBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#0F172A')
    )

    callout_style = ParagraphStyle(
        'CalloutText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor('#1E293B')
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.white,
        alignment=0
    )

    table_cell_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=10.5,
        textColor=colors.HexColor('#1E293B')
    )

    table_cell_bold = ParagraphStyle(
        'TableCellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10.5,
        textColor=colors.HexColor('#0F172A')
    )

    table_cell_code = ParagraphStyle(
        'TableCellCode',
        parent=styles['Normal'],
        fontName='Courier-Bold',
        fontSize=7.5,
        leading=9.5,
        textColor=colors.HexColor('#0369A1')
    )

    story = []

    # Title & Metadata Banner
    story.append(Paragraph("DAQQA (دِقَّة) • Spaceflight Health Monitoring", subtitle_style))
    story.append(Paragraph("Telemetry Data Sources & Physiological Threshold Specification", title_style))
    story.append(Spacer(1, 4))
    
    meta_table_data = [
        [
            Paragraph("<b>Document ID:</b> DAQQA-SPEC-HRP09-2026", callout_style),
            Paragraph("<b>Mission Event:</b> 2026 NASA Space Apps Challenge", callout_style)
        ],
        [
            Paragraph("<b>Software Track:</b> Healthcare Track (Space Apps)", callout_style),
            Paragraph("<b>Target Hardware:</b> Garmin tactix 7 / fenix 7 (Connect IQ 7)", callout_style)
        ],
        [
            Paragraph("<b>Clinical Standards:</b> NASA LSDA & LSAH Dual Protocol", callout_style),
            Paragraph("<b>Temporal Sync:</b> Sub-second Co-Registration (Δt = 0 ms)", callout_style)
        ]
    ]
    meta_table = Table(meta_table_data, colWidths=[250, 254])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#F1F5F9')),
        ('PADDING', (0, 0), (-1, -1), 4),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E2E8F0')),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 10))

    # Executive Overview
    story.append(Paragraph("1. Executive Technical Summary", h1_style))
    story.append(Paragraph(
        "This specification establishes the definitive data provenance, sensory instrumentation channels, and mathematical "
        "decision thresholds implemented in the <b>DAQQA (دِقَّة)</b> astronaut health telemetry engine. Designed for long-duration deep space exploration "
        "(Artemis Lunar Gateway, Mars transit), DAQQA addresses communication blackouts (LOS) through autonomous on-wrist processing and provides "
        "flight surgeons with rigorous, standardized physiological risk classification.",
        body_style
    ))

    # Part 1: Data Sources & Origin
    story.append(Paragraph("2. Sensory Data Provenance & Acquisition Architecture", h1_style))
    story.append(Paragraph(
        "All telemetry streams within DAQQA originate from verified physical and behavioral interfaces running on Garmin's "
        "microgravity-tested wearable architecture:",
        body_style
    ))

    source_data = [
        [
            Paragraph("Telemetry Channel", table_header_style),
            Paragraph("Hardware / Sensor Modality", table_header_style),
            Paragraph("Acquisition API / Runtime", table_header_style),
            Paragraph("Sampling & Provenance", table_header_style)
        ],
        [
            Paragraph("<b>Heart Rate (HR)</b>", table_cell_bold),
            Paragraph("Garmin Elevate Gen 5 Optical PPG (Green 525nm)", table_cell_style),
            Paragraph("Toybox.Sensor.Info.heartRate", table_cell_code),
            Paragraph("Continuous 1 Hz photoplethysmogram tracking pulsatile blood volume.", table_cell_style)
        ],
        [
            Paragraph("<b>Pulse Oximetry (SpO2)</b>", table_cell_bold),
            Paragraph("Dual-Wavelength Optical LEDs (Red 660nm / IR 940nm)", table_cell_style),
            Paragraph("Toybox.Sensor.Info.oxygenSaturation", table_cell_code),
            Paragraph("Synchronously co-registered with HR at identical UTC epoch (Δt = 0 ms).", table_cell_style)
        ],
        [
            Paragraph("<b>Heart Rate Variability</b>", table_cell_bold),
            Paragraph("High-Frequency R-R Interbeat Intervals", table_cell_style),
            Paragraph("Toybox.SensorHistory (RMSSD)", table_cell_code),
            Paragraph("Quantifies vagal parasympathetic vs sympathetic autonomic tone.", table_cell_style)
        ],
        [
            Paragraph("<b>Physical Workload (METs)</b>", table_cell_bold),
            Paragraph("3-Axis Accelerometer (100 Hz microgravity inertial unit)", table_cell_style),
            Paragraph("Toybox.Sensor.registerSensorData", table_cell_code),
            Paragraph("Vector jerk integration yielding Metabolic Equivalents of Task (1.0 - 9.5).", table_cell_style)
        ],
        [
            Paragraph("<b>Skin Temperature</b>", table_cell_bold),
            Paragraph("Integrated Thermistor Lens Sensor", table_cell_style),
            Paragraph("Toybox.SensorHistory.getTemperature", table_cell_code),
            Paragraph("Monitors peripheral vasoconstriction, circadian rhythm, and thermal strain.", table_cell_style)
        ],
        [
            Paragraph("<b>Behavioral Surveys</b>", table_cell_bold),
            Paragraph("On-Wrist Interactive Task UI (5-Button Tactical Interface)", table_cell_style),
            Paragraph("Custom Monkey C View / Storage Module", table_cell_code),
            Paragraph("NASA-TLX, POMS mood/focus, and Karolinska Sleep Scale analog.", table_cell_style)
        ],
        [
            Paragraph("<b>Offline NVRAM Buffer</b>", table_cell_bold),
            Paragraph("Non-Volatile RAM (Garmin tactix 7 onboard storage)", table_cell_style),
            Paragraph("Toybox.Application.Storage", table_cell_code),
            Paragraph("Autonomous data queue holding up to 30 days during comm blackouts (LOS).", table_cell_style)
        ]
    ]

    source_table = Table(source_data, colWidths=[110, 140, 120, 134])
    source_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#0B3D91')),
        ('PADDING', (0, 0), (-1, -1), 3.5),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#CBD5E1')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F8FAFC')])
    ]))
    story.append(source_table)
    story.append(Spacer(1, 10))

    # Part 2: Physiological Thresholds
    story.append(Paragraph("3. Physiological Thresholds & Clinical Decision Criteria", h1_style))
    story.append(Paragraph(
        "DAQQA employs multi-tiered, scientifically grounded decision boundaries across each physiological dimension:",
        body_style
    ))

    # Table 1: SpO2 and COSI
    story.append(Paragraph("Table 3.1: Pulse Oximetry (SpO2) & Cardio-Oxygen Saturation Index (COSI)", h2_style))
    spo2_data = [
        [
            Paragraph("Parameter", table_header_style),
            Paragraph("Threshold Boundary", table_header_style),
            Paragraph("Classification", table_header_style),
            Paragraph("Operational & Clinical Meaning", table_header_style)
        ],
        [
            Paragraph("<b>SpO2 Saturation</b>", table_cell_bold),
            Paragraph("&ge; 95.0%", table_cell_style),
            Paragraph("<b>NOMINAL</b>", table_cell_code),
            Paragraph("Normal alveolar-capillary oxygen diffusion in cabin atmosphere.", table_cell_style)
        ],
        [
            Paragraph("<b>SpO2 Saturation</b>", table_cell_bold),
            Paragraph("90.0% &ndash; 94.9%", table_cell_style),
            Paragraph("<b>MILD DESATURATION</b>", table_cell_code),
            Paragraph("Elevated cabin altitude, hypoventilation, or early suit scrub deficiency.", table_cell_style)
        ],
        [
            Paragraph("<b>SpO2 Saturation</b>", table_cell_bold),
            Paragraph("&lt; 90.0%", table_cell_style),
            Paragraph("<b>CRITICAL HYPOXIA</b>", table_cell_code),
            Paragraph("<b>Immediate Emergency Alarm:</b> Audible & haptic warning to check O2 umbilical.", table_cell_style)
        ],
        [
            Paragraph("<b>COSI Ratio</b><br/>(SpO2 / HR &times; 100)", table_cell_bold),
            Paragraph("&ge; 1.40", table_cell_style),
            Paragraph("<b>OPTIMAL COUPLING</b>", table_cell_code),
            Paragraph("Healthy cardiorespiratory transport efficiency.", table_cell_style)
        ],
        [
            Paragraph("<b>COSI Ratio</b>", table_cell_bold),
            Paragraph("&lt; 1.00", table_cell_style),
            Paragraph("<b>ACUTE MISMATCH</b>", table_cell_code),
            Paragraph("Compensatory tachycardia in presence of falling oxygen saturation.", table_cell_style)
        ]
    ]
    spo2_table = Table(spo2_data, colWidths=[100, 100, 110, 194])
    spo2_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#0284C7')),
        ('PADDING', (0, 0), (-1, -1), 3.5),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#CBD5E1')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F8FAFC')])
    ]))
    story.append(spo2_table)
    story.append(Spacer(1, 8))

    # Table 2: Personalized Anomaly Detection (z-Scores)
    story.append(Paragraph("Table 3.2: Personalized Baseline Deviation Engine (z-Scores)", h2_style))
    story.append(Paragraph(
        "Standardized scale-invariant deviation formula: <i>z = (x<sub>t</sub> - &mu;<sub>baseline</sub>) / &sigma;<sub>baseline</sub></i>",
        body_style
    ))
    z_data = [
        [
            Paragraph("Deviation Tier", table_header_style),
            Paragraph("z-Score Range", table_header_style),
            Paragraph("Clinical Assessment", table_header_style),
            Paragraph("Flight Surgeon Directive", table_header_style)
        ],
        [
            Paragraph("<b>Nominal Stability</b>", table_cell_bold),
            Paragraph("|z| &le; 1.5 &sigma;", table_cell_code),
            Paragraph("Physiological homeostatic equilibrium.", table_cell_style),
            Paragraph("Nominal flight schedule.", table_cell_style)
        ],
        [
            Paragraph("<b>Mild Drift</b>", table_cell_bold),
            Paragraph("1.5 &lt; |z| &le; 2.5 &sigma;", table_cell_code),
            Paragraph("Sub-clinical physiological drift.", table_cell_style),
            Paragraph("Monitor trend; check hydration and sleep telemetry.", table_cell_style)
        ],
        [
            Paragraph("<b>Moderate Deviation</b>", table_cell_bold),
            Paragraph("2.5 &lt; |z| &le; 3.5 &sigma;", table_cell_code),
            Paragraph("Statistically significant physiological strain.", table_cell_style),
            Paragraph("Flag for ground review; recommend scheduled rest break.", table_cell_style)
        ],
        [
            Paragraph("<b>Critical Anomaly</b>", table_cell_bold),
            Paragraph("|z| &gt; 3.5 &sigma; (or HR &gt; 3.0&sigma;)", table_cell_code),
            Paragraph("Severe acute pathological deviation.", table_cell_style),
            Paragraph("Immediate medical triage; halt physical EVA workload.", table_cell_style)
        ]
    ]
    z_table = Table(z_data, colWidths=[110, 100, 140, 154])
    z_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#475569')),
        ('PADDING', (0, 0), (-1, -1), 3.5),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#CBD5E1')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F8FAFC')])
    ]))
    story.append(z_table)
    story.append(Spacer(1, 8))

    # Calibrated Crew Baselines Table
    crew_base_data = [
        [
            Paragraph("Astronaut ID & Name", table_header_style),
            Paragraph("Resting HR (&mu; &plusmn; &sigma;)", table_header_style),
            Paragraph("SpO2 Baseline (&mu; &plusmn; &sigma;)", table_header_style),
            Paragraph("HRV RMSSD (&mu; &plusmn; &sigma;)", table_header_style),
            Paragraph("Stress Baseline", table_header_style)
        ],
        [
            Paragraph("<b>ASTRO-01</b> (Dr. Elena Rostova - CDR)", table_cell_bold),
            Paragraph("62.4 &plusmn; 4.8 BPM", table_cell_style),
            Paragraph("98.4 &plusmn; 0.6 %", table_cell_style),
            Paragraph("68.2 &plusmn; 7.1 ms", table_cell_style),
            Paragraph("22.0 &plusmn; 5.5 pts", table_cell_style)
        ],
        [
            Paragraph("<b>ASTRO-02</b> (Marcus Vance - FE)", table_cell_bold),
            Paragraph("70.2 &plusmn; 5.4 BPM", table_cell_style),
            Paragraph("97.6 &plusmn; 0.7 %", table_cell_style),
            Paragraph("55.0 &plusmn; 6.8 ms", table_cell_style),
            Paragraph("32.0 &plusmn; 6.2 pts", table_cell_style)
        ],
        [
            Paragraph("<b>ASTRO-03</b> (Dr. Kenji Sato - MS)", table_cell_bold),
            Paragraph("58.1 &plusmn; 4.2 BPM", table_cell_style),
            Paragraph("99.0 &plusmn; 0.5 %", table_cell_style),
            Paragraph("74.0 &plusmn; 8.0 ms", table_cell_style),
            Paragraph("18.5 &plusmn; 4.8 pts", table_cell_style)
        ],
        [
            Paragraph("<b>ASTRO-04</b> (Amina Al-Mansoor - SP)", table_cell_bold),
            Paragraph("65.8 &plusmn; 4.6 BPM", table_cell_style),
            Paragraph("98.1 &plusmn; 0.6 %", table_cell_style),
            Paragraph("62.5 &plusmn; 6.5 ms", table_cell_style),
            Paragraph("26.0 &plusmn; 5.2 pts", table_cell_style)
        ]
    ]
    crew_table = Table(crew_base_data, colWidths=[130, 95, 95, 95, 89])
    crew_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1E293B')),
        ('PADDING', (0, 0), (-1, -1), 3),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#CBD5E1')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F8FAFC')])
    ]))
    story.append(crew_table)
    story.append(Spacer(1, 8))

    # Page break for clarity
    story.append(PageBreak())

    # Table 3: Resting Heart Rate and Cardiovascular Deconditioning
    story.append(Paragraph("Table 3.3: Resting Heart Rate (RHR) & Cardiovascular Deconditioning", h2_style))
    story.append(Paragraph(
        "RHR elevation delta: <i>&Delta;RHR = HR<sub>measured_nadir</sub> - RHR<sub>baseline</sub></i> (tracked during METs &le; 1.8):",
        body_style
    ))
    rhr_data = [
        [
            Paragraph("Resting HR Delta (&Delta;RHR)", table_header_style),
            Paragraph("Cardiovascular Status", table_header_style),
            Paragraph("Pathophysiological Mechanism in Microgravity", table_header_style)
        ],
        [
            Paragraph("&Delta;RHR &le; +4 BPM", table_cell_code),
            Paragraph("<b>Stable Autonomic Baseline</b>", table_cell_bold),
            Paragraph("Normal baroreceptor function and fluid volume adaptation.", table_cell_style)
        ],
        [
            Paragraph("+5 to +12 BPM", table_cell_code),
            Paragraph("<b>Mild Deconditioning / Latent Fatigue</b>", table_cell_bold),
            Paragraph("Plasma volume contraction or high sympathetic tone from sleep loss.", table_cell_style)
        ],
        [
            Paragraph("&ge; +15 BPM", table_cell_code),
            Paragraph("<b>Critical Deconditioning / Autonomic Strain</b>", table_cell_bold),
            Paragraph("Significant orthostatic intolerance risk; severe central volume loss.", table_cell_style)
        ],
        [
            Paragraph("HR &gt; 145 BPM (Absolute)", table_cell_code),
            Paragraph("<b>Sustained Tachycardia Alarm</b>", table_cell_bold),
            Paragraph("Exceeds safe operational sustained aerobic threshold; mandatory pause.", table_cell_style)
        ]
    ]
    rhr_table = Table(rhr_data, colWidths=[120, 140, 244])
    rhr_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#DC2626')),
        ('PADDING', (0, 0), (-1, -1), 4),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#CBD5E1')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F8FAFC')])
    ]))
    story.append(rhr_table)
    story.append(Spacer(1, 8))

    # Table 4: HR vs Activity Concordance Engine
    story.append(Paragraph("Table 3.4: HR vs. Activity Concordance & Cardiorespiratory Coupling", h2_style))
    story.append(Paragraph(
        "Karvonen Expected Heart Rate: <i>Expected_HR = RHR + (185 - RHR) &times; ((METs - 1.0) / 7.5)</i><br/>"
        "Exertion Strain Ratio (ESR): <i>ESR = (Actual_HR - RHR) / max(8, Expected_HR - RHR)</i>",
        body_style
    ))
    concordance_data = [
        [
            Paragraph("Coupling Classification", table_header_style),
            Paragraph("Mathematical Trigger Criteria", table_header_style),
            Paragraph("Clinical Spaceflight Diagnosis", table_header_style)
        ],
        [
            Paragraph("<b>CONCORDANT</b>", table_cell_bold),
            Paragraph("|Actual_HR &minus; Expected_HR| &le; 12 BPM<br/>(ESR &asymp; 1.0 &plusmn; 0.25)", table_cell_code),
            Paragraph("Optimal cardiorespiratory coupling. Heart rate scales proportionally with physical workload.", table_cell_style)
        ],
        [
            Paragraph("<b>INAPPROPRIATE TACHYCARDIA (UNCOUPLED)</b>", table_cell_bold),
            Paragraph("METs &le; 2.0 (Rest/Sedentary)<br/>AND Actual_HR &gt; (RHR + 35 BPM)", table_cell_code),
            Paragraph("<b>CRITICAL EMERGENCY:</b> Acute hypoxia, airlock depressurization, panic, or cardiac arrhythmia occurring while astronaut is resting.", table_cell_style)
        ],
        [
            Paragraph("<b>EXERTIONAL STRAIN DRIFT</b>", table_cell_bold),
            Paragraph("(Actual_HR &minus; Expected_HR) &gt; 22 BPM<br/>(ESR &gt; 1.8)", table_cell_code),
            Paragraph("Excessive cardiac cost for light/moderate work. Indicates deconditioning, heat accumulation, or dehydration.", table_cell_style)
        ],
        [
            Paragraph("<b>CHRONOTROPIC INCOMPETENCE</b>", table_cell_bold),
            Paragraph("METs &ge; 5.5 (Vigorous EVA Work)<br/>AND Actual_HR &lt; (RHR + 20 BPM)", table_cell_code),
            Paragraph("Blunted chronotropic response. Cardiac output insufficient for high metabolic EVA demand.", table_cell_style)
        ]
    ]
    concordance_table = Table(concordance_data, colWidths=[130, 140, 234])
    concordance_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#059669')),
        ('PADDING', (0, 0), (-1, -1), 4),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#CBD5E1')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F8FAFC')])
    ]))
    story.append(concordance_table)
    story.append(Spacer(1, 8))

    # Table 5: Sensor Reliability & Signal Quality Index (SQI)
    story.append(Paragraph("Table 3.5: Sensor Reliability & Signal Quality Index (SQI)", h2_style))
    sqi_data = [
        [
            Paragraph("SQI Range", table_header_style),
            Paragraph("Reliability Status", table_header_style),
            Paragraph("Gating Behavior & False Alarm Prevention", table_header_style)
        ],
        [
            Paragraph("&ge; 85 %", table_cell_code),
            Paragraph("<b>HIGH_CONFIDENCE</b>", table_cell_bold),
            Paragraph("Optimal optical signal-to-noise ratio. Full diagnostic validity.", table_cell_style)
        ],
        [
            Paragraph("65 % &ndash; 84 %", table_cell_code),
            Paragraph("<b>MODERATE_CONFIDENCE</b>", table_cell_bold),
            Paragraph("Microgravity motion detected. Band-pass filtering active; alarms trusted with weighting.", table_cell_style)
        ],
        [
            Paragraph("45 % &ndash; 64 %", table_cell_code),
            Paragraph("<b>SUSPECT_ARTIFACT</b>", table_cell_bold),
            Paragraph("<b>Alarm Gating Active:</b> Suppresses false positive biometric alarms during intense workouts.", table_cell_style)
        ],
        [
            Paragraph("&lt; 45 %", table_cell_code),
            Paragraph("<b>SENSOR_DEGRADED</b>", table_cell_bold),
            Paragraph("Loose watch strap or detachment. Triggers on-wrist hardware fit warning.", table_cell_style)
        ],
        [
            Paragraph("PI &lt; 1.0 %", table_cell_code),
            Paragraph("<b>POOR PERFUSION</b>", table_cell_bold),
            Paragraph("Insufficient optical pulse amplitude (vasoconstriction or cold exposure).", table_cell_style)
        ]
    ]
    sqi_table = Table(sqi_data, colWidths=[90, 130, 284])
    sqi_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#6366F1')),
        ('PADDING', (0, 0), (-1, -1), 3.5),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#CBD5E1')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F8FAFC')])
    ]))
    story.append(sqi_table)
    story.append(Spacer(1, 8))

    # Table 6: Multimodal Risk Score (MMRS)
    story.append(Paragraph("Table 3.6: Multimodal Risk Score (MMRS) Composite Matrix", h2_style))
    mmrs_data = [
        [
            Paragraph("MMRS Score", table_header_style),
            Paragraph("Clinical Risk Category", table_header_style),
            Paragraph("Countermeasure Protocol", table_header_style)
        ],
        [
            Paragraph("0 &ndash; 29", table_cell_code),
            Paragraph("<b>Nominal Adaptation</b> (Green)", table_cell_bold),
            Paragraph("Routine spaceflight schedule and standard exercise countermeasure.", table_cell_style)
        ],
        [
            Paragraph("30 &ndash; 59", table_cell_code),
            Paragraph("<b>Moderate Autonomic Strain</b> (Amber)", table_cell_bold),
            Paragraph("Recommend 30-minute relaxation pod session; check sleep architecture.", table_cell_style)
        ],
        [
            Paragraph("60 &ndash; 79", table_cell_code),
            Paragraph("<b>High Autonomic Exhaustion</b> (Orange)", table_cell_bold),
            Paragraph("Electrolyte rehydration bolus; postpone planned spacewalk (EVA).", table_cell_style)
        ],
        [
            Paragraph("80 &ndash; 100", table_cell_code),
            Paragraph("<b>Critical Decompensation</b> (Red)", table_cell_bold),
            Paragraph("Immediate medical officer intervention; high-flow O2 and vital resuscitation.", table_cell_style)
        ]
    ]
    mmrs_table = Table(mmrs_data, colWidths=[80, 150, 274])
    mmrs_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#D97706')),
        ('PADDING', (0, 0), (-1, -1), 3.5),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#CBD5E1')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F8FAFC')])
    ]))
    story.append(mmrs_table)
    story.append(Spacer(1, 10))

    # Part 3: CSV Format Specification
    story.append(Paragraph("4. Scientific CSV Data Extraction Schema", h1_style))
    story.append(Paragraph(
        "The exported dataset complies strictly with <b>RFC 4180</b> and is encoded in <b>UTF-8 with Byte Order Mark (BOM)</b>. "
        "Every row contains synchronized readings at the identical timestamp epoch (Δt = 0 ms):",
        body_style
    ))

    csv_cols_data = [
        [Paragraph("Category", table_header_style), Paragraph("CSV Column Fields Included", table_header_style)],
        [
            Paragraph("<b>Temporal & Identity</b>", table_cell_bold),
            Paragraph("Synchronous_Timestamp_ISO_UTC, Unix_Epoch_Milliseconds, Astronaut_ID, Astronaut_Name, Flight_Day", table_cell_code)
        ],
        [
            Paragraph("<b>Cardiorespiratory</b>", table_cell_bold),
            Paragraph("Heart_Rate_BPM, SpO2_Percent, Cardio_Oxygen_Saturation_Index_COSI, HRV_RMSSD_ms, Respiration_Rate_BrPM", table_cell_code)
        ],
        [
            Paragraph("<b>Activity & Exertion</b>", table_cell_bold),
            Paragraph("Activity_Level_Category, Activity_METs, Activity_Intensity_Pct, Accelerometer_Magnitude_G", table_cell_code)
        ],
        [
            Paragraph("<b>Resting HR & Concordance</b>", table_cell_bold),
            Paragraph("Resting_HR_Baseline_BPM, Current_Resting_HR_BPM, HR_Elevation_Over_Resting_BPM, Expected_HR_For_Activity_BPM, Exertion_Strain_Ratio_ESR, Cardiorespiratory_Concordance_Status", table_cell_code)
        ],
        [
            Paragraph("<b>Reliability & SQI</b>", table_cell_bold),
            Paragraph("Signal_Quality_Index_SQI_Pct, Sensor_Reliability_Status, Perfusion_Index_Pct, Motion_Artifact_Level", table_cell_code)
        ],
        [
            Paragraph("<b>Clinical AI Risk & Prediction</b>", table_cell_bold),
            Paragraph("Multimodal_Risk_Score_MMRS, Clinical_Syndrome_Diagnosis, Predicted_Recovery_Index_24h, Deterioration_Probability_24h_Pct, Telemetry_Alarm_Status", table_cell_code)
        ],
        [
            Paragraph("<b>Behavioral Surveys</b>", table_cell_bold),
            Paragraph("Subjective_Sleep_Quality_Score, Subjective_POMS_Focus_Score", table_cell_code)
        ]
    ]
    csv_cols_table = Table(csv_cols_data, colWidths=[130, 374])
    csv_cols_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#0F172A')),
        ('PADDING', (0, 0), (-1, -1), 3.5),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#CBD5E1')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F8FAFC')])
    ]))
    story.append(csv_cols_table)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"[SUCCESS] PDF generated at: {filename}")

if __name__ == "__main__":
    out_workspace = r"c:\Users\ENG. Ahmed Ellakany\OneDrive\Desktop\PROJECTS\DAQQA\DAQQA_NASA_Telemetry_Specification_and_Thresholds.pdf"
    out_artifact = r"C:\Users\ENG. Ahmed Ellakany\.gemini\antigravity\brain\63f85e5f-323f-46e5-8f78-dfdc011fd94d\DAQQA_NASA_Telemetry_Specification_and_Thresholds.pdf"
    
    build_pdf(out_workspace)
    build_pdf(out_artifact)
