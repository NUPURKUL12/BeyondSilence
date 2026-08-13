import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Mic, 
  MicOff,
  Sparkles, 
  MessageSquare, 
  ArrowRight, 
  Bot,
  Volume2,
  AlertCircle,
  RotateCcw,
  CheckCircle2,
  Layers,
  Layers3,
  HelpCircle
} from 'lucide-react';
import { CameraFeed } from '../CameraFeed';
import { ISLSignSequencePlayer } from '../ISLSignSequencePlayer';
import { ISLGesture } from '../../utils/gestureRegistry';
import { useSpeechRecognition } from '../../utils/speechRecognition';
import { translateEnglishToISL } from '../../utils/islTranslator';
import {
  ISL_LANGUAGE_OPTIONS,
  ISLOutputLanguage,
  getISLGlossTranslation,
  getLanguageLabel,
} from '../../utils/islMultilingualDictionary';

export const LiveCommunicationPage: React.FC = () => {
  const [activeGesture, setActiveGesture] = useState<ISLGesture | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<ISLOutputLanguage>('english');

  const {
    speechState,
    transcript,
    interimTranscript,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
    setManualTranscript,
  } = useSpeechRecognition();

  // Speech-to-ISL Translation Layer computation
  const translationResult = useMemo(() => {
    return translateEnglishToISL(transcript || interimTranscript);
  }, [transcript, interimTranscript]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <motion.div 
      className="w-full max-w-7xl mx-auto space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Top Page Heading */}
      <motion.div 
        variants={itemVariants} 
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80"
      >
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold tracking-wide uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
            <span>Two-Way Communication</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-heading">
            Live Communication
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Real-time bridge connecting Deaf signers and hearing speakers.
          </p>
        </div>

        {/* Global Studio Status */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto px-4 py-2 rounded-2xl bg-white border border-slate-200/80 text-xs font-semibold text-slate-700 shadow-2xs">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500"></span>
          </span>
          <span>15-Sign ISL Engine Active</span>
        </div>
      </motion.div>

      {/* Main Two-Panel Side-by-Side Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
        
        {/* LEFT PANEL — ISL CAMERA */}
        <motion.div 
          variants={itemVariants}
          className="rounded-3xl border border-slate-200/80 bg-white/80 backdrop-blur-xl p-5 sm:p-6 shadow-md shadow-slate-200/50 flex flex-col justify-between relative group hover:border-blue-300/80 transition-all duration-300"
        >
          <CameraFeed 
            onGestureDetected={(gesture) => setActiveGesture(gesture)}
          />

          <div className="mt-4 pt-3 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <span className="font-semibold text-slate-700">Communication Flow:</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-100">
                Signs → English Text <ArrowRight className="w-3 h-3" />
              </span>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Output language
                </span>
                <select
                  aria-label="Select output language"
                  value={selectedLanguage}
                  onChange={(event) => setSelectedLanguage(event.target.value as ISLOutputLanguage)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                >
                  {ISL_LANGUAGE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {activeGesture ? (
                <div className="mt-3 space-y-2 rounded-xl bg-white border border-slate-200 p-3 text-left">
                  <div className="text-[10px] uppercase tracking-[0.14em] text-slate-400">Recognized sign</div>
                  <div className="text-sm font-bold text-slate-900">{activeGesture.id}</div>
                  <div className="text-xs text-slate-500">
                    English: <span className="font-semibold text-slate-700">{activeGesture.englishMeaning}</span>
                  </div>
                  <div className="text-sm font-semibold text-blue-700">
                    {getLanguageLabel(selectedLanguage)}: <span className="text-slate-900">{getISLGlossTranslation(activeGesture.id, selectedLanguage)}</span>
                  </div>
                </div>
              ) : (
                <p className="mt-3 text-xs text-slate-400 italic">
                  No ISL sign currently recognized. Start the camera and perform a supported sign.
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* RIGHT PANEL — ISL VISUAL SIGN TRANSLATOR */}
        <motion.div 
          variants={itemVariants}
          className="rounded-3xl border border-slate-200/80 bg-white/80 backdrop-blur-xl p-5 sm:p-6 shadow-md shadow-slate-200/50 flex flex-col justify-between relative group hover:border-blue-300/80 transition-all duration-300"
        >
          {/* Panel Header */}
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-100">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 font-heading tracking-tight flex items-center gap-2">
                  ISL Visual Sign Sequence
                </h2>
                <span className="text-[11px] font-medium text-slate-500">
                  Hearing Person → ISL Visual Signs Output
                </span>
              </div>
            </div>

            {/* Status Indicator */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50/90 border border-blue-200/60 text-blue-700 text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>ISL Signs Ready</span>
            </div>
          </div>

          {/* ISL Visual Sign Sequence Player Component */}
          <ISLSignSequencePlayer 
            initialSentence={transcript || interimTranscript || "I need water"} 
          />

          {/* Directional Flow Footer */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Communication Flow:</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
              English Sentence → ISL Visual Sequence <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </motion.div>

      </div>

      {/* BELOW PANELS — MICROPHONE CONTROL & SPEECH RECOGNITION */}
      <motion.div 
        variants={itemVariants}
        className="w-full rounded-3xl border border-slate-200/80 bg-white/80 backdrop-blur-xl p-6 shadow-md shadow-slate-200/40 flex flex-col items-center text-center relative overflow-hidden"
      >
        <div className="w-full max-w-xl mx-auto flex flex-col items-center gap-4">
          
          {/* Header & Status Indicator */}
          <div className="flex flex-wrap items-center justify-between w-full gap-2 pb-2 border-b border-slate-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Hearing Person Audio Input
            </span>

            {/* Dynamic Microphone State Badge */}
            <div className="flex items-center gap-1.5">
              {speechState === 'listening' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                  </span>
                  <span>Listening...</span>
                </span>
              )}

              {speechState === 'speech_recognized' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Speech recognized</span>
                </span>
              )}

              {speechState === 'off' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                  <span>Microphone Off</span>
                </span>
              )}

              {speechState === 'permission_denied' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Microphone Permission Denied</span>
                </span>
              )}

              {speechState === 'unsupported' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Speech API Unavailable</span>
                </span>
              )}
            </div>
          </div>

          {/* Microphone Action Button */}
          <div className="flex flex-wrap items-center justify-center gap-3 w-full">
            {speechState === 'listening' ? (
              <button 
                onClick={stopListening}
                className="group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-[0.99] text-white font-bold text-sm shadow-lg shadow-rose-500/20 transition-all cursor-pointer"
              >
                <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center animate-pulse">
                  <MicOff className="w-4 h-4 text-white" />
                </div>
                <div className="flex flex-col items-start text-left">
                  <span className="text-sm font-bold leading-tight">Stop Microphone</span>
                  <span className="text-[10px] font-medium text-rose-100/90">Click to finish listening</span>
                </div>
              </button>
            ) : (
              <button 
                onClick={startListening}
                className="group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600 hover:from-blue-500 hover:to-teal-500 active:scale-[0.99] text-white font-bold text-sm shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
              >
                <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center">
                  <Mic className="w-4 h-4 text-white" />
                </div>
                <div className="flex flex-col items-start text-left">
                  <span className="text-sm font-bold leading-tight">Start Microphone</span>
                  <span className="text-[10px] font-medium text-blue-100/90">Click to convert speech to text</span>
                </div>
              </button>
            )}

            {(transcript || interimTranscript) && (
              <button
                onClick={resetTranscript}
                className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-all cursor-pointer"
                title="Clear transcript"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Error Message Alert */}
          {error && (
            <div className="w-full p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2 text-left">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Recognized Speech Text Display Container */}
          <div className="w-full mt-2 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 text-left transition-all">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              <span className="flex items-center gap-1.5 text-blue-700">
                <Volume2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Recognized Speech (English Text)</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Hearing → English</span>
            </div>

            {transcript || interimTranscript ? (
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                  "{transcript}"
                  {interimTranscript && (
                    <span className="text-blue-600 italic ml-1">
                      {interimTranscript}...
                    </span>
                  )}
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">
                {speechState === 'listening'
                  ? 'Listening for speech... Speak clearly into your microphone.'
                  : 'Click "Start Microphone" above and speak. Your spoken English text will render here.'}
              </p>
            )}
          </div>

          {/* Quick Speech Test Fallback Triggers */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs text-slate-500">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Test Translation Samples:</span>
            <button
              onClick={() => setManualTranscript("Hello, how are you?")}
              className="px-2.5 py-1 rounded-lg bg-slate-200/80 hover:bg-slate-200 text-slate-700 font-medium text-[11px] transition-colors cursor-pointer"
            >
              "Hello, how are you?"
            </button>
            <button
              onClick={() => setManualTranscript("Thank you for helping me.")}
              className="px-2.5 py-1 rounded-lg bg-slate-200/80 hover:bg-slate-200 text-slate-700 font-medium text-[11px] transition-colors cursor-pointer"
            >
              "Thank you for helping me."
            </button>
            <button
              onClick={() => setManualTranscript("Where is the water?")}
              className="px-2.5 py-1 rounded-lg bg-slate-200/80 hover:bg-slate-200 text-slate-700 font-medium text-[11px] transition-colors cursor-pointer"
            >
              "Where is the water?"
            </button>
          </div>

        </div>
      </motion.div>
    </motion.div>
  );
};
