import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Maximize2, 
  Eye, 
  Sparkles, 
  FastForward, 
  Sliders, 
  Volume2, 
  CheckCircle2, 
  Activity,
  Layers,
  ZoomIn
} from 'lucide-react';

export interface AvatarSigner3DProps {
  glosses?: string[];
  fullSentence?: string;
  autoPlay?: boolean;
  className?: string;
  onGlossChange?: (currentGloss: string, index: number) => void;
}

// Target joint rotation pose structure (in Euler radians or degrees)
interface JointPose {
  rShoulderZ: number; // Abduction / Raise
  rShoulderY: number; // Rotation
  rShoulderX: number; // Flexion forward/back
  rElbowZ: number;    // Bend
  rElbowY: number;    // Forearm rotation
  rWristZ: number;    // Wrist tilt
  rWristX: number;
  rFingers: number;   // 0 = open, 1 = fist, 0.5 = partial

  lShoulderZ: number;
  lShoulderY: number;
  lShoulderX: number;
  lElbowZ: number;
  lElbowY: number;
  lWristZ: number;
  lWristX: number;
  lFingers: number;

  headY: number;      // Turn left/right
  headX: number;      // Nod up/down
  chestY: number;     // Torso turn
}

// Default neutral idle posture
const IDLE_POSE: JointPose = {
  rShoulderZ: -1.2,
  rShoulderY: 0.1,
  rShoulderX: 0,
  rElbowZ: 0.3,
  rElbowY: 0,
  rWristZ: 0,
  rWristX: 0,
  rFingers: 0.1,

  lShoulderZ: 1.2,
  lShoulderY: -0.1,
  lShoulderX: 0,
  lElbowZ: -0.3,
  lElbowY: 0,
  lWristZ: 0,
  lWristX: 0,
  lFingers: 0.1,

  headY: 0,
  headX: 0,
  chestY: 0,
};

// Map of Sign Gloss tokens to 3D joint keyframe poses
const GLOSS_POSES: Record<string, JointPose[]> = {
  HELLO: [
    {
      ...IDLE_POSE,
      rShoulderZ: -0.2,
      rShoulderY: 0.3,
      rElbowZ: 1.6,
      rWristZ: 0.4,
      rFingers: 0, // open hand
      headY: -0.1,
    },
    {
      ...IDLE_POSE,
      rShoulderZ: -0.2,
      rShoulderY: 0.3,
      rElbowZ: 1.6,
      rWristZ: -0.4, // wave side to side
      rFingers: 0,
      headY: 0.1,
    },
  ],
  WELCOME: [
    {
      ...IDLE_POSE,
      rShoulderZ: -0.5,
      rShoulderX: 0.8,
      rElbowZ: 0.8,
      lShoulderZ: 0.5,
      lShoulderX: 0.8,
      lElbowZ: -0.8,
      rFingers: 0,
      lFingers: 0,
      headX: -0.15, // gracious head nod
    },
    {
      ...IDLE_POSE,
      rShoulderZ: -0.2,
      rShoulderX: 0.2,
      rElbowZ: 1.2,
      lShoulderZ: 0.2,
      lShoulderX: 0.2,
      lElbowZ: -1.2,
      rFingers: 0,
      lFingers: 0,
    },
  ],
  EVERYONE: [
    {
      ...IDLE_POSE,
      rShoulderZ: -0.8,
      rShoulderY: -0.6,
      rElbowZ: 0.9,
      lShoulderZ: 0.1,
      lElbowZ: -0.4,
      chestY: -0.3,
    },
    {
      ...IDLE_POSE,
      rShoulderZ: -0.2,
      rShoulderY: 0.6,
      rElbowZ: 0.9,
      lShoulderZ: 0.8,
      lElbowZ: -0.4,
      chestY: 0.3, // wide circular sweep
    },
  ],
  MEETING: [
    {
      ...IDLE_POSE,
      rShoulderZ: -0.4,
      rShoulderX: 0.6,
      rElbowZ: 1.4,
      lShoulderZ: 0.4,
      lShoulderX: 0.6,
      lElbowZ: -1.4,
      rFingers: 0,
      lFingers: 0,
    },
    {
      ...IDLE_POSE,
      rShoulderZ: -0.1,
      rShoulderX: 0.3,
      rElbowZ: 1.8,
      lShoulderZ: 0.1,
      lShoulderX: 0.3,
      lElbowZ: -1.8,
      rFingers: 0.8, // hands meeting in center
      lFingers: 0.8,
    },
  ],
  START: [
    {
      ...IDLE_POSE,
      rShoulderZ: -0.3,
      rElbowZ: 1.2,
      rWristZ: 0.5,
      lShoulderZ: 0.2,
      lElbowZ: -1.0,
      rFingers: 0.2,
    },
    {
      ...IDLE_POSE,
      rShoulderZ: -0.1,
      rElbowZ: 1.6,
      rWristZ: -0.5, // turn key motion
      lShoulderZ: 0.2,
      lElbowZ: -1.0,
      rFingers: 0.2,
    },
  ],
  TIME: [
    {
      ...IDLE_POSE,
      lShoulderZ: 0.5,
      lElbowZ: -1.5,
      lWristX: 0.5, // left arm across chest
      rShoulderZ: -0.3,
      rElbowZ: 1.6,
      rFingers: 0.9, // right index pointing to left wrist
      rWristZ: 0.2,
    },
    {
      ...IDLE_POSE,
      lShoulderZ: 0.5,
      lElbowZ: -1.5,
      lWristX: 0.5,
      rShoulderZ: -0.2,
      rElbowZ: 1.8,
      rFingers: 0.9, // tap twice
      rWristZ: -0.1,
    },
  ],
  PLEASE: [
    {
      ...IDLE_POSE,
      rShoulderZ: -0.3,
      rShoulderX: 0.4,
      rElbowZ: 1.7,
      rFingers: 0, // open right hand flat on chest
      rWristZ: 0.3,
      headX: -0.1,
    },
    {
      ...IDLE_POSE,
      rShoulderZ: -0.2,
      rShoulderX: 0.2,
      rElbowZ: 1.5,
      rFingers: 0,
      rWristZ: -0.3, // circular chest rub
      headX: -0.1,
    },
  ],
  BRING: [
    {
      ...IDLE_POSE,
      rShoulderZ: -0.3,
      rShoulderX: 0.7,
      rElbowZ: 1.0,
      lShoulderZ: 0.3,
      lShoulderX: 0.7,
      lElbowZ: -1.0,
      rFingers: 0,
      lFingers: 0,
    },
    {
      ...IDLE_POSE,
      rShoulderZ: -0.2,
      rShoulderX: 0.2,
      rElbowZ: 1.6,
      lShoulderZ: 0.2,
      lShoulderX: 0.2,
      lElbowZ: -1.6,
      rFingers: 0,
      lFingers: 0,
    },
  ],
  SLIDES: [
    {
      ...IDLE_POSE,
      rShoulderZ: -0.5,
      rElbowZ: 1.3,
      rWristZ: 0.5,
      lShoulderZ: 0.5,
      lElbowZ: -1.3,
      lWristZ: -0.5,
      rFingers: 0,
      lFingers: 0,
    },
    {
      ...IDLE_POSE,
      rShoulderZ: -0.9,
      rElbowZ: 0.7,
      rWristZ: -0.2,
      lShoulderZ: 0.9,
      lElbowZ: -0.7,
      lWristZ: 0.2,
      rFingers: 0,
      lFingers: 0,
    },
  ],
  DOCTOR: [
    {
      ...IDLE_POSE,
      lShoulderZ: 0.4,
      lElbowZ: -1.4,
      rShoulderZ: -0.3,
      rElbowZ: 1.7,
      rFingers: 0.7,
      headX: -0.1,
    },
    {
      ...IDLE_POSE,
      lShoulderZ: 0.4,
      lElbowZ: -1.4,
      rShoulderZ: -0.1,
      rElbowZ: 1.9,
      rFingers: 0.7,
      headX: 0,
    },
  ],
  THANK_YOU: [
    {
      ...IDLE_POSE,
      rShoulderZ: -0.2,
      rElbowZ: 1.9,
      rWristX: 0.4,
      rFingers: 0, // hand at chin
      headX: -0.1,
    },
    {
      ...IDLE_POSE,
      rShoulderZ: -0.4,
      rShoulderX: 0.6,
      rElbowZ: 1.0,
      rWristX: 0,
      rFingers: 0, // hand moves forward
      headX: -0.15,
    },
  ],
  HELP: [
    {
      ...IDLE_POSE,
      lShoulderZ: 0.4,
      lElbowZ: -1.2,
      lFingers: 0, // flat left palm base
      rShoulderZ: -0.3,
      rElbowZ: 1.5,
      rFingers: 1.0, // right fist with thumb up resting on left palm
      rShoulderX: 0.3,
    },
    {
      ...IDLE_POSE,
      lShoulderZ: 0.3,
      lElbowZ: -1.5,
      lFingers: 0,
      rShoulderZ: -0.2,
      rElbowZ: 1.8,
      rFingers: 1.0, // move upward together
      rShoulderX: 0.5,
      headX: -0.1,
    },
  ],
  WATER: [
    {
      ...IDLE_POSE,
      rShoulderZ: -0.2,
      rElbowZ: 1.9,
      rWristX: 0.3,
      rFingers: 0.3, // W sign near chin
      headX: -0.1,
    },
    {
      ...IDLE_POSE,
      rShoulderZ: -0.2,
      rElbowZ: 2.0,
      rWristX: 0.4,
      rFingers: 0.3, // tap chin twice
      headX: -0.1,
    },
  ],
  YES: [
    {
      ...IDLE_POSE,
      rShoulderZ: -0.3,
      rElbowZ: 1.5,
      rWristZ: 0.5,
      rFingers: 1.0, // fist nodding
      headX: -0.2,
    },
    {
      ...IDLE_POSE,
      rShoulderZ: -0.3,
      rElbowZ: 1.5,
      rWristZ: -0.3,
      rFingers: 1.0,
      headX: 0.1,
    },
  ],
  NO: [
    {
      ...IDLE_POSE,
      rShoulderZ: -0.3,
      rElbowZ: 1.6,
      rFingers: 0.5, // index and middle snapping to thumb
      headY: -0.25,
    },
    {
      ...IDLE_POSE,
      rShoulderZ: -0.3,
      rElbowZ: 1.6,
      rFingers: 1.0,
      headY: 0.25, // shake head
    },
  ],
  CALL: [
    {
      ...IDLE_POSE,
      rShoulderZ: -0.2,
      rElbowZ: 2.0,
      rWristX: 0.5,
      rFingers: 0.8, // thumb & pinky phone to ear
      headY: -0.2,
    },
    {
      ...IDLE_POSE,
      rShoulderZ: -0.2,
      rElbowZ: 2.1,
      rWristX: 0.5,
      rFingers: 0.8,
      headY: -0.2,
    },
  ],
};

export const AvatarSigner3D: React.FC<AvatarSigner3DProps> = ({
  glosses = ['WELCOME', 'EVERYONE', 'MEETING', 'START', 'TIME', 'PLEASE', 'BRING', 'SLIDES'],
  fullSentence = 'Welcome everyone! Meeting starts at 10 AM. Please bring your slides.',
  autoPlay = true,
  className = '',
  onGlossChange,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentGlossIndex, setCurrentGlossIndex] = useState(0);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1.0);
  const [viewPreset, setViewPreset] = useState<'front' | 'angle' | 'zoom'>('angle');
  const [fps, setFps] = useState<number>(60);

  // References for Three.js state
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  
  // Skeleton Joint references
  const jointsRef = useRef<{
    chest?: THREE.Group;
    head?: THREE.Group;
    rShoulder?: THREE.Group;
    rElbow?: THREE.Group;
    rWrist?: THREE.Group;
    rHandMesh?: THREE.Mesh;
    rFingersGroup?: THREE.Group;
    lShoulder?: THREE.Group;
    lElbow?: THREE.Group;
    lWrist?: THREE.Group;
    lHandMesh?: THREE.Mesh;
    lFingersGroup?: THREE.Group;
  }>({});

  // Animation Interpolation state
  const currentPoseRef = useRef<JointPose>({ ...IDLE_POSE });
  const targetPoseRef = useRef<JointPose>({ ...IDLE_POSE });
  const keyframeIndexRef = useRef<number>(0);
  const stepTimerRef = useRef<number>(0);
  const isMouseDownRef = useRef<boolean>(false);
  const mousePrevRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const orbitRotationRef = useRef<{ theta: number; phi: number; distance: number }>({
    theta: 0.25,
    phi: 0.15,
    distance: 2.8,
  });

  // Camera preset controller
  const applyCameraPreset = useCallback((preset: 'front' | 'angle' | 'zoom') => {
    setViewPreset(preset);
    if (preset === 'front') {
      orbitRotationRef.current = { theta: 0, phi: 0.05, distance: 2.7 };
    } else if (preset === 'angle') {
      orbitRotationRef.current = { theta: 0.35, phi: 0.18, distance: 2.8 };
    } else if (preset === 'zoom') {
      orbitRotationRef.current = { theta: 0.15, phi: 0.1, distance: 1.8 };
    }
  }, []);

  // Set up 3D Humanoid Avatar Hierarchy in Three.js
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 600;
    const height = containerRef.current.clientHeight || 420;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color('#0b1120'); // Dark studio slate

    // Studio Grid Floor
    const gridHelper = new THREE.GridHelper(10, 20, '#334155', '#1e293b');
    gridHelper.position.y = -1.5;
    scene.add(gridHelper);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    cameraRef.current = camera;
    camera.position.set(0, 0.2, 2.8);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight('#ffffff', 0.85);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight('#ffffff', 1.2);
    mainLight.position.set(2, 4, 3);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 1024;
    mainLight.shadow.mapSize.height = 1024;
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight('#38bdf8', 0.6); // Cyan rim light
    fillLight.position.set(-3, 2, -2);
    scene.add(fillLight);

    const warmRimLight = new THREE.DirectionalLight('#indigo', 0.4);
    warmRimLight.position.set(0, -2, -3);
    scene.add(warmRimLight);

    // 5. Construct Modular Articulated Humanoid Avatar Mesh
    const avatarGroup = new THREE.Group();
    avatarGroup.position.y = -0.5;
    scene.add(avatarGroup);

    // Materials
    const skinMaterial = new THREE.MeshStandardMaterial({
      color: '#f8fafc', // Clean avatar skin texture
      roughness: 0.4,
      metalness: 0.1,
    });
    const suitMaterial = new THREE.MeshStandardMaterial({
      color: '#0284c7', // Sky blue studio suit
      roughness: 0.5,
      metalness: 0.2,
    });
    const jointMaterial = new THREE.MeshStandardMaterial({
      color: '#38bdf8', // Glowing cyan joint accents
      roughness: 0.2,
      metalness: 0.8,
    });
    const hairMaterial = new THREE.MeshStandardMaterial({
      color: '#0f172a',
      roughness: 0.7,
    });
    const eyeMaterial = new THREE.MeshBasicMaterial({ color: '#0284c7' });

    // Torso / Chest Group
    const chestGroup = new THREE.Group();
    avatarGroup.add(chestGroup);
    jointsRef.current.chest = chestGroup;

    // Torso Mesh
    const torsoGeo = new THREE.CylinderGeometry(0.32, 0.26, 0.7, 16);
    const torsoMesh = new THREE.Mesh(torsoGeo, suitMaterial);
    torsoMesh.position.y = 0.35;
    torsoMesh.castShadow = true;
    chestGroup.add(torsoMesh);

    // Neck & Head Group
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.7, 0);
    chestGroup.add(headGroup);
    jointsRef.current.head = headGroup;

    // Neck
    const neckGeo = new THREE.CylinderGeometry(0.1, 0.12, 0.15, 12);
    const neckMesh = new THREE.Mesh(neckGeo, skinMaterial);
    neckMesh.position.y = 0.08;
    headGroup.add(neckMesh);

    // Head Mesh
    const headGeo = new THREE.SphereGeometry(0.22, 24, 24);
    headGeo.scale(1, 1.15, 1);
    const headMesh = new THREE.Mesh(headGeo, skinMaterial);
    headMesh.position.y = 0.32;
    headMesh.castShadow = true;
    headGroup.add(headMesh);

    // Hair Cap
    const hairGeo = new THREE.SphereGeometry(0.23, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.5);
    const hairMesh = new THREE.Mesh(hairGeo, hairMaterial);
    hairMesh.position.set(0, 0.35, 0);
    headGroup.add(hairMesh);

    // Eyes
    const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.03, 12, 12), eyeMaterial);
    leftEye.position.set(0.08, 0.34, 0.2);
    headGroup.add(leftEye);

    const rightEye = new THREE.Mesh(new THREE.SphereGeometry(0.03, 12, 12), eyeMaterial);
    rightEye.position.set(-0.08, 0.34, 0.2);
    headGroup.add(rightEye);

    // RIGHT ARM HIERARCHY
    const rShoulderGroup = new THREE.Group();
    rShoulderGroup.position.set(-0.36, 0.65, 0);
    chestGroup.add(rShoulderGroup);
    jointsRef.current.rShoulder = rShoulderGroup;

    const rShoulderJoint = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 12), jointMaterial);
    rShoulderGroup.add(rShoulderJoint);

    const rUpperArmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.45, 12), suitMaterial);
    rUpperArmMesh.position.y = -0.225;
    rUpperArmMesh.castShadow = true;
    rShoulderGroup.add(rUpperArmMesh);

    const rElbowGroup = new THREE.Group();
    rElbowGroup.position.set(0, -0.45, 0);
    rShoulderGroup.add(rElbowGroup);
    jointsRef.current.rElbow = rElbowGroup;

    const rElbowJoint = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 12), jointMaterial);
    rElbowGroup.add(rElbowJoint);

    const rForearmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.42, 12), skinMaterial);
    rForearmMesh.position.y = -0.21;
    rForearmMesh.castShadow = true;
    rElbowGroup.add(rForearmMesh);

    const rWristGroup = new THREE.Group();
    rWristGroup.position.set(0, -0.42, 0);
    rElbowGroup.add(rWristGroup);
    jointsRef.current.rWrist = rWristGroup;

    // Right Hand Palm
    const handGeo = new THREE.BoxGeometry(0.12, 0.14, 0.04);
    const rHandMesh = new THREE.Mesh(handGeo, skinMaterial);
    rHandMesh.position.y = -0.07;
    rHandMesh.castShadow = true;
    rWristGroup.add(rHandMesh);
    jointsRef.current.rHandMesh = rHandMesh;

    // Right Fingers Group
    const rFingersGroup = new THREE.Group();
    rHandMesh.add(rFingersGroup);
    jointsRef.current.rFingersGroup = rFingersGroup;

    // 4 Articulated Fingers for Right Hand
    for (let i = 0; i < 4; i++) {
      const fingerMesh = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.12, 0.022), skinMaterial);
      fingerMesh.position.set(-0.045 + i * 0.03, -0.1, 0);
      rFingersGroup.add(fingerMesh);
    }
    // Thumb
    const rThumbMesh = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.09, 0.025), skinMaterial);
    rThumbMesh.position.set(-0.07, -0.04, 0.02);
    rThumbMesh.rotation.z = -0.5;
    rFingersGroup.add(rThumbMesh);

    // LEFT ARM HIERARCHY
    const lShoulderGroup = new THREE.Group();
    lShoulderGroup.position.set(0.36, 0.65, 0);
    chestGroup.add(lShoulderGroup);
    jointsRef.current.lShoulder = lShoulderGroup;

    const lShoulderJoint = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 12), jointMaterial);
    lShoulderGroup.add(lShoulderJoint);

    const lUpperArmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.45, 12), suitMaterial);
    lUpperArmMesh.position.y = -0.225;
    lUpperArmMesh.castShadow = true;
    lShoulderGroup.add(lUpperArmMesh);

    const lElbowGroup = new THREE.Group();
    lElbowGroup.position.set(0, -0.45, 0);
    lShoulderGroup.add(lElbowGroup);
    jointsRef.current.lElbow = lElbowGroup;

    const lElbowJoint = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 12), jointMaterial);
    lElbowGroup.add(lElbowJoint);

    const lForearmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.42, 12), skinMaterial);
    lForearmMesh.position.y = -0.21;
    lForearmMesh.castShadow = true;
    lElbowGroup.add(lForearmMesh);

    const lWristGroup = new THREE.Group();
    lWristGroup.position.set(0, -0.42, 0);
    lElbowGroup.add(lWristGroup);
    jointsRef.current.lWrist = lWristGroup;

    // Left Hand Palm
    const lHandMesh = new THREE.Mesh(handGeo, skinMaterial);
    lHandMesh.position.y = -0.07;
    lHandMesh.castShadow = true;
    lWristGroup.add(lHandMesh);
    jointsRef.current.lHandMesh = lHandMesh;

    const lFingersGroup = new THREE.Group();
    lHandMesh.add(lFingersGroup);
    jointsRef.current.lFingersGroup = lFingersGroup;

    for (let i = 0; i < 4; i++) {
      const fingerMesh = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.12, 0.022), skinMaterial);
      fingerMesh.position.set(-0.045 + i * 0.03, -0.1, 0);
      lFingersGroup.add(fingerMesh);
    }
    const lThumbMesh = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.09, 0.025), skinMaterial);
    lThumbMesh.position.set(0.07, -0.04, 0.02);
    lThumbMesh.rotation.z = 0.5;
    lFingersGroup.add(lThumbMesh);

    // Initial camera apply
    applyCameraPreset('angle');

    // 6. Animation Frame Loop with FPS Counter & Smooth Pose Lerping
    let animationFrameId: number;
    let lastTime = performance.now();
    let frameCount = 0;
    let fpsTimer = performance.now();

    const animate = (now: number) => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      frameCount++;
      if (now - fpsTimer >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        fpsTimer = now;
      }

      // Smooth Orbit Camera Interpolation
      const { theta, phi, distance } = orbitRotationRef.current;
      const camX = distance * Math.sin(theta) * Math.cos(phi);
      const camY = distance * Math.sin(phi) + 0.3;
      const camZ = distance * Math.cos(theta) * Math.cos(phi);

      camera.position.x += (camX - camera.position.x) * 0.08;
      camera.position.y += (camY - camera.position.y) * 0.08;
      camera.position.z += (camZ - camera.position.z) * 0.08;
      camera.lookAt(0, 0.2, 0);

      // Lerp Current Pose toward Target Pose
      const lerpFactor = Math.min(1.0, delta * 8.0 * speedMultiplier);
      const curr = currentPoseRef.current;
      const target = targetPoseRef.current;

      const lerp = (a: number, b: number) => a + (b - a) * lerpFactor;

      curr.rShoulderZ = lerp(curr.rShoulderZ, target.rShoulderZ);
      curr.rShoulderY = lerp(curr.rShoulderY, target.rShoulderY);
      curr.rShoulderX = lerp(curr.rShoulderX, target.rShoulderX);
      curr.rElbowZ = lerp(curr.rElbowZ, target.rElbowZ);
      curr.rElbowY = lerp(curr.rElbowY, target.rElbowY);
      curr.rWristZ = lerp(curr.rWristZ, target.rWristZ);
      curr.rWristX = lerp(curr.rWristX, target.rWristX);
      curr.rFingers = lerp(curr.rFingers, target.rFingers);

      curr.lShoulderZ = lerp(curr.lShoulderZ, target.lShoulderZ);
      curr.lShoulderY = lerp(curr.lShoulderY, target.lShoulderY);
      curr.lShoulderX = lerp(curr.lShoulderX, target.lShoulderX);
      curr.lElbowZ = lerp(curr.lElbowZ, target.lElbowZ);
      curr.lElbowY = lerp(curr.lElbowY, target.lElbowY);
      curr.lWristZ = lerp(curr.lWristZ, target.lWristZ);
      curr.lWristX = lerp(curr.lWristX, target.lWristX);
      curr.lFingers = lerp(curr.lFingers, target.lFingers);

      curr.headY = lerp(curr.headY, target.headY);
      curr.headX = lerp(curr.headX, target.headX);
      curr.chestY = lerp(curr.chestY, target.chestY);

      // Subtle natural breathing oscillation
      const breath = Math.sin(now * 0.002) * 0.02;

      // Apply Rotations to Joints
      const j = jointsRef.current;

      if (j.chest) j.chest.rotation.y = curr.chestY;
      if (j.head) {
        j.head.rotation.y = curr.headY;
        j.head.rotation.x = curr.headX + breath * 0.5;
      }

      if (j.rShoulder) {
        j.rShoulder.rotation.z = curr.rShoulderZ;
        j.rShoulder.rotation.y = curr.rShoulderY;
        j.rShoulder.rotation.x = curr.rShoulderX + breath;
      }
      if (j.rElbow) {
        j.rElbow.rotation.z = curr.rElbowZ;
        j.rElbow.rotation.y = curr.rElbowY;
      }
      if (j.rWrist) {
        j.rWrist.rotation.z = curr.rWristZ;
        j.rWrist.rotation.x = curr.rWristX;
      }
      if (j.rFingersGroup) {
        j.rFingersGroup.rotation.x = curr.rFingers * 1.4;
      }

      if (j.lShoulder) {
        j.lShoulder.rotation.z = curr.lShoulderZ;
        j.lShoulder.rotation.y = curr.lShoulderY;
        j.lShoulder.rotation.x = curr.lShoulderX - breath;
      }
      if (j.lElbow) {
        j.lElbow.rotation.z = curr.lElbowZ;
        j.lElbow.rotation.y = curr.lElbowY;
      }
      if (j.lWrist) {
        j.lWrist.rotation.z = curr.lWristZ;
        j.lWrist.rotation.x = curr.lWristX;
      }
      if (j.lFingersGroup) {
        j.lFingersGroup.rotation.x = curr.lFingers * 1.4;
      }

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;
      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [applyCameraPreset, speedMultiplier]);

  // Sequenced Sign Gesture Player Timer Logic
  useEffect(() => {
    if (!isPlaying || glosses.length === 0) {
      targetPoseRef.current = { ...IDLE_POSE };
      return;
    }

    const currentGloss = glosses[currentGlossIndex] || 'HELLO';
    const poseSequence = GLOSS_POSES[currentGloss.toUpperCase()] || GLOSS_POSES.HELLO;

    // Trigger callback when gloss changes
    if (onGlossChange) {
      onGlossChange(currentGloss, currentGlossIndex);
    }

    const frameDuration = (1200 / speedMultiplier) / poseSequence.length;

    const interval = setInterval(() => {
      keyframeIndexRef.current = (keyframeIndexRef.current + 1) % poseSequence.length;
      targetPoseRef.current = poseSequence[keyframeIndexRef.current];

      stepTimerRef.current += 1;
      if (stepTimerRef.current >= poseSequence.length * 2) {
        stepTimerRef.current = 0;
        keyframeIndexRef.current = 0;

        setCurrentGlossIndex((prev) => {
          const nextIndex = (prev + 1) % glosses.length;
          return nextIndex;
        });
      }
    }, frameDuration);

    return () => clearInterval(interval);
  }, [isPlaying, currentGlossIndex, glosses, speedMultiplier, onGlossChange]);

  // Orbit drag handlers for mouse/touch
  const handleMouseDown = (e: React.MouseEvent) => {
    isMouseDownRef.current = true;
    mousePrevRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDownRef.current) return;
    const dx = e.clientX - mousePrevRef.current.x;
    const dy = e.clientY - mousePrevRef.current.y;
    mousePrevRef.current = { x: e.clientX, y: e.clientY };

    orbitRotationRef.current.theta -= dx * 0.008;
    orbitRotationRef.current.phi = Math.max(-0.4, Math.min(0.8, orbitRotationRef.current.phi + dy * 0.008));
  };

  const handleMouseUp = () => {
    isMouseDownRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    orbitRotationRef.current.distance = Math.max(1.2, Math.min(4.5, orbitRotationRef.current.distance + e.deltaY * 0.002));
  };

  const restartPlayback = () => {
    setCurrentGlossIndex(0);
    keyframeIndexRef.current = 0;
    stepTimerRef.current = 0;
    setIsPlaying(true);
  };

  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col ${className}`}>
      {/* Top Header Bar */}
      <div className="bg-slate-950/90 border-b border-slate-800 p-3.5 px-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 font-bold shrink-0">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold font-heading text-white tracking-wide">
                Interactive 3D Avatar Signer
              </h4>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-extrabold px-2 py-0.2 rounded uppercase">
                3D WebGL Rig
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Real-time skeletal sign animation player powered by Three.js
            </p>
          </div>
        </div>

        {/* Status Indicators & FPS */}
        <div className="flex items-center gap-3">
          <span className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg text-slate-400">
            <Activity className="w-3 h-3 text-cyan-400 animate-pulse" />
            <span>{fps} FPS</span>
          </span>

          {/* View Presets */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => applyCameraPreset('front')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                viewPreset === 'front' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
              title="Front View"
            >
              Front
            </button>
            <button
              onClick={() => applyCameraPreset('angle')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                viewPreset === 'angle' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
              title="Angle 3D View"
            >
              3D Angle
            </button>
            <button
              onClick={() => applyCameraPreset('zoom')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                viewPreset === 'zoom' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
              title="Zoom Upper Body"
            >
              Zoom
            </button>
          </div>
        </div>
      </div>

      {/* Main 3D Canvas Container */}
      <div
        id="3d-avatar-canvas"
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        className="relative w-full h-[360px] sm:h-[400px] bg-slate-950 cursor-grab active:cursor-grabbing select-none overflow-hidden"
      >
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* Orbit Hint Overlay */}
        <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md border border-slate-800 text-slate-300 px-2.5 py-1 rounded-lg text-[10px] font-mono flex items-center gap-1.5 pointer-events-none">
          <Eye className="w-3 h-3 text-blue-400" />
          <span>Click & Drag to rotate 3D view</span>
        </div>

        {/* Active Sign Gloss Badge Overlay */}
        <div className="absolute top-3 right-3 bg-blue-950/90 backdrop-blur-md border border-blue-500/50 text-blue-200 px-3 py-1.5 rounded-xl text-xs font-bold font-mono flex items-center gap-2 shadow-xl animate-pulse">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>Signing: [{glosses[currentGlossIndex] || 'REST'}]</span>
        </div>

        {/* Bottom Floating Live Caption Sync Bar */}
        <div className="absolute bottom-3 left-3 right-3 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-3 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1 w-full">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1 font-heading">
              <Volume2 className="w-3 h-3 text-blue-400" />
              Live Sentence & Token Sync
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {glosses.map((gloss, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentGlossIndex(idx);
                    keyframeIndexRef.current = 0;
                    stepTimerRef.current = 0;
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer border ${
                    idx === currentGlossIndex
                      ? 'bg-blue-600 text-white border-blue-400 ring-2 ring-blue-500/50 scale-105 shadow-md'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  [{gloss}]
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar & Speed Switcher */}
      <div className="bg-slate-950 p-3 px-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-white">
        {/* Playback Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs ${
              isPlaying ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isPlaying ? 'Pause Animation' : 'Play 3D Sign'}</span>
          </button>

          <button
            onClick={restartPlayback}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all cursor-pointer"
            title="Restart Sign Sequence"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Speed Multipliers */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1 font-heading">
            <FastForward className="w-3.5 h-3.5 text-blue-400" />
            Speed:
          </span>
          {[0.5, 1.0, 1.5].map((spd) => (
            <button
              key={spd}
              onClick={() => setSpeedMultiplier(spd)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer border ${
                speedMultiplier === spd
                  ? 'bg-blue-600 text-white border-blue-400'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
