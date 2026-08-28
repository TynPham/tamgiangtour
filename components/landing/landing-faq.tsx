import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LANDING_PAGE_CONTENT } from "@/src/content/landing-page-content";
import { ScrollReveal } from "@/components/landing/scroll-reveal";

export function LandingFaq() {
  const { faq } = LANDING_PAGE_CONTENT;

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="border-b border-border/60 bg-background py-20 sm:py-28 lg:py-36"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left Column: Sticky Section Header */}
          <div className="lg:col-span-5 space-y-3.5 text-left lg:sticky lg:top-24 lg:self-start">
            <ScrollReveal delay={0} direction="right" distance={28} variant="heading" className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                <span className="h-px w-6 bg-primary" aria-hidden="true" />
                <span>Giải đáp thắc mắc</span>
              </div>
              <h2
                id="faq-heading"
                className="max-w-[13ch] text-balance font-sans text-3xl font-semibold leading-[1.08] tracking-[-0.035em] text-foreground sm:text-4xl lg:text-5xl"
              >
                Câu hỏi thường gặp
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {faq.subheading}
              </p>
            </ScrollReveal>
          </div>

          {/* Right Column: Clean Accordion */}
          <div className="lg:col-span-7">
            <Accordion type="single" collapsible className="w-full border-t border-border/80">
              {faq.items.map((item, index) => (
                <ScrollReveal
                  key={item.id}
                  delay={index * 45}
                  direction="left"
                  distance={20}
                >
                  <AccordionItem
                    value={item.id}
                    className="border-x-0 border-b border-t-0 border-border/80 bg-transparent px-0 transition-[border-color] data-[state=open]:border-primary/55"
                  >
                    <AccordionTrigger className="py-6 text-left font-sans text-sm font-semibold text-foreground hover:no-underline sm:text-base">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed pb-5">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                </ScrollReveal>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
