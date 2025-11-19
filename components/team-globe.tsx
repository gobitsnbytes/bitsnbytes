"use client";
import React, { useMemo } from "react";
import dynamic from "next/dynamic";

const World = dynamic(() => import("@/components/ui/globe").then((m) => m.World), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full w-full">
      <div className="animate-pulse text-muted-foreground">Loading globe...</div>
    </div>
  ),
});

export default function TeamGlobe() {
  const globeConfig = useMemo(() => ({
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
    autoRotateSpeed: 0.5,
  }), []);

  const teamArcs = useMemo(() => [
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
  ], []);

  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0 h-full w-full">
        <World data={teamArcs} globeConfig={globeConfig} />
      </div>
    </div>
  );
}

