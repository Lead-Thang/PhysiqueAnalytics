import React, { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { RefreshCcw, Camera, X } from 'lucide-react';
import * as tf from '@tensorflow/tfjs';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import Webcam from 'react-webcam';
import {
  POSE_LANDMARKS,
  Pose
} from '@mediapipe/pose';

// Add this line after the imports
const mpPose = { POSE_LANDMARKS, Pose };

// Define PoseLandmark type since it's not properly imported from mediapipe
interface PoseLandmark {
  x: number;
  y: number;
  z: number;
  visibility: number;
}

// Adding type definition
interface PhysiqueMetrics {
  height: number;
  weight: number;
  bodyFat: number;
  muscleMass: number;
  chest: number;
  waist: number;
  hips: number;
  thighs: number;
  arms: number;
}

type PhysiqueGoal = 'athletic-shred' | 'bodybuilder-beast' | 'weight-loss' | 'muscle-gain' | null;

// Creating usePhysique hook
const usePhysique = () => {
  // This is where your actual implementation would go
  return {
    currentMetrics: {
      height: 175,
      weight: 75,
      bodyFat: 20,
      muscleMass: 35,
      chest: 95,
      waist: 80,
      hips: 92,
      thighs: 55,
      arms: 30,
    },
    targetPhysique: 'athletic-shred' as 'athletic-shred' | null,
    refreshPhysiqueData: () => {}
  };
};

interface BodyVisualizerProps {
  // Props remain the same, but we'll prioritize context values
}

interface HologramEffectProps {
  position?: [number, number, number];
  scale?: number;
}

// Adding usePhysique hook type definition
interface PhysiqueContextType {
  currentMetrics: PhysiqueMetrics | null;
  targetPhysique: PhysiqueMetrics | null;
  refreshPhysiqueData: () => Promise<void>;
}

const HologramEffect = () => {
  const meshRef = useRef<any>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2, 32, 32]} />
      <meshPhongMaterial
        color="cyan"
        emissive="cyan"
        emissiveIntensity={0.5}
        transparent={true}
        opacity={0.5}
      />
    </mesh>
  );
};

// Add canvas for pose detection visualization
const PoseCanvas: React.FC<{
  webcamRef: React.RefObject<Webcam>;
  poses: PoseLandmark[][] | null;
  isLoading: boolean;
  error: string | null;
}> = ({ webcamRef, poses, isLoading, error }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current || !webcamRef.current?.video) return;
    
    const video = webcamRef.current.video;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    const draw = () => {
      if (video.readyState === 4) {
        // Set canvas size to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw video frame
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Draw skeleton if we have pose data
        if (poses && poses.length > 0 && poses[0].length > 0) {
          drawSkeleton(ctx, poses[0], video.videoWidth, video.videoHeight, canvas.width, canvas.height);
        }
      }
      
      requestAnimationFrame(draw);
    };
    
    draw();
  }, [webcamRef, poses]);
  
  // Skeleton drawing logic (same as in your reference)
  const drawSkeleton = (
    ctx: CanvasRenderingContext2D,
    landmarks: PoseLandmark[],
    videoWidth: number,
    videoHeight: number,
    canvasWidth: number,
    canvasHeight: number
  ) => {
    // Scale factors
    const scaleX = canvasWidth / videoWidth;
    const scaleY = canvasHeight / videoHeight;
    
    // Define connections between landmarks using direct numeric values
    const connections = [
      // Spine
      [0, 1], [1, 2], [2, 0],  // Nose to eyes, eyes to each other
      
      // Shoulders
      [11, 12],  // Left to right shoulder
      
      // Arms
      [11, 13], [13, 15],  // Left arm
      [12, 14], [14, 16],  // Right arm
      
      // Hips
      [23, 24],  // Left to right hip
      
      // Legs
      [23, 25], [25, 27],  // Left leg
      [24, 26], [26, 28],  // Right leg
      
      // Torso
      [11, 23], [12, 24]  // Shoulders to hips
    ];
    
    // Draw connections
    ctx.strokeStyle = '#FF6B6B';
    ctx.lineWidth = 2;
    
    connections.forEach(([startIdx, endIdx]) => {
      const start = landmarks[startIdx];
      const end = landmarks[endIdx];
      
      if (start && end && start.visibility > 0.5 && end.visibility > 0.5) {
        ctx.beginPath();
        ctx.moveTo(start.x * canvasWidth, start.y * canvasHeight);
        ctx.lineTo(end.x * canvasWidth, end.y * canvasHeight);
        ctx.stroke();
      }
    });
    
    // Draw landmarks
    ctx.fillStyle = '#4A90E2';
    
    landmarks.forEach((landmark, idx) => {
      if (landmark.visibility > 0.5) {
        ctx.beginPath();
        ctx.arc(landmark.x * canvasWidth, landmark.y * canvasHeight, 4, 0, 2 * Math.PI);
        ctx.fill();
      }
    });
  };

  return (
    <div className="absolute inset-0">
      {/* Hidden webcam stream */}
      <div className="absolute inset-0 opacity-0 overflow-hidden">
        <Webcam
          ref={webcamRef as React.RefObject<Webcam>}
          className="w-full h-full object-cover"
          muted
          playsInline
        />
      </div>
      
      {/* Canvas for drawing skeleton */}
      <canvas
        ref={canvasRef as React.RefObject<HTMLCanvasElement>}
        className="w-full h-full object-cover"
      />
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-white text-lg">Initializing pose detection...</div>
        </div>
      )}
      
      {/* Error overlay */}
      {error && (
        <div className="absolute inset-0 bg-red-500 bg-opacity-70 flex items-center justify-center">
          <div className="text-white text-center p-4">
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-white bg-opacity-20 rounded hover:bg-opacity-30 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const FloatingModel: React.FC<{
  position: [number, number, number];
  color: string;
  scale: number;
  metrics: any;
  isTarget?: boolean;
  poseKeypoints?: any[];
}> = ({ position, color, scale, metrics, isTarget, poseKeypoints }) => {
  const modelRef = useRef<any>(null);
  const [hover, setHover] = useState(false);

  useFrame((state) => {
    if (modelRef.current) {
      modelRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.1;
      
      // Rotate the model slowly
      modelRef.current.rotation.y += 0.005;
    }
  });

  // Create a simple cylinder to represent the body
  const createBodyShape = () => {
    // Calculate proportions based on metrics
    const baseHeight = 4;
    const baseWaist = 0.5;
    const baseChest = 0.7;
    
    // Adjust dimensions based on body fat and muscle mass
    const heightFactor = metrics.height / 180; // Normalize to average height
    const bodyFatFactor = 1 + (metrics.bodyFat - 20) / 100; // Base waist at 20% body fat
    const muscleFactor = 1 + (metrics.muscleMass - 35) / 100; // Base muscle mass at 35%
    
    // Adjust chest and waist based on physique
    const chestScale = baseChest * heightFactor * muscleFactor;
    const waistScale = baseWaist * heightFactor * bodyFatFactor;
    
    // Create different segments for more realistic shape
    return (
      <group>
        {/* Upper body */}
        <mesh>
          <cylinderGeometry args={[waistScale * 0.8, chestScale, baseHeight * 0.4, 32]} />
          <meshStandardMaterial 
            color={isTarget ? '#4A90E2' : '#F4A261'}
            metalness={0.2}
            roughness={0.8}
          />
        </mesh>
        {/* Middle body */}
        <mesh>
          <cylinderGeometry args={[waistScale, waistScale, baseHeight * 0.3, 32]} />
          <meshStandardMaterial 
            color={isTarget ? '#4A90E2' : '#F4A261'}
            metalness={0.2}
            roughness={0.8}
          />
        </mesh>
        {/* Lower body */}
        <mesh>
          <cylinderGeometry args={[waistScale * 0.9, waistScale * 0.7, baseHeight * 0.3, 32]} />
          <meshStandardMaterial 
            color={isTarget ? '#4A90E2' : '#F4A261'}
            metalness={0.2}
            roughness={0.8}
          />
        </mesh>
      </group>
    );
  };

  return (
    <group ref={modelRef}>
      {createBodyShape()}
      
      {/* Add hover effect */}
      {hover && (
        <mesh>
          <ringGeometry args={[0.8, 1, 32]} />
          <meshBasicMaterial color="#4A90E2" opacity={0.3} transparent />
        </mesh>
      )}
    </group>
  );
};

const BodyVisualizer: React.FC = () => {
  const { currentMetrics, targetPhysique, refreshPhysiqueData } = usePhysique();
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [poses, setPoses] = useState<PoseLandmark[][] | null>(null);
  const [isPoseLoading, setIsPoseLoading] = useState(true);
  const [poseError, setPoseError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCurrent, setShowCurrent] = useState(true);
  const [showTarget, setShowTarget] = useState(true);
  const [showHologram, setShowHologram] = useState(true);
  
  // Initialize MediaPipe Pose
  useEffect(() => {
    const initializePose = async () => {
      try {
        setIsPoseLoading(true);
        
        // Create MediaPipe Pose instance
        const pose = new Pose({
          locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
        });
        
        // Set up MediaPipe results listener
        pose.onResults((results: any) => {
          if (results.poseLandmarks) {
            setPoses([results.poseLandmarks]);
          }
          setIsPoseLoading(false);
        });
        
        // Start processing frames
        if (webcamRef.current && webcamRef.current.video) {
          const video = webcamRef.current.video;
          video.addEventListener('loadeddata', () => {
            setIsPoseLoading(false);
          });
          
          // Process frames continuously
          const processFrame = async () => {
            if (video.readyState === 4) {
              try {
                await pose.send({ image: video });
                requestAnimationFrame(processFrame);
              } catch (err) {
                console.error('Error processing frame:', err);
                setPoseError('Error processing video frame');
                setIsPoseLoading(false);
              }
            }
          };
          
          requestAnimationFrame(processFrame);
        }
      } catch (err) {
        console.error('Error initializing MediaPipe Pose:', err);
        setPoseError('Failed to initialize pose detection');
        setIsPoseLoading(false);
      }
    };
    
    initializePose();
    
    // Cleanup function
    return () => {
      // TODO: Clean up MediaPipe resources
    };
  }, []);
  
  // Custom hook for handling async operations
  const handleRefresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await refreshPhysiqueData();
    } catch (err) {
      setError('Failed to refresh physique data');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [refreshPhysiqueData]);
  
  // Validate metrics from context
  const validateMetrics = useCallback((metrics: any): metrics is PhysiqueMetrics => {
    if (!metrics) return false;
    
    const requiredFields = ['height', 'weight', 'bodyFat', 'muscleMass'];
    return requiredFields.every(field => 
      typeof metrics[field] === 'number' && !isNaN(metrics[field])
    );
  }, []);
  
  // Use default metrics when no valid data is available
  const defaultMetrics: PhysiqueMetrics = {
    height: 175,
    weight: 75,
    bodyFat: 20,
    muscleMass: 35,
    chest: 95,
    waist: 80,
    hips: 92,
    thighs: 55,
    arms: 30,
  };
  
  const getCurrentMetrics = () => {
    return validateMetrics(currentMetrics) ? currentMetrics : defaultMetrics;
  };
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Hidden canvas for pose detection */}
      <canvas 
        style={{display: 'none'}} 
        ref={canvasRef} 
      />
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Camera className="h-6 w-6 text-green-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-800">3D Body Visualizer</h2>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="flex items-center px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
        >
          <RefreshCcw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Visualization Controls */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="show-current"
            checked={showCurrent}
            onChange={(e) => setShowCurrent(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="show-current" className="text-sm text-gray-700">Current Physique</label>
        </div>

        {targetPhysique && (
          <div className="flex items-center">
            <input
              type="checkbox"
              id="show-target"
              checked={showTarget}
              onChange={(e) => setShowTarget(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="show-target" className="text-sm text-gray-700">Target Physique</label>
          </div>
        )}

        <div className="flex items-center">
          <input
            type="checkbox"
            id="show-hologram"
            checked={showHologram}
            onChange={(e) => setShowHologram(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="show-hologram" className="text-sm text-gray-700">Hologram Effect</label>
        </div>
      </div>

      {/* Webcam Feed with Pose Detection */}
      <div className="mb-6 relative">
        <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
          {/* Webcam Component */}
          <Webcam
            ref={webcamRef}
            mirrored={true}
            className="absolute top-0 left-0 w-full h-full object-cover z-10"
          />
          
          {/* Canvas for drawing skeleton */}
          <canvas
            ref={canvasRef as any}
            className="absolute top-0 left-0 w-full h-full z-20 pointer-events-none"
            width={640}
            height={480}
          />
          
          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-30">
              <div className="text-white text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white mx-auto mb-2"></div>
                <p>Loading pose detection model...</p>
              </div>
            </div>
          )}
          
          {/* Error Overlay */}
          {error && !isLoading && (
            <div className="absolute inset-0 bg-red-900/70 flex items-center justify-center z-30">
              <div className="text-white text-center p-4">
                <X className="h-8 w-8 mx-auto mb-2 text-red-300" />
                <p className="font-medium">Pose Detection Error</p>
                <p className="text-sm mt-1">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-2 px-4 py-1 bg-red-700 rounded hover:bg-red-800 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          )}
        </div>
        
        <p className="text-sm text-gray-500 mt-2 text-center">
          Position yourself in front of the camera to see your pose detected in real-time.
        </p>
      </div>
      
      {/* 3D Visualization Container */}
      <div className="w-full h-[400px] bg-gray-900 rounded-lg overflow-hidden relative">
        <BodyVisualization3D />
      
        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 rounded-lg p-3 text-white text-sm">
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-orange-400 mr-2"></div>
              <span>Current</span>
            </div>
            {targetPhysique && (
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-400 mr-2"></div>
                <span>Target</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Information & Error Panel */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        {error ? (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
            <p className="text-sm">{error}</p>
          </div>
        ) : null}

        <h3 className="font-medium text-gray-800 mb-2">3D Body Visualization</h3>
        <p className="text-sm text-gray-600">
          This visualization shows your current physique compared to your selected goal.
          Use the controls above to toggle between views and adjust the display settings.
        </p>
      </div>
    </div>
  );
};

const BodyVisualization3D = () => {
  return (
    <Canvas camera={{ position: [0, 1.5, 3], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <mesh>
        <boxGeometry />
        <meshStandardMaterial />
      </mesh>
      <OrbitControls />
      <HologramEffect />
    </Canvas>
  );
};

export default BodyVisualizer;