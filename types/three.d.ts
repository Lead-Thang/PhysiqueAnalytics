import { extend } from "@react-three/fiber"
import * as THREE from "three"

// It's good practice to extend THREE for react-three-fiber in a central place,
// like your main app setup or a dedicated three setup file, not necessarily in a .d.ts file.
// However, if this is where you manage all three-related types, ensure extend(THREE) is called once in your application runtime.

declare global {
  namespace JSX {
    interface IntrinsicElements {
      // Geometry
      boxGeometry: any
      sphereGeometry: any
      cylinderGeometry: any
      planeGeometry: any

      // Materials
      meshStandardMaterial: any
      meshBasicMaterial: any
      meshPhongMaterial: any

      // Objects
      mesh: any
      group: any

      // Lights
      ambientLight: any
      directionalLight: any
      pointLight: any
      spotLight: any

      // Helpers
      gridHelper: any
      axesHelper: any
    }
  }
}

export interface Measurement {
  id: string
  type: "distance" | "angle" | "area" | "volume"
  value: number
  unit: string
  points: THREE.Vector3[]
}
