import { weddingData } from "@/data/wedding";
import { content } from "@/data/content";
import { formatDate } from "@/lib/utils";
import { NAV_LINKS } from "@/lib/constants";

export function Footer() {
  const coupleName = `${weddingData.couple.groom} & ${weddingData.couple.bride}`;
  const weddingDate = formatDate(weddingData.weddingDate);

  return (
    <footer className="footer-elegant border-t border-champagne/25 py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 text-center">
          <p className="font-serif text-2xl tracking-widest text-charcoal">
            {coupleName}
          </p>
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
