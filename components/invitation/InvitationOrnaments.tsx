/** SVG trang trí khung thiệp — không cần ảnh ngoài */

export function InvitationTopFlourish() {
  return (
    <svg
      viewBox="0 0 280 48"
      className="mx-auto h-10 w-full max-w-[220px] text-champagne"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        fillOpacity="0.85"
        d="M140 4c-8 12-22 18-38 18-14 0-26-5-34-14 6 14 20 24 36 24 16 0 30-10 36-24-8 9-20 14-34 14-16 0-30-6-38-18 8 6 18 10 30 10s22-4 30-10c-8 12-22 18-38 18z"
      />
      <path
        stroke="currentColor"
        strokeWidth="0.75"
        fill="none"
        d="M20 38h240M140 38v6"
      />
    </svg>
  );
}

/** Lá trang trí hai bên — tông kem/champagne trên nền tối */
export function InvitationCornerFoliage({ side }: { side: "left" | "right" }) {
  const flip = side === "right" ? "scale-x-[-1]" : "";
  return (
    <svg
      viewBox="0 0 120 420"
      className={`pointer-events-none absolute top-[8%] h-[min(52vh,380px)] w-[min(18vw,88px)] text-champagne/35 ${side === "left" ? "left-0" : "right-0"} ${flip}`}
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        fillOpacity="0.22"
        d="M8 40c28 8 48 32 52 58 4-18 22-38 48-44-20 28-18 62 4 88-22-8-46-4-64 12 14-32 12-68-8-98 18 10 32 28 38 48 6-36 28-58 56-62-24 34-20 78 8 108-28-12-58-8-80 10 22-42 18-92-14-122z"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.45"
        strokeWidth="0.8"
        d="M24 120c40 20 56 72 48 120M52 200c32 24 40 64 32 96"
      />
      <ellipse cx="38" cy="92" rx="14" ry="28" fill="currentColor" fillOpacity="0.12" transform="rotate(-18 38 92)" />
      <ellipse cx="72" cy="260" rx="18" ry="36" fill="currentColor" fillOpacity="0.1" transform="rotate(12 72 260)" />
    </svg>
  );
}

/** Khung viền vàng mảnh quanh thiệp */
export function InvitationGateFrame() {
  return (
    <>
      <div className="invitation-gate-frame-line invitation-gate-frame-line--v invitation-gate-frame-line--left" aria-hidden="true" />
      <div className="invitation-gate-frame-line invitation-gate-frame-line--v invitation-gate-frame-line--right" aria-hidden="true" />
      <div className="invitation-gate-frame-line invitation-gate-frame-line--h invitation-gate-frame-line--top" aria-hidden="true" />
      <div className="invitation-gate-frame-line invitation-gate-frame-line--h invitation-gate-frame-line--bottom" aria-hidden="true" />
    </>
  );
}

export function InvitationSideVine({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 120" className={className} aria-hidden="true">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="0.6"
        d="M12 4c-4 8-4 16 0 24 4 8 4 16 0 24-4 8-4 16 0 24"
      />
      <circle cx="12" cy="28" r="2" fill="currentColor" fillOpacity="0.5" />
      <circle cx="12" cy="60" r="2" fill="currentColor" fillOpacity="0.5" />
      <circle cx="12" cy="92" r="2" fill="currentColor" fillOpacity="0.5" />
    </svg>
  );
}

export function WaxSealIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="sealGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e8d4a8" />
          <stop offset="45%" stopColor="#c9a96e" />
          <stop offset="100%" stopColor="#9a7844" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill="url(#sealGold)" />
      <circle
        cx="32"
        cy="32"
        r="26"
        fill="none"
        stroke="#8b6914"
        strokeOpacity="0.35"
        strokeWidth="1"
      />
      <path
        fill="#fffef8"
        fillOpacity="0.95"
        d="M32 18c-6 8-14 12-14 20 0 5 3 9 8 11-2-6 2-12 6-16 4 4 8 10 6 16 5-2 8-6 8-11 0-8-8-12-14-20z"
      />
    </svg>
  );
}
