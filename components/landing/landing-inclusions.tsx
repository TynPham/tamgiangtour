import { Check, Info } from "lucide-react";
import { LANDING_PAGE_CONTENT } from "@/src/content/landing-page-content";
import { ScrollReveal } from "@/components/landing/scroll-reveal";

export function LandingInclusions() {
  const { inclusions } = LANDING_PAGE_CONTENT;

  return (
    <section
      id="dich-vu"
      aria-labelledby="inclusions-heading"
      className="relative border-b border-border/60 bg-background py-20 sm:py-28 lg:py-36"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal delay={0} direction="right" distance={28} variant="heading" className="mb-14 max-w-3xl space-y-4 text-left sm:mb-20">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <span className="h-px w-6 bg-primary" aria-hidden="true" />
            <span>Quyền lợi & Chuẩn bị</span>
          </div>
          <h2
            id="inclusions-heading"
            className="max-w-[17ch] text-balance font-sans text-3xl font-semibold leading-[1.08] tracking-[-0.035em] text-foreground sm:text-4xl lg:text-5xl"
          >
            Dịch vụ bao gồm &{" "}
            <span className="block sm:inline">Thông tin cần biết</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl">
            Các dịch vụ và lưu ý đã được xác nhận để khách chuẩn bị trước chuyến đi
          </p>
        </ScrollReveal>

        {/* Two-Column Editorial Grid */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Column 1: Inclusions */}
          <ScrollReveal delay={60} direction="up" distance={14} className="lg:col-span-7 space-y-6">
            <div className="pb-3 border-b border-border">
              <span className="font-sans text-xl sm:text-2xl font-bold text-foreground">
                Dịch vụ đã bao gồm
              </span>
            </div>

            <div className="grid grid-cols-1 gap-5">
              {inclusions.included.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3.5"
                >
                  <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary mt-0.5">
                    <Check className="size-3.5 stroke-[2.5]" aria-hidden="true" />
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="font-sans text-sm sm:text-base font-bold text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>

          {/* Column 2: Practical Notes */}
          <ScrollReveal delay={120} direction="up" distance={14} className="lg:col-span-5 space-y-10">
            {/* Practical Preparation Notes */}
            <div className="space-y-3.5 border-l-2 border-primary bg-muted/35 px-5 py-5 sm:px-6">
              <div className="flex items-center gap-2 text-foreground font-sans text-lg font-bold">
                <Info className="size-4 text-primary" aria-hidden="true" />
                <span>Thông tin cần biết</span>
              </div>

              <ul className="space-y-2.5 text-xs sm:text-sm text-muted-foreground">
                {inclusions.practicalNotes.map((note, index) => (
                  <li key={index} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-primary font-bold">•</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        </div>
      </div>

    </section>
  );
}
