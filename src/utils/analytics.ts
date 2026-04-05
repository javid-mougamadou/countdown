declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

// @ts-expect-error - import.meta.env is provided by Vite
const GA_MEASUREMENT_ID: string | undefined = import.meta.env.VITE_GA_MEASUREMENT_ID;
// @ts-expect-error - import.meta.env is provided by Vite
const IS_PRODUCTION: boolean = import.meta.env.PROD === true;

let gaInitialized = false;

const loadGtagScript = (measurementId: string): Promise<void> => {
  return new Promise((resolve) => {
    if (window.gtag) {
      resolve();
      return;
    }

    window.dataLayer = window.dataLayer || [];
    const gtag = (...args: unknown[]) => window.dataLayer!.push(args);
    window.gtag = gtag;
    gtag('js', new Date());

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
};

export const initGA = async (): Promise<void> => {
  if (!IS_PRODUCTION || !GA_MEASUREMENT_ID) return;

  try {
    await loadGtagScript(GA_MEASUREMENT_ID);
    window.gtag?.('config', GA_MEASUREMENT_ID, { send_page_view: false });
    gaInitialized = true;
  } catch (error) {
    console.error('Failed to initialize Google Analytics:', error);
    gaInitialized = false;
  }
};

export const trackPageView = (path: string, title?: string): void => {
  if (!IS_PRODUCTION || !GA_MEASUREMENT_ID || !gaInitialized) return;

  try {
    window.gtag?.('config', GA_MEASUREMENT_ID, {
      page_path: path,
      page_title: title || document.title,
    });
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
};

export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, unknown>,
): void => {
  if (!IS_PRODUCTION || !GA_MEASUREMENT_ID || !gaInitialized) return;

  try {
    window.gtag?.('event', eventName, eventParams || {});
  } catch (error) {
    console.error('Error tracking event:', error);
  }
};

export const isGAAvailable = (): boolean =>
  IS_PRODUCTION && !!GA_MEASUREMENT_ID && (gaInitialized || !!window.gtag);
