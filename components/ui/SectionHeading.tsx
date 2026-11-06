import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  title: string;
  subtitle?: string;
  className?: string;
  id?: string;
};

export function SectionHeading({
  title,
  subtitle,
  className,
  id,
}: SectionHeadingProps) {
  return (
    <div className={cn("mb-8 text-center", className)}>
      <p className="text-[11px] tracking-[0.42em] text-champagne/80 uppercase">✦</p>
      <h2
        id={id}
        className="mt-3 font-serif text-[1.85rem] font-light tracking-wide text-charcoal"
      >
        {title}
      </h2>
      {subtitle && (
        <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-charcoal-light">
          {subtitle}
        </p>
      )}
    </div>
  );
}
