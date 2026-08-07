import React, { useState } from 'react';
import { SignDictionaryItem } from '../types';
import { 
  Search, 
  Languages, 
  Activity, 
  Building2, 
  Play,
  Filter
} from 'lucide-react';

interface SignVisualDictionaryProps {
  items: SignDictionaryItem[];
  onOpenQuickModal: (title: string, text: string) => void;
}

export const SignVisualDictionary: React.FC<SignVisualDictionaryProps> = ({
  items,
  onOpenQuickModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Categories list
  const categories = ['All', 'Greetings', 'Daily', 'Questions'];

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.signGloss.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || 
      item.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const getIcon = (handshape: string) => {
    switch (handshape) {
      case 'Activity':
        return <Activity className="w-4 h-4 text-blue-600" />;
      case 'Building2':
        return <Building2 className="w-4 h-4 text-slate-700" />;
      default:
        return <Languages className="w-4 h-4 text-teal-600" />;
    }
  };

  return (
    <section className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200/80 space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-slate-900 font-heading">
              Sign Language Visual Dictionary
            </h3>
            <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-blue-200/80">
              ISL & ASL Standard
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Search gesture terms, ASL/ISL sign glosses, and physical movement guides
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sign gesture (e.g. Hello, Help)..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
          />
        </div>
      </div>

      {/* Filterable Pill Chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-slate-400 flex items-center gap-1 mr-1">
          <Filter className="w-3.5 h-3.5" />
          Category:
        </span>
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200/70 text-slate-700'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Dictionary Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl border border-slate-200/80 hover:border-blue-300 bg-white hover:bg-slate-50/50 transition-all cursor-pointer space-y-3 shadow-xs hover:shadow-md group flex flex-col justify-between"
            onClick={() => onOpenQuickModal(item.term, `SIGN GLOSS: ${item.signGloss}\n\nGESTURE INSTRUCTIONS:\n${item.gestureGuide}\n\nDEFINITION:\n${item.definition}`)}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-slate-100 border border-slate-200/60 shrink-0">
                  {getIcon(item.handshapeIcon)}
                </div>

                <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/60">
                  {item.category}
                </span>
              </div>

              <div>
                <h4 className="text-base font-bold text-slate-900 font-heading">
                  {item.term}
                </h4>
                <p className="text-xs font-mono font-bold text-teal-700 mt-0.5">
                  🤟 [{item.signGloss}]
                </p>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed font-medium line-clamp-2">
                {item.gestureGuide}
              </p>
            </div>

            {/* Video Preview Trigger Button */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-medium">
                Sign Concept
              </span>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenQuickModal(`Demonstration: ${item.term}`, `SIGN GLOSS: ${item.signGloss}\n\nGESTURE GUIDE:\n${item.gestureGuide}\n\nDEFINITION:\n${item.definition}`);
                }}
                className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] px-3 py-1.5 rounded-lg border border-blue-200/80 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Play className="w-3 h-3 fill-blue-700" />
                <span>Preview Gesture</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
          <p className="text-sm font-semibold text-slate-700">No sign gestures found</p>
          <p className="text-xs text-slate-400">Try adjusting your search query or selecting "All" categories.</p>
        </div>
      )}
    </section>
  );
};
