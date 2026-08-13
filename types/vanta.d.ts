declare module "vanta/dist/vanta.fog.min" {
  type VantaFogOptions = {
    el: HTMLElement;
    THREE: typeof import("three");
    mouseControls?: boolean;
    touchControls?: boolean;
    gyroControls?: boolean;
    minHeight?: number;
    minWidth?: number;
    highlightColor?: number;
    midtoneColor?: number;
    lowlightColor?: number;
    baseColor?: number;
    blurFactor?: number;
    speed?: number;
    zoom?: number;
  };

  type VantaFogEffect = {
    destroy: () => void;
    resize: () => void;
    setOptions: (options: Partial<VantaFogOptions>) => void;
  };

  export default function createFog(
    options: VantaFogOptions,
  ): VantaFogEffect;
}
