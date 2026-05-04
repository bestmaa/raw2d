import type { StudioSceneState } from "./StudioSceneState.type";

export function createStudioSceneState(): StudioSceneState {
  return {
    version: 1,
    name: "Untitled Scene",
    rendererMode: "canvas",
    camera: {
      x: 0,
      y: 0,
      zoom: 1
    },
    objects: []
  };
}

export function createStudioSampleSceneState(): StudioSceneState {
  return {
    version: 1,
    name: "Sample Scene",
    rendererMode: "canvas",
    camera: {
      x: 0,
      y: 0,
      zoom: 1
    },
    objects: [
      {
        id: "sample-rect",
        type: "rect",
        name: "Blue Card",
        x: 180,
        y: 150,
        width: 180,
        height: 110,
        material: { fillColor: "#35c2ff", strokeColor: "#dff5ff", lineWidth: 3 }
      },
      {
        id: "sample-circle",
        type: "circle",
        name: "Accent Circle",
        x: 460,
        y: 210,
        radius: 58,
        material: { fillColor: "#f472b6" }
      },
      {
        id: "sample-text",
        type: "text2d",
        name: "Title",
        x: 210,
        y: 330,
        text: "Raw2D Studio",
        font: "32px sans-serif",
        material: { fillColor: "#f8fafc" }
      }
    ]
  };
}
