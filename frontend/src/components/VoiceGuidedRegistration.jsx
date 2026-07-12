import { useState, useEffect, useCallback } from 'react';
import { Mic, MicOff, Check, ChevronRight, Volume2 } from 'lucide-react';
import useVoiceInput from '../hooks/useVoiceInput';
import useTextToSpeech from '../hooks/useTextToSpeech';

const GUIDANCE_PROMPTS = {
  en: {
    welcome: 'Welcome to SwasthAI Guardian. Let us help you create your account. Please say your name.',
    name: 'Please say your full name.',
    phone: 'Please say your 10-digit mobile number.',
    village: 'Please say your village or area name.',
    password: 'Please say a password. Use at least 8 characters.',
    complete: 'Thank you. Your account is being created.',
  },
  hi: {
    welcome: 'SwasthAI Guardian mein aapka swagat hai. Kripya apna naam boliye.',
    name: 'Kripya apna poora naam boliye.',
    phone: 'Kripya apna 10-ank ka mobile number boliye.',
    village: 'Kripya apne gaon ka naam boliye.',
    password: 'Kripya ek password boliye. Kam se kam 8 characters ka ho.',
    complete: 'Dhanyavaad. Aapka account bana ja raha hai.',
  },
  mr: {
    welcome: 'SwasthAI Guardian madhye aaple swagat aahe. Krupaya aaple naav bolaa.',
    name: 'Krupaya aaple poora naav bolaa.',
    phone: 'Krupaya aapla 10-ank ka mobile number bolaa.',
    village: 'Krupaya aaplya gaavacha naav bolaa.',
    password: 'Krupaya ek password bolaa. Kamaat kami 8 characters asa.',
    complete: 'Dhanyavaad. Aaple account banvat aahe.',
  },
  ta: {
    welcome: 'SwasthAI Guardian-ku varavekkam. Ungal peyarai solungal.',
    name: 'Ungal peyarai solungal.',
    phone: 'Ungal 10-ilakkam mobile ennai solungal.',
    village: 'Ungal gramathin peyarai solungal.',
    password: 'Oru kattavai solungal. 8 eluthukalukku kuraiyathu.',
    complete: 'Nandri. Ungal kol argal udan akkappadum.',
  },
  te: {
    welcome: 'SwasthAI Guardian lo miku svagatham. Mi parea cheppandi.',
    name: 'Mi parea cheppandi.',
    phone: 'Mi 10-anukula mobile number cheppandi.',
    village: 'Mi gramam peru cheppandi.',
    password: 'Oka password cheppandi. Kuda padu 8 characters to display.',
    complete: 'Dhanyavadaluu. Miku account akshayam. Thank you, ra.',
  },
  bn: {
    welcome: 'SwasthAI Guardian - e apnake shagotom. Doya kore apnar naam bolun.',
    name: 'Apnar naam bolun.',
    phone: 'Apnar 10-digiter mobile number bolun.',
    village: 'Apnar graamer naam bolun.',
    password: 'Ekta password bolun. Sorboninnho 8 characters hobe.',
    complete: 'Shubheccha. Apnar account ti toiri hocche.',
  },
  gu: {
    welcome: 'SwasthAI Guardian ma tamaru svagat che. Kripya tamaru naam bolo.',
    name: 'Kripya tamaru naam bolo.',
    phone: 'Kripya tamaro 10-ank no mobile number bolo.',
    village: 'Kripya tamaru gamnu naam bolo.',
    password: 'Kripya ek password bolo. Ochatam 8 characters no hoy.',
    complete: 'Aabhar. Tamaru account taiyar thai rahyu che.',
  },
};

const STEP_FIELDS = ['name', 'phone', 'village', 'password'];

export default function VoiceGuidedRegistration({ lang, onFieldResult, onComplete, onCancel }) {
  const currentLang = GUIDANCE_PROMPTS[lang] ? lang : 'en';
  const prompts = GUIDANCE_PROMPTS[currentLang] || GUIDANCE_PROMPTS.en;

  const [stepIndex, setStepIndex] = useState(0);
  const [fieldValue, setFieldValue] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const { speak } = useTextToSpeech();
  const voice = useVoiceInput({
    lang: currentLang,
    continuous: false,
    onResult: (text) => setFieldValue(text),
  });

  const steps = ['welcome', ...STEP_FIELDS, 'complete'];
  const currentStep = steps[stepIndex];
  const totalSteps = steps.length;

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
    if (currentStep !== 'welcome' && currentStep !== 'complete' && fieldValue.trim()) {
      onFieldResult(currentStep, fieldValue.trim());
    }
    setFieldValue('');
    setConfirmed(false);
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

  const isInputStep = currentStep !== 'welcome' && currentStep !== 'complete';
  const isLastStep = currentStep === 'complete';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="p-6 sm:p-8">
          {/* Progress */}
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

          {/* Mic listening indicator */}
          {voice.isListening && (
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-sm font-bold text-emerald-600">Listening...</span>
            </div>
          )}

          {/* Step content */}
          <div className="min-h-[200px] flex flex-col items-center justify-center text-center">
            {currentStep === 'welcome' && (
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-emerald-100 rounded-full flex items-center justify-center">
                  <Volume2 className="w-8 h-8 text-emerald-600" />
                </div>
                <p className="text-xl sm:text-2xl font-bold text-slate-900 leading-relaxed">
                  {prompts.welcome}
                </p>
                <p className="text-sm text-slate-500">Tap "Next" to begin, or speak your name now.</p>
              </div>
            )}

            {isInputStep && (
              <div className="w-full space-y-4">
                <p className="text-lg font-bold text-slate-800">{prompts[currentStep]}</p>

                <div className="relative">
                  <input
                    type={currentStep === 'password' ? 'password' : 'text'}
                    value={fieldValue}
                    onChange={(e) => setFieldValue(e.target.value)}
                    placeholder={
                      currentStep === 'name' ? 'Your name' :
                      currentStep === 'phone' ? '10-digit mobile number' :
                      currentStep === 'village' ? 'Village or area' : 'Create a password'
                    }
                    className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-lg font-semibold text-center focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
                    autoFocus
                  />
                </div>

                {voice.error && (
                  <p className="text-sm text-rose-600 font-medium">{voice.error}</p>
                )}
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

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            {isInputStep && (
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
              disabled={isInputStep && !fieldValue.trim()}
              className="flex-1 py-4 bg-slate-900 text-white rounded-xl font-bold text-base transition-all hover:bg-slate-800 disabled:opacity-40 flex items-center justify-center gap-2"
            >
              {isLastStep ? 'Finish' : 'Next'}
              {!isLastStep && <ChevronRight className="w-5 h-5" />}
            </button>
          </div>

          <button
            onClick={onCancel}
            className="w-full mt-3 py-2 text-sm font-semibold text-slate-400 hover:text-slate-600 transition-colors"
          >
            Skip guided mode — fill manually
          </button>
        </div>
      </div>
    </div>
  );
}
