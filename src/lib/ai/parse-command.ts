// src/lib/ai/parse-command.ts
import type { ToolCall } from "../../types/tool-call";
import { promptExamples } from "src/lib/ai/prompt-examples";
import { isValidModelType } from "src/types/model-object";
import type { ModelObjectType } from "src/types/model-object";

export function parseAIMessage(input: string): ToolCall | null {
  const lowerInput = input.toLowerCase();

  // Match known examples first
  const exampleMatch = promptExamples.find((example) =>
    lowerInput.includes(example.input.toLowerCase())
  );
  if (exampleMatch) return exampleMatch.output;

  // Type-safe model creation
  const typeMap: Record<string, ModelObjectType> = {
    box: "box",
    cube: "box",
    sphere: "sphere",
    ball: "sphere",
    cylinder: "cylinder",
    tube: "cylinder",
    cone: "cone",
    torus: "torus",
    plane: "plane",
    wedge: "plane", // Map wedge to plane if not supported
  };

  if (lowerInput.includes("add") || lowerInput.includes("create")) {
    for (const [keyword, type] of Object.entries(typeMap)) {
      if (lowerInput.includes(keyword)) {
        return { action: `add-${type}` as ToolCall["action"] };
      }
    }
    return { action: "add-box" }; // Safe default
  }

  // Color commands
  if (lowerInput.includes("red")) {
    return { action: "change-color", params: { color: "#ef4444" } };
  }
  if (lowerInput.includes("blue")) {
    return { action: "change-color", params: { color: "#3b82f6" } };
  }

  // ... rest of your command parsing logic ...
  return null;
}
