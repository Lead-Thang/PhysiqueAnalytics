// Import the canonical ToolName and ToolCall if these tools are meant to directly map to them.
// import type { ToolName, ToolCall as AppToolCall } from "@/types/tool-call";

interface ToolParameterProperty {
  type: string | string[];
  enum?: string[];
  description: string;
  items?: { type: string };
  minItems?: number;
  maxItems?: number;
  default?: any;
  pattern?: string;
  oneOf?: Array<{ type: string; items?: { type: string }; minItems?: number; maxItems?: number }>;
}

interface ToolParameters {
  type: "object";
  properties: Record<string, ToolParameterProperty>;
  required?: string[];
}
export interface ToolDefinition {
  type: "function";
  name: string; // Should ideally align with ToolName or be clearly mappable
  description: string;
  parameters: ToolParameters;
}
export const TOOLS: ToolDefinition[] = [
  {
    type: "function",
    name: "move", // Match ToolName
    description: "Move selected object along a specific axis or freely",
    parameters: {
      type: "object",
      properties: {
        axis: {
          type: "string",
          enum: ["x", "y", "z", "free"],
          default: "free",
          description: "Axis of movement or freeform"
        },
        distance: {
          type: "number",
          default: 1,
          description: "Distance to move along the specified axis."
        }
      },
      required: ["axis"]
    }
  },
  {
    type: "function",
    name: "rotate", // Match ToolName
    description: "Rotate selected object around a specific axis or freely",
    parameters: {
      type: "object",
      properties: {
        axis: {
          type: "string",
          enum: ["x", "y", "z", "free"],
          default: "free",
          description: "Axis of rotation or freeform"
        },
        angle: {
          type: "number",
          default: 90,
          description: "Angle of rotation in degrees."
        }
      },
      required: ["axis"]
    }
  },
  {
    type: "function",
    name: "scale", // Match ToolName
    description: "Scale selected object uniformly or per-axis",
    parameters: {
      type: "object",
      properties: {
        axis: {
          type: "string",
          enum: ["x", "y", "z", "uniform"],
          default: "uniform",
          description: "Axis of scaling or uniform"
        },
        factor: {
          type: "number",
          default: 1.1,
          description: "Scaling factor (e.g., 1.1 means 10% increase)"
        }
      },
      required: ["axis"]
    }
  },
  {
    type: "function",
    name: "add", // Renamed for consistency with SYSTEM_PROMPT action "add"
    description: "Add a new 3D object to the scene",
    parameters: {
      type: "object",
      properties: {
        type: {
          type: "string",
          enum: ["box", "sphere", "cylinder", "cone", "torus", "plane", "wedge"],
          description: "The type of 3D object to create",
        },
        position: {
          type: "array",
          items: { type: "number" },
          minItems: 3,
          maxItems: 3,
          default: [0, 0.5, 0],
          description: "Position as [x, y, z] coordinates",
        },
        rotation: {
          type: "array",
          items: { type: "number" },
          minItems: 3,
          maxItems: 3,
          default: [0, 0, 0],
          description: "Rotation as [x, y, z] angles in radians",
        },
        scale: {
          type: "array",
          items: { type: "number" },
          minItems: 3,
          maxItems: 3,
          default: [1, 1, 1],
          description: "Scale as [x, y, z] multipliers",
        },
        color: {
          type: "string",
          pattern: "^#[0-9a-fA-F]{6}$",
          default: "#8b5cf6",
          description: "Hex color code",
        },
      },
      required: ["type"],
    },
  },
  {
    type: "function",
    name: "update", // Renamed for consistency (e.g. with parseAIResponse action "update")
    description: "Update a property of the selected object",
    parameters: {
      type: "object",
      properties: {
        property: {
          type: "string",
          enum: ["position", "rotation", "scale", "color", "wireframe", "materialType"],
          description: "The property to update",
        },
        value: {
        type: "object", // Add this line to satisfy ToolParameterProperty's 'type' requirement
          oneOf: [
            { type: "string" },
            { type: "number" },
            { type: "boolean" },
            {
              type: "array",
              items: { type: "number" },
              minItems: 3,
              maxItems: 3,
            },
          ],
          description: "The new value for the property",
        },
      },
      required: ["property", "value"],
    },
  },
  {
    type: "function",
    name: "delete", // Renamed for consistency with SYSTEM_PROMPT action "delete"
    description: "Delete the currently selected object",
    parameters: {
      type: "object",
      properties: {},
    },
  },
  {
    type: "function",
    name: "measure-distance", // Aligned with prompt-examples
    description: "Measure distance between two points or objects",
    parameters: {
      type: "object",
      properties: {
        point1: {
          type: "array",
          items: { type: "number" },
          minItems: 3,
          maxItems: 3,
          description: "First point as [x, y, z]",
        },
        point2: {
          type: "array",
          items: { type: "number" },
          minItems: 3,
          maxItems: 3,
          description: "Second point as [x, y, z]",
        },
      },
      required: ["point1", "point2"],
    },
  },
  {
    type: "function",
    name: "add-line", // Specific name, assuming distinct from add-plane
    description: "Add a line segment to the scene.",
    parameters: {
      type: "object",
      properties: {
        startPoint: { type: "array", items: { type: "number" }, minItems: 3, maxItems: 3, description: "Start point [x,y,z]" },
        endPoint: { type: "array", items: { type: "number" }, minItems: 3, maxItems: 3, description: "End point [x,y,z]" },
        color: { type: "string", pattern: "^#[0-9a-fA-F]{6}$", default: "#ffffff", description: "Hex color code" },
      },
      required: ["startPoint", "endPoint"],
    },
  },
  {
    type: "function",
    name: "bevel-edges", // Aligned with prompt-examples
    description: "Apply a fillet to selected edges.",
    parameters: {
      type: "object",
      properties: {
        radius: { type: "number", default: 0.1, description: "Radius of the fillet." },
        // segments: { type: "number", default: 8, description: "Number of segments in the fillet curve." } // Optional
      },
      required: ["radius"],
    },
  },
  {
    type: "function",
    name: "revolve", // Aligned with prompt-examples
    description: "Revolve a selected profile (e.g., a line or curve) around an axis.",
    parameters: {
      type: "object",
      properties: {
        axis: { type: "string", enum: ["x", "y", "z"], description: "Axis of revolution." },
        angle: { type: "number", default: 360, description: "Angle of revolution in degrees." },
        // profileObjectId: { type: "string", description: "ID of the object to revolve." } // Optional
      },
      required: ["axis"],
    },
  },
  {
    type: "function",
    name: "bridge-curves", // Aligned with prompt-examples
    description: "Create a surface by bridging two or more selected curves or edge loops.",
    parameters: {
      type: "object",
      properties: {
        // curveIds: { type: "array", items: { type: "string" }, description: "IDs of the curves/edge loops to bridge." }, // Optional
        // segments: { type: "number", default: 10, description: "Number of segments along the bridge." } // Optional
      },
      // required: ["curveIds"],
    },
  },
  {
    type: "function",
    name: "duplicate-then-boolean", // Aligned with prompt-examples
    description: "Duplicate the selected object(s) and perform a boolean operation (union, subtract, intersect) with the original(s).",
    parameters: {
      type: "object",
      properties: {
        operation: { type: "string", enum: ["union", "subtract", "intersect"], description: "Boolean operation to perform." },
        offset: { type: "array", items: { type: "number" }, minItems: 3, maxItems: 3, default: [0,0,0], description: "Offset for the duplicated object [x,y,z]." },
        // keepTool: { type: "boolean", default: false, description: "Whether to keep the duplicated object (the tool) after the operation." } // Optional
      },
      required: ["operation"],
    },
  },
  {
    type: "function",
    name: "generate-image",
    description: "Generate an image based on a textual prompt and optional style or aspect ratio preferences.",
    parameters: {
      type: "object",
      properties: {
        prompt: {
          type: "string",
          description: "A detailed description of the image to be generated.",
        },
        style: {
          type: "string",
          enum: ["photorealistic", "cartoon", "impressionist", "surreal", "minimalist", "pixel-art", "fantasy", "sci-fi", "abstract", "watercolor", "line-art"],
          description: "The artistic style of the generated image. Defaults to photorealistic if not specified.",
        },
        aspect_ratio: {
            type: "string",
            enum: ["1:1", "16:9", "9:16", "4:3", "3:4", "2:3", "3:2"],
            description: "The aspect ratio of the generated image. Defaults to 1:1 if not specified.",
        },
        negative_prompt: {
            type: "string",
            description: "Optional: Elements or concepts to exclude from the image.",
        }
      },
      required: ["prompt"],
    },
  },
]
