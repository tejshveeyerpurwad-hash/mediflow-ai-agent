import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useVoiceGuidance } from '../context/VoiceGuidanceContext';
import useVoiceInput from '../hooks/useVoiceInput';
import VoiceGuidedRegistration from '../components/VoiceGuidedRegistration';
import {
  HeartPulse, Shield, Phone, Mail, Lock, User,
  ArrowRight, ChevronLeft, MapPin, AlertCircle,
  CheckCircle, Globe, Mic, Volume2,
  ShieldCheck, BadgeCheck, KeyRound, Wifi, Clock,
  Eye, EyeOff
} from 'lucide-react';

const TRUST_INDICATORS = [
  { icon: ShieldCheck, label: 'Secure Authentication' },
  { icon: BadgeCheck, label: 'ABDM Ready' },
  { icon: Lock, label: 'Encrypted Sessions' },
  { icon: KeyRound, label: 'Role Based Access' },
  { icon: Wifi, label: 'Offline First' },
  { icon: Clock, label: 'Multi Language' },
];

const ROLES = [
  { id: 'villager', label: 'Villager', sub: 'Patient / Citizen', icon: User, desc: 'Check symptoms, request ambulance, track health.', badge: 'Self Service', badgeColor: 'bg-emerald-100 text-emerald-700' },
  { id: 'ngo', label: 'ASHA Worker', sub: 'Healthcare Provider', icon: Shield, desc: 'Manage village health, pregnancies, child nutrition.', badge: 'Field Worker', badgeColor: 'bg-blue-100 text-blue-700' },
  { id: 'admin', label: 'Admin', sub: 'District Management', icon: MapPin, desc: 'Analytics, outbreak alerts, dispatch oversight.', badge: 'Administrator', badgeColor: 'bg-purple-100 text-purple-700' },
];

export default function RegisterPage() {
  const { lang, setLang, t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '', username: '', phone: '', email: '',
    password: '', role: 'villager', villageId: 'v101', passcode: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showPassword, setShowPassword] = useState(false);
  const [showVoiceGuidance, setShowVoiceGuidance] = useState(false);

  const { simpleMode, toggleSimpleMode, voiceGuided, toggleVoiceGuided } = useVoiceGuidance();

  const { register, loginPassword } = useAuth();
  const navigate = useNavigate();
  const nameRef = useRef(null);

  useEffect(() => {
    const goOnline = () => setIsOffline(false);
    const goOffline = () => setIsOffline(true);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  useEffect(() => {
    if (nameRef.current) nameRef.current.focus();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleVoiceFieldResult = (field, value) => {
    if (field === 'name') {
      setFormData(prev => ({ ...prev, name: value, username: value.toLowerCase().replace(/\s+/g, '') }));
    } else if (field === 'phone') {
      setFormData(prev => ({ ...prev, phone: value.replace(/\D/g, '').slice(0, 10) }));
    } else if (field === 'village') {
      setFormData(prev => ({ ...prev, villageId: value.toLowerCase().replace(/\s+/g, '') }));
    } else if (field === 'password') {
      setFormData(prev => ({ ...prev, password: value }));
    }
  };

  const handleVoiceGuidedComplete = () => {
    setShowVoiceGuidance(false);
    setSuccess(true);
    const doRegister = async () => {
      try {
        await register(formData);
        const identifier = formData.email || formData.phone;
        await loginPassword(identifier, formData.password, formData.role);
        setTimeout(() => navigate(`/${formData.role}`), 1000);
      } catch (_) {}
    };
    doRegister();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      if (!formData.name || !formData.username || !formData.password) {
        throw new Error('Full name, username, and password are required.');
      }
      if (!formData.phone && !formData.email) {
        throw new Error('Please provide at least a phone number or email address.');
      }
      if ((formData.role === 'ngo' || formData.role === 'admin') && !formData.passcode) {
        throw new Error('Passcode is required for NGO/Admin registration.');
      }
      if (formData.role === 'ngo' && formData.passcode !== 'ASHA2026') {
        throw new Error('Invalid ASHA/NGO registration passcode.');
      }
      if (formData.role === 'admin' && formData.passcode !== 'ADMIN2026') {
        throw new Error('Invalid Admin registration passcode.');
      }
      await register(formData);
      const identifier = formData.email || formData.phone;
      await loginPassword(identifier, formData.password, formData.role);
      setSuccess(true);
      setTimeout(() => navigate(`/${formData.role}`), 1500);
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Registration failed. Please try again.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex flex-col lg:flex-row min-h-screen lg:h-screen bg-[#F8FAFC] font-inter overflow-y-auto lg:overflow-hidden ${simpleMode ? 'simple-mode-active' : ''}`}>

      <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm">
        <Globe className="w-4 h-4 text-emerald-600" />
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          className="bg-transparent border-0 text-slate-700 text-sm font-bold focus:outline-none cursor-pointer pr-1"
          aria-label="Select language"
        >
          {[{ code: 'hi', label: 'हिन्दी' }, { code: 'en', label: 'English' }, { code: 'mr', label: 'मराठी' },
            { code: 'ta', label: 'தமிழ்' }, { code: 'te', label: 'తెలుగు' }, { code: 'bn', label: 'বাংলা' }]
            .map(l => (<option key={l.code} value={l.code}>{l.label}</option>))}
        </select>
      </div>

      <motion.div
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="hidden lg:flex w-[40%] relative bg-[#0A2E24] flex-col justify-between p-10 xl:p-12"
      >
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-500 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 space-y-6">
          <Link to="/" className="inline-flex items-center gap-2 text-emerald-100/60 hover:text-white transition-all text-sm font-bold group">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Home
          </Link>

          <motion.div
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
            className="flex items-center gap-3"
          >
            <div className="p-2.5 bg-white/10 backdrop-blur rounded-xl border border-white/10">
              <HeartPulse className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight">SwasthAI</h1>
              <p className="text-emerald-400/70 text-[10px] font-bold uppercase tracking-widest">Rural Health Network</p>
            </div>
          </motion.div>

          <motion.h2
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
            className="text-3xl xl:text-4xl font-black text-white leading-tight tracking-tight"
          >
            Join our trusted<br />
            <span className="text-emerald-400">healthcare network.</span>
          </motion.h2>

          <motion.p
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
            className="text-emerald-100/60 text-sm leading-relaxed font-medium max-w-md"
          >
            Create an account to securely book appointments, chat with specialists, and track your family's vital records in real-time.
          </motion.p>
        </div>

        <motion.div
          initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}
          className="relative z-10"
        >
          <p className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-widest mb-3">Trust &amp; Compliance</p>
          <div className="grid grid-cols-2 gap-2">
            {TRUST_INDICATORS.map((indicator) => (
              <div key={indicator.label} className="flex items-center gap-2 p-2.5 bg-white/5 border border-white/10 rounded-lg">
                <indicator.icon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-[11px] font-semibold text-emerald-100/70">{indicator.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      <div className="w-full lg:w-[60%] flex flex-col justify-center items-center p-5 sm:p-8 lg:p-10 overflow-y-auto">
        <motion.div
          initial={{ scale: 0.97, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="flex items-center gap-2.5 mb-6 lg:hidden">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <HeartPulse className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="font-black text-slate-900 text-base">SwasthAI</span>
          </div>

          <div className="mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full mb-3">
              <CheckCircle className="w-3.5 h-3.5" /> Free Account
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-1">Create Account</h2>
            <p className="text-sm text-slate-400 font-medium">
              Join thousands in rural India who use SwasthAI to stay healthy and get help fast.
            </p>

            <div className="flex flex-wrap gap-2 mt-4">
              <button
                onClick={() => setShowVoiceGuidance(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition-colors"
              >
                <Volume2 className="w-3.5 h-3.5" /> Voice Guided
              </button>
              <button
                onClick={toggleSimpleMode}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border ${
                  simpleMode
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-emerald-300'
                }`}
              >
                <User className="w-3.5 h-3.5" /> {simpleMode ? 'Simple: On' : 'Simple Mode'}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {isOffline && (
              <motion.div
                initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-sm font-medium text-amber-800"
              >
                <Globe className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                <div>
                  <p className="font-bold">Offline Registration Mode Active</p>
                  <p className="text-amber-700 text-xs mt-0.5">Your credentials will be cached locally. Register now and sync when connected.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-sm font-bold text-rose-700"
              >
                <AlertCircle className="w-4 h-4 shrink-0" /> {error}
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="mb-4 p-4 bg-emerald-600 text-white rounded-xl flex items-center gap-2.5 text-sm font-bold"
              >
                <CheckCircle className="w-5 h-5 shrink-0" /> Account created! Taking you to your dashboard...
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mb-6">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block">
              Step 1 — I am registering as a...
            </label>
            <div className="grid grid-cols-3 gap-3">
              {ROLES.map(r => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => handleInputChange({ target: { name: 'role', value: r.id } })}
                  className={`p-3 sm:p-4 rounded-xl border-2 text-left transition-all ${
                    formData.role === r.id
                      ? 'bg-white border-emerald-500 shadow-sm'
                      : 'bg-slate-50 border-slate-200 hover:border-emerald-300'
                  }`}
                  aria-pressed={formData.role === r.id}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 transition-all ${
                    formData.role === r.id ? 'bg-emerald-600 text-white' : 'bg-white text-slate-400 border border-slate-200'
                  }`}>
                    <r.icon className="w-4 h-4" />
                  </div>
                  <p className={`font-bold text-sm leading-tight ${formData.role === r.id ? 'text-slate-900' : 'text-slate-600'}`}>{r.label}</p>
                  <p className={`text-xs font-medium mt-0.5 ${formData.role === r.id ? 'text-emerald-600' : 'text-slate-400'}`}>{r.sub}</p>
                  {formData.role === r.id && (
                    <span className={`inline-block mt-1.5 px-2 py-0.5 text-[10px] font-bold rounded ${r.badgeColor}`}>{r.badge}</span>
                  )}
                </button>
              ))}
            </div>
            <div className="mt-3 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
              <p className="text-sm text-emerald-800 font-medium leading-relaxed">
                {ROLES.find(r => r.id === formData.role)?.desc}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Step 2 — Your Details</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { name: 'name', label: 'Full Name', icon: User, placeholder: 'Your full name', type: 'text', required: true },
                { name: 'username', label: 'Username', icon: User, placeholder: 'Choose a username', type: 'text', required: true },
              ].map(field => (
                <div key={field.name}>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 mb-1.5 block">{field.label}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-slate-400">
                      <field.icon className="w-4 h-4" />
                    </div>
                    <input
                      ref={field.name === 'name' ? nameRef : null}
                      type={field.type}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleInputChange}
                      placeholder={field.placeholder}
                      required={field.required}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-base font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-300"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 mb-1.5 block">Phone Number</label>
                <div className="relative flex gap-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-slate-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="10-digit mobile"
                      maxLength={10}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-base font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-300"
                    />
                  </div>
                  <PhoneMicButton field="phone" formData={formData} setFormData={setFormData} lang={lang} />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 mb-1.5 block">Email <span className="font-normal text-slate-300 normal-case">(optional)</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-base font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-300"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 mb-1.5 block">Village / Area Code</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-slate-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="villageId"
                  value={formData.villageId}
                  onChange={handleInputChange}
                  placeholder="e.g. v101"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-base font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-300"
                />
              </div>
              <p className="text-xs text-slate-400 font-medium mt-1 ml-1">Links to village health database. Use default "v101" for demo.</p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 mb-1.5 block">Create a Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Min. 8 characters recommended"
                  autoComplete="new-password"
                  required
                  className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-base font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute inset-y-0 right-3.5 flex items-center text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {(formData.role === 'ngo' || formData.role === 'admin') && (
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 mb-1.5 block">
                  {formData.role === 'ngo' ? 'ASHA Worker Passcode' : 'Admin Passcode'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-slate-400">
                    <Shield className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    name="passcode"
                    value={formData.passcode}
                    onChange={handleInputChange}
                    placeholder={formData.role === 'ngo' ? 'e.g. ASHA2026' : 'e.g. ADMIN2026'}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-base font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-300"
                  />
                </div>
              </div>
            )}

            <motion.button
              type="submit"
              disabled={isLoading || success}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating account...</>
              ) : success ? (
                <><CheckCircle className="w-4 h-4" /> Account Created!</>
              ) : (
                <>{'Create Account'} <ArrowRight className="w-4 h-4" /></>
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-sm text-slate-500 font-medium">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-emerald-600 hover:text-emerald-700 underline underline-offset-2">
                Log in here
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      {showVoiceGuidance && (
        <VoiceGuidedRegistration
          lang={lang}
          onFieldResult={handleVoiceFieldResult}
          onComplete={handleVoiceGuidedComplete}
          onCancel={() => setShowVoiceGuidance(false)}
        />
      )}
    </div>
  );
}

function PhoneMicButton({ field, formData, setFormData, lang }) {
  const voice = useVoiceInput({
    lang,
    onResult: (text) => {
      const cleaned = text.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, [field]: cleaned }));
    },
  });

  return (
    <button
      onClick={() => voice.isListening ? voice.stopListening() : voice.startListening()}
      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all ${
        voice.isListening ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
      }`}
      type="button"
      aria-label={`Voice input for ${field}`}
    >
      {voice.isListening ? (
        <span className="w-2 h-2 bg-white rounded-full animate-ping" />
      ) : (
        <Mic className="w-5 h-5" />
      )}
    </button>
  );
}
