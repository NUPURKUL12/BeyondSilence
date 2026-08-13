import React, { useState, useEffect } from 'react';
import { SoundAlert } from '../types';
import { 
  BellRing, 
  DoorClosed, 
  PhoneCall, 
  AlertTriangle, 
  Zap, 
  Plus, 
  Trash2, 
  Sparkles,
  Activity,
  CheckCircle2
} from 'lucide-react';

interface VisualSoundRadarProps {
  alerts: SoundAlert[];
  onTriggerVisualFlash: () => void;
  onClearAlerts: () => void;
}

export const VisualSoundRadar: React.FC<VisualSoundRadarProps> = ({
  alerts: initialAlerts,
  onTriggerVisualFlash,
  onClearAlerts,
}) => {
  const [alerts, setAlerts] = useState<SoundAlert[]>(initialAlerts);
  const [customSoundLabel, setCustomSoundLabel] = useState('');
  const [isSimulatingNoise] = useState(true);
  const [currentDecibels, setCurrentDecibels] = useState(48);

  useEffect(() => {
    if (!isSimulatingNoise) return;
    const interval = setInterval(() => {
      const db = Math.floor(40 + Math.random() * 30);
      setCurrentDecibels(db);
    }, 1500);
    return () => clearInterval(interval);
  }, [isSimulatingNoise]);

  const handleAddTrigger = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSoundLabel.trim()) return;

    const newAlert: SoundAlert = {
      id: `sa-${Date.now()}`,
      type: 'name_called',
      label: customSoundLabel,
      decibels: Math.floor(70 + Math.random() * 20),
      timestamp: 'Just now',
      priority: 'high',
      icon: 'BellRing',
      visualColor: 'amber',
    };

    setAlerts([newAlert, ...alerts]);
    setCustomSoundLabel('');
    onTriggerVisualFlash();
  };

  const removeAlert = (id: string) => {
    setAlerts(alerts.filter((a) => a.id !== id));
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-rose-50 text-rose-700 border border-rose-200';
      case 'high':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'medium':
      default:
        return 'bg-slate-100 text-slate-700 border border-slate-200';
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6 text-slate-900">
      {/* Sound Radar Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600 relative shrink-0">
            <BellRing className="w-5 h-5 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900 font-heading">
                Visual Sound Radar & Ambient Alerts
              </h3>
              <span className="bg-amber-50 text-amber-800 text-[10px] font-semibold px-2.5 py-0.5 rounded-full border border-amber-200">
                Visual Alerts
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Converts ambient knocks, phone rings, and name calls into visual screen flashes
            </p>
          </div>
        </div>

        {/* Ambient Noise Level Indicator */}
        <div className="bg-slate-50 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-xl font-mono flex items-center gap-2.5 text-xs w-full sm:w-auto justify-between shrink-0">
          <div className="flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span className="font-sans font-medium text-slate-500 text-xs">Noise Level:</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">{currentDecibels} dB</span>
            <div className="flex items-end gap-0.5 h-3.5 w-10">
              <span className="w-1.5 bg-emerald-500 rounded-t wave-bar-1" />
              <span className="w-1.5 bg-emerald-400 rounded-t wave-bar-2" />
              <span className="w-1.5 bg-amber-400 rounded-t wave-bar-3" />
              <span className="w-1.5 bg-rose-500 rounded-t wave-bar-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Active Sound Events List */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              Recent Detected Sound Events ({alerts.length})
            </span>
            <button
              onClick={() => {
                setAlerts([]);
                onClearAlerts();
              }}
              className="text-xs text-slate-400 hover:text-rose-600 font-semibold transition-colors cursor-pointer"
            >
              Clear All
            </button>
          </div>

          <div className="divide-y divide-slate-100 max-h-[360px] overflow-y-auto pr-1">
            {alerts.length > 0 ? (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="py-3.5 flex items-center justify-between gap-4 transition-all"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center shrink-0">
                      {alert.type === 'doorbell' || alert.type === 'knock' ? (
                        <DoorClosed className="w-5 h-5 text-teal-600" />
                      ) : alert.type === 'phone' ? (
                        <PhoneCall className="w-5 h-5 text-indigo-600" />
                      ) : alert.type === 'alarm' ? (
                        <AlertTriangle className="w-5 h-5 text-rose-600 animate-bounce" />
                      ) : (
                        <BellRing className="w-5 h-5 text-amber-600" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 font-heading truncate">
                          {alert.label}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full shrink-0 ${getPriorityBadge(
                            alert.priority
                          )}`}
                        >
                          {alert.priority.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
                        <span>{alert.decibels} dB</span>
                        <span>•</span>
                        <span>{alert.timestamp}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={onTriggerVisualFlash}
                      className="p-2 rounded-lg bg-slate-50 hover:bg-amber-50 text-slate-500 hover:text-amber-600 border border-slate-200 transition-colors cursor-pointer"
                      title="Test Visual Flash"
                    >
                      <Zap className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => removeAlert(alert.id)}
                      className="p-2 rounded-lg bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 transition-colors cursor-pointer"
                      title="Dismiss Alert"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200/80 text-slate-500 space-y-2 my-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="text-sm font-bold text-slate-800">Quiet Environment - No Active Alerts</p>
                <p className="text-xs text-slate-500">Sensors are actively monitoring ambient sounds and door knocks.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 col): Custom Trigger Simulator */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
          <div>
            <h4 className="text-sm font-bold text-slate-900 font-heading flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-600" />
              Simulate Sound Trigger
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Add a custom sound keyword (e.g. "Front Door Knock", "Name Called 'Alex'") to test screen flash alerts.
            </p>
          </div>

          <form onSubmit={handleAddTrigger} className="space-y-3">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">
                Sound Keyword
              </label>
              <input
                type="text"
                value={customSoundLabel}
                onChange={(e) => setCustomSoundLabel(e.target.value)}
                placeholder="e.g. Front Door Knocking"
                className="w-full bg-white focus:ring-2 focus:ring-blue-500/20 border border-slate-200/80 rounded-xl px-4 py-2.5 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={!customSoundLabel.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Test Sound Flash</span>
            </button>
          </form>

          {/* Quick Preset Test Triggers */}
          <div className="pt-3 border-t border-slate-200/80 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
              Quick Test Triggers:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setCustomSoundLabel("Someone Called 'Alex'");
                  onTriggerVisualFlash();
                }}
                className="bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-full border border-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>🔔 Name Called</span>
              </button>
              <button
                onClick={() => {
                  setCustomSoundLabel("Door Knocking");
                  onTriggerVisualFlash();
                }}
                className="bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-full border border-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>🚪 Door Knock</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
