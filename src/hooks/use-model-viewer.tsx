// src/hooks/use-model-viewer.tsx
"use client"

import type React from "react"
import { useState, useCallback, useMemo } from "react"
// Import the centralized tool definitions and types
import {
  defaultToolCategories as canonicalToolCategories,
  ToolCategory,
} from "@/src/lib/tool-categories"
import type { ModelObject } from "@/types/model-object"
import { ToolName } from "@/types/tool-call" // Corrected path

// Define the return type for the hook
export interface UseModelViewerReturn {
  objects: ModelObject[]
  selectedObject: string | null
  setObjects: React.Dispatch<React.SetStateAction<ModelObject[]>>
  setSelectedObject: React.Dispatch<React.SetStateAction<string | null>>
  addObject: (type: ModelObject["type"]) => void
  deleteSelected: () => void
  updatePosition: (axis: "x" | "y" | "z", value: number) => void
  updateRotation: (axis: "x" | "y" | "z", value: number) => void
  updateScale: (axis: "x" | "y" | "z", value: number) => void
  updateColor: (color: string) => void
  resetCamera: () => void
  addToHistory: (newState: ModelObject[]) => void
  undo: () => void
  redo: () => void
  toolCategories: ToolCategory[]
  setToolCategories: React.Dispatch<React.SetStateAction<ToolCategory[]>>
  executeToolAction: (action: ToolName, params?: Record<string, any>) => void
  // Include any other properties/methods returned by viewerActions if they were separate
  // For example, if history and historyIndex were directly returned:
  // history: ModelObject[][];
  // historyIndex: number;
}

export function useModelViewer(): UseModelViewerReturn {
  const [objects, setObjects] = useState<ModelObject[]>([
    {
      id: "1",
      type: "box",
      position: [0, 0.5, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      color: "#8b5cf6",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  ])

  const [history, setHistory] = useState<ModelObject[][]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [selectedObject, setSelectedObject] = useState<string | null>(null)
  // Use the canonical tool categories
  const [toolCategories, setToolCategories] = useState<ToolCategory[]>(canonicalToolCategories)

  // History helpers
  const addToHistory = useCallback(
    (newState: ModelObject[]) => {
      setHistory((prev) => [...prev.slice(0, historyIndex + 1), newState])
      setHistoryIndex((idx) => idx + 1)
    },
    [historyIndex]
  )

  const undo = useCallback(() => {
    if (historyIndex >= 0) {
      setHistoryIndex((idx) => idx - 1)
      setObjects([...history[historyIndex]])
    }
  }, [historyIndex, history])

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((idx) => idx + 1)
      setObjects([...history[historyIndex + 1]])
    }
  }, [historyIndex, history])

  // Add new object
  const addObject = useCallback((type: ModelObject["type"]) => {
    const newObject: ModelObject = {
      id: Date.now().toString(),
      type,
      position: [Math.random() * 4 - 2, 0.5, Math.random() * 4 - 2],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      color: `hsl(${Math.random() * 360}, 70%, 60%)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    const newObjectsState = [...objects, newObject];
    setObjects(newObjectsState);
    addToHistory(newObjectsState);
    setSelectedObject(newObject.id)
  }, [objects, addToHistory, setObjects]) // Added setObjects to dependencies

  // Delete selected object
  const deleteSelected = useCallback(() => {
    if (!selectedObject) return

    const newObjects = objects.filter((obj) => obj.id !== selectedObject)
    setObjects(newObjects)
    addToHistory(newObjects)
    setSelectedObject(null)
  }, [selectedObject, objects, addToHistory])

  // Update position
  const updatePosition = useCallback(
    (axis: "x" | "y" | "z", value: number) => {
      if (!selectedObject) return

      const index = objects.findIndex((obj) => obj.id === selectedObject)
      if (index !== -1) {
        const newObj = { ...objects[index] }
        newObj.position = newObj.position.map((v, i) =>
          i === ["x", "y", "z"].indexOf(axis) ? value : v
        ) as [number, number, number]
        newObj.updatedAt = Date.now()

        const newObjs = [...objects]
        newObjs[index] = newObj
        setObjects(newObjs)
        addToHistory(newObjs)
      }
    },
    [selectedObject, objects, addToHistory]
  )

  // Update rotation
  const updateRotation = useCallback(
    (axis: "x" | "y" | "z", value: number) => {
      if (!selectedObject) return

      const index = objects.findIndex((obj) => obj.id === selectedObject)
      if (index !== -1) {
        const newObj = { ...objects[index] }
        newObj.rotation = newObj.rotation.map((v, i) =>
          i === ["x", "y", "z"].indexOf(axis) ? value : v
        ) as [number, number, number]
        newObj.updatedAt = Date.now()

        const newObjs = [...objects]
        newObjs[index] = newObj
        setObjects(newObjs)
        addToHistory(newObjs)
      }
    },
    [selectedObject, objects, addToHistory]
  )

  // Update scale
  const updateScale = useCallback(
    (axis: "x" | "y" | "z", value: number) => {
      if (!selectedObject) return

      const index = objects.findIndex((obj) => obj.id === selectedObject)
      if (index !== -1) {
        const newObj = { ...objects[index] }
        newObj.scale = newObj.scale.map((v, i) =>
          i === ["x", "y", "z"].indexOf(axis) ? Math.max(0.1, value) : v
        ) as [number, number, number]
        newObj.updatedAt = Date.now()

        const newObjs = [...objects]
        newObjs[index] = newObj
        setObjects(newObjs)
        addToHistory(newObjs)
      }
    },
    [selectedObject, objects, addToHistory]
  )

  // Update color
  const updateColor = useCallback(
    (color: string) => {
      if (!selectedObject) return

      const index = objects.findIndex((obj) => obj.id === selectedObject)
      if (index !== -1) {
        const newObj = { ...objects[index], color, updatedAt: Date.now() }
        const newObjs = [...objects]
        newObjs[index] = newObj
        setObjects(newObjs)
        addToHistory(newObjs)
      }
    },
    [selectedObject, objects, addToHistory]
  )

  // Reset camera view
  const resetCamera = useCallback(() => {
    console.log("Resetting camera...")
  }, [])

  // Memoize viewer actions to prevent re-creation on every render
  // This is important for the executeToolAction closure
  const viewerActions = useMemo(() => ({
      objects,
      selectedObject,
      setObjects,
      setSelectedObject,
      addObject,
      deleteSelected,
      updatePosition,
      updateRotation,
      updateScale,
      updateColor,
      resetCamera,
      addToHistory,
      undo,
      redo,
      toolCategories,
      setToolCategories,
      // executeToolAction will be added below, after viewerActions is defined
  }), [
      objects, selectedObject, setObjects, setSelectedObject, addObject, deleteSelected,
      updatePosition, updateRotation, updateScale, updateColor, resetCamera,
      addToHistory, undo, redo, toolCategories, setToolCategories
  ]);

  // Execute tool call from UI or AI
  const executeToolAction = useCallback(
    (action: ToolName, params?: Record<string, any>) => { // Changed ToolAction to ToolName
      try {
        switch (action) {
          case "add-box":
            viewerActions.addObject("box");
            // TODO: Handle params (e.g., initial position, size) if addObject is extended
            break;
          case "add-sphere":
            viewerActions.addObject("sphere");
            break;
          case "add-cylinder":
            viewerActions.addObject("cylinder");
            break;
          case "add-cone":
            viewerActions.addObject("cone");
            break;
          case "add-torus":
            viewerActions.addObject("torus");
            break;
          case "add-plane":
            viewerActions.addObject("plane");
            break;
          // Assuming "add-wedge" is a valid ToolName and "wedge" is a ModelObject["type"]
          // case "add-wedge":
          //   viewerActions.addObject("wedge");
          //   break;
          case "delete-selected":
            viewerActions.deleteSelected();
            break;
          case "change-color":
            if (params?.color && typeof params.color === 'string') {
              viewerActions.updateColor(params.color);
            } else {
              console.warn("Change color: 'color' parameter missing or invalid", params);
            }
            break;
          case "scale":
            if (params?.scale && Array.isArray(params.scale) && params.scale.length === 3 && params.scale.every(s => typeof s === 'number')) {
              const [x, y, z] = params.scale as [number, number, number];
              viewerActions.updateScale("x", x);
              viewerActions.updateScale("y", y);
              viewerActions.updateScale("z", z);
            } else if (typeof params?.factor === 'number' && viewerActions.selectedObject) {
              const currentObject = viewerActions.objects.find(obj => obj.id === viewerActions.selectedObject);
              if (currentObject) {
                viewerActions.updateScale("x", currentObject.scale[0] * params.factor);
                viewerActions.updateScale("y", currentObject.scale[1] * params.factor);
                viewerActions.updateScale("z", currentObject.scale[2] * params.factor);
              }
            } else if (params?.axis && typeof params.value === 'number' && ['x', 'y', 'z'].includes(params.axis)) {
              viewerActions.updateScale(params.axis as "x" | "y" | "z", params.value);
            } else {
              console.warn("Scale: 'scale' array, 'factor', or 'axis/value' parameter missing or invalid", params);
            }
            break;
          case "move": // Handles absolute positions
            const handlePositionParam = (axis: "x" | "y" | "z", value?: unknown) => {
              if (typeof value === 'number') viewerActions.updatePosition(axis, value);
            };
            if (params?.position && Array.isArray(params.position) && params.position.length === 3) {
              handlePositionParam("x", params.position[0]);
              handlePositionParam("y", params.position[1]);
              handlePositionParam("z", params.position[2]);
            } else {
              handlePositionParam("x", params?.x);
              handlePositionParam("y", params?.y);
              handlePositionParam("z", params?.z);
            }
            break;
          // Add cases for "rotate", "undo", "redo", "reset-camera" and other ToolNames
          case "undo":
            viewerActions.undo();
            break;
          case "redo":
            viewerActions.redo();
            break;
          default:
            console.warn(`Unhandled tool action: ${action}`, params);
        }
      } catch (error) {
        console.error(`Error executing tool action "${action}":`, error);
      }
    },
    [viewerActions] // Depend on the memoized viewerActions
  );

  return { ...viewerActions, executeToolAction };
}