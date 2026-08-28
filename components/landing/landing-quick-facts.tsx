import { LANDING_PAGE_CONTENT } from "@/src/content/landing-page-content";

export function LandingQuickFacts() {
  const { quickFacts } = LANDING_PAGE_CONTENT;

  return (
    <section
      aria-label="Thông tin nhanh về tour"
      className="relative border-b border-border/70 bg-[var(--lagoon-paper)] py-7 sm:py-9"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-x-5 gap-y-7 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-border/70">
          {quickFacts.map((fact, index) => (
            <div
              key={fact.label}
              className={`hero-quick-fact min-w-0 lg:px-8 ${
                index === 0 ? "lg:pl-0" : ""
              } ${index === quickFacts.length - 1 ? "lg:pr-0" : ""}`}
            >
              <div className="space-y-1.5">
                <span className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-primary">
                  {fact.label}
                </span>
                <p className="text-pretty font-sans text-lg font-semibold tracking-[-0.02em] text-foreground sm:text-xl">
                  {fact.value}
                </p>
              </div>
              {fact.subtext && (
                <p className="mt-2 hidden text-xs leading-relaxed text-muted-foreground sm:block">
                  {fact.subtext}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
