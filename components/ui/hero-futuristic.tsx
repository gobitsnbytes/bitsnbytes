'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber';
import { useAspect, useTexture } from '@react-three/drei';
import * as THREE from 'three/webgpu';
import { Mesh } from 'three';
import { ArrowDown } from 'lucide-react';
import { GlassEffect, GlassFilter } from '@/components/ui/liquid-glass';
import { bloom } from 'three/examples/jsm/tsl/display/BloomNode.js';
import {
  abs,
  add,
  blendScreen,
  float,
  mix,
  mod,
  mx_cell_noise_float,
  oneMinus,
  pass,
  smoothstep,
  texture,
  uniform,
  uv,
  vec2,
  vec3,
} from 'three/tsl';

const TEXTUREMAP = {
  // Original blob hero texture
  src: 'https://i.postimg.cc/XYwvXN8D/img-4.png',
};

const DEPTHMAP = {
  // Original depth map for the scanline/flow effect
  src: 'https://i.postimg.cc/2SHKQh2q/raw-4.webp',
};

extend(THREE as any);

const PostProcessing = ({
  strength = 1,
  threshold = 1,
  fullScreenEffect = true,
}: {
  strength?: number;
  threshold?: number;
  fullScreenEffect?: boolean;
}) => {
  const { gl, scene, camera } = useThree();
  const progressRef = useRef<{ value: number }>({ value: 0 });

  const render = useMemo(() => {
    const postProcessing = new (THREE as any).PostProcessing(gl as any);
    const scenePass = pass(scene, camera);
    const scenePassColor = scenePass.getTextureNode('output');

    const bloomPass = bloom(scenePassColor, strength, 0.5, threshold);

    const uScanProgress = uniform(0);
    progressRef.current = uScanProgress as unknown as { value: number };

    const scanPos = float(uScanProgress.value);
    const uvY = uv().y;
    const scanWidth = float(0.05);
    const scanLine = smoothstep(0, scanWidth, abs(uvY.sub(scanPos)));

    // Brand accent overlay (Bits&Bytes pink/purple instead of pure red)
    const brandOverlay = vec3(0.89, 0.35, 0.57).mul(oneMinus(scanLine)).mul(0.4);

    const withScanEffect = mix(
      scenePassColor,
      add(scenePassColor, brandOverlay),
      fullScreenEffect ? smoothstep(0.9, 1.0, oneMinus(scanLine)) : 1.0,
    );

    const final = withScanEffect.add(bloomPass);
    postProcessing.outputNode = final;

    return postProcessing;
  }, [camera, gl, scene, strength, threshold, fullScreenEffect]);

  useFrame(({ clock }) => {
    progressRef.current.value =
      Math.sin(clock.getElapsedTime() * 0.5) * 0.5 + 0.5;
    render.renderAsync();
  }, 1);

  return null;
};

const WIDTH = 300;
const HEIGHT = 300;

const Scene = () => {
  const [rawMap, depthMap] = useTexture([TEXTUREMAP.src, DEPTHMAP.src]);
  const meshRef = useRef<Mesh | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (rawMap && depthMap) {
      setVisible(true);
    }
  }, [rawMap, depthMap]);

  const { material, uniforms } = useMemo(() => {
    const uPointer = uniform(new (THREE as any).Vector2(0));
    const uProgress = uniform(0);

    const strength = 0.01;
    const tDepthMap = texture(depthMap as any);
    const tMap = texture(
      rawMap as any,
      uv().add(tDepthMap.r.mul(uPointer).mul(strength)),
    );

    const aspect = float(WIDTH).div(HEIGHT);
    const tUv = vec2(uv().x.mul(aspect), uv().y);
    const tiling = vec2(120.0);
    const tiledUv = mod(tUv.mul(tiling), 2.0).sub(1.0);

    const brightness = mx_cell_noise_float(tUv.mul(tiling).div(2));
    const dist = float(tiledUv.length());
    const dot = float(smoothstep(0.5, 0.49, dist)).mul(brightness);
    const depth = tDepthMap;
    const flow = oneMinus(
      smoothstep(0, 0.02, abs(depth.sub(uProgress as any))),
    );
    // Brand-colored scanline mask instead of pure red
    const mask = dot.mul(flow).mul(vec3(6.0, 2.4, 3.8));
    const final = blendScreen(tMap, mask);

    const material = new (THREE as any).MeshBasicNodeMaterial({
      colorNode: final,
      transparent: true,
      opacity: 0,
    });

    return {
      material,
      uniforms: {
        uPointer,
        uProgress,
      },
    };
  }, [rawMap, depthMap]);

  const [w, h] = useAspect(WIDTH, HEIGHT);

  useFrame(({ clock }) => {
    uniforms.uProgress.value =
      Math.sin(clock.getElapsedTime() * 0.5) * 0.5 + 0.5;

    if (
      meshRef.current &&
      'material' in meshRef.current &&
      (meshRef.current as any).material
    ) {
      const mat = (meshRef.current as any).material;
      if ('opacity' in mat) {
        mat.opacity = THREE.MathUtils.lerp(mat.opacity, visible ? 1 : 0, 0.07);
      }
    }
  });

  useFrame(({ pointer }) => {
    uniforms.uPointer.value = pointer;
  });

  const scaleFactor = 0.4;

  return (
    <mesh
      ref={meshRef}
      scale={[w * scaleFactor, h * scaleFactor, 1]}
      material={material}
    >
      <planeGeometry />
    </mesh>
  );
};

export const HeroFuturistic = () => {
  const titleWords = 'Build Your Dreams'.split(' ');
  const subtitle = 'AI-powered creativity for the next generation.';

  const [visibleWords, setVisibleWords] = useState(0);
  const [subtitleVisible, setSubtitleVisible] = useState(false);
  const [delays, setDelays] = useState<number[]>([]);
  const [subtitleDelay, setSubtitleDelay] = useState(0);

  useEffect(() => {
    setDelays(titleWords.map(() => Math.random() * 0.07));
    setSubtitleDelay(Math.random() * 0.1);
  }, [titleWords.length]);

  useEffect(() => {
    if (visibleWords < titleWords.length) {
      const timeout = setTimeout(
        () => setVisibleWords((prev) => prev + 1),
        600,
      );
      return () => clearTimeout(timeout);
    }

    const timeout = setTimeout(() => setSubtitleVisible(true), 800);
    return () => clearTimeout(timeout);
  }, [visibleWords, titleWords.length]);

  return (
    <div className="relative h-svh bg-gradient-to-b from-[#120524] via-[#3e1e68] to-[#5d2f77] text-white overflow-hidden">
      <GlassFilter />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(228,90,146,0.45),_transparent_55%)]" />

      <div className="h-svh uppercase items-center w-full absolute z-30 pointer-events-none px-6 sm:px-10 flex justify-center flex-col">
        <GlassEffect className="pointer-events-auto rounded-3xl px-6 py-4 md:px-10 md:py-6 bg-transparent text-white">
          <div className="text-3xl md:text-5xl xl:text-6xl 2xl:text-7xl font-extrabold tracking-tight text-center">
            <div className="flex flex-wrap justify-center space-x-2 lg:space-x-6 overflow-hidden">
              {titleWords.map((word, index) => (
                <div
                  key={index}
                  className={index < visibleWords ? 'fade-in' : ''}
                  style={{
                    animationDelay: `${
                      index * 0.13 + (delays[index] || 0)
                    }s`,
                    opacity: index < visibleWords ? undefined : 0,
                  }}
                >
                  {word}
                </div>
              ))}
            </div>
          </div>

          <div className="text-xs md:text-xl xl:text-2xl 2xl:text-3xl mt-4 overflow-hidden font-bold text-center max-w-xl mx-auto">
            <div
              className={subtitleVisible ? 'fade-in-subtitle' : ''}
              style={{
                animationDelay: `${
                  titleWords.length * 0.13 + 0.2 + subtitleDelay
                }s`,
                opacity: subtitleVisible ? undefined : 0,
              }}
            >
              {subtitle}
            </div>
          </div>
        </GlassEffect>
      </div>

      <div className="absolute inset-x-0 bottom-8 z-40 flex justify-center pointer-events-none">
        <button
          className="explore-btn group pointer-events-auto"
          style={{ animationDelay: '2.2s' }}
          type="button"
        >
          <span className="flex items-center gap-2 text-xs md:text-sm">
            Scroll to explore
            <span className="explore-arrow">
              <ArrowDown className="arrow-svg" />
            </span>
          </span>
        </button>
      </div>

      <Canvas
        className="relative z-10"
        flat
        gl={async (props) => {
          const renderer = new THREE.WebGPURenderer(props as any);
          await renderer.init();
          return renderer;
        }}
      >
        <PostProcessing fullScreenEffect={true} />
        <Scene />
      </Canvas>
    </div>
  );
};

export default HeroFuturistic;


