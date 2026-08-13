import { SUPPORTED_ISL_GESTURES, ISLGesture } from './gestureRegistry';

export interface ISLGlossToken {
  gloss: string;            // ISL Gloss ID, e.g. "HELLO", "HOW", "YOU"
  displayGloss: string;     // Clean UI Gloss Name e.g. "HELLO", "HOW", "YOU (POINT)"
  originalWord: string;     // Source English word or phrase segment
  isSupported: boolean;     // True if recognized as an ISL concept token
  hasGestureModel: boolean; // True if physically present in the 15-gesture 3D/camera library
  category?: string;
  description?: string;
}

export interface ISLTranslationResult {
  originalText: string;
  normalizedText: string;
  glosses: ISLGlossToken[];
  glossList: string[];      // Flat string array ready for avatar player consumption: e.g. ["HELLO", "HOW", "POINT"]
  supportedGlossCount: number;
  unsupportedWordCount: number;
  unsupportedWords: string[];
}

// Map of physical gesture IDs from gestureRegistry
const PHYSICAL_GESTURE_MAP = new Map<string, ISLGesture>(
  SUPPORTED_ISL_GESTURES.map((g) => [g.id, g])
);

// Extended ISL Gloss Registry (Includes both 15 Physical Camera Gestures & ISL Gloss Tokens)
export interface ISLGlossInfo {
  gloss: string;
  displayGloss: string;
  englishMeaning: string;
  hasGestureModel: boolean;
  category?: string;
  description?: string;
}

export const ISL_GLOSS_DICTIONARY: Record<string, ISLGlossInfo> = {
  HELLO: {
    gloss: 'HELLO',
    displayGloss: 'HELLO',
    englishMeaning: 'Hello / Namaste',
    hasGestureModel: true,
    category: 'Greeting',
    description: 'Open palm wave or joined palms',
  },
  THANK_YOU: {
    gloss: 'THANK_YOU',
    displayGloss: 'THANK_YOU',
    englishMeaning: 'Thank You',
    hasGestureModel: true,
    category: 'Greeting',
    description: 'Flat palm moving from chin forward',
  },
  YES: {
    gloss: 'YES',
    displayGloss: 'YES',
    englishMeaning: 'Yes',
    hasGestureModel: true,
    category: 'Response',
    description: 'Thumbs up gesture',
  },
  NO: {
    gloss: 'NO',
    displayGloss: 'NO',
    englishMeaning: 'No',
    hasGestureModel: true,
    category: 'Response',
    description: 'Thumbs down gesture',
  },
  PEACE: {
    gloss: 'PEACE',
    displayGloss: 'PEACE',
    englishMeaning: 'Peace',
    hasGestureModel: true,
    category: 'Common',
    description: 'V-sign with index and middle fingers',
  },
  I_LOVE_YOU: {
    gloss: 'I_LOVE_YOU',
    displayGloss: 'I_LOVE_YOU',
    englishMeaning: 'I Love You',
    hasGestureModel: true,
    category: 'Common',
    description: 'Thumb, index, and pinky extended',
  },
  OK: {
    gloss: 'OK',
    displayGloss: 'OK',
    englishMeaning: 'Okay',
    hasGestureModel: true,
    category: 'Response',
    description: 'Index tip touching thumb tip',
  },
  STOP: {
    gloss: 'STOP',
    displayGloss: 'STOP',
    englishMeaning: 'Stop',
    hasGestureModel: true,
    category: 'Common',
    description: 'Flat open palm facing forward',
  },
  HELP: {
    gloss: 'HELP',
    displayGloss: 'HELP',
    englishMeaning: 'Help',
    hasGestureModel: true,
    category: 'Need',
    description: 'Fist resting on open palm',
  },
  PLEASE: {
    gloss: 'PLEASE',
    displayGloss: 'PLEASE',
    englishMeaning: 'Please',
    hasGestureModel: true,
    category: 'Greeting',
    description: 'Flat palm against chest',
  },
  GOOD: {
    gloss: 'GOOD',
    displayGloss: 'GOOD',
    englishMeaning: 'Good',
    hasGestureModel: true,
    category: 'Response',
    description: 'Upright thumb with hand support',
  },
  WATER: {
    gloss: 'WATER',
    displayGloss: 'WATER',
    englishMeaning: 'Water',
    hasGestureModel: true,
    category: 'Need',
    description: 'W shape formed with fingers',
  },
  POINT: {
    gloss: 'POINT',
    displayGloss: 'POINT (YOU / ME)',
    englishMeaning: 'You / Me',
    hasGestureModel: true,
    category: 'Common',
    description: 'Index finger pointing towards subject',
  },
  FRIEND: {
    gloss: 'FRIEND',
    displayGloss: 'FRIEND',
    englishMeaning: 'Friend',
    hasGestureModel: true,
    category: 'Common',
    description: 'Crossed or hooked index fingers',
  },
  HOME: {
    gloss: 'HOME',
    displayGloss: 'HOME',
    englishMeaning: 'Home',
    hasGestureModel: true,
    category: 'Common',
    description: 'Fingertips touching at roof angle',
  },
  HOW: {
    gloss: 'HOW',
    displayGloss: 'HOW',
    englishMeaning: 'How',
    hasGestureModel: false,
    category: 'Question',
    description: 'Cupped palms turned upward',
  },
  WHERE: {
    gloss: 'WHERE',
    displayGloss: 'WHERE',
    englishMeaning: 'Where',
    hasGestureModel: false,
    category: 'Question',
    description: 'Index finger side-to-side shake',
  },
  WHAT: {
    gloss: 'WHAT',
    displayGloss: 'WHAT',
    englishMeaning: 'What',
    hasGestureModel: false,
    category: 'Question',
    description: 'Open palms side shake',
  },
  MEET: {
    gloss: 'MEET',
    displayGloss: 'MEET',
    englishMeaning: 'Meet',
    hasGestureModel: false,
    category: 'Common',
    description: 'Both index fingers upright brought together',
  },
  NEED: {
    gloss: 'NEED',
    displayGloss: 'NEED',
    englishMeaning: 'Need / Want',
    hasGestureModel: false,
    category: 'Need',
    description: 'Bent index finger pulled downward',
  },
  NAME: {
    gloss: 'NAME',
    displayGloss: 'NAME',
    englishMeaning: 'Name',
    hasGestureModel: false,
    category: 'Common',
    description: 'H-fingers tapped across each other',
  },
};

// Phrase substitution rules for idiomatic English-to-ISL conversion
interface PhraseRule {
  pattern: RegExp;
  glosses: string[];
  phraseName: string;
}

const PHRASE_RULES: PhraseRule[] = [
  {
    pattern: /\b(hello|hi|hey)\b.*\bhow are you\b/i,
    glosses: ['HELLO', 'HOW', 'POINT'],
    phraseName: 'Hello, how are you?',
  },
  {
    pattern: /\bhow are you\b/i,
    glosses: ['HOW', 'POINT'],
    phraseName: 'how are you',
  },
  {
    pattern: /\bthank you for helping me\b/i,
    glosses: ['THANK_YOU', 'HELP'],
    phraseName: 'thank you for helping me',
  },
  {
    pattern: /\bthank you\b/i,
    glosses: ['THANK_YOU'],
    phraseName: 'thank you',
  },
  {
    pattern: /\bi love you\b/i,
    glosses: ['I_LOVE_YOU'],
    phraseName: 'i love you',
  },
  {
    pattern: /\bnice to meet you\b/i,
    glosses: ['GOOD', 'MEET', 'POINT'],
    phraseName: 'nice to meet you',
  },
  {
    pattern: /\bwhere is (the )?water\b/i,
    glosses: ['WATER', 'WHERE'],
    phraseName: 'where is the water',
  },
  {
    pattern: /\bdo you need help\b/i,
    glosses: ['POINT', 'HELP', 'NEED'],
    phraseName: 'do you need help',
  },
  {
    pattern: /\bi need help\b/i,
    glosses: ['POINT', 'HELP'],
    phraseName: 'i need help',
  },
  {
    pattern: /\bwhat is your name\b/i,
    glosses: ['POINT', 'NAME', 'WHAT'],
    phraseName: 'what is your name',
  },
  {
    pattern: /\bgood morning\b|\bgood day\b/i,
    glosses: ['GOOD', 'HELLO'],
    phraseName: 'good morning',
  },
];

// Single English word to ISL Gloss dictionary mapping
const WORD_TO_GLOSS_MAP: Record<string, string> = {
  hello: 'HELLO',
  hi: 'HELLO',
  hey: 'HELLO',
  namaste: 'HELLO',
  thanks: 'THANK_YOU',
  thank: 'THANK_YOU',
  thankyou: 'THANK_YOU',
  yes: 'YES',
  yeah: 'YES',
  yep: 'YES',
  no: 'NO',
  nope: 'NO',
  nah: 'NO',
  peace: 'PEACE',
  victory: 'PEACE',
  love: 'I_LOVE_YOU',
  ok: 'OK',
  okay: 'OK',
  fine: 'OK',
  perfect: 'OK',
  stop: 'STOP',
  halt: 'STOP',
  help: 'HELP',
  assist: 'HELP',
  assistance: 'HELP',
  helping: 'HELP',
  please: 'PLEASE',
  kindly: 'PLEASE',
  good: 'GOOD',
  great: 'GOOD',
  nice: 'GOOD',
  water: 'WATER',
  drink: 'WATER',
  you: 'POINT',
  your: 'POINT',
  yours: 'POINT',
  me: 'POINT',
  i: 'POINT',
  my: 'POINT',
  mine: 'POINT',
  myself: 'POINT',
  friend: 'FRIEND',
  friends: 'FRIEND',
  pal: 'FRIEND',
  buddy: 'FRIEND',
  home: 'HOME',
  house: 'HOME',
  how: 'HOW',
  where: 'WHERE',
  what: 'WHAT',
  name: 'NAME',
  meet: 'MEET',
  meeting: 'MEET',
  need: 'NEED',
  want: 'NEED',
};

// English Stop Words (omitted in ISL grammar unless critical)
const ENGLISH_STOP_WORDS = new Set([
  'a',
  'an',
  'the',
  'is',
  'am',
  'are',
  'was',
  'were',
  'be',
  'been',
  'being',
  'to',
  'for',
  'of',
  'in',
  'on',
  'at',
  'by',
  'with',
  'from',
  'do',
  'does',
  'did',
  'can',
  'could',
  'will',
  'would',
  'shall',
  'should',
  'have',
  'has',
  'had',
  'this',
  'that',
  'these',
  'those',
]);

/**
 * Translates an English sentence into a sequence of ISL Gloss tokens.
 * Applies phrase-matching rules, English stop-word filtering, and ISL vocabulary mapping.
 */
export function translateEnglishToISL(text: string): ISLTranslationResult {
  const originalText = text.trim();
  if (!originalText) {
    return {
      originalText: '',
      normalizedText: '',
      glosses: [],
      glossList: [],
      supportedGlossCount: 0,
      unsupportedWordCount: 0,
      unsupportedWords: [],
    };
  }

  const normalizedText = originalText.toLowerCase().replace(/[^\w\s]/g, '');

  // Step 1: Check Phrase Rules
  for (const rule of PHRASE_RULES) {
    if (rule.pattern.test(normalizedText)) {
      const glossTokens: ISLGlossToken[] = rule.glosses.map((glossKey) => {
        const info = ISL_GLOSS_DICTIONARY[glossKey];
        return {
          gloss: glossKey,
          displayGloss: info ? info.displayGloss : glossKey,
          originalWord: rule.phraseName,
          isSupported: true,
          hasGestureModel: info ? info.hasGestureModel : false,
          category: info?.category,
          description: info?.description,
        };
      });

      return {
        originalText,
        normalizedText,
        glosses: glossTokens,
        glossList: glossTokens.map((t) => t.gloss),
        supportedGlossCount: glossTokens.length,
        unsupportedWordCount: 0,
        unsupportedWords: [],
      };
    }
  }

  // Step 2: Tokenize and apply ISL Grammar rules
  const words = normalizedText.split(/\s+/).filter(Boolean);
  const glossTokens: ISLGlossToken[] = [];
  const unsupportedWords: string[] = [];

  for (const word of words) {
    // Skip non-essential English stop words
    if (ENGLISH_STOP_WORDS.has(word)) {
      continue;
    }

    const glossKey = WORD_TO_GLOSS_MAP[word];

    if (glossKey) {
      const info = ISL_GLOSS_DICTIONARY[glossKey];
      glossTokens.push({
        gloss: glossKey,
        displayGloss: info ? info.displayGloss : glossKey,
        originalWord: word,
        isSupported: true,
        hasGestureModel: info ? info.hasGestureModel : false,
        category: info?.category,
        description: info?.description,
      });
    } else {
      // Unsupported Word
      unsupportedWords.push(word);
      glossTokens.push({
        gloss: `[UNSUPPORTED: ${word.toUpperCase()}]`,
        displayGloss: `? ${word.toUpperCase()}`,
        originalWord: word,
        isSupported: false,
        hasGestureModel: false,
        description: `No direct ISL sign found for "${word}".`,
      });
    }
  }

  // Step 3: Basic ISL Question Reordering Rule (Question word moved to end if needed)
  // e.g. ["WHERE", "WATER"] -> ["WATER", "WHERE"]
  const questionWords = new Set(['WHERE', 'WHAT', 'HOW']);
  if (glossTokens.length > 1 && questionWords.has(glossTokens[0].gloss)) {
    const qToken = glossTokens.shift();
    if (qToken) {
      glossTokens.push(qToken);
    }
  }

  const supportedGlossCount = glossTokens.filter((t) => t.isSupported).length;

  return {
    originalText,
    normalizedText,
    glosses: glossTokens,
    glossList: glossTokens.filter((t) => t.isSupported).map((t) => t.gloss),
    supportedGlossCount,
    unsupportedWordCount: unsupportedWords.length,
    unsupportedWords,
  };
}
