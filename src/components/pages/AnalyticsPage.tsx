import React from 'react';
import { SoundAlert, TranslationNote } from '../../types';
import { 
  Activity, 
  Volume2, 
  Sparkles, 
  ShieldCheck,
} from 'lucide-react';

interface AnalyticsPageProps {
  soundAlerts: SoundAlert[];
  medicalNotes: TranslationNote[];
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({
  soundAlerts,
}) => {
  const stats = [
    { label: 'Live Captions Spoken Words', value: '4,280', change: '+18% this month', icon: Activity, color: 'text-teal-600' },
    { label: 'AI Translation Notes', value: '38 Summaries', change: '100% Accuracy', icon: Sparkles, color: 'text-indigo-600' },
    { label: 'Sound Radar Alerts Logs', value: `${soundAlerts.length} Captured`, change: '100% Visual Strobe', icon: Volume2, color: 'text-amber-600' },
    { label: 'Communication Clarity Rating', value: '98.5%', change: 'WCAG AAA Compliant', icon: ShieldCheck, color: 'text-emerald-600' },
  ];

  const soundTypeBreakdown = [
    { type: 'Name Called / Speech', count: 12, percentage: 45, color: 'bg-[#1565C0]' },
    { type: 'Doorbell / Knock', count: 8, percentage: 30, color: 'bg-[#00897B]' },
    { type: 'Alarm / Appliance Beep', count: 4, percentage: 15, color: 'bg-rose-500' },
    { type: 'Phone Ring', count: 3, percentage: 10, color: 'bg-amber-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-indigo-100 text-indigo-800 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              COMMUNICATION ANALYTICS
            </span>
            <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
              Real-Time Log Audit
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 font-heading tracking-tight mt-1">
            Communication Efficiency & Sound Radar Log
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Monitors environmental audio events, speech clarity scores, and sign language translation history.
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {stat.label}
                </span>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className="text-2xl font-black text-slate-900 font-heading">
                {stat.value}
              </div>
              <span className="text-[11px] font-extrabold text-emerald-600 block">
                {stat.change}
              </span>
            </div>
          );
        })}
      </div>

      {/* Sound Alert Frequency Chart & Decibel Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Sound Category Chart */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-base font-black text-slate-900 font-heading">
              Ambient Sound Detection Distribution
            </h3>
            <span className="text-xs font-bold text-slate-400">Past 30 Days</span>
          </div>

          <div className="space-y-3 pt-2">
            {soundTypeBreakdown.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span>{item.type}</span>
                  <span>{item.count} alerts ({item.percentage}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div
                    className={`${item.color} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Sound Alert Event Log */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-base font-black text-slate-900 font-heading">
              Recent Visual Radar Sound Logs
            </h3>
            <span className="text-xs font-mono text-teal-700 font-bold">Live Stream</span>
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {soundAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 text-amber-300 flex items-center justify-center font-bold">
                    <Volume2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">{alert.label}</span>
                    <span className="text-[10px] text-slate-500">{alert.timestamp} • {alert.decibels} dB</span>
                  </div>
                </div>

                <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-amber-300">
                  {alert.priority.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
