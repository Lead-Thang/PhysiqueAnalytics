// src/types/tool-category.ts
import type React from "react";
import type { ToolName } from "./tool-call"; // Import ToolName using relative path

// Extend ToolName to include all mesh/modeling actions
export type ToolAction = ToolName;

// Define tool interface
export interface Tool {
  name: string
  icon: React.ReactNode
  action: ToolAction
  type: "shape" | "operation" | "transform" | "measure" | "view"
}

// Define category interface
export interface ToolCategory {
  name: string
  icon: React.ReactNode
  tools: Tool[]
  expanded: boolean
}