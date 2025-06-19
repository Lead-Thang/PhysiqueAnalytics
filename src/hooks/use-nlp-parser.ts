// hooks/use-nlp-parser.ts
import type { UseModelViewerReturn } from "@/src/hooks/use-model-viewer"

export function parseNaturalLanguage(input: string, viewerActions: UseModelViewerReturn) {
  const lower = input.toLowerCase()

  if (lower.includes("add") || lower.includes("create")) {
    if (lower.includes("box")) {
      viewerActions.addObject("box")
    }
    if (lower.includes("sphere")) {
      viewerActions.addObject("sphere")
    }
    if (lower.includes("cylinder")) {
      viewerActions.addObject("cylinder")
    }
    if (lower.includes("cone")) {
      viewerActions.addObject("cone")
    }
    if (lower.includes("torus")) {
      viewerActions.addObject("torus")
    }
    if (lower.includes("plane")) {
      viewerActions.addObject("plane")
    }
    if (lower.includes("line")) {
      console.log("NLP: Add line (placeholder)") // Placeholder for viewerActions.addLine()
    }
  }

  if (lower.includes("delete") || lower.includes("remove")) {
    viewerActions.deleteSelected()
  }

  if (lower.includes("scale up")) {
    viewerActions.updateScale("x", 1.1)
    viewerActions.updateScale("y", 1.1)
    viewerActions.updateScale("z", 1.1)
  }

  if (lower.includes("scale down")) {
    viewerActions.updateScale("x", 0.9)
    viewerActions.updateScale("y", 0.9)
    viewerActions.updateScale("z", 0.9)
  }

  if (lower.includes("red")) {
    viewerActions.updateColor("#ef4444")
  }

  if (lower.includes("blue")) {
    viewerActions.updateColor("#3b82f6")
  }

  if (lower.includes("green")) {
    viewerActions.updateColor("#10b981")
  }

  if (lower.includes("reset camera")) {
    viewerActions.resetCamera()
  }

  if (lower.includes("undo")) {
    viewerActions.undo()
  }

  if (lower.includes("redo")) {
    viewerActions.redo()
  }

  if (lower.includes("fillet")) {
    console.log("NLP: Apply fillet (placeholder)") // Placeholder for viewerActions.applyFillet()
  }

  if (lower.includes("revolve")) {
    console.log("NLP: Revolve shape (placeholder)") // Placeholder for viewerActions.revolveShape()
  }

  if (lower.includes("bridge") && (lower.includes("curve") || lower.includes("edge"))) {
    console.log("NLP: Bridge curves (placeholder)") // Placeholder for viewerActions.bridgeCurves()
  }

  if ((lower.includes("duplicate") || lower.includes("alternate")) && lower.includes("boolean")) {
    console.log("NLP: Duplicate and boolean (placeholder)") // Placeholder for viewerActions.duplicateThenBoolean()
  }
}