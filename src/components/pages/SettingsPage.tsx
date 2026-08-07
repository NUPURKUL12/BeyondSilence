import React, { useState } from 'react';
import { 
  Settings, 
  Eye, 
  Type, 
  Zap, 
  Volume2, 
  Sliders, 
  Globe, 
  Smartphone, 
  Download, 
  CheckCircle2, 
  RefreshCw,
  Bell,
  ShieldCheck
} from 'lucide-react';
import { TextSize, PWAState } from '../../types';

interface SettingsPageProps {
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;
  isHighContrast: boolean;
  setIsHighContrast: (hc: boolean) => void;
  onTriggerVisualFlash: () => void;
  pwaState: PWAState;
  onInstallPWA: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  textSize,
  setTextSize,
  isHighContrast,
  setIsHighContrast,
  onTriggerVisualFlash,
  pwaState,
  onInstallPWA,
}) => {
  const [radarSensitivity, setRadarSensitivity] = useState(70);
  const [speechRate, setSpeechRate] = useState(0.9);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [autoSimplify, setAutoSimplify] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-slate-100 text-slate-800 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              SYSTEM PREFERENCES
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 font-heading tracking-tight mt-1">
            Accessibility & Sound Radar Preferences
          </h2>
          <p className="text-xs text-slate-500">
            Customize visual flash intensity, text sizing, haptics, and PWA offline storage.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 bg-[#1565C0] hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow transition-all flex items-center gap-1.5 shrink-0"
        >
          {savedSuccess ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Settings className="w-4 h-4" />}
          <span>{savedSuccess ? 'Preferences Saved!' : 'Save Settings'}</span>
        </button>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Visual & Typography Settings */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
            <Eye className="w-5 h-5 text-[#1565C0]" />
            <h3 className="text-base font-black text-slate-900 font-heading">
              Visual & Display Accessibility
            </h3>
          </div>

          <div className="space-y-4 text-xs">
            {/* Text Scale */}
            <div className="space-y-2">
              <label className="font-bold text-slate-800 block">
                UI Typography Scaling
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setTextSize('normal')}
                  className={`p-2.5 rounded-xl border font-bold text-xs transition-all ${
                    textSize === 'normal'
                      ? 'bg-[#1565C0] text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Standard (100%)
                </button>
                <button
                  onClick={() => setTextSize('large')}
                  className={`p-2.5 rounded-xl border font-bold text-xs transition-all ${
                    textSize === 'large'
                      ? 'bg-[#1565C0] text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Large (+10%)
                </button>
                <button
                  onClick={() => setTextSize('xlarge')}
                  className={`p-2.5 rounded-xl border font-bold text-xs transition-all ${
                    textSize === 'xlarge'
                      ? 'bg-[#1565C0] text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  X-Large (+20%)
                </button>
              </div>
            </div>

            {/* High Contrast */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <span className="font-bold text-slate-900 block">WCAG AAA High Contrast</span>
                <span className="text-[10px] text-slate-500">Pure black canvas with high legibility text</span>
              </div>
              <button
                onClick={() => setIsHighContrast(!isHighContrast)}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  isHighContrast ? 'bg-amber-400' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-slate-950 transition-transform ${
                    isHighContrast ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Visual Strobe Test */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-200">
              <div>
                <span className="font-bold text-amber-950 block">Screen Boundary Flash Alert</span>
                <span className="text-[10px] text-amber-800">Visual pulse when high-decibel alerts trigger</span>
              </div>
              <button
                onClick={onTriggerVisualFlash}
                className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-lg shadow-xs"
              >
                Test Strobe
              </button>
            </div>
          </div>
        </div>

        {/* Sound Radar & Mic Sensitivity */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
            <Volume2 className="w-5 h-5 text-[#00897B]" />
            <h3 className="text-base font-black text-slate-900 font-heading">
              Sound Radar & Haptic Detection
            </h3>
          </div>

          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <div className="flex justify-between font-bold text-slate-800">
                <span>Sound Radar Mic Threshold</span>
                <span className="font-mono text-teal-700">{radarSensitivity} dB</span>
              </div>
              <input
                type="range"
                min="40"
                max="95"
                value={radarSensitivity}
                onChange={(e) => setRadarSensitivity(Number(e.target.value))}
                className="w-full accent-teal-600"
              />
              <span className="text-[10px] text-slate-400 block">
                Lower values catch softer knocks; higher values trigger only on loud alarms/names.
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between font-bold text-slate-800">
                <span>Speech Synthesis Speed</span>
                <span className="font-mono text-blue-700">{speechRate}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.1"
                value={speechRate}
                onChange={(e) => setSpeechRate(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <span className="font-bold text-slate-900 block">Haptic Vibration Engine</span>
                <span className="text-[10px] text-slate-500">Vibrates phone on detected alerts</span>
              </div>
              <button
                onClick={() => setHapticsEnabled(!hapticsEnabled)}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  hapticsEnabled ? 'bg-teal-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    hapticsEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* PWA & Offline Cache Manager */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
          <Smartphone className="w-5 h-5 text-indigo-600" />
          <h3 className="text-base font-black text-slate-900 font-heading">
            Progressive Web App (PWA) Offline Storage
          </h3>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="space-y-1">
            <span className="font-bold text-slate-900 block">
              Offline Cache Status: Active (120+ Sign Gestures & AI Engine Cached)
            </span>
            <p className="text-slate-500">
              BeyondSilence remains fully operational in hospital ER areas with weak cellular or Wi-Fi connectivity.
            </p>
          </div>

          {pwaState.canInstall ? (
            <button
              onClick={onInstallPWA}
              className="px-4 py-2 bg-[#00897B] hover:bg-teal-700 text-white font-extrabold text-xs rounded-xl shadow shrink-0 flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Install to Home Screen</span>
            </button>
          ) : (
            <span className="bg-emerald-100 text-emerald-800 font-extrabold px-3 py-1.5 rounded-xl border border-emerald-200 shrink-0">
              ✓ App Ready for Offline Use
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
