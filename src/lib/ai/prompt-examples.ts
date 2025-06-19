// ai/prompt-examples.ts
import type { ToolCall } from "../../../types/tool-call"

interface PromptExample {
  input: string;
  output: ToolCall;
}

export const promptExamples: PromptExample[] = [
  {
    input: "Add a box",
    output: { action: "add-box" }
  },
  {
    input: "Delete the selected object",
    output: { action: "delete-selected" }
  },
  {
    input: "Make this red",
    output: { action: "change-color", params: { color: "#ef4444" } }
  },
  {
    input: "Scale up",
    output: { action: "scale", params: { axis: "x", value: 1.2, multiAxis: true } }
  },
  {
    input: "Move this object forward",
    output: { action: "move", params: { axis: "z", value: 0.5 } }
  },
  {
    input: "Measure the distance between these two objects",
    output: { action: "measure-distance" }
  },
  {
    input: "Bevel the edges of this cube",
    output: { action: "bevel-edges" }
  },
  {
    input: "Rotate this object",
    output: { action: "rotate" }
  },
  {
    input: "Subtract this sphere from the cylinder",
    output: { action: "subtract" }
  },
  {
    input: "Draw a line",
    output: { action: "add-plane" }
  },
  {
    input: "Add a fillet to the selected edge",
    output: { action: "bevel-edges", params: { radius: 0.1 } } // Align with ToolName
  },
  {
    input: "Revolve this shape",
    output: { action: "revolve", params: { axis: "y", angle: 360 } }
  },
  {
    input: "Bridge these two curves",
    output: { action: "bridge-curves" }
  },
  {
    input: "Perform an alternate duplicate boolean subtract",
    output: { action: "duplicate-then-boolean", params: { operation: "subtract" } }
  },
]