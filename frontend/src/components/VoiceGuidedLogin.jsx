import { useState, useEffect, useCallback } from 'react';
import { Mic, MicOff, Check, ChevronRight, Volume2, Phone, Lock, Smartphone } from 'lucide-react';
import useVoiceInput from '../hooks/useVoiceInput';
import useTextToSpeech from '../hooks/useTextToSpeech';

const LOGIN_PROMPTS = {
  en: {
    welcome: 'Welcome to SwasthAI Guardian. For login, please say your registered mobile number.',
    phone: 'Please say your 10-digit mobile number.',
    otp: 'Now please say the 6-digit OTP sent to your phone. If OTP did not arrive, say "Resend".',
    password: 'Please say your password.',
    method_ask: 'Please say "OTP" for one-time password, or "Password" for password login.',
    verify: 'Verifying your details. Please wait.',
    complete: 'You are now logged in. Welcome to SwasthAI Guardian.',
    no_otp: 'OTP not received? Please tap the Resend button, or type manually.',
    error_phone: 'Please say a valid 10-digit mobile number.',
    error_otp: 'Please say a valid 6-digit OTP.',
  },
  hi: {
    welcome: 'SwasthAI Guardian mein aapka swagat hai. Login ke liye apna mobile number boliye.',
    phone: 'Kripya apna 10-ank ka mobile number boliye.',
    otp: 'Ab verification ke liye OTP boliye. Agar OTP nahi aaya hai to "Dobara bhejo" boliye.',
    password: 'Kripya apna password boliye.',
    method_ask: 'Kripya "OTP" ya "Password" boliye.',
    verify: 'Aapki jaankari verify ki ja rahi hai. Kripya prateeksha karein.',
    complete: 'Aap login ho gaye hain. SwasthAI Guardian mein aapka swagat hai.',
    no_otp: 'OTP nahi aaya? Kripya "Dobara bhejo" button dabayein ya manual bharain.',
    error_phone: 'Kripya 10-ank ka valid mobile number boliye.',
    error_otp: 'Kripya 6-ank ka valid OTP boliye.',
  },
  mr: {
    welcome: 'SwasthAI Guardian madhye aaple swagat aahe. Login sathi aapla mobile number bolaa.',
    phone: 'Krupaya aapla 10-ank ka mobile number bolaa.',
    otp: 'Aataa verification sathi OTP bolaa. Jar OTP aala nasel tar "Puna pathaa" bolaa.',
    password: 'Krupaya aapla password bolaa.',
    method_ask: 'Krupaya "OTP" ki "Password" bolaa.',
    verify: 'Aaple details verified kele jaat aahet. Krupaya pratiksha karayla.',
    complete: 'Aap login zale aahat. SwasthAI Guardian madhye aaple swagat aahe.',
    no_otp: 'OTP aala nahi? Krupaya "Puna pathaa" button dabava ki manual bhara.',
    error_phone: 'Krupaya 10-ank cha valid mobile number bolaa.',
    error_otp: 'Krupaya 6-ank cha valid OTP bolaa.',
  },
  ta: {
    welcome: 'SwasthAI Guardian-ku varavekkam. Login-ukaga ungal mobile ennai solungal.',
    phone: 'Ungal 10-ilakkam mobile ennai solungal.',
    otp: 'Ippol OTP-ai solungal. OTP varavillai enal "Muppatum anuppu" solungal.',
    password: 'Ungal kattavai solungal.',
    method_ask: '"OTP" allatu "Password" solungal.',
    verify: 'Ungal vivarangal sari parikkappadukinrana. Kattayum.',
    complete: 'Neengal login agiviteergal. SwasthAI Guardian-ku varavekkam.',
    no_otp: 'OTP varavillaya? "Muppatum anuppu" buttanai aluthu alallu manual-aga nirappungal.',
    error_phone: 'Takovan 10-ilakkam mobile ennai solungal.',
    error_otp: 'Takovan 6-ilakkam OTP-ai solungal.',
  },
  te: {
    welcome: 'SwasthAI Guardian lo miku svagatham. Login kosam mi mobile number cheppandi.',
    phone: 'Mi 10-anukula mobile number cheppandi.',
    otp: 'Ippudu verification kosam OTP cheppandi. OTP rakapotey "Malli pampu" cheppandi.',
    password: 'Mi password cheppandi.',
    method_ask: '"OTP" leka "Password" cheppandi.',
    verify: 'Mi details verify cheyabadutunnayi. Dayachesi aagandi.',
    complete: 'Mee login ayipoyaru. SwasthAI Guardian ku svagatham.',
    no_otp: 'OTP raaleda? Dayachesi "Malli pampu" button ni nokki leka manual ga nirayandi.',
    error_phone: '10-anukula valid mobile number cheppandi.',
    error_otp: '6-anukula valid OTP cheppandi.',
  },
  bn: {
    welcome: 'SwasthAI Guardian-e apnake shagotom. Login-er jonno apnar mobile number bolun.',
    phone: 'Apnar 10-digiter mobile number bolun.',
    otp: 'Ekhon verification-er jonno OTP bolun. Jodi OTP na ashe tahole "Abar pathan" bolun.',
    password: 'Apnar password bolun.',
    method_ask: 'Doya kore "OTP" ba "Password" bolun.',
    verify: 'Apnar details verify kora hoche. Doya kore opekkha korun.',
    complete: 'Apni login korechen. SwasthAI Guardian-e shagotom.',
    no_otp: 'OTP asheni? Doya kore "Abar pathan" button tekan ba manual puron korun.',
    error_phone: '10-digiter valid mobile number bolun.',
    error_otp: '6-digiter valid OTP bolun.',
  },
  gu: {
    welcome: 'SwasthAI Guardian ma tamaru svagat che. Login mate tamaro mobile number bolo.',
    phone: 'Kripya tamaro 10-ank no mobile number bolo.',
    otp: 'Havi verification mate OTP bolo. Jodi OTP na aave to "Fari moklo" bolo.',
    password: 'Kripya tamaru password bolo.',
    method_ask: 'Kripya "OTP" ya "Password" bolo.',
    verify: 'Tamari detail verify thai rahi che. Kripya rah jo.',
    complete: 'Tamaru login thai gayu. SwasthAI Guardian ma tamaru svagat che.',
    no_otp: 'OTP nahi aavyu? Kripya "Fari moklo" button dabav ya manual bharelo.',
    error_phone: '10-ank no valid mobile number bolo.',
    error_otp: '6-ank no valid OTP bolo.',
  },
};

const LOGIN_STEPS = ['method', 'phone', 'credential', 'complete'];

export default function VoiceGuidedLogin({ lang, loginMethod, onResult, onComplete, onCancel }) {
  const currentLang = LOGIN_PROMPTS[lang] ? lang : 'en';
  const prompts = LOGIN_PROMPTS[currentLang] || LOGIN_PROMPTS.en;

  const [stepIndex, setStepIndex] = useState(0);
  const [fieldValue, setFieldValue] = useState('');
  const [loginMode, setLoginMode] = useState(loginMethod || 'otp');
  const { speak } = useTextToSpeech();
  const voice = useVoiceInput({
    lang: currentLang,
    continuous: false,
    onResult: (text) => setFieldValue(text.toLowerCase().trim()),
  });

  const steps = LOGIN_STEPS;
  const currentStep = steps[stepIndex];
  const isLastStep = currentStep === 'complete';

  const speakPrompt = useCallback((step) => {
    const text = prompts[step];
    if (text) speak(text, currentLang);
  }, [prompts, speak, currentLang]);

  useEffect(() => {
    if (stepIndex < steps.length) {
      speakPrompt(steps[stepIndex]);
    }
  }, [stepIndex]);

  const handleNext = () => {
    if (currentStep === 'method') {
      const detected = fieldValue.includes('otp') || fieldValue.includes('password') || fieldValue.includes('pass');
      if (detected && fieldValue.includes('pass')) {
        setLoginMode('password');
      } else if (detected && fieldValue.includes('otp')) {
        setLoginMode('otp');
      }
    }

    if (currentStep === 'phone') {
      const digits = fieldValue.replace(/\D/g, '');
      if (digits.length >= 10) {
        onResult('phone', digits.slice(0, 10));
        setFieldValue('');
        setStepIndex(1);
        return;
      }
    }

    if (currentStep === 'credential') {
      setFieldValue('');
      onComplete({ phone: fieldValue, method: loginMode });
      return;
    }

    setFieldValue('');
    if (stepIndex >= steps.length - 1) {
      onComplete();
    } else {
      setStepIndex(prev => prev + 1);
    }
  };

  const handleListen = () => {
    if (voice.isListening) {
      voice.stopListening();
    } else {
      voice.startListening();
    }
  };

  const handleAutoSubmit = useCallback((text) => {
    if (!text || voice.isListening) return;
    const cleaned = text.toLowerCase().trim();

    if (currentStep === 'method') {
      if (cleaned.includes('password') || cleaned.includes('pass')) {
        setLoginMode('password');
        setFieldValue('');
        setStepIndex(2);
        speakPrompt('password');
      } else if (cleaned.includes('otp')) {
        setLoginMode('otp');
        setFieldValue('');
        setStepIndex(2);
        speakPrompt('otp');
      }
      return;
    }

    if (currentStep === 'phone') {
      const digits = cleaned.replace(/\D/g, '');
      if (digits.length >= 10) {
        onResult('phone', digits.slice(0, 10));
        setFieldValue('');
        setStepIndex(prev => prev + 1);
      }
    }
  }, [currentStep, voice.isListening, speakPrompt, onResult]);

  useEffect(() => {
    if (fieldValue && !voice.isListening) {
      const timer = setTimeout(() => handleAutoSubmit(fieldValue), 800);
      return () => clearTimeout(timer);
    }
  }, [fieldValue, voice.isListening, handleAutoSubmit]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-1.5 mb-6">
            {steps.map((s, i) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-all ${
                  i <= stepIndex ? 'bg-emerald-500' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>

          {voice.isListening && (
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-sm font-bold text-emerald-600">Listening...</span>
            </div>
          )}

          <div className="min-h-[220px] flex flex-col items-center justify-center text-center">
            {currentStep === 'method' && (
              <div className="space-y-4 w-full">
                <div className="w-16 h-16 mx-auto bg-emerald-100 rounded-full flex items-center justify-center">
                  <Smartphone className="w-8 h-8 text-emerald-600" />
                </div>
                <p className="text-lg sm:text-xl font-bold text-slate-900 leading-relaxed">
                  {prompts.welcome}
                </p>
                <p className="text-sm text-slate-500">Say "OTP" or "Password" to choose, or select below.</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => { setLoginMode('otp'); setStepIndex(2); speakPrompt('otp'); }}
                    className={`flex-1 py-3 rounded-xl font-bold text-base border-2 transition-all ${
                      loginMode === 'otp'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300'
                    }`}
                  >
                    OTP Login
                  </button>
                  <button
                    onClick={() => { setLoginMode('password'); setStepIndex(2); speakPrompt('password'); }}
                    className={`flex-1 py-3 rounded-xl font-bold text-base border-2 transition-all ${
                      loginMode === 'password'
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    Password
                  </button>
                </div>
              </div>
            )}

            {currentStep === 'phone' && (
              <div className="w-full space-y-4">
                <div className="w-14 h-14 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                  <Phone className="w-7 h-7 text-blue-600" />
                </div>
                <p className="text-lg font-bold text-slate-800">{prompts.phone}</p>
                <input
                  type="tel"
                  value={fieldValue}
                  onChange={(e) => setFieldValue(e.target.value)}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-lg font-semibold text-center focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
                  autoFocus
                />
                {voice.error && <p className="text-sm text-rose-600 font-medium">{voice.error}</p>}
              </div>
            )}

            {currentStep === 'credential' && (
              <div className="w-full space-y-4">
                <div className="w-14 h-14 mx-auto bg-amber-100 rounded-full flex items-center justify-center">
                  <Lock className="w-7 h-7 text-amber-600" />
                </div>
                <p className="text-lg font-bold text-slate-800">
                  {loginMode === 'otp' ? prompts.otp : prompts.password}
                </p>
                <input
                  type={loginMode === 'password' ? 'password' : 'text'}
                  value={fieldValue}
                  onChange={(e) => setFieldValue(e.target.value)}
                  placeholder={loginMode === 'otp' ? '6-digit OTP' : 'Your password'}
                  maxLength={loginMode === 'otp' ? 6 : undefined}
                  inputMode={loginMode === 'otp' ? 'numeric' : 'text'}
                  className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-lg font-semibold text-center focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
                  autoFocus
                />
                {loginMode === 'otp' && (
                  <p className="text-sm text-slate-500">{prompts.no_otp}</p>
                )}
                {voice.error && <p className="text-sm text-rose-600 font-medium">{voice.error}</p>}
              </div>
            )}

            {isLastStep && (
              <div className="space-y-4 py-4">
                <div className="w-16 h-16 mx-auto bg-emerald-600 rounded-full flex items-center justify-center">
                  <Check className="w-8 h-8 text-white" />
                </div>
                <p className="text-xl font-bold text-slate-900">{prompts.complete}</p>
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-6">
            {currentStep !== 'method' && !isLastStep && (
              <button
                onClick={handleListen}
                className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 transition-all ${
                  voice.isListening ? 'bg-rose-500 text-white ring-4 ring-rose-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                aria-label={voice.isListening ? 'Stop listening' : 'Start voice input'}
              >
                {voice.isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </button>
            )}

            <button
              onClick={handleNext}
              disabled={!isLastStep && !fieldValue.trim()}
              className="flex-1 py-4 bg-slate-900 text-white rounded-xl font-bold text-base transition-all hover:bg-slate-800 disabled:opacity-40 flex items-center justify-center gap-2"
            >
              {isLastStep ? 'Go to Dashboard' : 'Next'}
              {!isLastStep && <ChevronRight className="w-5 h-5" />}
            </button>
          </div>

          <button
            onClick={onCancel}
            className="w-full mt-3 py-2 text-sm font-semibold text-slate-400 hover:text-slate-600 transition-colors"
          >
            Skip voice guide — fill manually
          </button>
        </div>
      </div>
    </div>
  );
}
