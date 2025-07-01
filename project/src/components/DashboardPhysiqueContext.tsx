/**
 * DashboardPhysiqueContext
 * Manages physique-related data for the PhysiqueAnalytics application, including metrics, progress, pose analysis, and AI feedback.
 * Provides a centralized state for PhysiqueAnalysis, PhysiqueVisualizer, and PhysiqueProgressChart components.
 * Supports async data fetching, image-based pose detection, and physique goal selection.
 * Built with React Context API and TypeScript for type safety.
 */
import React, { createContext, useState, useContext, useCallback } from 'react';

// Types
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
  createdAt: string; // ISO date string
}

interface ProgressDataPoint {
  date: string; // ISO date string (e.g., "2025-07-01")
  weight: number; // in kg
  bodyFat: number; // percentage
  muscleMass: number; // percentage
}

interface PoseAnalysis {
  detectedPose: string; // e.g., "Front Double Biceps"
  accuracy: number; // 0-100%
  coachingTips: string[];
}

interface MuscleGroupAssessment {
  primaryMuscles: {
    chest: number; // 0-1, representing development score
    back: number;
    legs: number;
    arms: number;
    shoulders: number;
  };
  secondaryMuscles: {
    core: number;
    glutes: number;
    hamstrings: number;
  };
}

interface DashboardAIFeedback {
  bodyType: string;
  strengths: string[];
  improvements: string[];
  recommendations: string[];
  overallAssessment: string;
  areasToImprove: string[];
}

type PhysiqueGoal = 'athletic-shred' | 'bodybuilder-beast' | 'weight-loss' | 'muscle-gain' | 'dadbod-deluxe' | null;

interface PhysiqueContextType {
  metrics: PhysiqueMetrics | null;
  progressData: ProgressDataPoint[];
  muscleAnalysis: MuscleGroupAssessment | null;
  aiFeedback: DashboardAIFeedback | null;
  selectedPhysiqueGoal: PhysiqueGoal;
  poseAnalysis: PoseAnalysis | null;
  isLoading: boolean;
  error: string | null;
  selectPhysiqueGoal: (goal: PhysiqueGoal) => void;
  analyzeImage: (file: File) => Promise<{ poseAnalysis?: PoseAnalysis }>;
  refreshPhysiqueData: () => Promise<void>;
  clearError: () => void;
}

// Create the context
const PhysiqueContext = createContext<PhysiqueContextType | undefined>(undefined);

// Provider component
export const PhysiqueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State
  const [metrics, setMetrics] = useState<PhysiqueMetrics | null>({
    height: 175,
    weight: 75,
    bodyFat: 20,
    muscleMass: 35,
    chest: 95,
    waist: 80,
    hips: 92,
    thighs: 55,
    arms: 30,
    createdAt: new Date().toISOString(),
  });

  const [progressData, setProgressData] = useState<ProgressDataPoint[]>([
    { date: '2025-06-01', weight: 78, bodyFat: 22, muscleMass: 33 },
    { date: '2025-06-10', weight: 77, bodyFat: 21, muscleMass: 34 },
    { date: '2025-06-20', weight: 76, bodyFat: 20.5, muscleMass: 34.5 },
    { date: '2025-07-01', weight: 75, bodyFat: 20, muscleMass: 35 },
  ]);

  const [muscleAnalysis, setMuscleAnalysis] = useState<MuscleGroupAssessment | null>({
    primaryMuscles: {
      chest: 0.7,
      back: 0.6,
      legs: 0.8,
      arms: 0.5,
      shoulders: 0.6,
    },
    secondaryMuscles: {
      core: 0.4,
      glutes: 0.5,
      hamstrings: 0.4,
    },
  });

  const [aiFeedback, setAiFeedback] = useState<DashboardAIFeedback | null>({
    bodyType: 'Athletic',
    strengths: ['Good overall fitness', 'Balanced muscle distribution'],
    improvements: ['Upper body strength', 'Core stability'],
    recommendations: [
      'Focus on compound exercises like squats and deadlifts',
      'Increase protein intake to support muscle growth',
      'Add HIIT workouts to improve cardiovascular fitness',
      'Ensure adequate recovery between training sessions',
    ],
    overallAssessment: 'Your body composition is within normal ranges, but there’s room for improvement in muscle definition.',
    areasToImprove: ['Upper body strength', 'Core stability'],
  });

  const [selectedPhysiqueGoal, setSelectedPhysiqueGoal] = useState<PhysiqueGoal>('athletic-shred');
  const [poseAnalysis, setPoseAnalysis] = useState<PoseAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Validate metrics
  const validateMetrics = useCallback((metrics: any): metrics is PhysiqueMetrics => {
    const requiredFields = ['height', 'weight', 'bodyFat', 'muscleMass', 'chest', 'waist', 'hips', 'thighs', 'arms', 'createdAt'];
    return requiredFields.every((field) => typeof metrics[field] === 'number' || (field === 'createdAt' && typeof metrics[field] === 'string'));
  }, []);

  // Validate progress data
  const validateProgressData = useCallback((data: any[]): data is ProgressDataPoint[] => {
    return data.every((point) => {
      const requiredFields = ['date', 'weight', 'bodyFat', 'muscleMass'];
      return requiredFields.every((field) => typeof point[field] === 'string' || typeof point[field] === 'number');
    });
  }, []);

  // Select physique goal
  const selectPhysiqueGoal = useCallback((goal: PhysiqueGoal) => {
    setSelectedPhysiqueGoal(goal);
  }, []);

  // Analyze image for pose detection
  const analyzeImage = useCallback(async (file: File): Promise<{ poseAnalysis?: PoseAnalysis }> => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate image analysis (replace with actual implementation, e.g., MediaPipe or API call)
      const result = await new Promise<{ poseAnalysis: PoseAnalysis }>((resolve) => {
        setTimeout(() => {
          resolve({
            poseAnalysis: {
              detectedPose: 'Front Double Biceps',
              accuracy: Math.random() * 20 + 80,
              coachingTips: ['Keep elbows higher', 'Tighten core', 'Spread lats wider'],
            },
          });
        }, 1000);
      });
      setPoseAnalysis(result.poseAnalysis);
      return result;
    } catch (err) {
      setError('Failed to analyze image. Please ensure the file is a valid JPG or PNG.');
      return {};
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refresh physique data
  const refreshPhysiqueData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call (replace with actual data fetching)
      const newMetrics: PhysiqueMetrics = {
        height: 175,
        weight: 74.5,
        bodyFat: 19.5,
        muscleMass: 35.5,
        chest: 96,
        waist: 79,
        hips: 91,
        thighs: 56,
        arms: 31,
        createdAt: new Date().toISOString(),
      };
      const newProgressData: ProgressDataPoint[] = [
        ...progressData,
        { date: new Date().toISOString().split('T')[0], weight: 74.5, bodyFat: 19.5, muscleMass: 35.5 },
      ];

      if (validateMetrics(newMetrics)) {
        setMetrics(newMetrics);
      } else {
        setError('Invalid metrics data received');
      }

      if (validateProgressData(newProgressData)) {
        setProgressData(newProgressData);
      } else {
        setError('Invalid progress data received');
      }
    } catch (err) {
      setError('Failed to refresh physique data');
    } finally {
      setIsLoading(false);
    }
  }, [progressData, validateMetrics, validateProgressData]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <PhysiqueContext.Provider
      value={{
        metrics,
        progressData,
        muscleAnalysis,
        aiFeedback,
        selectedPhysiqueGoal,
        poseAnalysis,
        isLoading,
        error,
        selectPhysiqueGoal,
        analyzeImage,
        refreshPhysiqueData,
        clearError,
      }}
    >
      {children}
    </PhysiqueContext.Provider>
  );
};

// Hook for consumer components
export const usePhysique = (): PhysiqueContextType => {
  const context = useContext(PhysiqueContext);
  if (context === undefined) {
    throw new Error('usePhysique must be used within a PhysiqueProvider');
  }
  return context;
};