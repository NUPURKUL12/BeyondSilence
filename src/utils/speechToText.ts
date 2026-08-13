// Modular Speech-to-Text Utility wrapping Web Speech API (SpeechRecognition / webkitSpeechRecognition)

export interface SpeechToTextOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  onResult?: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  onEnd?: () => void;
  onStart?: () => void;
}

export class SpeechToTextManager {
  private recognition: any = null;
  private isListening: boolean = false;
  private options: SpeechToTextOptions;
  private isSupported: boolean = false;

  constructor(options: SpeechToTextOptions = {}) {
    this.options = {
      language: 'en-US',
      continuous: true,
      interimResults: true,
      ...options,
    };

    if (typeof window !== 'undefined') {
      const SpeechRecognitionClass =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognitionClass) {
        this.isSupported = true;
        this.recognition = new SpeechRecognitionClass();
        this.recognition.continuous = this.options.continuous;
        this.recognition.interimResults = this.options.interimResults;
        this.recognition.lang = this.options.language;

        this.recognition.onstart = () => {
          this.isListening = true;
          if (this.options.onStart) this.options.onStart();
        };

        this.recognition.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }

          if (finalTranscript && this.options.onResult) {
            this.options.onResult(finalTranscript.trim(), true);
          } else if (interimTranscript && this.options.onResult) {
            this.options.onResult(interimTranscript.trim(), false);
          }
        };

        this.recognition.onerror = (event: any) => {
          const errorMsg = event.error || 'Speech recognition error';
          console.warn('SpeechToText error:', errorMsg);
          if (this.options.onError) {
            this.options.onError(errorMsg);
          }
        };

        this.recognition.onend = () => {
          this.isListening = false;
          if (this.options.onEnd) this.options.onEnd();
        };
      }
    }
  }

  public checkSupport(): boolean {
    return this.isSupported;
  }

  public getIsListening(): boolean {
    return this.isListening;
  }

  public start(): boolean {
    if (!this.isSupported || !this.recognition) {
      if (this.options.onError) {
        this.options.onError('Web Speech API is not supported in this browser.');
      }
      return false;
    }

    if (this.isListening) return true;

    try {
      this.recognition.start();
      return true;
    } catch (err: any) {
      console.error('Failed to start SpeechToText:', err);
      if (this.options.onError) {
        this.options.onError(err?.message || 'Could not start microphone');
      }
      return false;
    }
  }

  public stop(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (err) {
        console.warn('Error stopping speech recognition:', err);
      }
    }
    this.isListening = false;
  }

  public setLanguage(lang: string): void {
    this.options.language = lang;
    if (this.recognition) {
      this.recognition.lang = lang;
    }
  }
}
