import { useState, useCallback } from 'react';
import { ViewType } from '../types/views';

export const useViewTransition = (initialView: ViewType = 'dashboard') => {
  const [currentView, setCurrentView] = useState<ViewType>(initialView);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const navigateToView = useCallback((newView: ViewType) => {
    if (currentView === newView) return;
    
    setIsTransitioning(true);
    setCurrentView(newView);
    
    // Reset transition state after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300); // Match this with your animation duration
  }, [currentView]);

  return {
    currentView,
    isTransitioning,
    navigateToView
  };
};