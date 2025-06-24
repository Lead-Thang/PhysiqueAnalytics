// c:\Users\PC\Downloads\conceivin3d (2)\src\types\three-csg-forge.d.ts
declare module 'three-csg-forge' {
  import { Mesh } from 'three';

  export class CSG {
    static union(meshA: Mesh, meshB: Mesh): Mesh;
    static subtract(meshA: Mesh, meshB: Mesh): Mesh;
    static intersect(meshA: Mesh, meshB: Mesh): Mesh;
    // Add other methods or properties if you use them
  }
}