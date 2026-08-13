import React from 'react';
import { motion } from 'motion/react';
import { Video, Home, ArrowRight, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeView?: 'landing' | 'live';
  onViewChange?: (view: 'landing' | 'live') => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView = 'landing',
  onViewChange,
}) => {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/60 transition-all shadow-[0_10px_30px_rgba(15,23,42,0.03)]"
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-4">
        <motion.div
          onClick={() => onViewChange?.('landing')}
          className="flex items-center gap-3.5 cursor-pointer select-none group"
          whileHover="hover"
          initial="rest"
          animate="rest"
        >
          <motion.div
            variants={{
              rest: { scale: 1, rotate: 0 },
              hover: { scale: 1.06, rotate: 2 },
            }}
            transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
            className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-teal-500 p-0.5 shadow-md shadow-blue-500/20 flex items-center justify-center shrink-0"
          >
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center p-2 relative overflow-hidden">
              <motion.svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-full h-full text-blue-600"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                variants={{
                  rest: { scale: 1 },
                  hover: { scale: 1.08 },
                }}
                transition={{ duration: 0.25 }}
              >
                <path d="M7 16V8a4 4 0 0 1 8 0v8" className="text-blue-600" />
                <path d="M11 19c-3.5 0-6-2.5-6-6v-1" className="text-indigo-600" />
                <path d="M13 19c3.5 0 6-2.5 6-6v-1" className="text-teal-600" />
                <circle cx="12" cy="11" r="1.5" className="fill-blue-600 stroke-none" />
              </motion.svg>
            </div>
          </motion.div>

          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight font-heading text-slate-900 leading-none group-hover:text-blue-700 transition-colors duration-200">
              Beyond<span className="text-blue-600 group-hover:text-indigo-600 transition-colors duration-200">Silence</span>
            </span>
            <span className="text-[10px] font-semibold text-slate-500 tracking-wider uppercase mt-1 group-hover:text-slate-700 transition-colors duration-200">
              Indian Sign Language Platform
            </span>
          </div>
        </motion.div>

        {onViewChange && (
          <div className="hidden md:flex items-center gap-3">
            <nav className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-slate-100/80 p-1.5">
              <button
                onClick={() => onViewChange('landing')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeView === 'landing'
                    ? 'bg-white text-blue-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                Overview
              </button>

              <button
                onClick={() => onViewChange('live')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeView === 'live'
                    ? 'bg-white text-blue-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                Live Communication
              </button>
            </nav>
          </div>
        )}

        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-semibold text-slate-600">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Platform ready
          </div>

          <button className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-slate-900/10 transition-all hover:-translate-y-0.5 hover:bg-slate-800">
            Request demo
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.header>
  );
};
