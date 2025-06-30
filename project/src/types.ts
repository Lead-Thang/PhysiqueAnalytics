export interface UserMetrics {
  height: number; // cm
  weight: number; // kg
  bodyFat: number; // percentage
  muscleMass: number; // percentage
  chest: number; // cm
  waist: number; // cm
  hips: number; // cm
  thighs: number; // cm
  arms: number; // cm
}

// Metrics type for dashboard context
export interface Metrics extends UserMetrics {
  createdAt: string; // ISO date string
}

export interface ProgressDataPoint {
  date: string; // YYYY-MM-DD format
  weight: number; // kg
  bodyFat: number; // percentage
}

// ProgressData type for dashboard context
export type ProgressData = ProgressDataPoint[];

export interface FitnessGoal {
  id: string;
  title: string;
  target: number;
  metric: string;
  deadline: string; // YYYY-MM-DD format
  progress: number; // percentage of completion
  completed: boolean;
}

export type TimeframeOption = 'week' | 'month' | 'year';

export interface BodyType {
  name: string;
  description: string;
  recommendations: string[];
}

export type PhysiqueGoal = 
  | "dadbod-deluxe"
  | "bodybuilder-beast"
  | "athletic-shred"
  | "strongman-tank";

export interface PhysiqueTemplate {
  id: PhysiqueGoal;
  title: string;
  icon: string;
  description: string;
  targetMetrics: {
    bodyFat: number;
    muscleMass: number;
    shoulderToWaist: number;
  };
  trainingFocus: string[];
}

export interface MuscleAnalysis {
  region: string;
  status: "underdeveloped" | "balanced" | "overdeveloped";
  recommendation: string;
}

// Updated MuscleAnalysis to include primary and secondary muscles
export interface MuscleGroupAssessment {
  primaryMuscles: Record<string, number>;
  secondaryMuscles: Record<string, number>;
}

export interface AIFeedback {
  bodyType: string;
  strengths: string[];
  improvements: string[];
  recommendations: string[];
}

// Extended AIFeedback for dashboard context
export interface DashboardAIFeedback extends AIFeedback {
  overallAssessment: string;
  areasToImprove: string[];
}

// Interface for physique metrics used in AI analysis
export interface PhysiqueMetrics extends UserMetrics {
  bodyFatEstimate?: number;
  muscleGroups?: Record<string, string>;
  symmetryScore?: number;
  postureGrade?: number;
}
