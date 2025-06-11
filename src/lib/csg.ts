// src/lib/csg.ts
import { CSG } from "three-csg-forge"
import type { ModelObject } from "@/types/model-object"
import * as THREE from "three"

declare module "three-csg-forge" {
  import * as THREE from "three";
  export const CSG: {
    union: (a: THREE.Mesh, b: THREE.Mesh) => THREE.Mesh;
    subtract: (a: THREE.Mesh, b: THREE.Mesh) => THREE.Mesh;
    intersect: (a: THREE.Mesh, b: THREE.Mesh) => THREE.Mesh;
  };
}

export function applyCSG(
  op: "union" | "subtract" | "intersect",
  objA: ModelObject,
  objB: ModelObject
): ModelObject | null {
  try {
    const meshA = getMeshFromObject(objA)
    const meshB = getMeshFromObject(objB)

    if (!meshA || !meshB) return null

    let resultMesh: THREE.Mesh | null = null

    switch (op) {
      case "union":
        resultMesh = CSG.union(meshA, meshB)
        break
      case "subtract":
        resultMesh = CSG.subtract(meshA, meshB)
        break
      case "intersect":
        resultMesh = CSG.intersect(meshA, meshB)
        break
    }

    if (resultMesh) {
      const newId = Date.now().toString()
      return {
        id: newId,
        type: "custom-mesh",
        position: [(objA.position[0] + objB.position[0]) / 2, 0.5, (objA.position[2] + objB.position[2]) / 2],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        color: objA.color,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
    }
  } catch (err) {
    console.error("CSG operation failed:", err)
    return null
  }

  return null
}

function getMeshFromObject(obj: ModelObject): THREE.Mesh | null {
  switch (obj.type) {
    case "box":
      return new THREE.Mesh(
        new THREE.BoxGeometry(obj.scale[0], obj.scale[1], obj.scale[2]),
        new THREE.MeshStandardMaterial({ color: obj.color })
      )
    case "sphere":
      return new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 32, 32),
        new THREE.MeshStandardMaterial({ color: obj.color })
      )
    default:
      return null
  }
}