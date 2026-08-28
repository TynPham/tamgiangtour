export const ANALYTICS_CONSENT_KEY = "tamgiang_analytics_consent";

export type AnalyticsConsent = "granted" | "denied" | "pending";

function getStorage(customStorage?: Storage): Storage | null {
  if (customStorage) return customStorage;
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      return window.localStorage;
    } catch {
      return null;
    }
  }
  return null;
}

export function getAnalyticsConsent(customStorage?: Storage): AnalyticsConsent {
  const storage = getStorage(customStorage);
  if (!storage) return "pending";

  try {
    const value = storage.getItem(ANALYTICS_CONSENT_KEY);
    if (value === "granted") return "granted";
    if (value === "denied") return "denied";
    return "pending";
  } catch {
    return "pending";
  }
}

export function setAnalyticsConsent(
  consent: "granted" | "denied",
  customStorage?: Storage,
): void {
  const storage = getStorage(customStorage);
  if (!storage) return;

  try {
    storage.setItem(ANALYTICS_CONSENT_KEY, consent);
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("tamgiang:consent_changed", { detail: { consent } }),
      );
    }
  } catch {
    // Storage failure must never throw or affect app execution
  }
}

export function hasAnalyticsConsent(customStorage?: Storage): boolean {
  return getAnalyticsConsent(customStorage) === "granted";
}
