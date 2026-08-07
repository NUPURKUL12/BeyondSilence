import React from 'react';
import { UserRole, TextSize, PWAState } from '../types';
import { 
  Heart, 
  Stethoscope, 
  Users, 
  Eye, 
  Type, 
  Zap, 
  Download, 
  Sparkles,
  VolumeX,
  Volume2
} from 'lucide-react';

interface NavbarProps {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;
  isHighContrast: boolean;
  setIsHighContrast: (value: boolean) => void;
  onTriggerVisualFlash: () => void;
  pwaState: PWAState;
  onInstallPWA: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  userRole,
  setUserRole,
  textSize,
  setTextSize,
  isHighContrast,
  setIsHighContrast,
  onTriggerVisualFlash,
  pwaState,
  onInstallPWA,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white shadow-xl border-b border-slate-800">
      {/* Top Accessibility Bar */}
      <div className="bg-slate-950 px-4 py-1.5 text-xs border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-medium text-teal-400">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            Healthcare Deaf-First Accessibility Engine
          </span>
          <span className="hidden sm:inline-block text-slate-500">•</span>
          <span className="hidden sm:flex items-center gap-1 text-slate-400">
            <VolumeX className="w-3.5 h-3.5 text-amber-400" />
            Visual Sound Cues Active
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* High Contrast Toggle */}
          <button
            onClick={() => setIsHighContrast(!isHighContrast)}
            className={`px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-all ${
              isHighContrast
                ? 'bg-yellow-400 text-slate-950 shadow-md'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
            }`}
            title="Toggle WCAG AAA High Contrast Theme"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{isHighContrast ? 'Contrast: ON' : 'High Contrast'}</span>
          </button>

          {/* Text Size Switcher */}
          <div className="flex items-center bg-slate-800 rounded p-0.5 border border-slate-700">
            <span className="px-1.5 text-[10px] uppercase font-bold text-slate-400 flex items-center gap-0.5">
              <Type className="w-3 h-3" />
            </span>
            <button
              onClick={() => setTextSize('normal')}
              className={`px-2 py-0.5 rounded text-xs font-bold transition-all ${
                textSize === 'normal' ? 'bg-teal-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              A
            </button>
            <button
              onClick={() => setTextSize('large')}
              className={`px-2 py-0.5 rounded text-sm font-bold transition-all ${
                textSize === 'large' ? 'bg-teal-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              A+
            </button>
            <button
              onClick={() => setTextSize('xlarge')}
              className={`px-2 py-0.5 rounded text-base font-extrabold transition-all ${
                textSize === 'xlarge' ? 'bg-teal-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              A++
            </button>
          </div>

          {/* Test Screen Flash for Deaf Alerts */}
          <button
            onClick={onTriggerVisualFlash}
            className="px-2.5 py-1 rounded text-xs font-semibold bg-rose-950/80 text-rose-300 hover:bg-rose-900 border border-rose-800/80 flex items-center gap-1.5 transition-all"
            title="Test visual alert flash animation"
          >
            <Zap className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
            <span className="hidden md:inline">Test Visual Flash</span>
          </button>

          {/* PWA Install Status */}
          {pwaState.canInstall && (
            <button
              onClick={onInstallPWA}
              className="px-2.5 py-1 rounded text-xs font-bold bg-teal-500 hover:bg-teal-400 text-slate-950 flex items-center gap-1 transition-all shadow"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install App</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Brand & Mode Switcher Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-400 p-0.5 shadow-lg shadow-teal-900/40 flex items-center justify-center">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center relative overflow-hidden">
              <Heart className="w-6 h-6 text-teal-400 fill-teal-400/20" />
              <div className="absolute inset-0 bg-teal-400/10 animate-ping rounded-full pointer-events-none" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight text-white font-heading">
                Beyond<span className="text-teal-400">Silence</span>
              </h1>
              <span className="bg-teal-500/20 text-teal-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-teal-500/30 uppercase tracking-wide">
                PWA Health
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Deaf-Accessible Healthcare Communication & Sound Radar
            </p>
          </div>
        </div>

        {/* Multi-Role Navigation Toggle */}
        <div className="w-full md:w-auto bg-slate-950/80 p-1 rounded-xl border border-slate-800 flex items-center justify-between gap-1 shadow-inner">
          <button
            onClick={() => setUserRole('deaf_patient')}
            className={`flex-1 md:flex-initial px-3.5 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              userRole === 'deaf_patient'
                ? 'bg-teal-600 text-white shadow-md shadow-teal-900/50 ring-1 ring-teal-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Eye className="w-4 h-4 text-teal-300" />
            <span>Deaf Patient</span>
          </button>

          <button
            onClick={() => setUserRole('doctor')}
            className={`flex-1 md:flex-initial px-3.5 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              userRole === 'doctor'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/50 ring-1 ring-cyan-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Stethoscope className="w-4 h-4 text-cyan-300" />
            <span>Doctor / Nurse</span>
          </button>

          <button
            onClick={() => setUserRole('caregiver')}
            className={`flex-1 md:flex-initial px-3.5 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              userRole === 'caregiver'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/50 ring-1 ring-indigo-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Users className="w-4 h-4 text-indigo-300" />
            <span>Caregiver</span>
          </button>
        </div>
      </div>
    </header>
  );
};
