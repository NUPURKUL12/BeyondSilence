import { SUPPORTED_ISL_GESTURES, ISLGesture } from './gestureRegistry';

export interface Point3D {
  x: number;
  y: number;
  z?: number;
}

export type LandmarkList = Point3D[];

function distance(p1: Point3D, p2: Point3D): number {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  const dz = (p1.z || 0) - (p2.z || 0);
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function isFingerExtended(landmarks: LandmarkList, tipIdx: number, pipIdx: number): boolean {
  const wrist = landmarks[0];
  const tip = landmarks[tipIdx];
  const pip = landmarks[pipIdx];
  return distance(tip, wrist) > distance(pip, wrist) * 1.12;
}

function isFingerFolded(landmarks: LandmarkList, tipIdx: number, pipIdx: number): boolean {
  const wrist = landmarks[0];
  const tip = landmarks[tipIdx];
  const pip = landmarks[pipIdx];
  return distance(tip, wrist) < distance(pip, wrist) * 0.95;
}

export function recognizeGesture(multiHandLandmarks: LandmarkList[]): ISLGesture | null {
  if (!multiHandLandmarks || multiHandLandmarks.length === 0) {
    return null;
  }

  // Two-hand gestures evaluation
  if (multiHandLandmarks.length >= 2) {
    const hand1 = multiHandLandmarks[0];
    const hand2 = multiHandLandmarks[1];

    const wristDist = distance(hand1[0], hand2[0]);
    const indexTipDist = distance(hand1[8], hand2[8]);

    // HOME: Fingertips touching at roof angle
    if (indexTipDist < 0.12 && wristDist > 0.15) {
      return SUPPORTED_ISL_GESTURES.find((g) => g.id === 'HOME') || null;
    }

    // FRIEND: Hooked index fingers / tips touching together
    if (indexTipDist < 0.08 && wristDist < 0.22) {
      return SUPPORTED_ISL_GESTURES.find((g) => g.id === 'FRIEND') || null;
    }

    // NAMASTE / HELLO: Both wrists close together and both hands open
    if (wristDist < 0.25) {
      return SUPPORTED_ISL_GESTURES.find((g) => g.id === 'HELLO') || null;
    }

    // HELP: One hand fist (all folded), resting near other hand
    const h1Folded = isFingerFolded(hand1, 8, 6) && isFingerFolded(hand1, 12, 10);
    const h2Extended = isFingerExtended(hand2, 8, 6) && isFingerExtended(hand2, 12, 10);
    if ((h1Folded && h2Extended) || (!h1Folded && !h2Extended && wristDist < 0.18)) {
      return SUPPORTED_ISL_GESTURES.find((g) => g.id === 'HELP') || null;
    }
  }

  // Single-hand gesture evaluation (using primary/first hand)
  const hand = multiHandLandmarks[0];
  const wrist = hand[0];
  const thumbTip = hand[4];
  const thumbMcp = hand[2];
  const indexTip = hand[8];
  const ringTip = hand[16];

  const indexExt = isFingerExtended(hand, 8, 6);
  const middleExt = isFingerExtended(hand, 12, 10);
  const ringExt = isFingerExtended(hand, 16, 14);
  const pinkyExt = isFingerExtended(hand, 20, 18);
  const thumbExt = distance(thumbTip, hand[17]) > distance(thumbMcp, hand[17]) * 1.1;

  const indexFold = isFingerFolded(hand, 8, 6);
  const middleFold = isFingerFolded(hand, 12, 10);
  const ringFold = isFingerFolded(hand, 16, 14);
  const pinkyFold = isFingerFolded(hand, 20, 18);

  const thumbIndexDist = distance(thumbTip, indexTip);

  // 1. OK / PERFECT: Thumb tip and index tip close together forming circle, middle/ring/pinky open
  if (thumbIndexDist < 0.07 && middleExt && ringExt) {
    return SUPPORTED_ISL_GESTURES.find((g) => g.id === 'OK') || null;
  }

  // 2. I_LOVE_YOU: Thumb, index, and pinky extended; middle and ring folded
  if (thumbExt && indexExt && pinkyExt && middleFold && ringFold) {
    return SUPPORTED_ISL_GESTURES.find((g) => g.id === 'I_LOVE_YOU') || null;
  }

  // 3. PEACE / VICTORY: Index and middle extended; ring and pinky folded
  if (indexExt && middleExt && ringFold && pinkyFold) {
    return SUPPORTED_ISL_GESTURES.find((g) => g.id === 'PEACE') || null;
  }

  // 4. WATER: 'W' shape - Index, middle, ring extended; pinky folded
  if (indexExt && middleExt && ringExt && pinkyFold) {
    return SUPPORTED_ISL_GESTURES.find((g) => g.id === 'WATER') || null;
  }

  // 5. YES (Thumbs Up): Thumb pointing up, index/middle/ring/pinky folded
  if (indexFold && middleFold && ringFold && pinkyFold && thumbTip.y < thumbMcp.y) {
    return SUPPORTED_ISL_GESTURES.find((g) => g.id === 'YES') || null;
  }

  // 6. NO (Thumbs Down): Thumb pointing down, index/middle/ring/pinky folded
  if (indexFold && middleFold && ringFold && pinkyFold && thumbTip.y > thumbMcp.y) {
    return SUPPORTED_ISL_GESTURES.find((g) => g.id === 'NO') || null;
  }

  // 7. POINT (Look / You): Index finger pointing, middle/ring/pinky folded
  if (indexExt && middleFold && ringFold && pinkyFold) {
    return SUPPORTED_ISL_GESTURES.find((g) => g.id === 'POINT') || null;
  }

  // 8. STOP / HELLO: All 5 fingers extended flat facing camera
  if (indexExt && middleExt && ringExt && pinkyExt && thumbExt) {
    if (hand[8].y < hand[0].y) {
      return SUPPORTED_ISL_GESTURES.find((g) => g.id === 'HELLO') || null;
    }
    return SUPPORTED_ISL_GESTURES.find((g) => g.id === 'STOP') || null;
  }

  // 9. THANK YOU: All fingers open flat
  if (indexExt && middleExt && ringExt && pinkyExt) {
    return SUPPORTED_ISL_GESTURES.find((g) => g.id === 'THANK_YOU') || null;
  }

  // 10. PLEASE: Flat hand near chest
  if (indexExt && middleExt && ringExt && !pinkyExt) {
    return SUPPORTED_ISL_GESTURES.find((g) => g.id === 'PLEASE') || null;
  }

  // 11. GOOD: Thumb up with open hand support
  if (thumbExt && thumbTip.y < wrist.y && (indexExt || middleExt)) {
    return SUPPORTED_ISL_GESTURES.find((g) => g.id === 'GOOD') || null;
  }

  return null;
}
