"use client";

import dynamic from "next/dynamic";

const TamGiangWaterCanvas = dynamic(
  () =>
    import("@/components/landing/tam-giang-water-canvas").then(
      (module) => module.TamGiangWaterCanvas,
    ),
  { ssr: false },
);

export function TamGiangWaterIsland({
  imageSrc,
  imageWidth,
  imageHeight,
}: {
  imageSrc: string;
  imageWidth: number;
  imageHeight: number;
}) {
  return (
    <TamGiangWaterCanvas
      imageSrc={imageSrc}
      imageWidth={imageWidth}
      imageHeight={imageHeight}
    />
  );
}
