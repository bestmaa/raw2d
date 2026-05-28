export type Raw2DFiberHostObjectKind =
  | "Circle"
  | "Group2D"
  | "Line"
  | "Rect"
  | "Sprite"
  | "Text2D";

export type Raw2DFiberHostBoundaryStage =
  | "commit"
  | "instance"
  | "props"
  | "renderer"
  | "tree";

export interface Raw2DFiberHostBoundary {
  readonly packageName: "raw2d-react-fiber";
  readonly changesCoreApi: false;
  readonly ownsRenderer: false;
  readonly supportedObjects: readonly Raw2DFiberHostObjectKind[];
  readonly stages: readonly Raw2DFiberHostBoundaryStage[];
  readonly notes: readonly string[];
}
