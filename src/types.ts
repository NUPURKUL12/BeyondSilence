export type UserRole = 'signer' | 'learner';

export type TextSize = 'normal' | 'large' | 'xlarge';

export interface SoundAlert {
  id: string;
  type: 'doorbell' | 'name_called' | 'alarm' | 'knock' | 'phone';
  label: string;
  decibels: number;
  timestamp: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  icon: string;
  visualColor: string; // e.g. 'amber', 'rose', 'teal'
}

export interface QuickPhrase {
  id: string;
  category: 'greetings' | 'daily' | 'questions' | 'urgent';
  text: string;
  signGloss: string;
  iconName: string;
  description?: string;
  patientHelpText?: string;
}

export interface TranslationNote {
  id: string;
  date: string;
  speaker: string;
  topic: string;
  originalTranscript: string;
  simplifiedText: string;
  signGlosses: string[];
  actionItems: string[];
  keyTerms?: { term: string; explanation: string }[];
  urgency: 'low' | 'medium' | 'high';
}

export interface SignDictionaryItem {
  id: string;
  term: string;
  signGloss: string;
  category: 'Greetings' | 'Daily' | 'Questions' | 'General';
  definition: string;
  gestureGuide: string;
  handshapeIcon: string;
}

export interface PWAState {
  isInstalled: boolean;
  canInstall: boolean;
  isOnline: boolean;
  hasNotificationPermission: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'deaf' | 'hearing';
  senderName: string;
  text: string;
  translatedText?: string;
  signGlosses?: string[];
  gesturesDetected?: string[];
  timestamp: string;
  audioSpoken?: boolean;
}

