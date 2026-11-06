import { weddingData } from "@/data/wedding";
import { content } from "@/data/content";
import { formatDate } from "@/lib/utils";
import { NAV_LINKS } from "@/lib/constants";

export function Footer() {
  const { groomShort: groom, brideShort: bride } = weddingData.couple;
  const weddingDate = formatDate(weddingData.weddingDate);

  return (
    <footer className="footer-elegant border-t border-champagne/25 py-8">
      <div className="mx-auto max-w-[430px] px-5">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex flex-col items-center gap-1">
            <span className="font-serif text-xl tracking-[0.12em] text-charcoal sm:text-2xl">
              {groom}
            </span>
            <span className="font-serif text-lg text-champagne sm:text-xl">
              &
            </span>
            <span className="font-serif text-xl tracking-[0.12em] text-charcoal sm:text-2xl">
              {bride}
            </span>
          </div>
          <p className="text-sm text-charcoal-light">{weddingDate}</p>
          <div className="gold-divider" />
          <nav aria-label={content.header.footerNav}>
            <ul className="flex flex-wrap justify-center gap-6">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-charcoal-light transition-colors hover:text-champagne"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <p className="text-xs text-charcoal-light/70">
            {content.footer.tagline}
          </p>
        </div>
      </div>
    </footer>
  );
}
