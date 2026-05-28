import type { Group2D, Object2D, Scene } from "raw2d";
import type { Raw2DFiberHostPropsByType, Raw2DFiberHostType } from "./Raw2DFiberProps.type.js";

export interface Raw2DFiberHostInstance<TType extends Raw2DFiberHostType = Raw2DFiberHostType> {
  readonly type: TType;
  readonly object: Object2D;
  readonly children: Raw2DFiberHostInstance[];
  props: Raw2DFiberHostPropsByType[TType];
}

export type Raw2DFiberHostParent = Group2D | Raw2DFiberHostInstance | Scene;

export interface Raw2DFiberHostConfig {
  createInstance<TType extends Raw2DFiberHostType>(
    type: TType,
    props: Raw2DFiberHostPropsByType[TType]
  ): Raw2DFiberHostInstance<TType>;
  commitUpdate<TType extends Raw2DFiberHostType>(
    instance: Raw2DFiberHostInstance<TType>,
    nextProps: Raw2DFiberHostPropsByType[TType]
  ): void;
  appendChild(parent: Raw2DFiberHostParent, child: Raw2DFiberHostInstance): void;
  removeChild(parent: Raw2DFiberHostParent, child: Raw2DFiberHostInstance): void;
  disposeInstance(instance: Raw2DFiberHostInstance): void;
}
