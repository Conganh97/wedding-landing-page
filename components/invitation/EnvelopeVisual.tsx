"use client";

import { motion } from "framer-motion";
import { WaxSealIcon } from "@/components/invitation/InvitationOrnaments";

type EnvelopeVisualProps = {
  isOpening: boolean;
  peekLine?: string;
};

/** Phong bì minh họa — con dấu trên nắp, không che chữ trên thiệp */
export function EnvelopeVisual({ isOpening, peekLine }: EnvelopeVisualProps) {
  return (
    <div className="envelope-scene relative mx-auto h-[168px] w-full max-w-[300px]">
      <motion.div
        className="envelope-inner-letter absolute inset-x-5 bottom-3 z-[1] flex h-[118px] flex-col items-center justify-center rounded-sm px-3 text-center"
        animate={
          isOpening
            ? { y: -72, scale: 1.03, opacity: 1 }
            : { y: 0, scale: 1, opacity: 0.92 }
        }
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="font-serif text-[10px] tracking-[0.35em] text-champagne-dark uppercase">
          Wedding
        </p>
        <div className="my-1.5 h-px w-12 bg-linear-to-r from-transparent via-champagne/70 to-transparent" />
        <p className="font-serif text-xs leading-snug text-charcoal/90 italic">
          {peekLine}
        </p>
      </motion.div>

      <div className="envelope-body absolute inset-x-3 bottom-0 z-[2] h-[108px] rounded-b-lg" />

      <div
        className="absolute inset-x-3 bottom-0 z-[3] h-[54px] overflow-hidden rounded-b-lg"
        aria-hidden="true"
      >
        <div className="envelope-pocket-left absolute bottom-0 left-0 h-full w-[52%]" />
        <div className="envelope-pocket-right absolute right-0 bottom-0 h-full w-[52%]" />
      </div>

      <motion.div
        className="envelope-flap absolute inset-x-3 top-[26px] z-[4] h-[78px]"
        style={{
          clipPath: "polygon(0 0, 100% 0, 50% 100%)",
          transformOrigin: "50% 0%",
        }}
        animate={{ rotateX: isOpening ? -168 : 0 }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      />

      <motion.div
        className="absolute top-[58px] left-1/2 z-[5] h-[52px] w-[52px] -translate-x-1/2 drop-shadow-md"
        animate={
          isOpening ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }
        }
        transition={{ duration: 0.35 }}
        aria-hidden="true"
      >
        <WaxSealIcon />
      </motion.div>
    </div>
  );
}
