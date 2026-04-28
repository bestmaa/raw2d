import type { DocTopic } from "./DocPage.type";
import { fullArcExample, fullEllipseExample, fullPolygonExample, fullPolylineExample } from "./DocFullExamples";

export const curveTopics: readonly DocTopic[] = [
  {
    id: "ellipse",
    label: "Ellipse",
    title: "Ellipse",
    description: "Create an ellipse object as isolated data. Ellipse does not draw itself.",
    sections: [
      {
        title: "Create An Ellipse",
        body: "Ellipse stores transform and two radius values.",
        liveDemoId: "ellipse",
        code: `const ellipse = new Ellipse({
  x: 260,
  y: 130,
  radiusX: 95,
  radiusY: 52,
  material: new BasicMaterial({ fillColor: "#a78bfa" })
});`
      },
      {
        title: "Ellipse Parameters",
        body: "Fields accepted by Ellipse.",
        liveDemoId: "ellipse",
        code: `x: number
y: number
radiusX: number
radiusY: number
rotation?: number
scaleX?: number
scaleY?: number
origin?: Object2DOriginValue
visible?: boolean
material?: BasicMaterial`
      },
      {
        title: "Full Ellipse Code",
        body: "Complete setup from canvas element to rendered Ellipse.",
        liveDemoId: "ellipse",
        code: fullEllipseExample
      }
    ]
  },
  {
    id: "polyline",
    label: "Polyline",
    title: "Polyline",
    description: "Create an open multi-point path. Polyline stores points; Canvas draws them later.",
    sections: [
      {
        title: "Create A Polyline",
        body: "Polyline connects each point in order without closing the shape.",
        liveDemoId: "polyline",
        code: `const polyline = new Polyline({
  x: 85,
  y: 70,
  points: [
    { x: 0, y: 120 },
    { x: 120, y: 20 },
    { x: 320, y: 150 }
  ],
  material: new BasicMaterial({ strokeColor: "#38bdf8", lineWidth: 6 })
});`
      },
      {
        title: "Polyline Parameters",
        body: "Use points for local geometry and x/y for world placement.",
        liveDemoId: "polyline",
        code: `x: number
y: number
points: readonly { x: number; y: number }[]
rotation?: number
scaleX?: number
scaleY?: number
origin?: Object2DOriginValue
visible?: boolean
material?: BasicMaterial

material.strokeColor?: string
material.lineWidth?: number`
      },
      {
        title: "Full Polyline Code",
        body: "Complete setup from canvas element to rendered Polyline.",
        liveDemoId: "polyline",
        code: fullPolylineExample
      }
    ]
  },
  {
    id: "polygon",
    label: "Polygon",
    title: "Polygon",
    description: "Create a closed multi-point shape. Polygon fills and optionally strokes the path.",
    sections: [
      {
        title: "Create A Polygon",
        body: "Polygon closes the path automatically after the last point.",
        liveDemoId: "polygon",
        code: `const polygon = new Polygon({
  x: 110,
  y: 55,
  points: [
    { x: 80, y: 0 },
    { x: 260, y: 70 },
    { x: 40, y: 160 }
  ],
  material: new BasicMaterial({
    fillColor: "#22c55e",
    strokeColor: "#bbf7d0",
    lineWidth: 3
  })
});`
      },
      {
        title: "Polygon Parameters",
        body: "Fill and stroke are both stored in BasicMaterial.",
        liveDemoId: "polygon",
        code: `x: number
y: number
points: readonly { x: number; y: number }[]
rotation?: number
scaleX?: number
scaleY?: number
origin?: Object2DOriginValue
visible?: boolean
material?: BasicMaterial

material.fillColor?: string
material.strokeColor?: string
material.lineWidth?: number`
      },
      {
        title: "Full Polygon Code",
        body: "Complete setup from canvas element to rendered Polygon.",
        liveDemoId: "polygon",
        code: fullPolygonExample
      }
    ]
  },
  {
    id: "arc",
    label: "Arc",
    title: "Arc",
    description: "Create an elliptical arc object as isolated data. Arc does not draw itself.",
    sections: [
      {
        title: "Create An Arc",
        body: "Arc stores transform, radii, angle range, direction, and closed/open state.",
        liveDemoId: "arc",
        code: `const arc = new Arc({
  x: 260,
  y: 130,
  radiusX: 110,
  radiusY: 70,
  startAngle: 0,
  endAngle: Math.PI * 1.35,
  material: new BasicMaterial({ strokeColor: "#f97316", lineWidth: 8 })
});`
      },
      {
        title: "Arc Parameters",
        body: "Angles use radians because Canvas and WebGL math use radians internally.",
        liveDemoId: "arc",
        code: `x: number
y: number
radiusX: number
radiusY: number
startAngle: number
endAngle: number
anticlockwise?: boolean
closed?: boolean
rotation?: number
origin?: Object2DOriginValue
material?: BasicMaterial`
      },
      {
        title: "Canvas And WebGL",
        body: "Canvas draws Arc with native ellipse path commands. WebGL approximates open arcs with stroked segments and closed arcs with triangle fans.",
        liveDemoId: "arc",
        code: `const openArc = new Arc({
  radiusX: 90,
  radiusY: 50,
  startAngle: 0,
  endAngle: Math.PI,
  material: new BasicMaterial({ strokeColor: "#f97316", lineWidth: 8 })
});

const closedArc = new Arc({
  radiusX: 90,
  radiusY: 50,
  startAngle: 0,
  endAngle: Math.PI,
  closed: true,
  material: new BasicMaterial({ fillColor: "#35c2ff" })
});`
      },
      {
        title: "Full Arc Code",
        body: "Complete setup from canvas element to rendered Arc.",
        liveDemoId: "arc",
        code: fullArcExample
      }
    ]
  }
];
