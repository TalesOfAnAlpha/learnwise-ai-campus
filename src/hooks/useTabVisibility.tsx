
import { useState, useEffect } from 'react';

export interface TabVisibilityData {
  isVisible: boolean;
  tabSwitchCount: number;
  lastSwitchTime: Date | null;
  tabSwitches: {time: string, count: number}[];
}

export function useTabVisibility(): TabVisibilityData {
  const [isVisible, setIsVisible] = useState(true);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [lastSwitchTime, setLastSwitchTime] = useState<Date | null>(null);
  const [tabSwitches, setTabSwitches] = useState<{time: string, count: number}[]>([]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      const visible = document.visibilityState === 'visible';
      
      if (!visible) {
        // Tab was hidden / user switched tabs
        const newCount = tabSwitchCount + 1;
        const now = new Date();
        
        setTabSwitchCount(newCount);
        setLastSwitchTime(now);
        setTabSwitches(prev => [
          ...prev, 
          {time: now.toLocaleTimeString(), count: newCount}
        ]);
        
        console.log('Tab switching detected!', {
          time: now.toISOString(),
          switchCount: newCount
        });
      }
      
      setIsVisible(visible);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Enhanced window focus detection
    const focusInterval = setInterval(() => {
      if (document.hasFocus() !== isVisible) {
        handleVisibilityChange();
      }
    }, 800); // More frequent checks

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(focusInterval);
    };
  }, [isVisible, tabSwitchCount]);

  return {
    isVisible,
    tabSwitchCount,
    lastSwitchTime,
    tabSwitches
  };
}
