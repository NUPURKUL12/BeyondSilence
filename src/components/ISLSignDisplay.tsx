import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Layers3,
  Sparkles,
  MessageSquare,
  Repeat,
  Gauge,
  ArrowRight,
  Send,
  Layers
} from 'lucide-react';
import { translateEnglishToISL, ISLTranslationResult, ISLGlossToken } from '../utils/islTranslator';
import { ISLSignGraphic } from './ISLSignGraphic';

export interface ISLSignDisplayProps {
  sequence?: string;
  sentence?: string;
  className?: string;
  title?: string;
}

export const ISLSignDisplay: React.FC<ISLSignDisplayProps> = ({
  sequence,
  sentence,
  className = '',
  title = 'ISL Sign Sequence Display'
}) => {
  // Use passed sequence or sentence prop, fallback to default
  const activeInput = sequence || sentence || 'I need water';

  const [inputText, setInputText] = useState<string>(activeInput);
  const [currentSentence, setCurrentSentence] = useState<string>(activeInput);

  // Sync internal state if prop changes externally
  useEffect(() => {
    if (activeInput) {
      setCurrentSentence(activeInput);
      setInputText(activeInput);
    }
  }, [activeInput]);

  // Playback states
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(1);
  const [isLooping, setIsLooping] = useState<boolean>(true);

  // Translate sentence into ISL Gloss Sequence
  const translation: ISLTranslationResult = useMemo(() => {
    return translateEnglishToISL(currentSentence);
  }, [currentSentence]);

  const glosses = translation.glosses;
  const totalSigns = glosses.length;

  useEffect(() => {
    setCurrentIndex(0);
    setIsPlaying(true);
  }, [translation]);

  const activeToken: ISLGlossToken | undefined = glosses[currentIndex] || glosses[0];

  // Auto-playback timer interval
  useEffect(() => {
    if (!isPlaying || totalSigns === 0) return;

    const baseDuration = 2200;
    const intervalTime = baseDuration / speed;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev + 1 >= totalSigns) {
          if (isLooping) {
            return 0;
          } else {
            setIsPlaying(false);
            return prev;
          }
        }
        return prev + 1;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, totalSigns, speed, isLooping]);

  const handleNext = () => {
    if (totalSigns === 0) return;
    setCurrentIndex((prev) => (prev + 1) % totalSigns);
  };

  const handlePrev = () => {
    if (totalSigns === 0) return;
    setCurrentIndex((prev) => (prev - 1 + totalSigns) % totalSigns);
  };

  const handleReplay = () => {
    setCurrentIndex(0);
    setIsPlaying(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      setCurrentSentence(inputText.trim());
    }
  };

  return (
    <div className={`w-full rounded-3xl border border-slate-200/90 bg-slate-950 p-5 sm:p-7 text-white shadow-xl flex flex-col gap-6 relative overflow-hidden ${className}`}>
      {/* Background Ambient Lighting */}
      <div className="absolute top-0 right-1/4 w-80 h-80 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

      {/* Header Banner */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight font-heading flex items-center gap-2">
              {title}
            </h3>
            <p className="text-xs text-slate-400">
              Visual Sign Language sequence viewer for English input
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 self-start sm:self-auto">
          <span>ISL GLOSSES</span>
          <span className="text-blue-400 font-bold">
            {totalSigns > 0 ? currentIndex + 1 : 0} / {totalSigns}
          </span>
        </div>
      </div>

      {/* English Sentence Display & Custom Input */}
      <div className="relative z-10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80">
        <div className="space-y-1 flex-1">
          <div className="flex items-center gap-2 text-[10px] font-bold text-blue-400 uppercase tracking-wider">
            <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
            <span>Active Input Sentence</span>
          </div>
          <p className="text-lg font-bold text-slate-100 tracking-tight font-heading">
            "{translation.originalText || currentSentence}"
          </p>
        </div>

        <form onSubmit={handleFormSubmit} className="flex items-center gap-2 shrink-0 max-w-sm w-full">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type new sentence..."
            className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shrink-0 cursor-pointer"
          >
            Display
          </button>
        </form>
      </div>

      {/* Sequence Timeline Bar */}
      {totalSigns > 0 && (
        <div className="relative z-10 w-full overflow-x-auto pb-1 scrollbar-none">
          <div className="flex items-center justify-center min-w-max gap-2 px-3 py-2 rounded-2xl bg-slate-900/80 border border-slate-800/80">
            {glosses.map((token, idx) => {
              const isActive = idx === currentIndex;
              return (
                <React.Fragment key={idx}>
                  {idx > 0 && (
                    <ArrowRight className="w-4 h-4 text-slate-600 shrink-0 mx-0.5" />
                  )}
                  <button
                    onClick={() => {
                      setCurrentIndex(idx);
                      setIsPlaying(false);
                    }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white border border-blue-400 shadow-lg shadow-blue-500/30 scale-105'
                        : 'bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-700/50'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isActive ? 'bg-white animate-ping' : 'bg-slate-500'
                      }`}
                    />
                    <span>{token.gloss}</span>
                  </button>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}

      {/* Featured Main Sign Graphic Display */}
      {activeToken ? (
        <div className="relative z-10 flex flex-col items-center justify-center gap-4 py-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeToken.gloss + currentIndex}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.05, y: -10 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="w-full max-w-md flex flex-col items-center"
            >
              {/* Card Container for Current Sign */}
              <div className="w-full aspect-square max-w-[260px] sm:max-w-[300px] rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-blue-500/40 p-6 flex flex-col items-center justify-center relative shadow-2xl shadow-blue-950/50">
                <div className="absolute inset-0 rounded-3xl border border-blue-400/20 pointer-events-none animate-pulse" />

                <div className="absolute top-4 left-4 px-2.5 py-1 rounded-lg bg-blue-950/80 border border-blue-500/30 text-[10px] font-mono font-bold text-blue-300 uppercase tracking-wider">
                  {activeToken.category || 'ISL Sign'}
                </div>

                <div className="absolute top-4 right-4 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400">
                  Step {currentIndex + 1}
                </div>

                <div className="w-44 h-44 sm:w-52 sm:h-52 my-2 flex items-center justify-center">
                  <ISLSignGraphic gloss={activeToken.gloss} animate={isPlaying} />
                </div>

                <div className="w-full mt-2 pt-2 border-t border-slate-800/80 text-center">
                  <span className="text-[10px] text-slate-400 font-mono">Word:</span>
                  <span className="ml-1 text-xs text-blue-300 font-bold font-mono">
                    "{activeToken.originalWord}"
                  </span>
                </div>
              </div>

              {/* Gloss Label & English Word */}
              <div className="text-center mt-3 space-y-1">
                <h4 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight">
                  {activeToken.displayGloss || activeToken.gloss}
                </h4>
                <p className="text-xs text-slate-300 font-medium">
                  English Word: "{activeToken.originalWord.toUpperCase()}"
                </p>
                {activeToken.description && (
                  <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed pt-0.5">
                    {activeToken.description}
                  </p>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      ) : (
        <div className="py-8 text-center text-slate-400 text-xs">
          No ISL signs found for this sentence.
        </div>
      )}

      {/* Playback Controls Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
        <div className="flex items-center gap-2">
          <button
            onClick={handleReplay}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-all cursor-pointer"
            title="Replay sequence"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handlePrev}
            disabled={totalSigns <= 1}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 disabled:opacity-40 transition-all cursor-pointer"
            title="Previous sign"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Play Sequence</span>
              </>
            )}
          </button>

          <button
            onClick={handleNext}
            disabled={totalSigns <= 1}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 disabled:opacity-40 transition-all cursor-pointer"
            title="Next sign"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <Gauge className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
            {[0.75, 1, 1.5].map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`px-2 py-1 rounded-lg font-mono font-bold transition-all cursor-pointer ${
                  speed === s
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsLooping(!isLooping)}
            className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              isLooping
                ? 'bg-blue-950/80 text-blue-300 border-blue-500/50'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
            title="Toggle loop"
          >
            <Repeat className="w-4 h-4" />
            <span className="hidden sm:inline">Loop</span>
          </button>
        </div>
      </div>

      {/* Grid Strip of All Cards in Sequence */}
      <div className="relative z-10 space-y-2 pt-2">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
          <span>ISL Sign Cards Sequence</span>
          <span className="text-[10px] text-slate-500 font-mono">
            Click to select sign
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {glosses.map((token, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={idx}
                onClick={() => {
                  setCurrentIndex(idx);
                  setIsPlaying(false);
                }}
                className={`flex flex-col items-center p-3 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden group ${
                  isActive
                    ? 'bg-blue-950/80 border-blue-400 ring-2 ring-blue-500/30 shadow-lg scale-[1.02]'
                    : 'bg-slate-900/80 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div
                  className={`absolute top-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${
                    isActive
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  #{idx + 1}
                </div>

                <div className="w-20 h-20 my-1 flex items-center justify-center">
                  <ISLSignGraphic gloss={token.gloss} animate={false} />
                </div>

                <span
                  className={`text-xs font-black font-heading uppercase tracking-wider ${
                    isActive ? 'text-blue-300' : 'text-slate-200'
                  }`}
                >
                  {token.gloss}
                </span>

                <span className="text-[11px] text-slate-400 font-medium">
                  "{token.originalWord}"
                </span>

                {isActive && (
                  <span className="mt-1.5 text-[9px] font-mono font-bold text-blue-400 uppercase tracking-widest bg-blue-900/60 px-2 py-0.5 rounded-full border border-blue-500/30">
                    Now Signing
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
