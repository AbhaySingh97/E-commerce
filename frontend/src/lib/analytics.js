const STORAGE_KEY = 'luxecart.analytics.events';
const MAX_EVENTS = 250;

const safeRead = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const safeWrite = (events) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events.slice(-MAX_EVENTS)));
  } catch {
    // Ignore storage failures in private mode or quota pressure.
  }
};

export const trackEvent = (name, payload = {}) => {
  const event = {
    name,
    payload,
    timestamp: new Date().toISOString(),
  };

  const nextEvents = [...safeRead(), event].slice(-MAX_EVENTS);
  safeWrite(nextEvents);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('luxecart:analytics', { detail: event }));
  }

  return event;
};

export const trackPageView = (pathname, extra = {}) => trackEvent('page_view', { pathname, ...extra });

export const readTrackedEvents = () => safeRead();

export const summarizeTrackedEvents = () => {
  return readTrackedEvents().reduce((summary, event) => {
    summary[event.name] = (summary[event.name] || 0) + 1;
    return summary;
  }, {});
};
