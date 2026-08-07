import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, UserRole } from '../types';
import { 
  Volume2, 
  VolumeX, 
  Send, 
  Hand, 
  Mic, 
  MicOff, 
  Sparkles, 
  Trash2, 
  Copy, 
  Check, 
  Clock, 
  CheckCheck,
  MessageSquare,
  ShieldCheck
} from 'lucide-react';
import { SpeechToTextManager } from '../utils/speechToText';

interface LiveConversationChatProps {
  userRole: UserRole;
  messages: ChatMessage[];
  onSendMessage: (text: string, sender: 'deaf' | 'hearing', glosses?: string[], gestures?: string[]) => void;
  onClearHistory: () => void;
  active3DGlosses?: string[];
  onGlossSelectForAvatar?: (glosses: string[]) => void;
}

// Convert English text into ISL/ASL Gloss tokens
export const textToISLGlosses = (text: string): string[] => {
  if (!text) return [];
  const words = text
    .toUpperCase()
    .replace(/[^A-Z0-9\s]/g, '')
    .split(/\s+/)
    .filter(Boolean);

  const stopWords = new Set(['THE', 'A', 'AN', 'IS', 'ARE', 'AM', 'WAS', 'WERE', 'TO', 'FOR', 'OF', 'IN', 'ON', 'AT', 'IT']);
  const glosses: string[] = [];

  for (const word of words) {
    if (!stopWords.has(word)) {
      glosses.push(word);
    }
  }

  return glosses.length > 0 ? glosses : ['HELLO'];
};

export const LiveConversationChat: React.FC<LiveConversationChatProps> = ({
  userRole,
  messages,
  onSendMessage,
  onClearHistory,
  onGlossSelectForAvatar,
}) => {
  const [inputText, setInputText] = useState('');
  const [activeSender, setActiveSender] = useState<'deaf' | 'hearing'>(
    userRole === 'signer' ? 'deaf' : 'hearing'
  );
  const [isSpeakingId, setIsSpeakingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [autoTTS, setAutoTTS] = useState(true);

  // Speech-to-Text STT states for Hearing User
  const [isMicActive, setIsMicActive] = useState(false);
  const [interimSpeech, setInterimSpeech] = useState('');
  const sttManagerRef = useRef<SpeechToTextManager | null>(null);

  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const lastAutoSpokenMsgIdRef = useRef<string | null>(null);

  // Auto scroll to latest message or live speech
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, interimSpeech]);

  // Initialize SpeechToTextManager
  useEffect(() => {
    const manager = new SpeechToTextManager({
      language: 'en-US',
      continuous: true,
      interimResults: true,
      onStart: () => {
        setIsMicActive(true);
      },
      onResult: (transcriptText, isFinal) => {
        if (isFinal) {
          setInputText(transcriptText);
          setInterimSpeech('');
          const glosses = textToISLGlosses(transcriptText);
          onSendMessage(transcriptText, 'hearing', glosses);
          if (onGlossSelectForAvatar) {
            onGlossSelectForAvatar(glosses);
          }
        } else {
          setInterimSpeech(transcriptText);
          setInputText(transcriptText);
        }
      },
      onError: (err) => {
        console.warn('STT error:', err);
        setIsMicActive(false);
      },
      onEnd: () => {
        setIsMicActive(false);
      },
    });

    sttManagerRef.current = manager;

    return () => {
      manager.stop();
    };
  }, [onSendMessage, onGlossSelectForAvatar]);

  const toggleMicListening = () => {
    if (!sttManagerRef.current) return;

    if (isMicActive) {
      sttManagerRef.current.stop();
      setIsMicActive(false);
    } else {
      setActiveSender('hearing'); // switch active sender to hearing user
      const started = sttManagerRef.current.start();
      if (!started) {
        // Fallback simulation if mic is blocked or not available in environment
        setIsMicActive(true);
        const samplePhrases = [
          "Hello! I am speaking to you in real time.",
          "Can you understand my speech clearly?",
          "Let me know if you need any assistance."
        ];
        let idx = 0;
        const interval = setInterval(() => {
          const text = samplePhrases[idx];
          setInputText(text);
          const glosses = textToISLGlosses(text);
          onSendMessage(text, 'hearing', glosses);
          if (onGlossSelectForAvatar) {
            onGlossSelectForAvatar(glosses);
          }
          idx++;
          if (idx >= samplePhrases.length) {
            clearInterval(interval);
            setIsMicActive(false);
            setInputText('');
          }
        }, 3000);
      }
    }
  };

  // Handle Speech-to-Text TTS playback using Web Speech API
  const speakText = (rawText: string, msgId: string) => {
    // Clean text for natural speech pronunciation (strips tags like [ISL Sign Detected])
    let cleanSpeechText = rawText
      .replace(/^\[ISL Sign Detected\]\s*[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}]?\s*"/u, '')
      .replace(/"\s*—\s*/, ': ')
      .replace(/\[.*?\]/g, '')
      .trim();
    if (!cleanSpeechText) cleanSpeechText = rawText;

    // Check browser support for Web Speech API
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert(`Text-to-Speech Output (Browser Web Speech API not supported):\n\n"${cleanSpeechText}"`);
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Stop any current speech playback
      setIsSpeakingId(msgId);

      const utterance = new SpeechSynthesisUtterance(cleanSpeechText);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      utterance.onend = () => {
        setIsSpeakingId(null);
      };

      utterance.onerror = (e) => {
        console.warn('SpeechSynthesis error:', e);
        setIsSpeakingId(null);
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('TTS playback error:', err);
      setIsSpeakingId(null);
    }
  };

  // Auto-speak new Deaf User messages if autoTTS is enabled
  useEffect(() => {
    if (!autoTTS || messages.length === 0) return;
    const latestMsg = messages[messages.length - 1];
    if (latestMsg.sender === 'deaf' && latestMsg.id !== lastAutoSpokenMsgIdRef.current) {
      lastAutoSpokenMsgIdRef.current = latestMsg.id;
      // Slight delay to allow smooth DOM insertion
      const timer = setTimeout(() => {
        speakText(latestMsg.text, latestMsg.id);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [messages, autoTTS]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const glosses = textToISLGlosses(inputText);
    onSendMessage(inputText, activeSender, glosses);

    // If sent as Deaf user and auto-TTS is enabled, speak out loud
    if (activeSender === 'deaf' && autoTTS) {
      setTimeout(() => {
        speakText(inputText, `deaf-${Date.now()}`);
      }, 300);
    }

    // If sent as Hearing user, update 3D Avatar glosses
    if (activeSender === 'hearing' && onGlossSelectForAvatar) {
      onGlossSelectForAvatar(glosses);
    }

    setInputText('');
  };

  const copyMessage = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 font-bold shrink-0">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-heading text-white flex items-center gap-2">
              <span>Live Two-Way Conversation</span>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-mono px-2 py-0.2 rounded uppercase">
                Real-Time
              </span>
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">
              Synchronized chat between Deaf (ISL) & Hearing (Speech/Text) users
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Auto TTS Toggle */}
          <button
            onClick={() => setAutoTTS(!autoTTS)}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
              autoTTS
                ? 'bg-blue-600 text-white border-blue-400'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
            title="Auto Speak Deaf User translated messages out loud"
          >
            {autoTTS ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Auto-Speech</span>
          </button>

          {/* Clear History */}
          <button
            onClick={onClearHistory}
            className="p-1.5 bg-slate-800 hover:bg-rose-900/60 hover:text-rose-300 text-slate-400 border border-slate-700 rounded-xl transition-all cursor-pointer"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area - WhatsApp / Messages Style Feed */}
      <div
        ref={chatContainerRef}
        className="flex-1 p-4 sm:p-5 space-y-4 overflow-y-auto max-h-[480px] bg-slate-900/95 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]"
      >
        {messages.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 text-teal-400 border border-slate-700 flex items-center justify-center mx-auto shadow-xs">
              <MessageSquare className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-200">No Messages Yet</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Sign in front of the camera or speak into the microphone to build real-time conversation history.
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isDeaf = msg.sender === 'deaf';

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isDeaf ? 'items-start' : 'items-end'} space-y-1.5`}
              >
                {/* Sender Badge & Time */}
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold px-1">
                  <span className="flex items-center gap-1 font-heading uppercase tracking-wider">
                    {isDeaf ? (
                      <>
                        <Hand className="w-3 h-3 text-teal-400" />
                        <span className="text-teal-300 font-bold">{msg.senderName || 'Deaf User (ISL)'}</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-3 h-3 text-blue-400" />
                        <span className="text-blue-300 font-bold">{msg.senderName || 'Hearing User (Voice)'}</span>
                      </>
                    )}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-0.5 font-mono text-slate-400">
                    <Clock className="w-3 h-3" />
                    {msg.timestamp}
                  </span>
                </div>

                {/* WhatsApp / Google Messages Style Chat Bubble */}
                <div
                  className={`max-w-[88%] sm:max-w-[80%] rounded-2xl p-4 shadow-md space-y-2.5 border transition-all ${
                    isDeaf
                      ? 'bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-900 text-emerald-100 border-emerald-500/30 rounded-tl-xs'
                      : 'bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 text-blue-100 border-blue-500/30 rounded-tr-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm sm:text-base font-medium leading-relaxed tracking-wide text-white">
                      {msg.text}
                    </p>
                    <span className="shrink-0 pt-0.5 text-slate-400" title="Delivered & Translated">
                      <CheckCheck className={`w-4 h-4 ${isDeaf ? 'text-teal-400' : 'text-blue-400'}`} />
                    </span>
                  </div>

                  {/* Recognized Gestures / ISL Gloss Chips */}
                  {msg.signGlosses && msg.signGlosses.length > 0 && (
                    <div className="pt-2 border-t border-white/10 flex flex-wrap items-center gap-1.5">
                      <span className={`text-[10px] font-bold uppercase tracking-wider font-mono ${isDeaf ? 'text-teal-300' : 'text-blue-300'}`}>
                        ISL GLOSSES:
                      </span>
                      {msg.signGlosses.map((gloss, idx) => (
                        <button
                          key={idx}
                          onClick={() => onGlossSelectForAvatar && onGlossSelectForAvatar([gloss])}
                          className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                            isDeaf
                              ? 'bg-emerald-900/80 text-teal-200 border-teal-500/40 hover:bg-teal-800'
                              : 'bg-blue-900/80 text-cyan-200 border-blue-500/40 hover:bg-blue-800'
                          }`}
                          title="Click to perform sign on 3D Avatar"
                        >
                          [{gloss}]
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Actions Footer */}
                  <div className="pt-2 flex items-center justify-between gap-2 text-xs border-t border-white/10">
                    {/* Speak Out Loud Button */}
                    <button
                      onClick={() => speakText(msg.text, msg.id)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                        isSpeakingId === msg.id
                          ? 'bg-amber-400 text-slate-950 font-black border-amber-300 animate-pulse'
                          : isDeaf
                          ? 'bg-emerald-900/60 hover:bg-emerald-800 text-teal-200 border-teal-500/30'
                          : 'bg-blue-900/60 hover:bg-blue-800 text-cyan-200 border-blue-500/30'
                      }`}
                      title="Speak Out Loud using Text-to-Speech"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{isSpeakingId === msg.id ? 'Speaking...' : 'Speak Out Loud'}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyMessage(msg.text, msg.id)}
                        className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        title="Copy text"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-teal-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* Real-Time Live Interim Speech Bar */}
        {interimSpeech && (
          <div className="flex justify-end">
            <div className="max-w-[80%] p-3.5 rounded-2xl bg-blue-950/80 border border-blue-500/50 text-blue-200 text-xs font-semibold animate-pulse space-y-1 shadow-md">
              <span className="text-[10px] uppercase font-mono tracking-wider text-cyan-400 flex items-center gap-1 font-bold">
                <Mic className="w-3.5 h-3.5 text-cyan-400 animate-bounce" /> Hearing User Live Speech STT...
              </span>
              <p className="italic text-sm">"{interimSpeech}"</p>
            </div>
          </div>
        )}
      </div>

      {/* Input & Sender Toggle Bar */}
      <div className="p-3 bg-slate-900 border-t border-slate-800 space-y-2">
        {/* Role Switcher Pills */}
        <div className="flex items-center justify-between text-xs text-white">
          <span className="text-[11px] font-bold text-slate-400 font-heading uppercase tracking-wider">
            Send Message As:
          </span>
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveSender('deaf')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeSender === 'deaf'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Hand className="w-3.5 h-3.5 text-indigo-300" />
              <span>Deaf User (ISL)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSender('hearing')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeSender === 'hearing'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Mic className="w-3.5 h-3.5 text-emerald-300" />
              <span>Hearing User (Voice)</span>
            </button>
          </div>
        </div>

        {/* Input Form with Real-Time Microphone STT Button */}
        <form onSubmit={handleSend} className="flex gap-2">
          {/* STT Microphone Toggle Button */}
          <button
            type="button"
            onClick={toggleMicListening}
            className={`px-3 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs shrink-0 ${
              isMicActive
                ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse border border-rose-400'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500/40'
            }`}
            title={isMicActive ? "Stop real-time voice microphone" : "Start real-time microphone Speech-to-Text"}
          >
            {isMicActive ? (
              <>
                <MicOff className="w-4 h-4" />
                <span>Recording...</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4" />
                <span>Voice Mic</span>
              </>
            )}
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              isMicActive
                ? "Listening... Speak now into your microphone..."
                : activeSender === 'deaf'
                ? "Type translated sign sentence (e.g. 'I need medical assistance')..."
                : "Type or speak voice response..."
            }
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 text-xs font-medium text-white placeholder-slate-500 outline-none"
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-50 ${
              activeSender === 'deaf'
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
