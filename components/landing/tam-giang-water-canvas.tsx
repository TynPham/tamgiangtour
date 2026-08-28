"use client";

import * as React from "react";
import * as THREE from "three";
import { Pause, Play } from "lucide-react";

import { Button } from "@/components/ui/button";

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

export function TamGiangWaterCanvas({
  imageSrc,
  imageWidth,
  imageHeight,
  className = "",
}: {
  imageSrc: string;
  imageWidth: number;
  imageHeight: number;
  className?: string;
}) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = React.useState(false);
  const prefersReducedMotion = React.useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    () => false,
  );

  React.useEffect(() => {
    const container = containerRef.current;
    if (prefersReducedMotion || isPaused || !container) return;

    let disposed = false;
    let animationFrameId = 0;
    let isVisible = true;
    let isIntersecting = true;
    let isRendering = false;
    let pointerEnergy = 0;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false,
        powerPreference: "low-power",
      });
    } catch {
      container.dataset.ready = "false";
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.className = "size-full block";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const geometry = new THREE.PlaneGeometry(2, 2);
    const pointer = new THREE.Vector2(0.5, 0.25);
    const pointerTarget = new THREE.Vector2(0.5, 0.25);
    const resolution = new THREE.Vector2(1, 1);

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uImage: { value: null },
        uImageSize: { value: new THREE.Vector2(imageWidth, imageHeight) },
        uPointer: { value: pointer },
        uPointerEnergy: { value: 0 },
        uResolution: { value: resolution },
        uTime: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;

        void main() {
          vUv = uv;
          gl_Position = vec4(position.xy, 0.0, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uImage;
        uniform vec2 uImageSize;
        uniform vec2 uPointer;
        uniform float uPointerEnergy;
        uniform vec2 uResolution;
        uniform float uTime;
        varying vec2 vUv;

        vec2 coverUv(vec2 uv) {
          float canvasAspect = uResolution.x / max(uResolution.y, 1.0);
          float imageAspect = uImageSize.x / uImageSize.y;
          vec2 ratio = vec2(
            min(canvasAspect / imageAspect, 1.0),
            min(imageAspect / canvasAspect, 1.0)
          );
          return uv * ratio + (1.0 - ratio) * 0.5;
        }

        void main() {
          float waterMask = 1.0 - smoothstep(0.42, 0.60, vUv.y);
          float shoreFade = smoothstep(0.02, 0.14, vUv.y);
          float motionMask = waterMask * shoreFade;

          float longRipple = sin(vUv.y * 94.0 + uTime * 1.15) * 0.0018;
          float crossRipple = sin(vUv.y * 48.0 - uTime * 0.72 + vUv.x * 19.0) * 0.0012;
          float pointerDistance = distance(vUv, uPointer);
          float pointerRipple = sin(pointerDistance * 78.0 - uTime * 4.2)
            * exp(-pointerDistance * 11.0)
            * 0.0032
            * uPointerEnergy;

          vec2 distortion = vec2(
            longRipple + crossRipple + pointerRipple,
            cos(vUv.x * 55.0 + uTime * 0.5) * 0.00045
          ) * motionMask;

          vec4 photograph = texture2D(uImage, coverUv(vUv + distortion));
          float shimmerBand = pow(max(0.0, sin(vUv.x * 72.0 + vUv.y * 26.0 - uTime * 0.85)), 14.0);
          float shimmer = shimmerBand * motionMask * 0.055;
          photograph.rgb += vec3(1.0, 0.63, 0.25) * shimmer;
          gl_FragColor = photograph;
        }
      `,
      depthWrite: false,
      depthTest: false,
    });
    scene.add(new THREE.Mesh(geometry, material));

    const resize = () => {
      const width = Math.max(container.clientWidth, 1);
      const height = Math.max(container.clientHeight, 1);
      resolution.set(width, height);
      renderer.setSize(width, height, false);
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry?.isIntersecting ?? false;
        isVisible = isIntersecting && !document.hidden;
        if (isVisible) {
          startRendering();
        } else {
          cancelAnimationFrame(animationFrameId);
          isRendering = false;
        }
      },
      { threshold: 0.02 },
    );
    visibilityObserver.observe(container);

    const handlePointerMove = (event: PointerEvent) => {
      const bounds = container.getBoundingClientRect();
      if (
        event.clientX < bounds.left ||
        event.clientX > bounds.right ||
        event.clientY < bounds.top ||
        event.clientY > bounds.bottom
      ) {
        return;
      }

      pointerTarget.set(
        (event.clientX - bounds.left) / bounds.width,
        1 - (event.clientY - bounds.top) / bounds.height,
      );
      pointerEnergy = 1;
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    const timer = new THREE.Timer();
    timer.connect(document);
    let timerStarted = false;
    const textureLoader = new THREE.TextureLoader();
    let texture: THREE.Texture | null = null;

    const render = () => {
      if (disposed || !isVisible || !texture) {
        isRendering = false;
        return;
      }

      pointer.lerp(pointerTarget, 0.045);
      pointerEnergy *= 0.965;
      material.uniforms.uPointerEnergy.value = pointerEnergy;
      if (!timerStarted) {
        timer.reset();
        timerStarted = true;
      }
      timer.update();
      material.uniforms.uTime.value = timer.getElapsed();
      renderer.render(scene, camera);
      container.dataset.ready = "true";
      animationFrameId = requestAnimationFrame(render);
    };

    function startRendering() {
      if (isRendering || !isVisible || !texture || disposed) return;
      isRendering = true;
      animationFrameId = requestAnimationFrame(render);
    }

    const handleDocumentVisibility = () => {
      isVisible = isIntersecting && !document.hidden;
      if (isVisible) {
        startRendering();
      } else {
        cancelAnimationFrame(animationFrameId);
        isRendering = false;
      }
    };
    document.addEventListener("visibilitychange", handleDocumentVisibility);

    textureLoader.load(
      imageSrc,
      (loadedTexture) => {
        if (disposed) {
          loadedTexture.dispose();
          return;
        }

        texture = loadedTexture;
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        material.uniforms.uImage.value = texture;

        startRendering();
      },
      undefined,
      () => {
        container.dataset.ready = "false";
      },
    );

    return () => {
      disposed = true;
      cancelAnimationFrame(animationFrameId);
      visibilityObserver.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("visibilitychange", handleDocumentVisibility);
      timer.dispose();
      texture?.dispose();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, [imageHeight, imageSrc, imageWidth, isPaused, prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return (
    <>
      {isPaused ? null : (
        <div
          ref={containerRef}
          className={`lagoon-photo-motion pointer-events-none absolute inset-0 ${className}`}
          aria-hidden="true"
        />
      )}
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => setIsPaused((current) => !current)}
        aria-label={
          isPaused
            ? "Bật chuyển động mặt nước"
            : "Tạm dừng chuyển động mặt nước"
        }
        title={
          isPaused
            ? "Bật chuyển động mặt nước"
            : "Tạm dừng chuyển động mặt nước"
        }
        className="absolute right-4 top-4 z-30 size-11 rounded-full border-white/45 bg-black/25 text-white shadow-none backdrop-blur-sm hover:bg-black/45 hover:text-white sm:right-6 sm:top-6"
      >
        {isPaused ? (
          <Play className="size-4" aria-hidden="true" />
        ) : (
          <Pause className="size-4" aria-hidden="true" />
        )}
      </Button>
    </>
  );
}
