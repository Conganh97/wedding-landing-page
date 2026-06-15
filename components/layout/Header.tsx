"use client";

import { useEffect, useState } from "react";
import { weddingData } from "@/data/wedding";
import { content } from "@/data/content";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const coupleName = `${weddingData.couple.groom} & ${weddingData.couple.bride}`;

  return (
    <header
      className={cn(
        "fixed top-0 right-0 left-0 z-50 transition-all duration-300",
        isScrolled
          ? "border-b border-champagne/15 bg-pearl/90 shadow-sm backdrop-blur-md"
          : "bg-transparent",
      )}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-sm focus:bg-champagne focus:px-4 focus:py-2 focus:text-white"
      >
        {content.header.skipToContent}
      </a>

      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a
          href="#home"
          className="font-serif text-base tracking-widest text-charcoal transition-colors hover:text-champagne md:text-lg"
        >
          {coupleName}
        </a>

        <nav
          className="hidden items-center gap-8 md:flex"
          aria-label={content.header.mainNav}
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm tracking-wide text-charcoal-light transition-colors hover:text-champagne"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-sm md:hidden"
          aria-label={isOpen ? content.header.closeMenu : content.header.openMenu}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="sr-only">
            {isOpen ? content.header.close : content.header.menu}
          </span>
          <svg
            className="h-6 w-6 text-charcoal"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      <nav
        id="mobile-menu"
        className={cn(
          "border-t border-champagne/20 bg-linen/95 md:hidden",
          isOpen ? "block" : "hidden",
        )}
        aria-label={content.header.mobileNav}
      >
        <ul className="flex flex-col px-4 py-4">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="block py-3 text-sm tracking-wide text-charcoal-light transition-colors hover:text-champagne"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
