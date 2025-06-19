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

  // Transformation Actions
  | "move"
  | "rotate"
  | "scale"
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

  // Help & UI
  | "show-help"
  | "display-properties"

  // Geometry Operations
  | "union"
  | "subtract"
  | "intersect"
  | "extrude"
  | "bevel"
  | "fillet"
  | "revolve"

  // Mesh Editing
  | "subdivide"
  | "un-subdivide"
  | "edge-split"
  | "edge-collapse"
  | "edge-loop"
  | "bridge-edges"
  | "dissolve-edges";

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
}

// Exhaustiveness Check (for development only)
export const exhaustiveCheck = (action: never): never => {
  throw new Error(`Unhandled tool action: ${action}`);
};