// ©️ Mewn — Neo-Brutalism CameraPreview
import React, { useRef, useEffect, useState } from 'react';
import { useCamera } from './hooks/use-camera';

interface CameraPreviewProps {
  onError?: (error: { code: string; message: string }) => void;
  onStreamReady?: (stream: MediaStream) => void;
  filterStyle?: string;
  filterId?: string;
  bgBlur?: boolean;
}

export const CameraPreview: React.FC<CameraPreviewProps> = ({ onError, onStreamReady, filterStyle, filterId, bgBlur }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const {
    stream,
    error,
    loading,
    facingMode,
    start,
    stop,
    switchCamera,
    clearError,
    attachVideo,
    retryWithPermission,
  } = useCamera();

  useEffect(() => { attachVideo(videoRef.current); }, [attachVideo]);
  useEffect(() => { if (stream && onStreamReady) onStreamReady(stream); }, [stream, onStreamReady]);
  useEffect(() => { if (error && onError) onError(error); }, [error, onError]);

  const handleStart = async () => { clearError(); try { await start(); } catch {} };
  const handleRetry = async () => { clearError(); try { await retryWithPermission(); } catch {} };
  const handleStop = () => { stop(); };
  const handleSwitchCamera = async () => { clearError(); try { await switchCamera(); } catch {} };

  const getErrorMessage = (error: { code: string; message: string }) => {
    switch (error.code) {
      case 'PERMISSION_DENIED': return 'Camera access denied. Allow camera in address bar, then Retry.';
      case 'CAMERA_UNAVAILABLE': return 'No camera found. Connect a camera and try again.';
      case 'CAMERA_IN_USE': return 'Camera in use by another app.';
      case 'UNSUPPORTED_BROWSER': return 'Browser does not support camera. Use Chrome/Firefox/Safari.';
      case 'STREAM_STOPPED': return 'Camera stream stopped unexpectedly.';
      case 'DEVICE_DISCONNECTED': return 'Camera disconnected.';
      default: return error.message;
    }
  };

  const showPermissionDenied = error?.code === 'PERMISSION_DENIED';
  const [showGrid, setShowGrid] = useState(false);
  const [mirrored, setMirrored] = useState(true);
  const [exposureHint, setExposureHint] = useState<string | null>(null);

  useEffect(() => { setMirrored(facingMode === 'user'); }, [facingMode]);

  const normalizedFilterId = filterId === 'none' ? 'natural' : filterId;
  const effectiveFilter = [filterStyle, bgBlur ? 'blur(6px)' : ''].filter(Boolean).join(' ') || undefined;
  const isFiltered = !!normalizedFilterId && normalizedFilterId !== 'natural';

  useEffect(() => {
    if (!stream || !videoRef.current) { setExposureHint(null); return; }
    const video = videoRef.current;
    let raf = 0; let lastSample = 0;
    const sample = () => {
      const now = Date.now();
      if (now - lastSample > 1500 && video.videoWidth > 0) {
        lastSample = now;
        try {
          const c = document.createElement('canvas'); const w = 32, h = 18; c.width = w; c.height = h;
          const ctx = c.getContext('2d');
          if (ctx) {
            ctx.drawImage(video, 0, 0, w, h);
            const data = ctx.getImageData(0, 0, w, h).data; let sum = 0;
            for (let i = 0; i < data.length; i += 4) sum += 0.2126*data[i] + 0.7152*data[i+1] + 0.0722*data[i+2];
            const avg = sum / (w*h);
            if (avg < 55) setExposureHint('DIM — MORE LIGHT');
            else if (avg > 185) setExposureHint('BRIGHT — SOFTEN');
            else setExposureHint('BALANCED');
          }
        } catch {}
      }
      raf = requestAnimationFrame(sample);
    };
    raf = requestAnimationFrame(sample);
    return () => cancelAnimationFrame(raf);
  }, [stream]);

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Hard brutal frame */}
      <div className="relative aspect-video bg-ink border-4 border-ink shadow-brutal overflow-hidden">
        {stream ? (
          <>
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              style={{
                transform: mirrored ? 'scaleX(-1)' : undefined,
                filter: effectiveFilter,
                transition: 'filter 220ms ease',
                willChange: effectiveFilter ? 'filter' : undefined,
              }}
              autoPlay
              playsInline
              muted
            />
            {/* Yellow lab label — brutal */}
            <div className="absolute top-2 left-2 px-2 py-1 bg-brutal-yellow border-3 border-ink font-mono text-[11px] font-black uppercase tracking-widest shadow-[3px_3px_0px_#0A0A0A]">
              ● {facingMode === 'user' ? 'FRONT' : 'BACK'} · {exposureHint ?? 'LIVE'}
            </div>
            {isFiltered ? (
              <div className="absolute top-2 right-2 px-2 py-1 bg-ink text-paper border-2 border-paper font-mono text-[10px] font-black uppercase tracking-widest">
                {normalizedFilterId} · Live preview
              </div>
            ) : (
              <div className="absolute top-2 right-2 px-2 py-1 bg-paper text-ink border-2 border-ink font-mono text-[10px] font-black uppercase tracking-widest">
                None · Live preview
              </div>
            )}
            {showGrid && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
                  <div className="border-r-2 border-white/40" /><div className="border-r-2 border-white/40" /><div />
                  <div className="border-r-2 border-t-2 border-white/40" /><div className="border-r-2 border-t-2 border-white/40" /><div className="border-t-2 border-white/40" />
                  <div className="border-r-2 border-t-2 border-white/40" /><div className="border-r-2 border-t-2 border-white/40" /><div className="border-t-2 border-white/40" />
                </div>
                <div className="absolute left-1/2 top-[10%] bottom-[10%] w-px bg-brutal-yellow -translate-x-1/2" />
                <div className="absolute top-1/2 left-[10%] right-[10%] h-px bg-brutal-yellow -translate-y-1/2" />
              </div>
            )}
            {/* Bottom control bar — brutal */}
            <div className="absolute bottom-0 inset-x-0 bg-paper border-t-4 border-ink flex items-center justify-between px-2 py-2 gap-2">
              <span className="px-2 py-1 bg-ink text-paper font-mono text-[11px] font-black uppercase tracking-widest border-2 border-ink flex items-center gap-1.5">
                <span className="w-2 h-2 bg-brutal-lime border border-ink" /> {facingMode === 'user' ? 'FRONT' : 'BACK'}
              </span>
              <div className="flex items-center gap-1.5">
                <button onClick={() => setShowGrid(v=>!v)} aria-pressed={showGrid} aria-label="Toggle grid" className={`w-8 h-8 border-3 border-ink flex items-center justify-center font-black text-xs ${showGrid ? 'bg-brutal-yellow' : 'bg-paper hover:bg-ink hover:text-paper'}`}>#</button>
                <button onClick={() => setMirrored(v=>!v)} aria-pressed={mirrored} aria-label="Toggle mirror" className={`w-8 h-8 border-3 border-ink flex items-center justify-center ${mirrored ? 'bg-ink text-paper' : 'bg-paper'}`}>⇄</button>
                <button onClick={handleSwitchCamera} disabled={loading} aria-label="Switch camera" className="w-8 h-8 bg-paper border-3 border-ink flex items-center justify-center disabled:opacity-50">↻</button>
                <button onClick={handleStop} className="px-3 py-1.5 bg-brutal-red text-white border-3 border-ink font-black uppercase text-xs tracking-widest">Stop</button>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-paper">
            <div className="w-16 h-16 bg-ink text-paper border-4 border-ink shadow-brutal-sm flex items-center justify-center">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /></svg>
            </div>
            <h3 className="mt-4 font-black uppercase tracking-tighter text-sm">Camera Preview</h3>
            <p className="mt-1 font-mono text-xs font-bold uppercase tracking-widest text-ink/60 max-w-xs">Start camera — feed appears here. No storage.</p>
            <button onClick={handleStart} disabled={loading} className="mt-4 w-full max-w-xs py-3 bg-brutal-yellow border-4 border-ink font-black uppercase tracking-widest text-sm shadow-brutal-sm active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#0A0A0A] disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <><span className="w-4 h-4 border-3 border-ink border-t-transparent animate-spin" /> Starting…</> : 'Start Camera →'}
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-3 p-3 bg-brutal-red border-4 border-ink shadow-brutal-sm text-white" role="alert">
          <p className="font-black uppercase text-xs tracking-widest">Camera Error</p>
          <p className="mt-1 font-mono text-xs font-bold leading-relaxed">{getErrorMessage(error)}</p>
          {showPermissionDenied ? (
            <button onClick={handleRetry} disabled={loading} className="mt-3 w-full py-2 bg-paper text-ink border-3 border-ink font-black uppercase text-xs tracking-widest">Retry with Permission →</button>
          ) : (
            <button onClick={handleStart} className="mt-2 font-mono text-xs font-black uppercase underline decoration-2">Try again</button>
          )}
        </div>
      )}
    </div>
  );
};
