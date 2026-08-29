import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

export function SiteContainer({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn("mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", className)}
      {...props}
    />
  );
}

export function SectionEyebrow({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary",
        className,
      )}
      {...props}
    >
      <span className="h-px w-6 bg-primary" aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
}
