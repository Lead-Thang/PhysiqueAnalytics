// src/lib/csg.ts
import { CSG } from "three-csg-ts";
import type { ModelObject } from "../types/model-object"; // Use path alias
import * as THREE from "three";

export function applyCSG(
  op: "union" | "subtract" | "intersect",
  objA: ModelObject,
  objB: ModelObject
): ModelObject | null {
  try {
    const meshA = getMeshFromObject(objA);
    const meshB = getMeshFromObject(objB);
    if (!meshA || !meshB) return null;

    let resultMesh: THREE.Mesh | null = null;

    switch (op) {
      case "union":
        resultMesh = CSG.union(meshA, meshB);
        break;
      case "subtract":
        resultMesh = CSG.subtract(meshA, meshB);
        break;
      case "intersect":
        resultMesh = CSG.intersect(meshA, meshB);
        break;
    }

    if (resultMesh) {
      // Consider a more robust ID generation, e.g., using a UUID library
      const newId = `csg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      return {
        id: newId,
        name: `CSG ${op} Result`,
        type: "custom-mesh",
        // The resulting mesh is in world coordinates if inputs were.
        // Or, if inputs were relative to a parent, this needs careful handling.
        // For simplicity, assuming world coordinates for now.
        position: [
          resultMesh.position.x,
          resultMesh.position.y,
          resultMesh.position.z,
        ],
        rotation: [
          resultMesh.rotation.x,
          resultMesh.rotation.y,
          resultMesh.rotation.z,
        ],
        scale: [resultMesh.scale.x, resultMesh.scale.y, resultMesh.scale.z],
        color: objA.color, // Or derive from resultMesh.material if possible
        customGeometry: resultMesh.geometry, // Add the resulting geometry
        customMaterial: Array.isArray(resultMesh.material)
          ? resultMesh.material[0]
          : resultMesh.material, // Ensure single Material
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
    }
  } catch (err) {
    console.error("CSG operation failed:", err);
    return null;
  }

  return null;
}

function getMeshFromObject(obj: ModelObject): THREE.Mesh | null {
  let geometry: THREE.BufferGeometry | undefined;
  const material = new THREE.MeshStandardMaterial({
    color: obj.color,
    wireframe: obj.wireframe ?? false,
    opacity: obj.opacity ?? 1,
    transparent: (obj.opacity ?? 1) < 1,
  });

  switch (obj.type) {
    case "box":
      geometry = new THREE.BoxGeometry(
        obj.scale[0] || 1,
        obj.scale[1] || 1,
        obj.scale[2] || 1
      );
      break;
    case "sphere":
      // Assuming obj.radius or a default from scale
      geometry = new THREE.SphereGeometry(
        obj.radius ?? obj.scale[0] / 2 ?? 0.5,
        32,
        32
      );
      break;
    case "cylinder":
      geometry = new THREE.CylinderGeometry(
        obj.radiusTop ?? obj.scale[0] / 2 ?? 0.5,
        obj.radiusBottom ?? obj.scale[0] / 2 ?? 0.5,
        obj.height ?? obj.scale[1] ?? 1,
        32
      );
      break;
    case "cone":
      geometry = new THREE.ConeGeometry(
        obj.radius ?? obj.scale[0] / 2 ?? 0.5,
        obj.height ?? obj.scale[1] ?? 1,
        32
      );
      break;
    case "torus":
      geometry = new THREE.TorusGeometry(
        obj.radius ?? obj.scale[0] / 2 ?? 0.5,
        obj.scale[1] ? obj.scale[1] / 5 : 0.1, // Deriving tube from scale or using default
        16,
        100
      );
      break;
    case "plane":
      geometry = new THREE.PlaneGeometry(obj.scale[0] ?? 1, obj.scale[1] ?? 1);
      break;
    // Add cases for other ModelObject types: cone, torus, plane, wedge etc.
    case "custom-mesh":
      if (obj.customGeometry) {
        geometry = obj.customGeometry;
        // Potentially use obj.customMaterial if available
      }
      break;
    default:
      return null;
  }
  if (!geometry) return null;

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(
    obj.position[0] ?? 0,
    obj.position[1] ?? 0,
    obj.position[2] ?? 0
  );
  mesh.rotation.set(
    ...((Array.isArray(obj.rotation) && obj.rotation.length === 3
      ? obj.rotation
      : [0, 0, 0]) as [number, number, number])
  );
  // Note: CSG operations usually work best with unscaled meshes or meshes whose scale is baked into vertices.
  // If obj.scale is not [1,1,1], you might need to apply it to the geometry before CSG.
  // For now, assuming CSG library handles transformed meshes or that scale is applied post-CSG.
  return mesh;
}
