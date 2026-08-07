import React, { useState, useEffect } from 'react';
import { UserRole, TextSize, QuickPhrase, SoundAlert, TranslationNote, PWAState } from './types';
import { 
  INITIAL_QUICK_PHRASES, 
  INITIAL_SOUND_ALERTS, 
  INITIAL_TRANSLATION_NOTES
} from './data/mockData';

import { Sidebar, NavTab } from './components/Sidebar';
import { Header } from './components/Header';
import { FullscreenFlashModal } from './components/FullscreenFlashModal';
import { PwaInstallBanner } from './components/PwaInstallBanner';

import { DashboardPage } from './components/pages/DashboardPage';
import { EmergencyAssistPage } from './components/pages/EmergencyAssistPage';
import { LiveCommunicationPage } from './components/pages/LiveCommunicationPage';
import { LearnISLPage } from './components/pages/LearnISLPage';
import { AnalyticsPage } from './components/pages/AnalyticsPage';
import { ProfilePage } from './components/pages/ProfilePage';
import { SettingsPage } from './components/pages/SettingsPage';
import { ChatbotPage } from './components/pages/ChatbotPage';

import { Heart } from 'lucide-react';

export default function App() {
  const [userRole, setUserRole] = useState<UserRole>('deaf_patient');
  const [textSize, setTextSize] = useState<TextSize>('normal');
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [visualFlashActive, setVisualFlashActive] = useState(false);

  // Sidebar collapsed state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');

  // Search query
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    title: string;
    text: string;
  }>({
    isOpen: false,
    title: '',
    text: '',
  });

  // Data state
  const [quickPhrases, setQuickPhrases] = useState<QuickPhrase[]>(INITIAL_QUICK_PHRASES);
  const [soundAlerts, setSoundAlerts] = useState<SoundAlert[]>(INITIAL_SOUND_ALERTS);
  const [medicalNotes] = useState<TranslationNote[]>(INITIAL_TRANSLATION_NOTES);

  // PWA & Installation state
  const [pwaState, setPwaState] = useState<PWAState>({
    isInstalled: false,
    canInstall: true,
    isOnline: true,
    hasNotificationPermission: false,
  });
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Listen for PWA install prompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setPwaState((prev) => ({ ...prev, canInstall: true }));
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Online status listeners
    const handleOnline = () => setPwaState((prev) => ({ ...prev, isOnline: true }));
    const handleOffline = () => setPwaState((prev) => ({ ...prev, isOnline: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setPwaState((prev) => ({ ...prev, canInstall: false, isInstalled: true }));
      }
      setDeferredPrompt(null);
    } else {
      alert("To install BeyondSilence as a PWA, tap your browser menu and choose 'Add to Home Screen'!");
    }
  };

  const triggerVisualFlash = () => {
    setVisualFlashActive(true);
    setTimeout(() => {
      setVisualFlashActive(false);
    }, 1800);
  };

  const openQuickModal = (title: string, text: string) => {
    setModalState({
      isOpen: true,
      title,
      text,
    });
  };

  const addCustomPhrase = (newPhrase: QuickPhrase) => {
    setQuickPhrases([newPhrase, ...quickPhrases]);
  };

  // Font size multiplier class
  const getTextSizeClass = () => {
    switch (textSize) {
      case 'large':
        return 'text-[105%]';
      case 'xlarge':
        return 'text-[115%]';
      default:
        return 'text-[100%]';
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isHighContrast ? 'high-contrast-mode bg-black text-white' : 'bg-[#F0F4F8] text-slate-900'
      } ${getTextSizeClass()} relative flex font-sans`}
    >
      {/* Screen Boundary Visual Strobe Alert Flash */}
      {visualFlashActive && (
        <div className="fixed inset-0 pointer-events-none z-50 border-[16px] border-amber-400 animate-flash-warning shadow-[inset_0_0_80px_rgba(245,158,11,0.8)]" />
      )}

      {/* Collapsible Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        userRole={userRole}
        soundAlertCount={soundAlerts.length}
      />

      {/* Main Layout Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isSidebarCollapsed ? 'pl-[64px]' : 'pl-[64px] lg:pl-[240px]'
        }`}
      >
        {/* Sticky Top Header Bar */}
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          userRole={userRole}
          setUserRole={setUserRole}
          textSize={textSize}
          setTextSize={setTextSize}
          isHighContrast={isHighContrast}
          setIsHighContrast={setIsHighContrast}
          onTriggerVisualFlash={triggerVisualFlash}
          pwaState={pwaState}
          onInstallPWA={handleInstallPWA}
          isSidebarCollapsed={isSidebarCollapsed}
          soundAlertCount={soundAlerts.length}
          onNavigateToTab={(tab) => setActiveTab(tab as NavTab)}
        />

        {/* Dynamic Viewport Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6 pb-20">
          {/* PWA Installation Banner if installable */}
          <PwaInstallBanner
            pwaState={pwaState}
            onInstall={handleInstallPWA}
            onDismiss={() => setPwaState((prev) => ({ ...prev, canInstall: false }))}
          />

          {/* Dynamic Tab Viewport Routing */}
          {activeTab === 'dashboard' && (
            <DashboardPage
              userRole={userRole}
              soundAlerts={soundAlerts}
              quickPhrases={quickPhrases}
              medicalNotes={medicalNotes}
              onTriggerVisualFlash={triggerVisualFlash}
              onClearAlerts={() => setSoundAlerts([])}
              onOpenQuickModal={openQuickModal}
              onAddCustomPhrase={addCustomPhrase}
              onNavigateToTab={setActiveTab}
              searchQuery={searchQuery}
            />
          )}

          {activeTab === 'emergency' && (
            <EmergencyAssistPage
              onTriggerVisualFlash={triggerVisualFlash}
              onOpenQuickModal={openQuickModal}
              userRole={userRole}
            />
          )}

          {activeTab === 'live_comm' && (
            <LiveCommunicationPage
              userRole={userRole}
              onOpenQuickModal={openQuickModal}
            />
          )}

          {activeTab === 'chatbot' && (
            <ChatbotPage userRole={userRole} />
          )}

          {activeTab === 'learn_isl' && (
            <LearnISLPage
              onOpenQuickModal={openQuickModal}
              searchQuery={searchQuery}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsPage
              soundAlerts={soundAlerts}
              medicalNotes={medicalNotes}
            />
          )}

          {activeTab === 'profile' && (
            <ProfilePage
              userRole={userRole}
              onOpenQuickModal={openQuickModal}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsPage
              textSize={textSize}
              setTextSize={setTextSize}
              isHighContrast={isHighContrast}
              setIsHighContrast={setIsHighContrast}
              onTriggerVisualFlash={triggerVisualFlash}
              pwaState={pwaState}
              onInstallPWA={handleInstallPWA}
            />
          )}
        </main>

        {/* Workspace Footer */}
        <footer className="bg-white/80 backdrop-blur-md text-slate-500 text-xs py-5 border-t border-slate-200/80 mt-auto">
          <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[#1565C0] to-[#00897B] flex items-center justify-center text-white text-[10px] font-bold">
                <Heart className="w-3 h-3 fill-white/20" />
              </div>
              <span className="font-bold text-slate-800 font-heading">BeyondSilence</span>
              <span className="text-slate-400">• AI Sign Language Platform</span>
            </div>

            <div className="flex items-center gap-3 text-slate-400 text-[11px] font-medium">
              <span className="hover:text-slate-600 transition-colors">Sign Language AI</span>
              <span>•</span>
              <span className="hover:text-slate-600 transition-colors">Live Speech Translation</span>
              <span>•</span>
              <span className="hover:text-slate-600 transition-colors">ISL / ASL Dictionary</span>
              <span>•</span>
              <span className="hover:text-slate-600 transition-colors">WCAG AAA</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Fullscreen High-Legibility Display Modal Card */}
      <FullscreenFlashModal
        isOpen={modalState.isOpen}
        title={modalState.title}
        text={modalState.text}
        onClose={() => setModalState({ isOpen: false, title: '', text: '' })}
      />
    </div>
  );
}
