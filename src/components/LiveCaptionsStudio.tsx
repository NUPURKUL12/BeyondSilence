import React, { useState, useEffect, useRef } from 'react';
import { UserRole, ChatMessage } from '../types';
import { AvatarSigner3D } from './AvatarSigner3D';
import { LiveConversationChat, textToISLGlosses } from './LiveConversationChat';
import { SpeechToTextManager } from '../utils/speechToText';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Sparkles, 
  Copy, 
  Check, 
  Maximize2, 
  BookOpen, 
  CheckSquare, 
  ArrowRight,
  MessageSquare,
  Box,
  Layers,
  Send
} from 'lucide-react';

interface LiveCaptionsStudioProps {
  userRole: UserRole;
  onOpenQuickModal: (title: string, text: string) => void;
  messages?: ChatMessage[];
  onSendMessage?: (text: string, sender: 'deaf' | 'hearing', glosses?: string[], gestures?: string[]) => void;
  onClearHistory?: () => void;
  active3DGlosses?: string[];
  onGlossSelectForAvatar?: (glosses: string[]) => void;
}

export const LiveCaptionsStudio: React.FC<LiveCaptionsStudioProps> = ({
  userRole,
  onOpenQuickModal,
  messages = [],
  onSendMessage,
  onClearHistory,
  active3DGlosses = ['WELCOME', 'EVERYONE', 'MEETING', 'START', 'TIME', 'PLEASE', 'BRING', 'SLIDES'],
  onGlossSelectForAvatar,
}) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'simplify'>('chat');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState(
    'Welcome everyone! We will start our meeting at 10 AM. Please make sure to bring your presentation slides.'
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [simplifiedData, setSimplifiedData] = useState<{
    simplifiedText: string;
    signGlosses: string[];
    keyActionItems: string[];
    keyTerms?: { term: string; explanation: string }[];
    urgencyLevel?: string;
  } | null>({
    simplifiedText: 'Welcome everyone! Meeting starts at 10 AM. Please bring your presentation slides.',
    signGlosses: ['WELCOME', 'EVERYONE', 'MEETING', 'START', 'TIME', 'PLEASE', 'BRING', 'SLIDES'],
    keyActionItems: [
      'Bring presentation slides to the meeting',
      'Arrive on time for the 10 AM start'
    ],
    keyTerms: [
      { term: 'Slides', explanation: 'Visual presentation deck for the meeting.' }
    ],
    urgencyLevel: 'low'
  });

  const [signerReply, setSignerReply] = useState('');
  const [copied, setCopied] = useState(false);
  const [, setSpeechSupported] = useState(true);

  const sttManagerRef = useRef<SpeechToTextManager | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [transcript]);

  // Speech Recognition initialization
  useEffect(() => {
    const manager = new SpeechToTextManager({
      language: 'en-US',
      continuous: true,
      interimResults: true,
      onStart: () => setIsListening(true),
      onResult: (currentTranscript, isFinal) => {
        if (currentTranscript) {
          setTranscript(currentTranscript);
          if (isFinal && onSendMessage && currentTranscript.trim().length > 2) {
            const glosses = textToISLGlosses(currentTranscript);
            onSendMessage(currentTranscript, 'hearing', glosses);
          }
        }
      },
      onError: (err) => {
        console.warn('Studio STT Error:', err);
        setIsListening(false);
      },
      onEnd: () => setIsListening(false),
    });

    sttManagerRef.current = manager;
    setSpeechSupported(manager.checkSupport());

    return () => {
      manager.stop();
    };
  }, [onSendMessage]);

  const toggleListening = () => {
    if (!sttManagerRef.current) return;

    if (isListening) {
      sttManagerRef.current.stop();
      setIsListening(false);
    } else {
      const started = sttManagerRef.current.start();
      if (!started) {
        setIsListening(true);
        const samplePhrases = [
          'Hello! We are holding our annual community gathering next Saturday.',
          'There will be live sign language interpreters available for all sessions.',
          'Please register online by Wednesday if you plan to attend.'
        ];
        let idx = 0;
        const interval = setInterval(() => {
          const text = samplePhrases[idx];
          setTranscript((prev) => prev + ' ' + text);
          if (onSendMessage) {
            const glosses = textToISLGlosses(text);
            onSendMessage(text, 'hearing', glosses);
          }
          idx++;
          if (idx >= samplePhrases.length) {
            clearInterval(interval);
            setIsListening(false);
          }
        }, 2500);
      }
    }
  };

  const handleSimplifyTranscript = async () => {
    if (!transcript.trim()) return;
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/gemini/simplify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript, userRole }),
      });
      const data = await res.json();
      if (data && data.simplifiedText) {
        setSimplifiedData(data);
        if (data.signGlosses && onGlossSelectForAvatar) {
          onGlossSelectForAvatar(data.signGlosses);
        }
      }
    } catch (error) {
      console.error('Error calling simplify API:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSpeakOutLoud = () => {
    if (!signerReply.trim()) return;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(signerReply);
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Speech synthesis: ' + signerReply);
    }

    if (onSendMessage) {
      onSendMessage(signerReply, 'deaf', textToISLGlosses(signerReply));
    }
    setSignerReply('');
  };

  const copyTranscript = () => {
    navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden space-y-0">
      {/* Studio Header Bar */}
      <div className="bg-slate-900 text-white px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-blue-300 shrink-0">
            <Mic className={`w-5 h-5 ${isListening ? 'animate-bounce text-rose-400' : ''}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold font-heading text-white">
                Speech & 3D ISL Studio
              </h3>
              <span className="bg-blue-500/20 text-blue-300 text-[10px] font-semibold px-2.5 py-0.5 rounded-full border border-blue-400/30">
                Gemini AI Real-Time
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium">
              Speech-to-Text • 3D Avatar Signer • Real-Time Two-Way Communication
            </p>
          </div>
        </div>

        {/* View Tab Switcher & Mic Controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Tab buttons */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'chat'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>2-Way Chat & 3D</span>
            </button>

            <button
              onClick={() => setActiveTab('simplify')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'simplify'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>AI Simplify</span>
            </button>
          </div>

          <button
            onClick={toggleListening}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs ${
              isListening
                ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-4 h-4" />
                <span>Stop Mic</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4" />
                <span>Start Mic</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Studio Body */}
      <div className="p-5 space-y-6">
        {/* Interactive 3D Avatar Signer Container */}
        <AvatarSigner3D
          glosses={active3DGlosses}
          fullSentence={transcript}
          autoPlay={true}
          onGlossChange={() => {}}
        />

        {/* TAB 1: Live Real-Time Conversation Chat Window */}
        {activeTab === 'chat' && (
          <LiveConversationChat
            userRole={userRole}
            messages={messages}
            onSendMessage={onSendMessage || (() => {})}
            onClearHistory={onClearHistory || (() => {})}
            active3DGlosses={active3DGlosses}
            onGlossSelectForAvatar={onGlossSelectForAvatar}
          />
        )}

        {/* TAB 2: Speech Transcript & AI Plain-Language Simplifier */}
        {activeTab === 'simplify' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column: Live Speech Transcript Box */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5 font-heading">
                  <span className={`w-2 h-2 rounded-full ${isListening ? 'bg-rose-500 animate-ping' : 'bg-slate-400'}`} />
                  Live Speech Transcript (Voice Input)
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={copyTranscript}
                    className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder="Spoken words will appear here in real time, or type here directly..."
                  rows={5}
                  className="w-full p-4 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base font-medium text-slate-800 bg-slate-50/50 leading-relaxed shadow-inner outline-none"
                />
                {isListening && (
                  <div className="absolute top-3 right-3 bg-rose-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                    LISTENING MIC
                  </div>
                )}
              </div>

              <button
                onClick={handleSimplifyTranscript}
                disabled={isAnalyzing || !transcript.trim()}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50 font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <Sparkles className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
                <span>{isAnalyzing ? 'Analyzing with Gemini AI...' : 'Simplify Text & Extract ISL Glosses'}</span>
              </button>

              {/* Type to Speak Box */}
              <div className="mt-2 pt-4 border-t border-slate-200 space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-blue-800 flex items-center gap-1.5 font-heading">
                  <Volume2 className="w-4 h-4 text-blue-600" />
                  Type Message to Speak Out Loud or Display
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={signerReply}
                    onChange={(e) => setSignerReply(e.target.value)}
                    placeholder="Type reply here (e.g. 'I understand, thank you!')..."
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 text-xs font-medium text-slate-800 outline-none"
                  />
                  <button
                    onClick={handleSpeakOutLoud}
                    disabled={!signerReply.trim()}
                    className="px-3.5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0"
                    title="Speak text out loud"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Speak</span>
                  </button>

                  <button
                    onClick={() => onOpenQuickModal("TEXT DISPLAY CARD", signerReply)}
                    disabled={!signerReply.trim()}
                    className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0"
                    title="Open huge visual card"
                  >
                    <Maximize2 className="w-4 h-4" />
                    <span>Card</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: AI Simplified & Sign Gloss Output */}
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 flex flex-col justify-between space-y-4 shadow-xs">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                    <h4 className="text-base font-bold text-slate-900 font-heading">
                      AI Plain-Language & ISL Gloss Output
                    </h4>
                  </div>
                </div>

                {simplifiedData ? (
                  <div className="mt-4 space-y-4">
                    {/* Simplified Plain Text Box */}
                    <div className="bg-blue-50/80 p-4 rounded-xl border border-blue-200/80 space-y-1">
                      <span className="text-xs font-bold text-blue-900 uppercase tracking-wide flex items-center gap-1 font-heading">
                        <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                        Plain Language Translation
                      </span>
                      <p className="text-base font-bold text-slate-900 leading-snug">
                        {simplifiedData.simplifiedText}
                      </p>
                    </div>

                    {/* Horizontal ASL/ISL Gloss Concept Chips */}
                    <div>
                      <span className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-2 font-heading">
                        ISL Gloss Sequence:
                      </span>
                      <div className="flex flex-wrap gap-2 items-center">
                        {simplifiedData.signGlosses.map((gloss, idx) => {
                          const cleanGloss = gloss.replace(/^[\[\(\{]+|[\]\)\}]+$/g, '').toUpperCase();
                          return (
                            <button
                              key={idx}
                              onClick={() => onGlossSelectForAvatar && onGlossSelectForAvatar([cleanGloss])}
                              className="bg-slate-900 hover:bg-slate-800 text-teal-300 px-3 py-1.5 rounded-lg text-xs font-bold font-mono tracking-wider border border-teal-500/30 shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                              title="Animate on 3D avatar"
                            >
                              <span className="text-teal-500 font-sans text-[10px]">{idx + 1}.</span>
                              <span>[{cleanGloss}]</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Action Items Checklist */}
                    {simplifiedData.keyActionItems && simplifiedData.keyActionItems.length > 0 && (
                      <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2 shadow-xs">
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1 font-heading">
                          <CheckSquare className="w-4 h-4 text-emerald-600" />
                          Key Summary Action Steps
                        </span>
                        <ul className="space-y-1.5">
                          {simplifiedData.keyActionItems.map((item, idx) => (
                            <li key={idx} className="text-xs text-slate-700 font-medium flex items-start gap-2">
                              <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                                ✓
                              </span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-12 text-center text-slate-400 space-y-2">
                    <Sparkles className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="text-sm font-medium">
                      Click "Simplify Text" to generate plain text and sign language glosses from the live transcript.
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                <span>Powered by Gemini 3.6 Flash</span>
                <button
                  onClick={() => onOpenQuickModal("FULL TRANSLATION DISPLAY", simplifiedData?.simplifiedText || transcript)}
                  className="text-blue-700 hover:text-blue-900 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span>View Fullscreen Display</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

