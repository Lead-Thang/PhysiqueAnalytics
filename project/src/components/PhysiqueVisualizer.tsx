/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'react' {
  // Add missing types
  namespace React {
    type RefObject<T> = { current: T | null };
    type ComponentType<P = {}> = ComponentClass<P> | FunctionComponent<P>;
    type ComponentProps<T extends keyof JSX.IntrinsicElements | ComponentType<any>> = 
      T extends ComponentType<infer P> ? P : T extends keyof JSX.IntrinsicElements ? JSX.IntrinsicElements[T] : {};
  }
}
/**
 * PhysiqueVisualizer Component
 * A 3D visualization tool for PhysiqueAnalytics, displaying real-time pose detection and physique models.
 * Uses MediaPipe for pose detection, React Three Fiber for 3D rendering, and Tailwind CSS for styling.
 * Integrates with PhysiqueContext to access physique metrics and pose data.
 * Features accessibility enhancements, error handling, and dynamic visualization of current and target physiques.
 */
import React, { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { RefreshCcw, Camera, X } from 'lucide-react';
import * as tf from '@tensorflow/tfjs';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Segments } from '@react-three/drei';
import { LineSegments2 } from 'three/examples/jsm/objects/LineSegments2';
import { LineSegments } from 'three/examples/jsm/objects/LineSegments';
import { Line2 } from 'three/examples/jsm/objects/Line2';
import * as THREE from 'three';
import Webcam from 'react-webcam';
import { POSE_LANDMARKS, Pose } from '@mediapipe/pose';

// MediaPipe Pose reference
const mpPose = { POSE_LANDMARKS, Pose };

// Types
interface PoseLandmark {
  x: number;
  y: number;
  z: number;
  visibility: number;
}

interface PhysiqueMetrics {
  height: number; // in cm
  weight: number; // in kg
  bodyFat: number; // percentage
  muscleMass: number; // percentage
  chest: number; // in cm
  waist: number; // in cm
  hips: number; // in cm
  thighs: number; // in cm
  arms: number; // in cm
}

interface PoseAnalysis {
  detectedPose: string; // e.g., "Front Double Biceps"
  accuracy: number; // 0-100%
  coachingTips: string[];
}

interface PhysiqueContextType {
  currentMetrics: PhysiqueMetrics | null;
  targetPhysique: PhysiqueGoal | null;
  analyzeImage: (file: File) => Promise<{ poseAnalysis?: PoseAnalysis }>;
  isLoading: boolean;
  refreshPhysiqueData: () => Promise<void>;
}

// Mock usePhysique hook (replace with actual implementation)
const usePhysique = (): PhysiqueContextType => {
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
    targetPhysique: 'athletic-shred',
    analyzeImage: async (file: File) => ({
      poseAnalysis: {
        detectedPose: 'Front Double Biceps',
        accuracy: 85,
        coachingTips: ['Keep elbows higher', 'Tighten core', 'Spread lats wider'],
      },
    }),
    isLoading: false,
    refreshPhysiqueData: async () => {},
  };
};

type PhysiqueGoal = 'athletic-shred' | 'bodybuilder-beast' | 'weight-loss' | 'muscle-gain' | null;

// Hologram Effect
const HologramEffect: React.FC<{ position?: [number, number, number]; scale?: number }> = ({
  position = [0, 0, 0],
  scale = 1,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.y = position[1] + Math.sin(Date.now() * 0.001) * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <torusGeometry args={[1.5, 0.1, 16, 100]} />
      <meshPhongMaterial
        color="cyan"
        emissive="cyan"
        emissiveIntensity={0.3}
        transparent
        opacity={0.4}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

// Pose Skeleton in 3D
const PoseSkeleton3D: React.FC<{ landmarks: PoseLandmark[] }> = ({ landmarks }) => {
  const linesRef = useRef<LineSegments2>(null);

  const connections = [
    // Spine
    [0, 1], [1, 2], [2, 0], // Nose to eyes
    // Shoulders
    [11, 12], // Left to right shoulder
    // Arms
    [11, 13], [13, 15], // Left arm
    [12, 14], [14, 16], // Right arm
    // Hips
    [23, 24], // Left to right hip
    // Legs
    [23, 25], [25, 27], // Left leg
    [24, 26], [26, 28], // Right leg
    // Torso
    [11, 23], [12, 24], // Shoulders to hips
  ];

  const geometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    connections.forEach(([startIdx, endIdx]) => {
      const start = landmarks[startIdx];
      const end = landmarks[endIdx];
      if (start?.visibility > 0.5 && end?.visibility > 0.5) {
        points.push(new THREE.Vector3(start.x * 2 - 1, -(start.y * 2 - 1), start.z * 2));
        points.push(new THREE.Vector3(end.x * 2 - 1, -(end.y * 2 - 1), end.z * 2));
      }
    });
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [landmarks]);

  return (
    <lineSegments ref={linesRef} geometry={geometry}>
      <lineBasicMaterial color="#FF6B6B" linewidth={2} />
    </lineSegments>
  );
};

// Floating Model
const FloatingModel: React.FC<{
  position: [number, number, number];
  color: string;
  scale: number;
  metrics: PhysiqueMetrics;
  isTarget?: boolean;
  poseLandmarks?: PoseLandmark[];
}> = ({ position, color, scale, metrics, isTarget, poseLandmarks }) => {
  const modelRef = useRef<THREE.Group>(null);
  const [hover, setHover] = useState(false);

  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.position.y = position[1] + Math.sin(Date.now() * 0.001) * 0.1;
      modelRef.current.rotation.y += 0.005;
    }
  });

  const createBodyShape = () => {
    const baseHeight = 4;
    const baseChest = 0.7;
    const baseWaist = 0.5;
    const baseHips = 0.6;

    const heightFactor = metrics.height / 180;
    const bodyFatFactor = 1 + (metrics.bodyFat - 20) / 100;
    const muscleFactor = 1 + (metrics.muscleMass - 35) / 100;

    const chestScale = (metrics.chest / 95) * baseChest * heightFactor * muscleFactor;
    const waistScale = (metrics.waist / 80) * baseWaist * heightFactor * bodyFatFactor;
    const hipsScale = (metrics.hips / 92) * baseHips * heightFactor * bodyFatFactor;

    return (
      <group scale={scale}>
        {/* Upper body (chest) */}
        <mesh position={[0, baseHeight * 0.3, 0]}>
          <cylinderGeometry args={[waistScale * 0.8, chestScale, baseHeight * 0.4, 32]} />
          <meshStandardMaterial
            color={isTarget ? '#4A90E2' : '#F4A261'}
            metalness={0.2}
            roughness={0.8}
          />
        </mesh>
        {/* Middle body (waist) */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[waistScale, waistScale, baseHeight * 0.3, 32]} />
          <meshStandardMaterial
            color={isTarget ? '#4A90E2' : '#F4A261'}
            metalness={0.2}
            roughness={0.8}
          />
        </mesh>
        {/* Lower body (hips) */}
        <mesh position={[0, -baseHeight * 0.3, 0]}>
          <cylinderGeometry args={[hipsScale, waistScale * 0.7, baseHeight * 0.3, 32]} />
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
    <group
      ref={modelRef}
      position={position}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      {createBodyShape()}
      {hover && (
        <mesh position={[0, 0, 0]}>
          <ringGeometry args={[0.8, 1, 32]} />
          <meshBasicMaterial color="#4A90E2" opacity={0.3} transparent />
        </mesh>
      )}
      {poseLandmarks && <PoseSkeleton3D landmarks={poseLandmarks} />}
    </group>
  );
};

// Pose Canvas (2D overlay)
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
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        if (poses && poses.length > 0 && poses[0].length > 0) {
          drawSkeleton(ctx, poses[0], video.videoWidth, video.videoHeight, canvas.width, canvas.height);
        }
      }

      requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(requestAnimationFrame(draw));
  }, [webcamRef, poses]);

  const drawSkeleton = (
    ctx: CanvasRenderingContext2D,
    landmarks: PoseLandmark[],
    videoWidth: number,
    videoHeight: number,
    canvasWidth: number,
    canvasHeight: number
  ) => {
    const scaleX = canvasWidth / videoWidth;
    const scaleY = canvasHeight / videoHeight;

    const connections = [
      [0, 1], [1, 2], [2, 0], // Nose to eyes
      [11, 12], // Shoulders
      [11, 13], [13, 15], // Left arm
      [12, 14], [14, 16], // Right arm
      [23, 24], // Hips
      [23, 25], [25, 27], // Left leg
      [24, 26], [26, 28], // Right leg
      [11, 23], [12, 24], // Shoulders to hips
    ];

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

    ctx.fillStyle = '#4A90E2';
    landmarks.forEach((landmark) => {
      if (landmark.visibility > 0.5) {
        ctx.beginPath();
        ctx.arc(landmark.x * canvasWidth, landmark.y * canvasHeight, 4, 0, 2 * Math.PI);
        ctx.fill();
      }
    });
  };

  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0 opacity-0 overflow-hidden">
        <Webcam
          ref={webcamRef}
          className="w-full h-full object-cover"
          mirrored
          videoConstraints={{ width: 640, height: 480 }}
          aria-hidden="true"
        />
      </div>
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover"
        role="img"
        aria-label="Real-time pose detection overlay"
      />
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-white text-lg">Initializing pose detection...</div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 bg-red-500 bg-opacity-70 flex items-center justify-center">
          <div className="text-white text-center p-4">
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-white bg-opacity-20 rounded hover:bg-opacity-30 transition-colors"
              aria-label="Retry pose detection"
            >
              Retry
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

interface BodyVisualizerProps {}
// ... existing code...

// Main Component
const PhysiqueVisualizer: React.FC<BodyVisualizerProps> = () => {
  const { currentMetrics, targetPhysique, refreshPhysiqueData } = usePhysique();
  const webcamRef = useRef<Webcam>(null);
  const [poses, setPoses] = useState<PoseLandmark[][] | null>(null);
  const [poseAnalysis, setPoseAnalysis] = useState<PoseAnalysis | null>(null);
  const [isPoseLoading, setIsPoseLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCurrent, setShowCurrent] = useState(true);
  const [showTarget, setShowTarget] = useState(true);
  const [showHologram, setShowHologram] = useState(true);

  // Initialize MediaPipe Pose
  useEffect(() => {
    let pose: Pose | null = null;
    const initializePose = async () => {
      try {
        setIsPoseLoading(true);
        await tf.ready();
        pose = new mpPose.Pose({
          locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
        });
        pose.setOptions({
          modelComplexity: 1,
          smoothLandmarks: true,
          enableSegmentation: false,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        pose.onResults((results: any) => {
          if (results.poseLandmarks) {
            setPoses([results.poseLandmarks]);
            // Mock pose analysis (replace with actual pose classification logic)
            setPoseAnalysis({
              detectedPose: 'Front Double Biceps',
              accuracy: Math.random() * 20 + 80,
              coachingTips: ['Keep elbows higher', 'Tighten core', 'Spread lats wider'],
            });
          } else {
            setPoses(null);
            setPoseAnalysis(null);
          }
          setIsPoseLoading(false);
        });

        if (webcamRef.current && webcamRef.current.video) {
          const video = webcamRef.current.video;
          const processFrame = async () => {
            if (video.readyState === 4 && pose) {
              try {
                await pose.send({ image: video });
                requestAnimationFrame(processFrame);
              } catch (err) {
                setError('Error processing video frame');
                setIsPoseLoading(false);
              }
            }
          };
          video.addEventListener('loadeddata', () => {
            processFrame();
          });
        }
      } catch (err) {
        setError('Failed to initialize pose detection');
        setIsPoseLoading(false);
      }
    };

    initializePose();

    return () => {
      if (pose) {
        pose.close();
      }
    };
  }, []);

  const handleRefresh = useCallback(async () => {
    setError(null);
    try {
      await refreshPhysiqueData();
    } catch (err) {
      setError('Failed to refresh physique data');
    }
  }, [refreshPhysiqueData]);

  const validateMetrics = useCallback((metrics: any): metrics is PhysiqueMetrics => {
    const requiredFields = ['height', 'weight', 'bodyFat', 'muscleMass', 'chest', 'waist', 'hips', 'thighs', 'arms'];
    return requiredFields.every((field) => typeof metrics[field] === 'number' && !isNaN(metrics[field]));
  }, []);

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

  const getCurrentMetrics = () => (validateMetrics(currentMetrics) ? currentMetrics : defaultMetrics);

  const getTargetMetrics = (): PhysiqueMetrics => {
    if (!targetPhysique) return defaultMetrics;
    switch (targetPhysique) {
      case 'athletic-shred':
        return { ...defaultMetrics, bodyFat: 12, muscleMass: 40, chest: 100, waist: 75 };
      case 'bodybuilder-beast':
        return { ...defaultMetrics, bodyFat: 8, muscleMass: 45, chest: 110, waist: 70 };
      case 'weight-loss':
        return { ...defaultMetrics, bodyFat: 15, weight: 70, waist: 75 };
      case 'muscle-gain':
        return { ...defaultMetrics, muscleMass: 42, weight: 80, chest: 105 };
      default:
        return defaultMetrics;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Camera className="h-6 w-6 text-green-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-800">PhysiqueAnalytics 3D Visualizer</h2>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isPoseLoading}
          className="flex items-center px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
          aria-label="Refresh physique data"
        >
          <RefreshCcw className={`h-4 w-4 mr-1 ${isPoseLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 mb-6 flex items-start">
          <div className="p-2 bg-red-100 rounded-full text-red-600">
            <X className="h-5 w-5" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-600">{error}</p>
            <button
              className="mt-2 text-xs text-red-500 hover:underline"
              onClick={() => setError(null)}
              aria-label="Dismiss error"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <div className="mb-6 flex flex-wrap gap-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="show-current"
            checked={showCurrent}
            onChange={(e) => setShowCurrent(e.target.checked)}
            className="mr-2 focus:ring-blue-500"
            aria-label="Toggle current physique display"
          />
          <label htmlFor="show-current" className="text-sm text-gray-700">
            Current Physique
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="show-target"
            checked={showTarget}
            onChange={(e) => setShowTarget(e.target.checked)}
            className="mr-2 focus:ring-blue-500"
            aria-label="Toggle target physique display"
          />
          <label htmlFor="show-target" className="text-sm text-gray-700">
            Target Physique
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="show-hologram"
            checked={showHologram}
            onChange={(e) => setShowHologram(e.target.checked)}
            className="mr-2 focus:ring-blue-500"
            aria-label="Toggle hologram effect"
          />
          <label htmlFor="show-hologram" className="text-sm text-gray-700">
            Hologram Effect
          </label>
        </div>
      </div>

      <div className="mb-6 relative aspect-video bg-black rounded-lg overflow-hidden">
        <PoseCanvas webcamRef={webcamRef} poses={poses} isLoading={isPoseLoading} error={error} />
        {poseAnalysis && (
          <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 rounded-lg p-3 text-white text-sm">
            <p>
              Detected Pose: <span className="font-semibold">{poseAnalysis.detectedPose}</span>
            </p>
            <p>
              Accuracy: <span className="font-semibold">{poseAnalysis.accuracy.toFixed(1)}%</span>
            </p>
            <div
              className="mt-2 w-32 bg-gray-200 rounded-full h-2"
              role="progressbar"
              aria-valuenow={poseAnalysis.accuracy}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Pose accuracy"
            >
              <div
                className="h-2 rounded-full bg-yellow-500"
                style={{ width: `${poseAnalysis.accuracy}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="w-full h-[400px] bg-gray-900 rounded-lg overflow-hidden relative">
        <Canvas camera={{ position: [0, 1.5, 5], fov: 50 }} aria-label="3D physique visualization">
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          {showCurrent && (
            <FloatingModel
              position={[-1.5, 0, 0]}
              color="#F4A261"
              scale={0.8}
              metrics={getCurrentMetrics()}
              poseLandmarks={poses && poses[0] ? poses[0] : undefined}
            />
          )}
          {showTarget && targetPhysique && (
            <FloatingModel
              position={[1.5, 0, 0]}
              color="#4A90E2"
              scale={0.8}
              metrics={getTargetMetrics()}
              isTarget
              poseLandmarks={poses && poses[0] ? poses[0] : undefined}
            />
          )}
          {showHologram && <HologramEffect position={[0, 0, 0]} scale={1.2} />}
          <OrbitControls enablePan={false} />
        </Canvas>
        <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 rounded-lg p-3 text-white text-sm">
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-orange-400 mr-2" />
              <span>Current</span>
            </div>
            {targetPhysique && (
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-400 mr-2" />
                <span>Target</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-800 mb-2">Physique Visualization</h3>
        <p className="text-sm text-gray-600">
          Visualize your current and target physique in 3D. Use the controls to toggle views and adjust
          the hologram effect. Position yourself in front of the camera for real-time pose detection.
        </p>
      </div>
    </div>
  );
};

export default PhysiqueVisualizer;