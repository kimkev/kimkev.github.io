import ReactGA from 'react-ga4';

const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

export const isAnalyticsEnabled = Boolean(measurementId);

export const initAnalytics = () => {
  if (!isAnalyticsEnabled) {
    if (import.meta.env.DEV) {
      console.warn('VITE_GA_MEASUREMENT_ID is not set; analytics disabled.');
    }
    return;
  }

  ReactGA.initialize(measurementId, {
    gtagOptions: { send_page_view: false },
  });
};

export const trackPageview = (path) => {
  if (!isAnalyticsEnabled) return;

  try {
    ReactGA.send({
      hitType: 'pageview',
      page: path ?? window.location.pathname + window.location.search,
    });
  } catch {
    // Analytics must never break navigation.
  }
};
