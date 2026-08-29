// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { MeetingPointMap } from "./meeting-point-map";
import { analytics } from "@/src/analytics/analytics-client";
import { LANDING_PAGE_CONTENT } from "@/src/content/landing-page-content";

describe("MeetingPointMap component", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("renders embedded Google Maps iframe with title and lazy loading", () => {
    const { contact } = LANDING_PAGE_CONTENT;

    render(<MeetingPointMap pageKey="contact" />);

    const iframe = screen.getByTitle(`Bản đồ vị trí ${contact.mapsPlaceName}`);
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute("src", contact.mapsEmbedUrl);
    expect(iframe).toHaveAttribute("loading", "lazy");
    expect(screen.getAllByText(contact.mapsPlaceName).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(contact.mapsAddress)).toBeInTheDocument();
  });

  it("does not emit maps_opened on mere render/load, but emits when directions link is clicked", () => {
    const trackMapsSpy = vi.spyOn(analytics, "trackMaps").mockImplementation(() => {});
    const { contact } = LANDING_PAGE_CONTENT;

    render(<MeetingPointMap pageKey="contact" />);

    // Rendering does NOT emit maps_opened
    expect(trackMapsSpy).not.toHaveBeenCalled();

    // Clicking directions link emits maps_opened
    const directionsLink = screen.getByRole("link", { name: /Mở chỉ đường trên Google Maps/i });
    expect(directionsLink).toHaveAttribute("href", contact.mapsHref);

    fireEvent.click(directionsLink);
    expect(trackMapsSpy).toHaveBeenCalledTimes(1);
    expect(trackMapsSpy).toHaveBeenCalledWith(contact.mapsPlaceKey, "contact", "vi");
  });
});
