import { useState, useEffect, useCallback, useRef } from 'react';

export type SpeechState = 'off' | 'listening' | 'speech_recognized' | 'permission_denied' | 'unsupported';

export interface UseSpeechRecognitionReturn {
  speechState: SpeechState;
  transcript: string;
  interimTranscript: string;
  error: string | null;
  isSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  setManualTranscript: (text: string) => void;
}

export function useSpeechRecognition(): UseSpeechRecognitionReturn {
  const [speechState, setSpeechState] = useState<SpeechState>('off');
  const [transcript, setTranscript] = useState<string>('');
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState<boolean>(true);

  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef<boolean>(false);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      setSpeechState('unsupported');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        isListeningRef.current = true;
        setSpeechState('listening');
        setError(null);
      };

      recognition.onresult = (event: any) => {
        let finalStr = '';
        let interimStr = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const res = event.results[i];
          if (res.isFinal) {
            finalStr += res[0].transcript + ' ';
          } else {
            interimStr += res[0].transcript;
          }
        }

        if (finalStr) {
          setTranscript((prev) => (prev ? `${prev} ${finalStr}` : finalStr).trim());
          setSpeechState('speech_recognized');
        }
        setInterimTranscript(interimStr);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setError('Microphone access was denied. Please allow microphone permissions in your browser settings.');
          setSpeechState('permission_denied');
          isListeningRef.current = false;
        } else if (event.error === 'no-speech') {
          // Normal timeout when quiet
        } else {
          setError(`Speech recognition error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        if (isListeningRef.current) {
          try {
            recognition.start();
          } catch (e) {
            isListeningRef.current = false;
            setSpeechState('off');
          }
        } else {
          if (speechState === 'listening') {
            setSpeechState('off');
          }
        }
      };

      recognitionRef.current = recognition;
    } catch (e) {
      console.error('Failed to initialize Speech Recognition:', e);
      setIsSupported(false);
      setSpeechState('unsupported');
    }

    return () => {
      isListeningRef.current = false;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, [speechState]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setIsSupported(false);
        setSpeechState('unsupported');
        return;
      }
    }

    setError(null);
    isListeningRef.current = true;
    try {
      recognitionRef.current?.start();
      setSpeechState('listening');
    } catch (e) {
      // If already started or restarting
      setSpeechState('listening');
    }
  }, []);

  const stopListening = useCallback(() => {
    isListeningRef.current = false;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setSpeechState((prev) => (prev === 'listening' ? (transcript ? 'speech_recognized' : 'off') : prev));
  }, [transcript]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setSpeechState('off');
  }, []);

  const setManualTranscript = useCallback((text: string) => {
    setTranscript(text);
    setSpeechState('speech_recognized');
  }, []);

  return {
    speechState,
    transcript,
    interimTranscript,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
    setManualTranscript,
  };
}
