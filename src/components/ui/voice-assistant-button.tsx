// voice-assistant-button.tsx
import { useModelViewer } from "src/hooks/use-model-viewer"
import type { ToolCall } from "src/types/tool-call"
import type { ModelObjectType } from "src/types/model-types" // New import
import type { ModelObject } from "src/types/model-object" // Added import

// Type guard for validation
function isValidModelType(type: string): type is ModelObject["type"] {
  return [
    'box', 'sphere', 'cylinder', 'cone', 'torus', 
    'plane', 'wedge', 'custom', 'extrusion',
    'revolution', 'sweep', 'custom-mesh'
  ].includes(type)
}

export function VoiceAssistantButton() {
  const { addObject, deleteSelected, updateColor, executeToolAction } = useModelViewer()
  
  const applyToolCommand = (command: ToolCall) => {
    if (command.action.startsWith("add-")) {
      const type = command.action.slice(4) as ModelObjectType
      if (isValidModelType(type)) {
        addObject(type as ModelObject["type"])
        return
      }
    }

    // Handle standard commands
    switch (command.action) {
      case "delete-selected":
        deleteSelected()
        break
        
      case "change-color":
        if (command.params?.color) updateColor(command.params.color)
        break
        
      case "undo":
      case "redo":
      case "reset-camera":
      case "view-wireframe":
      case "view-shaded":
        executeToolAction(command.action)
        break
        
      default:
        console.warn("Unhandled command:", command)
    }
  }

  // ... rest of component implementation (button UI, event handlers, etc.)
}