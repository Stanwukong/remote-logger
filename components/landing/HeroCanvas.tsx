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
  reverse: boolean;
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
      const count = Math.min(55, Math.floor((width * height) / 16000));
      const margin = 5;

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
      const maxDist = Math.min(width, height) * 0.28;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist && Math.random() < 0.38) {
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
        speed: 0.003 + Math.random() * 0.005,
        reverse: Math.random() < 0.3,
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
        ctx.strokeStyle = "rgba(36, 51, 82, 0.5)";
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      // Draw nodes with subtle glow
      for (const node of nodes) {
        ctx.fillStyle = "rgba(45, 66, 102, 0)";
        ctx.beginPath();
        ctx.arc(node.x, node.y, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "rgba(45, 66, 102, 0)";
        ctx.beginPath();
        ctx.arc(node.x, node.y, 2.5, 0, Math.PI * 2);
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
          const startNode = pulse.reverse
            ? nodes[edge.to]
            : nodes[edge.from];
          const endNode = pulse.reverse
            ? nodes[edge.from]
            : nodes[edge.to];
          const px =
            startNode.x + (endNode.x - startNode.x) * pulse.progress;
          const py =
            startNode.y + (endNode.y - startNode.y) * pulse.progress;

          // Trailing glow line from start to current position
          const trail = ctx.createLinearGradient(
            startNode.x,
            startNode.y,
            px,
            py
          );
          trail.addColorStop(0, "rgba(0, 217, 126, 0)");
          trail.addColorStop(
            1,
            `rgba(0, 217, 126, ${0.5 - pulse.progress * 0.35})`
          );
          ctx.strokeStyle = trail;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(startNode.x, startNode.y);
          ctx.lineTo(px, py);
          ctx.stroke();

          // Outer glow halo
          ctx.fillStyle = `rgba(0, 217, 126, ${0.08 - pulse.progress * 0.05})`;
          ctx.beginPath();
          ctx.arc(px, py, 22, 0, Math.PI * 2);
          ctx.fill();

          // Mid glow
          ctx.fillStyle = `rgba(0, 217, 126, ${0.3 - pulse.progress * 0.2})`;
          ctx.beginPath();
          ctx.arc(px, py, 11, 0, Math.PI * 2);
          ctx.fill();

          // Core bright dot
          ctx.fillStyle = `rgba(0, 217, 126, ${1.0 - pulse.progress * 0.3})`;
          ctx.beginPath();
          ctx.arc(px, py, 3.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Spawn new pulses frequently
        if (Math.random() < 0.045) spawnPulse();
      }

      animRef.current = requestAnimationFrame(draw);
    }

    resize();
    generateNodes();

    // Spawn initial pulses
    for (let i = 0; i < 10; i++) spawnPulse();

    if (prefersReducedMotion) {
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
        for (let i = 0; i < 10; i++) spawnPulse();
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
