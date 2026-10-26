// hooks/useLocationCapture.js
// GPS is captured ONLY when capture() is called (button tap). Returns address suggestions.
import { useState, useCallback } from 'react';

export const useLocationCapture = () => {
  const [gps, setGps] = useState(null); // { type:'Point', coordinates:[lng,lat] }
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const capture = useCallback(() => {
    setError('');
    if (!navigator.geolocation) return setError('Location is not supported on this device.');
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { latitude: lat, longitude: lng } = coords;
        setGps({ type: 'Point', coordinates: [lng, lat] });
        try {
          const r = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&addressdetails=1&zoom=18&lat=${lat}&lon=${lng}`,
            { headers: { Accept: 'application/json' } }
          );
          const j = await r.json();
          const a = j.address || {};
          const city = a.city || a.town || a.village || a.county || '';
          const state = (a.state || '').replace(/ State$/i, '');
          const street = [a.house_number, a.road].filter(Boolean).join(' ');
          const options = [
            [street, a.suburb || a.neighbourhood].filter(Boolean).join(', '),
            [a.suburb || a.neighbourhood, city].filter(Boolean).join(', '),
            j.display_name,
          ].filter(Boolean);
          setSuggestions([...new Set(options)].map((address) => ({ address, city, state })));
        } catch {
          setError('Location captured, but address suggestions are unavailable. Enter it manually.');
        } finally {
          setLoading(false);
        }
      },
      (e) => {
        setLoading(false);
        setError(e.code === 1 ? 'Location permission denied. Enter your address manually.' : 'Could not get your location.');
      },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  }, []);

  const clear = () => { setGps(null); setSuggestions([]); setError(''); };
  return { gps, suggestions, loading, error, capture, clear };
};
