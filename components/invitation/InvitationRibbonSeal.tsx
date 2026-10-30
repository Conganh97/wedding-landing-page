"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

type InvitationRibbonSealProps = {
  photoSrc: string;
  photoAlt: string;
  isOpening: boolean;
  onOpen: () => void;
  disabled: boolean;
  hint: string;
};

export function InvitationRibbonSeal({
  photoSrc,
  photoAlt,
  isOpening,
  onOpen,
  disabled,
  hint,
}: InvitationRibbonSealProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="relative mx-auto my-6 w-full max-w-md px-2 sm:my-8">
      <div className="invitation-ribbon absolute inset-x-0 top-1/2 h-[52px] -translate-y-1/2 sm:h-[58px]" aria-hidden="true">
        <div className="invitation-ribbon-stitch absolute inset-x-3 top-1.5 h-px" />
        <div className="invitation-ribbon-stitch absolute inset-x-3 bottom-1.5 h-px" />
      </div>

      <motion.button
        type="button"
        onClick={onOpen}
        disabled={disabled}
        aria-label={hint}
        className="invitation-seal group relative mx-auto flex h-[108px] w-[108px] items-center justify-center rounded-full disabled:cursor-wait sm:h-[120px] sm:w-[120px]"
        animate={
          isOpening
            ? { scale: 1.2, opacity: 0, rotate: 8 }
            : { scale: 1, opacity: 1, rotate: 0 }
        }
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        whileHover={
          !disabled && !shouldReduceMotion ? { scale: 1.04 } : undefined
        }
        whileTap={!disabled && !shouldReduceMotion ? { scale: 0.97 } : undefined}
      >
        <span
          className={`invitation-seal-ring-outer absolute inset-0 rounded-full ${!isOpening && !shouldReduceMotion ? "invitation-seal-pulse" : ""}`}
          aria-hidden="true"
        />
        <span
          className="invitation-seal-ring-mid absolute inset-[5px] rounded-full sm:inset-[6px]"
          aria-hidden="true"
        />
        <span className="relative h-[76px] w-[76px] overflow-hidden rounded-full sm:h-[86px] sm:w-[86px]">
          <Image
            src={photoSrc}
            alt={photoAlt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="120px"
            priority
          />
        </span>
      </motion.button>

      <p className="mt-5 text-center font-serif text-sm italic text-white/75 sm:text-base">
        {hint}
      </p>
    </div>
  );
}
