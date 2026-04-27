import type { DocTopic } from "./DocPage.type";
import { fullArcExample, fullEllipseExample } from "./DocFullExamples";

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
        title: "Full Arc Code",
        body: "Complete setup from canvas element to rendered Arc.",
        liveDemoId: "arc",
        code: fullArcExample
      }
    ]
  }
];
