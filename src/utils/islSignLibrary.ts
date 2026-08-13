/**
 * ISL Sign Dataset Library Interface
 * 
 * Scalable schema definition for integrating authentic Indian Sign Language (ISL) datasets.
 * Designed to support 2D/3D skeletal landmark pose sequences (MediaPipe/OpenPose formats),
 * video clips, gloss/word mappings, and grammatical metadata.
 */

// ---------------------------------------------------------------------------
// 1. Landmark & Pose Data Structures (Dataset Pose Keypoints)
// ---------------------------------------------------------------------------

export interface ISLKeypoint {
  x: number;
  y: number;
  z?: number;
  visibility?: number;
}

export interface ISLHandLandmarks {
  leftHand?: ISLKeypoint[];  // 21 landmark coordinates (MediaPipe format)
  rightHand?: ISLKeypoint[]; // 21 landmark coordinates
}

export interface ISLBodyLandmarks {
  pose?: ISLKeypoint[];      // Upper body pose keypoints (shoulders, elbows, wrists)
  face?: ISLKeypoint[];      // Facial landmarks for non-manual features / expressions
}

export interface ISLSkeletalFrame {
  frameIndex: number;
  timestampMs: number;
  hands: ISLHandLandmarks;
  body?: ISLBodyLandmarks;
}

export interface ISLSkeletalSequence {
  fps: number;
  totalFrames: number;
  durationMs: number;
  frames: ISLSkeletalFrame[];
}

// ---------------------------------------------------------------------------
// 2. ISL Sign Metadata & Classification
// ---------------------------------------------------------------------------

export type ISLGrammarCategory =
  | 'NOUN'
  | 'VERB'
  | 'ADJECTIVE'
  | 'PRONOUN'
  | 'QUESTION'
  | 'GREETING'
  | 'NUMERAL'
  | 'TIME'
  | 'EMERGENCY'
  | 'GENERAL';

export interface ISLSignMetadata {
  datasetSource?: string;     // e.g., 'INCLUDE_Dataset', 'ISLRTC_Official', 'Custom'
  regionalDialect?: string;  // Regional ISL variations (e.g., North, South, Universal)
  isVerified: boolean;        // Whether validated by certified Deaf ISL instructors
  difficultyLevel?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  tags?: string[];
}

// ---------------------------------------------------------------------------
// 3. Core ISL Sign Entry Interface
// ---------------------------------------------------------------------------

export interface ISLSignEntry {
  /** Unique identifier in dataset (e.g., "isl_water_001") */
  id: string;

  /** Primary ISL Gloss name in uppercase (e.g., "WATER") */
  gloss: string;

  /** Corresponding English words & synonyms (e.g., ["water", "drink", "aqua"]) */
  englishSynonyms: string[];

  /** Grammatical category in ISL structure */
  category: ISLGrammarCategory;

  /** Textual explanation of how the sign is performed */
  description?: string;

  /** Optional path to video/media reference clip in dataset */
  videoUrl?: string;

  /** Optional thumbnail preview URL */
  thumbnailUrl?: string;

  /** Motion pose data for skeletal animation engines */
  poseSequence?: ISLSkeletalSequence;

  /** Dataset provenance & validation metadata */
  metadata: ISLSignMetadata;
}

// ---------------------------------------------------------------------------
// 4. Placeholder ISL Sign Library Registry
// ---------------------------------------------------------------------------

export interface ISLSignLibraryCatalog {
  version: string;
  lastUpdated: string;
  totalEntries: number;
  signs: Record<string, ISLSignEntry>; // Map of Gloss -> ISLSignEntry
}

/**
 * Empty placeholder library structure ready to be populated by real ISL datasets.
 */
export const ISL_SIGN_LIBRARY: ISLSignLibraryCatalog = {
  version: '1.0.0-placeholder',
  lastUpdated: new Date().toISOString(),
  totalEntries: 0,
  signs: {},
};

// ---------------------------------------------------------------------------
// 5. Utility Lookup Helpers (For Future Dataset Queries)
// ---------------------------------------------------------------------------

/**
 * Look up an ISL sign entry by gloss identifier.
 */
export function getISLSignByGloss(gloss: string): ISLSignEntry | undefined {
  const normalizedGloss = gloss.trim().toUpperCase();
  return ISL_SIGN_LIBRARY.signs[normalizedGloss];
}

/**
 * Search signs matching an English query word or synonym.
 */
export function searchISLSignsByEnglishWord(word: string): ISLSignEntry[] {
  const query = word.trim().toLowerCase();
  if (!query) return [];

  return Object.values(ISL_SIGN_LIBRARY.signs).filter((entry) => {
    return (
      entry.gloss.toLowerCase() === query ||
      entry.englishSynonyms.some((syn) => syn.toLowerCase() === query)
    );
  });
}

/**
 * Register a new sign entry into the library registry (for dataset imports).
 */
export function registerISLSignEntry(entry: ISLSignEntry): void {
  const normalizedGloss = entry.gloss.trim().toUpperCase();
  ISL_SIGN_LIBRARY.signs[normalizedGloss] = entry;
  ISL_SIGN_LIBRARY.totalEntries = Object.keys(ISL_SIGN_LIBRARY.signs).length;
}

// ---------------------------------------------------------------------------
// 6. Registered Dataset Signs
// ---------------------------------------------------------------------------

registerISLSignEntry({
  id: 'isl_water_001',
  gloss: 'WATER',
  englishSynonyms: ['water', 'drink'],
  category: 'NOUN',
  videoUrl: '/isl_dataset/water.mp4',
  metadata: {
    isVerified: false,
    datasetSource: 'Bharath1330/sign-dictionary-isl',
  },
});
