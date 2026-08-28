import type { Metadata } from "next";
import { notFound } from "next/navigation";

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
    <main>
      <header className="border-b border-foreground/15 bg-foreground/[0.035] px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-2xl space-y-4">
          <p className="inline-flex rounded-full border border-foreground/25 px-3 py-1 text-sm font-semibold">
            Development preview
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Booking enquiry UI preview
          </h1>
          <p className="max-w-prose text-base leading-7 text-foreground/75">
            This route uses neutral review fixtures. Its content is not approved
            for publication, and submitting the form does not create a booking
            enquiry.
          </p>
          <Button asChild className="min-h-12 px-5 text-base">
            <a href="#booking-enquiry">Jump to enquiry preview</a>
          </Button>
        </div>
      </header>
      <PreviewBookingEnquiry />
    </main>
  );
}
