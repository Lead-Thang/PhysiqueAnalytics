/**
 * PhysiqueGoalsSection Component
 * Allows users to select and view physique goals with personalized progress and recommendations.
 * Integrates with PhysiqueContext to access current metrics, AI feedback, and goal management.
 * Styled with Tailwind CSS, featuring dynamic icons, accessibility enhancements, and error handling.
 * Supports Supabase integration for saving goals and refreshing data.
 */
import React, { useState, useCallback } from 'react';
import { Target, CheckCircle, Clock, Dumbbell, Shield, FileWarning as Running, Coffee, X, RefreshCw } from 'lucide-react';
import { usePhysique } from '../context/PhysiqueContext';

// Types
type PhysiqueGoalType = 'athletic-shred' | 'bodybuilder-beast' | 'weight-loss' | 'muscle-gain' | 'dadbod-deluxe' | null;

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
  goalType: PhysiqueGoalType;
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
  user: any | null;
  updateTargetPhysique: (physique: PhysiqueGoal) => void;
  refreshPhysiqueData: () => Promise<void>;
  clearError: () => void;
  logError: (error: Error, info: { componentStack: string }) => void;
}

interface PhysiqueTemplate {
  title: string;
  description: string;
  icon: 'Coffee' | 'Dumbbell' | 'Running' | 'Shield';
  targetMetrics: {
    bodyFat: number;
    muscleMass: number;
    weight: number;
    chest?: number;
    waist?: number;
    hips?: number;
    thighs?: number;
    arms?: number;
  };
  trainingFocus: string[];
}

const physiqueTemplates: Record<NonNullable<PhysiqueGoalType>, PhysiqueTemplate> = {
  'dadbod-deluxe': {
    title: 'Dad Bod Deluxe',
    description: 'A relaxed, approachable physique with moderate muscle and healthy body fat.',
    icon: 'Coffee',
    targetMetrics: {
      bodyFat: 22,
      muscleMass: 34,
      weight: 80,
      chest: 100,
      waist: 85,
      hips: 95,
      thighs: 58,
      arms: 33,
    },
    trainingFocus: ['Compound lifts', 'Moderate cardio', 'Core strength'],
  },
  'bodybuilder-beast': {
    title: 'Bodybuilder Beast',
    description: 'Stage-ready muscularity with low body fat for maximum definition.',
    icon: 'Dumbbell',
    targetMetrics: {
      bodyFat: 10,
      muscleMass: 45,
      weight: 85,
      chest: 110,
      waist: 78,
      hips: 92,
      thighs: 62,
      arms: 38,
    },
    trainingFocus: ['Hypertrophy training', 'Strict dieting', 'Pose practice'],
  },
  'athletic-shred': {
    title: 'Athletic Shred',
    description: 'Lean and functional with excellent muscle balance for sports performance.',
    icon: 'Running',
    targetMetrics: {
      bodyFat: 12,
      muscleMass: 40,
      weight: 75,
      chest: 105,
      waist: 80,
      hips: 90,
      thighs: 60,
      arms: 35,
    },
    trainingFocus: ['Functional training', 'HIIT cardio', 'Mobility work'],
  },
  'weight-loss': {
    title: 'Weight Loss',
    description: 'Focus on reducing body fat while maintaining muscle mass.',
    icon: 'Running',
    targetMetrics: {
      bodyFat: 15,
      muscleMass: 35,
      weight: 70,
      chest: 100,
      waist: 82,
      hips: 88,
      thighs: 56,
      arms: 32,
    },
    trainingFocus: ['Cardio workouts', 'Calorie deficit diet', 'Light strength training'],
  },
  'muscle-gain': {
    title: 'Muscle Gain',
    description: 'Build muscle mass with balanced nutrition and heavy lifting.',
    icon: 'Dumbbell',
    targetMetrics: {
      bodyFat: 18,
      muscleMass: 42,
      weight: 82,
      chest: 108,
      waist: 84,
      hips: 94,
      thighs: 61,
      arms: 36,
    },
    trainingFocus: ['Progressive overload', 'High-protein diet', 'Recovery focus'],
  },
};

const IconComponent = {
  Coffee,
  Dumbbell,
  Running,
  Shield,
};

const PhysiqueGoalsSection: React.FC = () => {
  const { currentMetrics, targetPhysique, aiFeedback, isLoading, error, updateTargetPhysique, refreshPhysiqueData, clearError, logError } = usePhysique();
  const [activeTab, setActiveTab] = useState<'select' | 'plan'>('select');

  // Validate metrics
  const validateMetrics = useCallback((metrics: any): metrics is PhysiqueMetrics => {
    const requiredFields = ['height', 'weight', 'bodyFat', 'muscleMass', 'chest', 'waist', 'hips', 'thighs', 'arms'];
    return requiredFields.every((field) => typeof metrics[field] === 'number' && !isNaN(metrics[field]));
  }, []);

  // Get progress percentage
  const getProgressPercentage = useCallback((current: number, target: number, isIncreasing: boolean = false) => {
    if (!current || !target) return 0;
    if (isIncreasing) {
      return current >= target ? 100 : Math.round((current / target) * 100);
    }
    return current <= target ? 100 : Math.min(100, Math.round((target / current) * 100));
  }, []);

  // Get timeline estimate
  const getTimelineEstimate = useCallback((current: number, target: number, metric: 'bodyFat' | 'muscleMass') => {
    if (!current || !target) return 'Data unavailable';
    const difference = Math.abs(target - current);
    if (difference <= 0) return 'Already achieved!';

    const rate = metric === 'bodyFat' ? 1 : 0.5;
    const months = Math.ceil(difference / (targetPhysique?.goalType === 'bodybuilder-beast' ? rate * 0.75 : rate));
    return `${months} month${months !== 1 ? 's' : ''}`;
  }, [targetPhysique]);

  // Handle tab change
  const handleTabChange = useCallback((tab: 'select' | 'plan') => {
    setActiveTab(tab);
  }, []);

  // Handle goal selection
  const handleSelectGoal = useCallback((goalType: PhysiqueGoalType) => {
    if (!goalType) return;
    const template = physiqueTemplates[goalType];
    try {
      updateTargetPhysique({
        targetBodyFat: template.targetMetrics.bodyFat,
        targetMuscleMass: template.targetMetrics.muscleMass,
        targetMeasurements: {
          chest: template.targetMetrics.chest,
          waist: template.targetMetrics.waist,
          hips: template.targetMetrics.hips,
          thighs: template.targetMetrics.thighs,
          arms: template.targetMetrics.arms,
        },
        goalType,
      });
    } catch (err) {
      logError(new Error('Failed to select goal'), { componentStack: 'PhysiqueGoalsSection: handleSelectGoal' });
    }
  }, [updateTargetPhysique, logError]);

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    try {
      await refreshPhysiqueData();
    } catch (err) {
      logError(new Error('Failed to refresh data'), { componentStack: 'PhysiqueGoalsSection: handleRefresh' });
    }
  }, [refreshPhysiqueData, logError]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Target className="h-6 w-6 text-red-600 mr-2" aria-hidden="true" />
          <h2 className="text-xl font-semibold text-gray-800">PhysiqueAnalytics Goals</h2>
        </div>
        <button
          onClick={handleRefresh}
          className="p-2 text-gray-500 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full"
          aria-label="Refresh goals data"
          disabled={isLoading}
        >
          <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} aria-hidden="true" />
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 mb-6 flex items-start" role="alert">
          <div className="p-2 bg-red-100 rounded-full text-red-600">
            <X className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-600">{error}</p>
            <button
              className="mt-2 text-xs text-red-500 hover:underline"
              onClick={clearError}
              aria-label="Dismiss error"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-4" role="tablist">
          <button
            onClick={() => handleTabChange('select')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'select'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            role="tab"
            aria-selected={activeTab === 'select'}
            aria-controls="select-panel"
          >
            Select Goal
          </button>
          <button
            onClick={() => handleTabChange('plan')}
            disabled={!targetPhysique}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'plan' && targetPhysique
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-400 cursor-not-allowed'
            }`}
            role="tab"
            aria-selected={activeTab === 'plan'}
            aria-controls="plan-panel"
            aria-disabled={!targetPhysique}
          >
            Your Plan
          </button>
        </nav>
      </div>

      {/* Goal Selection Tab */}
      {activeTab === 'select' && (
        <div id="select-panel" role="tabpanel" className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">
            Choose your desired physique goal to receive personalized recommendations.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(physiqueTemplates).map(([key, template]) => {
              const Icon = IconComponent[template.icon];
              return (
                <button
                  key={key}
                  onClick={() => handleSelectGoal(key as PhysiqueGoalType)}
                  className={`
                    p-4 rounded-lg border-2 transition-all duration-200
                    ${targetPhysique?.goalType === key
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }
                  `}
                  role="button"
                  tabIndex={0}
                  aria-label={`Select ${template.title} goal`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleSelectGoal(key as PhysiqueGoalType);
                    }
                  }}
                  disabled={isLoading}
                >
                  <div className="flex items-center mb-2">
                    <div
                      className={`
                        p-2 rounded-full mr-3
                        ${targetPhysique?.goalType === key ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}
                      `}
                    >
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">{template.title}</h3>
                    {targetPhysique?.goalType === key && (
                      <CheckCircle className="h-5 w-5 text-green-500 ml-2" aria-hidden="true" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Target Body Fat</span>
                      <span className="font-medium">{template.targetMetrics.bodyFat}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Target Muscle Mass</span>
                      <span className="font-medium">{template.targetMetrics.muscleMass}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Target Weight</span>
                      <span className="font-medium">{template.targetMetrics.weight} kg</span>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {template.trainingFocus.map((focus, index) => (
                      <span
                        key={index}
                        className={`
                          px-2 py-1 rounded-full text-xs font-medium
                          ${targetPhysique?.goalType === key ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}
                        `}
                      >
                        {focus}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Plan Overview Tab */}
      {activeTab === 'plan' && targetPhysique && currentMetrics && validateMetrics(currentMetrics) && (
        <div id="plan-panel" role="tabpanel" className="space-y-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-800 mb-2">Your Personalized Plan</h3>
            <p className="text-sm text-gray-600 mb-4">
              Based on your selected goal of {physiqueTemplates[targetPhysique.goalType].title}, here’s your progress and plan:
            </p>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>
                    Body Fat ({currentMetrics.bodyFat}% → {targetPhysique.targetBodyFat}%)
                  </span>
                  <span>
                    {getProgressPercentage(currentMetrics.bodyFat, targetPhysique.targetBodyFat)}% Complete
                  </span>
                </div>
                <div
                  className="w-full bg-gray-200 rounded-full h-2"
                  role="progressbar"
                  aria-valuenow={getProgressPercentage(currentMetrics.bodyFat, targetPhysique.targetBodyFat)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Body fat progress"
                >
                  <div
                    className="bg-amber-500 h-2 rounded-full"
                    style={{ width: `${getProgressPercentage(currentMetrics.bodyFat, targetPhysique.targetBodyFat)}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>
                    Muscle Mass ({currentMetrics.muscleMass}% → {targetPhysique.targetMuscleMass}%)
                  </span>
                  <span>
                    {getProgressPercentage(currentMetrics.muscleMass, targetPhysique.targetMuscleMass, true)}% Complete
                  </span>
                </div>
                <div
                  className="w-full bg-gray-200 rounded-full h-2"
                  role="progressbar"
                  aria-valuenow={getProgressPercentage(currentMetrics.muscleMass, targetPhysique.targetMuscleMass, true)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Muscle mass progress"
                >
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{
                      width: `${getProgressPercentage(currentMetrics.muscleMass, targetPhysique.targetMuscleMass, true)}%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>
                    Weight ({currentMetrics.weight} kg → {physiqueTemplates[targetPhysique.goalType].targetMetrics.weight} kg)
                  </span>
                  <span>
                    {getProgressPercentage(currentMetrics.weight, physiqueTemplates[targetPhysique.goalType].targetMetrics.weight)}% Complete
                  </span>
                </div>
                <div
                  className="w-full bg-gray-200 rounded-full h-2"
                  role="progressbar"
                  aria-valuenow={getProgressPercentage(currentMetrics.weight, physiqueTemplates[targetPhysique.goalType].targetMetrics.weight)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Weight progress"
                >
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${getProgressPercentage(currentMetrics.weight, physiqueTemplates[targetPhysique.goalType].targetMetrics.weight)}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-1" aria-hidden="true" />
              <span>
                Estimated timeline: {getTimelineEstimate(currentMetrics.bodyFat, targetPhysique.targetBodyFat, 'bodyFat')}
              </span>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-800 mb-3">Training Focus Areas</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {physiqueTemplates[targetPhysique.goalType].trainingFocus.map((focus, index) => (
                <div key={index} className="bg-white rounded-md border border-gray-200 p-3 text-center">
                  <div className="font-medium text-gray-800 text-sm">{focus}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-800 mb-3">Personalized Recommendations</h4>
            <ul className="space-y-2">
              {aiFeedback?.recommendations.length ? (
                aiFeedback.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2" aria-hidden="true" />
                    <span className="text-sm text-gray-600">{rec}</span>
                  </li>
                ))
              ) : (
                <li className="text-sm text-gray-600">No recommendations available. Please refresh your data.</li>
              )}
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'plan' && (!targetPhysique || !currentMetrics || !validateMetrics(currentMetrics)) && (
        <div className="text-center py-8 text-gray-500" role="alert">
          {isLoading ? (
            <div className="flex justify-center items-center">
              <RefreshCw className="h-6 w-6 animate-spin text-blue-600 mr-2" aria-hidden="true" />
              <span>Loading plan data...</span>
            </div>
          ) : targetPhysique ? (
            'Unable to load metrics. Please refresh your data.'
          ) : (
            'Please select a physique goal to view your personalized plan.'
          )}
        </div>
      )}
    </div>
  );
};

export default PhysiqueGoalsSection;