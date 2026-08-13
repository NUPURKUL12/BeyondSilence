import { QuickPhrase, SoundAlert, TranslationNote, SignDictionaryItem } from '../types';

export const INITIAL_QUICK_PHRASES: QuickPhrase[] = [
  {
    id: 'qp-1',
    category: 'urgent',
    text: 'I am Deaf and communicate using Sign Language.',
    signGloss: 'ME DEAF COMMUNICATE SIGN LANGUAGE',
    iconName: 'Languages',
    description: 'Quick card to inform people about sign language communication',
  },
  {
    id: 'qp-2',
    category: 'urgent',
    text: 'Please write down what you are saying or type on screen.',
    signGloss: 'PLEASE WRITE PAPER SCREEN TYPE',
    iconName: 'PenTool',
    description: 'Instructs person to write or type their response',
  },
  {
    id: 'qp-3',
    category: 'urgent',
    text: 'I need a sign language interpreter.',
    signGloss: 'ME NEED SIGN INTERPRETER NOW',
    iconName: 'Users',
    description: 'Requests a certified sign language interpreter',
  },
  {
    id: 'qp-4',
    category: 'greetings',
    text: 'Hello, nice to meet you!',
    signGloss: 'HELLO NICE MEET YOU',
    iconName: 'Smile',
    description: 'Standard friendly greeting phrase',
  },
  {
    id: 'qp-5',
    category: 'greetings',
    text: 'Thank you very much for your help.',
    signGloss: 'THANK-YOU VERY MUCH HELP',
    iconName: 'Heart',
    description: 'Expressing gratitude clearly',
  },
  {
    id: 'qp-6',
    category: 'daily',
    text: 'Could you please speak a little slower?',
    signGloss: 'PLEASE SPEAK SLOW MORE',
    iconName: 'Clock',
    description: 'Requests slower verbal speech for live captions',
  },
  {
    id: 'qp-7',
    category: 'daily',
    text: 'Where is the restroom / exit?',
    signGloss: 'RESTROOM EXIT WHERE',
    iconName: 'Compass',
    description: 'Navigation & location inquiry',
  },
  {
    id: 'qp-8',
    category: 'questions',
    text: 'What time does the event / meeting start?',
    signGloss: 'MEETING TIME START WHEN',
    iconName: 'Clock',
    description: 'Time and scheduling inquiry',
  },
  {
    id: 'qp-9',
    category: 'questions',
    text: 'Could you repeat that once more?',
    signGloss: 'AGAIN REPEAT PLEASE',
    iconName: 'RotateCcw',
    description: 'Asks speaker to repeat previous phrase',
  },
];

export const INITIAL_SOUND_ALERTS: SoundAlert[] = [
  {
    id: 'sa-1',
    type: 'name_called',
    label: 'Someone called your name "Alex"',
    decibels: 72,
    timestamp: '2 min ago',
    priority: 'high',
    icon: 'Volume2',
    visualColor: 'amber',
  },
  {
    id: 'sa-2',
    type: 'doorbell',
    label: 'Front Door Knocking',
    decibels: 68,
    timestamp: '8 min ago',
    priority: 'medium',
    icon: 'DoorClosed',
    visualColor: 'teal',
  },
  {
    id: 'sa-3',
    type: 'alarm',
    label: 'Timer / Alarm Ringing',
    decibels: 82,
    timestamp: '15 min ago',
    priority: 'high',
    icon: 'BellRing',
    visualColor: 'rose',
  },
  {
    id: 'sa-4',
    type: 'phone',
    label: 'Phone Call Ringing',
    decibels: 64,
    timestamp: '1 hour ago',
    priority: 'low',
    icon: 'PhoneCall',
    visualColor: 'teal',
  },
];

export const INITIAL_TRANSLATION_NOTES: TranslationNote[] = [
  {
    id: 'tn-1',
    date: 'Today, 2:30 PM',
    speaker: 'Alex Morgan',
    topic: 'Team Planning Discussion',
    originalTranscript: 'We should schedule our upcoming project kickoff for Thursday morning at 10 AM. Everyone please review the attached slides beforehand.',
    simplifiedText: 'Project kickoff is set for Thursday at 10 AM. Please read the presentation slides before the meeting starts.',
    signGlosses: ['PROJECT', 'KICKOFF', 'THURSDAY', 'MORNING', 'TIME-10', 'SLIDES', 'LOOK-BEFORE'],
    actionItems: [
      'Review presentation slides before Thursday.',
      'Join meeting at 10 AM.'
    ],
    keyTerms: [
      { term: 'Kickoff', explanation: 'The first initial meeting to start a project.' }
    ],
    urgency: 'low',
  },
  {
    id: 'tn-2',
    date: 'Yesterday, 10:15 AM',
    speaker: 'Community Center Guide',
    topic: 'Sign Language Workshop',
    originalTranscript: 'Welcome everyone! Today we will practice 20 essential conversational gestures including greetings, numbers, and directional cues.',
    simplifiedText: 'Welcome! Today we will practice 20 everyday signs including greetings, numbers, and directions.',
    signGlosses: ['WELCOME', 'TODAY', 'PRACTICE', '20', 'SIGNS', 'GREETINGS', 'NUMBERS', 'DIRECTIONS'],
    actionItems: [
      'Practice hand shape transitions.',
      'Review flashcards in the dictionary.'
    ],
    keyTerms: [
      { term: 'Gloss', explanation: 'Written representation of sign language concepts.' }
    ],
    urgency: 'low',
  },
];

export const SIGN_DICTIONARY: SignDictionaryItem[] = [
  {
    id: 'sd-1',
    term: 'Hello',
    signGloss: 'HELLO (Salute wave from forehead)',
    category: 'Greetings',
    definition: 'Standard friendly greeting gesture.',
    gestureGuide: 'Place palm near forehead with fingertips touching, then move hand forward and outwards in a gentle salute wave.',
    handshapeIcon: 'Smile',
  },
  {
    id: 'sd-2',
    term: 'Thank You',
    signGloss: 'THANK-YOU (Fingertips chin forward)',
    category: 'Greetings',
    definition: 'Expression of gratitude.',
    gestureGuide: 'Touch the fingertips of your dominant hand to your chin, then extend hand outward towards the person.',
    handshapeIcon: 'Heart',
  },
  {
    id: 'sd-3',
    term: 'Please',
    signGloss: 'PLEASE (Open palm chest circle)',
    category: 'Greetings',
    definition: 'Polite request expression.',
    gestureGuide: 'Place flat dominant palm over the center of your chest and rub in a clockwise circle motion.',
    handshapeIcon: 'Sparkles',
  },
  {
    id: 'sd-4',
    term: 'Help / Assist',
    signGloss: 'HELP (Thumbs-up on flat palm lift)',
    category: 'Daily',
    definition: 'Request or offer of assistance.',
    gestureGuide: 'Form a thumbs-up with dominant hand, place it on open palm of non-dominant hand, and lift both upward together.',
    handshapeIcon: 'Hand',
  },
  {
    id: 'sd-5',
    term: 'Interpreter',
    signGloss: 'INTERPRETER (F-hands twist together)',
    category: 'General',
    definition: 'Professional qualified sign language translator.',
    gestureGuide: 'Form two "F" hands, touch fingertips, and twist dominant hand back and forth, then add person suffix.',
    handshapeIcon: 'Languages',
  },
  {
    id: 'sd-6',
    term: 'Where',
    signGloss: 'WHERE (Index finger side-to-side shake)',
    category: 'Questions',
    definition: 'Inquiry regarding location or direction.',
    gestureGuide: 'Hold up dominant index finger with palm facing forward and shake side-to-side gently with raised eyebrows.',
    handshapeIcon: 'Compass',
  },
];
