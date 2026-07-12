import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const SIMPLE_MODE_KEY = 'swasthai_simple_mode';
const VOICE_GUIDED_KEY = 'swasthai_voice_guided';
const GUIDED_STEPS = ['welcome', 'name', 'phone', 'village', 'password', 'complete'];

const LOGIN_GUIDE_PROMPTS = {
  en: 'Welcome to SwasthAI Guardian. Tap the microphone button or type your registered mobile number. Then enter the code sent to your phone.',
  hi: 'SwasthAI Guardian mein aapka swagat hai. Kripya apna mobile number boliye ya type karein. Phir aapke phone par bheja gaya code daalein.',
  mr: 'SwasthAI Guardian madhye aaple swagat aahe. Krupaya aapla mobile number bolaa ki type kara. Nantar aaplya phone var pathavlela code takaa.',
  ta: 'SwasthAI Guardian-ku varavekkam. Ungal mobile ennai solungal allatu type seyyungal. Piragu ungal kai pesiyil vanta kodai uzhuthungal.',
  te: 'SwasthAI Guardian lo miku svagatham. Mi mobile number cheppandi leka type cheyandi. Taruvata mi phone ki vachina code ni nirayandi.',
  bn: 'SwasthAI Guardian-e apnake shagotom. Doya kore apnar mobile number bolun ba type korun. Tarpor apnar phon-e asha OTP ta diye din.',
  gu: 'SwasthAI Guardian ma tamaru svagat che. Kripya tamaro mobile number bolo ya type karo. Pachi tamara phone par mokalayel code no dar karo.',
};

const VoiceGuidanceContext = createContext(null);

export function VoiceGuidanceProvider({ children }) {
  const [simpleMode, setSimpleMode] = useState(() => {
    return localStorage.getItem(SIMPLE_MODE_KEY) === 'true';
  });
  const [voiceGuided, setVoiceGuided] = useState(() => {
    return localStorage.getItem(VOICE_GUIDED_KEY) === 'true';
  });
  const [guidanceStep, setGuidanceStep] = useState(-1);
  const [guidanceActive, setGuidanceActive] = useState(false);

  useEffect(() => {
    localStorage.setItem(SIMPLE_MODE_KEY, String(simpleMode));
    if (simpleMode) {
      document.documentElement.classList.add('simple-mode');
    } else {
      document.documentElement.classList.remove('simple-mode');
    }
  }, [simpleMode]);

  useEffect(() => {
    localStorage.setItem(VOICE_GUIDED_KEY, String(voiceGuided));
  }, [voiceGuided]);

  const toggleSimpleMode = useCallback(() => {
    setSimpleMode(prev => !prev);
  }, []);

  const toggleVoiceGuided = useCallback(() => setVoiceGuided(prev => !prev), []);

  const startGuidance = useCallback(() => {
    setGuidanceStep(0);
    setGuidanceActive(true);
  }, []);

  const nextGuidanceStep = useCallback(() => {
    setGuidanceStep(prev => {
      if (prev >= GUIDED_STEPS.length - 1) {
        setGuidanceActive(false);
        return -1;
      }
      return prev + 1;
    });
  }, []);

  const cancelGuidance = useCallback(() => {
    setGuidanceStep(-1);
    setGuidanceActive(false);
  }, []);

  return (
    <VoiceGuidanceContext.Provider value={{
      simpleMode, toggleSimpleMode,
      voiceGuided, toggleVoiceGuided,
      guidanceStep, guidanceActive,
      startGuidance, nextGuidanceStep, cancelGuidance,
      guidedSteps: GUIDED_STEPS,
      LOGIN_GUIDE_PROMPTS,
    }}>
      {children}
    </VoiceGuidanceContext.Provider>
  );
}

export function useVoiceGuidance() {
  const ctx = useContext(VoiceGuidanceContext);
  if (!ctx) throw new Error('useVoiceGuidance must be used within VoiceGuidanceProvider');
  return ctx;
}
