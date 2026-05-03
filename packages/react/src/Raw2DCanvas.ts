import { Fragment, createElement, useCallback, useEffect, useRef, useState, type ReactElement } from "react";
import { Camera2D, Scene } from "raw2d";
import { createRaw2DReactRenderer } from "./createRaw2DReactRenderer.js";
import { Raw2DReactContext } from "./Raw2DReactContext.js";
import type { Raw2DReactContextValue } from "./Raw2DReactContext.type.js";
import type { Raw2DCanvasProps } from "./Raw2DCanvas.type.js";
import type { Raw2DReactRenderer } from "./Raw2DCanvas.type.js";

export function Raw2DCanvas(props: Raw2DCanvasProps): ReactElement {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sceneRef = useRef<Scene | null>(null);
  const cameraRef = useRef<Camera2D | null>(null);
  const rendererRef = useRef<Raw2DReactRenderer | null>(null);
  const [renderer, setRenderer] = useState<Raw2DReactRenderer | null>(null);
  const width = props.width ?? 800;
  const height = props.height ?? 480;

  if (!sceneRef.current) {
    sceneRef.current = new Scene();
  }

  if (!cameraRef.current) {
    cameraRef.current = new Camera2D();
  }

  const scene = props.scene ?? sceneRef.current;
  const camera = props.camera ?? cameraRef.current;
  const requestRender = useCallback((): void => {
    rendererRef.current?.render(scene, camera);
  }, [camera, scene]);
  const contextValue: Raw2DReactContextValue = {
    scene,
    camera,
    renderer,
    requestRender
  };

  useEffect((): (() => void) | undefined => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return undefined;
    }

    const result = createRaw2DReactRenderer({
      canvas,
      renderer: props.renderer ?? "canvas",
      width,
      height,
      pixelRatio: props.pixelRatio ?? globalThis.devicePixelRatio ?? 1,
      backgroundColor: props.backgroundColor ?? "#000000",
      fallbackToCanvas: props.fallbackToCanvas ?? true
    });

    rendererRef.current = result.renderer;
    setRenderer(result.renderer);
    result.renderer.render(scene, camera);
    props.onReady?.({
      canvas,
      renderer: result.renderer,
      rendererKind: result.rendererKind,
      scene,
      camera
    });

    return (): void => {
      result.renderer.dispose();
      rendererRef.current = null;
      setRenderer(null);
    };
  }, [
    props.backgroundColor,
    props.camera,
    props.fallbackToCanvas,
    props.onReady,
    props.pixelRatio,
    props.renderer,
    props.scene,
    height,
    width
  ]);

  const canvasElement = createElement("canvas", {
    "aria-label": props.ariaLabel ?? "Raw2D canvas",
    className: props.className,
    height,
    ref: canvasRef,
    style: props.style,
    width
  });

  return createElement(
    Fragment,
    null,
    canvasElement,
    createElement(Raw2DReactContext.Provider, { value: contextValue }, props.children)
  );
}
