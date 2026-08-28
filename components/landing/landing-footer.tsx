import Link from "next/link";
import { Waves, Phone, MessageCircle, MapPin } from "lucide-react";
import { LANDING_PAGE_CONTENT } from "@/src/content/landing-page-content";

export function LandingFooter() {
  const { footer, contact } = LANDING_PAGE_CONTENT;

  return (
    <footer className="border-t border-white/10 bg-[var(--lagoon-ink)] text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 lg:gap-14">
          {/* Brand & Mission Column */}
          <div className="md:col-span-5 space-y-4">
            <Link
              href="/vi"
              className="group flex items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--lagoon-sun)]"
            >
              <div className="flex size-9 items-center justify-center border-y border-[var(--lagoon-sun)] text-[var(--lagoon-sun)]">
                <Waves className="size-5" aria-hidden="true" />
              </div>
              <span className="font-sans text-lg font-semibold tracking-[-0.02em] text-white sm:text-xl">
                {footer.brandName}
              </span>
            </Link>
            <p className="max-w-sm text-xs leading-relaxed text-white/65 sm:text-sm">
              {footer.brandTagline}
            </p>
            <div className="space-y-2 pt-2 text-xs text-white/60">
              <div className="flex items-center gap-2.5">
                <MapPin className="size-3.5 text-primary shrink-0" aria-hidden="true" />
                <span>{contact.mapsAddress}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="size-3.5 text-primary shrink-0" aria-hidden="true" />
                <span>Hotline: {contact.phoneDisplay}</span>
              </div>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--lagoon-sun)]">
              Khám phá trải nghiệm
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {footer.quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="inline-flex min-h-11 items-center rounded-sm text-white/62 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--lagoon-sun)]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Direct Connection Column */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--lagoon-sun)]">
              Kết nối trực tiếp
            </h3>
            <div className="flex flex-col space-y-2.5 text-xs sm:text-sm">
              <a
                href={contact.phoneHref}
                className="inline-flex min-h-11 items-center gap-2 rounded-sm font-semibold text-white transition-colors hover:text-[var(--lagoon-sun)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--lagoon-sun)]"
              >
                <Phone className="size-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                <span>{contact.phoneDisplay}</span>
              </a>
              <a
                href={contact.zaloHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-sm font-semibold text-[#6faeff] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--lagoon-sun)]"
              >
                <MessageCircle className="size-4" aria-hidden="true" />
                <span>Chat qua Zalo</span>
              </a>
              <a
                href={contact.mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-sm text-white/62 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--lagoon-sun)]"
              >
                <MapPin className="size-4 text-primary" aria-hidden="true" />
                <span>Xem trên Google Maps</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/15 pt-8 text-center text-xs text-white/50 sm:flex-row sm:text-left">
          <p>
            © {footer.copyrightYear} {footer.brandName}. Trải nghiệm du lịch đầm phá bản địa chân thật.
          </p>
          <p className="text-white/45">
            Phá Tam Giang, Thừa Thiên Huế, Việt Nam
          </p>
        </div>
      </div>
    </footer>
  );
}
