import React, { useState } from 'react';
import { Info, Zap, Award, TrendingUp } from 'lucide-react';
import { usePhysique } from '../context/PhysiqueContext';

interface BodyAnalysisProps {
  metrics: {
    height: number;
    weight: number;
    bodyFat: number;
    muscleMass: number;
  };
}

const BodyAnalysis: React.FC<BodyAnalysisProps> = ({ metrics }) => {
  const { analyzeImage, isLoading } = usePhysique();
  const [dragActive, setDragActive] = useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      analyzeImage(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      analyzeImage(e.dataTransfer.files[0]);
    }
  };

  // Calculate BMI
  const heightInMeters = metrics.height / 100;
  const bmi = metrics.weight / (heightInMeters * heightInMeters);
  
  // Determine body type based on body fat and muscle mass
  const getBodyType = () => {
    if (metrics.bodyFat < 15 && metrics.muscleMass > 40) return 'Athletic';
    if (metrics.bodyFat < 20 && metrics.muscleMass > 35) return 'Fit';
    if (metrics.bodyFat > 30) return 'Endomorph';
    if (metrics.muscleMass < 30 && metrics.bodyFat < 20) return 'Ectomorph';
    return 'Mesomorph';
  };
  
  // Calculate recommended body fat
  const getRecommendedBodyFat = () => {
    // Based on general health guidelines
    if (metrics.bodyFat < 5) return 'Current body fat is very low. Consider maintaining or slightly increasing for health.';
    if (metrics.bodyFat < 15) return 'Excellent range for athletic performance.';
    if (metrics.bodyFat < 25) return 'Healthy range. Slight reduction could improve fitness.';
    return 'Consider reducing body fat percentage for health benefits.';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center mb-4">
        <Zap className="h-6 w-6 text-blue-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-800">AI Body Analysis</h2>
      </div>
      
      {/* Image Upload Section */}
      <div 
        className={`border-2 border-dashed rounded-lg p-6 mb-6 transition-colors ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="image-upload"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <label htmlFor="image-upload" className="cursor-pointer">
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
            {isLoading ? (
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            ) : (
              <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>
            )}
            <p className="text-sm text-gray-500 mb-1">
              {isLoading ? 'Analyzing image...' : 'Drag & drop an image here or click to upload'}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Supported formats: JPG, PNG
            </p>
          </div>
        </label>
      </div>
      
      {/* Analysis Results */}
      {!isLoading && (
        <>
          <div className="space-y-6">
            <div className="rounded-lg border border-gray-200 p-4 bg-blue-50">
              <div className="flex items-start">
                <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                  <Award className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <h3 className="font-medium text-gray-900">Body Type</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    <span className="text-lg font-semibold text-blue-800">{getBodyType()}</span>
                  </p>
                  <p className="mt-2 text-xs text-gray-500">
                    Based on your body fat percentage and muscle mass
                  </p>
                </div>
              </div>
            </div>
            
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="flex items-start">
                <div className="p-2 bg-green-100 rounded-full text-green-600">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <h3 className="font-medium text-gray-900">BMI Analysis</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Your BMI: <span className="font-semibold">{bmi.toFixed(1)}</span>
                  </p>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="h-1.5 rounded-full bg-green-500"
                      style={{ 
                        width: `${Math.min(100, (bmi / 40) * 100)}%`,
                        backgroundColor: bmi < 18.5 ? '#3B82F6' : 
                                          bmi < 25 ? '#10B981' : 
                                          bmi < 30 ? '#F59E0B' : '#EF4444'
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs mt-1 text-gray-500">
                    <span>Underweight</span>
                    <span>Normal</span>
                    <span>Overweight</span>
                    <span>Obese</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="flex items-start">
                <div className="p-2 bg-purple-100 rounded-full text-purple-600">
                  <Info className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <h3 className="font-medium text-gray-900">Body Composition Analysis</h3>
                  <div className="mt-3 space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Body Fat</span>
                        <span className="font-medium">{metrics.bodyFat}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-blue-600"
                          style={{ width: `${metrics.bodyFat}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Muscle Mass</span>
                        <span className="font-medium">{metrics.muscleMass}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-green-500"
                          style={{ width: `${metrics.muscleMass}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Other</span>
                        <span className="font-medium">{100 - metrics.bodyFat - metrics.muscleMass}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-gray-400"
                          style={{ width: `${100 - metrics.bodyFat - metrics.muscleMass}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="rounded-lg border border-gray-200 p-4">
              <h3 className="font-medium text-gray-900 mb-2">Recommendations</h3>
              <p className="text-sm text-gray-600 mb-3">
                {getRecommendedBodyFat()}
              </p>
              <p className="text-sm text-gray-600">
                {metrics.bodyFat > 25 ? 'Focus on cardiovascular exercise and strength training to reduce body fat.' : 
                 metrics.bodyFat < 10 ? 'Focus on maintaining muscle mass with adequate nutrition.' : 
                 'Continue balanced training with both strength and cardiovascular elements.'}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BodyAnalysis;