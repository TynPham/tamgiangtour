import * as React from "react";
import { ScrollReveal } from "@/components/landing/scroll-reveal";

interface WaterDividerProps {
  variant?: "wave" | "contour" | "shimmer" | "deep";
  className?: string;
  flip?: boolean;
}

export function WaterDivider({
  variant = "wave",
  className = "",
  flip = false,
}: WaterDividerProps) {
  const flipClass = flip ? "rotate-180" : "";

  if (variant === "shimmer") {
    return (
      <div
        className={`relative w-full h-px overflow-hidden bg-border/40 ${className}`}
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/35 to-transparent animate-water-shimmer w-full" />
      </div>
    );
  }

  if (variant === "contour") {
    return (
      <div
        className={`w-full overflow-hidden leading-none pointer-events-none py-1.5 ${flipClass} ${className}`}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 1200 24"
          preserveAspectRatio="none"
          className="w-full h-4 sm:h-5 text-border/70 fill-none stroke-current animate-water-drift"
        >
          <path
            d="M0,12 C200,4 400,20 600,10 C800,2 1000,18 1200,8"
            strokeWidth="1.2"
            strokeDasharray="4 6"
            className="opacity-60"
          />
          <path
            d="M0,18 C250,8 450,22 700,14 C950,6 1100,20 1200,15"
            strokeWidth="1"
            className="opacity-40"
          />
        </svg>
      </div>
    );
  }

  if (variant === "deep") {
    return (
      <div
        className={`w-full overflow-hidden leading-none pointer-events-none ${flipClass} ${className}`}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 1440 48"
          preserveAspectRatio="none"
          className="w-full h-6 sm:h-9 text-muted/40 fill-current"
        >
          <path d="M0,32 C320,48 420,12 720,24 C1020,36 1120,8 1440,28 L1440,48 L0,48 Z" />
        </svg>
      </div>
    );
  }

  // Default "wave"
  return (
    <div
      className={`w-full overflow-hidden leading-none pointer-events-none ${flipClass} ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1200 32"
        preserveAspectRatio="none"
        className="w-full h-4 sm:h-7 text-border/50 fill-none stroke-current animate-water-drift"
      >
        <path
          d="M0,16 C150,26 350,6 550,18 C750,30 950,8 1200,20"
          strokeWidth="1.5"
          className="opacity-75"
        />
        <path
          d="M0,22 C200,10 400,28 650,14 C900,2 1050,24 1200,16"
          strokeWidth="1"
          className="opacity-45"
        />
      </svg>
    </div>
  );
}

export function WaterImageReveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <ScrollReveal
      delay={delay}
      direction="none"
      distance={0}
      duration={900}
      variant="image"
      className={`group relative ${className}`}
    >
      {children}
    </ScrollReveal>
  );
}
