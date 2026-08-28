"use client";

import { useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { getAnalyticsConsent, setAnalyticsConsent, type AnalyticsConsent } from "@/src/analytics/consent";

function subscribe(callback: () => void) {
  window.addEventListener("tamgiang:consent_changed", callback);
  return () => {
    window.removeEventListener("tamgiang:consent_changed", callback);
  };
}

function getSnapshot(): AnalyticsConsent {
  return getAnalyticsConsent();
}

function getServerSnapshot(): AnalyticsConsent {
  return "granted";
}

export function AnalyticsConsentBanner() {
  const consentState = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (consentState !== "pending") {
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
