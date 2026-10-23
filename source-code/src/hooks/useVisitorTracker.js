import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { addCollectionData } from '../services/firebase';

export const useVisitorTracker = () => {
  const location = useLocation();

  useEffect(() => {
    const trackVisitor = async () => {
      try {
        const path = location.pathname;
        const timestamp = new Date().toISOString();
        const userAgent = navigator.userAgent;
        
        // Detect basic device type
        let deviceType = "Desktop";
        if (/Mobi|Android|iPhone|iPad/i.test(userAgent)) {
          deviceType = /iPad|Tablet/i.test(userAgent) ? "Tablet" : "Mobile";
        }

        // Fetch user IP / Geolocation silently from free API with fallback
        let geoData = { ip: "Unknown", city: "Bengaluru", country: "India", org: "ISP" };
        try {
          const res = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3000) });
          if (res.ok) {
            const data = await res.json();
            geoData = {
              ip: data.ip || "Unknown",
              city: data.city || "Bengaluru",
              region: data.region || "Karnataka",
              country: data.country_name || "India",
              org: data.org || "ISP"
            };
          }
        } catch (e) {
          // Silent fallback if offline or adblocker blocks ipapi
        }

        const logEntry = {
          path,
          timestamp,
          deviceType,
          userAgent,
          geo: geoData
        };

        // Write log silently to visitor_logs collection
        await addCollectionData('visitor_logs', logEntry);
      } catch (err) {
        // Fail silently so user navigation is never interrupted
      }
    };

    // Defer telemetry execution to non-blocking idle time so initial paint/LCP is uninterrupted
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const idleId = window.requestIdleCallback(() => trackVisitor(), { timeout: 3000 });
      return () => window.cancelIdleCallback(idleId);
    } else {
      const timerId = setTimeout(trackVisitor, 2000);
      return () => clearTimeout(timerId);
    }
  }, [location.pathname]);
};
