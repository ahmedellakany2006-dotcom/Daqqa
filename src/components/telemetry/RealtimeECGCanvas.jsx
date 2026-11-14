import React, { useRef, useEffect } from 'react';
import { useMission } from '../../context/MissionContext';
import { Activity } from 'lucide-react';

export default function RealtimeECGCanvas() {
  const canvasRef = useRef(null);
  const { activeAstronaut } = useMission();
  const rawHR = activeAstronaut?.current?.hr;
  const hr = Number.isFinite(rawHR) && rawHR > 0 ? rawHR : 68;

  const hrRef = useRef(hr);
  useEffect(() => {
    hrRef.current = hr;
  }, [hr]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animationFrameId;
    let phase = 0;
    let step = 0;
    const points = [];
    const maxPoints = canvas.width || 800;
    const midY = canvas.height / 2;

    // Helper: Synthesize realistic Lead II P-Q-R-S-T cardiac waveform
    const getECGSample = (pNorm, baselineY) => {
      let y = baselineY;
      const p = ((pNorm % 1) + 1) % 1; // strictly normalize [0, 1)

      if (p >= 0.12 && p < 0.22) {
        // P-wave (smooth rounded atrial depolarization)
        const norm = (p - 0.12) / 0.10;
        y -= Math.sin(norm * Math.PI) * 11;
      } else if (p >= 0.28 && p < 0.305) {
        // Q-dip (septal depolarization)
        const norm = (p - 0.28) / 0.025;
        y += Math.sin(norm * Math.PI) * 7;
      } else if (p >= 0.305 && p < 0.345) {
        // R-spike (ventricular depolarization - sharp triangular peak)
        const tri = 1 - Math.abs((p - 0.325) / 0.02);
        y -= 56 * Math.pow(Math.max(0, tri), 1.25);
      } else if (p >= 0.345 && p < 0.375) {
        // S-dip (ventricular depolarization end)
        const norm = (p - 0.345) / 0.03;
        y += Math.sin(norm * Math.PI) * 16;
      } else if (p >= 0.44 && p < 0.62) {
        // T-wave (ventricular repolarization - smooth rounded)
        const norm = (p - 0.44) / 0.18;
        y -= Math.sin(norm * Math.PI) * 15 * (1 + 0.25 * Math.cos(norm * Math.PI));
      }

      return y;
    };

    // Pre-populate entire canvas with continuous, active cardiac cycles (NO flatline on mount)
    const initialHR = Number.isFinite(hrRef.current) && hrRef.current > 0 ? hrRef.current : 68;
    const initialBeatWidth = (60 / initialHR) * 160;
    for (let i = 0; i < maxPoints; i++) {
      const p = (i / initialBeatWidth) % 1.0;
      points.push(getECGSample(p, midY));
    }

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const baselineMidY = height / 2;

      // Dynamically read current HR from ref without restarting the animation loop
      const currentHR = Number.isFinite(hrRef.current) && hrRef.current > 0 ? hrRef.current : 68;
      
      // Proportional beat width: at 60 BPM = 160px; advance by 1.6px per frame at 60 FPS
      const beatWidth = (60 / currentHR) * 160;
      const deltaPhase = 1.6 / beatWidth;

      phase = (phase + deltaPhase) % 1.0;
      step++;

      // Subtle physiological respiratory baseline wander (0.15 Hz) & micro-noise
      const respWander = Math.sin(step * 0.015) * 1.5;
      const jitter = (Math.random() - 0.5) * 0.8;
      const sampleY = getECGSample(phase, baselineMidY) + respWander + jitter;

      points.push(sampleY);
      while (points.length > width) {
        points.shift();
      }

      // Draw background aerospace grid
      ctx.fillStyle = '#050A14';
      ctx.fillRect(0, 0, width, height);

      // Minor grid lines (every 10px)
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.04)';
      ctx.lineWidth = 0.5;
      for (let x = 0; x < width; x += 10) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 10) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Major grid lines (every 40px)
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.12)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw continuous ECG lead waveform
      ctx.strokeStyle = '#00F0FF';
      ctx.shadowColor = '#00F0FF';
      ctx.shadowBlur = 8;
      ctx.lineWidth = 2.2;
      ctx.beginPath();

      for (let i = 0; i < points.length; i++) {
        const pt = Number.isFinite(points[i]) ? points[i] : baselineMidY;
        if (i === 0) {
          ctx.moveTo(i, pt);
        } else {
          ctx.lineTo(i, pt);
        }
      }
      ctx.stroke();

      // Reset shadow
      ctx.shadowBlur = 0;

      // Sweep glow dot at lead tip
      const lastX = points.length - 1;
      const lastY = Number.isFinite(points[lastX]) ? points[lastX] : baselineMidY;
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = '#00F0FF';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(lastX, lastY, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []); // Run on mount only: continuous, uninterrupted 60 FPS loop

  return (
    <div className="galaxy-glass-card rounded-2xl p-4 sm:p-5 shadow-2xl relative z-20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.2)]">
            <Activity className="w-4 h-4" />
          </div>
          <span className="font-mono text-xs sm:text-sm font-extrabold text-white tracking-wider uppercase">
            Lead II Optical PPG / Plethysmograph Waveform (Continuous)
          </span>
        </div>
        <div className="font-mono text-xs text-slate-400 flex items-center gap-3">
          <span>Speed: <strong className="text-slate-200">25 mm/s</strong></span>
          <span>Gain: <strong className="text-slate-200">10 mm/mV</strong></span>
          <span className="text-cyan-300 font-black bg-cyan-950/80 px-2.5 py-0.5 rounded border border-cyan-500/50 shadow-[0_0_8px_rgba(0,240,255,0.3)]">
            {hr} BPM
          </span>
        </div>
      </div>

      <div className="w-full h-36 rounded-xl overflow-hidden border border-cyan-500/30 relative shadow-inner">
        <canvas
          ref={canvasRef}
          width={800}
          height={144}
          className="w-full h-full block"
        />
        <div className="absolute top-2 left-3 font-mono text-[10px] text-cyan-300 bg-black/80 px-2 py-0.5 rounded border border-cyan-500/40 pointer-events-none shadow-[0_0_8px_rgba(0,240,255,0.2)]">
          ELEVATE 5 PPG • REALTIME 60FPS
        </div>
      </div>
    </div>
  );
}
