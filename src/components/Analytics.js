import ReactGA from 'react-ga4';

export const initGA = (measurementId) => {
    if (measurementId) {
        ReactGA.initialize(measurementId);
    } else {
        console.warn("GA measurementId is missing. Analytics not initialized.");
    }
};

export const trackPageview = () => {
    try {
        ReactGA.send('pageview');
    } catch (e) {
        // Prevent crashing if tracking fails
    }
};