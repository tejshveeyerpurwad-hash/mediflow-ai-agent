import { useState, useRef, useCallback } from 'react';

const LANGUAGE_MAP = {
  hi: 'hi-IN', en: 'en-IN', mr: 'mr-IN', ta: 'ta-IN',
  te: 'te-IN', bn: 'bn-IN', gu: 'gu-IN',
};

export default function useVoiceInput(options = {}) {
  const { lang = 'en', onResult, continuous = false } = options;
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');
  const recognitionRef = useRef(null);

  const supported = typeof window !== 'undefined' &&
    !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  const speechLang = LANGUAGE_MAP[lang] || 'en-IN';

  const startListening = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Voice input not supported. Please use Chrome or Edge.');
      return;
    }
    setError('');
    setTranscript('');

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const recognition = new SpeechRecognition();
    recognition.lang = speechLang;
    recognition.continuous = continuous;
    recognition.interimResults = !continuous;

    recognition.onresult = (event) => {
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        final += event.results[i][0].transcript;
      }
      setTranscript(final);
      if (!continuous && onResult) onResult(final);
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      if (event.error === 'no-speech') setError('No speech detected. Please try again.');
      else if (event.error === 'not-allowed') setError('Microphone access denied.');
      else setError('Voice input error. Please type instead.');
    };

    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [speechLang, continuous, onResult]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  return { isListening, transcript, error, supported, startListening, stopListening };
}
