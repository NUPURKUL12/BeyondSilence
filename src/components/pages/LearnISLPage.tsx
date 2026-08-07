import React, { useState } from 'react';
import { SIGN_DICTIONARY } from '../../data/mockData';
import { SignVisualDictionary } from '../SignVisualDictionary';
import { 
  BookOpen, 
  Languages, 
  GraduationCap, 
  ChevronRight, 
  ChevronLeft,
  RotateCw,
  CheckCircle2,
  Award,
  Layers,
  Hand,
  Tag,
  Play
} from 'lucide-react';

interface LearnISLPageProps {
  onOpenQuickModal: (title: string, text: string) => void;
  searchQuery: string;
}

export const LearnISLPage: React.FC<LearnISLPageProps> = ({
  onOpenQuickModal,
}) => {
  const [activeLearnMode, setActiveLearnMode] = useState<'dictionary' | 'flashcards'>('dictionary');
  const [flashcardIdx, setFlashcardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCount, setMasteredCount] = useState(0);

  const currentCard = SIGN_DICTIONARY[flashcardIdx % SIGN_DICTIONARY.length];

  const handleNextCard = () => {
    setIsFlipped(false);
    setFlashcardIdx((prev) => (prev + 1) % SIGN_DICTIONARY.length);
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setFlashcardIdx((prev) => (prev - 1 + SIGN_DICTIONARY.length) % SIGN_DICTIONARY.length);
  };

  const handleMarkMastered = () => {
    setMasteredCount((prev) => prev + 1);
    handleNextCard();
  };

  return (
    <div className="space-y-6">
      {/* Page Header Banner */}
      <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-blue-50 text-blue-700 border border-blue-200/80 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
              <Languages className="w-3.5 h-3.5 text-blue-600" />
              Interactive Sign Language Dictionary
            </span>
            <span className="bg-slate-100 text-slate-700 text-[11px] font-medium px-2.5 py-0.5 rounded-full border border-slate-200/80">
              {SIGN_DICTIONARY.length} Everyday Signs
            </span>
          </div>

          <h2 className="text-2xl font-black font-heading tracking-tight text-slate-900">
            Sign Language Reference & Practice
          </h2>

          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
            Learn essential conversational sign language gestures, handshapes, and ASL/ISL concept sequences.
          </p>
        </div>

        {/* Learning Mode Switcher Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200/80 shrink-0 w-full sm:w-auto">
          <button
            onClick={() => setActiveLearnMode('dictionary')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeLearnMode === 'dictionary'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Sign Dictionary</span>
          </button>

          <button
            onClick={() => setActiveLearnMode('flashcards')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeLearnMode === 'flashcards'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>3D Flashcards Mode</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeLearnMode === 'dictionary' ? (
        <SignVisualDictionary
          items={SIGN_DICTIONARY}
          onOpenQuickModal={onOpenQuickModal}
        />
      ) : (
        /* 1. Flashcards Mode */
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Progress Tracker */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between text-xs font-semibold">
            <div className="flex items-center gap-2 text-slate-600">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Card {flashcardIdx + 1} of {SIGN_DICTIONARY.length}</span>
            </div>

            <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/80 font-bold">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Mastered: {masteredCount}</span>
            </div>
          </div>

          {/* 3D Flip Card Container */}
          <div className="perspective-1000 min-h-[360px]">
            <div
              className={`w-full min-h-[360px] relative rounded-3xl transition-transform duration-500 transform-style-3d cursor-pointer ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
              onClick={() => setIsFlipped(!isFlipped)}
            >
              {/* Front Card Face */}
              <div
                className={`absolute inset-0 w-full h-full bg-white rounded-3xl p-8 border border-slate-200/80 shadow-md flex flex-col justify-between backface-hidden ${
                  isFlipped ? 'pointer-events-none opacity-0' : 'opacity-100'
                }`}
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-3 py-1 rounded-full border border-blue-200/80 flex items-center gap-1">
                    <Tag className="w-3 h-3 text-blue-600" />
                    {currentCard.category}
                  </span>

                  <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Hand className="w-3.5 h-3.5 text-amber-500" />
                    {currentCard.handshapeIcon || 'Open Palm'}
                  </span>
                </div>

                <div className="py-8 text-center space-y-4">
                  <div className="w-20 h-20 rounded-2xl bg-blue-50/80 border border-blue-200/60 text-blue-600 flex items-center justify-center mx-auto text-4xl shadow-xs">
                    🤟
                  </div>

                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">
                      Sign Term
                    </span>
                    <h3 className="text-3xl font-black text-slate-900 font-heading">
                      "{currentCard.term}"
                    </h3>
                  </div>

                  <p className="text-xs text-slate-400 font-medium">
                    Tap anywhere or click "Flip to Reveal Sign" to inspect gesture guide and ASL gloss.
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
                  <span>Click to Flip Card</span>
                  <RotateCw className="w-4 h-4 text-slate-400 animate-spin-slow" />
                </div>
              </div>

              {/* Back Card Face (Revealed) */}
              <div
                className={`w-full min-h-[360px] bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 shadow-xl flex flex-col justify-between ${
                  !isFlipped ? 'hidden' : 'block'
                }`}
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <span className="bg-teal-500/20 text-teal-300 text-xs font-mono font-bold px-3 py-1 rounded-full border border-teal-500/30">
                    Gloss: [{currentCard.signGloss}]
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenQuickModal(`Demonstration: ${currentCard.term}`, `SIGN GLOSS: ${currentCard.signGloss}\n\nGESTURE INSTRUCTIONS:\n${currentCard.gestureGuide}\n\nDEFINITION:\n${currentCard.definition}`);
                    }}
                    className="bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1 cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-white" />
                    <span>Demonstrate</span>
                  </button>
                </div>

                <div className="py-4 space-y-4 text-left">
                  <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/60 space-y-2">
                    <span className="text-[10px] font-mono font-bold text-teal-400 uppercase tracking-wider block">
                      Gesture Movement Guide
                    </span>
                    <p className="text-sm font-medium text-slate-200 leading-relaxed">
                      {currentCard.gestureGuide}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                      Definition
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed font-normal">
                      {currentCard.definition}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-medium">
                  <span>Tap to flip back</span>
                  <span className="text-teal-400 font-bold">Category: {currentCard.category}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Flashcard Controls */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              onClick={handlePrevCard}
              className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs rounded-xl shadow-xs flex items-center gap-1 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              {isFlipped ? 'Flip Front' : 'Flip to Reveal Sign'}
            </button>

            <button
              onClick={handleMarkMastered}
              className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/80 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Mastered</span>
            </button>

            <button
              onClick={handleNextCard}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
