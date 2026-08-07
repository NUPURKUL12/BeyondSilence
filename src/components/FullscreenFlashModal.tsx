import React, { useState } from 'react';
import { X, Volume2, Zap, Copy, Check } from 'lucide-react';

interface FullscreenFlashModalProps {
  isOpen: boolean;
  title: string;
  text: string;
  onClose: () => void;
}

export const FullscreenFlashModal: React.FC<FullscreenFlashModalProps> = ({
  isOpen,
  title,
  text,
  onClose,
}) => {
  const [isFlashing, setIsFlashing] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSpeak = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-6 sm:p-10 animate-fade-in backdrop-blur-md">
      {/* Top Controls */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <span className="bg-amber-400 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
            HIGH-LEGBILITY DISPLAY CARD
          </span>
          <span className="text-slate-400 text-xs font-medium hidden sm:inline">
            Hold phone up for doctor or medical staff to read
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsFlashing(!isFlashing)}
            className={`px-3 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
              isFlashing
                ? 'bg-rose-600 text-white animate-ping'
                : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>{isFlashing ? 'FLASHING ON' : 'FLASH ATTENTION'}</span>
          </button>

          <button
            onClick={handleSpeak}
            className="p-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shadow"
            title="Read out loud for doctor"
          >
            <Volume2 className="w-4 h-4" />
            <span className="hidden sm:inline">Speak Out Loud</span>
          </button>

          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
            title="Close Card"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Enormous Text Center Stage */}
      <div
        className={`my-auto p-8 rounded-3xl border-4 text-center space-y-6 transition-all ${
          isFlashing
            ? 'bg-rose-950 border-rose-500 animate-flash-emergency'
            : 'bg-slate-900 border-teal-400 shadow-2xl shadow-teal-900/50'
        }`}
      >
        <span className="text-xs sm:text-sm font-extrabold text-teal-400 uppercase tracking-widest block font-mono">
          {title}
        </span>

        <p className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight font-heading tracking-tight">
          "{text}"
        </p>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
          <span className="bg-slate-950 text-teal-300 font-mono text-sm sm:text-base font-extrabold px-4 py-2 rounded-xl border border-teal-500/40">
            🤟 DEAF PATIENT COMMUNICATION CARD
          </span>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800 pt-4">
        <span>BeyondSilence PWA Healthcare Display</span>
        <button
          onClick={handleCopy}
          className="text-teal-400 hover:text-teal-300 font-bold flex items-center gap-1"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied to Clipboard' : 'Copy Text'}</span>
        </button>
      </div>
    </div>
  );
};
