import { useEffect } from 'react';
import { trackEvent, trackPageView, isGAAvailable } from '../utils/analytics';

export const usePageTracking = (path: string, title?: string): void => {
  useEffect(() => {
    if (isGAAvailable()) {
      trackPageView(path, title);
      return;
    }

    const maxRetries = 20;
    let retries = 0;
    const intervalId = setInterval(() => {
      if (isGAAvailable()) {
        trackPageView(path, title);
        clearInterval(intervalId);
      } else if (retries >= maxRetries) {
        clearInterval(intervalId);
      }
      retries++;
    }, 200);

    return () => clearInterval(intervalId);
  }, [path, title]);
};

export const useAnalytics = () => ({
  trackEvent: (eventName: string, eventParams?: Record<string, unknown>) => {
    trackEvent(eventName, eventParams);
  },
  isAvailable: isGAAvailable(),
});
