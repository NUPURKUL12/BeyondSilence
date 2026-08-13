import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sparkles, Maximize2, RotateCcw } from 'lucide-react';

interface Avatar3DCanvasProps {
  className?: string;
}

export const Avatar3DCanvas: React.FC<Avatar3DCanvasProps> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // --- 1. SCENE SETUP ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0f172a, 0.08);

    // --- 2. CAMERA SETUP ---
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 300;
    const camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 100);
    camera.position.set(0, 1.15, 3.8);
    camera.lookAt(0, 1.0, 0);

    // --- 3. RENDERER SETUP ---
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    container.appendChild(renderer.domElement);

    // --- 4. LIGHTING ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    // Key Light (Main soft light from top-right)
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(2.5, 4, 3);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0001;
    scene.add(keyLight);

    // Fill Light (Cool blue tint from left)
    const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.9);
    fillLight.position.set(-3, 2, 2);
    scene.add(fillLight);

    // Rim / Backlight (Cyan/Teal edge highlight from behind)
    const rimLight = new THREE.DirectionalLight(0x2dd4bf, 2.2);
    rimLight.position.set(0, 3, -3);
    scene.add(rimLight);

    // Bottom Stage Glow
    const stageLight = new THREE.PointLight(0x3b82f6, 2, 4);
    stageLight.position.set(0, 0.1, 0.5);
    scene.add(stageLight);

    // --- 5. MATERIALS ---
    const skinMaterial = new THREE.MeshStandardMaterial({
      color: 0xf5a882, // Warm peach skin tone
      roughness: 0.55,
      metalness: 0.05,
    });

    const hairMaterial = new THREE.MeshStandardMaterial({
      color: 0x271910, // Dark espresso brown
      roughness: 0.4,
      metalness: 0.1,
    });

    const jacketMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e3a8a, // Deep indigo blue jacket
      roughness: 0.35,
      metalness: 0.1,
    });

    const jacketAccentMaterial = new THREE.MeshStandardMaterial({
      color: 0x14b8a6, // Teal accent zipper/collar
      roughness: 0.2,
      metalness: 0.4,
    });

    const shirtMaterial = new THREE.MeshStandardMaterial({
      color: 0xf8fafc, // Off-white graphic tee
      roughness: 0.7,
      metalness: 0.0,
    });

    const pantsMaterial = new THREE.MeshStandardMaterial({
      color: 0x334155, // Slate grey modern trousers
      roughness: 0.6,
      metalness: 0.1,
    });

    const shoeMaterial = new THREE.MeshStandardMaterial({
      color: 0x0f172a, // Dark sneaker body
      roughness: 0.3,
      metalness: 0.2,
    });

    const shoeSoleMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff, // White sole
      roughness: 0.2,
    });

    const eyeWhiteMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.1,
    });

    const eyeIrisMaterial = new THREE.MeshStandardMaterial({
      color: 0x0ea5e9, // Bright vibrant blue eyes
      roughness: 0.1,
      metalness: 0.3,
    });

    const eyePupilMaterial = new THREE.MeshBasicMaterial({
      color: 0x0f172a,
    });

    const eyelidMaterial = skinMaterial;

    // --- 6. STAGE & PEDESTAL ---
    const stageGroup = new THREE.Group();
    
    // Base Disc
    const floorGeo = new THREE.CylinderGeometry(1.2, 1.3, 0.08, 64);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.2,
      metalness: 0.8,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.position.y = -0.04;
    floorMesh.receiveShadow = true;
    stageGroup.add(floorMesh);

    // Glowing Pedestal Ring
    const ringGeo = new THREE.RingGeometry(1.1, 1.18, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.y = 0.001;
    stageGroup.add(ringMesh);

    scene.add(stageGroup);

    // --- 7. CHARACTER BUILDER ---
    const characterGroup = new THREE.Group();
    characterGroup.position.set(0, 0, 0);

    // Root Nodes for Animation
    const rootNode = new THREE.Group();
    characterGroup.add(rootNode);

    const spineNode = new THREE.Group();
    spineNode.position.set(0, 0.85, 0);
    rootNode.add(spineNode);

    const chestNode = new THREE.Group();
    chestNode.position.set(0, 0.35, 0);
    spineNode.add(chestNode);

    const headNode = new THREE.Group();
    headNode.position.set(0, 0.45, 0);
    chestNode.add(headNode);

    // --- A. LEGS & FEET ---
    const leftThigh = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.075, 0.42, 16), pantsMaterial);
    leftThigh.position.set(-0.16, 0.65, 0);
    leftThigh.castShadow = true;
    rootNode.add(leftThigh);

    const leftShin = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.065, 0.42, 16), pantsMaterial);
    leftShin.position.set(-0.16, 0.25, 0);
    leftShin.castShadow = true;
    rootNode.add(leftShin);

    const leftShoe = new THREE.Group();
    leftShoe.position.set(-0.16, 0.04, 0.05);
    const shoeBodyL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.24), shoeMaterial);
    shoeBodyL.castShadow = true;
    const shoeSoleL = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.03, 0.25), shoeSoleMaterial);
    shoeSoleL.position.y = -0.035;
    leftShoe.add(shoeBodyL, shoeSoleL);
    rootNode.add(leftShoe);

    const rightThigh = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.075, 0.42, 16), pantsMaterial);
    rightThigh.position.set(0.16, 0.65, 0);
    rightThigh.castShadow = true;
    rootNode.add(rightThigh);

    const rightShin = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.065, 0.42, 16), pantsMaterial);
    rightShin.position.set(0.16, 0.25, 0);
    rightShin.castShadow = true;
    rootNode.add(rightShin);

    const rightShoe = new THREE.Group();
    rightShoe.position.set(0.16, 0.04, 0.05);
    const shoeBodyR = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.24), shoeMaterial);
    shoeBodyR.castShadow = true;
    const shoeSoleR = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.03, 0.25), shoeSoleMaterial);
    shoeSoleR.position.y = -0.035;
    rightShoe.add(shoeBodyR, shoeSoleR);
    rootNode.add(rightShoe);

    // --- B. TORSO & JACKET ---
    // Inner Shirt
    const shirtMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.16, 0.4, 24), shirtMaterial);
    shirtMesh.position.y = 0.15;
    shirtMesh.castShadow = true;
    chestNode.add(shirtMesh);

    // Jacket Outer Body
    const jacketMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.2, 0.44, 24, 1, false, Math.PI * 0.15, Math.PI * 1.7),
      jacketMaterial
    );
    jacketMesh.position.y = 0.15;
    jacketMesh.castShadow = true;
    chestNode.add(jacketMesh);

    // Zipper Trim
    const zipperL = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.42, 0.02), jacketAccentMaterial);
    zipperL.position.set(-0.06, 0.15, 0.19);
    const zipperR = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.42, 0.02), jacketAccentMaterial);
    zipperR.position.set(0.06, 0.15, 0.19);
    chestNode.add(zipperL, zipperR);

    // Hoodie Collar
    const collarMesh = new THREE.Mesh(
      new THREE.TorusGeometry(0.15, 0.04, 16, 32, Math.PI * 1.4),
      jacketMaterial
    );
    collarMesh.rotation.x = Math.PI / 2;
    collarMesh.rotation.z = -Math.PI * 0.2;
    collarMesh.position.set(0, 0.35, 0);
    chestNode.add(collarMesh);

    // --- C. ARMS, HANDS & 5 ARTICULATED FINGERS ---
    // Helper to create detailed 5-fingered hand
    const createHand = (isLeft: boolean) => {
      const handGroup = new THREE.Group();

      // Palm
      const palmMesh = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.02, 0.08), skinMaterial);
      palmMesh.position.set(0, 0, 0.04);
      palmMesh.castShadow = true;
      handGroup.add(palmMesh);

      // 5 Fingers (Thumb, Index, Middle, Ring, Pinky)
      const fingerNames = ['thumb', 'index', 'middle', 'ring', 'pinky'];
      const fingerOffsets = [
        { x: isLeft ? 0.045 : -0.045, z: 0.02, rotY: isLeft ? 0.6 : -0.6, len: 0.035 }, // Thumb
        { x: isLeft ? 0.025 : -0.025, z: 0.085, rotY: 0, len: 0.04 },  // Index
        { x: isLeft ? 0.008 : -0.008, z: 0.09, rotY: 0, len: 0.043 }, // Middle
        { x: isLeft ? -0.01 : 0.01, z: 0.085, rotY: 0, len: 0.039 },  // Ring
        { x: isLeft ? -0.028 : 0.028, z: 0.075, rotY: 0, len: 0.032 },// Pinky
      ];

      const fingerNodeMap: Record<string, THREE.Group[]> = {};

      fingerNames.forEach((name, idx) => {
        const config = fingerOffsets[idx];
        const fBase = new THREE.Group();
        fBase.position.set(config.x, 0, config.z);
        fBase.rotation.y = config.rotY;

        // Proximal Phalanx
        const pMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.007, config.len, 8), skinMaterial);
        pMesh.rotation.x = Math.PI / 2;
        pMesh.position.z = config.len / 2;
        pMesh.castShadow = true;
        fBase.add(pMesh);

        // Distal Joint
        const fTip = new THREE.Group();
        fTip.position.z = config.len;

        const dMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.0065, 0.005, config.len * 0.8, 8), skinMaterial);
        dMesh.rotation.x = Math.PI / 2;
        dMesh.position.z = (config.len * 0.8) / 2;
        dMesh.castShadow = true;
        fTip.add(dMesh);

        fBase.add(fTip);
        handGroup.add(fBase);

        fingerNodeMap[name] = [fBase, fTip];
      });

      return { handGroup, fingerNodeMap };
    };

    // Left Arm
    const leftShoulderNode = new THREE.Group();
    leftShoulderNode.position.set(-0.25, 0.32, 0);
    chestNode.add(leftShoulderNode);

    const leftUpperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.055, 0.28, 16), jacketMaterial);
    leftUpperArm.position.set(-0.04, -0.14, 0);
    leftUpperArm.rotation.z = 0.2;
    leftUpperArm.castShadow = true;
    leftShoulderNode.add(leftUpperArm);

    const leftElbowNode = new THREE.Group();
    leftElbowNode.position.set(-0.08, -0.28, 0);
    leftShoulderNode.add(leftElbowNode);

    const leftForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.045, 0.26, 16), skinMaterial);
    leftForearm.position.set(0, -0.13, 0.05);
    leftForearm.rotation.x = 0.4;
    leftForearm.castShadow = true;
    leftElbowNode.add(leftForearm);

    const { handGroup: leftHandGroup, fingerNodeMap: leftFingers } = createHand(true);
    leftHandGroup.position.set(0, -0.26, 0.1);
    leftHandGroup.rotation.set(0.2, 0.3, -0.2);
    leftElbowNode.add(leftHandGroup);

    // Right Arm
    const rightShoulderNode = new THREE.Group();
    rightShoulderNode.position.set(0.25, 0.32, 0);
    chestNode.add(rightShoulderNode);

    const rightUpperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.055, 0.28, 16), jacketMaterial);
    rightUpperArm.position.set(0.04, -0.14, 0);
    rightUpperArm.rotation.z = -0.2;
    rightUpperArm.castShadow = true;
    rightShoulderNode.add(rightUpperArm);

    const rightElbowNode = new THREE.Group();
    rightElbowNode.position.set(0.08, -0.28, 0);
    rightShoulderNode.add(rightElbowNode);

    const rightForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.045, 0.26, 16), skinMaterial);
    rightForearm.position.set(0, -0.13, 0.05);
    rightForearm.rotation.x = 0.4;
    rightForearm.castShadow = true;
    rightElbowNode.add(rightForearm);

    const { handGroup: rightHandGroup, fingerNodeMap: rightFingers } = createHand(false);
    rightHandGroup.position.set(0, -0.26, 0.1);
    rightHandGroup.rotation.set(0.2, -0.3, 0.2);
    rightElbowNode.add(rightHandGroup);

    // --- D. HEAD, STYLIZED FACE & EYE BLINKING ---
    // Neck
    const neckMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.075, 0.12, 16), skinMaterial);
    neckMesh.position.y = -0.06;
    headNode.add(neckMesh);

    // Head Base (Friendly Pixar-style stylized head shape)
    const headMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 32, 32),
      skinMaterial
    );
    headMesh.scale.set(1, 1.15, 1.05);
    headMesh.castShadow = true;
    headNode.add(headMesh);

    // Hair (Stylized modern haircut)
    const hairGroup = new THREE.Group();
    const hairTop = new THREE.Mesh(new THREE.SphereGeometry(0.19, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.55), hairMaterial);
    hairTop.position.set(0, 0.04, -0.01);
    hairTop.scale.set(1.02, 1.1, 1.05);
    
    // Front Hair Tuft / Bangs
    const tuft1 = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.12, 16), hairMaterial);
    tuft1.rotation.set(0.4, 0.3, -0.6);
    tuft1.position.set(-0.06, 0.18, 0.14);

    const tuft2 = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.11, 16), hairMaterial);
    tuft2.rotation.set(0.3, -0.2, 0.4);
    tuft2.position.set(0.04, 0.19, 0.15);

    hairGroup.add(hairTop, tuft1, tuft2);
    headNode.add(hairGroup);

    // Eyes
    const createEye = (isLeft: boolean) => {
      const eyeGroup = new THREE.Group();
      eyeGroup.position.set(isLeft ? -0.065 : 0.065, 0.03, 0.15);

      // Sclera
      const sclera = new THREE.Mesh(new THREE.SphereGeometry(0.032, 16, 16), eyeWhiteMaterial);
      sclera.scale.set(1.1, 1, 0.6);

      // Iris
      const iris = new THREE.Mesh(new THREE.SphereGeometry(0.018, 16, 16), eyeIrisMaterial);
      iris.position.z = 0.02;

      // Pupil
      const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.009, 16, 16), eyePupilMaterial);
      pupil.position.z = 0.028;

      // Specular Reflection Dot
      const spec = new THREE.Mesh(new THREE.SphereGeometry(0.004, 8, 8), eyeWhiteMaterial);
      spec.position.set(0.006, 0.006, 0.032);

      eyeGroup.add(sclera, iris, pupil, spec);

      // Eyelid for Blinking Animation
      const eyelid = new THREE.Mesh(
        new THREE.SphereGeometry(0.034, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.5),
        eyelidMaterial
      );
      eyelid.rotation.x = -Math.PI * 0.48; // Normal open state
      eyelid.position.z = 0.001;
      eyeGroup.add(eyelid);

      return { eyeGroup, eyelid };
    };

    const { eyeGroup: leftEye, eyelid: leftEyelid } = createEye(true);
    const { eyeGroup: rightEye, eyelid: rightEyelid } = createEye(false);
    headNode.add(leftEye, rightEye);

    // Eyebrows
    const eyebrowMat = new THREE.MeshBasicMaterial({ color: 0x271910 });
    const createEyebrow = (isLeft: boolean) => {
      const brow = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.008, 0.01), eyebrowMat);
      brow.position.set(isLeft ? -0.065 : 0.065, 0.085, 0.165);
      brow.rotation.z = isLeft ? 0.08 : -0.08;
      return brow;
    };
    headNode.add(createEyebrow(true), createEyebrow(false));

    // Nose
    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.018, 12, 12), skinMaterial);
    nose.scale.set(0.8, 1, 1.2);
    nose.position.set(0, 0.005, 0.18);
    headNode.add(nose);

    // Smiling Mouth Arc
    const mouthGeo = new THREE.TorusGeometry(0.032, 0.005, 8, 16, Math.PI * 0.7);
    const mouthMat = new THREE.MeshBasicMaterial({ color: 0x9f1239 }); // Soft rose pink
    const mouth = new THREE.Mesh(mouthGeo, mouthMat);
    mouth.rotation.x = Math.PI * 0.2;
    mouth.rotation.z = Math.PI * 1.15;
    mouth.position.set(0, -0.06, 0.165);
    headNode.add(mouth);

    scene.add(characterGroup);

    setIsLoaded(true);

    // --- 8. ANIMATION LOOP & IDLE BEHAVIOR ---
    let clock = new THREE.Clock();
    let animFrameId: number;
    let blinkTimer = 0;
    let isBlinking = false;
    let blinkProgress = 0;

    // Pointer Parallax / Head Follow Tracking
    const targetLook = { x: 0, y: 0 };
    const currentLook = { x: 0, y: 0 };

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetLook.x = Math.max(-1, Math.min(1, x));
      targetLook.y = Math.max(-1, Math.min(1, y));
    };

    window.addEventListener('mousemove', handlePointerMove);

    const animate = () => {
      animFrameId = requestAnimationFrame(animate);

      const time = clock.getElapsedTime();

      // Smooth camera / head mouse tracking
      currentLook.x += (targetLook.x - currentLook.x) * 0.05;
      currentLook.y += (targetLook.y - currentLook.y) * 0.05;

      // --- A. IDLE BREATHING & BODY MOVEMENTS ---
      // Breathing chest expansion
      chestNode.position.y = 0.35 + Math.sin(time * 2.2) * 0.008;
      chestNode.scale.x = 1 + Math.sin(time * 2.2) * 0.012;
      chestNode.scale.z = 1 + Math.sin(time * 2.2) * 0.015;

      // Subtle shoulder sway
      spineNode.rotation.z = Math.sin(time * 1.2) * 0.015;
      spineNode.rotation.y = Math.sin(time * 0.8) * 0.02;

      // Head micro sway + interactive mouse look
      headNode.rotation.y = currentLook.x * 0.25 + Math.sin(time * 1.5) * 0.03;
      headNode.rotation.x = currentLook.y * 0.15 + Math.sin(time * 2.0) * 0.02;
      headNode.rotation.z = -currentLook.x * 0.05;

      // Arm subtle resting weight bounce
      leftShoulderNode.rotation.x = Math.sin(time * 2.2) * 0.02;
      rightShoulderNode.rotation.x = Math.cos(time * 2.2) * 0.02;

      leftElbowNode.rotation.y = Math.sin(time * 1.8) * 0.03;
      rightElbowNode.rotation.y = -Math.sin(time * 1.8) * 0.03;

      // Subtle finger flex idle motion
      Object.values(leftFingers).forEach(([fBase], i) => {
        fBase.rotation.x = Math.sin(time * 2 + i) * 0.04;
      });
      Object.values(rightFingers).forEach(([fBase], i) => {
        fBase.rotation.x = Math.cos(time * 2 + i) * 0.04;
      });

      // --- B. NATURAL BLINKING CYCLE ---
      blinkTimer += 0.016;
      if (!isBlinking && blinkTimer > 2.8 + Math.random() * 2.5) {
        isBlinking = true;
        blinkProgress = 0;
        blinkTimer = 0;
      }

      if (isBlinking) {
        blinkProgress += 0.12;
        const blinkValue = Math.sin(blinkProgress * Math.PI);
        const lidRot = -Math.PI * 0.48 + blinkValue * (Math.PI * 0.45);
        leftEyelid.rotation.x = lidRot;
        rightEyelid.rotation.x = lidRot;

        if (blinkProgress >= 1) {
          isBlinking = false;
          leftEyelid.rotation.x = -Math.PI * 0.48;
          rightEyelid.rotation.x = -Math.PI * 0.48;
        }
      }

      // Stage pedestal subtle ring pulse
      ringMat.opacity = 0.5 + Math.sin(time * 2) * 0.2;

      renderer.render(scene, camera);
    };

    animate();

    // --- 9. RESIZE OBSERVER ---
    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });

    resizeObserver.observe(container);

    // --- 10. CLEANUP ---
    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('mousemove', handlePointerMove);
      resizeObserver.disconnect();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative w-full h-full min-h-[280px] rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center ${className}`}
    >
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Loading Overlay Spinner */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center gap-3 z-20">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-slate-400 font-medium">Initializing 3D Avatar Stage...</span>
        </div>
      )}

      {/* Top Floating Badge */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-800 text-xs text-slate-200 shadow-md pointer-events-none">
        <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
        <span className="font-semibold text-[11px] tracking-wide">3D Sign Avatar (Idle)</span>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
      </div>

      {/* Bottom Subtle Interaction Hint */}
      {isHovered && (
        <div className="absolute bottom-3 right-3 z-10 px-2.5 py-1 rounded-lg bg-slate-900/70 backdrop-blur-md border border-slate-800 text-[10px] text-slate-400 font-mono pointer-events-none transition-opacity">
          Move cursor to gaze
        </div>
      )}
    </div>
  );
};
