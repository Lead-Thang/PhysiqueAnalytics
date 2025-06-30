import React, { useState, useEffect } from 'react';
import { Sparkles, Trophy, BarChart3, Clock, Target, AlertCircle } from 'lucide-react';
import type { PhysiqueMetrics } from '../types';

// Define pose types
interface PoseData {
  name: string;
  angles: Record<string, number>;
  vectors: Record<string, number[]>;
}

interface CoachingRecommendation {
  pose: string;
  recommendation: string[];
  confidence: number;
  score?: number;
}

interface BodyAnalysisResult {
  currentPose: PoseData | null;
  recommendations: CoachingRecommendation[];
  metrics: {
    bodyFatEstimate: number;
    muscleGroups: Record<string, string>;
    symmetryScore: number;
    postureGrade: number;
  };
  timestamp: Date;
}

// Golden standard poses for comparison
const goldenPoses = {
  "Front Double Biceps": {
    name: "Front Double Biceps",
    angles: {
      headTilt: 5,
      torsoLean: 3,
      hipAngle: -10,
      armFlex: 160,
      shoulderTilt: 15
    },
    description: "Classic front pose showing off chest and arms"
  },
  "Side Relaxed": {
    name: "Side Relaxed",
    angles: {
      headTilt: 2,
      torsoLean: 8,
      hipAngle: 5,
      armFlex: 90,
      shoulderTilt: 5
    },
    description: "Natural side pose highlighting waist and lats"
  },
  "Front Pose": {
    name: "Front Pose",
    angles: {
      headTilt: 5,
      torsoLean: 3,
      hipAngle: -5,
      armFlex: 170,
      shoulderTilt: 10
    },
    description: "General front display of physique"
  }
};

const AIAnalysis: React.FC = () => {
  const [analysis, setAnalysis] = useState<BodyAnalysisResult | null>({
    currentPose: null,
    recommendations: [],
    metrics: {
      bodyFatEstimate: 0,
      muscleGroups: {},
      symmetryScore: 0,
      postureGrade: 0
    },
    timestamp: new Date()
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Mock metrics data - this would come from your backend or sensors
  const mockMetrics: PhysiqueMetrics = {
    height: 175,
    weight: 75,
    bodyFat: 13.8,
    muscleMass: 42,
    chest: 105,
    waist: 78,
    hips: 95,
    thighs: 60,
    arms: 38,
    bodyFatEstimate: 0,
    muscleGroups: {},
    symmetryScore: 0,
    postureGrade: 0
  };
  
  // Simulated pose detection function
  const detectPose = (landmarks: any): PoseData => {
    // In a real implementation, we'd analyze landmarks to determine pose
    // For now, we'll simulate based on some basic heuristics
    
    // Calculate key angles from landmarks
    const angles = {
      headTilt: Math.random() * 10, // Simulated head tilt angle
      torsoLean: Math.random() * 5, // Simulated torso lean
      hipAngle: Math.random() * 15 - 5, // Simulated hip angle
      armFlex: 170 - Math.random() * 20, // Simulated arm flexion
      shoulderTilt: Math.random() * 10 // Simulated shoulder tilt
    };
    
    // Determine pose type based on angles
    const poseType = Object.entries(goldenPoses).reduce((bestMatch, [key, pose]) => {
      // Calculate similarity score between current angles and this pose
      const score = Object.entries(pose.angles).reduce((total, [angleName, targetValue]) => {
        const currentValue = angles[angleName as keyof typeof angles];
        const diff = Math.abs(currentValue - targetValue);
        return total - diff;
      }, 0);
      
      return score > bestMatch.score ? { type: key, score } : bestMatch;
    }, { type: "Unknown", score: -Infinity });
    
    return {
      name: poseType.type,
      angles,
      vectors: {
        spineVector: [0.1, 0.9, 0.1], // Simulated spine vector
        shoulderLine: [0.9, 0.1, 0], // Simulated shoulder line
        hipVector: [0.8, 0.2, 0] // Simulated hip vector
      }
    };
  };
  
  // Generate coaching recommendations
  const generateRecommendations = (currentPose: PoseData): CoachingRecommendation[] => {
    const targetPose = goldenPoses[currentPose.name as keyof typeof goldenPoses];
    if (!targetPose) return [];
    
    // Calculate differences between current pose and target pose
    const recommendations: string[] = Object.entries(targetPose.angles).reduce((acc, [angleName, targetValue]) => {
      const currentValue = currentPose.angles[angleName as keyof typeof currentPose.angles];
      const diff = currentValue - targetValue;
      
      if (Math.abs(diff) > 2) {
        const direction = diff > 0 ? "increase" : "decrease";
        const absDiff = Math.abs(diff);
        acc.push(`${direction} ${angleName.replace(/([A-Z])/g, ' $1').toLowerCase()} by ${absDiff.toFixed(1)}°`);
      }
      
      return acc;
    }, [] as string[]);
    
    // Add random recommendations if none were generated
    if (recommendations.length === 0 && Math.random() < 0.3) {
      const randomAdjustments = [
        "Tilt head slightly forward (5°)",
        "Lean torso to the left by 3%",
        "Angle hips slightly back for better v-taper",
        "Flex triceps harder, right side underlit"
      ];
      
      // Randomly select 1-2 recommendations
      const numRecs = Math.floor(Math.random() * 2) + 1;
      for (let i = 0; i < numRecs; i++) {
        const randIdx = Math.floor(Math.random() * randomAdjustments.length);
        recommendations.push(randomAdjustments[randIdx]);
      }
    }
    
    // Calculate overall confidence based on how close the pose is to target
    const confidence = Math.min(95, 100 - (recommendations.length * 5));
    
    return [{
      pose: currentPose.name,
      recommendation: recommendations,
      confidence,
      score: Math.round(confidence * 0.9 + (Math.random() * 10)) // Add some randomness to score
    }];
  };
  
  // Simulate body metrics analysis
  const analyzeBodyMetrics = (): BodyAnalysisResult['metrics'] => {
    // In a real app, this would use actual data from sensors or images
    const symmetryScore = 92 - Math.random() * 5; // Random score between 87-92
    const postureGrade = 85 + Math.random() * 10; // Random grade between 85-95
    
    return {
      bodyFatEstimate: mockMetrics.bodyFat,
      muscleGroups: {
        chest: "dominant",
        arms: "symmetrical",
        legs: "moderate"
      },
      symmetryScore,
      postureGrade
    };
  };
  
  // Run analysis when component mounts
  useEffect(() => {
    const runAnalysis = () => {
      try {
        // Simulate getting pose data from landmarks
        const simulatedLandmarks = {}; // Would be real landmarks in production
        const currentPose = detectPose(simulatedLandmarks);
        
        // Generate recommendations
        const recommendations = generateRecommendations(currentPose);
        
        // Analyze body metrics
        const metrics = analyzeBodyMetrics();
        
        // Set analysis result
        setAnalysis({
          currentPose,
          recommendations,
          metrics,
          timestamp: new Date()
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error running AI analysis:', err);
        setError('Failed to run body analysis');
        setLoading(false);
      }
    };
    
    runAnalysis();
  }, []);
  
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Sparkles className="h-6 w-6 text-purple-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">AI Analysis</h2>
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mb-4"></div>
          <p className="text-gray-600">Analyzing your physique...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Sparkles className="h-6 w-6 text-purple-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">AI Analysis</h2>
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center py-12 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-red-800 mb-2">Analysis Failed</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Sparkles className="h-6 w-6 text-purple-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-800">AI Analysis</h2>
        </div>
        <div className="text-sm text-gray-500">
         Updated: {analysis?.timestamp.toLocaleTimeString()}
       </div>
      </div>
      
      {/* Current Pose */}
      {analysis?.currentPose && (
        <div className="mb-6 p-4 bg-purple-50 rounded-lg">
          <div className="flex items-center mb-2">
            <Target className="h-5 w-5 text-purple-600 mr-2" />
            <h3 className="font-medium text-gray-800">Current Pose</h3>
          </div>
          <div className="pl-7">
            <p className="text-xl font-bold text-purple-800">{analysis.currentPose.name}</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {Object.entries(analysis.currentPose.angles).map(([angleName, value]) => (
                <div key={angleName} className="bg-white p-2 rounded-md shadow-sm">
                  <span className="text-sm text-gray-500 capitalize">
                    {angleName.replace(/([A-Z])/g, ' $1')}
                  </span>
                  <p className="font-medium">{value.toFixed(1)}°</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Coaching Recommendations */}
      {analysis && analysis.recommendations.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <Trophy className="h-5 w-5 text-amber-600 mr-2" />
            <h3 className="font-medium text-gray-800">Coaching Recommendations</h3>
          </div>
          <div className="pl-7 space-y-3">
            {analysis?.recommendations.map((rec, idx) => (
              <div key={idx} className="bg-gradient-to-r from-amber-50 to-amber-100 p-3 rounded-md border-l-4 border-amber-500">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-amber-800">{rec.pose}</span>
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500 mr-1">Confidence:</span>
                    <span className="font-medium text-amber-700">{rec.confidence}%</span>
                  </div>
                </div>
                <ul className="space-y-1">
                  {rec.recommendation.map((item, itemIdx) => (
                    <li key={itemIdx} className="text-sm text-amber-800 pl-3 relative">
                      <span className="absolute left-0 top-0.5 w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
                      {item}
                    </li>
                  ))}
                </ul>
                {rec.score !== undefined && (
                  <div className="mt-2 flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-amber-500 h-2 rounded-full"
                        style={{ width: `${rec.score}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">Performance: {rec.score}/100</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Combined Metrics & Pose Analysis */}
      <div>
        <div className="flex items-center mb-2">
          <BarChart3 className="h-5 w-5 text-blue-600 mr-2" />
          <h3 className="font-medium text-gray-800">Combined Metrics & Pose Analysis</h3>
        </div>
        <div className="pl-7 grid grid-cols-2 gap-4">
          {/* Body Fat & Muscle Balance */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Physique Assessment</h4>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Body Fat</span>
                  <span className="text-sm font-medium">{analysis?.metrics.bodyFatEstimate ?? 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-blue-500 h-1.5 rounded-full"
                    style={{ width: `${analysis?.metrics.bodyFatEstimate ?? 0}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-600">Muscle Groups</span>
                <div className="mt-1 space-y-1">
                  {Object.entries(analysis?.metrics.muscleGroups || {}).map(([group, status], idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="capitalize">{group}</span>
                      <span className="font-medium text-blue-700">{status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Symmetry & Posture */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Posture & Symmetry</h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Symmetry Score</span>
                  <span className="text-sm font-medium">{(analysis?.metrics.symmetryScore ?? 0).toFixed(1)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full ${
                      (analysis?.metrics.symmetryScore ?? 0) > 90 ? 'bg-green-500' :
                      (analysis?.metrics.symmetryScore ?? 0) > 80 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${analysis?.metrics.symmetryScore ?? 0}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Posture Grade</span>
                  <span className="text-sm font-medium">{(analysis?.metrics.postureGrade ?? 0).toFixed(1)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full ${
                      (analysis?.metrics.postureGrade ?? 0) > 90 ? 'bg-green-500' :
                      (analysis?.metrics.postureGrade ?? 0) > 80 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${analysis?.metrics.postureGrade ?? 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Pose Boost Tips */}
        <div className="mt-6">
          <div className="flex items-center mb-2">
            <Clock className="h-5 w-5 text-emerald-600 mr-2" />
            <h3 className="font-medium text-gray-800">Pose Boost Tips</h3>
          </div>
          <div className="pl-7">
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="inline-block w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs mr-2 mt-0.5">1</span>
                <span className="text-sm text-gray-700">Twist torso 4° more for better separation</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs mr-2 mt-0.5">2</span>
                <span className="text-sm text-gray-700">Raise shoulder for better delts visibility</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs mr-2 mt-0.5">3</span>
                <span className="text-sm text-gray-700">Contract glute to improve lower back posture</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysis;