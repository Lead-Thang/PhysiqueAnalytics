/**
 * PhysiqueAuth Component
 * Handles user authentication (sign-in, sign-up, and password reset) using Supabase Auth.
 * Integrates with PhysiqueContext for error logging and user data updates.
 * Uses React Router for post-authentication redirects.
 * Styled with Tailwind CSS, featuring form validation, accessibility, and responsive design.
 * Supports password visibility toggle, mode switching, and password reset functionality.
 */
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, UserPlus, X, Loader2 } from 'lucide-react';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, resetPasswordForEmail } from 'supabase/auth';
import { usePhysique } from '../context/PhysiqueContext';

// Types
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
}

interface PhysiqueContextType {
  metrics: PhysiqueMetrics | null;
  refreshPhysiqueData: () => Promise<void>;
  error: string | null;
  clearError: () => void;
  logError?: (error: Error, info: { componentStack: string }) => void;
}

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  submit?: string;
  reset?: string;
}

const PhysiqueAuth: React.FC = () => {
  const { refreshPhysiqueData, error: contextError, clearError, logError } = usePhysique();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({ email: '', password: '' });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const auth = getAuth();

  // Validate form inputs
  const validateForm = useCallback(({ email, password }: FormData): FormErrors => {
    const errors: FormErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      errors.email = 'Invalid email format';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    return errors;
  }, []);

  // Handle input change
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
        if (isSignUp) {
          await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        } else {
          await signInWithEmailAndPassword(auth, formData.email, formData.password);
        }
        await refreshPhysiqueData();
        navigate('/dashboard');
      } catch (err: any) {
        const errorMessage = err.message || (isSignUp ? 'Failed to sign up' : 'Invalid credentials');
        setFormErrors({ submit: errorMessage });
        if (logError) {
          logError(new Error(errorMessage), { componentStack: '' });
        }
      } finally {
        setIsLoading(false);
      }
    },
    [formData, isSignUp, auth, refreshPhysiqueData, navigate, logError]
  );

  // Handle password reset
  const handlePasswordReset = useCallback(async () => {
    if (!formData.email) {
      setFormErrors({ email: 'Please enter your email to reset password' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormErrors({ email: 'Invalid email format' });
      return;
    }

    setIsResetting(true);
    try {
      await resetPasswordForEmail(auth, formData.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      setFormErrors({ reset: 'Password reset email sent. Check your inbox.' });
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to send password reset email';
      setFormErrors({ reset: errorMessage });
      if (logError) {
        logError(new Error(errorMessage), { componentStack: '' });
      }
    } finally {
      setIsResetting(false);
    }
  }, [formData.email, auth, logError]);

  // Toggle password visibility
  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  // Toggle between sign-in and sign-up
  const toggleAuthMode = useCallback(() => {
    setIsSignUp((prev) => !prev);
    setFormErrors({});
    clearError();
  }, [clearError]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-xl shadow-lg p-6 sm:max-w-md w-full animate-fade-in">
        <div className="flex items-center justify-center mb-6">
          <LogIn className="h-6 w-6 text-blue-600 mr-2" aria-hidden="true" />
          <h2 className="text-2xl font-bold text-gray-800">
            PhysiqueAnalytics {isSignUp ? 'Sign Up' : 'Sign In'}
          </h2>
        </div>

        {/* Error/Reset Message */}
        {(contextError || formErrors.submit || formErrors.reset) && (
          <div
            className={`rounded-lg border p-4 mb-6 flex items-start ${
              formErrors.reset && !contextError && !formErrors.submit
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            }`}
          >
            <div
              className={`p-2 rounded-full ${
                formErrors.reset && !contextError && !formErrors.submit
                  ? 'bg-green-100 text-green-600'
                  : 'bg-red-100 text-red-600'
              }`}
            >
              <X className="h-5 w-5" />
            </div>
            <div className="ml-3">
              <p
                className={`text-sm ${
                  formErrors.reset && !contextError && !formErrors.submit ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {contextError || formErrors.submit || formErrors.reset}
              </p>
              <button
                className="mt-2 text-xs text-red-500 hover:underline"
                onClick={clearError}
                aria-label="Dismiss message"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} aria-label={`${isSignUp ? 'Sign up' : 'Sign in'} form`}>
          <div className="space-y-4">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={`w-full px-3 py-2 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    formErrors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  aria-required="true"
                  aria-label="Email address"
                  disabled={isLoading || isResetting}
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              {formErrors.email && <p className="mt-1 text-xs text-red-600">{formErrors.email}</p>}
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`w-full px-3 py-2 pl-10 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    formErrors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  aria-required="true"
                  aria-label="Password"
                  disabled={isLoading || isResetting}
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden="true" />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  disabled={isLoading || isResetting}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {formErrors.password && <p className="mt-1 text-xs text-red-600">{formErrors.password}</p>}
            </div>

            {/* Forgot Password Link */}
            {!isSignUp && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={handlePasswordReset}
                  className="text-sm text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label="Forgot password"
                  disabled={isLoading || isResetting}
                >
                  Forgot Password?
                </button>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={isLoading || isResetting}
                className={`flex-1 flex items-center justify-center bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  isLoading || isResetting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                }`}
                aria-label={isSignUp ? 'Sign up' : 'Sign in'}
                aria-busy={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    {isSignUp ? 'Signing up...' : 'Signing in...'}
                  </span>
                ) : (
                  <>
                    {isSignUp ? (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" aria-hidden="true" />
                        Sign Up
                      </>
                    ) : (
                      <>
                        <LogIn className="h-4 w-4 mr-2" aria-hidden="true" />
                        Sign In
                      </>
                    )}
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={toggleAuthMode}
                className={`flex-1 bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 ${
                  isLoading || isResetting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'
                }`}
                aria-label={`Switch to ${isSignUp ? 'sign in' : 'sign up'}`}
                disabled={isLoading || isResetting}
              >
                Switch to {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PhysiqueAuth;