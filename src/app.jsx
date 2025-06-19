import React, { useState, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const App = () => {
  const [scene, setScene] = useState(null);
  const [camera, setCamera] = useState(null);
  const [renderer, setRenderer] = useState(null);
  const [controls, setControls] = useState(null);
  const [modelParts, setModelParts] = useState([]);
  const [isExploded, setIsExploded] = useState(false);

  // Initialize the 3D scene
  useEffect(() => {
    const canvas = document.getElementById('canvas');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Add directional light
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(1, 1, 1).normalize();
    scene.add(dirLight);

    // Load the 3D model
    const loader = new GLTFLoader();
    loader.load(
      'https://placeholder-url.com/model.glb',  // Replace with your 3D model URL
      (gltf) => {
        const root = gltf.scene;
        root.scale.set(0.5, 0.5, 0.5); // Adjust scale as needed
        root.position.y = -1; // Adjust position as needed

        // Separate the model into parts
        const parts = [];
        root.traverse((object) => {
          if (object.isMesh) {
            parts.push(object);
          }
        });

        setModelParts(parts);
        scene.add(root);
      }
    );

    setScene(scene);
    setCamera(camera);
    setRenderer(renderer);
    setControls(controls);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup on unmount
    return () => {
      controls.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, []);

  // Explode the model
  const explodeModel = () => {
    if (!modelParts || modelParts.length === 0) return;

    modelParts.forEach((part, index) => {
      const direction = new THREE.Vector3().subVectors(part.position, camera.position).normalize();
      part.userData.originalPosition = part.position.clone(); // Save original position
      part.position.add(direction.multiplyScalar(1 + index * 0.5)); // Move away from the center
    });

    setIsExploded(true);
  };

  // Assemble the model back
  const assembleModelBack = () => {
    if (!modelParts || modelParts.length === 0) return;

    modelParts.forEach((part) => {
      if (part.userData.originalPosition) {
        part.position.copy(part.userData.originalPosition); // Restore original position
      }
    });

    setIsExploded(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      {/* Canvas for 3D rendering */}
      <canvas id="canvas" className="w-full max-w-[800px] aspect-square rounded-lg shadow-lg"></canvas>

      {/* Buttons for Explode and Assemble */}
      <div className="mt-4 flex space-x-4">
        <button
          onClick={explodeModel}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg"
        >
          Explode view
        </button>
        <button
          onClick={assembleModelBack}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg"
        >
          Assemble back
        </button>
      </div>
    </div>
  );
};

export default App;