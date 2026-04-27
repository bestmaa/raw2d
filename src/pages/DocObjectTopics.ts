import type { DocTopic } from "./DocPage.type";
import {
  fullCircleExample,
  fullLineExample,
  fullRectExample,
  fullText2DExample
} from "./DocFullExamples";
import { spriteTopics } from "./DocSpriteTopics";

export const objectTopics: readonly DocTopic[] = [
  {
    id: "rect",
    label: "Rect",
    title: "Rect",
    description: "Create a rectangle object as isolated data. Rect does not draw itself.",
    sections: [
      {
        title: "Create A Rect",
        body: "Rect stores transform and size data.",
        liveDemoId: "rect",
        code: `const rect = new Rect({
  x: 100,
  y: 80,
  width: 200,
  height: 120,
  material: new BasicMaterial({ fillColor: "#f45b69" })
});`
      },
      {
        title: "Rect Parameters",
        body: "Fields accepted by Rect.",
        liveDemoId: "rect",
        code: `x: number
y: number
width: number
height: number
rotation?: number
scaleX?: number
scaleY?: number
origin?: Object2DOriginValue
visible?: boolean
material?: BasicMaterial`
      },
      {
        title: "Rect Material",
        body: "Rect uses BasicMaterial fill color.",
        liveDemoId: "rect",
        code: `material: new BasicMaterial({
  fillColor: "#f45b69"
})`
      },
      {
        title: "Full Rect Code",
        body: "Complete setup from canvas element to rendered Rect.",
        liveDemoId: "rect",
        code: fullRectExample
      }
    ]
  },
  {
    id: "circle",
    label: "Circle",
    title: "Circle",
    description: "Create a circle object as isolated data. Circle does not draw itself.",
    sections: [
      {
        title: "Create A Circle",
        body: "Circle stores transform and radius data.",
        liveDemoId: "circle",
        code: `const circle = new Circle({
  x: 260,
  y: 130,
  radius: 60,
  material: new BasicMaterial({ fillColor: "#35c2ff" })
});`
      },
      {
        title: "Circle Parameters",
        body: "Fields accepted by Circle.",
        liveDemoId: "circle",
        code: `x: number
y: number
radius: number
rotation?: number
scaleX?: number
scaleY?: number
origin?: Object2DOriginValue
visible?: boolean
material?: BasicMaterial`
      },
      {
        title: "Circle Material",
        body: "Circle uses BasicMaterial fill color.",
        liveDemoId: "circle",
        code: `material: new BasicMaterial({
  fillColor: "#35c2ff"
})`
      },
      {
        title: "Full Circle Code",
        body: "Complete setup from canvas element to rendered Circle.",
        liveDemoId: "circle",
        code: fullCircleExample
      }
    ]
  },
  {
    id: "text2d",
    label: "Text2D",
    title: "Text2D",
    description: "Create text as isolated object data. Text2D does not draw itself.",
    sections: [
      {
        title: "Create Text2D",
        body: "Text2D stores content, font, alignment, transform, and material data.",
        liveDemoId: "text2d",
        code: `const text = new Text2D({
  x: 80,
  y: 135,
  text: "Hello Raw2D",
  font: "32px sans-serif",
  material: new BasicMaterial({ fillColor: "#f5f7fb" })
});`
      },
      {
        title: "Text2D Parameters",
        body: "Fields accepted by Text2D.",
        liveDemoId: "text2d",
        code: `x: number
y: number
text: string
font?: string
align?: CanvasTextAlign
baseline?: CanvasTextBaseline
origin?: Object2DOriginValue
visible?: boolean
material?: BasicMaterial`
      },
      {
        title: "Text2D Material",
        body: "Text2D uses BasicMaterial fill color.",
        liveDemoId: "text2d",
        code: `material: new BasicMaterial({
  fillColor: "#f5f7fb"
})`
      },
      {
        title: "Full Text2D Code",
        body: "Complete setup from canvas element to rendered text.",
        liveDemoId: "text2d",
        code: fullText2DExample
      }
    ]
  },
  {
    id: "line",
    label: "Line",
    title: "Line",
    description: "Create a line object as isolated data. Line does not draw itself.",
    sections: [
      {
        title: "Create A Line",
        body: "Line stores transform and local start/end point data.",
        liveDemoId: "line",
        code: `const line = new Line({
  x: 100,
  y: 120,
  startX: 0,
  startY: 0,
  endX: 260,
  endY: 80,
  material: new BasicMaterial({ strokeColor: "#facc15", lineWidth: 6 })
});`
      },
      {
        title: "Line Parameters",
        body: "Fields accepted by Line.",
        liveDemoId: "line",
        code: `x: number
y: number
startX?: number
startY?: number
endX: number
endY: number
rotation?: number
scaleX?: number
scaleY?: number
origin?: Object2DOriginValue
visible?: boolean
material?: BasicMaterial`
      },
      {
        title: "Line Material",
        body: "Line uses BasicMaterial stroke color and line width.",
        liveDemoId: "line",
        code: `material: new BasicMaterial({
  strokeColor: "#facc15",
  lineWidth: 6
})`
      },
      {
        title: "Full Line Code",
        body: "Complete setup from canvas element to rendered Line.",
        liveDemoId: "line",
        code: fullLineExample
      }
    ]
  },
  ...spriteTopics
];
