// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { act, cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { analytics } from "@/src/analytics/analytics-client";
import { setAnalyticsConsent } from "@/src/analytics/consent";
import {
  PRIMARY_MEETING_POINT,
  SECONDARY_MEETING_POINT,
} from "@/src/content/v1-tour";
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
      <>
        {[PRIMARY_MEETING_POINT, SECONDARY_MEETING_POINT].map((point) => (
          <ContactActionLink
            key={point.key}
            kind="maps"
            href={point.mapsHref}
            meetingPointKey={point.key}
          >
            Mở {point.name}
          </ContactActionLink>
        ))}
      </>,
    );

    const mapsLinks = screen.getAllByRole("link", { name: /Mở Bến đò/i });
    mapsLinks.forEach((link) => {
      link.addEventListener("click", (event) => event.preventDefault());
    });

    await user.click(mapsLinks[0]);
    await user.click(mapsLinks[1]);

    expect(mapsSpy).toHaveBeenCalledTimes(2);
    expect(mapsSpy).toHaveBeenNthCalledWith(
      1,
      PRIMARY_MEETING_POINT.key,
      "contact",
      "vi",
    );
    expect(mapsSpy).toHaveBeenNthCalledWith(
      2,
      SECONDARY_MEETING_POINT.key,
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
