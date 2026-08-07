import { ISL_GESTURE_REGISTRY, GestureDefinition } from './gestureRegistry';

export interface NormalizedLandmark {
  x: number;
  y: number;
  z?: number;
}

export type GestureCategory = 'Communication' | 'Emergency' | 'Needs' | 'Basic';

export interface RecognizedGesture {
  id: string;
  name: string;
  label: string;
  signGloss: string;
  emoji: string;
  category: GestureCategory;
  confidence: number;
  description: string;
  language: string;
}

/**
 * Utility: 2D Euclidean distance between two 2D normalized points
 */
export function distance2D(p1: NormalizedLandmark, p2: NormalizedLandmark): number {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Utility: Helper to check finger extension states
 */
export interface FingerStates {
  isThumbExtended: boolean;
  isIndexExtended: boolean;
  isMiddleExtended: boolean;
  isRingExtended: boolean;
  isPinkyExtended: boolean;
  isHandUpright: boolean;
}

export function getFingerStates(landmarks: NormalizedLandmark[]): FingerStates {
  const wrist = landmarks[0];
  const thumbTip = landmarks[4];
  const thumbMcp = landmarks[2];
  const indexTip = landmarks[8];
  const indexPip = landmarks[6];
  const middleTip = landmarks[12];
  const middlePip = landmarks[10];
  const middleMcp = landmarks[9];
  const ringTip = landmarks[16];
  const ringPip = landmarks[14];
  const pinkyTip = landmarks[20];
  const pinkyPip = landmarks[18];

  // In screen space (y=0 top, y=1 bottom): Tip y < PIP y means finger is pointing upward (extended)
  const isIndexExtended = indexTip.y < indexPip.y;
  const isMiddleExtended = middleTip.y < middlePip.y;
  const isRingExtended = ringTip.y < ringPip.y;
  const isPinkyExtended = pinkyTip.y < pinkyPip.y;

  // Thumb extended laterally or upward away from palm center (middle MCP)
  const palmCenter = middleMcp;
  const thumbDist = distance2D(thumbTip, palmCenter);
  const isThumbExtended = thumbDist > 0.12 || thumbTip.y < thumbMcp.y;

  // Hand upright check (wrist below middle MCP)
  const isHandUpright = wrist.y > middleMcp.y;

  return {
    isThumbExtended,
    isIndexExtended,
    isMiddleExtended,
    isRingExtended,
    isPinkyExtended,
    isHandUpright,
  };
}

// Export supported gestures reference list for UI dropdowns and guides
export const SUPPORTED_ISL_GESTURES: Omit<RecognizedGesture, 'confidence'>[] = ISL_GESTURE_REGISTRY.map((g) => ({
  id: g.id,
  name: g.name,
  label: g.label,
  signGloss: g.signGloss,
  emoji: g.emoji,
  category: g.category,
  description: g.description,
  language: g.language,
}));

/**
 * Main Scalable Recognition Classifier Loop.
 * Iterates through the registered ISL gesture rules defined in gestureRegistry.ts
 */
export function recognizeHandGesture(multiHandLandmarks: NormalizedLandmark[][]): RecognizedGesture | null {
  if (!multiHandLandmarks || multiHandLandmarks.length === 0) return null;

  // Iterate through registered ISL gestures in the registry
  for (const gestureDef of ISL_GESTURE_REGISTRY) {
    const recognized = gestureDef.evaluate(multiHandLandmarks);
    if (recognized) {
      return recognized;
    }
  }

  return null;
}

