import type { DocSection, DocTopic } from "./DocPage.type";

interface TopicCopy {
  readonly label: string;
  readonly title: string;
  readonly description: string;
}

const topicCopy: Record<string, TopicCopy> = {
  setup: { label: "Install / Setup", title: "Install / Setup", description: "Raw2D ko npm ya CDN se start karne ka seedha setup." },
  "public-api": { label: "Public API", title: "Public API", description: "Stable app API aur focused low-level packages ka boundary." },
  "beginner-path": { label: "Beginner Path", title: "Beginner Path", description: "Raw2D me install se render tak ka short first-scene flow." },
  examples: { label: "Examples", title: "Examples", description: "Chhote package-style examples jo wahi imports use karte hain jo users npm se karenge." },
  license: { label: "License", title: "License", description: "Raw2D open source hai, Apache-2.0 license aur attribution rules ke saath." },
  canvas: { label: "Canvas Init", title: "Canvas Init", description: "Raw2D Canvas renderer ko HTML canvas ke saath initialize karna." },
  renderers: { label: "Canvas / WebGL", title: "Canvas / WebGL", description: "Canvas aur WebGL renderer ko clearly choose karne ka flow." },
  scene: { label: "Scene", title: "Scene", description: "Scene me woh objects rakhe jaate hain jo ek saath render hone hain." },
  camera: { label: "Camera2D", title: "Camera2D", description: "Camera2D world ka visible area, pan aur zoom control karta hai." },
  "basic-material": { label: "BasicMaterial", title: "BasicMaterial", description: "Fill, stroke aur line width jaise simple style data ka material." },
  "canvas-culling": { label: "Canvas Culling", title: "Canvas Culling", description: "Canvas render me off-screen objects skip karke performance improve karna." },
  "visible-objects": { label: "Visible Objects", title: "Visible Objects", description: "Camera viewport ke andar kaun se objects visible hain ye nikalna." },
  "render-order": { label: "Render Order", title: "Render Order", description: "zIndex aur scene order se draw order predictable rakhna." },
  renderer2d: { label: "Renderer2D", title: "Renderer2D", description: "Canvas aur WebGL ke shared renderer contract ko samajhna." },
  "renderer-parity": { label: "Renderer Parity", title: "Renderer Parity Matrix", description: "Canvas aur WebGL me kaun sa object support hai ye compare karna." },
  "render-pipeline": { label: "Render Pipeline", title: "Render Pipeline", description: "Scene se flat render list aur render runs banne ka low-level flow." },
  "webgl-renderer": { label: "WebGLRenderer2D", title: "WebGLRenderer2D", description: "Raw2D ka WebGL2 batch-first renderer path." },
  "webgl-context-lifecycle": { label: "WebGL Context", title: "WebGL Context Lifecycle", description: "Context lost, restore aur dispose handling ka WebGL lifecycle." },
  "webgl-performance": { label: "WebGL Performance", title: "WebGL Performance", description: "Canvas aur WebGL performance stats ko practical tarike se compare karna." },
  "webgl-visual-tests": { label: "WebGL Visual Tests", title: "WebGL Visual Tests", description: "Browser me Canvas aur WebGL ke real pixels check karna." },
  group2d: { label: "Group2D", title: "Group2D", description: "Objects ko group karke parent transform ke saath render karna." },
  origin: { label: "Origin", title: "Origin", description: "Object ka pivot point set karna, jisse rotation aur scale control hota hai." },
  "transform-matrix": { label: "Transform Matrix", title: "Transform Matrix", description: "Position, rotation, scale aur parent transform ka matrix flow." },
  bounds: { label: "Bounds", title: "Bounds", description: "Culling, hit testing, selection aur resize tools ke liye object rectangle." },
  "hit-testing": { label: "Hit Testing", title: "Hit Testing", description: "Pointer kisi object ke andar ya uske paas hai ya nahi, ye detect karna." },
  picking: { label: "Picking", title: "Picking Objects", description: "Pointer ke neeche topmost scene object find karna." },
  "interaction-controller": { label: "Interaction Controller", title: "InteractionController", description: "Selection, drag aur resize ko optional controller se wire karna." },
  "camera-controls": { label: "Camera Controls", title: "Camera Controls", description: "Mouse wheel aur drag se camera zoom/pan karna." },
  keyboard: { label: "Keyboard", title: "Keyboard Controller", description: "Selected objects ko keyboard se move/delete/clear karna." },
  selection: { label: "Selection", title: "Selection", description: "Selected objects ko scene aur renderer se alag state me track karna." },
  "resize-handles": { label: "Resize Handles", title: "Resize Handles", description: "Selected bounds ke around editor-style handles banana aur pick karna." },
  "object-resize": { label: "Object Resize", title: "Object Resize", description: "Picked resize handle se Rect ka size change karna." },
  dragging: { label: "Dragging", title: "Dragging Objects", description: "Picked object ko pointer drag ke saath move karna." },
  ellipse: { label: "Ellipse", title: "Ellipse", description: "Ellipse primitive ko isolated data object ki tarah banana." },
  polyline: { label: "Polyline", title: "Polyline", description: "Multiple connected line segments ka open path banana." },
  polygon: { label: "Polygon", title: "Polygon", description: "Closed point list se filled polygon banana." },
  arc: { label: "Arc", title: "Arc", description: "Open ya closed arc shape banana." },
  "shape-path": { label: "ShapePath", title: "ShapePath", description: "Custom low-level path commands se apni shape banana." },
  rect: { label: "Rect", title: "Rect", description: "Rectangle object banana; renderer usko draw karta hai." },
  circle: { label: "Circle", title: "Circle", description: "Circle object banana; data object khud draw nahi karta." },
  text2d: { label: "Text2D", title: "Text2D", description: "Canvas/WebGL me text render karne ke liye Text2D object." },
  line: { label: "Line", title: "Line", description: "Start/end points se stroked line banana." },
  "asset-loading": { label: "Asset Loading", title: "Asset Loading", description: "Texture, atlas aur sprite animation assets load karna." },
  texture: { label: "Texture", title: "Texture", description: "Image source ko Raw2D texture data me wrap karna." },
  "texture-atlas": { label: "Texture Atlas", title: "Texture Atlas", description: "Ek texture me multiple sprite frames map karna." },
  sprite: { label: "Sprite", title: "Sprite", description: "Texture ya atlas frame se image object render karna." },
  "sprite-animation": { label: "Sprite Animation", title: "Sprite Animation", description: "Atlas frames se simple sprite animation chalana." }
};

const titleCopy = new Map<string, string>([
  ["Why Use It", "Iska use kyu karein"],
  ["What It Does", "Ye kya karta hai"],
  ["Why It Exists", "Ye kyu hai"],
  ["When To Use It", "Kab use karein"],
  ["Add A Canvas Element", "Canvas element add karein"],
  ["Create The Canvas Class", "Canvas class banayein"],
  ["Create A Scene", "Scene banayein"],
  ["Create A Camera", "Camera banayein"],
  ["Create BasicMaterial", "BasicMaterial banayein"],
  ["Create Handles", "Handles banayein"],
  ["Create A ShapePath", "ShapePath banayein"],
  ["Create A Rect", "Rect banayein"],
  ["Create A Circle", "Circle banayein"],
  ["Create A Line", "Line banayein"],
  ["Create Text2D", "Text2D banayein"],
  ["Recommended NPM Install", "Recommended NPM install"],
  ["Install Raw2D", "Raw2D install karein"],
  ["Add Canvas", "Canvas add karein"],
  ["Create Renderer", "Renderer banayein"],
  ["Create Scene And Camera", "Scene aur Camera banayein"],
  ["Add Shape", "Shape add karein"],
  ["Render Scene", "Scene render karein"],
  ["Use From NPM", "NPM se use karein"],
  ["First Canvas Render", "Pehla Canvas render"],
  ["Switch To WebGL", "WebGL par switch"],
  ["Focused Package Install", "Focused package install"],
  ["CDN Usage", "CDN usage"],
  ["Local Raw2D Development", "Local development"],
  ["Use raw2d First", "Pehle raw2d use karein"],
  ["Focused Packages", "Focused packages"],
  ["Umbrella Runtime Boundary", "Umbrella runtime boundary"],
  ["Type Exports", "Type exports"],
  ["Stability Rule", "Stability rule"],
  ["Run Local Examples", "Local examples chalayein"],
  ["Canvas Basic", "Canvas basic"],
  ["WebGL Basic", "WebGL basic"],
  ["Sprite Atlas", "Sprite atlas"],
  ["Interaction Basic", "Interaction basic"],
  ["Text Basic", "Text basic"],
  ["Package Smoke Tests", "Package smoke tests"],
  ["Full Render Example", "Full render example"],
  ["Full ShapePath Code", "Full ShapePath code"],
  ["Parameters", "Parameters"],
  ["Current Scope", "Current scope"],
  ["Supported Objects", "Supported objects"],
  ["World Coordinates", "World coordinates"],
  ["Line Tolerance", "Line tolerance"],
  ["Update Material", "Material update karein"],
  ["Update Resize", "Resize update karein"],
  ["End Resize", "Resize end karein"],
  ["Start Drag", "Drag start karein"],
  ["Update Drag", "Drag update karein"],
  ["End Drag", "Drag end karein"],
  ["Pick And Select", "Pick karke select karein"],
  ["Multi Select", "Multi select"],
  ["Selection Bounds", "Selection bounds"],
  ["Plugin Style", "Plugin style"],
  ["WebGL Fill And Stroke", "WebGL fill aur stroke"],
  ["Flatten For Renderers", "Renderer ke liye flatten"],
  ["WebGL Package", "WebGL package"],
  ["Shared Renderer Contract", "Shared renderer contract"],
  ["Renderer Responsibility", "Renderer ki responsibility"]
]);

const bodyCopy = new Map<string, string>([
  ["Recommended NPM Install", "Sabse pehle umbrella package use karein. Isme stable public Raw2D API milti hai."],
  ["Install Raw2D", "Umbrella package se start karein. Isme stable app-level API milti hai."],
  ["Add Canvas", "Raw2D real HTMLCanvasElement me render karta hai. Canvas element app ke control me rahega."],
  ["Create Renderer", "CanvasRenderer pehle learn karein, kyunki ye current objects ko complete support deta hai."],
  ["Create Scene And Camera", "Scene objects store karta hai. Camera2D world ka visible area define karta hai."],
  ["Add Shape", "Objects sirf data store karte hain. Drawing ka decision renderer leta hai."],
  ["Render Scene", "Scene change hone ke baad render call karein. Animation me pehle data update karein, phir render karein."],
  ["Use From NPM", "Renderer, scene, camera, objects aur materials ko seedha raw2d se import karein."],
  ["First Canvas Render", "Canvas complete reference renderer hai. Scene banayein, object add karein, phir camera ke saath render karein."],
  ["Switch To WebGL", "Same scene aur camera ko WebGLRenderer2D se render kar sakte hain, agar object types supported hon."],
  ["Focused Package Install", "Advanced users sirf wahi packages install kar sakte hain jo unke project me chahiye."],
  ["CDN Usage", "Bundler ke bina browser me UMD build use karna ho to CDN script use karein."],
  ["Local Raw2D Development", "Ye sirf Raw2D source repo par kaam karte waqt use hota hai."],
  ["Use raw2d First", "raw2d package most apps ke liye stable runtime API export karta hai."],
  ["Focused Packages", "Focused packages tab use karein jab tighter bundle control ya low-level renderer tools chahiye hon."],
  ["Umbrella Runtime Boundary", "Umbrella package Canvas/WebGL implementation internals ko runtime API me export nahi karta."],
  ["Type Exports", "Types umbrella package se available rehte hain, taaki app code ergonomic rahe."],
  ["Stability Rule", "App examples raw2d se import karein; engine-builder examples focused packages se advanced helpers import kar sakte hain."],
  ["Run Local Examples", "Har example examples/ folder ke andar standalone page hai. Dev server start karke uska path open karein."],
  ["Canvas Basic", "Scene, camera, material, object aur Canvas renderer ka basic flow check karne ke liye ye pehla example hai."],
  ["WebGL Basic", "Supported objects ke liye WebGLRenderer2D use karein jab batching stats aur draw call pressure important ho."],
  ["Sprite Atlas", "Alag image sources ko ek atlas me pack karke same texture ko multiple sprite frames ke saath reuse karein."],
  ["Interaction Basic", "Selection, dragging aur Rect resizing chahiye ho to InteractionController ko scene ke saath wire karein."],
  ["Text Basic", "Text2D ek scene object hai. Canvas direct draw karta hai aur WebGL usko texture me rasterize kar sakta hai."],
  ["Package Smoke Tests", "Import smoke tests ensure karte hain ki umbrella package aur focused packages build ke baad installable rahen."],
  ["Add A Canvas Element", "Raw2D ko real HTMLCanvasElement chahiye. Hidden DOM ya canvas ye khud create nahi karta."],
  ["Create The Canvas Class", "DOM canvas ko Raw2D Canvas wrapper me pass karke renderer ready karein."],
  ["Renderer Responsibility", "Objects sirf data aur scene graph behavior rakhte hain. Drawing ka kaam renderer karta hai."],
  ["Why Use It", "Ye helper isliye useful hai kyunki aap large scene me visible, selectable ya process hone wale objects clearly nikal sakte hain."],
  ["What It Does", "Ye feature object data ko change nahi karta; bas render ya tool workflow ke liye right objects choose karta hai."],
  ["Why It Exists", "Raw2D low-level hai, isliye pipeline clear rehni chahiye. Ye helper wahi clarity deta hai."],
  ["When To Use It", "Jab scene bada ho, objects zyada hon, ya editor-style tool banana ho, tab is pattern ko use karein."],
  ["World Coordinates", "Raw2D pointer ko world coordinates me expect karta hai, phir object-local space me convert karta hai."],
  ["Line Tolerance", "Line thin hoti hai, isliye selection easy banane ke liye tolerance pass kar sakte hain."],
  ["Supported Objects", "Har object ka hit/bounds support alag ho sakta hai. Curves ke liye abhi conservative bounds use hote hain."],
  ["WebGL Fill And Stroke", "WebGL simple closed ShapePath fill aur stroke ko flattened points se render karta hai."],
  ["Flatten For Renderers", "Curves ko points me convert karke renderer ya tool geometry use kar sakta hai."],
  ["Plugin Style", "Interaction logic core aur renderer se alag rahega, taaki future tools clean modules me ban sakein."],
  ["Current Scope", "Abhi scope simple rakha gaya hai. Advanced behavior baad me focused modules ke through add hoga."],
  ["Parameters", "Ye values object create karte waqt pass ki ja sakti hain."]
]);

export function createHinglishTopic(topic: DocTopic): DocTopic {
  const copy = topicCopy[topic.id] ?? fallbackTopic(topic);

  return {
    ...topic,
    label: copy.label,
    title: copy.title,
    description: copy.description,
    sections: topic.sections.map((section) => createHinglishSection(topic, section))
  };
}

function createHinglishSection(topic: DocTopic, section: DocSection): DocSection {
  const title = titleCopy.get(section.title) ?? section.title;
  const body = bodyCopy.get(section.title) ?? createDefaultBody(topic, title);

  return {
    ...section,
    title,
    body
  };
}

function createDefaultBody(topic: DocTopic, sectionTitle: string): string {
  const topicName = topicCopy[topic.id]?.label ?? topic.label;
  return `${topicName} me "${sectionTitle}" ka practical use yahan dikhaya gaya hai. Code block same Raw2D API flow ko clearly show karta hai.`;
}

function fallbackTopic(topic: DocTopic): TopicCopy {
  return {
    label: topic.label,
    title: topic.title,
    description: `${topic.label} ka practical Raw2D workflow yahan explain kiya gaya hai.`
  };
}
