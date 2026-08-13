import React from 'react';
import { PWAState } from '../types';
import { Download, Wifi, WifiOff, Smartphone, X } from 'lucide-react';

interface PwaInstallBannerProps {
  pwaState: PWAState;
  onInstall: () => void;
  onDismiss: () => void;
}

export const PwaInstallBanner: React.FC<PwaInstallBannerProps> = ({
  pwaState,
  onInstall,
  onDismiss,
}) => {
  if (!pwaState.canInstall) return null;

  return (
    <div className="bg-slate-900 text-white p-4 rounded-2xl border border-teal-500/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 shrink-0">
          <Smartphone className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold font-heading text-white">
              Install BeyondSilence Healthcare PWA
            </h4>
            <span className="bg-teal-500/20 text-teal-300 text-[10px] font-bold px-2 py-0.5 rounded border border-teal-500/30">
              Offline Ready
            </span>
          </div>
          <p className="text-xs text-slate-300">
            Add BeyondSilence to your home screen for instant access during hospital visits even without Wi-Fi.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto">
        <button
          onClick={onInstall}
          className="flex-1 sm:flex-initial px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow"
        >
          <Download className="w-4 h-4" />
          <span>INSTALL TO HOME SCREEN</span>
        </button>

        <button
          onClick={onDismiss}
          className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
