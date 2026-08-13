export interface ISLGesture {
  id: string;
  name: string;
  englishMeaning: string;
  description: string;
  category: 'Greeting' | 'Response' | 'Common' | 'Need';
}

export const SUPPORTED_ISL_GESTURES: ISLGesture[] = [
  {
    id: 'HELLO',
    name: 'Hello / Namaste',
    englishMeaning: 'Hello',
    description: 'Open palm wave or two palms joined together',
    category: 'Greeting',
  },
  {
    id: 'THANK_YOU',
    name: 'Thank You',
    englishMeaning: 'Thank You',
    description: 'Flat palm moving from chin forward',
    category: 'Greeting',
  },
  {
    id: 'YES',
    name: 'Yes',
    englishMeaning: 'Yes',
    description: 'Thumbs up gesture',
    category: 'Response',
  },
  {
    id: 'NO',
    name: 'No',
    englishMeaning: 'No',
    description: 'Thumbs down gesture',
    category: 'Response',
  },
  {
    id: 'PEACE',
    name: 'Peace / Victory',
    englishMeaning: 'Peace',
    description: 'V-sign with index and middle fingers',
    category: 'Common',
  },
  {
    id: 'I_LOVE_YOU',
    name: 'I Love You',
    englishMeaning: 'I Love You',
    description: 'Thumb, index, and pinky fingers extended',
    category: 'Common',
  },
  {
    id: 'OK',
    name: 'Okay / Perfect',
    englishMeaning: 'Okay',
    description: 'Index tip touching thumb tip with other fingers open',
    category: 'Response',
  },
  {
    id: 'STOP',
    name: 'Stop',
    englishMeaning: 'Stop',
    description: 'Flat open palm facing forward',
    category: 'Common',
  },
  {
    id: 'HELP',
    name: 'Help',
    englishMeaning: 'Help',
    description: 'Fist resting on open palm',
    category: 'Need',
  },
  {
    id: 'PLEASE',
    name: 'Please',
    englishMeaning: 'Please',
    description: 'Flat palm against chest',
    category: 'Greeting',
  },
  {
    id: 'GOOD',
    name: 'Good',
    englishMeaning: 'Good',
    description: 'Upright thumb with flat hand support',
    category: 'Response',
  },
  {
    id: 'WATER',
    name: 'Water',
    englishMeaning: 'Water',
    description: 'W shape formed with index, middle, and ring fingers',
    category: 'Need',
  },
  {
    id: 'POINT',
    name: 'Look / You',
    englishMeaning: 'You',
    description: 'Index finger pointing forward',
    category: 'Common',
  },
  {
    id: 'FRIEND',
    name: 'Friend',
    englishMeaning: 'Friend',
    description: 'Crossed or hooked index fingers',
    category: 'Common',
  },
  {
    id: 'HOME',
    name: 'Home / House',
    englishMeaning: 'Home',
    description: 'Fingertips touching at roof angle',
    category: 'Common',
  },
];
