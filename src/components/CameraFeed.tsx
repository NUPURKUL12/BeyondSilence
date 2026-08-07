import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, CameraOff, RefreshCw, AlertTriangle, CheckCircle2, FlipHorizontal, Hand, Sparkles, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Hands, HAND_CONNECTIONS, Results } from '@mediapipe/hands';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { recognizeHandGesture, RecognizedGesture, SUPPORTED_ISL_GESTURES } from '../utils/gestureRecognizer';

interface CameraFeedProps {
  title?: string;
  description?: string;
  className?: string;
  autoStart?: boolean;
  onGestureRecognized?: (gesture: RecognizedGesture | null) => void;
}

export const CameraFeed: React.FC<CameraFeedProps> = ({
  title = 'Live Camera Feed',
  description = 'Webcam stream for live sign language monitoring and communication',
  className = '',
  autoStart = false,
  onGestureRecognized,
}) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPermissionDenied, setIsPermissionDenied] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  // Hand tracking state
  const [handDetected, setHandDetected] = useState(false);
  const [handCount, setHandCount] = useState<number>(0);
  const [detectedHandsList, setDetectedHandsList] = useState<string[]>([]);
  const handDetectedRef = useRef(false);

  // ISL Gesture Recognition state
  const [recognizedGesture, setRecognizedGesture] = useState<RecognizedGesture | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const prevGestureIdRef = useRef<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
    setIsLoading(false);
    setHandDetected(false);
    setHandCount(0);
    setDetectedHandsList([]);
    setRecognizedGesture(null);
    prevGestureIdRef.current = null;
    handDetectedRef.current = false;
    if (onGestureRecognized) {
      onGestureRecognized(null);
    }
  }, [onGestureRecognized]);

  const startCamera = useCallback(async () => {
    setIsPermissionDenied(false);
    setErrorMsg(null);
    setIsLoading(true);

    // Ensure previous stream tracks are stopped
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setErrorMsg('Camera access is not supported by your browser environment.');
      setIsLoading(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch((playErr) => {
          console.warn('Auto-play blocked or delayed:', playErr);
        });
      }
      setIsStreaming(true);
    } catch (err: any) {
      console.error('Camera permission or access error:', err);
      let friendlyError = 'Could not access camera. Please check device permissions.';
      let denied = false;

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        denied = true;
        friendlyError = 'Camera access was blocked or denied by your browser permissions.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        friendlyError = 'No webcam hardware detected. Please connect a camera and retry.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        friendlyError = 'Camera is currently in use by another application or tab.';
      } else if (err.message) {
        friendlyError = err.message;
      }

      setIsPermissionDenied(denied);
      setErrorMsg(friendlyError);
      setIsStreaming(false);
    } finally {
      setIsLoading(false);
    }
  }, [facingMode]);

  const toggleFacingMode = () => {
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextMode);
    if (isStreaming) {
      stopCamera();
      setTimeout(() => {
        setFacingMode(nextMode);
      }, 100);
    }
  };

  useEffect(() => {
    if (!isStreaming) return;

    let animationFrameId: number;
    let isProcessing = false;
    let latestResults: Results | null = null;
    
    const prevHandCountRef = { current: 0 };
    const prevLabelsRef = { current: '' };

    let hands: Hands | null = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    hands.onResults((results: Results) => {
      latestResults = results;
      isProcessing = false;
    });

    const renderAndProcess = async () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (video && video.readyState >= 2 && hands) {
        // 1. Dispatch frame to MediaPipe inference asynchronously without blocking UI thread
        if (!isProcessing) {
          isProcessing = true;
          hands.send({ image: video }).catch((err) => {
            console.warn('MediaPipe frame send warning:', err);
            isProcessing = false;
          });
        }

        // 2. Continuous 60fps Canvas Overlay Rendering
        if (canvas) {
          if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
            if (video.videoWidth > 0 && video.videoHeight > 0) {
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;
            }
          }

          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.save();
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (latestResults && latestResults.multiHandLandmarks && latestResults.multiHandLandmarks.length > 0) {
              const numHands = latestResults.multiHandLandmarks.length;
              const handLabels: string[] = [];

              // Draw skeleton and landmarks for both hands
              latestResults.multiHandLandmarks.forEach((landmarks, idx) => {
                const handInfo = latestResults?.multiHandedness?.[idx];
                const label = handInfo?.label || (idx === 0 ? 'Right' : 'Left');
                handLabels.push(label);

                const isRightHand = label.toLowerCase().includes('right') || idx === 0;
                const connectorColor = isRightHand ? '#10B981' : '#8B5CF6';
                const landmarkColor = isRightHand ? '#3B82F6' : '#EC4899';
                const fillColor = isRightHand ? '#60A5FA' : '#F472B6';

                // Draw skeleton connection lines
                drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {
                  color: connectorColor,
                  lineWidth: 3,
                });

                // Draw 21 joint landmark points
                drawLandmarks(ctx, landmarks, {
                  color: landmarkColor,
                  fillColor: fillColor,
                  radius: 4,
                });
              });

              // Guard state updates so React re-renders only on real state changes
              if (!handDetectedRef.current) {
                handDetectedRef.current = true;
                setHandDetected(true);
              }
              if (prevHandCountRef.current !== numHands) {
                prevHandCountRef.current = numHands;
                setHandCount(numHands);
              }
              const labelsJoined = handLabels.join(',');
              if (prevLabelsRef.current !== labelsJoined) {
                prevLabelsRef.current = labelsJoined;
                setDetectedHandsList(handLabels);
              }

              // Phase 3: Evaluate gesture recognition algorithm on landmarks
              const gesture = recognizeHandGesture(latestResults.multiHandLandmarks);
              const gestureId = gesture ? gesture.id : null;
              if (prevGestureIdRef.current !== gestureId) {
                prevGestureIdRef.current = gestureId;
                setRecognizedGesture(gesture);
                if (onGestureRecognized) {
                  onGestureRecognized(gesture);
                }
              }
            } else {
              if (handDetectedRef.current) {
                handDetectedRef.current = false;
                prevHandCountRef.current = 0;
                prevLabelsRef.current = '';
                prevGestureIdRef.current = null;
                setHandDetected(false);
                setHandCount(0);
                setDetectedHandsList([]);
                setRecognizedGesture(null);
                if (onGestureRecognized) {
                  onGestureRecognized(null);
                }
              }
            }

            ctx.restore();
          }
        }
      }

      animationFrameId = requestAnimationFrame(renderAndProcess);
    };

    animationFrameId = requestAnimationFrame(renderAndProcess);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
      }
      if (hands) {
        hands.close();
        hands = null;
      }
    };
  }, [isStreaming]);

  useEffect(() => {
    if (autoStart) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className={`bg-slate-900 text-white rounded-2xl border border-slate-800 overflow-hidden shadow-md space-y-0 ${className}`}>
      {/* Feed Card Header */}
      <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold font-heading text-slate-100 flex items-center gap-2">
            <Camera className="w-4 h-4 text-blue-400" />
            <span>{title}</span>
          </h3>
          {description && (
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">{description}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isStreaming ? (
            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </span>
          ) : (
            <span className="bg-slate-800 text-slate-400 text-[10px] font-medium px-2.5 py-1 rounded-full border border-slate-700">
              Standby
            </span>
          )}
        </div>
      </div>

      {/* Video Stream Stage */}
      <div className="relative w-full h-64 sm:h-80 bg-slate-950 flex items-center justify-center overflow-hidden">
        {/* Video Canvas Element */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            facingMode === 'user' ? 'transform -scale-x-100' : ''
          } ${isStreaming ? 'opacity-100' : 'opacity-0 absolute pointer-events-none'}`}
        />

        {/* MediaPipe Hand Tracking Canvas Overlay */}
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-300 ${
            facingMode === 'user' ? 'transform -scale-x-100' : ''
          } ${isStreaming ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* Loading Spinner View */}
        {isLoading && (
          <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-6 text-center z-10">
            <RefreshCw className="w-8 h-8 text-blue-400 animate-spin mb-2" />
            <span className="text-xs font-bold text-slate-200">Requesting Camera Access...</span>
            <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
              Please click "Allow" when prompted by your browser.
            </p>
          </div>
        )}

        {/* Error Message & Permission Denial Overlay View */}
        {errorMsg && !isLoading && (
          <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center p-5 sm:p-6 text-center z-10 space-y-3 overflow-y-auto">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/30 text-rose-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            
            <div className="space-y-1 max-w-sm">
              <h4 className="text-xs sm:text-sm font-bold text-rose-300 font-heading">
                {isPermissionDenied ? 'Camera Access Blocked' : 'Camera Access Failed'}
              </h4>
              <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed">{errorMsg}</p>
            </div>

            {/* Clear instructions on how to re-enable permissions in browser settings */}
            {isPermissionDenied && (
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-left space-y-1.5 max-w-xs text-[11px] text-slate-300 shadow-inner">
                <span className="font-bold text-amber-400 block font-heading uppercase tracking-wider text-[10px]">
                  How to Re-Enable Permission:
                </span>
                <ol className="list-decimal list-inside space-y-1 text-slate-300 font-medium leading-normal">
                  <li>Click the <strong className="text-white">lock 🔒 or camera icon</strong> in your URL bar.</li>
                  <li>Find <strong className="text-white">Camera</strong> and switch it to <strong className="text-emerald-400">Allow</strong>.</li>
                  <li>Click <strong className="text-blue-400">Retry Permission</strong> below.</li>
                </ol>
              </div>
            )}

            <button
              onClick={startCamera}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Permission</span>
            </button>
          </div>
        )}

        {/* Camera Off / Inactive State View */}
        {!isStreaming && !isLoading && !errorMsg && (
          <div className="flex flex-col items-center justify-center p-6 text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700 text-slate-500 flex items-center justify-center shadow-inner">
              <CameraOff className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-300 font-heading">Camera Feed Inactive</h4>
              <p className="text-[11px] text-slate-400 max-w-xs font-medium">
                Click "Start Camera" below to activate your webcam stream.
              </p>
            </div>
            <button
              onClick={startCamera}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-md hover:scale-102 transition-all cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>Start Camera</span>
            </button>
          </div>
        )}

        {/* Video Overlay Notch / Frame Indicator when streaming */}
        {isStreaming && (
          <>
            <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-emerald-400 pointer-events-none" />
            <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-emerald-400 pointer-events-none" />
            <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-emerald-400 pointer-events-none" />
            <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-emerald-400 pointer-events-none" />
            <div className="absolute top-3 left-3 right-3 flex justify-between items-center pointer-events-none px-2">
              <span className="bg-slate-900/80 backdrop-blur-xs text-emerald-300 text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                WEBCAM READY
              </span>

              {handDetected ? (
                <span className="bg-emerald-950/90 text-emerald-300 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/40 flex items-center gap-1.5 shadow-xs">
                  <Hand className="w-3 h-3 text-emerald-400 animate-pulse" />
                  {handCount === 2
                    ? `BOTH HANDS DETECTED • 42 JOINTS (${detectedHandsList.join(' & ').toUpperCase()})`
                    : `1 HAND DETECTED • 21 JOINTS (${detectedHandsList[0]?.toUpperCase() || 'RIGHT'})`}
                </span>
              ) : (
                <span className="bg-slate-900/80 backdrop-blur-xs text-blue-300 text-[10px] font-mono px-2 py-0.5 rounded border border-blue-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-blue-400 animate-pulse" />
                  SCANNING BOTH HANDS
                </span>
              )}
            </div>

            {/* Recognized Gesture Badge Display */}
            {recognizedGesture && (
              <div
                className={`absolute bottom-4 left-1/2 -translate-x-1/2 backdrop-blur-md shadow-2xl rounded-2xl px-4 py-2.5 flex items-center gap-3 z-20 pointer-events-none transition-all duration-300 animate-pulse-subtle border ${
                  recognizedGesture.category === 'Emergency'
                    ? 'bg-rose-950/95 border-rose-500/80 text-rose-100 shadow-rose-950/50'
                    : recognizedGesture.category === 'Needs'
                    ? 'bg-amber-950/95 border-amber-500/80 text-amber-100 shadow-amber-950/50'
                    : 'bg-slate-900/95 border-emerald-500/80 text-emerald-100 shadow-emerald-950/50'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-2xl shrink-0 border ${
                    recognizedGesture.category === 'Emergency'
                      ? 'bg-rose-500/20 border-rose-400/40'
                      : recognizedGesture.category === 'Needs'
                      ? 'bg-amber-500/20 border-amber-400/40'
                      : 'bg-emerald-500/20 border-emerald-400/40'
                  }`}
                >
                  {recognizedGesture.emoji}
                </div>
                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black tracking-wide uppercase font-heading text-white">
                      ISL Sign: "{recognizedGesture.label}"
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold border ${
                        recognizedGesture.category === 'Emergency'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : recognizedGesture.category === 'Needs'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      }`}
                    >
                      {Math.round(recognizedGesture.confidence * 100)}% Match
                    </span>
                    <span
                      className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded border ${
                        recognizedGesture.category === 'Emergency'
                          ? 'bg-rose-600 text-white border-rose-400'
                          : recognizedGesture.category === 'Needs'
                          ? 'bg-amber-600 text-white border-amber-400'
                          : 'bg-emerald-600 text-white border-emerald-400'
                      }`}
                    >
                      {recognizedGesture.category}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-300 font-medium leading-tight mt-0.5">
                    {recognizedGesture.description}
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Control Bar */}
      <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {isStreaming ? (
            <button
              onClick={stopCamera}
              className="px-3 py-1.5 bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <CameraOff className="w-3.5 h-3.5" />
              <span>Stop Camera</span>
            </button>
          ) : (
            <button
              onClick={startCamera}
              disabled={isLoading}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Start Camera</span>
            </button>
          )}

          {isStreaming && (
            <button
              onClick={toggleFacingMode}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl transition-colors cursor-pointer"
              title="Flip Camera Direction"
            >
              <FlipHorizontal className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => setShowGuide(!showGuide)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border ${
              showGuide
                ? 'bg-blue-900/60 border-blue-500/80 text-blue-200'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
            <span>Gesture Guide ({SUPPORTED_ISL_GESTURES.length} ISL)</span>
            {showGuide ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        <span className="text-[10px] font-mono text-slate-400">
          {isStreaming ? '720p 30fps' : 'Offline'}
        </span>
      </div>

      {/* Collapsible Supported Gestures Guide */}
      {showGuide && (
        <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5 font-heading">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              Supported ISL Gestures Quick Reference ({SUPPORTED_ISL_GESTURES.length})
            </h5>
            <span className="text-[10px] text-slate-400 font-mono">Real-time Rule Engine</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
            {SUPPORTED_ISL_GESTURES.map((item) => (
              <div
                key={item.id}
                className={`p-2 rounded-xl border text-left transition-all ${
                  recognizedGesture?.id === item.id
                    ? 'bg-blue-950/80 border-blue-400 ring-2 ring-blue-500/50 shadow-md scale-105'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-lg">{item.emoji}</span>
                  <span
                    className={`text-[8px] font-extrabold uppercase px-1 py-0.2 rounded border ${
                      item.category === 'Emergency'
                        ? 'bg-rose-950 text-rose-300 border-rose-800'
                        : item.category === 'Needs'
                        ? 'bg-amber-950 text-amber-300 border-amber-800'
                        : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                    }`}
                  >
                    {item.category}
                  </span>
                </div>
                <div className="text-[11px] font-bold text-slate-200 truncate">{item.label}</div>
                <div className="text-[9px] text-slate-400 truncate">{item.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
