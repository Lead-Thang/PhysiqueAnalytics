declare module "three-csg-forge" {
  import * as THREE from "three";
  export const CSG: {
    union: (a: THREE.Mesh, b: THREE.Mesh) => THREE.Mesh;
    subtract: (a: THREE.Mesh, b: THREE.Mesh) => THREE.Mesh;
    intersect: (a: THREE.Mesh, b: THREE.Mesh) => THREE.Mesh;
  };
}