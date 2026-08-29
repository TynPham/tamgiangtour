"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, Compass, LoaderCircle, Phone } from "lucide-react";
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
import { analytics } from "@/src/analytics/analytics-client";
import { hasAnalyticsConsent } from "@/src/analytics/consent";
import { getVisitAttribution } from "@/src/analytics/attribution";

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
  isRequired = true,
}: {
  copy: FieldCopy;
  id: BookingEnquiryFieldName;
  isRequired?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-2 mb-1.5">
      <div className="flex items-center gap-0.5">
        <FormLabel
          htmlFor={id}
          className="text-sm font-semibold leading-none text-foreground data-[error=true]:text-foreground tracking-tight cursor-pointer"
        >
          {copy.label}
        </FormLabel>
        {isRequired ? (
          <span className="text-primary font-bold select-none text-sm leading-none" aria-hidden="true">
            *
          </span>
        ) : null}
      </div>
      {!isRequired && copy.hint ? (
        <span className="text-[11px] text-muted-foreground font-normal">
          {copy.hint}
        </span>
      ) : null}
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
      className={copy.hint ? "text-xs leading-relaxed text-muted-foreground mt-1" : "sr-only"}
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

    const handleHashClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement | null)?.closest("a");
      if (!target) return;
      const href = target.getAttribute("href") || "";
      const currentPath = window.location.pathname;
      if (
        href === `#${BOOKING_ENQUIRY_ANCHOR}` ||
        href === `${currentPath}#${BOOKING_ENQUIRY_ANCHOR}`
      ) {
        requestAnimationFrame(() => {
          headingRef.current?.focus();
        });
      }
    };

    document.addEventListener("click", handleHashClick);
    return () => {
      document.removeEventListener("click", handleHashClick);
    };
  }, []);

  const clearFieldError = useCallback(
    (name: BookingEnquiryFieldName) => {
      if (!form.formState.errors[name]) {
        return;
      }
      form.clearErrors(name);
      if (
        BOOKING_ENQUIRY_FIELD_NAMES.every((fieldName) =>
          fieldName === name ? true : !form.formState.errors[fieldName],
        )
      ) {
        setShowErrorSummary(false);
      }
    },
    [form],
  );

  useEffect(() => {
    const subscription = form.watch((_value, { name }) => {
      if (!name) return;
      clearFieldError(name as BookingEnquiryFieldName);
    });
    return () => subscription.unsubscribe();
  }, [clearFieldError, form]);

  const handleSubmit = form.handleSubmit(
    async (values) => {
      setShowErrorSummary(false);

      const hasConsent = hasAnalyticsConsent();
      const attribution = getVisitAttribution({
        hasConsent,
        landingPageKey: "booking",
        referrer: typeof document !== "undefined" ? document.referrer : null,
        searchParams:
          typeof window !== "undefined"
            ? new URLSearchParams(window.location.search)
            : null,
      });

      const normalized = normalizeBookingEnquiryFormValues(values);
      const payload = createBookingEnquiryPayload(
        normalized,
        attribution
          ? {
              landingPageKey: attribution.landing_page_key as "home" | "tour_detail" | "contact",
              acquisitionSource: attribution.acquisition_source,
            }
          : undefined,
      );

      await submitPayload(payload);
    },
    (errors: Parameters<SubmitErrorHandler<BookingEnquiryFormValues>>[0]) => {
      const invalidFields = BOOKING_ENQUIRY_FIELD_NAMES.filter(
        (name) => !!errors[name],
      );
      if (invalidFields.length > 0) {
        setShowErrorSummary(true);
        focusErrorSummary();
      }
    },
  );

  const fieldLocked =
    pending || failure === "ambiguous" || failure === "conflict" || !!receipt;
  const fieldError = (name: BookingEnquiryFieldName) =>
    form.formState.errors[name]?.message;

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
      className="scroll-mt-8 bg-background px-4 py-8 sm:px-6 sm:py-12"
    >
      <div className="mx-auto max-w-2xl">
        <div className="space-y-2">
          <h2
            ref={headingRef}
            id={`${BOOKING_ENQUIRY_ANCHOR}-heading`}
            tabIndex={-1}
            className="text-2xl font-bold tracking-tight text-foreground outline-none focus-visible:rounded-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:text-3xl text-balance"
          >
            {copy.heading}
          </h2>
          <p className="max-w-prose text-sm leading-relaxed text-muted-foreground sm:text-base">
            {copy.introduction}
          </p>
        </div>

        <div className="mt-4 rounded-xl border border-border/70 bg-card/60 p-4 transition-colors">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Compass aria-hidden="true" className="size-4" />
            </div>
            <div className="space-y-0.5">
              <p className="text-sm font-semibold tracking-tight text-foreground">{tour.title}</p>
              <p className="text-xs leading-relaxed text-muted-foreground">{tour.summary}</p>
            </div>
          </div>
        </div>

        {receipt ? (
          <div
            role="status"
            aria-live="polite"
            className="mt-4 rounded-2xl border border-emerald-500/25 bg-card p-6 shadow-xs sm:p-7 space-y-5"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-4 ring-emerald-500/5">
                <CheckCircle2 aria-hidden="true" className="size-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
                  {copy.receipt.heading}
                </h3>
                <p className="text-xs text-muted-foreground">Phá Tam Giang — Tour Chú Huyền</p>
              </div>
            </div>

            <div className="space-y-2.5">
              <p className="text-sm leading-relaxed text-muted-foreground">
                {copy.receipt.message}
              </p>
              <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-3.5 py-2.5">
                <p className="text-xs sm:text-sm font-medium text-amber-900 dark:text-amber-200">
                  {copy.receipt.notConfirmed}
                </p>
              </div>
            </div>

            <dl className="grid gap-3 rounded-xl border border-border/80 bg-muted/30 p-4 sm:grid-cols-2">
              <div className="space-y-0.5">
                <dt className="text-xs font-medium tracking-wide uppercase text-muted-foreground">
                  {copy.receipt.requestedDateLabel}
                </dt>
                <dd className="text-sm font-semibold text-foreground">
                  {formatBookingEnquiryDate(receipt.requestedTourDate)}
                </dd>
              </div>
              <div className="space-y-0.5">
                <dt className="text-xs font-medium tracking-wide uppercase text-muted-foreground">
                  {copy.receipt.guestCountLabel}
                </dt>
                <dd className="text-sm font-semibold text-foreground">
                  {receipt.totalGuestCount}
                </dd>
              </div>
            </dl>

            <p className="text-xs leading-relaxed text-muted-foreground italic">
              {copy.receipt.preferenceNote}
            </p>

            <div className="border-t border-border/60 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
              <span>Cần hỗ trợ trực tiếp?</span>
              <a
                href={phone.href}
                className="font-bold text-foreground hover:underline inline-flex items-center gap-1.5"
              >
                <Phone className="size-3.5 text-primary" aria-hidden="true" />
                <span>Hotline: {phone.display}</span>
              </a>
            </div>
          </div>
        ) : (
          <Form {...form}>
            <form
              aria-label={copy.heading}
              aria-busy={pending}
              className="mt-4 rounded-2xl border border-border/80 bg-card p-5 shadow-xs sm:p-7 space-y-4"
              noValidate
              onSubmit={handleSubmit}
            >
            {showErrorSummary && summaryFields.length > 0 ? (
              <Alert
                ref={errorSummaryRef}
                variant="destructive"
                tabIndex={-1}
                className="border-destructive/30 bg-destructive/5 text-destructive p-3.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2"
              >
                <AlertCircle aria-hidden="true" className="size-4 text-destructive" />
                <AlertTitle className="font-semibold tracking-tight text-sm">
                  {copy.errorSummaryHeading}
                </AlertTitle>
                <AlertDescription className="mt-1.5">
                  <ul className="list-disc space-y-1 pl-4 text-xs sm:text-sm">
                    {summaryFields.map((name) => (
                      <li key={name}>
                        <a
                          href={`#${name}`}
                          className="font-medium underline underline-offset-3 hover:text-destructive/80 transition-colors"
                        >
                          {fieldError(name)}
                        </a>
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
                <FormItem className="space-y-0">
                  <BookingFieldHeading copy={copy.fields.requestedTourDate} id="requestedTourDate" isRequired />
                  <FormControl id="requestedTourDate">
                    <Input
                      {...field}
                      className="min-h-11 h-11 px-3.5 py-2 text-base md:text-sm rounded-lg border-border/80 bg-background transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
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
                  <FormMessage className="text-xs font-medium text-destructive mt-1 leading-tight" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="totalGuestCount"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <BookingFieldHeading copy={copy.fields.totalGuestCount} id="totalGuestCount" isRequired />
                  <FormControl id="totalGuestCount">
                    <Input
                      {...field}
                      className="min-h-11 h-11 px-3.5 py-2 text-base md:text-sm rounded-lg border-border/80 bg-background transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
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
                  <FormMessage className="text-xs font-medium text-destructive mt-1 leading-tight" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="guestName"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <BookingFieldHeading copy={copy.fields.guestName} id="guestName" isRequired />
                  <FormControl id="guestName">
                    <Input
                      {...field}
                      className="min-h-11 h-11 px-3.5 py-2 text-base md:text-sm rounded-lg border-border/80 bg-background transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
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
                  <FormMessage className="text-xs font-medium text-destructive mt-1 leading-tight" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <BookingFieldHeading copy={copy.fields.phoneNumber} id="phoneNumber" isRequired />
                  <FormControl id="phoneNumber">
                    <Input
                      {...field}
                      className="min-h-11 h-11 px-3.5 py-2 text-base md:text-sm rounded-lg border-border/80 bg-background transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
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
                  <FormMessage className="text-xs font-medium text-destructive mt-1 leading-tight" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="guestNotes"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <BookingFieldHeading copy={copy.fields.guestNotes} id="guestNotes" isRequired={false} />
                  <FormControl id="guestNotes">
                    <Textarea
                      {...field}
                      className="min-h-24 h-24 px-3.5 py-2 text-base md:text-sm rounded-lg border-border/80 bg-background transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
                      maxLength={1_000}
                      disabled={fieldLocked}
                      onChange={(event) => {
                        announceStart();
                        field.onChange(event);
                      }}
                    />
                  </FormControl>
                  <BookingFieldDescription copy={copy.fields.guestNotes} requirementCopy={copy.optionalHint} />
                  <FormMessage className="text-xs font-medium text-destructive mt-1 leading-tight" />
                </FormItem>
              )}
            />

            {pending ? (
              <div role="status" aria-live="polite" className="flex items-center gap-2.5 text-sm font-medium text-muted-foreground py-1">
                <LoaderCircle aria-hidden="true" className="size-4 animate-spin text-primary motion-reduce:animate-none" />
                {copy.submitting}
              </div>
            ) : null}

            {failureCopy ? (
              <Alert className="border-border bg-muted/40 p-4 rounded-lg">
                <AlertCircle aria-hidden="true" className="size-4 text-foreground" />
                <AlertTitle className="font-semibold tracking-tight text-foreground">
                  {failureCopy.heading}
                </AlertTitle>
                <AlertDescription className="mt-2">
                  <p className="text-sm leading-relaxed text-muted-foreground">{failureCopy.message}</p>
                  <Button
                    asChild
                    variant="link"
                    className="mt-2.5 h-auto justify-start p-0 text-sm font-medium text-primary hover:underline"
                  >
                    <a
                      href={phone.href}
                      onClick={() => analytics.trackContact("phone", "booking", "vi")}
                    >
                      <Phone aria-hidden="true" className="size-3.5 mr-1 text-muted-foreground inline" />
                      {copy.phoneFallback}: {phone.display}
                    </a>
                  </Button>
                </AlertDescription>
              </Alert>
            ) : null}

            <div className="pt-2">
              <Button
                type="submit"
                size="lg"
                disabled={pending || failure === "conflict"}
                className="min-h-12 w-full px-8 text-base font-semibold shadow-sm transition-all duration-150 active:scale-[0.99] sm:w-auto"
              >
                {failureCopy?.retry ?? copy.submit}
              </Button>
            </div>
            </form>
          </Form>
        )}
      </div>
    </section>
  );
}
