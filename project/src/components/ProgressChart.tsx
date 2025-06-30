import React from 'react';
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
import type { ProgressDataPoint } from '../types';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ProgressChartProps {
  data: ProgressDataPoint[];
}

const ProgressChart: React.FC<ProgressChartProps> = ({ data }) => {
  // Sort data by date
  const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Format dates for display
  const labels = sortedData.map(point => {
    const date = new Date(point.date);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });
  
  // Get weight data
  const weightData = sortedData.map(point => point.weight);
  
  // Get body fat data
  const bodyFatData = sortedData.map(point => point.bodyFat);
  
  // Find the best metrics (lowest weight and body fat)
  const bestWeight = Math.min(...weightData);
  const bestBodyFat = Math.min(...bodyFatData);
  
  // Find current metrics (last data point)
  const currentWeight = weightData[weightData.length - 1];
  const currentBodyFat = bodyFatData[bodyFatData.length - 1];
  
  // Calculate progress percentages
  const weightProgress = Math.round(100 - ((currentWeight - bestWeight) / (currentWeight - bestWeight)) * 100);
  const bodyFatProgress = Math.round(100 - ((currentBodyFat - bestBodyFat) / (currentBodyFat - bestBodyFat)) * 100);
  
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Weight (kg)',
        data: weightData,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        yAxisID: 'y',
      },
      {
        label: 'Body Fat (%)',
        data: bodyFatData,
        borderColor: 'rgb(249, 115, 22)',
        backgroundColor: 'rgba(249, 115, 22, 0.5)',
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: 'rgb(249, 115, 22)',
        yAxisID: 'y1',
      },
    ],
  };
  
  const options = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${context.raw} ${context.dataset.yAxisID === 'y' ? 'kg' : '%'}`;
          }
        }
      }
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Weight (kg)'
        }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Body Fat (%)'
        },
        // grid line settings
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center mb-6">
        <svg className="h-6 w-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
        </svg>
        <h2 className="text-xl font-semibold text-gray-800">Progress Timeline</h2>
      </div>
      
      {/* Progress Summary */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-600 mb-1">Weight Progress</h3>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-blue-600">{weightProgress}%</span>
            <span className="ml-2 text-sm text-gray-500">of goal achieved</span>
          </div>
          <div className="mt-2 text-sm">
            Current: <span className="font-medium">{currentWeight} kg</span> | 
            Best: <span className="font-medium">{bestWeight} kg</span>
          </div>
        </div>
        
        <div className="bg-yellow-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-600 mb-1">Body Fat Progress</h3>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-yellow-600">{bodyFatProgress}%</span>
            <span className="ml-2 text-sm text-gray-500">of goal achieved</span>
          </div>
          <div className="mt-2 text-sm">
            Current: <span className="font-medium">{currentBodyFat}%</span> | 
            Best: <span className="font-medium">{bestBodyFat}%</span>
          </div>
        </div>
      </div>
      
      {/* Chart Container */}
      <div className="h-72">
        <Line data={chartData} options={options} />
      </div>
      
      {/* Legend */}
      <div className="flex justify-center space-x-6 mt-4">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
          <span className="text-xs text-gray-600">Weight (kg)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
          <span className="text-xs text-gray-600">Body Fat (%)</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressChart;