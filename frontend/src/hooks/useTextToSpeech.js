import { useCallback } from 'react';

const LANGUAGE_MAP = {
  hi: 'hi-IN', en: 'en-IN', mr: 'mr-IN', ta: 'ta-IN',
  te: 'te-IN', bn: 'bn-IN', gu: 'gu-IN',
};

export default function useTextToSpeech() {
  const speak = useCallback((text, lang = 'en') => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = LANGUAGE_MAP[lang] || 'en-IN';
    utterance.rate = 0.8;
    utterance.pitch = 1.1;
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(v =>
      v.lang.startsWith(utterance.lang.split('-')[0]) &&
      (v.name.toLowerCase().includes('female') ||
       v.name.toLowerCase().includes('zira') ||
       v.name.toLowerCase().includes('google'))
    );
    if (femaleVoice) utterance.voice = femaleVoice;
    window.speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  }, []);

  return { speak, stop };
}
