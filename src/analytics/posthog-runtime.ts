import posthog from "posthog-js";

import { hasAnalyticsConsent } from "./consent";

type PostHogRuntimeClient = {
  __loaded?: boolean;
  capture(eventName: string, properties: Record<string, unknown>): void;
  init(
    key: string,
    options: {
      api_host: string;
      autocapture: false;
      capture_pageleave: false;
      capture_pageview: false;
      disable_session_recording: true;
      persistence: "memory";
      person_profiles: "never";
    },
  ): unknown;
};

export function createPostHogRuntime({
  client,
  getConsent,
  key,
  host,
}: {
  client: PostHogRuntimeClient;
  getConsent: () => boolean;
  key?: string;
  host: string;
}) {
  let initialized = client.__loaded === true;

  const initialize = () => {
    if (!getConsent() || !key) return false;
    try {
      if (!initialized && !client.__loaded) {
        client.init(key, {
          api_host: host,
          autocapture: false,
          capture_pageview: false,
          capture_pageleave: false,
          disable_session_recording: true,
          person_profiles: "never",
          persistence: "memory",
        });
      }
      initialized = true;
      return true;
    } catch {
      return false;
    }
  };

  return {
    initialize,
    capture(eventName: string, properties: Record<string, unknown>) {
      if (!initialize()) return;
      try {
        client.capture(eventName, properties);
      } catch {
        // Analytics delivery never affects browsing or enquiry submission.
      }
    },
  };
}

const postHogRuntime = createPostHogRuntime({
  client: posthog,
  getConsent: hasAnalyticsConsent,
  key: process.env.NEXT_PUBLIC_POSTHOG_KEY,
  host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
});

export const initializePostHog = postHogRuntime.initialize;
export const capturePostHogEvent = postHogRuntime.capture;
