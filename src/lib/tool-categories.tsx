export type { ToolCategory } from "../types/tool-category"; // Re-export ToolCategory using 'export type'
import type {
  ToolCategory as ImportedToolCategory,
  ToolAction, // Import ToolAction for consistent use
} from "../types/tool-category"; // Import ToolCategory for use in this file
import React from "react";
import {
  Box,
  Circle,
  Cylinder,
  Triangle,
  Torus,
  Square,
  CornerDownRight,
  Zap,
  Scissors,
  Minus,
  Plus,
  Move,
  Move3D,
  RotateCw,
  RotateCcw,
  Maximize,
  Ruler,
  BoxSelect,
  Play,
  Layers,
  Eraser,
  Trash2,
  Hexagon,
  Palette,
  Copy,
  Grid3X3,
  CornerUpRight,
  Spline, // Icon for Imprint Curve (or choose another suitable one)
  Link2, // For Bridge Curves
} from "lucide-react";

// Remove local ToolName definition; ToolAction from imported types is now the reference.

// If this Tool interface is exported and consumed by other modules,
// update its 'action' property to use the canonical ToolAction.
export interface Tool {
  name: string;
  icon: React.ReactNode;
  action: ToolAction; // Use imported ToolAction for consistency
  type: "shape" | "operation" | "transform" | "measure" | "view";
}

export const defaultToolCategories: ImportedToolCategory[] = [
  {
    name: "Shapes",
    icon: <Box />,
    expanded: true,
    tools: [
      { name: "Box", icon: <Square />, action: "add-box", type: "shape" },
      { name: "Sphere", icon: <Circle />, action: "add-sphere", type: "shape" },
      {
        name: "Cylinder",
        icon: <Cylinder />,
        action: "add-cylinder",
        type: "shape",
      },
      { name: "Cone", icon: <Triangle />, action: "add-cone", type: "shape" },
      { name: "Torus", icon: <Torus />, action: "add-torus", type: "shape" },
      { name: "Plane", icon: <Square />, action: "add-plane", type: "shape" },
      {
        name: "Wedge",
        icon: <CornerDownRight />,
        action: "add-wedge",
        type: "shape",
      },
    ],
  },
  {
    name: "Operations",
    icon: <Zap />,
    expanded: false,
    tools: [
      { name: "Union", icon: <Plus />, action: "union", type: "operation" },
      {
        name: "Subtract",
        icon: <Minus />,
        action: "subtract",
        type: "operation",
      },
      {
        name: "Intersect",
        icon: <Scissors />,
        action: "intersect",
        type: "operation",
      },
      {
        name: "Extrude",
        icon: <CornerUpRight />,
        action: "extrude",
        type: "operation",
      },
    ],
  },
  {
    name: "Transform",
    icon: <Move />,
    expanded: false,
    tools: [
      { name: "Move", icon: <Move />, action: "move", type: "transform" },
      {
        name: "Move 3D",
        icon: <Move3D />,
        action: "move-3d",
        type: "transform",
      },
      {
        name: "Rotate",
        icon: <RotateCw />,
        action: "rotate",
        type: "transform",
      },
      { name: "Scale", icon: <Maximize />, action: "scale", type: "transform" },
    ],
  },
  {
    name: "Measure",
    icon: <Ruler />,
    expanded: false,
    tools: [
      {
        name: "Distance",
        icon: <BoxSelect />,
        action: "measure-distance",
        type: "measure",
      },
      {
        name: "Volume",
        icon: <Play />,
        action: "measure-volume",
        type: "measure",
      },
      {
        name: "Area",
        icon: <Layers />,
        action: "measure-area",
        type: "measure",
      },
    ],
  },
  {
    name: "View",
    icon: <Layers />,
    expanded: false,
    tools: [
      {
        name: "Wireframe",
        icon: <Hexagon />,
        action: "view-wireframe",
        type: "view",
      },
      {
        name: "Shaded",
        icon: <Palette />,
        action: "view-shaded",
        type: "view",
      },
      {
        name: "Animation",
        icon: <Play />,
        action: "animate-scene",
        type: "view",
      },
    ],
  },
  {
    name: "Edit",
    icon: <Eraser />,
    expanded: false,
    tools: [
      {
        name: "Delete",
        icon: <Trash2 />,
        action: "delete-selected",
        type: "operation",
      },
      { name: "Undo", icon: <RotateCcw />, action: "undo", type: "operation" },
      { name: "Redo", icon: <RotateCw />, action: "redo", type: "operation" },
    ],
  },
  {
    name: "Mesh Editing",
    icon: <Scissors />,
    expanded: false,
    tools: [
      {
        name: "Bevel Edges",
        icon: <CornerUpRight />,
        action: "bevel-edges",
        type: "operation",
      },
      {
        name: "Bridge Edge Loops",
        icon: <Grid3X3 />,
        action: "bridge-edge-loops",
        type: "operation",
      },
      {
        name: "Subdivide",
        icon: <Plus />,
        action: "subdivide",
        type: "operation",
      },
      {
        name: "Extrude Edges",
        icon: <CornerUpRight />,
        action: "extrude-edges",
        type: "operation",
      },
      {
        name: "Loop Cut and Slide",
        icon: <Move3D />,
        action: "loop-cut-and-slide",
        type: "operation",
      },
      {
        name: "Offset Edge Slide",
        icon: <Move3D />,
        action: "offset-edge-slide",
        type: "operation",
      },
      {
        name: "Knife Topology Tool",
        icon: <Scissors />,
        action: "knife-topology-tool",
        type: "operation",
      },
      {
        name: "Bisect",
        icon: <Scissors />,
        action: "bisect",
        type: "operation",
      },
      {
        name: "Rotate Edge CW",
        icon: <RotateCw />,
        action: "rotate-edge-cw",
        type: "operation",
      },
      {
        name: "Rotate Edge CCW",
        icon: <RotateCcw />,
        action: "rotate-edge-ccw",
        type: "operation",
      },
      {
        name: "Edge Crease",
        icon: <Ruler />,
        action: "edge-crease",
        type: "operation",
      },
      {
        name: "Edge Bevel Weight",
        icon: <Ruler />,
        action: "edge-bevel-weight",
        type: "operation",
      },
      {
        name: "Mark Seam",
        icon: <Hexagon />,
        action: "mark-seam",
        type: "operation",
      },
      {
        name: "Clear Seam",
        icon: <Hexagon />,
        action: "clear-seam",
        type: "operation",
      },
      {
        name: "Mark Sharp",
        icon: <Triangle />,
        action: "mark-sharp",
        type: "operation",
      },
      {
        name: "Clear Sharp",
        icon: <Triangle />,
        action: "clear-sharp",
        type: "operation",
      },
      {
        name: "Set Sharpness by Angle",
        icon: <Ruler />,
        action: "set-sharpness-by-angle",
        type: "operation",
      },
      {
        name: "Un-Subdivide",
        icon: <Minus />,
        action: "un-subdivide",
        type: "operation",
      },
      { name: "Split", icon: <Scissors />, action: "split", type: "operation" },
      {
        name: "Separate",
        icon: <Copy />,
        action: "separate",
        type: "operation",
      },
      {
        name: "Dissolve Edges",
        icon: <Scissors />,
        action: "dissolve-edges",
        type: "operation",
      },
      {
        name: "Delete Edges",
        icon: <Trash2 />,
        action: "delete-edges",
        type: "operation",
      },
      {
        name: "Bridge Curves",
        icon: <Link2 />,
        action: "bridge-curves",
        type: "operation",
      },
      {
        name: "Imprint Curve",
        icon: <Spline />,
        action: "imprint-curve",
        type: "operation",
      },
    ],
  },
];
