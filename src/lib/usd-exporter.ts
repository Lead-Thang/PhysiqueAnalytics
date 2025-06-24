import { Group, Mesh, MeshStandardMaterial, BufferGeometry } from "three";

interface ModelObject {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

/**
 * Converts an array of ModelObject into a Three.js Group scene graph
 * @param objects - Array of ModelObject instances
 * @returns A Three.js Group containing mesh representations of the objects
 */
export function modelObjectsToThreeScene(objects: ModelObject[]): Group {
  const sceneGroup = new Group();

  for (const obj of objects) {
    // Create a simple placeholder mesh (you can replace this with real geometry loading)
    const geometry = new BufferGeometry();
    const material = new MeshStandardMaterial({ color: 0x888888 });
    const mesh = new Mesh(geometry, material);

    mesh.position.set(obj.position[0], obj.position[1], obj.position[2]);

    if (obj.rotation) {
      mesh.rotation.set(obj.rotation[0], obj.rotation[1], obj.rotation[2]);
    }

    if (obj.scale !== undefined) {
      mesh.scale.set(obj.scale, obj.scale, obj.scale);
    }

    sceneGroup.add(mesh);
  }

  return sceneGroup;
}