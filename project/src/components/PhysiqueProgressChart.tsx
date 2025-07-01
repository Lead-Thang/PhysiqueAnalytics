/**
 * PhysiqueProgressChart Component
 * Visualizes physique progress (weight, body fat, muscle mass) over time using a line chart.
 * Integrates with PhysiqueContext to fetch historical metrics, styled with Tailwind CSS.
 * Features accessibility enhancements, error handling, and dataset toggles for user control.
 * Built with Chart.js for responsive charting and React for state management.
 */
import React, { useState, useCallback } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { X } from 'lucide-react';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Types
interface ProgressDataPoint {
  date: string; // ISO date string (e.g., "2025-07-01")
  weight: number; // in kg
  bodyFat: number; // percentage
  muscleMass: number; // percentage
}

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
}

interface PhysiqueContextType {
  currentMetrics: PhysiqueMetrics | null;
  progressData: ProgressDataPoint[];
  refreshPhysiqueData: () => Promise<void>;
}

// Mock usePhysique hook (replace with actual implementation)
const usePhysique = (): PhysiqueContextType => {
  return {
    currentMetrics: {
      height: 175,
      weight: 75,
      bodyFat: 20,
      muscleMass: 35,
      chest: 95,
      waist: 80,
      hips: 92,
      thighs: 55,
      arms: 30,
    },
    progressData: [
      { date: '2025-06-01', weight: 78, bodyFat: 22, muscleMass: 33 },
      { date: '2025-06-10', weight: 77, bodyFat: 21, muscleMass: 34 },
      { date: '2025-06-20', weight: 76, bodyFat: 20.5, muscleMass: 34.5 },
      { date: '2025-07-01', weight: 75, bodyFat: 20, muscleMass: 35 },
    ],
    refreshPhysiqueData: async () => {},
  };
};

const PhysiqueProgressChart: React.FC = () => {
  const { progressData } = usePhysique();
  const [error, setError] = useState<string | null>(null);
  const [showWeight, setShowWeight] = useState(true);
  const [showBodyFat, setShowBodyFat] = useState(true);
  const [showMuscleMass, setShowMuscleMass] = useState(true);

  // Validate data
  const validateData = useCallback((data: ProgressDataPoint[]): boolean => {
    return data.length > 0 && data.every((point) => {
      const requiredFields = ['date', 'weight', 'bodyFat', 'muscleMass'];
      return requiredFields.every((field) => point[field as keyof ProgressDataPoint] !== undefined && !isNaN(point[field as keyof ProgressDataPoint]));
    });
  }, []);

  if (!validateData(progressData)) {
    setError('No valid progress data available. Please add measurements to view your progress.');
  }

  // Sort data by date
  const sortedData = [...progressData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Format dates for display
  const labels = sortedData.map((point) => {
    const date = new Date(point.date);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });

  // Get metric data
  const weightData = sortedData.map((point) => point.weight);
  const bodyFatData = sortedData.map((point) => point.bodyFat);
  const muscleMassData = sortedData.map((point) => point.muscleMass);

  // Find best and current metrics
  const bestWeight = Math.min(...weightData);
  const bestBodyFat = Math.min(...bodyFatData);
  const bestMuscleMass = Math.max(...muscleMassData); // Higher muscle mass is better
  const currentWeight = weightData[weightData.length - 1] || bestWeight;
  const currentBodyFat = bodyFatData[bodyFatData.length - 1] || bestBodyFat;
  const currentMuscleMass = muscleMassData[muscleMassData.length - 1] || bestMuscleMass;

  // Calculate progress percentages
  const weightProgress = weightData.length > 1 ? Math.round(((bestWeight - currentWeight) / (bestWeight - weightData[0])) * 100) || 100 : 100;
  const bodyFatProgress = bodyFatData.length > 1 ? Math.round(((bestBodyFat - currentBodyFat) / (bestBodyFat - bodyFatData[0])) * 100) || 100 : 100;
  const muscleMassProgress = muscleMassData.length > 1 ? Math.round(((currentMuscleMass - muscleMassData[0]) / (bestMuscleMass - muscleMassData[0])) * 100) || 100 : 100;

  // Chart data
  const chartData = {
    labels,
    datasets: [
      showWeight && {
        label: 'Weight (kg)',
        data: weightData,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        yAxisID: 'y',
      },
      showBodyFat && {
        label: 'Body Fat (%)',
        data: bodyFatData,
        borderColor: 'rgb(249, 115, 22)',
        backgroundColor: 'rgba(249, 115, 22, 0.5)',
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: 'rgb(249, 115, 22)',
        yAxisID: 'y1',
      },
      showMuscleMass && {
        label: 'Muscle Mass (%)',
        data: muscleMassData,
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: 'rgb(16, 185, 129)',
        yAxisID: 'y2',
      },
    ].filter(Boolean) as any[],
  };

  // Chart options
  const options = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const unit = context.dataset.yAxisID === 'y' ? 'kg' : '%';
            return `${context.dataset.label}: ${context.raw}${unit}`;
          },
        },
      },
      legend: {
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: showWeight,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Weight (kg)',
        },
      },
      y1: {
        type: 'linear' as const,
        display: showBodyFat,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Body Fat (%)',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
      y2: {
        type: 'linear' as const,
        display: showMuscleMass,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Muscle Mass (%)',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 animate-fade-in">
      <div className="flex items-center mb-6">
        <svg
          className="h-6 w-6 text-blue-600 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        <h2 className="text-xl font-semibold text-gray-800">PhysiqueAnalytics Progress Timeline</h2>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 mb-6 flex items-start">
          <div className="p-2 bg-red-100 rounded-full text-red-600">
            <X className="h-5 w-5" />
          </div>
          <div className="ml-3">
            <p className="textamian-sm text-red-600">{error}</p>
            <button
              className="mt-2 text-xs text-red-500 hover:underline"
              onClick={() => setError(null)}
              aria-label="Dismiss error"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Dataset Toggles */}
      {!error && (
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="show-weight"
              checked={showWeight}
              onChange={(e) => setShowWeight(e.target.checked)}
              className="mr-2 focus:ring-blue-500"
              aria-label="Toggle weight data display"
            />
            <label htmlFor="show-weight" className="text-sm text-gray-700">
              Weight
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="show-body-fat"
              checked={showBodyFat}
              onChange={(e) => setShowBodyFat(e.target.checked)}
              className="mr-2 focus:ring-blue-500"
              aria-label="Toggle body fat data display"
            />
            <label htmlFor="show-body-fat" className="text-sm text-gray-700">
              Body Fat
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="show-muscle-mass"
              checked={showMuscleMass}
              onChange={(e) => setShowMuscleMass(e.target.checked)}
              className="mr-2 focus:ring-blue-500"
              aria-label="Toggle muscle mass data display"
            />
            <label htmlFor="show-muscle-mass" className="text-sm text-gray-700">
              Muscle Mass
            </label>
          </div>
        </div>
      )}

      {/* Progress Summary */}
      {!error && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-600 mb-1">Weight Progress</h3>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold text-blue-600">{weightProgress}%</span>
              <span className="ml-2 text-sm text-gray-500">of goal achieved</span>
            </div>
            <div className="mt-2 text-sm">
              Current: <span className="font-medium">{currentWeight} kg</span> | Best:{' '}
              <span className="font-medium">{bestWeight} kg</span>
            </div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-600 mb-1">Body Fat Progress</h3>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold text-yellow-600">{bodyFatProgress}%</span>
              <span className="ml-2 text-sm text-gray-500">of goal achieved</span>
            </div>
            <div className="mt-2 text-sm">
              Current: <span className="font-medium">{currentBodyFat}%</span> | Best:{' '}
              <span className="font-medium">{bestBodyFat}%</span>
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-600 mb-1">Muscle Mass Progress</h3>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold text-green-600">{muscleMassProgress}%</span>
              <span className="ml-2 text-sm text-gray-500">of goal achieved</span>
            </div>
            <div className="mt-2 text-sm">
              Current: <span className="font-medium">{currentMuscleMass}%</span> | Best:{' '}
              <span className="font-medium">{bestMuscleMass}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Chart Container */}
      {!error && (
        <div className="h-72" role="region" aria-label="Physique progress chart">
          <Line data={chartData} options={options} />
        </div>
      )}

      {/* Legend */}
      {!error && (
        <div className="flex justify-center space-x-6 mt-4">
          {showWeight && (
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2" />
              <span className="text-xs text-gray-600">Weight (kg)</span>
            </div>
          )}
          {showBodyFat && (
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-amber-500 mr-2" />
              <span className="text-xs text-gray-600">Body Fat (%)</span>
            </div>
          )}
          {showMuscleMass && (
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2" />
              <span className="text-xs text-gray-600">Muscle Mass (%)</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PhysiqueProgressChart;