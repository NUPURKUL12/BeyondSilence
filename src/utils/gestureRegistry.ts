import { NormalizedLandmark, GestureCategory, RecognizedGesture, distance2D, getFingerStates } from './gestureRecognizer';

export interface GestureLandmarkThresholds {
  /** Finger extension requirements: true = must be extended, false = must be folded, undefined = don't care */
  fingers?: {
    thumb?: boolean;
    index?: boolean;
    middle?: boolean;
    ring?: boolean;
    pinky?: boolean;
  };
  /** Hand wrist orientation check */
  isHandUpright?: boolean;
  /** Distance thresholds between specific landmarks */
  distances?: {
    thumbToIndexTipMax?: number;
    indexToMiddleTipMax?: number;
    middleToRingTipMax?: number;
    wristToWristMax?: number;
    mcpToMcpMax?: number;
    thumbToPalmCenterMin?: number;
  };
  /** Y-coordinate threshold for specific landmark */
  yPositions?: {
    thumbTipAboveMcp?: boolean;
    indexTipAboveY?: number;
  };
  /** Number of hands needed */
  numHandsRequired?: number;
}

export interface GestureDefinition {
  id: string;
  name: string;
  label: string;
  signGloss: string;
  emoji: string;
  category: GestureCategory;
  baseConfidence: number;
  description: string;
  language: string;
  thresholds: GestureLandmarkThresholds;
  evaluate: (landmarksList: NormalizedLandmark[][]) => RecognizedGesture | null;
}

/**
 * 15 Common ISL Gestures mapped with MediaPipe landmark coordinate thresholds,
 * category classifications, and confidence scoring rules.
 */
export const ISL_GESTURE_REGISTRY: GestureDefinition[] = [
  // 1. Help / Emergency SOS (🆘)
  {
    id: 'isl_sos',
    name: 'Help / Emergency SOS',
    label: 'Help / SOS',
    signGloss: 'HELP / SOS',
    emoji: '🆘',
    category: 'Emergency',
    baseConfidence: 0.95,
    description: 'Closed fist upright emergency signal indicating urgent help required',
    language: 'ISL',
    thresholds: {
      numHandsRequired: 1,
      isHandUpright: true,
      fingers: { index: false, middle: false, ring: false, pinky: false },
    },
    evaluate: (landmarksList) => {
      const landmarks = landmarksList[0];
      if (!landmarks || landmarks.length < 21) return null;
      const wrist = landmarks[0];
      const middleMcp = landmarks[9];
      const indexTip = landmarks[8];
      const indexPip = landmarks[6];
      const middleTip = landmarks[12];
      const middlePip = landmarks[10];
      const ringTip = landmarks[16];
      const ringPip = landmarks[14];
      const pinkyTip = landmarks[20];
      const pinkyPip = landmarks[18];

      const allFolded = indexTip.y > indexPip.y && middleTip.y > middlePip.y && ringTip.y > ringPip.y && pinkyTip.y > pinkyPip.y;
      const isUpright = wrist.y > middleMcp.y;

      if (allFolded && isUpright) {
        return {
          id: 'isl_sos',
          name: 'Help / Emergency SOS',
          label: 'Help / SOS',
          signGloss: 'HELP / SOS',
          emoji: '🆘',
          category: 'Emergency',
          confidence: 0.95,
          description: 'Closed fist upright emergency signal indicating urgent help required',
          language: 'ISL',
        };
      }
      return null;
    },
  },

  // 2. Yes / Agree (👍)
  {
    id: 'isl_yes',
    name: 'Yes / Agree',
    label: 'Yes / Agree',
    signGloss: 'YES / GOOD',
    emoji: '👍',
    category: 'Communication',
    baseConfidence: 0.94,
    description: 'Upward thumb signaling affirmative agreement or approval',
    language: 'ISL',
    thresholds: {
      numHandsRequired: 1,
      fingers: { thumb: true, index: false, middle: false, ring: false, pinky: false },
      yPositions: { thumbTipAboveMcp: true },
    },
    evaluate: (landmarksList) => {
      const landmarks = landmarksList[0];
      if (!landmarks || landmarks.length < 21) return null;
      const f = getFingerStates(landmarks);
      const thumbTip = landmarks[4];
      const thumbMcp = landmarks[2];

      const isThumbPointingUp = thumbTip.y < thumbMcp.y - 0.05;
      const otherFingersFolded = !f.isIndexExtended && !f.isMiddleExtended && !f.isRingExtended && !f.isPinkyExtended;

      if (isThumbPointingUp && otherFingersFolded) {
        return {
          id: 'isl_yes',
          name: 'Yes / Agree',
          label: 'Yes / Agree',
          signGloss: 'YES / GOOD',
          emoji: '👍',
          category: 'Communication',
          confidence: 0.94,
          description: 'Upward thumb signaling affirmative agreement or approval',
          language: 'ISL',
        };
      }
      return null;
    },
  },

  // 3. No / Disagree (👎)
  {
    id: 'isl_no',
    name: 'No / Disagree',
    label: 'No / Disagree',
    signGloss: 'NO / DISAGREE',
    emoji: '👎',
    category: 'Communication',
    baseConfidence: 0.93,
    description: 'Downward pointing thumb indicating refusal, disapproval, or No',
    language: 'ISL',
    thresholds: {
      numHandsRequired: 1,
      fingers: { thumb: true, index: false, middle: false, ring: false, pinky: false },
    },
    evaluate: (landmarksList) => {
      const landmarks = landmarksList[0];
      if (!landmarks || landmarks.length < 21) return null;
      const f = getFingerStates(landmarks);
      const thumbTip = landmarks[4];
      const thumbMcp = landmarks[2];

      const isThumbPointingDown = thumbTip.y > thumbMcp.y + 0.05;
      const otherFingersFolded = !f.isIndexExtended && !f.isMiddleExtended && !f.isRingExtended && !f.isPinkyExtended;

      if (isThumbPointingDown && otherFingersFolded) {
        return {
          id: 'isl_no',
          name: 'No / Disagree',
          label: 'No / Disagree',
          signGloss: 'NO / DISAGREE',
          emoji: '👎',
          category: 'Communication',
          confidence: 0.93,
          description: 'Downward pointing thumb indicating refusal, disapproval, or No',
          language: 'ISL',
        };
      }
      return null;
    },
  },

  // 4. Wait / Stop (✋)
  {
    id: 'isl_wait',
    name: 'Wait / Stop',
    label: 'Wait / Stop',
    signGloss: 'WAIT / STOP',
    emoji: '✋',
    category: 'Emergency',
    baseConfidence: 0.92,
    description: 'Flat open palm pushed forward commanding pause, wait, or stop',
    language: 'ISL',
    thresholds: {
      numHandsRequired: 1,
      isHandUpright: true,
      fingers: { index: true, middle: true, ring: true, pinky: true },
      distances: { indexToMiddleTipMax: 0.06, middleToRingTipMax: 0.06 },
    },
    evaluate: (landmarksList) => {
      const landmarks = landmarksList[0];
      if (!landmarks || landmarks.length < 21) return null;
      const f = getFingerStates(landmarks);
      const indexTip = landmarks[8];
      const middleTip = landmarks[12];
      const ringTip = landmarks[16];

      const fingersClose = distance2D(indexTip, middleTip) < 0.06 && distance2D(middleTip, ringTip) < 0.06;

      if (f.isIndexExtended && f.isMiddleExtended && f.isRingExtended && f.isPinkyExtended && fingersClose && f.isHandUpright) {
        return {
          id: 'isl_wait',
          name: 'Wait / Stop',
          label: 'Wait / Stop',
          signGloss: 'WAIT / STOP',
          emoji: '✋',
          category: 'Emergency',
          confidence: 0.92,
          description: 'Flat open palm pushed forward commanding pause, wait, or stop',
          language: 'ISL',
        };
      }
      return null;
    },
  },

  // 5. Thank You / Namaste (🙏)
  {
    id: 'isl_thank_you',
    name: 'Thank You / Namaste',
    label: 'Thank You',
    signGloss: 'THANK YOU',
    emoji: '🙏',
    category: 'Communication',
    baseConfidence: 0.96,
    description: 'Both palms joined together in gratitude and respectful greeting',
    language: 'ISL',
    thresholds: {
      numHandsRequired: 2,
      distances: { wristToWristMax: 0.22, mcpToMcpMax: 0.22 },
    },
    evaluate: (landmarksList) => {
      if (landmarksList.length === 2) {
        const wrist1 = landmarksList[0][0];
        const wrist2 = landmarksList[1][0];
        const middleMcp1 = landmarksList[0][9];
        const middleMcp2 = landmarksList[1][9];

        const wristDist = distance2D(wrist1, wrist2);
        const mcpDist = distance2D(middleMcp1, middleMcp2);

        if (wristDist < 0.22 && mcpDist < 0.22) {
          return {
            id: 'isl_thank_you',
            name: 'Thank You / Namaste',
            label: 'Thank You',
            signGloss: 'THANK YOU',
            emoji: '🙏',
            category: 'Communication',
            confidence: 0.96,
            description: 'Both palms joined together in gratitude and respectful greeting',
            language: 'ISL',
          };
        }
      }
      return null;
    },
  },

  // 6. Hello / Greetings (👋)
  {
    id: 'isl_hello',
    name: 'Hello / Greetings',
    label: 'Hello',
    signGloss: 'HELLO',
    emoji: '👋',
    category: 'Communication',
    baseConfidence: 0.92,
    description: 'Open upright palm with spread fingers waving hello',
    language: 'ISL',
    thresholds: {
      numHandsRequired: 1,
      isHandUpright: true,
      fingers: { thumb: true, index: true, middle: true, ring: true, pinky: true },
    },
    evaluate: (landmarksList) => {
      const landmarks = landmarksList[0];
      if (!landmarks || landmarks.length < 21) return null;
      const f = getFingerStates(landmarks);

      if (f.isIndexExtended && f.isMiddleExtended && f.isRingExtended && f.isPinkyExtended && f.isThumbExtended && f.isHandUpright) {
        return {
          id: 'isl_hello',
          name: 'Hello / Greetings',
          label: 'Hello',
          signGloss: 'HELLO',
          emoji: '👋',
          category: 'Communication',
          confidence: 0.92,
          description: 'Open upright palm with spread fingers waving hello',
          language: 'ISL',
        };
      }
      return null;
    },
  },

  // 7. Please / Need Assistance (🤲)
  {
    id: 'isl_please',
    name: 'Please / Need Help',
    label: 'Please / Need',
    signGloss: 'PLEASE / NEED',
    emoji: '🤲',
    category: 'Needs',
    baseConfidence: 0.93,
    description: 'Two open cupped palms presented forward requesting assistance',
    language: 'ISL',
    thresholds: {
      numHandsRequired: 2,
      distances: { wristToWristMax: 0.35 },
    },
    evaluate: (landmarksList) => {
      if (landmarksList.length === 2) {
        const f1 = getFingerStates(landmarksList[0]);
        const f2 = getFingerStates(landmarksList[1]);
        const wrist1 = landmarksList[0][0];
        const wrist2 = landmarksList[1][0];

        if (f1.isIndexExtended && f2.isIndexExtended && f1.isMiddleExtended && f2.isMiddleExtended && distance2D(wrist1, wrist2) < 0.35) {
          return {
            id: 'isl_please',
            name: 'Please / Need Help',
            label: 'Please / Need',
            signGloss: 'PLEASE / NEED',
            emoji: '🤲',
            category: 'Needs',
            confidence: 0.93,
            description: 'Two open cupped palms presented forward requesting assistance',
            language: 'ISL',
          };
        }
      }
      return null;
    },
  },

  // 8. Call Me / Emergency Phone (🤙)
  {
    id: 'isl_call_me',
    name: 'Call Me / Phone',
    label: 'Call / Phone',
    signGloss: 'CALL / PHONE',
    emoji: '🤙',
    category: 'Emergency',
    baseConfidence: 0.93,
    description: 'Extended thumb and pinky signaling phone call or emergency contact',
    language: 'ISL',
    thresholds: {
      numHandsRequired: 1,
      fingers: { thumb: true, index: false, middle: false, ring: false, pinky: true },
    },
    evaluate: (landmarksList) => {
      const landmarks = landmarksList[0];
      if (!landmarks || landmarks.length < 21) return null;
      const f = getFingerStates(landmarks);

      if (f.isThumbExtended && f.isPinkyExtended && !f.isIndexExtended && !f.isMiddleExtended && !f.isRingExtended) {
        return {
          id: 'isl_call_me',
          name: 'Call Me / Phone',
          label: 'Call / Phone',
          signGloss: 'CALL / PHONE',
          emoji: '🤙',
          category: 'Emergency',
          confidence: 0.93,
          description: 'Extended thumb and pinky signaling phone call or emergency contact',
          language: 'ISL',
        };
      }
      return null;
    },
  },

  // 9. I Love You / Respect (🤟)
  {
    id: 'isl_i_love_you',
    name: 'I Love You / Care',
    label: 'Love / Care',
    signGloss: 'LOVE / RESPECT',
    emoji: '🤟',
    category: 'Communication',
    baseConfidence: 0.94,
    description: 'Thumb, index, and pinky extended expressing affection and goodwill',
    language: 'ISL',
    thresholds: {
      numHandsRequired: 1,
      fingers: { thumb: true, index: true, middle: false, ring: false, pinky: true },
    },
    evaluate: (landmarksList) => {
      const landmarks = landmarksList[0];
      if (!landmarks || landmarks.length < 21) return null;
      const f = getFingerStates(landmarks);

      if (f.isThumbExtended && f.isIndexExtended && f.isPinkyExtended && !f.isMiddleExtended && !f.isRingExtended) {
        return {
          id: 'isl_i_love_you',
          name: 'I Love You / Care',
          label: 'Love / Care',
          signGloss: 'LOVE / RESPECT',
          emoji: '🤟',
          category: 'Communication',
          confidence: 0.94,
          description: 'Thumb, index, and pinky extended expressing affection and goodwill',
          language: 'ISL',
        };
      }
      return null;
    },
  },

  // 10. Peace / Victory (✌️)
  {
    id: 'isl_victory_peace',
    name: 'Peace / Victory',
    label: 'Peace / Two',
    signGloss: 'PEACE / TWO',
    emoji: '✌️',
    category: 'Communication',
    baseConfidence: 0.92,
    description: 'V-sign made with index and middle finger pointing upward',
    language: 'ISL',
    thresholds: {
      numHandsRequired: 1,
      fingers: { index: true, middle: true, ring: false, pinky: false },
    },
    evaluate: (landmarksList) => {
      const landmarks = landmarksList[0];
      if (!landmarks || landmarks.length < 21) return null;
      const f = getFingerStates(landmarks);
      const indexTip = landmarks[8];
      const middleTip = landmarks[12];

      if (f.isIndexExtended && f.isMiddleExtended && !f.isRingExtended && !f.isPinkyExtended && distance2D(indexTip, middleTip) > 0.05) {
        return {
          id: 'isl_victory_peace',
          name: 'Peace / Victory',
          label: 'Peace / Two',
          signGloss: 'PEACE / TWO',
          emoji: '✌️',
          category: 'Communication',
          confidence: 0.92,
          description: 'V-sign made with index and middle finger pointing upward',
          language: 'ISL',
        };
      }
      return null;
    },
  },

  // 11. Water / Drink (💧)
  {
    id: 'isl_water',
    name: 'Water / Drink',
    label: 'Water / Drink',
    signGloss: 'WATER / DRINK',
    emoji: '💧',
    category: 'Needs',
    baseConfidence: 0.90,
    description: 'Three fingers (Index, Middle, Ring) forming the W sign for Water',
    language: 'ISL',
    thresholds: {
      numHandsRequired: 1,
      fingers: { index: true, middle: true, ring: true, pinky: false },
    },
    evaluate: (landmarksList) => {
      const landmarks = landmarksList[0];
      if (!landmarks || landmarks.length < 21) return null;
      const f = getFingerStates(landmarks);

      if (f.isIndexExtended && f.isMiddleExtended && f.isRingExtended && !f.isPinkyExtended) {
        return {
          id: 'isl_water',
          name: 'Water / Drink',
          label: 'Water / Drink',
          signGloss: 'WATER / DRINK',
          emoji: '💧',
          category: 'Needs',
          confidence: 0.90,
          description: 'Three fingers (Index, Middle, Ring) forming the W sign for Water',
          language: 'ISL',
        };
      }
      return null;
    },
  },

  // 12. Point / Direction (☝️)
  {
    id: 'isl_point',
    name: 'Point / Direction',
    label: 'Point / You',
    signGloss: 'YOU / THERE',
    emoji: '☝️',
    category: 'Communication',
    baseConfidence: 0.91,
    description: 'Single index finger extended pointing towards object or person',
    language: 'ISL',
    thresholds: {
      numHandsRequired: 1,
      fingers: { index: true, middle: false, ring: false, pinky: false },
    },
    evaluate: (landmarksList) => {
      const landmarks = landmarksList[0];
      if (!landmarks || landmarks.length < 21) return null;
      const f = getFingerStates(landmarks);

      if (f.isIndexExtended && !f.isMiddleExtended && !f.isRingExtended && !f.isPinkyExtended) {
        return {
          id: 'isl_point',
          name: 'Point / Direction',
          label: 'Point / You',
          signGloss: 'YOU / THERE',
          emoji: '☝️',
          category: 'Communication',
          confidence: 0.91,
          description: 'Single index finger extended pointing towards object or person',
          language: 'ISL',
        };
      }
      return null;
    },
  },

  // 13. OK / Fine (👌)
  {
    id: 'isl_ok_fine',
    name: 'OK / Fine',
    label: 'OK / Fine',
    signGloss: 'OK / FINE',
    emoji: '👌',
    category: 'Basic',
    baseConfidence: 0.93,
    description: 'Circle formed by index and thumb tip indicating everything is fine',
    language: 'ISL',
    thresholds: {
      numHandsRequired: 1,
      distances: { thumbToIndexTipMax: 0.06 },
      fingers: { middle: true, ring: true, pinky: true },
    },
    evaluate: (landmarksList) => {
      const landmarks = landmarksList[0];
      if (!landmarks || landmarks.length < 21) return null;
      const f = getFingerStates(landmarks);
      const thumbTip = landmarks[4];
      const indexTip = landmarks[8];

      if (distance2D(thumbTip, indexTip) < 0.06 && f.isMiddleExtended && f.isRingExtended && f.isPinkyExtended) {
        return {
          id: 'isl_ok_fine',
          name: 'OK / Fine',
          label: 'OK / Fine',
          signGloss: 'OK / FINE',
          emoji: '👌',
          category: 'Basic',
          confidence: 0.93,
          description: 'Circle formed by index and thumb tip indicating everything is fine',
          language: 'ISL',
        };
      }
      return null;
    },
  },

  // 14. Quiet / Silence (🤫)
  {
    id: 'isl_quiet',
    name: 'Quiet / Silence',
    label: 'Quiet / Hush',
    signGloss: 'SILENCE / QUIET',
    emoji: '🤫',
    category: 'Communication',
    baseConfidence: 0.89,
    description: 'Index finger raised near lips signaling quiet or silence',
    language: 'ISL',
    thresholds: {
      numHandsRequired: 1,
      fingers: { index: true, middle: false, ring: false, pinky: false },
      yPositions: { indexTipAboveY: 0.38 },
    },
    evaluate: (landmarksList) => {
      const landmarks = landmarksList[0];
      if (!landmarks || landmarks.length < 21) return null;
      const f = getFingerStates(landmarks);
      const indexTip = landmarks[8];

      if (f.isIndexExtended && !f.isMiddleExtended && !f.isRingExtended && !f.isPinkyExtended && indexTip.y < 0.38) {
        return {
          id: 'isl_quiet',
          name: 'Quiet / Silence',
          label: 'Quiet / Hush',
          signGloss: 'SILENCE / QUIET',
          emoji: '🤫',
          category: 'Communication',
          confidence: 0.89,
          description: 'Index finger raised near lips signaling quiet or silence',
          language: 'ISL',
        };
      }
      return null;
    },
  },

  // 15. Strong / Power (✊)
  {
    id: 'isl_fist_strong',
    name: 'Strong / Power',
    label: 'Strong / Fist',
    signGloss: 'STRONG / POWER',
    emoji: '✊',
    category: 'Basic',
    baseConfidence: 0.88,
    description: 'Solid raised fist indicating strength, solidarity, or determination',
    language: 'ISL',
    thresholds: {
      numHandsRequired: 1,
      isHandUpright: true,
      fingers: { index: false, middle: false, ring: false, pinky: false },
    },
    evaluate: (landmarksList) => {
      const landmarks = landmarksList[0];
      if (!landmarks || landmarks.length < 21) return null;
      const f = getFingerStates(landmarks);
      const wrist = landmarks[0];
      const middleMcp = landmarks[9];

      const allFolded = !f.isIndexExtended && !f.isMiddleExtended && !f.isRingExtended && !f.isPinkyExtended;
      if (allFolded && wrist.y > middleMcp.y) {
        return {
          id: 'isl_fist_strong',
          name: 'Strong / Power',
          label: 'Strong / Fist',
          signGloss: 'STRONG / POWER',
          emoji: '✊',
          category: 'Basic',
          confidence: 0.88,
          description: 'Solid raised fist indicating strength, solidarity, or determination',
          language: 'ISL',
        };
      }
      return null;
    },
  },
];
