import { createContext } from "react";
import type { Raw2DReactContextValue } from "./Raw2DReactContext.type.js";

export const Raw2DReactContext = createContext<Raw2DReactContextValue | null>(null);
