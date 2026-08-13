import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, Video, VideoOff, AlertCircle, RefreshCw, CheckCircle2, Sparkles } from 'lucide-react';
import { Hands, Results } from '@mediapipe/hands';
import { recognizeGesture, Point3D } from '../utils/gestureRecognizer';
import { ISLGesture } from '../utils/gestureRegistry';

export type CameraStatus = 'off' | 'ready' | 'active' | 'permission_denied';

interface CameraFeedProps {
  onStatusChange?: (status: CameraStatus) => void;
  onVideoElementReady?: (videoEl: HTMLVideoElement | null) => void;
  onGestureDetected?: (gesture: ISLGesture | null) => void;
  onRecognitionStatusChange?: (statusText: string) => void;
}

export const CameraFeed: React.FC<CameraFeedProps> = ({
  onStatusChange,
  onVideoElementReady,
  onGestureDetected,
  onRecognitionStatusChange,
}) => {
  const [status, setStatus] = useState<CameraStatus>('off');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [recognitionText, setRecognitionText] = useState<string>('Detecting...');
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const handsRef = useRef<Hands | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const lastRecognizedRef = useRef<{ id: string; time: number } | null>(null);

  const updateStatus = useCallback((newStatus: CameraStatus) => {
    setStatus(newStatus);
    onStatusChange?.(newStatus);
  }, [onStatusChange]);

  const updateRecognitionStatus = useCallback((text: string) => {
    setRecognitionText(text);
    onRecognitionStatusChange?.(text);
  }, [onRecognitionStatusChange]);

  const stopCamera = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    onVideoElementReady?.(null);
    setErrorMessage(null);
    updateStatus('off');
    updateRecognitionStatus('Camera off');
  }, [onVideoElementReady, updateStatus, updateRecognitionStatus]);

  // MediaPipe Results Callback
  const handleResults = useCallback((results: Results) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.save();
    ctx.clearRect(0, 0, width, height);

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      // Draw hand landmarks on canvas
      ctx.translate(width, 0);
      ctx.scale(-1, 1);

      const HAND_CONNECTIONS = [
        [0, 1], [1, 2], [2, 3], [3, 4],
        [0, 5], [5, 6], [6, 7], [7, 8],
        [5, 9], [9, 10], [10, 11], [11, 12],
        [9, 13], [13, 14], [14, 15], [15, 16],
        [13, 17], [17, 18], [18, 19], [19, 20], [0, 17]
      ];

      for (const landmarks of results.multiHandLandmarks) {
        ctx.strokeStyle = '#14b8a6';
        ctx.lineWidth = 3;
        for (const [start, end] of HAND_CONNECTIONS) {
          const p1 = landmarks[start];
          const p2 = landmarks[end];
          if (p1 && p2) {
            ctx.beginPath();
            ctx.moveTo(p1.x * width, p1.y * height);
            ctx.lineTo(p2.x * width, p2.y * height);
            ctx.stroke();
          }
        }

        for (const pt of landmarks) {
          ctx.fillStyle = '#2dd4bf';
          ctx.beginPath();
          ctx.arc(pt.x * width, pt.y * height, 5, 0, 2 * Math.PI);
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }
      ctx.restore();

      // Recognize Gesture
      const detected = recognizeGesture(results.multiHandLandmarks as Point3D[][]);
      if (detected) {
        const now = Date.now();
        // Debounce repeated triggers
        if (!lastRecognizedRef.current || lastRecognizedRef.current.id !== detected.id || now - lastRecognizedRef.current.time > 1500) {
          lastRecognizedRef.current = { id: detected.id, time: now };
          onGestureDetected?.(detected);
        }
        updateRecognitionStatus(`Sign recognized: ${detected.englishMeaning}`);
      } else {
        updateRecognitionStatus('Detecting...');
      }
    } else {
      ctx.restore();
      updateRecognitionStatus('Detecting...');
    }
  }, [onGestureDetected, updateRecognitionStatus]);

  // Initialize MediaPipe Hands
  useEffect(() => {
    const hands = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    hands.onResults(handleResults);
    handsRef.current = hands;

    return () => {
      hands.close();
    };
  }, [handleResults]);

  // Frame Processing Loop
  const processFrame = useCallback(async () => {
    if (videoRef.current && videoRef.current.readyState >= 2 && handsRef.current) {
      if (canvasRef.current) {
        if (canvasRef.current.width !== videoRef.current.videoWidth) {
          canvasRef.current.width = videoRef.current.videoWidth || 640;
          canvasRef.current.height = videoRef.current.videoHeight || 480;
        }
      }
      try {
        await handsRef.current.send({ image: videoRef.current });
      } catch (err) {
        console.error('MediaPipe send error:', err);
      }
    }
    if (streamRef.current) {
      animFrameRef.current = requestAnimationFrame(processFrame);
    }
  }, []);

  const startCamera = useCallback(async () => {
    stopCamera();
    setErrorMessage(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Webcam access is not supported in this browser environment.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch((err) => {
            console.error('Video play error:', err);
          });
          updateStatus('active');
          updateRecognitionStatus('Detecting...');
          onVideoElementReady?.(videoRef.current);
          
          // Start Frame Detection Loop
          animFrameRef.current = requestAnimationFrame(processFrame);
        };
      } else {
        updateStatus('ready');
      }
    } catch (err: unknown) {
      console.error('Camera access error:', err);
      const errorStr = err instanceof Error ? err.message : String(err);
      if (
        errorStr.includes('Permission denied') ||
        errorStr.includes('NotAllowedError') ||
        errorStr.includes('PermissionDismissedError')
      ) {
        setErrorMessage('Webcam permission was denied. Please allow camera access in your browser settings.');
        updateStatus('permission_denied');
      } else {
        setErrorMessage(errorStr || 'Unable to access camera.');
        updateStatus('permission_denied');
      }
    }
  }, [stopCamera, updateStatus, updateRecognitionStatus, onVideoElementReady, processFrame]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Top Status Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-100">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 font-heading tracking-tight flex items-center gap-2">
              ISL Camera
            </h2>
            <span className="text-[11px] font-medium text-slate-500">
              Deaf Person → Signing Feed
            </span>
          </div>
        </div>

        {/* Dynamic Status Badge */}
        <div>
          {status === 'active' && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Camera Active</span>
            </div>
          )}

          {status === 'off' && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              <span>Camera Off</span>
            </div>
          )}

          {status === 'ready' && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-[11px] font-bold">
              <CheckCircle2 className="w-3 h-3 text-teal-600" />
              <span>Camera Ready</span>
            </div>
          )}

          {status === 'permission_denied' && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Permission Denied</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Video Viewport Panel */}
      <div className="w-full aspect-[4/3] rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden group-hover:border-slate-700 transition-colors">
        {/* Live HTML5 Video Element */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover transform -scale-x-100 rounded-2xl transition-opacity duration-300 ${
            status === 'active' ? 'opacity-100' : 'opacity-0 absolute pointer-events-none'
          }`}
        />

        {/* MediaPipe Skeleton Canvas Overlay */}
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 w-full h-full object-cover rounded-2xl pointer-events-none z-10 ${
            status === 'active' ? 'block' : 'hidden'
          }`}
        />

        {/* Live Gesture Recognition Status Banner */}
        {status === 'active' && (
          <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-xs font-semibold text-slate-200">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
              <span>{recognitionText}</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">
              15-Sign Recognizer
            </span>
          </div>
        )}

        {/* Viewport Grid Overlay (visible when off/denied) */}
        {status !== 'active' && (
          <div 
            className="absolute inset-0 opacity-[0.08] pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
              backgroundSize: '22px 22px'
            }}
          />
        )}

        {/* Frame Corner Accents */}
        <div className="absolute top-4 left-4 w-5 h-5 border-t-2 border-l-2 border-teal-500/40 rounded-tl-sm pointer-events-none" />
        <div className="absolute top-4 right-4 w-5 h-5 border-t-2 border-r-2 border-teal-500/40 rounded-tr-sm pointer-events-none" />
        <div className="absolute bottom-4 left-4 w-5 h-5 border-b-2 border-l-2 border-teal-500/40 rounded-bl-sm pointer-events-none" />
        <div className="absolute bottom-4 right-4 w-5 h-5 border-b-2 border-r-2 border-teal-500/40 rounded-br-sm pointer-events-none" />

        {/* State Placeholder Overlays */}
        {status === 'off' && (
          <div className="flex flex-col items-center justify-center p-6 text-center z-10">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-teal-400 mb-4 shadow-inner">
              <VideoOff className="w-8 h-8 text-slate-500" />
            </div>
            <p className="text-sm font-bold text-slate-200 font-heading">
              Camera Off
            </p>
            <p className="text-xs text-slate-400 max-w-xs mt-1 leading-relaxed">
              Click 'Start Camera' below to turn on live webcam capture for Indian Sign Language communication.
            </p>
          </div>
        )}

        {status === 'permission_denied' && (
          <div className="flex flex-col items-center justify-center p-6 text-center z-10 max-w-sm">
            <div className="w-16 h-16 rounded-2xl bg-amber-950/60 border border-amber-800/60 flex items-center justify-center text-amber-400 mb-4">
              <AlertCircle className="w-8 h-8 text-amber-400" />
            </div>
            <p className="text-sm font-bold text-amber-200 font-heading">
              Camera Access Denied
            </p>
            <p className="text-xs text-amber-300/80 mt-1 leading-relaxed">
              {errorMessage || 'Webcam permission was blocked. Please grant camera permission in browser settings.'}
            </p>
          </div>
        )}
      </div>

      {/* Camera Control Action Buttons */}
      <div className="flex items-center gap-3 pt-1">
        {status !== 'active' ? (
          <button
            onClick={startCamera}
            className="flex-1 py-2.5 px-4 rounded-2xl bg-teal-600 hover:bg-teal-500 active:scale-[0.99] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Video className="w-4 h-4" />
            <span>Start Camera</span>
          </button>
        ) : (
          <button
            onClick={stopCamera}
            className="flex-1 py-2.5 px-4 rounded-2xl bg-slate-200 hover:bg-slate-300 active:scale-[0.99] text-slate-800 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <VideoOff className="w-4 h-4 text-slate-600" />
            <span>Stop Camera</span>
          </button>
        )}

        {status === 'permission_denied' && (
          <button
            onClick={startCamera}
            className="py-2.5 px-3 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            title="Retry permission"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        )}
      </div>
    </div>
  );
};
