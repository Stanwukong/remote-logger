"use client";

import { useRef, useEffect } from "react";

interface Node {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  phase: number;
  speed: number;
}

interface Edge {
  from: number;
  to: number;
}

interface Pulse {
  edge: number;
  progress: number;
  speed: number;
}

export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    let width = 0;
    let height = 0;

    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const pulses: Pulse[] = [];

    // Check reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx!.scale(dpr, dpr);
    }

    function generateNodes() {
      nodes.length = 0;
      edges.length = 0;
      const count = Math.min(40, Math.floor((width * height) / 25000));
      const margin = 40;

      // Poisson-disc-ish distribution
      for (let i = 0; i < count; i++) {
        const x = margin + Math.random() * (width - margin * 2);
        const y = margin + Math.random() * (height - margin * 2);
        nodes.push({
          x,
          y,
          baseX: x,
          baseY: y,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          phase: Math.random() * Math.PI * 2,
          speed: 0.0003 + Math.random() * 0.0003,
        });
      }

      // Connect nearby nodes
      const maxDist = Math.min(width, height) * 0.25;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist && Math.random() < 0.3) {
            edges.push({ from: i, to: j });
          }
        }
      }
    }

    function spawnPulse() {
      if (edges.length === 0) return;
      pulses.push({
        edge: Math.floor(Math.random() * edges.length),
        progress: 0,
        speed: 0.003 + Math.random() * 0.004,
      });
    }

    function draw(_time: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      // Update node positions (gentle drift)
      if (!prefersReducedMotion) {
        for (const node of nodes) {
          node.phase += node.speed;
          node.x = node.baseX + Math.sin(node.phase) * 30;
          node.y = node.baseY + Math.cos(node.phase * 0.7) * 20;
        }
      }

      // Draw edges
      ctx.lineWidth = 0.5;
      for (const edge of edges) {
        const a = nodes[edge.from];
        const b = nodes[edge.to];
        ctx.strokeStyle = "rgba(36, 51, 82, 0.6)";
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      // Draw nodes
      for (const node of nodes) {
        ctx.fillStyle = "rgba(45, 66, 102, 0.8)";
        ctx.beginPath();
        ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw and update pulses
      if (!prefersReducedMotion) {
        for (let i = pulses.length - 1; i >= 0; i--) {
          const pulse = pulses[i];
          pulse.progress += pulse.speed;

          if (pulse.progress >= 1) {
            pulses.splice(i, 1);
            continue;
          }

          const edge = edges[pulse.edge];
          if (!edge) continue;
          const a = nodes[edge.from];
          const b = nodes[edge.to];
          const px = a.x + (b.x - a.x) * pulse.progress;
          const py = a.y + (b.y - a.y) * pulse.progress;

          ctx.fillStyle = `rgba(0, 217, 126, ${0.8 - pulse.progress * 0.6})`;
          ctx.beginPath();
          ctx.arc(px, py, 3, 0, Math.PI * 2);
          ctx.fill();

          // Glow
          ctx.fillStyle = `rgba(0, 217, 126, ${0.15 - pulse.progress * 0.1})`;
          ctx.beginPath();
          ctx.arc(px, py, 8, 0, Math.PI * 2);
          ctx.fill();
        }

        // Spawn new pulses periodically
        if (Math.random() < 0.01) spawnPulse();
      }

      animRef.current = requestAnimationFrame(draw);
    }

    resize();
    generateNodes();

    // Spawn initial pulses
    for (let i = 0; i < 3; i++) spawnPulse();

    if (prefersReducedMotion) {
      // Draw single static frame
      draw(0);
    } else {
      animRef.current = requestAnimationFrame(draw);
    }

    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resize();
        generateNodes();
        for (let i = 0; i < 3; i++) spawnPulse();
      }, 200);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
      data-hero-canvas
    />
  );
}
