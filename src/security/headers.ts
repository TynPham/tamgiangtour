type SecurityHeader = { key: string; value: string };

function allowedPostHogOrigin() {
  const configuredHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;
  if (!configuredHost) return null;
  try {
    const url = new URL(configuredHost);
    return url.protocol === "https:" ? url.origin : null;
  } catch {
    return null;
  }
}

export function productionSecurityHeaders(): SecurityHeader[] {
  const customPostHogOrigin = allowedPostHogOrigin();
  const connectSources = [
    "'self'",
    "https://*.posthog.com",
    ...(customPostHogOrigin ? [customPostHogOrigin] : []),
  ];
  const contentSecurityPolicy = [
    "default-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    `connect-src ${connectSources.join(" ")}`,
    "frame-src https://www.google.com https://maps.google.com",
    "media-src 'self'",
    "worker-src 'self' blob:",
    "upgrade-insecure-requests",
  ].join("; ");

  return [
    { key: "Content-Security-Policy", value: contentSecurityPolicy },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    {
      key: "Permissions-Policy",
      value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
    },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "X-Frame-Options", value: "DENY" },
    {
      key: "Strict-Transport-Security",
      value: "max-age=31536000; includeSubDomains",
    },
  ];
}
