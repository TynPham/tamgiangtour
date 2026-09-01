import Image from "next/image";
import { LANDING_PAGE_CONTENT } from "@/src/content/landing-page-content";
import { ScrollReveal } from "@/components/landing/scroll-reveal";
import { WaterImageReveal } from "@/components/landing/water-primitives";

const GALLERY_LAYOUT = [
  "sm:col-span-2 lg:col-span-4 lg:row-span-2 min-h-[28rem] lg:min-h-[42rem]",
  "lg:col-span-2 min-h-[22rem] lg:min-h-[20rem]",
  "lg:col-span-2 min-h-[22rem] lg:min-h-[20rem]",
  "lg:col-span-3 min-h-[24rem]",
  "lg:col-span-3 min-h-[22rem]",
  "sm:col-span-2 lg:col-span-6 min-h-[24rem] lg:min-h-[28rem]",
] as const;

export function LandingGallery() {
  const { gallery } = LANDING_PAGE_CONTENT;

  return (
    <section
      id="khoanh-khac"
      aria-labelledby="gallery-heading"
      className="relative border-b border-border/60 bg-background py-20 sm:py-28 lg:py-36"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal delay={0} direction="right" distance={28} variant="heading" className="mb-14 max-w-3xl space-y-4 text-left sm:mb-20">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <span className="h-px w-6 bg-primary" aria-hidden="true" />
            <span>Khoảnh khắc thực tế</span>
          </div>
          <h2
            id="gallery-heading"
            className="max-w-[15ch] text-balance font-sans text-3xl font-semibold leading-[1.08] tracking-[-0.035em] text-foreground sm:text-4xl lg:text-5xl"
          >
            Hình ảnh chân thực{" "}
            <span className="block sm:inline">từ đầm phá</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl">
            {gallery.description}
          </p>
        </ScrollReveal>

        {/* Editorial Photographic Mosaic with Water Image Reveals */}
        <div className="grid auto-rows-[minmax(10rem,auto)] grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6 lg:gap-4">
          {gallery.photos.map((photo, index) => (
            <WaterImageReveal
              key={photo.id}
              delay={(index % 3) * 90}
              className={`group relative flex flex-col justify-end overflow-hidden bg-muted ${GALLERY_LAYOUT[index] ?? "min-h-[22rem]"}`}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className={`${photo.imagePosition === "bottom" ? "object-bottom" : "object-center"} object-cover transition-transform duration-700 ease-out group-hover:scale-104`}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-transparent transition-opacity duration-300" />

              {/* Tag in Top Corner */}
              <div className="absolute top-3.5 left-3.5">
                <span className="border-l border-[var(--lagoon-sun)] pl-2.5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-white/90">
                  {photo.tag}
                </span>
              </div>

              {/* Caption in Bottom Corner */}
              <div className="relative p-4 sm:p-5 text-white">
                <p className="font-sans text-xs sm:text-sm font-medium leading-snug drop-shadow-md text-balance">
                  {photo.caption}
                </p>
              </div>
            </WaterImageReveal>
          ))}
        </div>
      </div>

    </section>
  );
}
