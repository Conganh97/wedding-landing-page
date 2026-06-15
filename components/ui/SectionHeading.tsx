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
    <div className={cn("mb-12 text-center", className)}>
      <div className="gold-divider mx-auto mb-6" />
      <h2
        id={id}
        className="font-serif text-3xl font-light tracking-wide text-charcoal md:text-4xl lg:text-5xl"
      >
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base text-charcoal-light md:text-lg">
          {subtitle}
        </p>
      )}
      <div className="gold-divider mx-auto mt-6" />
    </div>
  );
}
