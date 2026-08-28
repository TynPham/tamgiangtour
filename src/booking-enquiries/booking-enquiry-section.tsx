"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, LoaderCircle } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm, type SubmitErrorHandler } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  BOOKING_ENQUIRY_FIELD_NAMES,
  EMPTY_BOOKING_ENQUIRY_FORM,
  createBookingEnquiryFormSchema,
  createBookingEnquiryPayload,
  formatBookingEnquiryDate,
  normalizeBookingEnquiryFormValues,
  tourLocalDate,
  type BookingEnquiryAnalyticsEvent,
  type BookingEnquiryFieldName,
  type BookingEnquiryFormValues,
  type SubmitBookingEnquiry,
} from "./booking-enquiry-contract";
import { submitBookingEnquiry as submitBookingEnquiryRequest } from "./booking-enquiry-client";
import { useBookingEnquirySubmission } from "./use-booking-enquiry-submission";

export type {
  BookingEnquiryAnalyticsEvent,
  BookingEnquiryPayload,
  BookingEnquirySubmissionResult,
  SubmitBookingEnquiry,
} from "./booking-enquiry-contract";

export const BOOKING_ENQUIRY_ANCHOR = "booking-enquiry";

type FieldCopy = { label: string; error: string; hint?: string };
type FailureCopy = { heading: string; message: string; retry?: string };

export type BookingEnquiryCopy = {
  heading: string;
  introduction: string;
  requiredHint: string;
  optionalHint: string;
  fields: Record<BookingEnquiryFieldName, FieldCopy>;
  submit: string;
  submitting: string;
  errorSummaryHeading: string;
  storageFailure: FailureCopy;
  ambiguousFailure: FailureCopy;
  conflictFailure: FailureCopy;
  rejectedFailure: FailureCopy;
  phoneFallback: string;
  receipt: {
    heading: string;
    message: string;
    notConfirmed: string;
    requestedDateLabel: string;
    guestCountLabel: string;
    preferenceNote: string;
  };
};

export type BookingEnquiryTourContext = {
  key: string;
  title: string;
  summary: string;
};

export type BookingEnquiryPhone = { display: string; href: string };

type BookingEnquirySectionProps = {
  tour: BookingEnquiryTourContext;
  copy: BookingEnquiryCopy;
  phone: BookingEnquiryPhone;
  submitEnquiry?: SubmitBookingEnquiry;
  createIdempotencyKey?: () => string;
  now?: () => Date;
  onAnalyticsEvent?: (event: BookingEnquiryAnalyticsEvent) => void;
};

function defaultKey() {
  return crypto.randomUUID();
}

function systemNow() {
  return new Date();
}

function BookingFieldHeading({
  copy,
  id,
  requirementCopy,
}: {
  copy: FieldCopy;
  id: BookingEnquiryFieldName;
  requirementCopy: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <FormLabel htmlFor={id} className="text-base leading-normal font-semibold">
        {copy.label}
      </FormLabel>
      <span aria-hidden="true" className="text-sm text-foreground/65">
        {requirementCopy}
      </span>
    </div>
  );
}

function BookingFieldDescription({
  copy,
  requirementCopy,
}: {
  copy: FieldCopy;
  requirementCopy: string;
}) {
  return (
    <FormDescription
      className={copy.hint ? "leading-6 text-foreground/70" : "sr-only"}
    >
      <span className="sr-only">{requirementCopy}. </span>
      {copy.hint}
    </FormDescription>
  );
}

export function BookingEnquirySection({
  tour,
  copy,
  phone,
  submitEnquiry = submitBookingEnquiryRequest,
  createIdempotencyKey = defaultKey,
  now = systemNow,
  onAnalyticsEvent,
}: BookingEnquirySectionProps) {
  const validationSchema = useMemo(
    () =>
      createBookingEnquiryFormSchema({
        messages: {
          requestedTourDate: copy.fields.requestedTourDate.error,
          totalGuestCount: copy.fields.totalGuestCount.error,
          guestName: copy.fields.guestName.error,
          phoneNumber: copy.fields.phoneNumber.error,
          guestNotes: copy.fields.guestNotes.error,
        },
        today: () => tourLocalDate(now()),
      }),
    [copy.fields, now],
  );
  const form = useForm<BookingEnquiryFormValues>({
    resolver: zodResolver(validationSchema),
    defaultValues: EMPTY_BOOKING_ENQUIRY_FORM,
    mode: "onBlur",
    reValidateMode: "onChange",
    shouldFocusError: false,
  });
  const [showErrorSummary, setShowErrorSummary] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);

  const emit = useCallback(
    (event: BookingEnquiryAnalyticsEvent) => {
      try {
        onAnalyticsEvent?.(event);
      } catch {
        // Analytics is isolated from the core enquiry journey.
      }
    },
    [onAnalyticsEvent],
  );

  const announceStart = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    emit({ name: "booking_enquiry_started" });
  }, [emit]);

  const focusErrorSummary = useCallback(() => {
    requestAnimationFrame(() => errorSummaryRef.current?.focus());
  }, []);

  const handleServerValidation = useCallback(
    (invalidFields: string[]) => {
      form.clearErrors();
      const fieldKeys: BookingEnquiryFieldName[] = [];
      for (const field of invalidFields) {
        if (
          BOOKING_ENQUIRY_FIELD_NAMES.includes(
            field as BookingEnquiryFieldName,
          )
        ) {
          const name = field as BookingEnquiryFieldName;
          fieldKeys.push(name);
          form.setError(name, {
            type: "server",
            message: copy.fields[name].error,
          });
        }
      }
      setShowErrorSummary(true);
      focusErrorSummary();
      return fieldKeys;
    },
    [copy.fields, focusErrorSummary, form],
  );

  const {
    failure,
    pending,
    receipt,
    retryAmbiguous,
    submitPayload,
  } = useBookingEnquirySubmission({
    createIdempotencyKey,
    emit,
    onValidationFailure: handleServerValidation,
    submitEnquiry,
  });

  useEffect(() => {
    const focusHeading = () => {
      if (window.location.hash === `#${BOOKING_ENQUIRY_ANCHOR}`) {
        headingRef.current?.focus();
      }
    };
    focusHeading();
    const focusAfterAnchorActivation = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest<HTMLAnchorElement>("a[href]");
      if (!link) return;
      const destination = new URL(link.href);
      const current = new URL(window.location.href);
      const isSameDocument =
        destination.origin === current.origin &&
        destination.pathname === current.pathname &&
        destination.search === current.search;
      if (
        !isSameDocument ||
        destination.hash !== `#${BOOKING_ENQUIRY_ANCHOR}`
      ) {
        return;
      }
      requestAnimationFrame(focusHeading);
    };
    window.addEventListener("hashchange", focusHeading);
    document.addEventListener("click", focusAfterAnchorActivation);
    return () => {
      window.removeEventListener("hashchange", focusHeading);
      document.removeEventListener("click", focusAfterAnchorActivation);
    };
  }, []);

  function fieldError(name: BookingEnquiryFieldName) {
    const message = form.formState.errors[name]?.message;
    return typeof message === "string" ? message : undefined;
  }

  async function submitValidValues(values: BookingEnquiryFormValues) {
    setShowErrorSummary(false);

    await submitPayload(
      createBookingEnquiryPayload(
        normalizeBookingEnquiryFormValues(values),
      ),
    );
  }

  const handleInvalidValues: SubmitErrorHandler<BookingEnquiryFormValues> = () => {
    setShowErrorSummary(true);
    focusErrorSummary();
  };

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    if (pending) {
      event.preventDefault();
      return;
    }
    announceStart();

    if (failure === "ambiguous") {
      event.preventDefault();
      void retryAmbiguous();
      return;
    }

    void form.handleSubmit(submitValidValues, handleInvalidValues)(event);
  }

  const fieldLocked = pending || failure === "ambiguous" || failure === "conflict";
  const failureCopy = failure
    ? {
        storage: copy.storageFailure,
        ambiguous: copy.ambiguousFailure,
        conflict: copy.conflictFailure,
        rejected: copy.rejectedFailure,
      }[failure]
    : null;
  const summaryFields = BOOKING_ENQUIRY_FIELD_NAMES.filter((name) =>
    fieldError(name),
  );

  return (
    <section
      id={BOOKING_ENQUIRY_ANCHOR}
      aria-labelledby={`${BOOKING_ENQUIRY_ANCHOR}-heading`}
      className="scroll-mt-6 bg-background px-4 py-12 sm:px-6 sm:py-16"
    >
      <div className="mx-auto max-w-2xl">
        <div className="space-y-3">
          <h2
            ref={headingRef}
            id={`${BOOKING_ENQUIRY_ANCHOR}-heading`}
            tabIndex={-1}
            className="text-2xl font-bold tracking-tight outline-none focus-visible:rounded-md focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4 sm:text-3xl"
          >
            {copy.heading}
          </h2>
          <p className="max-w-prose text-base leading-7 text-foreground/75">
            {copy.introduction}
          </p>
        </div>

        <div className="mt-6 rounded-2xl border border-foreground/15 bg-foreground/[0.035] p-4 sm:p-5">
          <p className="font-semibold">{tour.title}</p>
          <p className="mt-1 text-sm leading-6 text-foreground/70">{tour.summary}</p>
        </div>

        {receipt ? (
          <div
            role="status"
            aria-live="polite"
            className="mt-8 rounded-2xl border border-foreground/20 p-5 sm:p-6"
          >
            <CheckCircle2 aria-hidden="true" className="size-6" />
            <h3 className="mt-4 text-xl font-bold">{copy.receipt.heading}</h3>
            <p className="mt-2 leading-7">{copy.receipt.message}</p>
            <p className="mt-2 font-semibold">{copy.receipt.notConfirmed}</p>
            <dl className="mt-5 grid gap-3 rounded-xl bg-foreground/[0.035] p-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm text-foreground/65">{copy.receipt.requestedDateLabel}</dt>
                <dd className="font-semibold">
                  {formatBookingEnquiryDate(receipt.requestedTourDate)}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-foreground/65">{copy.receipt.guestCountLabel}</dt>
                <dd className="font-semibold">{receipt.totalGuestCount}</dd>
              </div>
            </dl>
            <p className="mt-3 text-sm leading-6 text-foreground/70">
              {copy.receipt.preferenceNote}
            </p>
          </div>
        ) : (
          <Form {...form}>
            <form
              aria-label={copy.heading}
              aria-busy={pending}
              className="mt-8 space-y-6"
              noValidate
              onSubmit={handleSubmit}
            >
            {showErrorSummary && summaryFields.length > 0 ? (
              <Alert
                ref={errorSummaryRef}
                variant="destructive"
                tabIndex={-1}
                className="p-4 outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2"
              >
                <AlertCircle aria-hidden="true" />
                <AlertTitle className="font-bold">
                  {copy.errorSummaryHeading}
                </AlertTitle>
                <AlertDescription>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    {summaryFields.map((name) => (
                      <li key={name}>
                        <a href={`#${name}`}>{fieldError(name)}</a>
                      </li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            ) : null}

            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-[-10000px] size-px overflow-hidden opacity-0"
            >
              <label htmlFor="booking-enquiry-website">Website</label>
              <input
                id="booking-enquiry-website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                {...form.register("website")}
              />
            </div>

            <FormField
              control={form.control}
              name="requestedTourDate"
              render={({ field }) => (
                <FormItem>
                  <BookingFieldHeading copy={copy.fields.requestedTourDate} id="requestedTourDate" requirementCopy={copy.requiredHint} />
                  <FormControl id="requestedTourDate">
                    <Input
                      {...field}
                      className="min-h-12 px-3 py-2 text-base md:text-base"
                      type="date"
                      required
                      disabled={fieldLocked}
                      onChange={(event) => {
                        announceStart();
                        field.onChange(event);
                      }}
                    />
                  </FormControl>
                  <BookingFieldDescription copy={copy.fields.requestedTourDate} requirementCopy={copy.requiredHint} />
                  <FormMessage className="font-medium leading-6" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="totalGuestCount"
              render={({ field }) => (
                <FormItem>
                  <BookingFieldHeading copy={copy.fields.totalGuestCount} id="totalGuestCount" requirementCopy={copy.requiredHint} />
                  <FormControl id="totalGuestCount">
                    <Input
                      {...field}
                      className="min-h-12 px-3 py-2 text-base md:text-base"
                      type="number"
                      inputMode="numeric"
                      min={1}
                      step={1}
                      required
                      disabled={fieldLocked}
                      onChange={(event) => {
                        announceStart();
                        field.onChange(event);
                      }}
                    />
                  </FormControl>
                  <BookingFieldDescription copy={copy.fields.totalGuestCount} requirementCopy={copy.requiredHint} />
                  <FormMessage className="font-medium leading-6" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="guestName"
              render={({ field }) => (
                <FormItem>
                  <BookingFieldHeading copy={copy.fields.guestName} id="guestName" requirementCopy={copy.requiredHint} />
                  <FormControl id="guestName">
                    <Input
                      {...field}
                      className="min-h-12 px-3 py-2 text-base md:text-base"
                      type="text"
                      autoComplete="name"
                      maxLength={100}
                      required
                      disabled={fieldLocked}
                      onChange={(event) => {
                        announceStart();
                        field.onChange(event);
                      }}
                    />
                  </FormControl>
                  <BookingFieldDescription copy={copy.fields.guestName} requirementCopy={copy.requiredHint} />
                  <FormMessage className="font-medium leading-6" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <BookingFieldHeading copy={copy.fields.phoneNumber} id="phoneNumber" requirementCopy={copy.requiredHint} />
                  <FormControl id="phoneNumber">
                    <Input
                      {...field}
                      className="min-h-12 px-3 py-2 text-base md:text-base"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      required
                      disabled={fieldLocked}
                      onChange={(event) => {
                        announceStart();
                        field.onChange(event);
                      }}
                    />
                  </FormControl>
                  <BookingFieldDescription copy={copy.fields.phoneNumber} requirementCopy={copy.requiredHint} />
                  <FormMessage className="font-medium leading-6" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="guestNotes"
              render={({ field }) => (
                <FormItem>
                  <BookingFieldHeading copy={copy.fields.guestNotes} id="guestNotes" requirementCopy={copy.optionalHint} />
                  <FormControl id="guestNotes">
                    <Textarea
                      {...field}
                      className="min-h-28 px-3 py-3 text-base md:text-base"
                      maxLength={1_000}
                      disabled={fieldLocked}
                      onChange={(event) => {
                        announceStart();
                        field.onChange(event);
                      }}
                    />
                  </FormControl>
                  <BookingFieldDescription copy={copy.fields.guestNotes} requirementCopy={copy.optionalHint} />
                  <FormMessage className="font-medium leading-6" />
                </FormItem>
              )}
            />

            {pending ? (
              <p role="status" aria-live="polite" className="flex items-center gap-2 text-sm font-medium">
                <LoaderCircle aria-hidden="true" className="size-4 animate-spin motion-reduce:animate-none" />
                {copy.submitting}
              </p>
            ) : null}

            {failureCopy ? (
              <Alert className="p-4">
                <AlertCircle aria-hidden="true" />
                <AlertTitle className="font-bold">
                  {failureCopy.heading}
                </AlertTitle>
                <AlertDescription>
                  <p className="leading-6">{failureCopy.message}</p>
                  <Button
                    asChild
                    variant="link"
                    className="mt-3 min-h-12 justify-start px-0 text-base"
                  >
                    <a href={phone.href}>
                      {copy.phoneFallback}: {phone.display}
                    </a>
                  </Button>
                </AlertDescription>
              </Alert>
            ) : null}

            <Button type="submit" disabled={pending || failure === "conflict"} className="min-h-12 w-full px-5 text-base sm:w-auto">
              {failureCopy?.retry ?? copy.submit}
            </Button>
            </form>
          </Form>
        )}
      </div>
    </section>
  );
}
