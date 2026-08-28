import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowDown, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PreviewBookingEnquiry } from "./preview-booking-enquiry";

export const metadata: Metadata = {
  title: "Booking enquiry UI preview",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function BookingEnquiryPreviewPage() {
  if (process.env.NODE_ENV !== "development") notFound();

  return (
    <div className="min-h-screen bg-muted/20">
      <main>
        <header className="border-b border-border/80 bg-background/95 backdrop-blur-sm px-4 py-8 sm:px-6 sm:py-10">
          <div className="mx-auto max-w-2xl space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1.5 px-3 py-1 font-semibold text-xs rounded-full border-foreground/25">
                <Sparkles aria-hidden="true" className="size-3 text-muted-foreground" />
                Development preview
              </Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
              Booking enquiry UI preview
            </h1>
            <p className="max-w-prose text-base leading-relaxed text-muted-foreground">
              This route uses neutral review fixtures. Its content is not approved
              for publication, and submitting the form does not create a booking
              enquiry.
            </p>
            <Button asChild className="min-h-11 gap-2 px-5 text-sm font-medium shadow-xs">
              <a href="#booking-enquiry">
                Jump to enquiry preview
                <ArrowDown aria-hidden="true" className="size-4" />
              </a>
            </Button>
          </div>
        </header>
        <div className="py-8 sm:py-12">
          <PreviewBookingEnquiry />
        </div>
      </main>
    </div>
  );
}
