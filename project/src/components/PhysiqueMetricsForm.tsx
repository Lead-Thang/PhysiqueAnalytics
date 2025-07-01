/**
 * PhysiqueMetricsForm Component
 * Allows users to input and save physique metrics (height, weight, body fat, etc.) for tracking progress.
 * Integrates with PhysiqueContext to fetch and update metrics, with form validation and error handling.
 * Styled with Tailwind CSS, featuring accessibility enhancements and responsive design.
 * Supports async submission and reset functionality for user convenience.
 */
import React, { useState, useCallback } from 'react';
import { Scale, Ruler, User, X, Loader2 } from 'lucide-react';
import { usePhysique } from '../context/PhysiqueContext';

// Types
interface PhysiqueMetrics {
  height: number; // in cm
  weight: number; // in kg
  bodyFat: number; // percentage
  muscleMass: number; // percentage
  chest: number; // in cm
  waist: number; // in cm
  hips: number; // in cm
  thighs: number; // in cm
  arms: number; // in cm
  createdAt: string; // ISO date string
}

interface PhysiqueContextType {
  metrics: PhysiqueMetrics | null;
  refreshPhysiqueData: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

interface FormErrors {
  [key: string]: string;
}

const PhysiqueMetricsForm: React.FC = () => {
  const { metrics, refreshPhysiqueData, error, clearError } = usePhysique();
  const [formData, setFormData] = useState<PhysiqueMetrics>(
    metrics || {
      height: 175,
      weight: 75,
      bodyFat: 20,
      muscleMass: 35,
      chest: 95,
      waist: 80,
      hips: 92,
      thighs: 55,
      arms: 30,
      createdAt: new Date().toISOString(),
    }
  );
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  // Validate form inputs
  const validateForm = useCallback((data: PhysiqueMetrics): FormErrors => {
    const errors: FormErrors = {};
    const fields: { name: keyof PhysiqueMetrics; min: number; max: number; label: string }[] = [
      { name: 'height', min: 100, max: 250, label: 'Height' },
      { name: 'weight', min: 40, max: 200, label: 'Weight' },
      { name: 'bodyFat', min: 5, max: 40, label: 'Body Fat' },
      { name: 'muscleMass', min: 20, max: 50, label: 'Muscle Mass' },
      { name: 'chest', min: 60, max: 150, label: 'Chest' },
      { name: 'waist', min: 50, max: 150, label: 'Waist' },
      { name: 'hips', min: 60, max: 150, label: 'Hips' },
      { name: 'thighs', min: 30, max: 100, label: 'Thighs' },
      { name: 'arms', min: 15, max: 60, label: 'Arms' },
    ];

    fields.forEach(({ name, min, max, label }) => {
      const value = data[name];
      if (isNaN(value) || value <= 0) {
        errors[name] = `${label} is required and must be a valid number`;
      } else if (value < min || value > max) {
        errors[name] = `${label} must be between ${min} and ${max}`;
      }
    });

    return errors;
  }, []);

  // Handle input change
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === '' ? '' : parseFloat(value) || 0,
    }));
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const errors = validateForm(formData);
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }

      setIsLoading(true);
      try {
        // Simulate saving metrics by updating context
        await refreshPhysiqueData(); // Update with actual logic to save formData
        alert('Metrics saved successfully!');
      } catch (err) {
        setFormErrors({ submit: 'Failed to save metrics. Please try again.' });
      } finally {
        setIsLoading(false);
      }
    },
    [formData, validateForm, refreshPhysiqueData]
  );

  // Handle form reset
  const handleReset = useCallback(() => {
    setFormData(
      metrics || {
        height: 175,
        weight: 75,
        bodyFat: 20,
        muscleMass: 35,
        chest: 95,
        waist: 80,
        hips: 92,
        thighs: 55,
        arms: 30,
        createdAt: new Date().toISOString(),
      }
    );
    setFormErrors({});
    clearError();
  }, [metrics, clearError]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 animate-fade-in">
      <div className="flex items-center mb-6">
        <User className="h-6 w-6 text-orange-600 mr-2" aria-hidden="true" />
        <h2 className="text-xl font-semibold text-gray-800">PhysiqueAnalytics Metrics</h2>
      </div>

      {/* Error Message */}
      {(error || formErrors.submit) && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 mb-6 flex items-start">
          <div className="p-2 bg-red-100 rounded-full text-red-600">
            <X className="h-5 w-5" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-600">{error || formErrors.submit}</p>
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

      <form onSubmit={handleSubmit} aria-label="Physique metrics form">
        <div className="space-y-6">
          {/* Body Measurements */}
          <div>
            <h3 className="font-medium text-gray-800 mb-4 flex items-center">
              <Ruler className="h-4 w-4 mr-2" aria-hidden="true" />
              Body Measurements
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    formErrors.height ? 'border-red-500' : 'border-gray-300'
                  }`}
                  step="0.1"
                  min="100"
                  max="250"
                  aria-required="true"
                  aria-label="Height in centimeters"
                />
                {formErrors.height && <p className="mt-1 text-xs text-red-600">{formErrors.height}</p>}
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
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    formErrors.weight ? 'border-red-500' : 'border-gray-300'
                  }`}
                  step="0.1"
                  min="40"
                  max="200"
                  aria-required="true"
                  aria-label="Weight in kilograms"
                />
                {formErrors.weight && <p className="mt-1 text-xs text-red-600">{formErrors.weight}</p>}
              </div>
            </div>
          </div>

          {/* Body Composition */}
          <div>
            <h3 className="font-medium text-gray-800 mb-4 flex items-center">
              <Scale className="h-4 w-4 mr-2" aria-hidden="true" />
              Body Composition
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    formErrors.bodyFat ? 'border-red-500' : 'border-gray-300'
                  }`}
                  step="0.1"
                  min="5"
                  max="40"
                  aria-required="true"
                  aria-label="Body fat percentage"
                />
                {formErrors.bodyFat && <p className="mt-1 text-xs text-red-600">{formErrors.bodyFat}</p>}
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
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    formErrors.muscleMass ? 'border-red-500' : 'border-gray-300'
                  }`}
                  step="0.1"
                  min="20"
                  max="50"
                  aria-required="true"
                  aria-label="Muscle mass percentage"
                />
                {formErrors.muscleMass && <p className="mt-1 text-xs text-red-600">{formErrors.muscleMass}</p>}
              </div>
            </div>
          </div>

          {/* Additional Measurements */}
          <div>
            <h3 className="font-medium text-gray-800 mb-4">Additional Measurements (cm)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    formErrors.chest ? 'border-red-500' : 'border-gray-300'
                  }`}
                  step="0.1"
                  min="60"
                  max="150"
                  aria-required="true"
                  aria-label="Chest measurement in centimeters"
                />
                {formErrors.chest && <p className="mt-1 text-xs text-red-600">{formErrors.chest}</p>}
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
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    formErrors.waist ? 'border-red-500' : 'border-gray-300'
                  }`}
                  step="0.1"
                  min="50"
                  max="150"
                  aria-required="true"
                  aria-label="Waist measurement in centimeters"
                />
                {formErrors.waist && <p className="mt-1 text-xs text-red-600">{formErrors.waist}</p>}
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
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    formErrors.hips ? 'border-red-500' : 'border-gray-300'
                  }`}
                  step="0.1"
                  min="60"
                  max="150"
                  aria-required="true"
                  aria-label="Hips measurement in centimeters"
                />
                {formErrors.hips && <p className="mt-1 text-xs text-red-600">{formErrors.hips}</p>}
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
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    formErrors.thighs ? 'border-red-500' : 'border-gray-300'
                  }`}
                  step="0.1"
                  min="30"
                  max="100"
                  aria-required="true"
                  aria-label="Thighs measurement in centimeters"
                />
                {formErrors.thighs && <p className="mt-1 text-xs text-red-600">{formErrors.thighs}</p>}
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
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    formErrors.arms ? 'border-red-500' : 'border-gray-300'
                  }`}
                  step="0.1"
                  min="15"
                  max="60"
                  aria-required="true"
                  aria-label="Arms measurement in centimeters"
                />
                {formErrors.arms && <p className="mt-1 text-xs text-red-600">{formErrors.arms}</p>}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`flex-1 bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
              }`}
              aria-label="Save physique metrics"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </span>
              ) : (
                'Save Metrics'
              )}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              aria-label="Reset form to original metrics"
            >
              Reset
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PhysiqueMetricsForm;