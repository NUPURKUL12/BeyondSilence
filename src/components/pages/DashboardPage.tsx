import React, { useState } from 'react';
import { UserRole, QuickPhrase } from '../../types';
import { 
  Video, 
  MessageSquare, 
  BookOpen, 
  ArrowRight, 
  Sliders,
  Volume2,
  VolumeX,
  Clock
} from 'lucide-react';

interface DashboardPageProps {
  userRole: UserRole;
  soundAlerts?: any[];
  quickPhrases: QuickPhrase[];
  medicalNotes?: any[];
  onTriggerVisualFlash?: () => void;
  onClearAlerts?: () => void;
  onOpenQuickModal: (title: string, text: string) => void;
  onAddCustomPhrase: (phrase: QuickPhrase) => void;
  onNavigateToTab: (tab: any) => void;
  searchQuery?: string;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  userRole,
  quickPhrases,
  onOpenQuickModal,
  onAddCustomPhrase,
  onNavigateToTab,
}) => {
  // Communication Settings State
  const [autoTTS, setAutoTTS] = useState(true);
  const [captionSize, setCaptionSize] = useState<'standard' | 'large' | 'xlarge'>('standard');
  const [avatarSpeed, setAvatarSpeed] = useState<number>(1.0);
  const [highContrastCaptions, setHighContrastCaptions] = useState(false);

  // Language & Translation Preferences State
  const [selectedSignDialect, setSelectedSignDialect] = useState<'ISL' | 'ASL' | 'BSL'>('ISL');
  const [spokenLanguage, setSpokenLanguage] = useState<'en' | 'hi' | 'es' | 'fr'>('en');
  const [translationMode, setTranslationMode] = useState<'gloss' | 'plain'>('gloss');

  // Recent Conversations Mock
  const [recentChats] = useState([
    {
      id: 'c1',
      title: 'Team Sync & Conversation',
      lastMessage: 'Welcome everyone! Meeting starts at 10 AM.',
      sender: 'Hearing User (Voice)',
      timestamp: '10:00 AM',
      glosses: ['WELCOME', 'EVERYONE', 'MEETING', 'START', 'TIME'],
      unread: false,
    },
    {
      id: 'c2',
      title: 'Sign Language Practice Session',
      lastMessage: 'Thank you! I have my presentation slides ready.',
      sender: 'Deaf User (ISL Sign)',
      timestamp: 'Yesterday',
      glosses: ['THANK_YOU', 'SLIDES', 'READY'],
      unread: false,
    },
    {
      id: 'c3',
      title: 'Everyday Q&A Dialogue',
      lastMessage: 'Could you please repeat that a bit slower?',
      sender: 'Hearing User (Voice)',
      timestamp: 'Aug 4',
      glosses: ['PLEASE', 'REPEAT', 'SLOW'],
      unread: false,
    },
  ]);

  return (
    <div className="space-y-6">
      {/* Clean & Focused Welcome Hero */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-sm relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>BeyondSilence Studio Active</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-white">
            Welcome back
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
            Real-time two-way communication bridging Deaf & Hearing users through webcam ISL gesture recognition, live speech captions, and 3D sign avatar animations.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
          <button
            onClick={() => onNavigateToTab('live_comm')}
            className="px-5 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer group"
          >
            <Video className="w-4 h-4 text-blue-200" />
            <span>Start Live Conversation</span>
            <ArrowRight className="w-4 h-4 text-blue-200 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            onClick={() => onNavigateToTab('learn_isl')}
            className="px-4 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-teal-400" />
            <span>ISL Dictionary</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Recent Chats + Settings & Preferences */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Recent Chats & Live Conversation Hub */}
        <div className="lg:col-span-7 space-y-6">
          {/* Recent Conversations Card */}
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200/80 space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-heading">
                    Recent Conversations
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Live chat history & ISL sign gloss transcripts
                  </p>
                </div>
              </div>

              <button
                onClick={() => onNavigateToTab('live_comm')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                <span>Open Live Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Conversation List */}
            <div className="space-y-3">
              {recentChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => onNavigateToTab('live_comm')}
                  className="p-4 rounded-xl border border-slate-200/80 hover:border-blue-300 bg-slate-50/50 hover:bg-blue-50/30 transition-all cursor-pointer group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors font-heading">
                        {chat.title}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {chat.timestamp}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-1 font-medium">
                      <span className="font-bold text-slate-700">{chat.sender}:</span> "{chat.lastMessage}"
                    </p>

                    {/* Gloss Badges */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {chat.glosses.map((gloss, idx) => (
                        <span
                          key={idx}
                          className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-700"
                        >
                          [{gloss}]
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigateToTab('live_comm');
                    }}
                    className="px-3 py-1.5 bg-white group-hover:bg-blue-600 group-hover:text-white text-slate-700 border border-slate-200 group-hover:border-blue-600 text-xs font-bold rounded-lg transition-all cursor-pointer shrink-0"
                  >
                    Resume Chat
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Communication Settings & Language Preferences */}
        <div className="lg:col-span-5 space-y-6">
          {/* Communication & Audio Settings Widget */}
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200/80 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-heading">
                    Communication Settings
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Audio, captions & 3D avatar controls
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              {/* Auto Text-to-Speech Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    {autoTTS ? <Volume2 className="w-4 h-4 text-blue-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
                    Auto Text-to-Speech
                  </span>
                  <p className="text-[11px] text-slate-500">Read translated sign messages out loud</p>
                </div>

                <button
                  onClick={() => setAutoTTS(!autoTTS)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                    autoTTS ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      autoTTS ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Subtitle / Caption Size */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <span className="font-bold text-slate-800 block">Caption Font Size</span>
                <div className="grid grid-cols-3 gap-1.5 bg-white p-1 rounded-lg border border-slate-200">
                  {(['standard', 'large', 'xlarge'] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => setCaptionSize(size)}
                      className={`py-1 rounded text-[11px] font-bold capitalize transition-all cursor-pointer ${
                        captionSize === size
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3D Sign Avatar Animation Speed */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">3D Avatar Speed</span>
                  <span className="font-mono text-blue-600 font-bold">{avatarSpeed}x</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 bg-white p-1 rounded-lg border border-slate-200">
                  {[0.75, 1.0, 1.25].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => setAvatarSpeed(speed)}
                      className={`py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                        avatarSpeed === speed
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};


