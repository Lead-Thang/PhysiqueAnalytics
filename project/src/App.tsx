/**
 * App Component
 * Main entry point for the PhysiqueAnalytics application.
 * Sets up routing with React Router, wraps components in PhysiqueProvider and PhysiqueErrorBoundary,
 * and ensures consistency with data structures (PhysiqueMetrics, PhysiqueGoal, DashboardAIFeedback)
 * and styling (Tailwind CSS, Lucide icons) across components.
 */
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { PhysiqueProvider, usePhysique } from './context/PhysiqueContext';
import Dashboard from './components/Dashboard';
import PhysiqueHeader from './components/PhysiqueHeader';
import PhysiqueAuth from './components/PhysiqueAuth';
import Export from './components/Export';
import PhysiqueErrorBoundary from './components/PhysiqueErrorBoundary';
import { Loader2, Home } from 'lucide-react';

// Types (aligned with PhysiqueContext)
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
  goalType: string | null;
  createdAt: string;
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
  createdAt: string;
}

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logError } = usePhysique();
  const navigate = useNavigate();

  if (!user) {
    logError(new Error('Unauthorized access attempt'), { componentStack: 'ProtectedRoute', code: '401' });
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <PhysiqueProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <PhysiqueHeader />
          <main className="py-8 px-4 sm:px-6 lg:px-8 animate-fade-in" role="main" aria-label="Main content">
            <PhysiqueErrorBoundary>
              <Suspense
                fallback={
                  <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" aria-hidden="true" />
                    <span className="ml-2 text-gray-600">Loading...</span>
                  </div>
                }
              >
                <Routes>
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/auth" element={<PhysiqueAuth />} />
                  <Route
                    path="/export"
                    element={
                      <ProtectedRoute>
                        <Export />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="*"
                    element={
                      <div className="text-center py-12">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
                        <p className="text-gray-600 mb-6">The page you're looking for doesn't exist.</p>
                        <button
                          onClick={() => window.location.href = '/dashboard'}
                          className="flex items-center justify-center mx-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          aria-label="Back to Dashboard"
                        >
                          <Home className="h-4 w-4 mr-2" aria-hidden="true" />
                          Back to Dashboard
                        </button>
                      </div>
                    }
                  />
                </Routes>
              </Suspense>
            </PhysiqueErrorBoundary>
          </main>
        </div>
      </Router>
    </PhysiqueProvider>
  );
};

export default App;