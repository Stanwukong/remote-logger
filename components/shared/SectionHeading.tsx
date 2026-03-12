import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  headline: string;
  headlineAccent?: string;
  sub?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  headline,
  headlineAccent,
  sub,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className
      )}
      data-reveal
    >
      {eyebrow && (
        <span className="inline-block text-[11px] font-display font-semibold uppercase tracking-[0.15em] text-text-muted mb-4">
          {eyebrow}
        </span>
      )}
      <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-text-primary tracking-tight leading-[1.1]">
        {headline}
        {headlineAccent && (
          <>
            <br />
            <span className="text-signal">{headlineAccent}</span>
          </>
        )}
      </h2>
      {sub && (
        <p className="mt-4 text-base sm:text-lg text-text-secondary leading-relaxed max-w-2xl mx-auto">
          {sub}
        </p>
      )}
    </div>
  );
}
