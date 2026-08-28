"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getAnalyticsConsent, setAnalyticsConsent, type AnalyticsConsent } from "@/src/analytics/consent";

export function AnalyticsConsentBanner() {
  const [consentState, setConsentState] = useState<AnalyticsConsent>("granted"); // default to granted temporarily to prevent SSR layout flash, then check in useEffect
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setConsentState(getAnalyticsConsent());

    const handleConsentChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ consent: AnalyticsConsent }>;
      if (customEvent.detail?.consent) {
        setConsentState(customEvent.detail.consent);
      }
    };

    window.addEventListener("tamgiang:consent_changed", handleConsentChange);
    return () => {
      window.removeEventListener("tamgiang:consent_changed", handleConsentChange);
    };
  }, []);

  if (!mounted || consentState !== "pending") {
    return null;
  }

  return (
    <div
      role="region"
      aria-label="Tùy chọn quyền riêng tư"
      className="fixed bottom-4 left-4 z-40 max-w-sm rounded-xl border border-border bg-card p-4 shadow-lg text-foreground sm:bottom-6 sm:left-6 animate-in fade-in slide-in-from-bottom-2 duration-300"
    >
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Quyền riêng tư
        </p>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Trang web sử dụng phân tích ẩn danh để cải thiện trải nghiệm đặt chỗ. Bạn có đồng ý không?
        </p>
        <div className="flex items-center gap-2 pt-1">
          <Button
            size="sm"
            variant="default"
            className="h-8 text-xs font-medium px-3"
            onClick={() => setAnalyticsConsent("granted")}
          >
            Đồng ý
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs font-medium px-3"
            onClick={() => setAnalyticsConsent("denied")}
          >
            Từ chối
          </Button>
        </div>
      </div>
    </div>
  );
}
