import React from 'react';
import { 
  Search, 
  Eye, 
  Zap, 
  Download, 
  UserCheck, 
  Bell
} from 'lucide-react';
import { UserRole, TextSize, PWAState } from '../types';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;
  isHighContrast: boolean;
  setIsHighContrast: (hc: boolean) => void;
  onTriggerVisualFlash: () => void;
  pwaState: PWAState;
  onInstallPWA: () => void;
  isSidebarCollapsed: boolean;
  soundAlertCount: number;
  onNavigateToTab?: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  userRole,
  setUserRole,
  textSize,
  setTextSize,
  isHighContrast,
  setIsHighContrast,
  onTriggerVisualFlash,
  pwaState,
  onInstallPWA,
  soundAlertCount,
  onNavigateToTab,
}) => {
  return (
    <header
      className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 transition-all duration-300 px-4 sm:px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xs"
    >
      {/* Search Bar Layout */}
      <div className="relative w-full max-w-md flex items-center bg-slate-100/80 hover:bg-slate-100 focus-within:bg-white border border-slate-200/80 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 rounded-xl transition-all">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search sign gestures, phrases, transcripts..."
          className="w-full pl-10 pr-16 py-2 bg-transparent text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none"
        />
        {searchQuery ? (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 text-xs text-slate-400 hover:text-slate-600 font-semibold cursor-pointer"
          >
            Clear
          </button>
        ) : (
          <kbd className="absolute right-3 text-[10px] text-slate-400 bg-white shadow-xs border border-slate-200 px-1.5 py-0.5 rounded font-mono pointer-events-none select-none">
            ⌘K
          </kbd>
        )}
      </div>

      {/* Right Controls Bar & Accessibility Toolbar */}
      <div className="flex flex-wrap items-center justify-end gap-3 w-full md:w-auto">
        {/* Sound Radar Alert Indicator Badge */}
        {onNavigateToTab && (
          <button
            onClick={() => onNavigateToTab('dashboard')}
            className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100/80 border border-amber-200/80 text-amber-800 text-xs font-semibold flex items-center gap-1.5 transition-all relative cursor-pointer"
            title="Active Sound Detection"
          >
            <Bell className="w-4 h-4 text-amber-600" />
            <span className="hidden sm:inline">Sound Radar</span>
            {soundAlertCount > 0 && (
              <span className="bg-amber-500 text-slate-950 font-black text-[10px] px-1.5 py-0.2 rounded-full animate-pulse">
                {soundAlertCount}
              </span>
            )}
          </button>
        )}

        {/* Text Size Scale Toggle - Segmented Pill */}
        <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200/60">
          <button
            onClick={() => setTextSize('normal')}
            className={`px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer ${
              textSize === 'normal'
                ? 'bg-white shadow-xs text-blue-700 rounded-lg font-bold'
                : 'text-slate-500 hover:text-slate-900 rounded-lg'
            }`}
            title="Standard Text Size"
          >
            A
          </button>
          <button
            onClick={() => setTextSize('large')}
            className={`px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer ${
              textSize === 'large'
                ? 'bg-white shadow-xs text-blue-700 rounded-lg font-bold'
                : 'text-slate-500 hover:text-slate-900 rounded-lg'
            }`}
            title="Large Text (+10%)"
          >
            A+
          </button>
          <button
            onClick={() => setTextSize('xlarge')}
            className={`px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer ${
              textSize === 'xlarge'
                ? 'bg-white shadow-xs text-blue-700 rounded-lg font-bold'
                : 'text-slate-500 hover:text-slate-900 rounded-lg'
            }`}
            title="Extra Large Text (+20%)"
          >
            A++
          </button>
        </div>

        {/* High Contrast Mode Toggle */}
        <button
          onClick={() => setIsHighContrast(!isHighContrast)}
          className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border cursor-pointer ${
            isHighContrast
              ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-xs'
              : 'bg-slate-100 hover:bg-slate-200/70 text-slate-700 border-slate-200/80'
          }`}
          title="Toggle High Contrast Mode"
        >
          <Eye className="w-4 h-4" />
          <span className="hidden xl:inline">{isHighContrast ? 'Contrast ON' : 'High Contrast'}</span>
        </button>

        {/* Test Visual Flash Alert Button */}
        <button
          onClick={onTriggerVisualFlash}
          className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          title="Trigger Visual Screen Pulse Alert"
        >
          <Zap className="w-4 h-4 fill-slate-950/20" />
          <span className="hidden sm:inline">Test Alert</span>
        </button>

        {/* Role Switcher Selector */}
        <div className="relative">
          <select
            value={userRole}
            onChange={(e) => setUserRole(e.target.value as UserRole)}
            className="appearance-none bg-blue-50 border border-blue-100 text-blue-700 font-medium px-3 py-1.5 pr-8 rounded-xl hover:bg-blue-100/70 transition-colors text-xs cursor-pointer focus:outline-none"
          >
            <option value="signer">Signer Mode</option>
            <option value="learner">Learner Mode</option>
          </select>
          <UserCheck className="w-3.5 h-3.5 text-blue-600 absolute right-2.5 top-2.5 pointer-events-none" />
        </div>

        {/* PWA Install Button */}
        {pwaState.canInstall && (
          <button
            onClick={onInstallPWA}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#00897B] hover:bg-teal-700 text-white flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            title="Install PWA"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Install App</span>
          </button>
        )}
      </div>
    </header>
  );
};
