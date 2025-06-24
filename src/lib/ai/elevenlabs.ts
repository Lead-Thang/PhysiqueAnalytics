// lib/ai/elevenlabs.ts
import type { ToolCall } from "../../types/tool-call"; // Use the canonical ToolCall

export async function callElevenLabsAgent(text: string): Promise<{
  text: string;
  audioUrl?: string;
  command?: ToolCall | null;
}> {
  try {
    const response = await fetch("/api/elevenlabs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    return {
      text: data.text || "",
      audioUrl: data.audio_url || "",
      command: parseAICommand(data.text || text),
    };
  } catch (error) {
    console.error("Error calling ElevenLabs:", error);
    return {
      text: "I couldn't understand that. Try again.",
      command: null,
    };
  }
}

/**
 * Parses AI-generated text into structured commands
 */
function parseAICommand(text: string): ToolCall | null {
  const lowerText = text.toLowerCase();

  // Add/Create commands
  if (lowerText.includes("add") || lowerText.includes("create")) {
    if (lowerText.includes("box") || lowerText.includes("cube")) {
      return { action: "add-box", params: { type: "box" } }; // Align action name with types/tool-call.ts
    }
    if (lowerText.includes("sphere") || lowerText.includes("ball")) {
      return { action: "add-sphere", params: { type: "sphere" } };
    }
    if (lowerText.includes("cylinder")) {
      return { action: "add-cylinder", params: { type: "cylinder" } };
    }
    if (lowerText.includes("cone")) {
      return { action: "add-cone", params: { type: "cone" } };
    }
    if (lowerText.includes("torus") || lowerText.includes("donut")) {
      return { action: "add-torus", params: { type: "torus" } };
    }
    if (lowerText.includes("plane")) {
      return { action: "add-plane", params: { type: "plane" } };
    }
    if (lowerText.includes("line")) {
      return { action: "add-plane", params: {} }; // Assuming "add-line" was a typo and meant "add-plane" or needs to be added to ToolName
    }
  }

  // Delete commands
  if (lowerText.includes("delete") || lowerText.includes("remove")) {
    return { action: "delete-selected", params: {} };
  }

  // Scale commands
  if (lowerText.includes("scale up") || lowerText.includes("bigger")) {
    return { action: "scale", params: { factor: 1.2 } }; // Ensure "scale" is a valid ToolName
  }
  if (lowerText.includes("scale down") || lowerText.includes("smaller")) {
    return { action: "scale", params: { factor: 0.8 } };
  }

  // Color commands
  // These should map to "change-color"
  if (lowerText.includes("red")) {
    return { action: "change-color", params: { color: "#ef4444" } };
  }
  if (lowerText.includes("blue")) {
    return { action: "change-color", params: { color: "#3b82f6" } };
  }
  if (lowerText.includes("green")) {
    return { action: "change-color", params: { color: "#10b981" } };
  }
  if (lowerText.includes("yellow")) {
    return { action: "change-color", params: { color: "#f59e0b" } };
  }
  if (lowerText.includes("purple")) {
    return { action: "change-color", params: { color: "#8b5cf6" } };
  }

  // View commands
  if (lowerText.includes("wireframe")) {
    return { action: "view-wireframe", params: { mode: "wireframe" } };
  }
  if (lowerText.includes("shaded")) {
    return { action: "view-shaded", params: { mode: "shaded" } };
  }

  // Camera commands
  if (lowerText.includes("reset camera") || lowerText.includes("reset view")) {
    return { action: "change-camera", params: { reset: true } }; // Example, align with ToolName
  }

  // History commands
  if (lowerText.includes("undo")) {
    return { action: "undo", params: {} };
  }
  if (lowerText.includes("redo")) {
    return { action: "redo", params: {} };
  }

  // CAD specific commands
  if (lowerText.includes("fillet")) {
    return { action: "bevel-edges", params: { radius: 0.1 } }; // Assuming "fillet" maps to "bevel-edges"
  }
  if (lowerText.includes("revolve")) {
    return {
      action: "extrude",
      params: { type: "revolve", axis: "y", angle: 360 },
    }; // Example, align with ToolName
  }
  if (
    lowerText.includes("bridge") &&
    (lowerText.includes("curve") || lowerText.includes("edge"))
  ) {
    return { action: "bridge-edge-loops", params: {} };
  }
  if (
    (lowerText.includes("duplicate") || lowerText.includes("alternate")) &&
    lowerText.includes("boolean")
  ) {
    // A more sophisticated parser could extract the boolean type (union, subtract, intersect)
    // For now, we'll let the AI specify or default in the handler.
    return { action: "duplicate-then-boolean", params: {} };
  }

  return null;
}
