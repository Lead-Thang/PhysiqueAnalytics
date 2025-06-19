import type React from "react"
import * as THREE from "three"
export type ModelObject = {
  id: string
  name?: string // Optional display name
  type: "box" | "sphere" | "cylinder" | "cone" | "torus" | "plane" | "wedge" | "custom" | "extrusion" | "revolution" | "sweep" | "custom-mesh"
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
  color: string
  materialType?: "standard" | "phong" | "toon" | "lambert" | "physical"
  wireframe?: boolean
  opacity?: number
  visible?: boolean
  locked?: boolean
  parentId?: string | null
  createdAt: number
  updatedAt: number
  extrudeDepth?: number
  filletRadius?: number
  chamferAngle?: number
  sweepPath?: ModelObject[] // For sweep operations, a path of points
  revolutionAxis?: "x" | "y" | "z" // Axis of revolution for revolution operations
  revolutionAngle?: number // Angle of revolution for revolution operations
  customGeometry?: THREE.BufferGeometry // For custom meshes
  customMaterial?: THREE.Material // For custom meshes
  customMesh?: THREE.Mesh // For custom meshes
  height?: number
  radius?: number // For Spheres (main radius), or Torus (main radius)
  tubeRadius?: number // For Torus (tube radius)
  radiusTop?: number
  radiusBottom?: number
}

export type BoxParams = {
  width: number
  height: number
  depth: number
}

export type SphereParams = {
  radius: number
  widthSegments?: number
  heightSegments?: number
}

export type CylinderParams = {
  radiusTop: number
  radiusBottom: number
  height: number
  radialSegments?: number
}

export type TorusParams = {
  radius: number
  tubeRadius: number
  arc?: number
  segments?: number
}

export type GeometryParams =
  | { type: "box"; params: BoxParams }
  | { type: "sphere"; params: SphereParams }
  | { type: "cylinder"; params: CylinderParams }
  | { type: "torus"; params: TorusParams }