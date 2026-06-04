"use client";
import React, { useMemo } from "react";
import dynamic from "next/dynamic";

const World = dynamic(
  () => import("@/components/ui/globe").then((m) => m.World),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full w-full">
        <div className="animate-pulse text-muted-foreground">
          Loading...
        </div>
      </div>
    ),
  },
);

export default function TeamGlobe() {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const globeConfig = useMemo(
    () => ({
      pointSize: 4,
      globeColor: "#3E1E68",
      showAtmosphere: true,
      atmosphereColor: "#E45A92",
      atmosphereAltitude: 0.15,
      emissive: "#5D2F77",
      emissiveIntensity: 0.1,
      shininess: 0.9,
      polygonColor: "rgba(255,255,255,0.7)",
      ambientLight: "#E45A92",
      directionalLeftLight: "#ffffff",
      directionalTopLight: "#ffffff",
      pointLight: "#E45A92",
      arcTime: 1000,
      arcLength: 0.9,
      rings: 1,
      maxRings: 3,
      initialPosition: { lat: 26.8467, lng: 80.9462 }, // Lucknow coordinates
      autoRotate: true,
      autoRotateSpeed: isMobile ? 0.3 : 0.5,
    }),
    [isMobile],
  );

  const teamArcs = useMemo(
    () => [
      {
        order: 1,
        startLat: 26.8467, // Lucknow
        startLng: 80.9462,
        endLat: 25.4358, // Prayagraj
        endLng: 81.8463,
        arcAlt: 0.1,
        color: "#E45A92",
      },
      {
        order: 2,
        startLat: 26.8467, // Lucknow
        startLng: 80.9462,
        endLat: 12.9716, // Bangalore
        endLng: 77.5946,
        arcAlt: 0.25,
        color: "#FFACAC",
      },
      {
        order: 3,
        startLat: 25.4358, // Prayagraj
        startLng: 81.8463,
        endLat: 12.9716, // Bangalore
        endLng: 77.5946,
        arcAlt: 0.2,
        color: "#5D2F77",
      },
      {
        order: 4,
        startLat: 26.8467, // Lucknow
        startLng: 80.9462,
        endLat: 28.6139, // Delhi
        endLng: 77.209,
        arcAlt: 0.12,
        color: "#E45A92",
      },
      {
        order: 5,
        startLat: 28.6139, // Delhi
        startLng: 77.209,
        endLat: 22.5726, // Kolkata
        endLng: 88.3639,
        arcAlt: 0.2,
        color: "#FFACAC",
      },
      {
        order: 6,
        startLat: 26.8467, // Lucknow
        startLng: 80.9462,
        endLat: 26.2345, // Raebareli
        endLng: 81.2329,
        arcAlt: 0.05,
        color: "#5D2F77",
      },
      {
        order: 7,
        startLat: 26.2345, // Raebareli
        startLng: 81.2329,
        endLat: 25.4358, // Prayagraj
        endLng: 81.8463,
        arcAlt: 0.06,
        color: "#E45A92",
      },
      {
        order: 8,
        startLat: 22.5726, // Kolkata
        startLng: 88.3639,
        endLat: 12.9716, // Bangalore
        endLng: 77.5946,
        arcAlt: 0.22,
        color: "#FFACAC",
      },
      {
        order: 9,
        startLat: 26.8467, // Lucknow
        startLng: 80.9462,
        endLat: 21.1702, // Surat
        endLng: 72.8311,
        arcAlt: 0.15,
        color: "#E45A92",
      },
      {
        order: 10,
        startLat: 26.8467, // Lucknow
        startLng: 80.9462,
        endLat: 30.901, // Ludhiana
        endLng: 75.8573,
        arcAlt: 0.14,
        color: "#FFACAC",
      },
      {
        order: 11,
        startLat: 26.8467, // Lucknow
        startLng: 80.9462,
        endLat: 13.0827, // Chennai (Madras)
        endLng: 80.2707,
        arcAlt: 0.24,
        color: "#5D2F77",
      },
      {
        order: 12,
        startLat: 26.8467, // Lucknow
        startLng: 80.9462,
        endLat: 19.076, // Mumbai
        endLng: 72.8777,
        arcAlt: 0.18,
        color: "#E45A92",
      },
      {
        order: 13,
        startLat: 28.6139, // Delhi
        startLng: 77.209,
        endLat: 25.4358, // Prayagraj
        endLng: 81.8463,
        arcAlt: 0.16,
        color: "#FFACAC",
      },
      {
        order: 14,
        startLat: 28.6139, // Delhi
        startLng: 77.209,
        endLat: 19.076, // Mumbai
        endLng: 72.8777,
        arcAlt: 0.2,
        color: "#5D2F77",
      },
      {
        order: 15,
        startLat: 26.8467, // Lucknow
        startLng: 80.9462,
        endLat: 17.3850, // Hyderabad
        endLng: 78.4867,
        arcAlt: 0.2,
        color: "#E45A92",
      },
      {
        order: 16,
        startLat: 26.8467, // Lucknow
        startLng: 80.9462,
        endLat: 26.9124, // Jaipur
        endLng: 75.7873,
        arcAlt: 0.1,
        color: "#FFACAC",
      },
    ],
    [],
  );

  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0 h-full w-full">
        <World data={teamArcs} globeConfig={globeConfig} />
      </div>
    </div>
  );
}
