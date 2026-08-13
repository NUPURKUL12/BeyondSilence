import React from 'react';
import { UserRole } from '../types';
import { 
  Bell, 
  Wifi, 
  Zap,
  Maximize2,
  QrCode,
  Languages,
  MessageSquare
} from 'lucide-react';

interface RoleOverviewBannerProps {
  userRole: UserRole;
  activeAlertCount: number;
  onTriggerVisualFlash: () => void;
  onOpenQuickModal: (title: string, text: string) => void;
}

export const RoleOverviewBanner: React.FC<RoleOverviewBannerProps> = ({
  userRole,
  activeAlertCount,
  onTriggerVisualFlash,
  onOpenQuickModal,
}) => {
  return (
    <div className="bg-white border border-slate-200/80 shadow-sm p-6 rounded-2xl text-slate-900 relative overflow-hidden">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Left Side: Avatar & Content */}
        <div className="flex items-start gap-4 max-w-3xl">
          {/* Avatar Badge */}
          <div className="relative shrink-0">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-bold text-lg flex items-center justify-center shadow-xs border border-blue-500/20 font-heading">
              AM
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center" title="System Online">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            </span>
          </div>

          {/* Main Greeting & Status Info */}
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-blue-50 text-blue-700 border border-blue-200/80 text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                {userRole === 'signer' ? 'Signer Profile Active' : 'Learner Mode Active'}
              </span>

              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Wifi className="w-3 h-3 text-emerald-600" />
                <span>Sign Translation AI Online</span>
              </span>

              {activeAlertCount > 0 && (
                <span className="bg-amber-50 text-amber-700 border border-amber-200/80 text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Bell className="w-3 h-3 text-amber-600" />
                  <span>{activeAlertCount} Sound Alert{activeAlertCount > 1 ? 's' : ''}</span>
                </span>
              )}
            </div>

            <h2 className="text-2xl font-black text-slate-900 font-heading tracking-tight">
              Welcome back, Alex
            </h2>

            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
              {userRole === 'signer'
                ? 'System Status: WebRTC sign video feed, live captions, ASL/ISL gloss generator, and ambient sound radar are ready.'
                : 'System Status: Interactive 3D flashcards, gesture dictionary, and speech-to-sign translator are active.'}
            </p>
          </div>
        </div>

        {/* Right Side: Action Buttons */}
        <div className="w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 min-w-[220px]">
          <button
            onClick={() => onOpenQuickModal("SIGNER COMMUNICATION CARD", "NAME: Alex Morgan\nCOMMUNICATION MODE: Sign Language / Text Captions\nPRIMARY LANGUAGE: ISL & ASL\nNOTE: Please talk directly into the microphone or write on screen.")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-3 rounded-xl shadow-xs border border-blue-500/20 flex items-center justify-between gap-3 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <QrCode className="w-4 h-4 text-blue-200" />
              <span>Full Signer Card</span>
            </div>
            <Maximize2 className="w-3.5 h-3.5 text-blue-200" />
          </button>

          <div className="flex items-center gap-2 w-full">
            <button
              onClick={() => onOpenQuickModal("QUICK ASSISTANCE NEEDED", "I am Deaf and communicate in Sign Language. Please write down what you are saying or type on screen.")}
              className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs px-3 py-2.5 rounded-xl border border-blue-200/80 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
              <span>Quick Card</span>
            </button>

            <button
              onClick={onTriggerVisualFlash}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-3 py-2.5 rounded-xl border border-slate-200/80 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Flash Alert</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
