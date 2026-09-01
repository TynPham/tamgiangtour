import { Info } from "lucide-react";
import { LANDING_PAGE_CONTENT } from "@/src/content/landing-page-content";
import { ScrollReveal } from "@/components/landing/scroll-reveal";

export function LandingItinerary() {
  const { itinerary } = LANDING_PAGE_CONTENT;

  return (
    <section
      id="lich-trinh"
      aria-labelledby="itinerary-heading"
      className="relative border-b border-border/60 bg-[var(--lagoon-paper)] py-20 sm:py-28 lg:py-36"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left Column: Sticky Section Header on Desktop */}
          <div className="lg:col-span-5 space-y-3.5 text-left lg:sticky lg:top-24 lg:self-start">
            <ScrollReveal delay={0} direction="right" distance={28} variant="heading" className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                <span className="h-px w-6 bg-primary" aria-hidden="true" />
                <span>Chương trình trải nghiệm</span>
              </div>
              <h2
                id="itinerary-heading"
                className="max-w-[14ch] text-balance font-sans text-3xl font-semibold leading-[1.08] tracking-[-0.035em] text-foreground sm:text-4xl lg:text-5xl"
              >
                {itinerary.heading}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {itinerary.subheading}
              </p>

              {/* Operational Note */}
              <div className="pt-4">
                <div className="flex items-start gap-3 border-l-2 border-primary bg-background/45 px-4 py-4 text-xs text-muted-foreground sm:px-5 sm:text-sm">
                  <Info className="size-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="leading-relaxed">{itinerary.note}</p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Flowing Water-Stream Itinerary Journey */}
          <div className="itinerary-stream relative space-y-10 pl-7 before:absolute before:bottom-3 before:left-[0.3rem] before:top-3 before:w-px sm:space-y-12 sm:pl-10 lg:col-span-7">
            {itinerary.stops.map((stop, index) => (
              <ScrollReveal
                key={`${stop.time}-${stop.title}`}
                delay={index * 75}
                direction="left"
                distance={24}
                duration={720}
                className="group relative space-y-2.5 border-b border-border/65 pb-8 last:border-b-0 sm:pb-10"
              >
                {/* Flowing Water Timeline Marker Dot with Ripple Accent */}
                <div
                  className="itinerary-marker absolute -left-[1.9rem] top-2 size-2.5 rounded-full bg-primary ring-[5px] ring-[var(--lagoon-paper)] sm:-left-[2.45rem]"
                  aria-hidden="true"
                />

                <div className="flex flex-wrap items-baseline gap-x-3.5 gap-y-1">
                  <span className="font-mono text-2xl font-semibold tracking-[-0.04em] text-primary sm:text-3xl">
                    {stop.time}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {stop.highlight}
                  </span>
                </div>

                <h3 className="max-w-[28ch] text-pretty font-sans text-lg font-semibold leading-snug text-foreground sm:text-xl">
                  {stop.title}
                </h3>

                <p className="text-sm leading-relaxed text-muted-foreground">
                  {stop.description}
                </p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}
