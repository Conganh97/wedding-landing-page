"use client";

import { useEffect, useRef } from "react";

type Star = {
  x: number;
  y: number;
  r: number;
  a: number;
  tw: number;
  s: number;
};

export function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let stars: Star[] = [];
    let frame = 0;
    let raf = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round((window.innerWidth * window.innerHeight) / 1400);
      stars = Array.from({ length: count }, () => {
        const band = Math.random();
        const y =
          band < 0.42
            ? Math.pow(Math.random(), 1.6) * window.innerHeight * 0.38
            : band > 0.7
              ? window.innerHeight * (0.72 + Math.random() * 0.28)
              : Math.random() * window.innerHeight;
        return {
          x: Math.random() * window.innerWidth,
          y,
          r: Math.random() * 1.35 + 0.15,
          a: Math.random() * 0.75 + 0.15,
          tw: Math.random() * Math.PI * 2,
          s: Math.random() * 0.015 + 0.004,
        };
      });
    };

    const draw = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      context.clearRect(0, 0, w, h);

      const sky = context.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, "#02030a");
      sky.addColorStop(0.45, "#070b1c");
      sky.addColorStop(1, "#02030a");
      context.fillStyle = sky;
      context.fillRect(0, 0, w, h);

      for (const x of [0.38, 0.5, 0.62]) {
        const ray = context.createLinearGradient(w * x, 0, w * x, h * 0.85);
        ray.addColorStop(0, "rgba(190, 206, 255, 0.1)");
        ray.addColorStop(1, "rgba(190, 206, 255, 0)");
        context.fillStyle = ray;
        context.fillRect(w * x - 18, 0, 36, h * 0.85);
      }

      for (const star of stars) {
        const alpha = reduce ? star.a : star.a * (0.55 + Math.sin(frame * star.s + star.tw) * 0.45);
        context.fillStyle = `rgba(244, 246, 253, ${alpha})`;
        context.beginPath();
        context.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        context.fill();
      }

      frame += 1;
      if (!reduce) raf = window.requestAnimationFrame(draw);
    };

    const onResize = () => {
      resize();
      if (reduce) draw();
    };

    resize();
    draw();
    window.addEventListener("resize", onResize);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
