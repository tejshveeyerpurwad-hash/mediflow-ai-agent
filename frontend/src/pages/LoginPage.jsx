import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useVoiceGuidance } from '../context/VoiceGuidanceContext';
import VoiceGuidedLogin from '../components/VoiceGuidedLogin';
import ASHAVillagerRegistration from '../components/ASHAVillagerRegistration';
import useTextToSpeech from '../hooks/useTextToSpeech';
import {
  HeartPulse, Shield, Phone, Mail, Lock, User,
  ArrowRight, ChevronLeft, MapPin, AlertCircle,
  ShieldCheck, Wifi, Zap, WifiOff, Globe,
  Eye, EyeOff, Clock, KeyRound, BadgeCheck, RotateCcw,
  Mic, Headphones, Smartphone, Fingerprint, HelpCircle,
  CheckCircle, RefreshCw, MessageSquare
} from 'lucide-react';

const OFFLINE_CACHE_KEY = 'swasthai_offline_user_cache';
const DEMO_SECRET = 'Demo@1234';
const demoCredentialHash = (id, role, secret = DEMO_SECRET) => btoa(`${id}:${role}:${secret}`);
const DEMO_CREDENTIALS = [
  { id: '9876543210', credentialHash: demoCredentialHash('9876543210', 'villager'), role: 'villager', name: 'Ramesh Singh' },
  { id: '9876543211', credentialHash: demoCredentialHash('9876543211', 'ngo'), role: 'ngo', name: 'Anjali Sharma' },
  { id: 'admin@swasthai.in', credentialHash: demoCredentialHash('admin@swasthai.in', 'admin'), role: 'admin', name: 'District Administrator' },
];

function normalizeOfflineUsers(users) {
  return (Array.isArray(users) ? users : []).map(user => {
    const identifier = user.id || user.email || user.phone || user.username;
    const next = { ...user };
    if (!next.credentialHash && next.password && identifier && next.role) {
      next.credentialHash = demoCredentialHash(identifier, next.role, next.password);
    }
    delete next.password;
    return next;
  });
}

function seedOfflineCache() {
  const existing = normalizeOfflineUsers(JSON.parse(localStorage.getItem(OFFLINE_CACHE_KEY) || '[]'));
  const merged = [...existing];
  DEMO_CREDENTIALS.forEach(demoUser => {
    const idx = merged.findIndex(u => u.id === demoUser.id && u.role === demoUser.role);
    if (idx >= 0) merged[idx] = { ...merged[idx], ...demoUser };
    else merged.push(demoUser);
  });
  localStorage.setItem(OFFLINE_CACHE_KEY, JSON.stringify(merged));
}

function tryOfflineLogin(identifier, passwordOrOtp, loginMethod, role) {
  try {
    const cached = normalizeOfflineUsers(JSON.parse(localStorage.getItem(OFFLINE_CACHE_KEY) || '[]'));
    localStorage.setItem(OFFLINE_CACHE_KEY, JSON.stringify(cached));
    const user = cached.find(u => {
      const idMatch = u.id === identifier;
      const roleMatch = !role || u.role === role;
      if (loginMethod === 'otp') {
        return idMatch && roleMatch && passwordOrOtp === '1234';
      }
      const expectedHash = demoCredentialHash(identifier, role, passwordOrOtp);
      return idMatch && roleMatch && u.credentialHash === expectedHash;
    });
    return user || null;
  } catch (e) {
    return null;
  }
}

function cacheUserAfterLogin(identifier, password, role, name) {
  try {
    const existing = JSON.parse(localStorage.getItem(OFFLINE_CACHE_KEY) || '[]');
    const idx = existing.findIndex(u => u.id === identifier && u.role === role);
    const entry = { id: identifier, credentialHash: demoCredentialHash(identifier, role, password), role, name: name || identifier };
    if (idx >= 0) existing[idx] = entry;
    else existing.push(entry);
    localStorage.setItem(OFFLINE_CACHE_KEY, JSON.stringify(existing));
  } catch (e) { /* storage full — ignore */ }
}

const TRUST_INDICATORS = [
  { icon: ShieldCheck, label: 'Secure Authentication' },
  { icon: BadgeCheck, label: 'ABDM Ready' },
  { icon: Lock, label: 'Encrypted Sessions' },
  { icon: KeyRound, label: 'Role Based Access' },
  { icon: Wifi, label: 'Offline First' },
  { icon: Clock, label: 'Multi Language' },
];

const ROLES = [
  { id: 'villager', label: 'Villager', sub: 'Patient / Citizen', icon: User, badge: 'Self Service', badgeColor: 'bg-emerald-100 text-emerald-700' },
  { id: 'ngo', label: 'ASHA Worker', sub: 'Healthcare Provider', icon: Shield, badge: 'Field Worker', badgeColor: 'bg-blue-100 text-blue-700' },
  { id: 'admin', label: 'Admin', sub: 'District Management', icon: MapPin, badge: 'Administrator', badgeColor: 'bg-purple-100 text-purple-700' },
];

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const { lang, setLang, t } = useLanguage();
  const [loginMethod, setLoginMethod] = useState('otp');
  const [formData, setFormData] = useState({ identifier: '', password: '', otp: '', role: 'villager' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [usedOfflineFallback, setUsedOfflineFallback] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [otpResendTimer, setOtpResendTimer] = useState(0);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [otpFocusedIndex, setOtpFocusedIndex] = useState(0);
  const [useOtpBoxes, setUseOtpBoxes] = useState(false);
  const [authMode, setAuthMode] = useState('otp');
  const [showVoiceLogin, setShowVoiceLogin] = useState(false);
  const [showASHAInfo, setShowASHAInfo] = useState(false);
  const [showASHAVillagerReg, setShowASHAVillagerReg] = useState(false);
  const [voiceLoginResult, setVoiceLoginResult] = useState(null);
  const [otpRetryCount, setOtpRetryCount] = useState(0);
  const [showOtpHelp, setShowOtpHelp] = useState(false);
  const identifierRef = useRef(null);
  const otpRefs = useRef([]);

  const { simpleMode, toggleSimpleMode } = useVoiceGuidance();
  const { loginPassword, loginOTP, setUser, dismissSessionExpiry, dismissIdleExpiry } = useAuth();
  const { speak } = useTextToSpeech();
  const navigate = useNavigate();

  useEffect(() => {
    const expired = searchParams.get('expired');
    if (expired === 'session') {
      setError('Your session has expired. Please sign in again.');
      if (dismissSessionExpiry) dismissSessionExpiry();
    } else if (expired === 'idle') {
      setError('You were signed out due to inactivity.');
      if (dismissIdleExpiry) dismissIdleExpiry();
    }
  }, [searchParams, dismissSessionExpiry, dismissIdleExpiry]);

  useEffect(() => {
    seedOfflineCache();
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
    if (identifierRef.current) identifierRef.current.focus();
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  }, []);

  const handleOtpDigitChange = useCallback((index, value) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d$/.test(value) && value !== '') return;
    setOtpDigits(prev => {
      const next = [...prev];
      next[index] = value;
      const fullOtp = next.join('');
      if (fullOtp.length === 6) {
        setFormData(prev => ({ ...prev, otp: fullOtp }));
      } else {
        setFormData(prev => ({ ...prev, otp: fullOtp }));
      }
      return next;
    });
    if (value !== '' && index < 5) {
      setOtpFocusedIndex(index + 1);
      setTimeout(() => otpRefs.current[index + 1]?.focus(), 50);
    }
  }, []);

  const handleOtpKeyDown = useCallback((index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      setOtpFocusedIndex(index - 1);
      setTimeout(() => otpRefs.current[index - 1]?.focus(), 50);
    }
    if (e.key === 'Enter') {
      const fullOtp = otpDigits.join('');
      if (fullOtp.length === 6) handleSubmit(e);
    }
  }, [otpDigits]);

  const handleOtpPaste = useCallback((e) => {
    const pasted = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length > 0) {
      const next = ['', '', '', '', '', ''];
      for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
      setOtpDigits(next);
      setFormData(prev => ({ ...prev, otp: pasted }));
      if (pasted.length === 6) {
        setOtpFocusedIndex(5);
      } else {
        setOtpFocusedIndex(pasted.length);
        setTimeout(() => otpRefs.current[pasted.length]?.focus(), 50);
      }
    }
  }, []);

  const resetOtpBoxes = useCallback(() => {
    setOtpDigits(['', '', '', '', '', '']);
    setOtpFocusedIndex(0);
    setFormData(prev => ({ ...prev, otp: '' }));
    setTimeout(() => otpRefs.current[0]?.focus(), 50);
  }, []);

  const handleVoiceLoginResult = useCallback((field, value) => {
    if (field === 'phone') {
      setFormData(prev => ({ ...prev, identifier: value }));
    }
  }, []);

  const handleVoiceLoginComplete = useCallback(async (result) => {
    setShowVoiceLogin(false);
    if (result && result.phone) {
      setFormData(prev => ({ ...prev, identifier: result.phone }));
    }
    speak('Aapka phone number bhar diya gaya hai. Ab login karein.', lang);
  }, [lang]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    const credential = loginMethod === 'password' ? formData.password : formData.otp;
    if (!formData.identifier || !credential) {
      setError('Please fill in all required fields.');
      setIsLoading(false);
      return;
    }

    try {
      if (loginMethod === 'password') {
        await loginPassword(formData.identifier, formData.password, formData.role);
      } else {
        await loginOTP(formData.identifier, formData.otp, formData.role);
      }
      cacheUserAfterLogin(formData.identifier, credential, formData.role);
      setUsedOfflineFallback(false);
      navigate(`/${formData.role}`);
    } catch (err) {
      const isNetworkErr = !err.response || err.code === 'ECONNABORTED' || err.message?.toLowerCase().includes('network');
      if (isNetworkErr) {
        const offlineUser = tryOfflineLogin(formData.identifier, credential, loginMethod, formData.role);
        if (offlineUser) {
          const offlineToken = `offline_session_${offlineUser.role}_${Date.now()}`;
          localStorage.setItem('token', offlineToken);
          localStorage.setItem('swasthai_session_start', String(Date.now()));
          localStorage.setItem('swasthai_session_id', `offline_${Date.now()}`);
          const userPayload = {
            id: offlineUser.id || `offline_${offlineUser.role}`,
            name: offlineUser.name,
            role: offlineUser.role,
            villageId: 'v101',
            isOfflineSession: true
          };
          localStorage.setItem('user', JSON.stringify(userPayload));
          setUser(userPayload);
          setUsedOfflineFallback(true);
          setIsLoading(false);
          setTimeout(() => navigate(`/${offlineUser.role}`), 400);
          return;
        }
        setError('No internet connection. Use demo credentials below for local-only offline mode.');
      } else if (err.message?.includes('Incorrect password') || err.message?.includes('incorrect')) {
        setError('Invalid credentials. Please check your password and try again.');
      } else if (err.message?.includes('registered as')) {
        setError(err.message);
      } else if (err.message?.includes('No account found')) {
        setError('No account found with these details. Please register first.');
      } else {
        setError(err.message || 'Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleLabel = (roleId) => {
    if (roleId === 'villager') return t.roles?.villager || 'Villager';
    if (roleId === 'ngo') return t.roles?.ngo || 'ASHA Worker';
    if (roleId === 'admin') return t.roles?.admin || 'Admin';
    return roleId;
  };

  const roles = ROLES.map(r => ({
    ...r,
    label: getRoleLabel(r.id),
    sub: r.id === 'villager' ? (t.loginPage?.villager_sub || 'Patient / Citizen') :
         r.id === 'ngo' ? (t.loginPage?.ngo_sub || 'Healthcare Provider') :
         (t.loginPage?.admin_sub || 'District Management'),
  }));

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
          {[
            { code: 'hi', label: 'हिन्दी' },
            { code: 'en', label: 'English' },
            { code: 'mr', label: 'मराठी' },
            { code: 'ta', label: 'தமிழ்' },
            { code: 'te', label: 'తెలుగు' },
            { code: 'bn', label: 'বাংলা' },
          ].map(l => (
            <option key={l.code} value={l.code}>{l.label}</option>
          ))}
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
            Connecting every citizen to<br />
            <span className="text-emerald-400">quality healthcare.</span>
          </motion.h2>

          <motion.p
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
            className="text-emerald-100/60 text-sm leading-relaxed font-medium max-w-md"
          >
            Securely access your medical records, consult with professionals, and request emergency assistance in your local language.
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
              <ShieldCheck className="w-3.5 h-3.5" /> Secure Sign In
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-1">
              Welcome back
            </h2>
            <p className="text-sm text-slate-400 font-medium">
              Please sign in to access your dashboard.
            </p>
            <div className="flex gap-2 mt-3">
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
                <WifiOff className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                <div>
                  <p className="font-bold">Demo Offline Mode</p>
                  <p className="text-amber-700 text-xs mt-0.5">Local-only credentials are enabled. Production uses backend OTP/password verification.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-sm font-bold text-rose-700"
              >
                <AlertCircle className="w-4 h-4 shrink-0" /> {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mb-6">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block">
              Select Account Type
            </label>
            <div className="grid grid-cols-3 gap-3">
              {roles.map(r => (
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
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!simpleMode && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
                {[
                  { id: 'otp', label: 'OTP Login', sub: 'Via SMS', icon: Smartphone, color: 'bg-emerald-50 border-emerald-200 text-emerald-600' },
                  { id: 'password', label: 'Password', sub: 'Account password', icon: Lock, color: 'bg-slate-50 border-slate-200 text-slate-600' },
                  { id: 'voice', label: 'Voice Login', sub: 'Say your number', icon: Mic, color: 'bg-blue-50 border-blue-200 text-blue-600' },
                  { id: 'asha', label: 'ASHA Help', sub: 'Worker assisted', icon: Headphones, color: 'bg-amber-50 border-amber-200 text-amber-600' },
                  { id: 'offline', label: 'Offline', sub: 'Pending verification', icon: WifiOff, color: 'bg-purple-50 border-purple-200 text-purple-600' },
                  { id: 'biometric', label: 'Biometric', sub: 'Fingerprint / Face', icon: Fingerprint, color: 'bg-rose-50 border-rose-200 text-rose-600' },
                ].map(m => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      setAuthMode(m.id);
                      if (m.id === 'voice') setShowVoiceLogin(true);
                      if (m.id === 'asha') setShowASHAInfo(true);
                      if (m.id === 'otp' || m.id === 'password') setLoginMethod(m.id);
                    }}
                    className={`p-2.5 sm:p-3 rounded-xl border-2 text-left transition-all ${
                      authMode === m.id && (m.id === 'otp' || m.id === 'password')
                        ? 'bg-white border-emerald-500 shadow-sm'
                        : 'bg-white border-slate-100 hover:border-slate-300 hover:shadow-sm'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-1.5 ${m.color.split(' ').slice(0, 2).join(' ')}`}>
                      <m.icon className="w-4 h-4" />
                    </div>
                    <p className="font-bold text-xs leading-tight text-slate-800">{m.label}</p>
                    <p className="text-[10px] font-medium text-slate-400 mt-0.5">{m.sub}</p>
                    {m.id === 'biometric' && (
                      <span className="inline-block mt-1 px-1.5 py-0.5 bg-rose-100 text-rose-600 text-[9px] font-bold rounded">Soon</span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {authMode === 'voice' && !showVoiceLogin && (
              <button
                type="button"
                onClick={() => setShowVoiceLogin(true)}
                className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-base hover:bg-blue-500 transition-all flex items-center justify-center gap-3"
              >
                <Mic className="w-6 h-6" />
                Login by Voice
              </button>
            )}

            {authMode === 'asha' && showASHAInfo && (
              <motion.div
                initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                    <Headphones className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-amber-900">Need Help Logging In?</p>
                    <p className="text-xs text-amber-700 mt-0.5">
                      An ASHA worker can assist you with login or register you as a new patient.
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setShowASHAInfo(false);
                      setShowASHAVillagerReg(true);
                    }}
                    className="flex-1 py-2.5 bg-amber-600 text-white rounded-lg font-bold text-xs hover:bg-amber-500 transition-all"
                  >
                    Register with ASHA
                  </button>
                  <button
                    onClick={() => setShowASHAInfo(false)}
                    className="flex-1 py-2.5 bg-white border border-amber-300 text-amber-700 rounded-lg font-bold text-xs hover:bg-amber-50 transition-all"
                  >
                    I'll try myself
                  </button>
                </div>
              </motion.div>
            )}

            {authMode === 'offline' && (
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <WifiOff className="w-6 h-6 text-purple-600" />
                  <div>
                    <p className="font-bold text-sm text-purple-900">Offline Pending Verification</p>
                    <p className="text-xs text-purple-700 mt-0.5">
                      If you registered offline, your data will sync when internet is available.
                      Login using your credentials once synced.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {authMode === 'biometric' && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-center">
                <Fingerprint className="w-10 h-10 mx-auto text-rose-400 mb-2" />
                <p className="font-bold text-sm text-rose-900">Biometric Authentication Coming Soon</p>
                <p className="text-xs text-rose-700 mt-1">
                  Fingerprint and face authentication will be available in a future update.
                </p>
              </div>
            )}

            {(authMode === 'otp' || authMode === 'password') && (
              <>
            <div className="flex p-1 bg-slate-100 rounded-xl">
              {[
                { id: 'password', label: 'Password' },
                { id: 'otp', label: 'OTP (Mobile)' }
              ].map(m => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setLoginMethod(m.id)}
                  className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
                    loginMethod === m.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 mb-1.5 block">
                {simpleMode ? 'Mobile Number' : 'Phone Number or Email'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-slate-400">
                  {formData.identifier.includes('@') ? <Mail className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                </div>
                <input
                  ref={identifierRef}
                  type="text"
                  name="identifier"
                  value={formData.identifier}
                  onChange={handleInputChange}
                  placeholder="e.g. 9876543210"
                  autoComplete="username"
                  required
                  className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-base font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-300"
                />
                <button
                  type="button"
                  onClick={() => setShowVoiceLogin(true)}
                  className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-emerald-600 transition-colors"
                  aria-label="Voice input phone number"
                  tabIndex={-1}
                >
                  <Mic className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between ml-1 mb-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {simpleMode ? (loginMethod === 'password' ? 'Password' : 'One Time Code') : (loginMethod === 'password' ? 'Password' : 'OTP')}
                </label>
                {loginMethod === 'password' && (
                  <button type="button" className="text-xs font-bold text-emerald-600 hover:text-emerald-700">
                    Forgot?
                  </button>
                )}
                {loginMethod === 'otp' && !simpleMode && (
                  <button
                    type="button"
                    onClick={() => setUseOtpBoxes(prev => !prev)}
                    className="text-xs font-medium text-slate-400 hover:text-slate-600"
                  >
                    {useOtpBoxes ? 'Single input' : 'Digit boxes'}
                  </button>
                )}
              </div>

              {loginMethod === 'otp' && useOtpBoxes ? (
                <div className="space-y-2">
                  <div className="flex gap-2 justify-center" onPaste={handleOtpPaste}>
                    {otpDigits.map((digit, index) => (
                      <input
                        key={index}
                        ref={el => otpRefs.current[index] = el}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpDigitChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        onFocus={() => setOtpFocusedIndex(index)}
                        className={`w-12 h-14 sm:w-14 sm:h-14 bg-slate-50 border-2 rounded-xl text-center text-xl font-bold text-slate-900 outline-none transition-all ${
                          otpFocusedIndex === index
                            ? 'border-emerald-500 ring-4 ring-emerald-500/10 bg-white'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                        autoComplete="one-time-code"
                        aria-label={`OTP digit ${index + 1}`}
                      />
                    ))}
                  </div>

                  <div className="flex justify-between items-center">
                    {otpResendTimer > 0 ? (
                      <span className="text-xs text-slate-400 font-medium">Resend in {otpResendTimer}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setOtpResendTimer(30);
                          setOtpRetryCount(prev => prev + 1);
                          resetOtpBoxes();
                          setShowOtpHelp(true);
                          const interval = setInterval(() => {
                            setOtpResendTimer(prev => {
                              if (prev <= 1) { clearInterval(interval); return 0; }
                              return prev - 1;
                            });
                          }, 1000);
                        }}
                        className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" /> Resend OTP
                      </button>
                    )}
                    <span className="text-[10px] text-slate-400">Retry #{otpRetryCount}</span>
                  </div>

                  {showOtpHelp && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                      className="p-3 bg-blue-50 border border-blue-200 rounded-lg"
                    >
                      <p className="text-xs font-semibold text-blue-800 flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5" /> Didn't receive OTP?
                      </p>
                      <ul className="mt-1.5 text-xs text-blue-700 space-y-1 ml-4 list-disc">
                        <li>Check your mobile network</li>
                        <li>Ensure the number is registered with your Aadhaar</li>
                        <li>Wait 30 seconds and tap "Resend OTP"</li>
                        <li>Use <strong>1234</strong> as demo OTP for evaluation</li>
                      </ul>
                    </motion.div>
                  )}
                </div>
              ) : (
              <div className="relative">
                <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={loginMethod === 'password' ? (showPassword ? 'text' : 'password') : 'text'}
                  name={loginMethod === 'password' ? 'password' : 'otp'}
                  value={loginMethod === 'password' ? formData.password : formData.otp}
                  onChange={(e) => {
                    const { name, value } = e.target;
                    setFormData(prev => ({ ...prev, [name]: value }));
                    setError('');
                    if (name === 'otp') {
                      const digits = value.replace(/\D/g, '').slice(0, 6);
                      if (digits.length === 6 && value.length <= 6) {
                        setOtpDigits(digits.split(''));
                      }
                    }
                  }}
                  placeholder={loginMethod === 'password' ? (simpleMode ? 'Enter password' : 'Enter your password') : (simpleMode ? 'Enter 6-digit code' : 'Enter 6-digit OTP')}
                  autoComplete={loginMethod === 'password' ? 'current-password' : 'one-time-code'}
                  inputMode={loginMethod === 'otp' ? 'numeric' : 'text'}
                  pattern={loginMethod === 'otp' ? '[0-9]*' : undefined}
                  maxLength={loginMethod === 'otp' ? 6 : undefined}
                  required
                  className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-base font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-300"
                />
                {loginMethod === 'password' && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="absolute inset-y-0 right-3.5 flex items-center text-slate-400 hover:text-slate-600"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                )}
              </div>
              )}

              {loginMethod === 'otp' && !useOtpBoxes && (
                <div className="mt-2 flex justify-between items-center">
                  {otpResendTimer > 0 ? (
                    <span className="text-xs text-slate-400 font-medium">Resend in {otpResendTimer}s</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setOtpResendTimer(30);
                        setOtpRetryCount(prev => prev + 1);
                        setShowOtpHelp(true);
                        const interval = setInterval(() => {
                          setOtpResendTimer(prev => {
                            if (prev <= 1) { clearInterval(interval); return 0; }
                            return prev - 1;
                          });
                        }, 1000);
                      }}
                      className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" /> Resend OTP
                    </button>
                  )}
                  <span className="text-[10px] text-slate-400">Retry #{otpRetryCount}</span>
                </div>
              )}
              {loginMethod === 'otp' && !useOtpBoxes && showOtpHelp && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                  className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg"
                >
                  <p className="text-xs font-semibold text-blue-800 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5" /> Didn't receive OTP?
                  </p>
                  <ul className="mt-1.5 text-xs text-blue-700 space-y-1 ml-4 list-disc">
                    <li>Check your mobile network</li>
                    <li>Ensure the number is registered with your Aadhaar</li>
                    <li>Wait 30 seconds and tap "Resend OTP"</li>
                    <li>Demo: use <strong>1234</strong> as OTP</li>
                  </ul>
                </motion.div>
              )}
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in...</>
              ) : usedOfflineFallback ? (
                <><Wifi className="w-4 h-4" /> Offline Session Active</>
              ) : (
                <>{'Sign In'} <ArrowRight className="w-4 h-4" /></>
              )}
            </motion.button>
            </>
            )}

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" /> Demo Credentials
                </p>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-md">
                  Offline Ready
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { roleLabel: 'Villager', roleId: 'villager', id: '9876543210', pass: 'Demo@1234' },
                  { roleLabel: 'ASHA Worker', roleId: 'ngo', id: '9876543211', pass: 'Demo@1234' },
                  { roleLabel: 'Admin', roleId: 'admin', id: 'admin@swasthai.in', pass: 'Demo@1234' },
                ].map(d => (
                  <button
                    key={d.roleId}
                    type="button"
                    onClick={async () => {
                      setFormData({ identifier: d.id, password: d.pass, otp: '', role: d.roleId });
                      setIsLoading(true);
                      setError('');
                      try {
                        await loginPassword(d.id, d.pass, d.roleId);
                        navigate(`/${d.roleId}`);
                      } catch (err) {
                        setError('Login failed. Please try again.');
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                    className="bg-white rounded-lg p-2 border border-emerald-100 text-left hover:border-emerald-300 transition-all text-sm"
                  >
                    <p className="text-[10px] font-bold text-emerald-600">{d.roleLabel}</p>
                    <p className="text-xs font-semibold text-slate-700 truncate">{d.id}</p>
                    <p className="text-xs text-slate-500">{d.pass}</p>
                  </button>
                ))}
              </div>
              <p className="text-xs text-emerald-600 font-medium">
                Demo OTP: Use <span className="font-bold text-emerald-800">1234</span> for walkthrough evaluation.
              </p>
            </div>
          </form>

          {!simpleMode && (
            <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                  <HelpCircle className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-emerald-900">Need Help? Register with ASHA Worker</p>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    If you cannot register yourself, an ASHA worker can help you create your account.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowASHAVillagerReg(true)}
                className="w-full py-2.5 bg-emerald-600 text-white rounded-lg font-bold text-xs hover:bg-emerald-500 transition-all flex items-center justify-center gap-2"
              >
                <Headphones className="w-4 h-4" /> Register with ASHA Worker
              </button>
            </div>
          )}

          <div className="mt-4 text-center p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-sm text-slate-500 font-medium">
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-emerald-600 hover:text-emerald-700 underline underline-offset-2">
                Create one here
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      {showVoiceLogin && (
        <VoiceGuidedLogin
          lang={lang}
          loginMethod={loginMethod}
          onResult={handleVoiceLoginResult}
          onComplete={handleVoiceLoginComplete}
          onCancel={() => setShowVoiceLogin(false)}
        />
      )}

      {showASHAVillagerReg && (
        <ASHAVillagerRegistration
          onClose={() => setShowASHAVillagerReg(false)}
        />
      )}
    </div>
  );
}
