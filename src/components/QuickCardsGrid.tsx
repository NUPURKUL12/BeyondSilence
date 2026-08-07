import React, { useState } from 'react';
import { QuickPhrase } from '../types';
import { 
  Smile, 
  Heart, 
  Languages, 
  PenTool, 
  Users, 
  Clock, 
  Compass, 
  Maximize2, 
  Plus,
  MessageSquare,
  RotateCcw
} from 'lucide-react';

interface QuickCardsGridProps {
  phrases: QuickPhrase[];
  onOpenQuickModal: (title: string, text: string) => void;
  onAddCustomPhrase: (phrase: QuickPhrase) => void;
}

export const QuickCardsGrid: React.FC<QuickCardsGridProps> = ({
  phrases,
  onOpenQuickModal,
  onAddCustomPhrase,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [customText, setCustomText] = useState('');
  const [customGloss, setCustomGloss] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Languages':
        return <Languages className="w-5 h-5 text-blue-600" />;
      case 'PenTool':
        return <PenTool className="w-5 h-5 text-indigo-600" />;
      case 'Smile':
        return <Smile className="w-5 h-5 text-emerald-600" />;
      case 'Heart':
        return <Heart className="w-5 h-5 text-rose-600" />;
      case 'Compass':
        return <Compass className="w-5 h-5 text-amber-600" />;
      case 'Users':
        return <Users className="w-5 h-5 text-teal-600" />;
      case 'Clock':
        return <Clock className="w-5 h-5 text-purple-600" />;
      case 'RotateCcw':
        return <RotateCcw className="w-5 h-5 text-blue-600" />;
      default:
        return <MessageSquare className="w-5 h-5 text-blue-600" />;
    }
  };

  const filteredPhrases =
    selectedCategory === 'all'
      ? phrases
      : phrases.filter((p) => p.category === selectedCategory);

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) return;

    const newPhrase: QuickPhrase = {
      id: `custom-${Date.now()}`,
      category: 'daily',
      text: customText,
      signGloss: customGloss || customText.toUpperCase(),
      iconName: 'MessageSquare',
      description: 'Custom phrase card',
    };

    onAddCustomPhrase(newPhrase);
    setCustomText('');
    setCustomGloss('');
    setIsAdding(false);
  };

  return (
    <section className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200/80 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-slate-900 font-heading">
              Quick Phrase Cards
            </h3>
            <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-blue-200/80">
              High Contrast
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Tap any phrase card to display full-screen text and ASL glosses
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4 text-blue-400" />
          <span>Add Phrase Card</span>
        </button>
      </div>

      {/* Add Custom Phrase Drawer */}
      {isAdding && (
        <form onSubmit={handleAddCustom} className="bg-slate-50 p-4 rounded-xl border border-blue-200 space-y-3">
          <h4 className="text-sm font-bold text-slate-900 font-heading">Create Custom Card</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide block mb-1">
                English Phrase
              </label>
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="e.g. Please speak slower"
                className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-xs focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide block mb-1">
                Sign Language Gloss
              </label>
              <input
                type="text"
                value={customGloss}
                onChange={(e) => setCustomGloss(e.target.value)}
                placeholder="e.g. PLEASE SPEAK SLOW MORE"
                className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-xs font-mono focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!customText.trim()}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-xs cursor-pointer"
            >
              Save Card
            </button>
          </div>
        </form>
      )}

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'all', label: 'All Cards' },
          { id: 'urgent', label: '⚡ High Priority' },
          { id: 'greetings', label: '👋 Greetings' },
          { id: 'daily', label: '💬 Everyday Phrases' },
          { id: 'questions', label: '❓ Questions' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPhrases.map((phrase) => (
          <div
            key={phrase.id}
            onClick={() => onOpenQuickModal(phrase.text, phrase.signGloss)}
            className="p-5 rounded-2xl border border-slate-200/80 bg-white hover:border-blue-300 transition-all cursor-pointer hover:shadow-md group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-slate-100 border border-slate-200/60 group-hover:scale-105 transition-transform">
                  {getIcon(phrase.iconName)}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-blue-600 flex items-center gap-1">
                  <span>FULLSCREEN</span>
                  <Maximize2 className="w-3 h-3" />
                </span>
              </div>

              <h4 className="text-base font-bold text-slate-900 leading-snug font-heading">
                {phrase.text}
              </h4>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold font-mono text-teal-700 bg-teal-50 border border-teal-200/60 px-2.5 py-1 rounded-md">
                🤟 {phrase.signGloss}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
