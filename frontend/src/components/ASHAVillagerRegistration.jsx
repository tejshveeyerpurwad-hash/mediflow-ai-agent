import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
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
          <div className="absolute inset-y-0 left-3 flex items-center text-slate-400 pointer-events-none">
            <field.icon className="w-4 h-4" aria-hidden="true" />
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
          className={`w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center shrink-0 transition-all ${
            voice.isListening ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
          }`}
          aria-label={`Voice input for ${field.label}`}
          type="button"
        >
          {voice.isListening ? <div className="w-2 h-2 bg-white rounded-full animate-ping" aria-hidden="true" /> : <Mic className="w-5 h-5" aria-hidden="true" />}
        </button>
      </div>
      {voice.transcript && (
        <p className="text-xs text-emerald-600 mt-1 font-medium">Heard: {voice.transcript}</p>
      )}
    </div>
  );
}

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function ASHAVillagerRegistration({ isOpen = true, onClose, onSuccess }) {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: '', phone: '', village: '', age: '' });
  const [created, setCreated] = useState(false);
  const [healthId, setHealthId] = useState('');
  const [saving, setSaving] = useState(false);
  const [animating, setAnimating] = useState(false);

  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);
  const closeButtonRef = useRef(null);
  const doneButtonRef = useRef(null);

  const titleId = 'ashavr-title';
  const descId = 'ashavr-desc';
  const healthIdDescId = 'ashavr-healthid-desc';

  const close = useCallback(() => {
    setAnimating(false);
    setTimeout(() => {
      if (onClose) onClose();
    }, 200);
  }, [onClose]);

  const updateField = useCallback((key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!form.name) {
      showToast('Please enter the villager name', 'error');
      return;
    }
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    const id = `SW-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    setHealthId(id);
    setCreated(true);
    setSaving(false);

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
    if (onSuccess) onSuccess();
  }, [form, user, onSuccess]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      close();
      return;
    }

    if (e.key === 'Tab' && modalRef.current) {
      const focusable = modalRef.current.querySelectorAll(FOCUSABLE_SELECTOR);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }, [close]);

  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      close();
    }
  }, [close]);

  useEffect(() => {
    if (!isOpen) return;

    previousActiveElement.current = document.activeElement;
    setAnimating(true);

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    const timer = setTimeout(() => {
      if (created && doneButtonRef.current) {
        doneButtonRef.current.focus();
      } else if (closeButtonRef.current) {
        closeButtonRef.current.focus();
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      if (previousActiveElement.current && typeof previousActiveElement.current.focus === 'function') {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, created]);

  const handleDone = useCallback(() => {
    close();
  }, [close]);

  const handleFormSubmit = useCallback((e) => {
    handleSubmit(e);
  }, [handleSubmit]);

  const handleFieldChange = useCallback((key, value) => {
    updateField(key, value);
  }, [updateField]);

  if (!isOpen) return null;

  const modal = (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 md:p-6 transition-all duration-200 ${
        animating ? 'bg-black/40' : 'bg-black/0'
      }`}
      style={{ backdropFilter: animating ? 'blur(4px)' : 'blur(0px)', WebkitBackdropFilter: animating ? 'blur(4px)' : 'blur(0px)' }}
      onMouseDown={handleBackdropClick}
      onTouchEnd={(e) => {
        if (e.target === e.currentTarget) close();
      }}
      role="presentation"
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={created ? healthIdDescId : descId}
        onKeyDown={handleKeyDown}
        className={`bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto transform transition-all duration-200 ease-out ${
          animating ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
        style={{
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain',
        }}
      >
        <div className="p-5 sm:p-6 md:p-8">
          <div className="flex items-start justify-between mb-5 gap-3">
            <h2 id={titleId} className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-emerald-600 shrink-0" aria-hidden="true" />
              {created ? 'Villager Registered' : 'Register New Villager'}
            </h2>
            <button
              ref={closeButtonRef}
              onClick={close}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-slate-100 text-slate-400 hover:text-slate-600 hover:bg-slate-200 active:bg-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 transition-all cursor-pointer -mr-1 -mt-1 shrink-0"
              aria-label="Close registration dialog"
              type="button"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          {created ? (
            <div className="text-center space-y-5 py-2 sm:py-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-emerald-100 rounded-full flex items-center justify-center">
                <Check className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600" aria-hidden="true" />
              </div>
              <div className="space-y-2" aria-live="polite">
                <p className="text-lg sm:text-xl font-bold text-slate-900">{form.name}</p>
                <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-50 rounded-xl border border-emerald-200">
                  <Shield className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
                  <span className="text-sm font-bold text-emerald-700 select-all">{healthId}</span>
                </div>
                <p id={healthIdDescId} className="text-sm text-slate-500">This is the villager's unique health ID.</p>
              </div>
              <button
                ref={doneButtonRef}
                onClick={handleDone}
                className="min-w-[44px] min-h-[44px] px-8 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm sm:text-base transition-all hover:bg-slate-800 active:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none"
                type="button"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-4" noValidate>
              <p id={descId} className="text-sm text-slate-500 font-medium">
                Register a new patient during your village visit. All fields support voice input.
              </p>

              {FIELDS.map(field => (
                <FieldWithVoice
                  key={field.key}
                  field={field}
                  value={form[field.key]}
                  onChange={handleFieldChange}
                  lang="hi"
                />
              ))}

              <button
                type="submit"
                disabled={saving}
                className="min-w-[44px] w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-xl font-bold text-sm sm:text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 cursor-pointer select-none"
              >
                {saving ? 'Creating profile...' : 'Register & Generate Health ID'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
