import type { DocTopic } from "./DocPage.type";

export const group2DTopics: readonly DocTopic[] = [
  {
    id: "group2d",
    label: "Group2D",
    title: "Group2D",
    description: "Group2D stores child objects so they can move, rotate, scale, and render together.",
    sections: [
      {
        title: "Why It Matters",
        body: "Use Group2D when several objects should behave like one unit, such as a character, editor selection, UI panel, or composed shape.",
        liveDemoId: "group2d",
        code: `const group = new Group2D({ x: 200, y: 120 });

group.add(rect);
group.add(circle);
scene.add(group);`
      },
      {
        title: "Group Transform",
        body: "The group transform is applied before each child transform. Moving or rotating the group moves every child with it.",
        liveDemoId: "group2d",
        code: `group.setPosition(240, 130);
group.rotation = 0.4;

raw2dCanvas.render(scene, camera);`
      },
      {
        title: "Child Order",
        body: "Children use the same zIndex rule as scene objects. Lower zIndex draws first, higher zIndex draws on top.",
        liveDemoId: "group2d",
        code: `backgroundPart.setZIndex(0);
foregroundPart.setZIndex(10);

group.add(foregroundPart);
group.add(backgroundPart);`
      },
      {
        title: "Remove Children",
        body: "Groups can remove one child or clear all children without changing the scene itself.",
        liveDemoId: "group2d",
        code: `group.remove(rect);
group.clear();`
      },
      {
        title: "Current Scope",
        body: "Group2D is a rendering and transform foundation. Deep group-aware hit testing and bounds helpers will be expanded separately.",
        liveDemoId: "group2d",
        code: `// Works now:
raw2dCanvas.render(scene, camera);

// Future work:
// group-aware hit testing
// group-aware world bounds and culling`
      }
    ]
  }
];
