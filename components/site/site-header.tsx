"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Menu, PhoneCall, Waves } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { analytics } from "@/src/analytics/analytics-client";
import type { PageKey } from "@/src/analytics/analytics-contract";
import { LANDING_PAGE_CONTENT } from "@/src/content/landing-page-content";

interface SiteHeaderProps {
  pageKey: PageKey;
  primaryActionHref: string;
}

export function SiteHeader({ pageKey, primaryActionHref }: SiteHeaderProps) {
  const { navigation, contact } = LANDING_PAGE_CONTENT;
  const [isOpen, setIsOpen] = React.useState(false);

  const handlePrimaryCtaClick = () => {
    analytics.trackPrimaryCta(
      "enquiry_start",
      "booking_enquiry_page",
      pageKey,
      "vi",
    );
  };

  const handlePhoneClick = () => {
    analytics.trackContact("phone", pageKey, "vi");
  };

  const isCurrentContactPage = pageKey === "contact";

  return (
    <header className="lagoon-header-enter sticky top-0 z-30 w-full border-b border-border/70 bg-[color-mix(in_oklch,var(--background)_94%,transparent)] backdrop-blur-md">
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/vi"
          className="group flex min-h-11 shrink-0 items-center gap-3 rounded-md py-1 transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <div className="flex size-10 shrink-0 items-center justify-center border-y border-[var(--lagoon-reed)] text-[var(--lagoon-deep)]">
            <Waves
              className="size-5 transition-transform duration-300 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="whitespace-nowrap font-sans text-base font-semibold leading-tight tracking-[-0.02em] text-foreground sm:text-lg">
              {navigation.brandName}
            </span>
            <span className="whitespace-nowrap text-[0.62rem] font-medium uppercase tracking-[0.15em] text-muted-foreground sm:text-[0.68rem]">
              {navigation.brandSubtitle}
            </span>
          </div>
        </Link>

        <nav
          aria-label="Điều hướng chính"
          className="hidden items-center gap-5 whitespace-nowrap text-[0.78rem] font-medium text-muted-foreground xl:flex xl:gap-7"
        >
          {navigation.items.map((item) => {
            const isCurrent = isCurrentContactPage && item.href === "/vi/lien-he";

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isCurrent ? "page" : undefined}
                className={`relative rounded-sm py-2 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring after:absolute after:bottom-1 after:left-0 after:h-px after:bg-primary after:transition-[width] after:duration-300 hover:after:w-full ${
                  isCurrent
                    ? "text-foreground after:w-full"
                    : "after:w-0"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden shrink-0 items-center gap-3 sm:flex">
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
            <Link href={primaryActionHref} className="group">
              <span>{navigation.ctaLabel}</span>
              <ArrowRight
                className="ml-1.5 size-3.5 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </Button>
        </div>

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
            <SheetContent
              side="right"
              className="flex w-[85vw] max-w-xs flex-col justify-between p-6"
            >
              <div className="space-y-6">
                <SheetHeader className="text-left">
                  <SheetTitle className="flex items-center gap-2.5 font-sans text-lg font-bold">
                    <Waves className="size-5 text-primary" aria-hidden="true" />
                    <span>{navigation.brandName}</span>
                  </SheetTitle>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    {navigation.brandSubtitle}
                  </p>
                </SheetHeader>

                <nav
                  aria-label="Điều hướng trên thiết bị di động"
                  className="flex flex-col space-y-1 pt-2"
                >
                  {navigation.items.map((item) => {
                    const isCurrent =
                      isCurrentContactPage && item.href === "/vi/lien-he";

                    return (
                      <SheetClose asChild key={item.href}>
                        <Link
                          href={item.href}
                          aria-current={isCurrent ? "page" : undefined}
                          className={`flex items-center border-b border-border/40 py-2.5 text-sm font-medium transition-colors hover:text-primary sm:text-base ${
                            isCurrent ? "text-primary" : "text-foreground"
                          }`}
                        >
                          {item.label}
                        </Link>
                      </SheetClose>
                    );
                  })}
                </nav>
              </div>

              <div className="space-y-3 border-t border-border pt-6">
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
                    className="w-full rounded-lg text-sm font-semibold"
                    onClick={handlePrimaryCtaClick}
                  >
                    <Link href={primaryActionHref}>{navigation.ctaLabel}</Link>
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
