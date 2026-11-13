import React, { useRef, useEffect } from 'react';
import { useMission } from '../../context/MissionContext';
import { Activity } from 'lucide-react';

export default function RealtimeECGCanvas() {
  const canvasRef = useRef(null);
  const { activeAstronaut } = useMission();
  const hr = activeAstronaut.current.hr || 68;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animationFrameId;
    let step = 0;
    const points = [];
    const maxPoints = canvas.width || 600;

    // Fill initial baseline
    for (let i = 0; i < maxPoints; i++) {
      points.push(canvas.height / 2);
    }

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const midY = height / 2;

      // Calculate ECG cycle frequency based on HR
      // 60 fps / (HR / 60) = frames per beat
      const beatPeriod = Math.max(20, Math.round(3600 / hr));
      const cyclePos = step % beatPeriod;

      let sampleY = midY;

      // Synthesize realistic P-Q-R-S-T cardiac waveform
      const p = cyclePos / beatPeriod;
      if (p > 0.15 && p < 0.22) {
        // P-wave (atrial depolarization)
        sampleY -= Math.sin(((p - 0.15) / 0.07) * Math.PI) * 12;
      } else if (p >= 0.27 && p < 0.29) {
        // Q-dip
        sampleY += 8;
      } else if (p >= 0.29 && p < 0.33) {
        // R-spike (ventricular depolarization)
        sampleY -= 55;
      } else if (p >= 0.33 && p < 0.36) {
        // S-dip
        sampleY += 18;
      } else if (p > 0.45 && p < 0.60) {
        // T-wave (ventricular repolarization)
        sampleY -= Math.sin(((p - 0.45) / 0.15) * Math.PI) * 16;
      }

      // Small physiological jitter
      sampleY += (Math.random() - 0.5) * 1.5;

      points.push(sampleY);
      if (points.length > width) {
        points.shift();
      }

      // Draw background aerospace grid
      ctx.fillStyle = '#070D18';
      ctx.fillRect(0, 0, width, height);

      // Grid lines
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.07)';
      ctx.lineWidth = 1;
      const gridSize = 20;

      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw ECG lead waveform
      ctx.strokeStyle = '#00F0FF';
      ctx.shadowColor = '#00F0FF';
      ctx.shadowBlur = 8;
      ctx.lineWidth = 2.2;
      ctx.beginPath();

      for (let i = 0; i < points.length; i++) {
        if (i === 0) {
          ctx.moveTo(i, points[i]);
        } else {
          ctx.lineTo(i, points[i]);
        }
      }
      ctx.stroke();

      // Reset shadow
      ctx.shadowBlur = 0;

      // Sweep glow dot at lead tip
      const lastX = points.length - 1;
      const lastY = points[lastX];
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = '#00F0FF';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(lastX, lastY, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      step++;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [hr]);

  return (
    <div className="bg-[#090F1C] border border-cyan-950/80 rounded-2xl p-4 shadow-xl relative overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span className="font-mono text-xs font-bold text-cyan-300 tracking-wider uppercase">
            Lead II Optical PPG / Plethysmograph Waveform (Continuous)
          </span>
        </div>
        <div className="font-mono text-xs text-slate-400 flex items-center gap-3">
          <span>Speed: <strong className="text-slate-200">25 mm/s</strong></span>
          <span>Gain: <strong className="text-slate-200">10 mm/mV</strong></span>
          <span className="text-cyan-300 font-bold">{hr} BPM</span>
        </div>
      </div>

      <div className="w-full h-32 rounded-xl overflow-hidden border border-cyan-900/40 relative">
        <canvas
          ref={canvasRef}
          width={800}
          height={128}
          className="w-full h-full block"
        />
        <div className="absolute top-2 left-3 font-mono text-[10px] text-cyan-400/80 bg-black/50 px-2 py-0.5 rounded border border-cyan-500/20 pointer-events-none">
          ELEVATE 5 PPG • REALTIME
        </div>
      </div>
    </div>
  );
}
