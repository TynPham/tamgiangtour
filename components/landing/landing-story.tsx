import Image from "next/image";
import { LANDING_PAGE_CONTENT } from "@/src/content/landing-page-content";
import { ScrollReveal } from "@/components/landing/scroll-reveal";

export function LandingStory() {
  const { familyStory } = LANDING_PAGE_CONTENT;

  return (
    <section
      id="cau-chuyen"
      aria-labelledby="story-heading"
      className="relative overflow-hidden border-b border-border/60 bg-muted/35 py-20 sm:py-28 lg:py-36"
    >
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10 lg:items-center">
          {/* Left Column: Portrait with Directional Reveal */}
          <div className="lg:col-span-6 lg:pr-10">
            <ScrollReveal delay={40} direction="right" distance={30} duration={900} variant="image" className="relative mx-auto max-w-md lg:max-w-none">
              <div className="group relative aspect-[3/4] overflow-hidden bg-muted">
                <Image
                  src={familyStory.imageSrc}
                  alt={familyStory.imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 42vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-103"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <p className="font-sans font-bold text-base sm:text-lg drop-shadow-md">
                    Phá Tam Giang
                  </p>
                  <p className="text-xs text-white/80 drop-shadow-sm font-sans mt-0.5">
                    Không gian gia đình làm việc và đón khách
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Story & Pull Quote with Staggered Upward Reveal */}
          <div className="space-y-7 text-left lg:col-span-6 lg:-ml-10 lg:border-l lg:border-border/80 lg:bg-background/80 lg:px-10 lg:py-12">
            <ScrollReveal delay={80} direction="left" distance={26} duration={720} variant="heading" className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                <span className="h-px w-6 bg-primary" aria-hidden="true" />
                <span>{familyStory.badge}</span>
              </div>
              <h2
                id="story-heading"
                className="max-w-[17ch] text-balance font-sans text-3xl font-semibold leading-[1.08] tracking-[-0.035em] text-foreground sm:text-4xl lg:text-5xl"
              >
                {familyStory.heading}
              </h2>
              <p className="text-base sm:text-lg text-foreground/80 leading-relaxed text-balance font-medium">
                {familyStory.subheading}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={150} direction="left" distance={20} duration={720} className="space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {familyStory.paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </ScrollReveal>

          </div>
        </div>
      </div>

    </section>
  );
}
