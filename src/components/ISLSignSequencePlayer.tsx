import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Repeat,
  Gauge,
  Volume2,
  Activity,
  Layers
} from 'lucide-react';
import { translateEnglishToISL, ISLTranslationResult, ISLGlossToken } from '../utils/islTranslator';
import { getISLSignByGloss } from '../utils/islSignLibrary';

interface ISLSignSequencePlayerProps {
  initialSentence?: string;
  className?: string;
}

export const ISLSignSequencePlayer: React.FC<ISLSignSequencePlayerProps> = ({
  initialSentence = 'I need water',
  className = '',
}) => {
  const [activeSentence, setActiveSentence] = useState<string>(initialSentence);

  // Playback states
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(1); // 0.75x, 1x, 1.5x
  const [isLooping, setIsLooping] = useState<boolean>(true);

  // Sync activeSentence when initialSentence prop changes from microphone or quick triggers
  useEffect(() => {
    if (initialSentence) {
      setActiveSentence(initialSentence);
    }
  }, [initialSentence]);

  // Translate active sentence into ISL Gloss Sequence
  const translation: ISLTranslationResult = useMemo(() => {
    return translateEnglishToISL(activeSentence);
  }, [activeSentence]);

  const glosses = translation.glosses;
  const totalSigns = glosses.length;

  // Reset current index when sentence/translation changes
  useEffect(() => {
    setCurrentIndex(0);
    setIsPlaying(true);
  }, [translation]);

  // Current active sign token
  const activeToken: ISLGlossToken | undefined = glosses[currentIndex] || glosses[0];
  const activeSignEntry = activeToken ? getISLSignByGloss(activeToken.gloss) : undefined;
  const videoUrl = activeSignEntry?.videoUrl;

  // Auto-playback timer interval for continuous sign sequence
  useEffect(() => {
    if (!isPlaying || totalSigns === 0) return;

    const baseDuration = 2000; // 2 seconds per sign frame
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

  // Control Handlers
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

  // Progress percentage
  const progressPercent = totalSigns > 0 ? ((currentIndex + 1) / totalSigns) * 100 : 0;

  return (
    <div className={`w-full flex flex-col gap-4 ${className}`}>
      {/* SPOKEN ENGLISH TEXT TRANSCRIPT HEADER */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50/90 p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-700 uppercase tracking-wider">
            <Volume2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Spoken English Input</span>
          </div>
          <p className="text-base sm:text-lg font-bold text-slate-900 font-heading">
            "{translation.originalText || activeSentence}"
          </p>
        </div>

        {/* ISL Structure Sequence Gloss List */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-semibold text-slate-400 mr-1">ISL Glosses:</span>
          {glosses.map((g, idx) => (
            <span
              key={idx}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                idx === currentIndex
                  ? 'bg-blue-600 text-white shadow-xs scale-105'
                  : 'bg-white border border-slate-200 text-slate-600'
              }`}
            >
              {g.gloss}
            </span>
          ))}
        </div>
      </div>

      {/* SINGLE LARGE CLEAN SIGN-DISPLAY PANEL STAGE */}
      <div className="rounded-3xl border border-slate-900 bg-slate-950 text-white shadow-2xl flex flex-col justify-between relative overflow-hidden min-h-[340px] sm:min-h-[400px] p-6">
        {/* Background Ambient Lighting & Studio Grid Viewport Lines */}
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none" />

        {/* Panel Viewport Header Bar */}
        <div className="relative z-10 flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight font-heading">
                Real-Time ISL Sign Display Viewport
              </h3>
              <p className="text-[11px] text-slate-400">
                Continuous Sign Translator Display
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
              <Activity className={`w-3.5 h-3.5 ${isPlaying ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
              <span>{isPlaying ? 'STREAMING' : 'PAUSED'}</span>
            </span>
            <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded-full border border-slate-800">
              {totalSigns > 0 ? currentIndex + 1 : 0} / {totalSigns}
            </span>
          </div>
        </div>

        {/* MAIN VISUAL SIGN STAGE CONTENT */}
        <div className="relative z-10 my-auto py-8 flex flex-col items-center justify-center text-center">
          {activeToken ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeToken.gloss + currentIndex}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.04 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="flex flex-col items-center gap-4 max-w-lg w-full"
              >
                {/* Active Sign Category Pill */}
                <div className="px-3 py-1 rounded-full bg-blue-950/90 border border-blue-500/40 text-blue-300 text-xs font-mono font-bold uppercase tracking-widest">
                  Active ISL Sign: {activeToken.gloss}
                </div>

                {/* Main Motion Stage Display Area */}
                <div className="w-full h-48 sm:h-56 rounded-2xl bg-slate-900/90 border border-slate-800 p-6 flex flex-col items-center justify-center relative shadow-inner overflow-hidden group">
                  {/* Subtle Scanning Grid Target Markers */}
                  <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-blue-500/40" />
                  <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-blue-500/40" />
                  <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-blue-500/40" />
                  <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-blue-500/40" />

                  {videoUrl ? (
                    <div className="w-full h-full flex flex-col items-center justify-center overflow-hidden rounded-xl">
                      <video
                        src={videoUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="max-w-full max-h-full object-contain rounded-xl shadow-md"
                      />
                    </div>
                  ) : (
                    /* Active Playing Gloss Display Fallback */
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-4xl sm:text-5xl font-black text-white font-heading tracking-tight drop-shadow-md">
                        {activeToken.gloss}
                      </span>
                      <span className="text-sm font-medium text-slate-300">
                        Meaning: "{activeToken.originalWord}"
                      </span>
                    </div>
                  )}

                  {/* Ready for ISL Dataset Motion Note */}
                  <div className="mt-4 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-slate-400 flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-blue-400" />
                    <span>Real-time Sign Sequence • Frame {currentIndex + 1} of {totalSigns}</span>
                  </div>
                </div>

                {/* English Context Note */}
                <p className="text-xs text-slate-400 italic">
                  Playing sign sequence for: "{translation.originalText || activeSentence}"
                </p>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="py-12 text-slate-500 text-sm font-medium">
              No sign translation active. Speak into the microphone to display ISL sign sequence.
            </div>
          )}
        </div>

        {/* SEQUENCE TIMELINE PROGRESS BAR */}
        <div className="relative z-10 w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mb-4 border border-slate-800">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-teal-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* PANEL FOOTER: CONTINUOUS PLAYBACK CONTROLS BAR */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
          {/* Main Playback Transport */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleReplay}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-all cursor-pointer"
              title="Replay sequence from start"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={handlePrev}
              disabled={totalSigns <= 1}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 disabled:opacity-40 transition-all cursor-pointer"
              title="Previous sign"
            >
              <ChevronLeft className="w-4 h-4" />
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
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Speed & Loop Controls */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              <Gauge className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
              {[0.75, 1, 1.5].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`px-2 py-0.5 rounded-lg font-mono font-bold transition-all cursor-pointer ${
                    speed === s ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
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
              title="Toggle continuous looping"
            >
              <Repeat className="w-4 h-4" />
              <span className="hidden sm:inline">Loop</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
