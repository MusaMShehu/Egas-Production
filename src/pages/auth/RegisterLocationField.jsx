// components/Auth/RegisterLocationField.jsx
// Drop into your register form (DOB + gender fields removed). Usage:
//
//   const [form, setForm] = useState({ firstName:'', lastName:'', email:'', phone:'', password:'',
//                                      address:'', city:'', state:'', gps:null });
//   <RegisterLocationField value={form} onChange={(patch) => setForm((f) => ({ ...f, ...patch }))} />
//
// On submit: FormData.append('gps', JSON.stringify(form.gps)) -- backend register() already parses it.
import React from 'react';
import { useLocationCapture } from '../../hooks/useLocationCapture';
import '../../styles/portal.css';

export default function RegisterLocationField({ value, onChange }) {
  const { gps, suggestions, loading, error, capture, clear } = useLocationCapture();

  const pick = (s) => onChange({ address: s.address, city: s.city || value.city, state: s.state || value.state, gps });

  return (
    <div className="pt-field-group">
      <label className="pt-label">Delivery address</label>
      <input className="pt-input" placeholder="House number, street, area" value={value.address}
        onChange={(e) => onChange({ address: e.target.value, gps })} required />
      <div className="pt-row">
        <input className="pt-input" placeholder="City" value={value.city} onChange={(e) => onChange({ city: e.target.value })} required />
        <input className="pt-input" placeholder="State" value={value.state} onChange={(e) => onChange({ state: e.target.value })} required />
      </div>

      <button type="button" className="pt-btn pt-btn-ghost" onClick={async () => { await capture(); }} disabled={loading}>
        {loading ? 'Getting your location…' : gps ? '📍 Location captured – recapture' : '📍 Use my current location'}
      </button>
      {gps && <button type="button" className="pt-link" onClick={() => { clear(); onChange({ gps: null }); }}>Remove location</button>}
      {error && <p className="pt-error">{error}</p>}

      {suggestions.length > 0 && (
        <ul className="pt-suggest" role="listbox" aria-label="Address suggestions">
          {suggestions.map((s) => (
            <li key={s.address}><button type="button" onClick={() => pick(s)}>{s.address}</button></li>
          ))}
        </ul>
      )}
      <GpsSync gps={gps} onChange={onChange} />
    </div>
  );
}

// keeps parent form's gps in sync once coordinates arrive
function GpsSync({ gps, onChange }) {
  React.useEffect(() => { if (gps) onChange({ gps }); /* eslint-disable-next-line */ }, [gps]);
  return null;
}
