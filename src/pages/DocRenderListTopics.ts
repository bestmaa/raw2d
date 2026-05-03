import type { DocTopic } from "./DocPage.type";

export const renderListTopics: readonly DocTopic[] = [
  {
    id: "render-list",
    label: "RenderList",
    title: "RenderList",
    description: "RenderList is the prepared, inspectable draw input created from Scene and Camera before Canvas or WebGL draws.",
    sections: [
      {
        title: "Create RenderList",
        body: "Create a RenderList when tools need to inspect the exact objects that a renderer will draw.",
        liveDemoId: "render-pipeline",
        code: `const renderList = raw2dCanvas.createRenderList(scene, camera, {
  culling: true
});

console.log(renderList.getStats());`
      },
      {
        title: "Inspect Flat Items",
        body: "Flat items are useful for debug tables, batch input, overlays, selection tools, and custom render experiments.",
        liveDemoId: "render-pipeline",
        code: `const rows = renderList.getFlatItems().map((item) => ({
  id: item.id,
  depth: item.depth,
  order: item.order,
  zIndex: item.zIndex
}));

console.table(rows);`
      },
      {
        title: "Inspect Root Items",
        body: "Root items keep group hierarchy intact. Use them when a renderer or tool needs nested transform structure.",
        liveDemoId: "render-pipeline",
        code: `for (const item of renderList.getRootItems()) {
  console.log(item.object.name, item.children.length);
}`
      },
      {
        title: "Reuse In Renderer",
        body: "A prepared RenderList can be passed back into Canvas or WebGL. This keeps scene preparation separate from drawing.",
        liveDemoId: "render-pipeline",
        code: `const renderList = webglRenderer.createRenderList(scene, camera, {
  culling: true
});

webglRenderer.render(scene, camera, { renderList });`
      },
      {
        title: "Practical Debug Example",
        body: "This pattern shows a render-list summary next to the frame, so engine builders can see pipeline decisions without reading renderer internals.",
        liveDemoId: "render-pipeline",
        code: `const stats = renderList.getStats();
debugPanel.textContent = [
  \`accepted: \${stats.accepted}\`,
  \`culled: \${stats.culled}\`,
  \`hidden: \${stats.hidden}\`
].join(" | ");`
      }
    ]
  }
];
