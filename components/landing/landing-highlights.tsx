import Image from "next/image";
import { LANDING_PAGE_CONTENT } from "@/src/content/landing-page-content";
import { ScrollReveal } from "@/components/landing/scroll-reveal";
import { WaterDivider, WaterImageReveal } from "@/components/landing/water-primitives";

export function LandingHighlights() {
  const { highlights } = LANDING_PAGE_CONTENT;
  const [leadItem, itemTwo, itemThree] = highlights.items;

  return (
    <section
      id="trai-nghiem"
      aria-labelledby="highlights-heading"
      className="relative overflow-hidden border-b border-border/60 bg-background py-20 sm:py-28 lg:py-36"
    >
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal delay={0} direction="right" distance={28} variant="heading" className="mb-14 max-w-3xl space-y-4 text-left sm:mb-20">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <span className="h-px w-6 bg-primary" aria-hidden="true" />
            <span>Trải nghiệm đặc sắc</span>
          </div>
          <h2
            id="highlights-heading"
            className="max-w-[18ch] text-balance font-sans text-3xl font-semibold leading-[1.08] tracking-[-0.035em] text-foreground sm:text-4xl lg:text-5xl"
          >
            Những khoảnh khắc{" "}
            <span className="block sm:inline">không thể bỏ lỡ</span>
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {highlights.description}
          </p>
        </ScrollReveal>

        <div className="space-y-16 sm:space-y-24 lg:space-y-28">
          {/* Lead Feature: SUP Sunset with Water Image Reveal */}
          {leadItem && (
            <WaterImageReveal delay={60} className="group relative lg:mr-[7%]">
              <div className="relative aspect-[16/11] w-full overflow-hidden bg-muted sm:aspect-[21/9] lg:aspect-[24/10]">
                <Image
                  src={leadItem.imageSrc}
                  alt={leadItem.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 85vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-103"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent lg:hidden" />
                <div className="absolute bottom-5 left-5 right-5 text-white lg:hidden space-y-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-white/90">
                    {leadItem.tag}
                  </span>
                  <h3 className="font-sans text-xl font-bold leading-snug">
                    {leadItem.title}
                  </h3>
                  <p className="text-xs text-white/80 line-clamp-2">
                    {leadItem.description}
                  </p>
                </div>
              </div>

              {/* Desktop Floating Story Block */}
              <div className="absolute -bottom-12 right-[-8%] hidden max-w-md space-y-2 border-l-2 border-primary bg-[color-mix(in_oklch,var(--background)_96%,transparent)] p-7 backdrop-blur-sm lg:block">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                  {leadItem.tag}
                </span>
                <h3 className="font-sans text-xl font-bold tracking-tight text-foreground leading-snug">
                  {leadItem.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {leadItem.description}
                </p>
              </div>
            </WaterImageReveal>
          )}

          {/* Asymmetric Duo: Cross-Reveal with Water Mask */}
          <div className="grid grid-cols-1 items-start gap-14 pt-5 lg:grid-cols-12 lg:gap-16 lg:pt-10">
            {/* Story 2: Fishing on Lagoon */}
            {itemTwo && (
              <ScrollReveal delay={100} direction="right" distance={28} duration={780} className="group space-y-5 lg:col-span-7">
                <div className="relative aspect-[5/4] w-full overflow-hidden bg-muted sm:aspect-[4/3]">
                  <Image
                    src={itemTwo.imageSrc}
                    alt={itemTwo.imageAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-103"
                  />
                </div>
                <div className="space-y-2 max-w-lg">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                    {itemTwo.tag}
                  </span>
                  <h3 className="font-sans text-xl sm:text-2xl font-bold tracking-tight text-foreground leading-snug">
                    {itemTwo.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {itemTwo.description}
                  </p>
                </div>
              </ScrollReveal>
            )}

            {/* Story 3: Seafood BBQ Feast */}
            {itemThree && (
              <ScrollReveal delay={180} direction="left" distance={28} duration={820} className="group space-y-5 lg:col-span-5 lg:mt-28">
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted sm:aspect-[4/3] lg:aspect-[4/5]">
                  <Image
                    src={itemThree.imageSrc}
                    alt={itemThree.imageAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-103"
                  />
                </div>
                <div className="space-y-2 max-w-lg">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                    {itemThree.tag}
                  </span>
                  <h3 className="font-sans text-xl sm:text-2xl font-bold tracking-tight text-foreground leading-snug">
                    {itemThree.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {itemThree.description}
                  </p>
                </div>
              </ScrollReveal>
            )}
          </div>
        </div>
      </div>

      {/* Water Contour Divider at Bottom */}
      <div className="mt-16 sm:mt-24">
        <WaterDivider variant="contour" />
      </div>
    </section>
  );
}
