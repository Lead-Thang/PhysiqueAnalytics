// src/components/properties-panel.tsx
"use client"

import { InputWithHelper } from "@/src/components/ui/input-with-helper"
import { ColorInput } from "@/src/components/ui/color-input"
import { Button } from "@/src/components/ui/button"
import type { ModelObject } from "@/types/model-object"
import { useEffect, useState } from "react"

interface PropertiesPanelProps {
  object?: ModelObject | null
  onUpdate?: (update: Partial<ModelObject>) => void
  onDelete?: () => void
}

// Helper function to update array values
function updateArray(
  arr: [number, number, number],
  axis: "x" | "y" | "z",
  value: number
): [number, number, number] {
  const index = axis === "x" ? 0 : axis === "y" ? 1 : 2
  const newArr = [...arr]
  newArr[index] = value
  return newArr as [number, number, number]
}

export function PropertiesPanel({ object, onUpdate, onDelete }: PropertiesPanelProps) {
  if (!object || !onUpdate) {
    return <div className="p-4 text-gray-500 text-sm">Select an object to edit properties</div>
  }

  // Parametric property handlers
  const handleExtrudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value)
    if (!isNaN(value)) {
      onUpdate({ extrudeDepth: value })
    }
  }

  const handleFilletChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value)
    if (!isNaN(value)) {
      onUpdate({ filletRadius: value })
    }
  }

  const handleChamferChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value)
    if (!isNaN(value)) {
      onUpdate({ chamferAngle: value })
    }
  }

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value)
    if (!isNaN(value)) {
      onUpdate({ height: value })
    }
  }

  const handleRadiusTopChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value)
    if (!isNaN(value)) {
      onUpdate({ radiusTop: value })
    }
  }

  const handleRadiusBottomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value)
    if (!isNaN(value)) {
      onUpdate({ radiusBottom: value })
    }
  }

  const handlePositionChange = (axis: "x" | "y" | "z", value: number) => {
    onUpdate({ position: updateArray(object.position, axis, value) })
  }

  const handleScaleChange = (axis: "x" | "y" | "z", value: number) => {
    onUpdate({ scale: updateArray(object.scale, axis, value) })
  }

  const handleRotationChange = (axis: "x" | "y" | "z", value: number) => {
    onUpdate({
      rotation: updateArray(object.rotation, axis, value * (Math.PI / 180)),
    })
  }

  const handleColorChange = (color: string) => {
    onUpdate({ color })
  }

  const handleReset = () => {
    onUpdate({
      position: [0, 0.5, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      color: "#8b5cf6",
      extrudeDepth: 1,
      filletRadius: 0.2,
      chamferAngle: 45,
      radiusTop: 0.5,
      radiusBottom: 0.5,
      height: 1,
    })
  }

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Object Type */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Type</label>
        <p className="text-white capitalize bg-slate-800 px-3 py-1 rounded">{object.type}</p>
      </div>

      {/* Position */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Position</label>
        <div className="grid grid-cols-3 gap-2">
          <InputWithHelper
            label="X"
            helperText="Move along X-axis"
            type="number"
            step="0.1"
            value={object.position[0].toFixed(2)}
            onChange={(e) => handlePositionChange("x", Number.parseFloat(e.target.value) || 0)}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.currentTarget.blur()
            }}
          />
          <InputWithHelper
            label="Y"
            helperText="Move along Y-axis"
            type="number"
            step="0.1"
            value={object.position[1].toFixed(2)}
            onChange={(e) => handlePositionChange("y", Number.parseFloat(e.target.value) || 0)}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.currentTarget.blur()
            }}
          />
          <InputWithHelper
            label="Z"
            helperText="Move along Z-axis"
            type="number"
            step="0.1"
            value={object.position[2].toFixed(2)}
            onChange={(e) => handlePositionChange("z", Number.parseFloat(e.target.value) || 0)}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.currentTarget.blur()
            }}
          />
        </div>
      </div>

      {/* Rotation */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Rotation (degrees)</label>
        <div className="grid grid-cols-3 gap-2">
          <InputWithHelper
            label="X"
            helperText="Rotate around X-axis"
            type="number"
            step="1"
            value={Math.round((object.rotation[0] * 180) / Math.PI)}
            onChange={(e) =>
              handleRotationChange("x", Number.parseFloat(e.target.value) || 0)
            }
          />
          <InputWithHelper
            label="Y"
            helperText="Rotate around Y-axis"
            type="number"
            step="1"
            value={Math.round((object.rotation[1] * 180) / Math.PI)}
            onChange={(e) =>
              handleRotationChange("y", Number.parseFloat(e.target.value) || 0)
            }
          />
          <InputWithHelper
            label="Z"
            helperText="Rotate around Z-axis"
            type="number"
            step="1"
            value={Math.round((object.rotation[2] * 180) / Math.PI)}
            onChange={(e) =>
              handleRotationChange("z", Number.parseFloat(e.target.value) || 0)
            }
          />
        </div>
      </div>

      {/* Scale */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Scale</label>
        <div className="grid grid-cols-3 gap-2">
          <InputWithHelper
            label="X"
            helperText="Scale on X-axis"
            type="number"
            step="0.1"
            value={object.scale[0].toFixed(2)}
            onChange={(e) =>
              handleScaleChange("x", Math.max(0.1, Number.parseFloat(e.target.value) || 1))
            }
          />
          <InputWithHelper
            label="Y"
            helperText="Scale on Y-axis"
            type="number"
            step="0.1"
            value={object.scale[1].toFixed(2)}
            onChange={(e) =>
              handleScaleChange("y", Math.max(0.1, Number.parseFloat(e.target.value) || 1))
            }
          />
          <InputWithHelper
            label="Z"
            helperText="Scale on Z-axis"
            type="number"
            step="0.1"
            value={object.scale[2].toFixed(2)}
            onChange={(e) =>
              handleScaleChange("z", Math.max(0.1, Number.parseFloat(e.target.value) || 1))
            }
          />
        </div>
      </div>

      {/* Extrusion Depth */}
      {["box", "plane"].includes(object.type) && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Extrude Depth
          </label>
          <InputWithHelper
            label=""
            helperText="Adjust the extrusion depth"
            type="number"
            step="0.1"
            value={object.extrudeDepth?.toFixed(2) || "1"}
            onChange={handleExtrudeChange}
          />
        </div>
      )}

      {/* Fillet Radius */}
      {["box", "cylinder", "cone", "wedge"].includes(object.type) && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Fillet Radius
          </label>
          <InputWithHelper
            label=""
            helperText="Smooth edges using fillet"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={object.filletRadius || 0.2}
            onChange={handleFilletChange}
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>0</span>
            <span>{object.filletRadius?.toFixed(2) || "0.20"}</span>
            <span>1</span>
          </div>
        </div>
      )}

      {/* Chamfer Angle */}
      {["box", "wedge"].includes(object.type) && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Chamfer Angle
          </label>
          <InputWithHelper
            label=""
            helperText="Bevel edges at an angle"
            type="range"
            min="0"
            max="90"
            step="1"
            value={object.chamferAngle || 45}
            onChange={handleChamferChange}
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>0°</span>
            <span>{object.chamferAngle || 45}°</span>
            <span>90°</span>
          </div>
        </div>
      )}

      {/* Cylinder / Cone Parameters */}
      {["cylinder", "cone"].includes(object.type) && (
        <div className="space-y-3">
          <InputWithHelper
            label="Height"
            helperText="Set object height"
            type="number"
            step="0.1"
            value={object.height?.toFixed(2) || "1"}
            onChange={handleHeightChange}
          />

          <InputWithHelper
            label="Top Radius"
            helperText="Radius for top of shape"
            type="number"
            step="0.1"
            value={object.radiusTop?.toFixed(2) || "0.5"}
            onChange={handleRadiusTopChange}
          />

          <InputWithHelper
            label="Bottom Radius"
            helperText="Radius for bottom of shape"
            type="number"
            step="0.1"
            value={object.radiusBottom?.toFixed(2) || "0.5"}
            onChange={handleRadiusBottomChange}
          />
        </div>
      )}

      {/* Color */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Color</label>
        <ColorInput
          value={object.color}
          onChange={(e) => handleColorChange(e.target.value)}
          helperText="Click to change object color"
        />
      </div>

      {/* Object Info */}
      <div className="text-xs text-gray-400 bg-slate-800/50 p-2 rounded">
        <p>ID: {object.id}</p>
        <p>Created: {new Date(object.createdAt).toLocaleTimeString()}</p>
        {object.updatedAt !== object.createdAt && (
          <p>Modified: {new Date(object.updatedAt).toLocaleTimeString()}</p>
        )}
      </div>

      {/* Actions */}
      <div className="pt-4 border-t border-slate-700 flex space-x-2 mt-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="flex-1 border-logo-purple/30 text-logo-purple hover:bg-logo-purple/10"
        >
          Reset
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={onDelete}
          className="flex-1"
        >
          Delete
        </Button>
      </div>
    </div>
  )
}