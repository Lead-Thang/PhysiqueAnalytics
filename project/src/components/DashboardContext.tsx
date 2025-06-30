import React, { createContext, useState, useContext, useEffect } from 'react';
import type { Metrics, ProgressData, MuscleGroupAssessment, DashboardAIFeedback, PhysiqueGoal } from '../types';

// Define the context type
interface DashboardContextType {
  metrics: Metrics;
  progressData: ProgressData;
  muscleAnalysis: MuscleGroupAssessment;
  aiFeedback: DashboardAIFeedback;
  selectedPhysiqueGoal: PhysiqueGoal;
  selectPhysiqueGoal: (goal: PhysiqueGoal) => void;
}

// Create the context
const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

// Provider component
export const DashboardProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  // Sample initial data
  const [metrics, setMetrics] = useState<Metrics>({
    weight: 70,
    height: 175,
    bodyFat: 20,
    muscleMass: 50,
    chest: 90,
    waist: 80,
    hips: 95,
    thighs: 50,
    arms: 30,
    createdAt: new Date().toISOString(),
  });

  const [progressData, setProgressData] = useState<ProgressData>([
    { date: '2023-01-01', weight: 70, bodyFat: 20 },
    { date: '2023-02-01', weight: 68, bodyFat: 18 },
    { date: '2023-03-01', weight: 66, bodyFat: 16 },
  ]);

  const [muscleAnalysis, setMuscleAnalysis] = useState<MuscleGroupAssessment>({
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

  const [aiFeedback, setAiFeedback] = useState<DashboardAIFeedback>({
    bodyType: "Athletic",
    strengths: ["Good overall fitness", "Balanced muscle distribution"],
    improvements: ["Upper body strength", "Core stability"],
    recommendations: [
      "Focus on compound exercises like squats and deadlifts",
      "Increase protein intake to support muscle growth",
      "Add HIIT workouts to improve cardiovascular fitness",
      "Ensure adequate recovery between training sessions"
    ],
    overallAssessment: "Your body composition is within normal ranges, but there's room for improvement in muscle definition.",
    areasToImprove: ["Upper body strength", "Core stability"]
  });

  const [selectedPhysiqueGoal, setSelectedPhysiqueGoal] = useState<PhysiqueGoal>('dadbod-deluxe');

  const selectPhysiqueGoal = (goal: PhysiqueGoal) => {
    setSelectedPhysiqueGoal(goal);
  };

  return (
    <DashboardContext.Provider value={{ 
      metrics, 
      progressData, 
      muscleAnalysis, 
      aiFeedback,
      selectedPhysiqueGoal,
      selectPhysiqueGoal
    }}>
      {children}
    </DashboardContext.Provider>
  );
};

// Hook for consumer components
export const useDashboardContext = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboardContext must be used within a DashboardProvider');
  }
  return context;
};