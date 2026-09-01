// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const route = vi.hoisted(() => ({ pathname: "/vi" }));
vi.mock("next/navigation", () => ({
  usePathname: () => route.pathname,
}));

import { FloatingZaloButton, ZaloIcon } from "./floating-zalo-button";
import { VIETNAMESE_ZALO_CONTACT } from "@/src/booking-enquiries/vietnamese-booking-enquiry-copy";
import { analytics } from "@/src/analytics/analytics-client";

afterEach(() => {
  cleanup();
  route.pathname = "/vi";
  vi.restoreAllMocks();
});

describe("FloatingZaloButton", () => {
  it("renders with default accessible label and configured Zalo destination", () => {
    render(<FloatingZaloButton />);

    const button = screen.getByRole("link", {
      name: new RegExp(VIETNAMESE_ZALO_CONTACT.phone, "i"),
    });

    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("href", VIETNAMESE_ZALO_CONTACT.href);
    expect(button).toHaveAttribute("target", "_blank");
    expect(button).toHaveAttribute("rel", "noopener noreferrer");
    expect(button).toHaveAttribute("aria-label", VIETNAMESE_ZALO_CONTACT.ariaLabel);
  });

  it("applies fixed bottom-right layout and mobile-friendly touch target sizing", () => {
    render(<FloatingZaloButton />);

    const button = screen.getByRole("link", {
      name: new RegExp(VIETNAMESE_ZALO_CONTACT.phone, "i"),
    });

    expect(button).toHaveClass("fixed", "bottom-6", "right-6", "z-40");
    expect(button).toHaveClass("size-12", "sm:size-14", "rounded-full");
  });

  it("triggers onContactClick callback with channel and href on click", () => {
    const onContactClickMock = vi.fn();
    render(<FloatingZaloButton onContactClick={onContactClickMock} />);

    const button = screen.getByRole("link", {
      name: new RegExp(VIETNAMESE_ZALO_CONTACT.phone, "i"),
    });

    fireEvent.click(button);

    expect(onContactClickMock).toHaveBeenCalledTimes(1);
    expect(onContactClickMock).toHaveBeenCalledWith({
      channel: "zalo",
      href: VIETNAMESE_ZALO_CONTACT.href,
    });
  });

  it("tracks Zalo with the canonical context of the current public route", () => {
    const trackContact = vi.spyOn(analytics, "trackContact");
    route.pathname = "/vi/lien-he";
    render(<FloatingZaloButton />);

    fireEvent.click(
      screen.getByRole("link", {
        name: new RegExp(VIETNAMESE_ZALO_CONTACT.phone, "i"),
      }),
    );

    expect(trackContact).toHaveBeenCalledWith("zalo", "contact", "vi");
  });

  it("accepts custom destination href and aria-label", () => {
    const customHref = "https://zalo.me/custom-oa";
    const customLabel = "Liên hệ Zalo đặt thuyền";
    render(<FloatingZaloButton href={customHref} ariaLabel={customLabel} />);

    const button = screen.getByRole("link", { name: customLabel });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("href", customHref);
    expect(button).toHaveAttribute("aria-label", customLabel);
  });

  it("renders the Zalo SVG icon with aria-hidden", () => {
    render(<ZaloIcon />);
    const icon = screen.getByTestId("zalo-icon");
    expect(icon).toHaveAttribute("aria-hidden", "true");
  });
});
