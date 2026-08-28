// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  BookingEnquirySection,
  type BookingEnquiryCopy,
} from "./booking-enquiry-section";

const copy: BookingEnquiryCopy = {
  heading: "Send an enquiry",
  introduction: "The family will review your preferred date and group size.",
  requiredHint: "Required",
  optionalHint: "Optional",
  fields: {
    requestedTourDate: {
      label: "Requested tour date",
      error: "Choose today or a later date.",
    },
    totalGuestCount: {
      label: "Total guest count",
      error: "Enter at least one guest.",
    },
    guestName: {
      label: "Guest name",
      error: "Enter your name.",
    },
    phoneNumber: {
      label: "Phone number",
      error: "Enter a valid phone number.",
    },
    guestNotes: {
      label: "Guest notes",
      error: "Keep notes within 1,000 characters.",
      hint: "Maximum 1,000 characters.",
    },
  },
  submit: "Send enquiry",
  submitting: "Sending enquiry",
  errorSummaryHeading: "Please correct these fields",
  storageFailure: {
    heading: "The enquiry could not be saved",
    message: "Try again or call the family.",
    retry: "Try again",
  },
  ambiguousFailure: {
    heading: "We could not verify receipt",
    message: "Retry the same enquiry or call the family.",
    retry: "Retry same enquiry",
  },
  conflictFailure: {
    heading: "The enquiry could not be retried safely",
    message: "Call the family before sending another enquiry.",
  },
  rejectedFailure: {
    heading: "The enquiry could not be sent",
    message: "Try again later or call the family.",
  },
  phoneFallback: "Call the family",
  receipt: {
    heading: "Booking enquiry recorded",
    message: "The family will review it manually.",
    notConfirmed: "This is not a confirmed booking.",
    requestedDateLabel: "Requested date",
    guestCountLabel: "Requested guest count",
    preferenceNote: "These details are preferences, not confirmed arrangements.",
  },
};

const validValues = {
  requestedTourDate: "2026-08-29",
  totalGuestCount: "2",
  guestName: "Nguyễn An",
  phoneNumber: "0332 279 474",
  guestNotes: "Window seat if possible",
};

afterEach(() => {
  cleanup();
  window.history.replaceState(null, "", "/");
});

function renderSection(overrides: Partial<React.ComponentProps<typeof BookingEnquirySection>> = {}) {
  const submitEnquiry = vi.fn().mockResolvedValue({ outcome: "recorded", replayed: false });
  return render(
    <BookingEnquirySection
      tour={{
        key: "tam-giang-sunset",
        title: "Test tour context",
        summary: "A compact factual summary for this test.",
      }}
      copy={copy}
      phone={{ display: "0332 279 474", href: "tel:+84332279474" }}
      submitEnquiry={submitEnquiry}
      createIdempotencyKey={() => "opaque-key-123456"}
      now={() => new Date("2026-08-28T05:00:00.000Z")}
      {...overrides}
    />,
  );
}

async function fillValidForm() {
  fireEvent.change(screen.getByLabelText(copy.fields.requestedTourDate.label), {
    target: { value: validValues.requestedTourDate },
  });
  await userEvent.type(screen.getByLabelText(copy.fields.totalGuestCount.label), validValues.totalGuestCount);
  await userEvent.type(screen.getByLabelText(copy.fields.guestName.label), validValues.guestName);
  await userEvent.type(screen.getByLabelText(copy.fields.phoneNumber.label), validValues.phoneNumber);
  await userEvent.type(screen.getByLabelText(copy.fields.guestNotes.label), validValues.guestNotes);
}

describe("Booking enquiry section", () => {
  it("renders compact context and blank fields in the approved order", () => {
    renderSection();

    const section = screen.getByRole("region", { name: copy.heading });
    expect(
      within(section).getByRole("heading", { name: copy.heading }),
    ).toHaveAttribute("tabindex", "-1");
    expect(within(section).getByText("Test tour context")).toBeVisible();

    const form = within(section).getByRole("form");
    const honeypot = form.querySelector<HTMLInputElement>('input[name="website"]');
    expect(honeypot).toHaveAttribute("tabindex", "-1");
    expect(honeypot?.closest("[aria-hidden='true']")).toBeInTheDocument();

    const fields = Array.from(
      form.querySelectorAll('input:not([name="website"]), textarea'),
    );
    expect(fields.map((field) => field.getAttribute("name"))).toEqual([
      "requestedTourDate",
      "totalGuestCount",
      "guestName",
      "phoneNumber",
      "guestNotes",
    ]);
    for (const field of fields) expect((field as HTMLInputElement).value).toBe("");
  });

  it("focuses the section heading for direct anchor entry without clearing values", async () => {
    window.history.replaceState(null, "", `#booking-enquiry`);
    renderSection();

    await waitFor(() => expect(screen.getByRole("heading", { name: copy.heading })).toHaveFocus());
    await userEvent.type(screen.getByLabelText(copy.fields.guestName.label), "Lan");
    const link = document.createElement("a");
    link.href = "#booking-enquiry";
    link.textContent = "Enquire";
    document.body.append(link);
    await userEvent.click(link);

    await waitFor(() => expect(screen.getByRole("heading", { name: copy.heading })).toHaveFocus());
    expect(screen.getByLabelText(copy.fields.guestName.label)).toHaveValue("Lan");
    link.remove();
  });

  it("validates on blur and focuses a linked summary on client-invalid submit without a request", async () => {
    window.history.replaceState(null, "", "/");
    const submitEnquiry = vi.fn();
    renderSection({ submitEnquiry });
    const name = screen.getByLabelText(copy.fields.guestName.label);

    expect(screen.queryByText(copy.fields.guestName.error)).not.toBeInTheDocument();
    await userEvent.click(name);
    await userEvent.tab();
    expect(screen.getByText(copy.fields.guestName.error)).toBeVisible();

    await userEvent.click(screen.getByRole("button", { name: copy.submit }));
    const summary = screen.getByText(copy.errorSummaryHeading).parentElement!;
    await waitFor(() => expect(summary).toHaveFocus());
    expect(within(summary).getByRole("link", { name: copy.fields.requestedTourDate.error })).toHaveAttribute("href", "#requestedTourDate");
    expect(submitEnquiry).not.toHaveBeenCalled();
  });

  it("removes the error summary after every invalid field is corrected", async () => {
    const submitEnquiry = vi.fn();
    renderSection({ submitEnquiry });
    await userEvent.click(screen.getByRole("button", { name: copy.submit }));
    expect(screen.getByText(copy.errorSummaryHeading)).toBeVisible();

    await fillValidForm();

    expect(screen.queryByText(copy.errorSummaryHeading)).not.toBeInTheDocument();
    expect(submitEnquiry).not.toHaveBeenCalled();
  });

  it("does not treat a different route with the same hash as same-document entry", async () => {
    renderSection();
    window.history.replaceState(null, "", "/#booking-enquiry");
    const name = screen.getByLabelText(copy.fields.guestName.label);
    name.focus();
    const link = document.createElement("a");
    link.href = "/another-route#booking-enquiry";
    link.textContent = "Different route";
    link.addEventListener("click", (event) => event.preventDefault());
    document.body.append(link);

    await userEvent.click(link);

    await new Promise((resolve) => requestAnimationFrame(resolve));
    expect(screen.getByRole("heading", { name: copy.heading })).not.toHaveFocus();
    link.remove();
  });

  it("keeps values visible and excludes edits and repeat submission while pending", async () => {
    let resolve!: (value: { outcome: "recorded"; replayed: false }) => void;
    const submitEnquiry = vi.fn(
      () =>
        new Promise<{ outcome: "recorded"; replayed: false }>((done) => {
          resolve = done;
        }),
    );
    renderSection({ submitEnquiry });
    await fillValidForm();

    await userEvent.click(screen.getByRole("button", { name: copy.submit }));
    expect(await screen.findByRole("status")).toHaveTextContent(copy.submitting);
    expect(screen.getByRole("form")).toHaveAttribute("aria-busy", "true");
    expect(screen.getByLabelText(copy.fields.guestName.label)).toBeDisabled();
    expect(screen.getByLabelText(copy.fields.guestName.label)).toHaveValue(validValues.guestName);
    expect(screen.getByRole("button", { name: copy.submit })).toBeDisabled();

    resolve({ outcome: "recorded", replayed: false });
    await screen.findByText(copy.receipt.heading);
    expect(submitEnquiry).toHaveBeenCalledTimes(1);
  });

  it("shows an honest in-place receipt only for durable storage", async () => {
    const submitEnquiry = vi.fn().mockResolvedValue({ outcome: "recorded", replayed: false });
    renderSection({ submitEnquiry });
    await fillValidForm();
    await userEvent.click(screen.getByRole("button", { name: copy.submit }));

    const receipt = await screen.findByRole("status");
    expect(receipt).toHaveTextContent(copy.receipt.notConfirmed);
    expect(receipt).toHaveTextContent("29/08/2026");
    expect(receipt).toHaveTextContent(validValues.totalGuestCount);
    expect(screen.queryByRole("form")).not.toBeInTheDocument();
    expect(submitEnquiry).toHaveBeenCalledWith(
      expect.objectContaining({
        locale: "vi",
        sourcePage: "tour_detail",
        totalGuestCount: 2,
        phoneNumber: "0332279474",
      }),
      "opaque-key-123456",
    );
  });

  it("maps authoritative validation errors safely and uses a new key after correction", async () => {
    const submitEnquiry = vi.fn()
      .mockResolvedValueOnce({ outcome: "validation_failed", invalidFields: ["phoneNumber", "internalField"] })
      .mockResolvedValueOnce({ outcome: "recorded", replayed: false });
    const createIdempotencyKey = vi.fn()
      .mockReturnValueOnce("opaque-key-first1")
      .mockReturnValueOnce("opaque-key-second");
    renderSection({ submitEnquiry, createIdempotencyKey });
    await fillValidForm();
    await userEvent.click(screen.getByRole("button", { name: copy.submit }));

    const summary = await screen.findByText(copy.errorSummaryHeading);
    await waitFor(() => expect(summary.parentElement).toHaveFocus());
    expect(screen.getAllByText(copy.fields.phoneNumber.error)).toHaveLength(2);
    expect(screen.queryByText("internalField")).not.toBeInTheDocument();

    const phone = screen.getByLabelText(copy.fields.phoneNumber.label);
    await userEvent.clear(phone);
    await userEvent.type(phone, "0332279474");
    await userEvent.click(screen.getByRole("button", { name: copy.submit }));
    await screen.findByText(copy.receipt.heading);
    expect(submitEnquiry.mock.calls.map((call) => call[1])).toEqual(["opaque-key-first1", "opaque-key-second"]);
  });

  it("allows editing after definite storage failure and safely rotates the key if values change", async () => {
    const submitEnquiry = vi.fn()
      .mockResolvedValueOnce({ outcome: "storage_failed" })
      .mockResolvedValueOnce({ outcome: "recorded", replayed: false });
    const createIdempotencyKey = vi.fn()
      .mockReturnValueOnce("opaque-key-first1")
      .mockReturnValueOnce("opaque-key-second");
    renderSection({ submitEnquiry, createIdempotencyKey });
    await fillValidForm();
    await userEvent.click(screen.getByRole("button", { name: copy.submit }));

    expect(await screen.findByText(copy.storageFailure.heading)).toBeVisible();
    expect(screen.getByRole("link", { name: `${copy.phoneFallback}: 0332 279 474` })).toHaveAttribute("href", "tel:+84332279474");
    const count = screen.getByLabelText(copy.fields.totalGuestCount.label);
    expect(count).toBeEnabled();
    await userEvent.clear(count);
    await userEvent.type(count, "3");
    await userEvent.click(screen.getByRole("button", { name: copy.storageFailure.retry }));

    await screen.findByText(copy.receipt.heading);
    expect(submitEnquiry.mock.calls.map((call) => call[1])).toEqual(["opaque-key-first1", "opaque-key-second"]);
  });

  it("locks an ambiguous payload and retries the identical payload with the same key", async () => {
    const submitEnquiry = vi.fn()
      .mockResolvedValueOnce({ outcome: "network_or_unknown" })
      .mockResolvedValueOnce({ outcome: "recorded", replayed: true });
    renderSection({ submitEnquiry });
    await fillValidForm();
    await userEvent.click(screen.getByRole("button", { name: copy.submit }));

    expect(await screen.findByText(copy.ambiguousFailure.heading)).toBeVisible();
    expect(screen.getByLabelText(copy.fields.guestName.label)).toBeDisabled();
    await userEvent.click(screen.getByRole("button", { name: copy.ambiguousFailure.retry }));
    await screen.findByText(copy.receipt.heading);

    expect(submitEnquiry).toHaveBeenCalledTimes(2);
    expect(submitEnquiry.mock.calls[1]).toEqual(submitEnquiry.mock.calls[0]);
  });

  it("presents a safe conflict without exposing or reusing internal identifiers", async () => {
    const submitEnquiry = vi.fn().mockResolvedValue({ outcome: "conflict" });
    renderSection({ submitEnquiry });
    await fillValidForm();
    await userEvent.click(screen.getByRole("button", { name: copy.submit }));

    expect(await screen.findByText(copy.conflictFailure.heading)).toBeVisible();
    expect(screen.getByRole("link", { name: `${copy.phoneFallback}: 0332 279 474` })).toHaveAttribute(
      "href",
      "tel:+84332279474",
    );
    expect(screen.getByLabelText(copy.fields.guestName.label)).toBeDisabled();
    expect(screen.getByRole("button", { name: copy.submit })).toBeDisabled();
    expect(document.body).not.toHaveTextContent("opaque-key-123456");
  });

  it("exposes isolated analytics seams without treating client validation as server rejection", async () => {
    const onAnalyticsEvent = vi.fn();
    renderSection({ onAnalyticsEvent });
    await userEvent.click(screen.getByLabelText(copy.fields.guestName.label));
    expect(onAnalyticsEvent).not.toHaveBeenCalled();
    await userEvent.type(screen.getByLabelText(copy.fields.guestName.label), "A");
    await userEvent.click(screen.getByRole("button", { name: copy.submit }));
    expect(onAnalyticsEvent).toHaveBeenCalledTimes(1);
    expect(onAnalyticsEvent).toHaveBeenCalledWith({ name: "booking_enquiry_started" });
  });
});
