import React, { createContext, useState, useContext, ReactNode } from 'react';
import type { UserMetrics, PhysiqueGoal } from '../types';

interface PhysiqueContextType {
  currentMetrics: UserMetrics | null;
  targetPhysique: PhysiqueGoal | null;
  isLoading: boolean;
  error: string | null;
  updateCurrentMetrics: (metrics: UserMetrics) => void;
  updateTargetPhysique: (physique: PhysiqueGoal) => void;
  analyzeImage: (imageFile: File) => Promise<void>;
}

const PhysiqueContext = createContext<PhysiqueContextType | undefined>(undefined);

interface PhysiqueProviderProps {
  children: ReactNode;
}

export const PhysiqueProvider: React.FC<PhysiqueProviderProps> = ({ children }) => {
  const [currentMetrics, setCurrentMetrics] = useState<UserMetrics | null>(null);
  const [targetPhysique, setTargetPhysique] = useState<PhysiqueGoal | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateCurrentMetrics = (metrics: UserMetrics) => {
    setCurrentMetrics(metrics);
  };

  const updateTargetPhysique = (physique: PhysiqueGoal) => {
    setTargetPhysique(physique);
  };

  const analyzeImage = async (imageFile: File) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would send the image to an AI backend
      // For now, we'll simulate with mock data based on the image name
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock response based on image name
      const mockMetrics: UserMetrics = {
        height: 175,
        weight: imageFile.name.includes('slim') ? 65 : imageFile.name.includes('athlete') ? 75 : 85,
        bodyFat: imageFile.name.includes('slim') ? 12 : imageFile.name.includes('athlete') ? 18 : 25,
        muscleMass: imageFile.name.includes('slim') ? 35 : imageFile.name.includes('athlete') ? 42 : 38,
        chest: 95,
        waist: imageFile.name.includes('slim') ? 78 : imageFile.name.includes('athlete') ? 82 : 95,
        hips: 92,
        thighs: 55,
        arms: 30,
      };
      
      setCurrentMetrics(mockMetrics);
    } catch (err) {
      setError('Failed to analyze image. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PhysiqueContext.Provider
      value={{
        currentMetrics,
        targetPhysique,
        isLoading,
        error,
        updateCurrentMetrics,
        updateTargetPhysique,
        analyzeImage,
      }}
    >
      {children}
    </PhysiqueContext.Provider>
  );
};

export const usePhysique = () => {
  const context = useContext(PhysiqueContext);
  if (context === undefined) {
    throw new Error('usePhysique must be used within a PhysiqueProvider');
  }
  return context;
};