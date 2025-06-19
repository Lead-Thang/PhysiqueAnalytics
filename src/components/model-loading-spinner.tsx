"use client"

import { useRef } from "react"
import { Canvas, useFrame, extend } from "@react-three/fiber"
import * as THREE from "three" // Import the THREE namespace for type usage
import { BoxGeometry, MeshStandardMaterial } from "three" // Import specific components

// Extend the fiber namespace
extend({ BoxGeometry, MeshStandardMaterial }) // Extend with specific constructors


function SpinningCube() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5
      meshRef.current.rotation.y += delta * 0.8
    }
  })

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#8b5cf6" wireframe transparent opacity={0.8} />
    </mesh>
  )
}

export function ModelLoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="w-32 h-32 mb-4">
        <Canvas camera={{ position: [2, 2, 2], fov: 60 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <SpinningCube />
        </Canvas>
      </div>
      <div className="text-center">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" />
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
        </div>
        <p className="text-sm text-gray-400">Loading 3D Environment...</p>
      </div>
    </div>
  )
}
