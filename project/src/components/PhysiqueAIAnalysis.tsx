/**
 * PhysiqueContext Component
 * Provides context for managing user metrics, physique goals, and AI analysis in PhysiqueAnalytics.
 * Integrates with Supabase for authentication, data storage, and AI feedback retrieval.
 * Supports error logging for PhysiqueErrorBoundary, image analysis, and data refresh.
 * Ensures consistency with data structures (PhysiqueMetrics, PhysiqueGoal, DashboardAIFeedback) and styling across components.
 */
import React, { createContext, useState, useCallback, useMemo, useContext, ReactNode } from 'react';
/// <reference types="node" />
import { createClient, User } from '@supabase/supabase-js';

// Fixed module augmentation for Supabase
declare global {
  interface Window {
    supabase: ReturnType<typeof createClient>;
  }
}

// Move environment variable declarations before supabase initialization
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

// Validate Supabase environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be defined in environment variables');
}

const supabase = createClient(supabaseUrl!, supabaseAnonKey!); // Add non-null assertions after validation

// Types
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
  createdAt: string;
}

interface PhysiqueGoal {
  targetBodyFat: number;
  targetMuscleMass: number;
  targetMeasurements: Partial<Pick<PhysiqueMetrics, 'chest' | 'waist' | 'hips' | 'thighs' | 'arms'>>;
  deadline?: string;
  goalType: string | null;
  createdAt: string;
}

interface DashboardAIFeedback {
  bodyType: string;
  strengths: string[];
  improvements: string[];
  recommendations: string[];
  overallAssessment: string;
  areasToImprove: string[];
  poseAnalysis?: {
    currentPose: string;
    angles: Record<string, number>;
    confidence: number;
    score?: number;
  };
  symmetryScore: number;
  postureGrade: number;
  createdAt: string;
}

interface PhysiqueContextType {
  currentMetrics: PhysiqueMetrics | null;
  targetPhysique: PhysiqueGoal | null;
  aiFeedback: DashboardAIFeedback | null;
  isLoading: boolean;
  error: string | null;
  user: User | null;
  updateCurrentMetrics: (metrics: PhysiqueMetrics) => Promise<void>;
  updateTargetPhysique: (physique: PhysiqueGoal) => Promise<void>;
  analyzeImage: (imageFile: File) => Promise<void>;
  refreshPhysiqueData: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  logError: (error: Error, info: { componentStack: string; code?: string }) => void;
}

const PhysiqueContext = createContext<PhysiqueContextType | undefined>(undefined);

interface PhysiqueProviderProps {
  children: ReactNode;
}

export const PhysiqueProvider: React.FC<PhysiqueProviderProps> = ({ children }) => {
  const [currentMetrics, setCurrentMetrics] = useState<PhysiqueMetrics | null>(null);
  const [targetPhysique, setTargetPhysique] = useState<PhysiqueGoal | null>(null);
  const [aiFeedback, setAiFeedback] = useState<DashboardAIFeedback | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // Initialize user from Supabase Auth
  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        setUser(user);
      } catch (err: any) {
        setError('Failed to fetch user data');
        console.error(err);
      }
    };
    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_: unknown, session: { user: User | null } | null) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Update current metrics
  const updateCurrentMetrics = useCallback(async (metrics: PhysiqueMetrics) => {
    if (!user) {
      setError('Please sign in to save metrics');
      return;
    }
    setIsLoading(true);
    try {
      const metricsWithTimestamp = { ...metrics, createdAt: new Date().toISOString() };
      setCurrentMetrics(metricsWithTimestamp);
      const { error } = await supabase
        .from('physique_metrics')
        .upsert({ user_id: user.id, ...metricsWithTimestamp });
      if (error) throw error;
    } catch (err: any) {
      setError('Failed to save metrics');
      console.error(err);
      logError(new Error('Failed to save metrics'), { componentStack: 'PhysiqueContext: updateCurrentMetrics', code: err.code });
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Update target physique
  const updateTargetPhysique = useCallback(async (physique: PhysiqueGoal) => {
    if (!user) {
      setError('Please sign in to save goals');
      return;
    }
    setIsLoading(true);
    try {
      const physiqueWithTimestamp = { ...physique, createdAt: new Date().toISOString() };
      setTargetPhysique(physiqueWithTimestamp);
      const { error } = await supabase
        .from('physique_goals')
        .upsert({ user_id: user.id, ...physiqueWithTimestamp });
      if (error) throw error;
    } catch (err: any) {
      setError('Failed to save goals');
      console.error(err);
      logError(new Error('Failed to save goals'), { componentStack: 'PhysiqueContext: updateTargetPhysique', code: err.code });
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Analyze image
  const analyzeImage = useCallback(async (imageFile: File) => {
    if (!user) {
      setError('Please sign in to analyze images');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const fileName = `${user.id}/${Date.now()}_${imageFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from('physique-images')
        .upload(fileName, imageFile);

      if (uploadError) throw uploadError;

      // Mock AI backend call (replace with real endpoint)
      const storageUrl = `${supabaseUrl}/storage/v1/object/public/physique-images/${fileName}`;
      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: storageUrl, userId: user.id }),
      });

      if (!response.ok) throw new Error('Failed to analyze image');

      const { metrics, feedback } = await response.json();

      const metricsWithTimestamp = { ...metrics, createdAt: new Date().toISOString() };
      const feedbackWithTimestamp = { ...feedback, createdAt: new Date().toISOString() };

      setCurrentMetrics(metricsWithTimestamp);
      setAiFeedback(feedbackWithTimestamp);

      await supabase.from('physique_metrics').upsert({ user_id: user.id, ...metricsWithTimestamp });
      await supabase.from('ai_feedback').upsert({ user_id: user.id, ...feedbackWithTimestamp });
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to analyze image. Please try again.';
      setError(errorMessage);
      logError(new Error(errorMessage), { componentStack: 'PhysiqueContext: analyzeImage', code: err.code });
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Refresh physique data
  const refreshPhysiqueData = useCallback(async () => {
    if (!user) {
      setError('Please sign in to refresh data');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data: metricsData, error: metricsError } = await supabase
        .from('physique_metrics')
        .select('*')
        .eq('user_id', user.id)
        .order('createdAt', { ascending: false })
        .limit(1)
        .single();

      if (metricsError) throw metricsError;
      if (metricsData) setCurrentMetrics(metricsData);

      const { data: feedbackData, error: feedbackError } = await supabase
        .from('ai_feedback')
        .select('*')
        .eq('user_id', user.id)
        .order('createdAt', { ascending: false })
        .limit(1)
        .single();

      if (feedbackError) throw feedbackError;
      if (feedbackData) setAiFeedback(feedbackData);

      const { data: goalsData, error: goalsError } = await supabase
        .from('physique_goals')
        .select('*')
        .eq('user_id', user.id)
        .order('createdAt', { ascending: false })
        .limit(1)
        .single();

      if (goalsError) throw goalsError;
      if (goalsData) setTargetPhysique(goalsData);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to refresh data. Please try again.';
      setError(errorMessage);
      logError(new Error(errorMessage), { componentStack: 'PhysiqueContext: refreshPhysiqueData', code: err.code });
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Logout
  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setCurrentMetrics(null);
      setTargetPhysique(null);
      setAiFeedback(null);
      setError(null);
    } catch (err: any) {
      setError('Failed to sign out');
      logError(new Error('Failed to sign out'), { componentStack: 'PhysiqueContext: logout', code: err.code });
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Log error for PhysiqueErrorBoundary
  const logError = useCallback((error: Error, info: { componentStack: string; code?: string }) => {
    console.error('PhysiqueContext Error:', error, info);
    if (user) {
      supabase.from('error_logs').insert({
        user_id: user.id,
        error: error.message,
        component_stack: info.componentStack,
        error_code: info.code,
        timestamp: new Date().toISOString(),
      });
    }
  }, [user]);

  // Memoize context value
  const contextValue = useMemo(
    () => ({
      currentMetrics,
      targetPhysique,
      aiFeedback,
      isLoading,
      error,
      user,
      updateCurrentMetrics,
      updateTargetPhysique,
      analyzeImage,
      refreshPhysiqueData,
      logout,
      clearError,
      logError,
    }),
    [
      currentMetrics,
      targetPhysique,
      aiFeedback,
      isLoading,
      error,
      user,
      updateCurrentMetrics,
      updateTargetPhysique,
      analyzeImage,
      refreshPhysiqueData,
      logout,
      clearError,
      logError,
    ]
  );

  return (
    <PhysiqueContext.Provider value={contextValue}>
      {children}
    </PhysiqueContext.Provider>
  );
};

export const usePhysique = () => {
  const context = useContext(PhysiqueContext);
  if (context === undefined) {
    throw new Error('usePhysique must be used within a PhysiqueProvider');
  }
  return context;
};