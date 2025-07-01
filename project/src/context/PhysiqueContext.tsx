/**
 * PhysiqueContext Component
 * Provides context for managing user metrics, physique goals, and AI analysis in PhysiqueAnalytics.
 * Integrates with Supabase for authentication, data storage, and AI feedback retrieval.
 * Supports error logging for PhysiqueErrorBoundary, image analysis, and data refresh.
 * Styled with Tailwind CSS for consistent error display across components.
 */
import React, { createContext, useState, useCallback, useContext, ReactNode } from 'react';
import { createClient } from '@supabase/supabase-js';
import type { User } from '@supabase/supabase-js';

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
}

interface PhysiqueContextType {
  currentMetrics: PhysiqueMetrics | null;
  targetPhysique: PhysiqueGoal | null;
  aiFeedback: DashboardAIFeedback | null;
  isLoading: boolean;
  error: string | null;
  user: User | null;
  updateCurrentMetrics: (metrics: PhysiqueMetrics) => void;
  updateTargetPhysique: (physique: PhysiqueGoal) => void;
  analyzeImage: (imageFile: File) => Promise<void>;
  refreshPhysiqueData: () => Promise<void>;
  clearError: () => void;
  logError: (error: Error, info: { componentStack: string }) => void;
}

const PhysiqueContext = createContext<PhysiqueContextType | undefined>(undefined);

interface PhysiqueProviderProps {
  children: ReactNode;
}

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL || '',
  process.env.REACT_APP_SUPABASE_ANON_KEY || ''
);

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
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Update current metrics
  const updateCurrentMetrics = useCallback(async (metrics: PhysiqueMetrics) => {
    setCurrentMetrics(metrics);
    if (user) {
      try {
        const { error } = await supabase
          .from('physique_metrics')
          .upsert({ user_id: user.id, ...metrics });
        if (error) throw error;
      } catch (err) {
        setError('Failed to save metrics');
        console.error(err);
      }
    }
  }, [user]);

  // Update target physique
  const updateTargetPhysique = useCallback(async (physique: PhysiqueGoal) => {
    setTargetPhysique(physique);
    if (user) {
      try {
        const { error } = await supabase
          .from('physique_goals')
          .upsert({ user_id: user.id, ...physique });
        if (error) throw error;
      } catch (err) {
        setError('Failed to save goals');
        console.error(err);
      }
    }
  }, [user]);

  // Analyze image (replace mock with real AI backend call)
  const analyzeImage = useCallback(async (imageFile: File) => {
    if (!user) {
      setError('Please sign in to analyze images');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Upload image to Supabase storage
      const fileName = `${user.id}/${Date.now()}_${imageFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from('physique-images')
        .upload(fileName, imageFile);

      if (uploadError) throw uploadError;

      // Call AI backend (mocked endpoint; replace with real AI service)
      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: `${supabase.storageUrl}/physique-images/${fileName}`, userId: user.id }),
      });

      if (!response.ok) throw new Error('Failed to analyze image');

      const { metrics, feedback } = await response.json();

      setCurrentMetrics(metrics);
      setAiFeedback(feedback);

      // Save metrics and feedback to Supabase
      await supabase.from('physique_metrics').upsert({ user_id: user.id, ...metrics });
      await supabase.from('ai_feedback').upsert({ user_id: user.id, ...feedback });
    } catch (err: any) {
      setError('Failed to analyze image. Please try again.');
      console.error(err);
      logError(err, { componentStack: 'PhysiqueContext: analyzeImage' });
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
      // Fetch metrics
      const { data: metricsData, error: metricsError } = await supabase
        .from('physique_metrics')
        .select('*')
        .eq('user_id', user.id)
        .order('createdAt', { ascending: false })
        .limit(1)
        .single();

      if (metricsError) throw metricsError;
      if (metricsData) setCurrentMetrics(metricsData);

      // Fetch AI feedback
      const { data: feedbackData, error: feedbackError } = await supabase
        .from('ai_feedback')
        .select('*')
        .eq('user_id', user.id)
        .order('createdAt', { ascending: false })
        .limit(1)
        .single();

      if (feedbackError) throw feedbackError;
      if (feedbackData) setAiFeedback(feedbackData);

      // Fetch goals
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
      setError('Failed to refresh data. Please try again.');
      console.error(err);
      logError(err, { componentStack: 'PhysiqueContextAVAContext: refreshPhysiqueData' });
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Log error for PhysiqueErrorBoundary
  const logError = useCallback((error: Error, info: { componentStack: string }) => {
    console.error('PhysiqueContext Error:', error, info);
    // Optionally log to Supabase or external service (e.g., Sentry)
    if (user) {
      supabase.from('error_logs').insert({
        user_id: user.id,
        error: error.message,
        component_stack: info.componentStack,
        timestamp: new Date().toISOString(),
      });
    }
  }, [user]);

  return (
    <PhysiqueContext.Provider
      value={{
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
        clearError,
        logError,
      }}
    >
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