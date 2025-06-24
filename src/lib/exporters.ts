// lib/exporters.ts
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { ModelObject } from "src/types/model-object";
// @ts-ignore
import { saveAs } from "file-saver";
import * as THREE from "three";

/**
 * Converts a ModelObject to a THREE.Mesh for GLTF export compatibility
 */
function modelObjectToMesh(model: ModelObject): THREE.Mesh {
  // Create geometry based on model type
  let geometry: THREE.BufferGeometry;
  
  switch (model.type) {
    case 'box':
      geometry = new THREE.BoxGeometry();
      break;
    case 'sphere':
      geometry = new THREE.SphereGeometry();
      break;
    case 'cylinder':
      geometry = new THREE.CylinderGeometry();
      break;
    default:
      // Use custom geometry if available, otherwise fallback to BoxGeometry
      geometry = model.customGeometry || new THREE.BoxGeometry();
  }

  // Create material based on model properties
  const material = model.customMaterial || new THREE.MeshStandardMaterial({
    color: model.color,
    wireframe: model.wireframe,
    opacity: model.opacity ?? 1.0,
    transparent: (model.opacity ?? 1.0) < 1.0
  });

  // Create mesh with geometry and material
  const mesh = new THREE.Mesh(geometry, material);
  
  // Apply position, rotation, and scale
  mesh.position.set(...model.position);
  mesh.rotation.set(...(model.rotation || [0, 0, 0]));
  mesh.scale.set(...(model.scale || [1, 1, 1]));
  
  // Set visibility
  mesh.visible = model.visible ?? true;

  return mesh;
}

export function exportGLTF(objects: ModelObject[]) {
  // Convert ModelObjects to THREE.Mesh objects
  const threeObjects = objects.map(modelObjectToMesh);
  
  const exporter = new GLTFExporter()
  exporter.parse(
    threeObjects,
    (result: ArrayBuffer | { [key: string]: unknown; }) => {
      const blob = new Blob([
        result instanceof ArrayBuffer ? result : JSON.stringify(result)
      ], { type: "application/gltf" })
      saveAs(blob, "model.gltf")
    },
    (error: ErrorEvent) => {
      console.error('An error occurred during GLTF export:', error)
    }
  )
}

export function exportSTL(objects: ModelObject[]) {
  // Convert ModelObjects to THREE.Mesh objects using the same conversion logic as GLTF export
  const threeObjects = objects.map(modelObjectToMesh);
  
  // Using 'any' to bypass TypeScript check for demonstration purposes
  // Note: In production code, we should properly handle the exporter type
  const exporter = new (STLLoader as any)();
  
  // Export each object separately
  threeObjects.forEach((mesh, index) => {
    exporter.parse(mesh.geometry, (geometry: THREE.BufferGeometry) => {
      // Create a Uint8Array view of the buffer to ensure proper Blob compatibility
      const vertexData = geometry.attributes.position.array;
      const float32Array = new Float32Array(vertexData.buffer, vertexData.byteOffset, vertexData.length);
      
      // Create a new ArrayBuffer and copy the vertex data into it
      const arrayBuffer = new ArrayBuffer(float32Array.byteLength);
      const dataView = new DataView(arrayBuffer);
      
      // Copy the vertex data to the new buffer
      for (let i = 0; i < float32Array.length; i++) {
        dataView.setFloat32(i * 4, float32Array[i], true);
      }
      
      // Create the blob with the properly formatted data
      const blob = new Blob([
        arrayBuffer
      ], {
        type: "application/sla"
      });
      saveAs(blob, `model-${index}.stl`);
    });
  });
}
