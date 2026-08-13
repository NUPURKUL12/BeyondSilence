export const ISL_LANGUAGE_OPTIONS = [
  { value: 'english', label: 'English' },
  { value: 'hindi', label: 'हिंदी' },
  { value: 'marathi', label: 'मराठी' },
  { value: 'kannada', label: 'ಕನ್ನಡ' },
] as const;

export type ISLOutputLanguage = (typeof ISL_LANGUAGE_OPTIONS)[number]['value'];

export type ISLMultilingualEntry = Record<ISLOutputLanguage, string>;

export const ISL_MULTILINGUAL_DICTIONARY: Record<string, ISLMultilingualEntry> = {
  HELLO: {
    english: 'Hello',
    hindi: 'नमस्ते',
    marathi: 'नमस्कार',
    kannada: 'ಹಲೋ',
  },
  THANK_YOU: {
    english: 'Thank You',
    hindi: 'धन्यवाद',
    marathi: 'धन्यवाद',
    kannada: 'ಧನ್ಯವಾದ',
  },
  YES: {
    english: 'Yes',
    hindi: 'हाँ',
    marathi: 'होय',
    kannada: 'ಹೌದು',
  },
  NO: {
    english: 'No',
    hindi: 'नहीं',
    marathi: 'नाही',
    kannada: 'ಇಲ್ಲ',
  },
  PEACE: {
    english: 'Peace',
    hindi: 'शांति',
    marathi: 'शांतता',
    kannada: 'ಶಾಂತಿ',
  },
  I_LOVE_YOU: {
    english: 'I Love You',
    hindi: 'मैं तुमसे प्यार करता हूँ',
    marathi: 'मी तुझ्यावर प्रेम करतो',
    kannada: 'ನಾನು ನಿನ್ನನ್ನು ಪ್ರೀತಿಸುತ್ತೇನೆ',
  },
  OK: {
    english: 'Okay',
    hindi: 'ठीक है',
    marathi: 'ठीक आहे',
    kannada: 'ಸರಿ',
  },
  STOP: {
    english: 'Stop',
    hindi: 'रुको',
    marathi: 'थांबा',
    kannada: 'ನಿಲ್ಲಿಸಿ',
  },
  HELP: {
    english: 'Help',
    hindi: 'मदद',
    marathi: 'मदत',
    kannada: 'ಸಹಾಯ',
  },
  PLEASE: {
    english: 'Please',
    hindi: 'कृपया',
    marathi: 'कृपया',
    kannada: 'ದಯವಿಟ್ಟು',
  },
  GOOD: {
    english: 'Good',
    hindi: 'अच्छा',
    marathi: 'चांगले',
    kannada: 'ಒಳ್ಳೆಯದು',
  },
  WATER: {
    english: 'Water',
    hindi: 'पानी',
    marathi: 'पाणी',
    kannada: 'ನೀರು',
  },
  POINT: {
    english: 'Point',
    hindi: 'इशारा',
    marathi: 'इशारा',
    kannada: 'ಸೂಚನೆ',
  },
  FRIEND: {
    english: 'Friend',
    hindi: 'दोस्त',
    marathi: 'मित्र',
    kannada: 'ಸ್ನೇಹಿತ',
  },
  HOME: {
    english: 'Home',
    hindi: 'घर',
    marathi: 'घर',
    kannada: 'ಮನೆ',
  },
  HOW: {
    english: 'How',
    hindi: 'कैसे',
    marathi: 'कसे',
    kannada: 'ಹೀಗೆ',
  },
  WHERE: {
    english: 'Where',
    hindi: 'कहाँ',
    marathi: 'कुठे',
    kannada: 'ಎಲ್ಲಿ',
  },
  WHAT: {
    english: 'What',
    hindi: 'क्या',
    marathi: 'काय',
    kannada: 'ಏನು',
  },
  MEET: {
    english: 'Meet',
    hindi: 'मिलना',
    marathi: 'भेटणे',
    kannada: 'ಮಿಲನ',
  },
  NEED: {
    english: 'Need',
    hindi: 'ज़रूरत',
    marathi: 'गरज',
    kannada: 'ಬೇಕೆ',
  },
  NAME: {
    english: 'Name',
    hindi: 'नाम',
    marathi: 'नाव',
    kannada: 'ಹೆಸರು',
  },
};

export function getISLGlossTranslation(gloss: string | null | undefined, language: ISLOutputLanguage): string {
  if (!gloss) {
    return 'No sign detected';
  }

  const normalizedGloss = gloss.trim().toUpperCase();
  const translation = ISL_MULTILINGUAL_DICTIONARY[normalizedGloss];

  if (!translation) {
    return normalizedGloss.replace(/_/g, ' ') || 'Translation unavailable';
  }

  return translation[language] ?? translation.english ?? 'Translation unavailable';
}

export function getLanguageLabel(language: ISLOutputLanguage): string {
  const option = ISL_LANGUAGE_OPTIONS.find((item) => item.value === language);
  return option?.label ?? 'English';
}
