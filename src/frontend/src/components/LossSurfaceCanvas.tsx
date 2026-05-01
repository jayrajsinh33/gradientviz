import { GRID_SIZE } from "@/hooks/useSimulation";
import type { LossSurfacePoint } from "@/types/simulation";
import { useCallback, useEffect, useRef } from "react";

interface LossSurfaceCanvasProps {
  lossSurface: LossSurfacePoint[];
  w1: number;
  w2: number;
  gradW1Dir: number;
  gradW2Dir: number;
  posHistory: { w1: number; w2: number }[];
}

const W_RANGE = 2.0;

function lossToColor(normalizedLoss: number): [number, number, number] {
  // Heatmap: cool (blue/purple) = low loss, warm (orange/red) = high loss
  const t = Math.max(0, Math.min(1, normalizedLoss));
  if (t < 0.25) {
    const s = t / 0.25;
    return [
      Math.round(30 + s * 20),
      Math.round(30 + s * 40),
      Math.round(160 + s * 70),
    ];
  }
  if (t < 0.5) {
    const s = (t - 0.25) / 0.25;
    return [
      Math.round(50 + s * 20),
      Math.round(70 + s * 100),
      Math.round(230 - s * 80),
    ];
  }
  if (t < 0.75) {
    const s = (t - 0.5) / 0.25;
    return [
      Math.round(70 + s * 160),
      Math.round(170 - s * 70),
      Math.round(150 - s * 100),
    ];
  }
  const s = (t - 0.75) / 0.25;
  return [
    Math.round(230 + s * 20),
    Math.round(100 - s * 60),
    Math.round(50 - s * 30),
  ];
}

export function LossSurfaceCanvas({
  lossSurface,
  w1,
  w2,
  gradW1Dir,
  gradW2Dir,
  posHistory,
}: LossSurfaceCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || lossSurface.length === 0) return;

    const dpr = window.devicePixelRatio || 1;
    const width = container.clientWidth;
    const height = container.clientHeight || width * 0.75;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    // Padding for axes labels
    const pad = { top: 10, right: 10, bottom: 32, left: 36 };
    const plotW = width - pad.left - pad.right;
    const plotH = height - pad.top - pad.bottom;

    ctx.clearRect(0, 0, width, height);

    // Pre-build loss grid for normalization
    const losses = lossSurface.map((p) => p.loss);
    const minLoss = Math.min(...losses);
    const maxLoss = Math.max(...losses);
    const lossRange = maxLoss - minLoss || 1;

    const cellW = plotW / GRID_SIZE;
    const cellH = plotH / GRID_SIZE;

    // Build sorted index: w1 major, w2 minor
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        const idx = i * GRID_SIZE + j;
        const pt = lossSurface[idx];
        if (!pt) continue;
        const norm = (pt.loss - minLoss) / lossRange;
        const [r, g, b] = lossToColor(norm);
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        const x = pad.left + i * cellW;
        const y = pad.top + (GRID_SIZE - 1 - j) * cellH;
        ctx.fillRect(x, y, Math.ceil(cellW) + 1, Math.ceil(cellH) + 1);
      }
    }

    // World → canvas coordinate helpers
    const toCanvasX = (wv: number) =>
      pad.left + ((wv + W_RANGE) / (2 * W_RANGE)) * plotW;
    const toCanvasY = (wv: number) =>
      pad.top + (1 - (wv + W_RANGE) / (2 * W_RANGE)) * plotH;

    // Draw path history
    if (posHistory.length > 1) {
      ctx.save();
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = "rgba(255,255,255,0.45)";
      ctx.beginPath();
      const first = posHistory[0];
      ctx.moveTo(toCanvasX(first.w1), toCanvasY(first.w2));
      for (let k = 1; k < posHistory.length; k++) {
        const pt = posHistory[k];
        ctx.lineTo(toCanvasX(pt.w1), toCanvasY(pt.w2));
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw dots along path (every ~5 steps)
      posHistory.forEach((pt, k) => {
        if (k % 5 !== 0 && k !== posHistory.length - 1) return;
        const cx = toCanvasX(pt.w1);
        const cy = toCanvasY(pt.w2);
        const progress = k / (posHistory.length - 1);
        const alpha = 0.3 + progress * 0.5;
        ctx.beginPath();
        ctx.arc(cx, cy, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100, 200, 255, ${alpha})`;
        ctx.fill();
      });
      ctx.restore();
    }

    // Draw gradient arrow
    const cx = toCanvasX(w1);
    const cy = toCanvasY(w2);
    const gradMag = Math.sqrt(gradW1Dir * gradW1Dir + gradW2Dir * gradW2Dir);
    if (gradMag > 0.001) {
      const arrowLen = Math.min(40, (gradMag / 4) * plotW * 0.1 + 15);
      const dx = (gradW1Dir / gradMag) * arrowLen;
      const dy = (-gradW2Dir / gradMag) * arrowLen;
      ctx.save();
      ctx.strokeStyle = "rgba(255, 210, 80, 0.9)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + dx, cy + dy);
      // Arrowhead
      const angle = Math.atan2(dy, dx);
      const headLen = 7;
      ctx.lineTo(
        cx + dx - headLen * Math.cos(angle - Math.PI / 6),
        cy + dy - headLen * Math.sin(angle - Math.PI / 6),
      );
      ctx.moveTo(cx + dx, cy + dy);
      ctx.lineTo(
        cx + dx - headLen * Math.cos(angle + Math.PI / 6),
        cy + dy - headLen * Math.sin(angle + Math.PI / 6),
      );
      ctx.stroke();
      ctx.restore();
    }

    // Draw current position marker
    ctx.save();
    ctx.shadowColor = "rgba(110, 200, 255, 0.8)";
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.strokeStyle = "rgba(110, 200, 255, 0.9)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    // Axis labels
    ctx.save();
    ctx.fillStyle = "rgba(200, 200, 210, 0.7)";
    ctx.font = "10px monospace";
    ctx.textAlign = "center";
    // X-axis ticks
    for (const v of [-2, -1, 0, 1, 2]) {
      const x = toCanvasX(v);
      ctx.fillText(String(v), x, height - 4);
      ctx.fillStyle = "rgba(255,255,255,0.08)";
      ctx.beginPath();
      ctx.moveTo(x, pad.top);
      ctx.lineTo(x, pad.top + plotH);
      ctx.stroke();
      ctx.fillStyle = "rgba(200, 200, 210, 0.7)";
    }
    // Y-axis ticks
    ctx.textAlign = "right";
    for (const v of [-2, -1, 0, 1, 2]) {
      const y = toCanvasY(v);
      ctx.fillText(String(v), pad.left - 4, y + 4);
    }
    // Axis labels
    ctx.fillStyle = "rgba(200, 200, 210, 0.5)";
    ctx.font = "11px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("w₁", pad.left + plotW / 2, height - 2);
    ctx.save();
    ctx.translate(10, pad.top + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("w₂", 0, 0);
    ctx.restore();
    ctx.restore();
  }, [lossSurface, w1, w2, gradW1Dir, gradW2Dir, posHistory]);

  useEffect(() => {
    draw();
  }, [draw]);

  useEffect(() => {
    const observer = new ResizeObserver(() => draw());
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [draw]);

  return (
    <div ref={containerRef} className="w-full h-full min-h-[300px]">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
