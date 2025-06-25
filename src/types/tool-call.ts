// types/tool-call.ts

/**
 * All valid tool actions in the application
 * 
 * Follows kebab-case convention for consistency
 * Groups related actions with union types for better type safety
 */
export type ToolName = 
  // Creation Actions
  | AddToolAction 
  | "delete-selected"
  | "duplicate-selected"
  | "duplicate-then-boolean"

  // Transformation Actions
  | "move"
  | "move-x"
  | "move-y"
  | "move-z"
  | "rotate"
  | "rotate-x"
  | "rotate-y"
  | "rotate-z"
  | "scale"
  | "scale-uniform"
  | "scale-x"
  | "scale-y"
  | "scale-z"
  | "change-color"

  // History Actions
  | "undo"
  | "redo"

  // Measurement Actions
  | "measure-distance"
  | "measure-volume"
  | "measure-area"

  // View Actions
  | "reset-camera"
  | "view-wireframe"
  | "view-shaded"
  | "animate-scene"
  | "change-camera"

  // Help & UI
  | "show-help"
  | "display-properties"

  // Geometry Operations
  | "union"
  | "subtract"
  | "intersect"
  | "extrude"
  | "extrude-edges"
  | "bevel"
  | "bevel-edges"
  | "fillet"
  | "revolve"
  | "loop-cut-and-slide"
  | "offset-edge-slide"
  | "knife-topology-tool"
  | "bisect"
  | "rotate-edge-cw"
  | "rotate-edge-ccw"
  | "edge-crease"
  | "edge-bevel-weight"
  | "mark-seam"
  | "clear-seam"
  | "mark-sharp"
  | "clear-sharp"
  | "set-sharpness-by-angle"

  // Mesh Editing
  | "subdivide"
  | "un-subdivide"
  | "edge-split"
  | "edge-collapse"
  | "edge-loop"
  | "bridge-edges"
  | "bridge-edge-loops"
  | "dissolve-edges"
  | "split"
  | "separate"
  | "delete-edges"
  | "bridge-curves"
  | "imprint-curve";

// Helper Types
export type AddToolAction = 
  | "add-box"
  | "add-sphere"
  | "add-cylinder"
  | "add-cone"
  | "add-torus"
  | "add-plane"
  | "add-wedge";

/**
 * Represents a command to be executed
 * 
 * Always use [action](file://c:\Users\PC\Downloads\conceivin3d%20(2)\types\tool-call.ts#L83-L83) for the command type
 * Use [params](file://c:\Users\PC\Downloads\conceivin3d%20(2)\types\tool-call.ts#L84-L84) for structured arguments
 */
export interface ToolCall {
  action: ToolName;
  params?: Record<string, any>;
  mode?: "free" | "x-axis" | "y-axis" | "z-axis"; // Optional field for interaction constraints
  handleType?: "translate" | "rotate" | "scale"; // Optional field to identify handle behavior
}

// Exhaustiveness Check (for development only)
export const exhaustiveCheck = (action: never): never => {
  throw new Error(`Unhandled tool action: ${action}`);
};