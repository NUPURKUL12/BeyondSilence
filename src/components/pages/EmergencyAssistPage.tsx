import React, { useState, useEffect, useRef } from 'react';
import { 
  Zap, 
  PhoneCall, 
  MessageSquare, 
  User, 
  Maximize2,
  BellRing,
  Radio,
  RotateCcw,
  Languages
} from 'lucide-react';
import { UserRole } from '../../types';
import { CameraFeed } from '../CameraFeed';

interface EmergencyAssistPageProps {
  onTriggerVisualFlash: () => void;
  onOpenQuickModal: (title: string, text: string) => void;
  userRole: UserRole;
}

export const EmergencyAssistPage: React.FC<EmergencyAssistPageProps> = ({
  onTriggerVisualFlash,
  onOpenQuickModal,
}) => {
  const [holdingProgress, setHoldingProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [sosActivated, setSosActivated] = useState(false);
  const intervalRef = useRef<any>(null);

  useEffect(() => {
    if (isHolding && !sosActivated) {
      intervalRef.current = setInterval(() => {
        setHoldingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(intervalRef.current);
            setSosActivated(true);
            onTriggerVisualFlash();
            return 100;
          }
          return prev + 1.67;
        });
      }, 50);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (!sosActivated) {
        setHoldingProgress(0);
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isHolding, sosActivated, onTriggerVisualFlash]);

  const handleResetSos = () => {
    setSosActivated(false);
    setHoldingProgress(0);
  };

  // High-Priority Phrase Tiles
  const priorityTiles = [
    {
      id: 'p1',
      title: 'Need Sign Interpreter',
      signGloss: 'DEAF ME — WANT INTERPRETER',
      desc: 'Requests a certified ASL / ISL sign language interpreter',
      urgency: 'high',
      badgeStyle: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      id: 'p2',
      title: 'Please Write Down',
      signGloss: 'PLEASE WRITE PAPER SCREEN TYPE',
      desc: 'Instructs person to write or type on screen for communication',
      urgency: 'high',
      badgeStyle: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
    {
      id: 'p3',
      title: 'Lost / Need Directions',
      signGloss: 'ME LOST — DIRECTION NEED HELP',
      desc: 'Informs people you need help finding a location or room',
      urgency: 'medium',
      badgeStyle: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      id: 'p4',
      title: 'Deaf & Hard of Hearing',
      signGloss: 'ME DEAF — CANNOT HEARING — WRITE PLEASE',
      desc: 'Informs staff or support personnel of hearing status',
      urgency: 'medium',
      badgeStyle: 'bg-slate-100 text-slate-700 border-slate-200',
    },
  ];

  // Primary Contacts List
  const primaryContacts = [
    {
      id: 'c1',
      name: 'Sarah Morgan',
      role: 'Family Member & Contact',
      phone: '+1 (555) 876-5432',
      label: 'Primary Personal Contact',
      status: 'SMS Online',
      statusColor: 'bg-emerald-500',
    },
    {
      id: 'c2',
      name: 'Sign Language Relay Service',
      role: '24/7 VRS Interpreter Desk',
      phone: '+1 (555) 911-0000',
      label: 'Video Relay Service (VRS)',
      status: '24/7 Relay Line',
      statusColor: 'bg-blue-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Hold-to-Activate Signal Trigger Hub Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs relative overflow-hidden space-y-6 text-center sm:text-left">
        {/* Banner Top Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                <Languages className="w-3.5 h-3.5 text-blue-600" />
                Quick Assistance & Relay Hub
              </span>
              <span className="bg-slate-100 text-slate-600 border border-slate-200 text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                <Radio className="w-3.5 h-3.5 text-blue-600" />
                SMS & Voice Relay Standby
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading tracking-tight">
              Visual Assistance & Communication Signal
            </h2>
          </div>

          <button
            onClick={onTriggerVisualFlash}
            className="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            <Zap className="w-4 h-4 text-amber-600" />
            <span>Test Screen Flash</span>
          </button>
        </div>

        {/* SOS Center Trigger Section */}
        <div className="flex flex-col items-center justify-center py-2 space-y-4">
          <div className="relative flex items-center justify-center">
            {/* Outer Animated Ring Pulse */}
            <div
              className={`absolute -inset-4 rounded-full ring-8 ring-blue-500/20 transition-all ${
                isHolding ? 'scale-110 ring-blue-500/40' : 'animate-pulse'
              }`}
            />

            {/* Circular Signal Button */}
            <button
              onMouseDown={() => setIsHolding(true)}
              onMouseUp={() => setIsHolding(false)}
              onMouseLeave={() => setIsHolding(false)}
              onTouchStart={() => setIsHolding(true)}
              onTouchEnd={() => setIsHolding(false)}
              className={`relative w-40 h-40 sm:w-44 sm:h-44 rounded-full border-4 flex flex-col items-center justify-center transition-all cursor-pointer shadow-md select-none z-10 ${
                sosActivated
                  ? 'bg-blue-600 border-white text-white animate-bounce'
                  : holdingProgress > 0
                  ? 'bg-blue-600 border-blue-300 text-white scale-102'
                  : 'bg-blue-600 hover:bg-blue-700 border-blue-400 text-white hover:scale-102'
              }`}
            >
              {/* SVG Circular Progress Ring Fill */}
              <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-1">
                <circle
                  cx="50%"
                  cy="50%"
                  r="44%"
                  className="stroke-blue-800/40 fill-none"
                  strokeWidth="8"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="44%"
                  className="stroke-amber-300 fill-none transition-all duration-75"
                  strokeWidth="8"
                  strokeDasharray="283"
                  strokeDashoffset={283 - (283 * Math.min(holdingProgress, 100)) / 100}
                />
              </svg>

              <BellRing className="w-10 h-10 text-white mb-1 drop-shadow-xs" />
              <span className="text-base font-black font-heading uppercase tracking-wider">
                {sosActivated ? 'SIGNAL ACTIVE' : 'PRESS & HOLD'}
              </span>
              <span className="text-[11px] font-semibold text-blue-100 mt-0.5">
                {sosActivated ? 'Relay Sent' : 'Hold 3 Sec to Signal'}
              </span>
            </button>
          </div>

          <p className="text-xs text-slate-500 font-medium max-w-md text-center">
            Press and hold for <strong className="text-slate-800">3 seconds</strong> to trigger visual screen alerts and notify your primary contact.
          </p>

          {sosActivated && (
            <button
              onClick={handleResetSos}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Signal</span>
            </button>
          )}
        </div>

        {/* Signal Activated Alert */}
        {sosActivated && (
          <div className="bg-blue-600 text-white p-5 rounded-2xl border border-blue-500 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <BellRing className="w-7 h-7 text-white animate-bounce shrink-0" />
                <div>
                  <h3 className="text-base font-bold font-heading">
                    ASSISTANCE SIGNAL DISPATCHED
                  </h3>
                  <p className="text-xs text-blue-100">
                    Visual screen flash activated • SMS notification dispatched to contact
                  </p>
                </div>
              </div>

              <button
                onClick={() => onOpenQuickModal('ASSISTANCE NEEDED', 'I AM DEAF AND COMMUNICATE IN SIGN LANGUAGE. PLEASE WRITE DOWN OR TYPE ON SCREEN.')}
                className="px-4 py-2 bg-white text-blue-900 font-bold text-xs rounded-xl shadow-xs hover:bg-blue-50 shrink-0 cursor-pointer"
              >
                Project Fullscreen Alert Card
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2. Main Content Layout: Priority Phrase Cards + Contacts Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Visual Urgency Phrase Tiles */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-heading">
              Priority Assistance Cards
            </h3>
            <p className="text-xs text-slate-500">
              Tap any card to instantly project fullscreen high-contrast sign language glosses
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {priorityTiles.map((tile) => (
              <div
                key={tile.id}
                onClick={() => onOpenQuickModal(tile.title.toUpperCase(), `${tile.title}\n\nSign Gloss: ${tile.signGloss}\n\nNote: ${tile.desc}`)}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer space-y-3 flex flex-col justify-between group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${tile.badgeStyle}`}>
                      {tile.urgency} Priority
                    </span>
                    <Maximize2 className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                  </div>

                  <h4 className="text-lg font-extrabold text-slate-900 font-heading leading-snug">
                    {tile.title}
                  </h4>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Sign Language Gloss
                    </span>
                    <p className="text-xl font-mono font-bold text-teal-700 leading-tight">
                      🤟 {tile.signGloss}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  {tile.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Camera & Contacts Sidebar */}
        <div className="space-y-6">
          <CameraFeed
            title="Emergency Visual Camera Feed"
            description="Activate webcam stream for visual relay assistance"
          />

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5 h-fit">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-200/80 flex items-center justify-center font-bold shrink-0">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-heading">
                    Primary Contacts
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Direct SMS & Voice Relay
                  </p>
                </div>
              </div>
            </div>

          <div className="space-y-3.5">
            {primaryContacts.map((contact) => (
              <div
                key={contact.id}
                className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/80 hover:bg-slate-100/80 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-slate-900 text-teal-300 font-bold text-xs flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 font-heading">
                        {contact.name}
                      </h4>
                      <p className="text-[11px] font-medium text-slate-500">
                        {contact.role}
                      </p>
                    </div>
                  </div>

                  <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded-full border border-slate-200 shrink-0">
                    <span className={`w-2 h-2 rounded-full ${contact.statusColor} animate-pulse`} />
                    {contact.status}
                  </span>
                </div>

                <div className="text-[11px] text-slate-500 space-y-0.5 font-mono">
                  <p className="text-slate-700 font-semibold">{contact.label}</p>
                  <p className="font-bold text-slate-900">{contact.phone}</p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60">
                  <button
                    onClick={() => alert(`Sending SMS message to ${contact.name}`)}
                    className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Send SMS</span>
                  </button>
                  <button
                    onClick={() => alert(`Calling relay line: ${contact.phone}`)}
                    className="p-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg transition-colors cursor-pointer"
                    title="Initiate Voice Call"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);
};
