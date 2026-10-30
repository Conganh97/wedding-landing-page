"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { content } from "@/data/content";

type CountdownProps = {
  targetDate: string;
  variant?: "hero" | "section";
};

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const emptyTimeLeft: TimeLeft = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
};

function calculateTimeLeft(targetDate: string): TimeLeft {
  const difference = new Date(targetDate).getTime() - Date.now();

  if (difference <= 0) {
    return emptyTimeLeft;
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

const units: { key: keyof TimeLeft; label: string }[] = [
  { key: "days", label: content.countdown.days },
  { key: "hours", label: content.countdown.hours },
  { key: "minutes", label: content.countdown.minutes },
  { key: "seconds", label: content.countdown.seconds },
];

export function Countdown({ targetDate, variant = "hero" }: CountdownProps) {
  const isHero = variant === "hero";
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(emptyTimeLeft);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setTimeLeft(calculateTimeLeft(targetDate));

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div
      className="flex flex-wrap justify-center gap-4 sm:gap-6"
      aria-live="polite"
      aria-label={content.countdown.ariaLabel}
    >
      {units.map((unit, index) => (
        <motion.div
          key={unit.key}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: shouldReduceMotion ? 0 : index * 0.1,
          }}
          className={
            isHero
              ? "flex min-w-[72px] flex-col items-center rounded-sm border border-white/30 bg-white/10 px-4 py-3 backdrop-blur-sm sm:min-w-[88px] sm:px-6 sm:py-4"
              : "flex min-w-[72px] flex-col items-center rounded-sm border border-champagne/30 bg-pearl/90 px-4 py-3 shadow-sm sm:min-w-[88px] sm:px-6 sm:py-4"
          }
        >
          <span
            className={
              isHero
                ? "font-serif text-2xl font-light text-white sm:text-3xl md:text-4xl"
                : "font-serif text-2xl font-light text-charcoal sm:text-3xl md:text-4xl"
            }
            suppressHydrationWarning
          >
            {String(timeLeft[unit.key]).padStart(2, "0")}
          </span>
          <span
            className={
              isHero
                ? "mt-1 text-xs tracking-widest text-white/80 uppercase sm:text-sm"
                : "mt-1 text-xs tracking-widest text-charcoal-light uppercase sm:text-sm"
            }
          >
            {unit.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
