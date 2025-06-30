import React from 'react';
import { Dumbbell, Shield, FileWarning as Running, Coffee } from 'lucide-react';
import type { PhysiqueGoal, PhysiqueTemplate } from '../types';

const physiqueTemplates: Record<PhysiqueGoal, PhysiqueTemplate> = {
  "dadbod-deluxe": {
    id: "dadbod-deluxe",
    title: "Dadbod Deluxe",
    icon: "Coffee",
    description: "Comfortable, sustainable fitness with balanced strength and flexibility.",
    targetMetrics: {
      bodyFat: 20,
      muscleMass: 35,
      shoulderToWaist: 1.4
    },
    trainingFocus: [
      "Functional strength",
      "Core stability",
      "Work-life balance"
    ]
  },
  "bodybuilder-beast": {
    id: "bodybuilder-beast",
    title: "Bodybuilder Beast",
    icon: "Dumbbell",
    description: "Maximum muscle mass with aesthetic proportions and definition.",
    targetMetrics: {
      bodyFat: 8,
      muscleMass: 45,
      shoulderToWaist: 1.8
    },
    trainingFocus: [
      "Hypertrophy",
      "Symmetry",
      "Peak conditioning"
    ]
  },
  "athletic-shred": {
    id: "athletic-shred",
    title: "Athletic Shred",
    icon: "Running",
    description: "Lean, explosive athleticism with functional muscle.",
    targetMetrics: {
      bodyFat: 12,
      muscleMass: 40,
      shoulderToWaist: 1.6
    },
    trainingFocus: [
      "Speed",
      "Agility",
      "Endurance"
    ]
  },
  "strongman-tank": {
    id: "strongman-tank",
    title: "Strongman Tank",
    icon: "Shield",
    description: "Raw power and dense muscle mass with imposing presence.",
    targetMetrics: {
      bodyFat: 15,
      muscleMass: 50,
      shoulderToWaist: 1.7
    },
    trainingFocus: [
      "Maximum strength",
      "Power",
      "Structural balance"
    ]
  }
};

const IconComponent = {
  Coffee,
  Dumbbell,
  Running,
  Shield
};

interface PhysiqueGoalSelectorProps {
  selectedGoal: PhysiqueGoal | null;
  onSelectGoal: (goal: PhysiqueGoal) => void;
}

const PhysiqueGoalSelector: React.FC<PhysiqueGoalSelectorProps> = ({
  selectedGoal,
  onSelectGoal
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Choose Your Physique Goal</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(Object.keys(physiqueTemplates) as PhysiqueGoal[]).map((goalId) => {
          const template = physiqueTemplates[goalId];
          const Icon = IconComponent[template.icon as keyof typeof IconComponent];
          
          return (
            <button
              key={goalId}
              onClick={() => onSelectGoal(goalId)}
              className={`
                p-4 rounded-lg border-2 transition-all duration-200
                ${selectedGoal === goalId 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }
              `}
            >
              <div className="flex items-center mb-2">
                <div className={`
                  p-2 rounded-full mr-3
                  ${selectedGoal === goalId ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}
                `}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">{template.title}</h3>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{template.description}</p>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Target Body Fat</span>
                  <span className="font-medium">{template.targetMetrics.bodyFat}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Target Muscle Mass</span>
                  <span className="font-medium">{template.targetMetrics.muscleMass}%</span>
                </div>
              </div>
              
              <div className="mt-3 flex flex-wrap gap-2">
                {template.trainingFocus.map((focus, index) => (
                  <span
                    key={index}
                    className={`
                      px-2 py-1 rounded-full text-xs font-medium
                      ${selectedGoal === goalId 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-gray-100 text-gray-600'
                      }
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
  );
};

export default PhysiqueGoalSelector;