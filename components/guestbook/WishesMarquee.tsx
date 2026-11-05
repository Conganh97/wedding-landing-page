"use client";

import { useReducedMotion } from "framer-motion";
import type { GuestbookEntry } from "@/types";
import { content } from "@/data/content";

const MARQUEE_MIN_ITEMS = 3;

function WishCard({ entry }: { entry: GuestbookEntry }) {
  return (
    <article className="card-elegant h-full w-[min(85vw,300px)] shrink-0 rounded-sm p-4 text-left sm:w-[300px] md:p-5">
      <p className="font-serif text-lg text-charcoal">
        {entry.name.trim() || content.wishes.anonymous}
      </p>
      <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-charcoal-light italic">
        &ldquo;{entry.message}&rdquo;
      </p>
    </article>
  );
}

type WishesMarqueeProps = {
  entries: GuestbookEntry[];
  highlightId?: string | null;
};

export function WishesMarquee({ entries, highlightId }: WishesMarqueeProps) {
  const shouldReduceMotion = useReducedMotion();
  const messages = entries.filter((e) => e.message.trim().length > 0);

  if (messages.length === 0) {
    return (
      <p className="text-center text-sm text-charcoal-light md:text-base">
        {content.wishes.empty}
      </p>
    );
  }

  const useAutoMarquee =
    messages.length >= MARQUEE_MIN_ITEMS && !shouldReduceMotion;

  const renderItem = (entry: GuestbookEntry, keySuffix: string) => (
    <li
      key={`${entry.id}${keySuffix}`}
      className={`snap-center ${entry.id === highlightId ? "rounded-sm ring-2 ring-champagne/50 ring-offset-2 ring-offset-linen" : ""}`}
    >
      <WishCard entry={entry} />
    </li>
  );

  if (useAutoMarquee) {
    const loop = [...messages, ...messages];
    return (
      <div
        className="wishes-marquee-mask relative w-full overflow-hidden"
        aria-live="polite"
      >
        <ul
          className="wishes-marquee-track flex w-max gap-4 pr-4"
          style={{
            animationDuration: `${Math.max(32, messages.length * 10)}s`,
          }}
        >
          {loop.map((entry, index) =>
            renderItem(entry, `-loop-${index}`),
          )}
        </ul>
      </div>
    );
  }

  return (
    <ul className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:thin]">
      {messages.map((entry) => renderItem(entry, ""))}
    </ul>
  );
}
