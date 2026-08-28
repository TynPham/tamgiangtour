"use client";

import * as React from "react";

export interface ScrollRevealProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  duration?: number;
  variant?: "standard" | "heading" | "image";
  className?: string;
  as?: React.ElementType;
}

function subscribeReducedMotion(callback: () => void) {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return () => {};
  }
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  mediaQuery.addEventListener?.("change", callback);
  return () => mediaQuery.removeEventListener?.("change", callback);
}

function getReducedMotionSnapshot() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

export function ScrollReveal({
  children,
  delay = 0,
  direction = "up",
  distance = 16,
  duration = 700,
  variant = "standard",
  className = "",
  as: Component = "div",
  style,
  ...props
}: ScrollRevealProps) {
  const prefersReducedMotion = React.useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  const [isIntersected, setIsIntersected] = React.useState(false);
  const elementRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    if (prefersReducedMotion) return;

    if (
      typeof window === "undefined" ||
      typeof window.IntersectionObserver !== "function"
    ) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          setIsIntersected(true);
          if (elementRef.current) {
            observer.unobserve(elementRef.current);
          }
        }
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    const currentEl = elementRef.current;
    if (currentEl) {
      observer.observe(currentEl);
    }

    return () => {
      if (currentEl) {
        observer.unobserve(currentEl);
      }
    };
  }, [prefersReducedMotion]);

  const hasIntersectionObserver =
    typeof window === "undefined" ||
    typeof window.IntersectionObserver === "function";

  const isVisible =
    prefersReducedMotion || !hasIntersectionObserver || isIntersected;

  const getTransform = () => {
    if (isVisible) return "translate3d(0, 0, 0) scale(1)";
    const scale = variant === "image" ? " scale(1.035)" : " scale(1)";
    switch (direction) {
      case "up":
        return `translate3d(0, ${distance}px, 0)${scale}`;
      case "down":
        return `translate3d(0, -${distance}px, 0)${scale}`;
      case "left":
        return `translate3d(${distance}px, 0, 0)${scale}`;
      case "right":
        return `translate3d(-${distance}px, 0, 0)${scale}`;
      case "none":
      default:
        return `translate3d(0, 0, 0)${scale}`;
    }
  };

  const hiddenClipPath =
    variant === "heading" ? "inset(0 0 45% 0)" : "inset(0)";

  return (
    <Component
      ref={elementRef}
      className={className}
      style={{
        ...style,
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        clipPath:
          variant === "image"
            ? undefined
            : isVisible
              ? "inset(0)"
              : hiddenClipPath,
        transition: prefersReducedMotion
          ? "none"
          : `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, clip-path ${duration + 120}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange:
          isVisible || variant === "image"
            ? "auto"
            : "opacity, transform, clip-path",
      }}
      {...props}
    >
      {children}
    </Component>
  );
}
