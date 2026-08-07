import React, { useState, useCallback } from 'react';
import { UserRole, ChatMessage } from '../../types';
import { LiveCaptionsStudio } from '../LiveCaptionsStudio';
import { CameraFeed } from '../CameraFeed';
import { RecognizedGesture } from '../../utils/gestureRecognizer';
import { textToISLGlosses } from '../LiveConversationChat';
import { Maximize2, Info, Sparkles, MessageSquare, Hand, Volume2 } from 'lucide-react';

interface LiveCommunicationPageProps {
  userRole: UserRole;
  onOpenQuickModal: (title: string, text: string) => void;
}

export const LiveCommunicationPage: React.FC<LiveCommunicationPageProps> = ({
  userRole,
  onOpenQuickModal,
}) => {
  // Live conversation message history
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'hearing',
      senderName: 'Hearing User (Voice)',
      text: 'Welcome everyone! We will start our meeting at 10 AM. Please make sure to bring your presentation slides.',
      signGlosses: ['WELCOME', 'EVERYONE', 'MEETING', 'START', 'TIME', 'PLEASE', 'BRING', 'SLIDES'],
      timestamp: '10:00 AM',
    },
    {
      id: 'm2',
      sender: 'deaf',
      senderName: 'Deaf User (ISL Sign)',
      text: 'Thank you! I have my presentation slides ready.',
      signGlosses: ['THANK_YOU', 'SLIDES', 'READY'],
      gesturesDetected: ['THANK_YOU'],
      timestamp: '10:01 AM',
    },
  ]);

  const [activeAvatarGlosses, setActiveAvatarGlosses] = useState<string[]>([
    'WELCOME', 'EVERYONE', 'MEETING', 'START', 'TIME', 'PLEASE', 'BRING', 'SLIDES'
  ]);

  const [lastDetectedGesture, setLastDetectedGesture] = useState<RecognizedGesture | null>(null);

  // Callback when ISL gesture recognized on webcam
  const handleGestureRecognized = useCallback((gesture: RecognizedGesture | null) => {
    setLastDetectedGesture(gesture);

    if (gesture && gesture.confidence >= 0.7) {
      // Create gesture translation message from Deaf user
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      const textTranslation = `[ISL Sign Detected] ${gesture.emoji} "${gesture.label}" — ${gesture.description}`;
      const gloss = gesture.label.replace(/\s+/g, '_').toUpperCase();

      setMessages((prev) => {
        // Prevent immediate duplicate insertion if same gesture ID was just sent in last 4 seconds
        if (prev.length > 0) {
          const lastMsg = prev[prev.length - 1];
          if (lastMsg.sender === 'deaf' && lastMsg.text.includes(gesture.label)) {
            return prev;
          }
        }

        const newMsg: ChatMessage = {
          id: `deaf-gesture-${Date.now()}`,
          sender: 'deaf',
          senderName: 'Deaf User (Webcam ISL)',
          text: textTranslation,
          signGlosses: [gloss],
          gesturesDetected: [gesture.label],
          timestamp: timeStr,
        };
        return [...prev, newMsg];
      });

      // Update 3D avatar target gloss
      setActiveAvatarGlosses([gloss]);
    }
  }, []);

  const handleSendMessage = (text: string, sender: 'deaf' | 'hearing', glosses?: string[], gestures?: string[]) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const computedGlosses = glosses || textToISLGlosses(text);

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender,
      senderName: sender === 'deaf' ? 'Deaf User (ISL)' : 'Hearing User (Voice)',
      text,
      signGlosses: computedGlosses,
      gesturesDetected: gestures,
      timestamp: timeStr,
    };

    setMessages((prev) => [...prev, newMsg]);

    if (computedGlosses.length > 0) {
      setActiveAvatarGlosses(computedGlosses);
    }
  };

  const handleClearHistory = () => {
    setMessages([]);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-blue-50 text-blue-700 border border-blue-200/80 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              BeyondSilence Studio
            </span>
            
            {/* Pulsing Green Indicator Dot ("AI Engine Listening") */}
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-xs font-semibold px-3 py-0.5 rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span>Real-Time 2-Way Active</span>
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black font-heading tracking-tight text-slate-900">
            Real-Time Speech & ISL Sign Studio
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Webcam ISL Gesture Recognition → Chat & Speech • Voice Transcription → 3D Avatar Signer
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
          <button
            onClick={() => onOpenQuickModal('COMMUNICATION CARD', 'I AM DEAF AND COMMUNICATE USING SIGN LANGUAGE. PLEASE TALK DIRECTLY INTO THE APP MIC OR TYPE ON SCREEN.')}
            className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Maximize2 className="w-4 h-4 text-blue-200" />
            <span>Fullscreen Card</span>
          </button>
        </div>
      </div>

      {/* Grid Layout: Left Camera Feed & Right Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 cols): Camera Feed & Live Gesture Status */}
        <div className="lg:col-span-5 space-y-4">
          <CameraFeed
            title="Sign Language Camera"
            description="Webcam feed for real-time ISL sign recognition"
            onGestureRecognized={handleGestureRecognized}
          />

          {/* Quick Deaf User Sign Hotkeys */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5 font-heading">
                <Hand className="w-4 h-4 text-indigo-600" />
                Quick Deaf User Express Buttons
              </span>
              <span className="text-[10px] text-slate-400 font-mono">1-Tap Translate</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleSendMessage('I need a doctor or medical assistance immediately.', 'deaf', ['DOCTOR'], ['DOCTOR'])}
                className="p-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 rounded-xl text-left text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
              >
                <span className="text-base">🩺</span>
                <span>Need Doctor</span>
              </button>

              <button
                onClick={() => handleSendMessage('Can I please have water?', 'deaf', ['WATER'], ['WATER'])}
                className="p-2.5 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 rounded-xl text-left text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
              >
                <span className="text-base">🚰</span>
                <span>Need Water</span>
              </button>

              <button
                onClick={() => handleSendMessage('Emergency! I need help right now.', 'deaf', ['HELP'], ['HELP'])}
                className="p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200 rounded-xl text-left text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
              >
                <span className="text-base">🆘</span>
                <span>Emergency Help</span>
              </button>

              <button
                onClick={() => handleSendMessage('Thank you very much for your assistance!', 'deaf', ['THANK_YOU'], ['THANK_YOU'])}
                className="p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-xl text-left text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
              >
                <span className="text-base">🙏</span>
                <span>Thank You</span>
              </button>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5 font-heading">
              <Info className="w-4 h-4 text-blue-600" />
              Webcam Guidelines
            </span>
            <ul className="text-xs text-slate-500 space-y-1.5 list-disc pl-4 font-medium">
              <li>Position camera clearly facing hands and torso for optimal ISL detection.</li>
              <li>Ensure good front lighting for maximum clarity.</li>
              <li>When an ISL gesture is recognized, it automatically posts into the live chat and offers Text-to-Speech playback!</li>
            </ul>
          </div>
        </div>

        {/* Right Column (7 cols): Studio & Live Conversation */}
        <div className="lg:col-span-7">
          <LiveCaptionsStudio
            userRole={userRole}
            onOpenQuickModal={onOpenQuickModal}
            messages={messages}
            onSendMessage={handleSendMessage}
            onClearHistory={handleClearHistory}
            active3DGlosses={activeAvatarGlosses}
            onGlossSelectForAvatar={(glosses) => setActiveAvatarGlosses(glosses)}
          />
        </div>
      </div>
    </div>
  );
};


