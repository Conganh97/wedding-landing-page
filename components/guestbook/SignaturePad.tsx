"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { cn } from "@/lib/utils";

export type SignaturePadHandle = {
  clear: () => void;
  isEmpty: () => boolean;
  toDataURL: () => string | null;
};

type SignaturePadProps = {
  className?: string;
  height?: number;
};

export const SignaturePad = forwardRef<SignaturePadHandle, SignaturePadProps>(
  function SignaturePad({ className, height = 160 }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const drawing = useRef(false);
    const hasStroke = useRef(false);

    const resizeCanvas = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(height * dpr);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = 2.2;
      ctx.strokeStyle = "#c9a96e";
    }, [height]);

    useEffect(() => {
      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);
      return () => window.removeEventListener("resize", resizeCanvas);
    }, [resizeCanvas]);

    const getPoint = (
      e: React.PointerEvent<HTMLCanvasElement>,
    ): { x: number; y: number } => {
      const canvas = canvasRef.current!;
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx) return;
      drawing.current = true;
      hasStroke.current = true;
      canvasRef.current?.setPointerCapture(e.pointerId);
      const { x, y } = getPoint(e);
      ctx.beginPath();
      ctx.moveTo(x, y);
    };

    const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!drawing.current) return;
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx) return;
      const { x, y } = getPoint(e);
      ctx.lineTo(x, y);
      ctx.stroke();
    };

    const end = (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!drawing.current) return;
      drawing.current = false;
      try {
        canvasRef.current?.releasePointerCapture(e.pointerId);
      } catch {
        /* already released */
      }
    };

    useImperativeHandle(ref, () => ({
      clear: () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        hasStroke.current = false;
      },
      isEmpty: () => !hasStroke.current,
      toDataURL: () => {
        if (!hasStroke.current || !canvasRef.current) return null;
        return canvasRef.current.toDataURL("image/png");
      },
    }));

    return (
      <canvas
        ref={canvasRef}
        className={cn(
          "touch-none w-full rounded-sm border border-champagne/35 bg-white",
          className,
        )}
        style={{ height }}
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={end}
        onPointerLeave={end}
        aria-label="Khu vực ký tên"
      />
    );
  },
);
