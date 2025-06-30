import React, { useState } from 'react';
import { Scale, Ruler, User } from 'lucide-react';
import type { UserMetrics } from '../types';

interface MetricsFormProps {
  metrics: UserMetrics;
}

const MetricsForm: React.FC<MetricsFormProps> = ({ metrics }) => {
  const [formData, setFormData] = useState<UserMetrics>(metrics);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save the updated metrics
    console.log('Saving metrics:', formData);
    alert('Metrics saved successfully!');
  };
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center mb-6">
        <User className="h-6 w-6 text-orange-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-800">Current Metrics</h2>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Body Measurements */}
          <div>
            <h3 className="font-medium text-gray-800 mb-4 flex items-center">
              <Ruler className="h-4 w-4 mr-2" />
              Body Measurements
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
                  Height (cm)
                </label>
                <input
                  type="number"
                  id="height"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  step="0.1"
                  min="100"
                  max="250"
                />
              </div>
              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  step="0.1"
                  min="40"
                  max="200"
                />
              </div>
            </div>
          </div>
          
          {/* Body Composition */}
          <div>
            <h3 className="font-medium text-gray-800 mb-4 flex items-center">
              <Scale className="h-4 w-4 mr-2" />
              Body Composition
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="bodyFat" className="block text-sm font-medium text-gray-700 mb-1">
                  Body Fat (%)
                </label>
                <input
                  type="number"
                  id="bodyFat"
                  name="bodyFat"
                  value={formData.bodyFat}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  step="0.1"
                  min="5"
                  max="40"
                />
              </div>
              <div>
                <label htmlFor="muscleMass" className="block text-sm font-medium text-gray-700 mb-1">
                  Muscle Mass (%)
                </label>
                <input
                  type="number"
                  id="muscleMass"
                  name="muscleMass"
                  value={formData.muscleMass}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  step="0.1"
                  min="20"
                  max="50"
                />
              </div>
            </div>
          </div>
          
          {/* Additional Measurements */}
          <div>
            <h3 className="font-medium text-gray-800 mb-4">Additional Measurements (cm)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="chest" className="block text-sm font-medium text-gray-700 mb-1">
                  Chest
                </label>
                <input
                  type="number"
                  id="chest"
                  name="chest"
                  value={formData.chest}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  step="0.1"
                  min="60"
                  max="150"
                />
              </div>
              <div>
                <label htmlFor="waist" className="block text-sm font-medium text-gray-700 mb-1">
                  Waist
                </label>
                <input
                  type="number"
                  id="waist"
                  name="waist"
                  value={formData.waist}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  step="0.1"
                  min="50"
                  max="150"
                />
              </div>
              <div>
                <label htmlFor="hips" className="block text-sm font-medium text-gray-700 mb-1">
                  Hips
                </label>
                <input
                  type="number"
                  id="hips"
                  name="hips"
                  value={formData.hips}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  step="0.1"
                  min="60"
                  max="150"
                />
              </div>
              <div>
                <label htmlFor="thighs" className="block text-sm font-medium text-gray-700 mb-1">
                  Thighs
                </label>
                <input
                  type="number"
                  id="thighs"
                  name="thighs"
                  value={formData.thighs}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  step="0.1"
                  min="30"
                  max="100"
                />
              </div>
              <div>
                <label htmlFor="arms" className="block text-sm font-medium text-gray-700 mb-1">
                  Arms
                </label>
                <input
                  type="number"
                  id="arms"
                  name="arms"
                  value={formData.arms}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  step="0.1"
                  min="15"
                  max="60"
                />
              </div>
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Save Metrics
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MetricsForm;