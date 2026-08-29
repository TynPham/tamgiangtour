// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { act, cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { analytics } from "@/src/analytics/analytics-client";
import { setAnalyticsConsent } from "@/src/analytics/consent";
import { ContactActionLink, ContactPageViewTracker } from "./contact-actions";

describe("ContactActionLink", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("tracks phone and Zalo as contact actions without emitting a primary CTA", async () => {
    const user = userEvent.setup();
    const contactSpy = vi.spyOn(analytics, "trackContact");
    const primaryCtaSpy = vi.spyOn(analytics, "trackPrimaryCta");

    render(
      <>
        <ContactActionLink kind="phone" href="tel:+84332279474">
          Gọi 0332 279 474
        </ContactActionLink>
        <ContactActionLink kind="zalo" href="https://zalo.me/0332279474">
          Nhắn tin qua Zalo
        </ContactActionLink>
      </>,
    );

    const phoneLink = screen.getByRole("link", { name: "Gọi 0332 279 474" });
    const zaloLink = screen.getByRole("link", { name: "Nhắn tin qua Zalo" });
    phoneLink.addEventListener("click", (event) => event.preventDefault());
    zaloLink.addEventListener("click", (event) => event.preventDefault());

    await user.click(phoneLink);
    await user.click(zaloLink);

    expect(contactSpy).toHaveBeenNthCalledWith(1, "phone", "contact", "vi");
    expect(contactSpy).toHaveBeenNthCalledWith(2, "zalo", "contact", "vi");
    expect(primaryCtaSpy).not.toHaveBeenCalled();
  });

  it("tracks the verified Maps destination as maps_opened only", async () => {
    const user = userEvent.setup();
    const mapsSpy = vi.spyOn(analytics, "trackMaps");
    const primaryCtaSpy = vi.spyOn(analytics, "trackPrimaryCta");

    render(
      <ContactActionLink
        kind="maps"
        href="https://www.google.com/maps/place/verified"
        meetingPointKey="chu_huyen_boat_pier"
      >
        Mở Google Maps
      </ContactActionLink>,
    );

    const mapsLink = screen.getByRole("link", { name: "Mở Google Maps" });
    mapsLink.addEventListener("click", (event) => event.preventDefault());

    await user.click(mapsLink);

    expect(mapsSpy).toHaveBeenCalledOnce();
    expect(mapsSpy).toHaveBeenCalledWith(
      "chu_huyen_boat_pier",
      "contact",
      "vi",
    );
    expect(primaryCtaSpy).not.toHaveBeenCalled();
  });

  it("tracks the contact page only after analytics consent", () => {
    const pageViewSpy = vi.spyOn(analytics, "trackPageView");

    render(<ContactPageViewTracker />);
    expect(pageViewSpy).not.toHaveBeenCalled();

    act(() => {
      setAnalyticsConsent("granted");
    });

    expect(pageViewSpy).toHaveBeenCalledOnce();
    expect(pageViewSpy).toHaveBeenCalledWith("contact", "vi");
  });
});
