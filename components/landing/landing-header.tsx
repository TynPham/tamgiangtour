"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, Waves, PhoneCall, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { analytics } from "@/src/analytics/analytics-client";
import { LANDING_PAGE_CONTENT } from "@/src/content/landing-page-content";

export function LandingHeader() {
  const { navigation, contact } = LANDING_PAGE_CONTENT;
  const [isOpen, setIsOpen] = React.useState(false);

  const handlePrimaryCtaClick = () => {
    analytics.trackPrimaryCta(
      "enquiry_start",
      "booking_enquiry_section",
      "home",
      "vi"
    );
  };

  const handlePhoneClick = () => {
    analytics.trackContact("phone", "home", "vi");
  };

  return (
    <header className="lagoon-header-enter sticky top-0 z-30 w-full border-b border-border/70 bg-[color-mix(in_oklch,var(--background)_94%,transparent)] backdrop-blur-md">
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Brand Identity with Clean Contemporary Typography */}
        <Link
          href="/vi"
          className="group flex min-h-11 shrink-0 items-center gap-3 rounded-md py-1 transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <div className="flex size-10 shrink-0 items-center justify-center border-y border-[var(--lagoon-reed)] text-[var(--lagoon-deep)]">
            <Waves className="size-5 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="whitespace-nowrap font-sans text-base font-semibold leading-tight tracking-[-0.02em] text-foreground sm:text-lg">
              {navigation.brandName}
            </span>
            <span className="whitespace-nowrap text-[0.62rem] font-medium uppercase tracking-[0.15em] text-muted-foreground sm:text-[0.68rem]">
              {navigation.brandSubtitle}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav
          aria-label="Điều hướng chính"
          className="hidden items-center gap-5 whitespace-nowrap text-[0.78rem] font-medium text-muted-foreground xl:flex xl:gap-7"
        >
          {navigation.items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="relative rounded-sm py-2 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring after:absolute after:bottom-1 after:left-0 after:h-px after:w-0 after:bg-primary after:transition-[width] after:duration-300 hover:after:w-full"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Header Right Actions */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <a
            href={contact.phoneHref}
            onClick={handlePhoneClick}
            className="hidden min-h-11 items-center gap-2 whitespace-nowrap rounded-md border border-border px-3.5 py-2 text-xs font-semibold text-foreground/80 transition-colors hover:border-foreground/30 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring xl:flex"
          >
            <PhoneCall className="size-3.5 text-primary" aria-hidden="true" />
            <span>{contact.phoneDisplay}</span>
          </a>
          <Button
            asChild
            size="sm"
          className="h-10 whitespace-nowrap rounded-md px-4 text-xs font-semibold shadow-none sm:px-5 sm:text-sm"
            onClick={handlePrimaryCtaClick}
          >
            <a href="#booking-enquiry" className="group">
              <span>{navigation.ctaLabel}</span>
              <ArrowRight className="ml-1.5 size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </a>
          </Button>
        </div>

        {/* Mobile Navigation Trigger */}
        <div className="flex shrink-0 items-center gap-2 xl:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="size-11 rounded-md"
                aria-label="Mở danh mục điều hướng"
              >
                <Menu className="size-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] max-w-xs p-6 flex flex-col justify-between">
              <div className="space-y-6">
                <SheetHeader className="text-left">
                  <SheetTitle className="flex items-center gap-2.5 font-sans text-lg font-bold">
                    <Waves className="size-5 text-primary" />
                    <span>{navigation.brandName}</span>
                  </SheetTitle>
                  <p className="text-xs tracking-wider uppercase text-muted-foreground">
                    {navigation.brandSubtitle}
                  </p>
                </SheetHeader>

                <nav aria-label="Điều hướng trên thiết bị di động" className="flex flex-col space-y-1 pt-2">
                  {navigation.items.map((item) => (
                    <SheetClose asChild key={item.href}>
                      <a
                        href={item.href}
                        className="flex items-center py-2.5 text-sm sm:text-base font-medium text-foreground hover:text-primary transition-colors border-b border-border/40"
                      >
                        {item.label}
                      </a>
                    </SheetClose>
                  ))}
                </nav>
              </div>

              <div className="space-y-3 pt-6 border-t border-border">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Hotline trực tiếp:</span>
                  <a
                    href={contact.phoneHref}
                    onClick={handlePhoneClick}
                    className="font-bold text-foreground hover:underline"
                  >
                    {contact.phoneDisplay}
                  </a>
                </div>
                <SheetClose asChild>
                  <Button
                    asChild
                    className="w-full font-semibold rounded-lg text-sm"
                    onClick={handlePrimaryCtaClick}
                  >
                    <a href="#booking-enquiry">{navigation.ctaLabel}</a>
                  </Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
