import Image from "next/image";

import { LandingHeroActions } from "@/components/landing/landing-hero-actions";
import { TamGiangWaterIsland } from "@/components/landing/tam-giang-water-island";
import { LANDING_PAGE_CONTENT } from "@/src/content/landing-page-content";

export function LandingHero() {
  const { hero } = LANDING_PAGE_CONTENT;

  return (
    <section className="lagoon-hero relative isolate min-h-[clamp(43rem,calc(100svh-4.5rem),58rem)] overflow-hidden bg-[var(--lagoon-ink)] text-white">
      <Image
        src={hero.heroImage}
        alt={hero.heroImageAlt}
        fill
        preload
        sizes="100vw"
        className="lagoon-hero-image object-cover"
      />
      <TamGiangWaterIsland
        imageSrc={hero.heroImage}
        imageWidth={1376}
        imageHeight={768}
      />

      <div className="lagoon-hero-scrim absolute inset-0" aria-hidden="true" />
      <div className="lagoon-horizon absolute inset-x-0 top-[43%] z-10" aria-hidden="true" />

      <div className="relative z-20 mx-auto flex min-h-[clamp(43rem,calc(100svh-4.5rem),58rem)] max-w-7xl flex-col justify-end px-4 pb-12 pt-28 sm:px-6 sm:pb-16 lg:px-8 lg:pb-20">
        <div className="max-w-[48rem]">
          <div className="hero-kicker mb-5 flex items-center gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-white/82">
            <span className="h-px w-10 bg-[var(--lagoon-sun)]" aria-hidden="true" />
            <span>Thừa Thiên Huế · Phá Tam Giang</span>
          </div>

          <h1
            aria-label={hero.heading}
            className="hero-headline max-w-[13ch] text-balance font-sans text-[clamp(2.75rem,7vw,5.8rem)] font-semibold leading-[0.98] tracking-[-0.045em] text-white"
          >
            <span className="hero-headline-line block">Khám phá Đầm phá</span>
            <span className="hero-headline-line block text-[var(--lagoon-sun-soft)]">
              Tam Giang cùng
            </span>
            <span className="hero-headline-line block">Chú Huyền</span>
          </h1>

          <div className="hero-support mt-6 grid max-w-[46rem] gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(15rem,0.72fr)] sm:gap-8">
            <p className="text-pretty text-base font-medium leading-relaxed text-white sm:text-lg">
              {hero.subheading}
            </p>
            <p className="text-pretty text-sm leading-relaxed text-white/72">
              {hero.description}
            </p>
          </div>

          <LandingHeroActions />
        </div>

        <div className="hero-caption mt-10 flex items-center gap-3 self-end text-right text-[0.68rem] font-medium uppercase tracking-[0.16em] text-white/60">
          <span className="hidden h-px w-14 bg-white/35 sm:block" aria-hidden="true" />
          <span>Chiều tà trên Phá Tam Giang</span>
        </div>
      </div>
    </section>
  );
}
