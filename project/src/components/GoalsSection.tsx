import React, { useState } from 'react';
import { Target, CheckCircle, Clock } from 'lucide-react';
import type { PhysiqueGoal } from '../types';
import { usePhysique } from '../context/PhysiqueContext';

const physiqueTemplates: Record<PhysiqueGoal, { title: string; description: string; targetMetrics: { bodyFat: number; muscleMass: number }; trainingFocus: string[] }> = {
  "dadbod-deluxe": {
    title: "Dad Bod Deluxe",
    description: "A relaxed, approachable physique with moderate muscle and healthy body fat",
    targetMetrics: {
      bodyFat: 22,
      muscleMass: 34
    },
    trainingFocus: ["Compound lifts", "Moderate cardio", "Core strength"]
  },
  "bodybuilder-beast": {
    title: "Bodybuilder Beast",
    description: "Stage-ready muscularity with low body fat for maximum definition",
    targetMetrics: {
      bodyFat: 10,
      muscleMass: 45
    },
    trainingFocus: ["Hypertrophy training", "Strict dieting", "Pose practice"]
  },
  "athletic-shred": {
    title: "Athletic Shred",
    description: "Lean and functional with excellent muscle balance for sports performance",
    targetMetrics: {
      bodyFat: 12,
      muscleMass: 40
    },
    trainingFocus: ["Functional training", "HIIT cardio", "Mobility work"]
  },
  "strongman-tank": {
    title: "Strongman Tank",
    description: "Powerful build optimized for maximal strength and endurance",
    targetMetrics: {
      bodyFat: 18,
      muscleMass: 42
    },
    trainingFocus: ["Max strength training", "Grip work", "Work capacity"]
  }
};

const GoalsSection: React.FC = () => {
  const { targetPhysique, updateTargetPhysique } = usePhysique();
  const [activeTab, setActiveTab] = useState<'select' | 'plan'>('select');
  
  // Mock current metrics - in a real app these would come from context or API
  const currentMetrics = {
    bodyFat: 20.2,
    muscleMass: 36.5
  };
  
  // Calculate progress towards goal (mock data)
  const getProgressPercentage = (current: number, target: number) => {
    if (current > target) return 100;
    return Math.round((current / target) * 100);
  };
  
  // Get timeline estimate (mock data)
  const getTimelineEstimate = (current: number, target: number) => {
    const difference = target - current;
    if (difference <= 0) return "Already achieved!";
    
    // Rough estimate based on healthy progression rates
    const months = Math.ceil(difference / (targetPhysique === 'bodybuilder-beast' ? 0.5 : 1));
    return `${months} month${months !== 1 ? 's' : ''}`;
  };
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center mb-6">
        <Target className="h-6 w-6 text-red-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-800">Fitness Goals</h2>
      </div>
      
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-4">
          <button
            onClick={() => setActiveTab('select')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'select'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Select Goal
          </button>
          <button
            onClick={() => setActiveTab('plan')}
            disabled={!targetPhysique}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'plan' && targetPhysique
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-400 cursor-not-allowed'
            }`}
          >
            Your Plan
          </button>
        </nav>
      </div>
      
      {/* Goal Selection Tab */}
      {activeTab === 'select' && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">
            Choose your desired physique goal to receive personalized recommendations.
          </p>
          
          <div className="grid grid-cols-1 gap-4">
            {Object.entries(physiqueTemplates).map(([key, template]) => (
              <div
                key={key}
                className={`rounded-lg border p-4 cursor-pointer transition-all hover:border-blue-300
                  ${targetPhysique === key
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:bg-gray-50'
                  }`}
                onClick={() => updateTargetPhysique(key as PhysiqueGoal)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-gray-800">{template.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                  </div>
                  {targetPhysique === key && (
                    <CheckCircle className="h-5 w-5 text-green-500 ml-2" />
                  )}
                </div>
                
                {/* Metrics Preview */}
                <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between">
                  <div className="text-xs">
                    <span className="text-gray-500">Fat:</span>
                    <span className="font-medium"> {template.targetMetrics.bodyFat}%</span>
                  </div>
                  <div className="text-xs">
                    <span className="text-gray-500">Muscle:</span>
                    <span className="font-medium"> {template.targetMetrics.muscleMass}%</span>
                  </div>
                  <div className="text-xs">
                    <span className="text-gray-500">Focus:</span>
                    <span className="font-medium"> {template.trainingFocus[0]}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Plan Overview Tab */}
      {activeTab === 'plan' && targetPhysique && (
        <div className="space-y-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-800 mb-2">Your Personalized Plan</h3>
            <p className="text-sm text-gray-600 mb-4">
              Based on your selected goal of {physiqueTemplates[targetPhysique].title}, here's what you need to focus on:
            </p>
            
            {/* Progress Overview */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Body Fat ({currentMetrics.bodyFat}% → {physiqueTemplates[targetPhysique].targetMetrics.bodyFat}%)</span>
                  <span>{getProgressPercentage(currentMetrics.bodyFat, physiqueTemplates[targetPhysique].targetMetrics.bodyFat)}% Complete</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${getProgressPercentage(currentMetrics.bodyFat, physiqueTemplates[targetPhysique].targetMetrics.bodyFat)}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Muscle Mass ({currentMetrics.muscleMass}% → {physiqueTemplates[targetPhysique].targetMetrics.muscleMass}%)</span>
                  <span>{getProgressPercentage(currentMetrics.muscleMass, physiqueTemplates[targetPhysique].targetMetrics.muscleMass)}% Complete</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${getProgressPercentage(currentMetrics.muscleMass, physiqueTemplates[targetPhysique].targetMetrics.muscleMass)}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            {/* Timeline Estimate */}
            <div className="mt-4 flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-1" />
              <span>Estimated timeline: {getTimelineEstimate(currentMetrics.bodyFat, physiqueTemplates[targetPhysique].targetMetrics.bodyFat)}</span>
            </div>
          </div>
          
          {/* Training Focus */}
          <div>
            <h4 className="font-medium text-gray-800 mb-3">Training Focus Areas</h4>
            <div className="grid grid-cols-3 gap-2">
              {physiqueTemplates[targetPhysique].trainingFocus.map((focus, index) => (
                <div key={index} className="bg-white rounded-md border border-gray-200 p-3 text-center">
                  <div className="font-medium text-gray-800 text-sm">{focus}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Recommendations */}
          <div>
            <h4 className="font-medium text-gray-800 mb-3">Personalized Recommendations</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                <span className="text-sm text-gray-600">Follow a structured workout plan focused on {physiqueTemplates[targetPhysique].trainingFocus[0]}</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                <span className="text-sm text-gray-600">Adjust nutrition to support both fat loss and muscle maintenance</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                <span className="text-sm text-gray-600">Track progress weekly and adjust intensity as needed</span>
              </li>
            </ul>
          </div>
        </div>
      )}
      
      {!targetPhysique && activeTab === 'plan' && (
        <div className="text-center py-8 text-gray-500">
          Please select a fitness goal first to see your personalized plan.
        </div>
      )}
    </div>
  );
};

export default GoalsSection;