import { useState, useRef } from 'react';
import { X, User, Phone, MapPin, Mic, Check, HeartPulse, Shield } from 'lucide-react';
import useVoiceInput from '../hooks/useVoiceInput';
import { useAuth } from '../context/AuthContext';
import { showToast } from '../utils/toast';

const FIELDS = [
  { key: 'name', label: 'Full Name', icon: User, type: 'text' },
  { key: 'phone', label: 'Phone Number', icon: Phone, type: 'tel', maxLength: 10 },
  { key: 'village', label: 'Village / Area', icon: MapPin, type: 'text' },
  { key: 'age', label: 'Age (years)', icon: User, type: 'number' },
];

function FieldWithVoice({ field, value, onChange, lang }) {
  const voice = useVoiceInput({ lang, onResult: (text) => onChange(field.key, text) });

  return (
    <div>
      <label className="block text-sm font-bold text-slate-700 mb-1">{field.label}</label>
      <div className="relative flex gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-3 flex items-center text-slate-400">
            <field.icon className="w-4 h-4" />
          </div>
          <input
            type={field.type}
            value={value}
            onChange={(e) => onChange(field.key, e.target.value)}
            placeholder={field.label}
            maxLength={field.maxLength}
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-base font-semibold focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
          />
        </div>
        <button
          onClick={() => voice.isListening ? voice.stopListening() : voice.startListening()}
          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all ${
            voice.isListening ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
          }`}
          aria-label={`Voice input for ${field.label}`}
        >
          {voice.isListening ? <div className="w-2 h-2 bg-white rounded-full animate-ping" /> : <Mic className="w-5 h-5" />}
        </button>
      </div>
      {voice.transcript && (
        <p className="text-xs text-emerald-600 mt-1 font-medium">Heard: {voice.transcript}</p>
      )}
    </div>
  );
}

export default function ASHAVillagerRegistration({ onClose }) {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: '', phone: '', village: '', age: '' });
  const [created, setCreated] = useState(false);
  const [healthId, setHealthId] = useState('');
  const [saving, setSaving] = useState(false);

  const updateField = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) {
      showToast('Please enter the villager name', 'error');
      return;
    }
    setSaving(true);
    // Simulate profile creation
    await new Promise(r => setTimeout(r, 1000));
    const id = `SW-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    setHealthId(id);
    setCreated(true);
    setSaving(false);

    // Store in offline cache for demo
    try {
      const existing = JSON.parse(localStorage.getItem('swasthai_offline_user_cache') || '[]');
      existing.push({
        id, name: form.name, phone: form.phone,
        villageId: form.village || user?.villageId || 'v101',
        role: 'villager', registeredBy: user?.name || 'ASHA Worker',
      });
      localStorage.setItem('swasthai_offline_user_cache', JSON.stringify(existing));
    } catch (_) {}

    showToast(`Villager registered. Health ID: ${id}`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-emerald-600" />
              {created ? 'Villager Registered' : 'Register New Villager'}
            </h2>
            <button onClick={onClose} className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          {created ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 mx-auto bg-emerald-100 rounded-full flex items-center justify-center">
                <Check className="w-8 h-8 text-emerald-600" />
              </div>
              <div className="space-y-1">
                <p className="text-lg font-bold text-slate-900">{form.name}</p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-200">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-bold text-emerald-700">{healthId}</span>
                </div>
                <p className="text-sm text-slate-500">This is the villager's unique health ID.</p>
              </div>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm text-slate-500 font-medium">
                Register a new patient during your village visit. All fields support voice input.
              </p>

              {FIELDS.map(field => (
                <FieldWithVoice
                  key={field.key}
                  field={field}
                  value={form[field.key]}
                  onChange={updateField}
                  lang="hi"
                />
              ))}

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-base transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? 'Creating profile...' : 'Register & Generate Health ID'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
