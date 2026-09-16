// ©️ Mewn — Neo-Brutalism RoomView
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRoomContext } from './hooks/use-room-context';
import { InvitePanel } from './components/InvitePanel';
import { CameraPreview } from '../media/CameraPreview';
import { useWebRTC, RemoteVideo } from '../webrtc';
import { useCapture, FilterSelector } from '../capture';
import { PhotoEditor } from '../capture/PhotoEditor';
import { buildPolaroid } from '../capture/polaroid';
import { playTick, playShutter } from '../capture/sounds';
import { copyImageToClipboard, shareImage } from '../capture/share';
import { canvasFilterFor, PHOTO_FILTERS } from '../capture/filters';
import { SeasonalSelector } from '../capture/SeasonalSelector';
import { SeasonalFrameId } from '../capture/seasonal';
import { PromptCard, DoodleOverlay, StickerOverlay } from '../capture/CreativeExtras';

export const RoomView: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const {
    currentRoom,
    currentParticipantId,
    joinRoom,
    loading,
    error,
    leaveRoom,
    socket,
  } = useRoomContext();
  const [cameraError, setCameraError] = useState<{ code: string; message: string } | null>(null);
  const [webrtcError, setWebRTCError] = useState<{ code: string; message: string } | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [networkStatus, setNetworkStatus] = useState<'connected' | 'disconnected' | 'reconnecting'>('connected');

  const isConnected = currentRoom?.status === 'connected' && (currentRoom?.participants.length ?? 0) === 2;
  const isWaiting = currentRoom?.status === 'waiting' || (currentRoom?.participants.length ?? 0) < 2;
  const otherParticipantLabel = currentParticipantId === 'A' ? 'Participant B' : 'Participant A';

  const { remoteStream, connectionState, error: webrtcHookError, createOffer, cleanup } = useWebRTC(
    socket,
    currentRoom?.id || null,
    currentParticipantId,
    localStream
  );

  const {
    state: captureState,
    countdown,
    composedImage,
    error: captureError,
    filter,
    setFilter,
    durationSec,
    setDurationSec,
    burstCount,
    setBurstCount,
    burstPlan,
    burstImages,
    collageImage,
    createCollage,
    startCapture,
    retake,
    cleanupCapture,
  } = useCapture(
    socket,
    currentRoom?.id || null,
    currentParticipantId,
    localStream
  );

  useEffect(() => {
    if (roomId) {
      joinRoom(roomId).catch(() => {
        navigate('/', { replace: true });
      });
    }
  }, [roomId, joinRoom, navigate]);

  useEffect(() => {
    if (webrtcHookError) {
      setWebRTCError({ code: webrtcHookError.code, message: webrtcHookError.message });
    }
  }, [webrtcHookError]);

  useEffect(() => {
    if (!socket) return;
    const onDisconnect = (_reason: string) => { setNetworkStatus('disconnected'); };
    const onReconnect = (_attemptNumber: number) => { setNetworkStatus('reconnecting'); };
    const onReconnectAttempt = (_attemptNumber: number) => { void 0; };
    const onReconnectFailed = () => { setNetworkStatus('disconnected'); };
    const onConnect = () => { setNetworkStatus('connected'); };
    socket.on('disconnect', onDisconnect);
    socket.on('reconnect', onReconnect);
    socket.on('reconnect_attempt', onReconnectAttempt);
    socket.on('reconnect_failed', onReconnectFailed);
    socket.on('connect', onConnect);
    setNetworkStatus(socket.connected ? 'connected' : 'disconnected');
    return () => {
      socket.off('disconnect', onDisconnect);
      socket.off('reconnect', onReconnect);
      socket.off('reconnect_attempt', onReconnectAttempt);
      socket.off('reconnect_failed', onReconnectFailed);
      socket.off('connect', onConnect);
    };
  }, [socket]);

  useEffect(() => {
    if (isConnected && localStream) {
      createOffer().catch((err: unknown) => { console.error('[RoomView] Failed to create offer:', err); });
    }
  }, [isConnected, localStream, createOffer]);

  useEffect(() => {
    return () => { cleanup(); cleanupCapture(); };
  }, [cleanup, cleanupCapture]);

  const handleStreamReady = (stream: MediaStream) => { setLocalStream(stream); };
  const handleLeave = () => { leaveRoom(); navigate('/', { replace: true }); };

  const [galleryIndex, setGalleryIndex] = useState(0);
  const selectedGalleryIndex = burstImages.length === 0 ? 0 : Math.min(galleryIndex, burstImages.length - 1);
  const [collageChoice, setCollageChoice] = useState<'strip' | 'grid'>('strip');
  const [editingSrc, setEditingSrc] = useState<string | null>(null);
  const [editingTarget, setEditingTarget] = useState<'single' | 'burst' | 'collage' | null>(null);
  const [editedSingle, setEditedSingle] = useState<string | null>(null);
  const [editedBurst, setEditedBurst] = useState<Record<number, string>>({});
  const [editedCollage, setEditedCollage] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [flash, setFlash] = useState(false);
  useEffect(() => {
    if (captureState === 'capturing') {
      if (soundEnabled) playShutter();
      if (hapticEnabled && 'vibrate' in navigator) (navigator as unknown as { vibrate: (p: number[]) => void }).vibrate?.([30, 40, 80]);
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 280);
      return () => clearTimeout(t);
    }
  }, [captureState, soundEnabled, hapticEnabled]);

  const handleRetakeAll = () => {
    setGalleryIndex(0);
    setEditedSingle(null);
    setEditedBurst({});
    setEditedCollage(null);
    setPolaroidSingle(null);
    setPolaroidBurst(null);
    retake();
  };

  const displaySingle = editedSingle ?? composedImage;
  const displayBurstSrc = editedBurst[selectedGalleryIndex] ?? burstImages[selectedGalleryIndex];
  const displayCollage = editedCollage ?? collageImage;

  const [polaroidSingle, setPolaroidSingle] = useState<string | null>(null);
  const [polaroidBurst, setPolaroidBurst] = useState<string | null>(null);
  const [polaroidCaption, setPolaroidCaption] = useState('Candid · brutal');
  const [seasonalFrame, setSeasonalFrame] = useState<SeasonalFrameId>('none');
  const [showPrompt, setShowPrompt] = useState(false);
  const [promptEnabled, setPromptEnabled] = useState(false);
  const [bgBlur, setBgBlur] = useState(false);
  const [doubleExposure, setDoubleExposure] = useState(false);
  const [washiColor, setWashiColor] = useState('#FFD60A');
  const [boomerang, setBoomerang] = useState(false);
  const [clipUrl, setClipUrl] = useState<string | null>(null);
  const [doodleTarget, setDoodleTarget] = useState<string | null>(null);
  const [stickerTarget, setStickerTarget] = useState<string | null>(null);

  const doStartCapture = () => {
    if (boomerang && localStream) {
      try {
        const rec = new MediaRecorder(localStream, { mimeType: 'video/webm' });
        const chunks: Blob[] = [];
        rec.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };
        rec.onstop = () => { const blob = new Blob(chunks, { type: 'video/webm' }); setClipUrl(URL.createObjectURL(blob)); };
        rec.start(); setTimeout(()=>{ if (rec.state==='recording') rec.stop(); }, 3000);
      } catch {}
    }
    startCapture();
  };
  const handleStartCapture = () => {
    if (promptEnabled && !showPrompt) { setShowPrompt(true); return; }
    setShowPrompt(false);
    doStartCapture();
  };

  const [shareNote, setShareNote] = useState<string | null>(null);
  const [roomIdCopied, setRoomIdCopied] = useState(false);
  const flashNote = (msg: string) => { setShareNote(msg); setTimeout(() => setShareNote(null), 2200); };
  const copyText = async (text: string): Promise<boolean> => {
    try {
      if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(text); return true; }
      throw new Error('clipboard unavailable');
    } catch {
      try {
        const ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly',''); ta.style.position='fixed'; ta.style.opacity='0';
        document.body.appendChild(ta); ta.select(); ta.setSelectionRange(0, ta.value.length);
        const ok = document.execCommand('copy'); document.body.removeChild(ta); return ok;
      } catch { return false; }
    }
  };

  const getCaptureStateLabel = (state: string) => {
    switch (state) {
      case 'idle': return 'READY';
      case 'preparing': return 'PREPARING…';
      case 'countdown': return `CAPTURE IN ${countdown}…`;
      case 'capturing': return 'CAPTURING…';
      case 'composing': return 'COMPOSING…';
      case 'result': return 'COMPLETE';
      case 'gallery': return 'PICK YOUR FAVORITE';
      default: return state.toUpperCase();
    }
  };

  const countdownDisplay = countdown !== null && countdown > 0 ? countdown : null;
  const waitingRoomId = isWaiting ? currentRoom?.id ?? null : null;
  const burstProgress = burstPlan && burstPlan.total > 1 ? `Shot ${Math.min(burstPlan.index, burstPlan.total)} of ${burstPlan.total}` : null;

  const prevCountdownRef = useRef<number | null>(null);
  useEffect(() => {
    if (captureState === 'countdown' && countdownDisplay !== null && countdownDisplay !== prevCountdownRef.current) {
      prevCountdownRef.current = countdownDisplay;
      if (countdownDisplay > 0) {
        if (soundEnabled) playTick();
        if (hapticEnabled && 'vibrate' in navigator) (navigator as unknown as { vibrate: (p: number) => void }).vibrate?.(18);
      }
    }
    if (captureState !== 'countdown') prevCountdownRef.current = null;
  }, [captureState, countdownDisplay, soundEnabled, hapticEnabled]);

  if (!roomId) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center p-6">
        <div className="bg-paper border-4 border-ink shadow-brutal p-8 text-center">
          <div className="w-12 h-12 border-4 border-ink border-t-transparent animate-spin mx-auto" />
          <p className="mt-4 font-mono font-black uppercase tracking-widest text-sm">Connecting…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center p-6">
        <div className="bg-paper border-4 border-ink shadow-brutal p-6 sm:p-8 text-center max-w-md w-full">
          <div className="w-12 h-12 bg-brutal-red border-4 border-ink mx-auto flex items-center justify-center font-black text-white text-xl">!</div>
          <h2 className="mt-4 font-black uppercase tracking-tighter text-xl">Connection Error</h2>
          <p className="mt-2 font-mono text-sm font-bold">{error}</p>
          <button onClick={() => navigate('/', { replace: true })} className="mt-6 w-full py-3 bg-brutal-yellow border-4 border-ink font-black uppercase tracking-widest shadow-brutal-sm">Back to Home</button>
        </div>
      </div>
    );
  }

  if (!currentRoom) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center p-6">
        <div className="bg-paper border-4 border-ink shadow-brutal p-8 text-center">
          <div className="w-12 h-12 border-4 border-ink border-t-transparent animate-spin mx-auto" />
          <p className="mt-4 font-mono font-black uppercase tracking-widest text-sm">Loading room…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <div className="h-[8px] w-full bg-ink" />
      {flash && <div className="fixed inset-0 bg-white z-50 pointer-events-none" style={{ animation: 'flash 220ms ease-out' }} aria-hidden="true" />}

      {/* Header — brutal */}
      <header className="w-full max-w-4xl mx-auto px-4 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h1 className="font-black uppercase tracking-tighter text-xl sm:text-2xl flex flex-wrap items-center gap-2">
            Room: <span className="px-2 py-1 bg-brutal-yellow border-3 border-ink font-mono text-lg">{currentRoom?.id}</span>
          </h1>
          <p className="mt-1 font-mono text-xs font-black uppercase tracking-widest">You: <span className="px-1.5 py-0.5 bg-ink text-paper border-2 border-ink">{currentParticipantId}</span></p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1.5 border-3 border-ink font-mono text-xs font-black uppercase tracking-widest flex items-center gap-1.5 ${networkStatus==='connected' ? 'bg-brutal-lime' : networkStatus==='reconnecting' ? 'bg-brutal-yellow' : 'bg-brutal-red text-white'}`}>
            <span className={`w-2 h-2 border border-ink ${networkStatus==='connected' ? 'bg-ink' : 'bg-paper animate-pulse'}`} />{networkStatus}
          </span>
          <button onClick={handleLeave} className="px-4 py-1.5 bg-paper border-3 border-ink font-black uppercase text-xs tracking-widest shadow-[4px_4px_0px_#0A0A0A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#0A0A0A]">Leave</button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-6">
        <div className="bg-paper border-4 border-ink shadow-brutal overflow-hidden">
          {isWaiting && (
            <div className="p-6 sm:p-8 text-center">
              <div className="w-16 h-16 bg-brutal-yellow border-4 border-ink shadow-brutal-sm mx-auto flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0" /></svg>
              </div>
              <h2 className="mt-4 font-black uppercase tracking-tighter text-2xl">Waiting for Partner…</h2>
              <p className="mt-2 font-mono text-xs font-bold uppercase tracking-widest text-ink/60 max-w-md mx-auto">Share the code or link — booth unlocks when 2 are in.</p>

              <div className="mt-6 max-w-md mx-auto bg-paper border-4 border-ink shadow-brutal-sm p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] font-black uppercase tracking-widest">Room ID</span>
                  <button onClick={async () => { const ok = await copyText(currentRoom?.id ?? ''); if (ok) { setRoomIdCopied(true); setTimeout(()=>setRoomIdCopied(false),2000);} else flashNote('Copy failed — select manually');}} className={`px-3 py-1.5 border-3 border-ink font-black uppercase text-xs tracking-widest ${roomIdCopied ? 'bg-brutal-lime' : 'bg-brutal-yellow'}`} aria-live="polite">
                    {roomIdCopied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <code className="mt-2 block w-full px-3 py-3 bg-ink text-paper font-mono font-black tracking-widest text-center text-lg border-3 border-ink select-all break-all">{currentRoom?.id}</code>
                {shareNote && <p className="mt-2 font-mono text-xs font-bold uppercase text-center" aria-live="polite">{shareNote}</p>}
              </div>

              <InvitePanel roomId={waitingRoomId} />

              <div className="mt-6 flex items-center justify-center gap-4 font-mono text-xs font-black uppercase tracking-widest">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-brutal-yellow border-2 border-ink" /> A</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-brutal-cobalt border-2 border-ink" /> B</span>
              </div>
            </div>
          )}

          {isConnected && (
            <div className="p-4 sm:p-6 space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brutal-lime border-3 border-ink font-mono text-xs font-black uppercase tracking-widest">
                  <span className="w-2 h-2 bg-ink border border-ink" /> Both connected
                </div>
                <h2 className="mt-3 font-black uppercase tracking-tighter text-xl">Cameras Ready</h2>
                <div className="mt-2 flex items-center justify-center gap-2 font-mono text-[11px] font-black uppercase tracking-widest">
                  <span className="px-2 py-1 bg-brutal-yellow border-3 border-ink">WebRTC Live</span>
                  <span className="px-2 py-1 bg-paper border-3 border-ink">P2P Encrypted</span>
                </div>
                {showPrompt && <div className="mt-4"><PromptCard onDismiss={() => { setShowPrompt(false); doStartCapture(); }} /></div>}
                {captureState !== 'idle' && captureState !== 'gallery' && (
                  <div className="mt-4 p-3 bg-brutal-yellow border-4 border-ink shadow-brutal-sm">
                    <p className="font-black uppercase tracking-widest text-sm">{getCaptureStateLabel(captureState)}</p>
                    {burstProgress && <p className="font-mono text-xs font-bold uppercase mt-1">{burstProgress}</p>}
                    {countdownDisplay !== null && <p className="font-black text-5xl sm:text-6xl leading-none mt-2" style={{ WebkitTextStroke: '2px #0A0A0A' }}>{countdownDisplay}</p>}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <CameraPreview onError={setCameraError} onStreamReady={handleStreamReady} filterStyle={canvasFilterFor(filter)} filterId={filter} bgBlur={bgBlur} />
                <RemoteVideo stream={remoteStream} participantLabel={otherParticipantLabel} connectionState={connectionState} />
              </div>
              {bgBlur && <p className="font-mono text-[11px] font-black uppercase tracking-widest text-center bg-brutal-yellow border-3 border-ink inline-block px-2 py-1 mx-auto block w-fit">Cozy blur bg — EXTRA</p>}
              {clipUrl && (
                <div className="max-w-md mx-auto p-3 bg-paper border-4 border-ink shadow-brutal-sm text-center">
                  <p className="font-mono text-xs font-black uppercase tracking-widest">Boomerang clip — 3s EXTRA</p>
                  <video src={clipUrl} autoPlay loop muted playsInline className="w-full mt-2 border-3 border-ink" />
                  <a href={clipUrl} download={`candid-clip-${Date.now()}.webm`} className="mt-2 inline-block px-4 py-2 bg-ink text-paper border-3 border-ink font-black uppercase text-xs tracking-widest">Download clip</a>
                </div>
              )}
              {filter !== 'natural' && (
                <div className="flex items-center justify-center gap-2 px-3 py-2 bg-brutal-yellow border-3 border-ink w-fit mx-auto font-mono text-xs font-black uppercase tracking-widest">
                  <span className="w-3 h-3 border-2 border-ink" style={{ background: PHOTO_FILTERS.find(f=>f.id===filter)?.swatch as string || '#000' }} />
                  Preview: {filter} — warm live filter active
                </div>
              )}

              {captureState === 'result' && composedImage && (
                <div className="space-y-4 border-t-4 border-ink pt-6">
                  <h3 className="font-black uppercase tracking-tighter text-xl text-center">Your Candid Photo</h3>
                  <div className="relative w-full max-w-lg mx-auto aspect-square bg-ink border-4 border-ink shadow-brutal overflow-hidden">
                    <img src={displaySingle!} alt="Your Candid photo" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-lg mx-auto">
                    <button onClick={() => { setPolaroidSingle(null); retake(); }} className="flex-1 py-3 bg-paper border-4 border-ink font-black uppercase tracking-widest text-sm shadow-brutal-sm">↻ Retake</button>
                    <button onClick={() => { setEditingSrc(displaySingle!); setEditingTarget('single'); }} className="flex-1 py-3 bg-paper border-4 border-ink font-black uppercase tracking-widest text-sm">✎ Edit</button>
                    <a href={displaySingle!} download="candid-photo.jpg" className="flex-1 py-3 bg-brutal-lime border-4 border-ink font-black uppercase tracking-widest text-sm shadow-brutal-sm flex items-center justify-center gap-2">↓ Download</a>
                  </div>
                  <div className="flex gap-2 justify-center">
                    <button onClick={async () => { const r = await shareImage(displaySingle!, 'candid-photo.jpg', 'Candid'); flashNote(r==='shared'?'Shared ✓':r==='copied'?'Copied ✓':'Download instead');}} className="px-4 py-2 bg-paper border-3 border-ink font-black uppercase text-xs tracking-widest">Share</button>
                    <button onClick={async () => { const ok = await copyImageToClipboard(displaySingle!); flashNote(ok?'Copied ✓':'Copy failed');}} className="px-4 py-2 bg-paper border-3 border-ink font-black uppercase text-xs tracking-widest">Copy image</button>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center pt-3 border-t-4 border-ink">
                    <button onClick={()=>setDoodleTarget(displaySingle!)} className="px-3 py-1.5 bg-brutal-yellow border-3 border-ink font-black uppercase text-xs tracking-widest">✏️ Doodle EXTRA</button>
                    <button onClick={()=>setStickerTarget(displaySingle!)} className="px-3 py-1.5 bg-brutal-cobalt text-white border-3 border-ink font-black uppercase text-xs tracking-widest">⭐ Stickers EXTRA</button>
                    <button onClick={async ()=>{ const img = new Image(); img.src = displaySingle!; await new Promise(r=>img.onload=r); const c=document.createElement('canvas'); c.width=img.width; c.height=img.height; const ctx=c.getContext('2d')!; ctx.drawImage(img,0,0); ctx.globalAlpha=0.45; ctx.save(); ctx.scale(-1,1); ctx.drawImage(img, -c.width,0,c.width,c.height); ctx.restore(); const url=c.toDataURL('image/jpeg',0.92); setEditedSingle(url); flashNote('Double exposure applied — EXTRA');}} className="px-3 py-1.5 bg-ink text-paper border-3 border-ink font-black uppercase text-xs tracking-widest">Double exposure EXTRA</button>
                    <span className="flex items-center gap-1 font-mono text-xs font-black uppercase">Washi<span style={{background:washiColor}} className="w-4 h-4 border-2 border-ink inline-block" /></span>
                  </div>
                  {shareNote && <p className="font-mono text-xs font-black uppercase text-center">{shareNote}</p>}
                  <div className="pt-4 border-t-4 border-ink space-y-3">
                    <p className="font-mono text-xs font-black uppercase tracking-widest text-center">Polaroid — wabi strip {seasonalFrame!=='none' ? `· ${seasonalFrame}`:''} <span className="normal-case">({washiColor})</span> — EXTRA</p>
                    <input value={polaroidCaption} onChange={(e) => setPolaroidCaption(e.target.value)} placeholder="Caption" maxLength={24} className="w-full px-3 py-3 bg-paper border-4 border-ink font-mono font-black uppercase tracking-widest text-center placeholder:text-ink/40" />
                    <button onClick={async () => { const p = await buildPolaroid(displaySingle!, polaroidCaption || 'Candid · brutal', seasonalFrame); setPolaroidSingle(p); }} className="w-full py-3 bg-brutal-yellow border-4 border-ink font-black uppercase tracking-widest shadow-brutal-sm">Make Polaroid {seasonalFrame !== 'none' ? `· ${seasonalFrame}` : ''}</button>
                    {polaroidSingle && (
                      <div className="space-y-3">
                        <div className="w-full max-w-sm mx-auto border-4 border-ink shadow-brutal bg-white overflow-hidden"><img src={polaroidSingle} alt="Polaroid preview" className="w-full h-auto" /></div>
                        <a href={polaroidSingle} download="candid-polaroid.jpg" className="w-full py-3 bg-brutal-lime border-4 border-ink font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-brutal-sm">↓ Download Polaroid</a>
                        <div className="flex gap-2 justify-center">
                          <button onClick={async () => { const r = await shareImage(polaroidSingle!, 'candid-polaroid.jpg', 'Candid polaroid'); flashNote(r==='shared'?'Shared ✓':r==='copied'?'Copied ✓':'Download instead');}} className="px-3 py-2 bg-paper border-3 border-ink font-black uppercase text-xs">Share</button>
                          <button onClick={async () => { const ok = await copyImageToClipboard(polaroidSingle!); flashNote(ok?'Copied ✓':'Copy failed');}} className="px-3 py-2 bg-paper border-3 border-ink font-black uppercase text-xs">Copy</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {captureState === 'gallery' && burstImages.length > 0 && (
                <div className="space-y-4 border-t-4 border-ink pt-6">
                  <h3 className="font-black uppercase tracking-tighter text-xl text-center">Pick Your Favorite</h3>
                  <div className="relative w-full max-w-lg mx-auto aspect-square bg-ink border-4 border-ink shadow-brutal overflow-hidden">
                    <img src={displayBurstSrc} alt={`Burst shot ${selectedGalleryIndex + 1}`} className="w-full h-full object-cover" />
                  </div>
                  <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto" role="radiogroup" aria-label="Burst shots">
                    {burstImages.map((img, i) => (
                      <button key={i} type="button" role="radio" aria-checked={i===selectedGalleryIndex} aria-label={`Shot ${i+1}`} onClick={() => setGalleryIndex(i)} className={`aspect-square border-4 overflow-hidden ${i===selectedGalleryIndex ? 'border-ink shadow-brutal-sm scale-[1.02]' : 'border-ink/30 hover:border-ink'}`}>
                        <img src={img} alt="" aria-hidden="true" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-lg mx-auto">
                    <button onClick={handleRetakeAll} className="flex-1 py-3 bg-paper border-4 border-ink font-black uppercase tracking-widest text-sm">↻ New burst</button>
                    <button onClick={() => { setEditingSrc(displayBurstSrc); setEditingTarget('burst'); }} className="flex-1 py-3 bg-paper border-4 border-ink font-black uppercase tracking-widest text-sm">✎ Edit</button>
                    <a href={displayBurstSrc} download={`candid-burst-${selectedGalleryIndex + 1}.jpg`} className="flex-1 py-3 bg-brutal-lime border-4 border-ink font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 shadow-brutal-sm">↓ Download</a>
                  </div>
                  <div className="flex gap-2 justify-center">
                    <button onClick={async () => { const r = await shareImage(displayBurstSrc, `candid-burst-${selectedGalleryIndex + 1}.jpg`, 'Candid burst'); flashNote(r==='shared'?'Shared ✓':r==='copied'?'Copied ✓':'Download instead');}} className="px-3 py-2 bg-paper border-3 border-ink font-black uppercase text-xs">Share</button>
                    <button onClick={async () => { const ok = await copyImageToClipboard(displayBurstSrc); flashNote(ok?'Copied ✓':'Copy failed');}} className="px-3 py-2 bg-paper border-3 border-ink font-black uppercase text-xs">Copy</button>
                  </div>

                  <div className="pt-4 border-t-4 border-ink space-y-3">
                    <p className="font-mono text-xs font-black uppercase tracking-widest text-center">Polaroid — single pick — EXTRA</p>
                    <input value={polaroidCaption} onChange={(e) => setPolaroidCaption(e.target.value)} placeholder="Caption" maxLength={24} className="w-full px-3 py-3 bg-paper border-4 border-ink font-mono font-black uppercase text-center" />
                    <button onClick={async () => { const p = await buildPolaroid(displayBurstSrc, polaroidCaption || 'Candid · brutal', seasonalFrame); setPolaroidBurst(p); }} className="w-full py-3 bg-brutal-yellow border-4 border-ink font-black uppercase tracking-widest shadow-brutal-sm">Make Polaroid {seasonalFrame !== 'none' ? `· ${seasonalFrame}` : ''}</button>
                    {polaroidBurst && (
                      <div className="space-y-3">
                        <div className="w-full max-w-sm mx-auto border-4 border-ink shadow-brutal bg-white"><img src={polaroidBurst} alt="Polaroid preview" className="w-full h-auto" /></div>
                        <a href={polaroidBurst} download="candid-polaroid-burst.jpg" className="w-full py-3 bg-brutal-lime border-4 border-ink font-black uppercase flex items-center justify-center gap-2">↓ Download Polaroid</a>
                      </div>
                    )}
                  </div>

                  <div className="pt-6 border-t-4 border-ink space-y-4">
                    <h4 className="font-black uppercase tracking-tighter text-center">Make a Collage</h4>
                    <p className="font-mono text-xs font-bold uppercase tracking-widest text-center">Combine all {burstImages.length} shots — strip or grid</p>
                    <div className="flex items-center justify-center gap-2" role="radiogroup" aria-label="Collage layout">
                      {(['strip','grid'] as const).map((layout) => (
                        <button key={layout} type="button" role="radio" aria-checked={collageChoice===layout} onClick={() => setCollageChoice(layout)} className={`px-4 py-2 border-3 border-ink font-black uppercase text-xs tracking-widest ${collageChoice===layout ? 'bg-brutal-yellow shadow-[4px_4px_0px_#0A0A0A]' : 'bg-paper'}`}>{layout}</button>
                      ))}
                    </div>
                    <button onClick={() => createCollage(collageChoice, seasonalFrame)} className="w-full max-w-lg mx-auto py-3 bg-ink text-paper border-4 border-ink font-black uppercase tracking-widest shadow-brutal-sm flex items-center justify-center gap-2">
                      Create Collage — {collageChoice === 'strip' ? 'Strip' : 'Grid'} {seasonalFrame !== 'none' ? `· ${seasonalFrame}` : ''}
                    </button>
                    {collageImage && (
                      <div className="space-y-4">
                        <div className="w-full max-w-lg mx-auto border-4 border-ink shadow-brutal bg-white"><img src={displayCollage!} alt={`Collage — ${collageChoice}`} className="w-full h-auto" /></div>
                        <div className="flex gap-3 max-w-lg mx-auto">
                          <button onClick={() => { setEditingSrc(displayCollage!); setEditingTarget('collage'); }} className="flex-1 py-3 bg-paper border-4 border-ink font-black uppercase text-xs">✎ Edit collage</button>
                          <a href={displayCollage!} download={`candid-collage-${collageChoice}.jpg`} className="flex-1 py-3 bg-brutal-lime border-4 border-ink font-black uppercase flex items-center justify-center gap-2">↓ Download</a>
                        </div>
                        <div className="flex gap-2 justify-center max-w-lg mx-auto">
                          <button onClick={async () => { const r = await shareImage(displayCollage!, `candid-collage-${collageChoice}.jpg`, 'Candid collage'); flashNote(r==='shared'?'Shared ✓':r==='copied'?'Copied ✓':'Download instead');}} className="px-3 py-2 bg-paper border-3 border-ink font-black uppercase text-xs">Share collage</button>
                          <button onClick={async () => { const ok = await copyImageToClipboard(displayCollage!); flashNote(ok?'Copied ✓':'Copy failed');}} className="px-3 py-2 bg-paper border-3 border-ink font-black uppercase text-xs">Copy</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {burstImages.length > 0 && captureState !== 'gallery' && captureState !== 'idle' && captureState !== 'result' && (
                <div className="text-center font-mono text-xs font-black uppercase tracking-widest border-3 border-ink bg-brutal-yellow inline-block px-3 py-1 mx-auto block w-fit">
                  Burst: {burstImages.length}/{burstCount} — collage after {burstCount} shots
                </div>
              )}

              {burstImages.length > 1 && captureState === 'result' && (
                <div className="pt-6 border-t-4 border-ink space-y-4">
                  <h4 className="font-black uppercase text-center">Make a Collage</h4>
                  <p className="font-mono text-xs font-bold uppercase text-center">{burstImages.length} shots — finish burst or create now</p>
                  <div className="flex items-center justify-center gap-2">
                    {(['strip','grid'] as const).map((layout) => (
                      <button key={layout} type="button" onClick={() => setCollageChoice(layout)} className={`px-4 py-2 border-3 border-ink font-black uppercase text-xs ${collageChoice===layout ? 'bg-brutal-yellow' : 'bg-paper'}`}>{layout}</button>
                    ))}
                  </div>
                  <button onClick={() => createCollage(collageChoice, seasonalFrame)} className="w-full max-w-lg mx-auto py-3 bg-ink text-paper border-4 border-ink font-black uppercase">Create Collage — {collageChoice} {seasonalFrame !== 'none' ? `· ${seasonalFrame}` : ''}</button>
                  {collageImage && <div className="w-full max-w-lg mx-auto border-4 border-ink shadow-brutal bg-white"><img src={collageImage} alt="Collage preview" className="w-full h-auto" /></div>}
                </div>
              )}

              {cameraError && (
                <div className="p-3 bg-brutal-red border-4 border-ink text-white" role="alert">
                  <p className="font-black uppercase text-xs tracking-widest">Camera Error</p>
                  <p className="font-mono text-xs font-bold mt-1">{cameraError!.message}</p>
                </div>
              )}
              {webrtcError && (
                <div className="p-3 bg-brutal-yellow border-4 border-ink" role="alert">
                  <p className="font-black uppercase text-xs tracking-widest">Connection Issue</p>
                  <p className="font-mono text-xs font-bold mt-1">{webrtcError!.message}</p>
                </div>
              )}
              {captureError && (
                <div className="p-3 bg-brutal-red border-4 border-ink text-white" role="alert">
                  <p className="font-black uppercase text-xs tracking-widest">Capture Error</p>
                  <p className="font-mono text-xs font-bold mt-1">{captureError!.message}</p>
                </div>
              )}

              {captureState === 'idle' && (
                <div className="space-y-4 border-t-4 border-ink pt-6">
                  <FilterSelector selected={filter} onSelect={setFilter} />
                  <SeasonalSelector selected={seasonalFrame} onSelect={setSeasonalFrame} />

                  <div className="bg-paper border-4 border-ink shadow-brutal p-4">
                    <p className="font-black uppercase tracking-widest text-xs text-center">Creative extras — optional</p>
                    <div className="mt-3 grid grid-cols-2 gap-2 font-mono text-xs font-black uppercase tracking-widest">
                      <label className="flex items-center gap-2 p-2 bg-paper border-3 border-ink cursor-pointer hover:bg-brutal-yellow"><input type="checkbox" checked={promptEnabled} onChange={e=>setPromptEnabled(e.target.checked)} className="accent-ink w-4 h-4" /> Prompt card</label>
                      <label className="flex items-center gap-2 p-2 bg-paper border-3 border-ink cursor-pointer hover:bg-brutal-yellow"><input type="checkbox" checked={bgBlur} onChange={e=>setBgBlur(e.target.checked)} className="accent-ink w-4 h-4" /> Cozy blur bg</label>
                      <label className="flex items-center gap-2 p-2 bg-paper border-3 border-ink cursor-pointer hover:bg-brutal-yellow"><input type="checkbox" checked={doubleExposure} onChange={e=>setDoubleExposure(e.target.checked)} className="accent-ink w-4 h-4" /> Double exposure</label>
                      <label className="flex items-center gap-2 p-2 bg-paper border-3 border-ink cursor-pointer hover:bg-brutal-yellow"><input type="checkbox" checked={boomerang} onChange={e=>setBoomerang(e.target.checked)} className="accent-ink w-4 h-4" /> Boomerang clip</label>
                      <label className="flex items-center gap-2 p-2 bg-paper border-3 border-ink cursor-pointer hover:bg-brutal-yellow"><input type="checkbox" checked={soundEnabled} onChange={e=>setSoundEnabled(e.target.checked)} className="accent-ink w-4 h-4" /> Shutter sounds</label>
                      <label className="flex items-center gap-2 p-2 bg-paper border-3 border-ink cursor-pointer hover:bg-brutal-yellow"><input type="checkbox" checked={hapticEnabled} onChange={e=>setHapticEnabled(e.target.checked)} className="accent-ink w-4 h-4" /> Haptic</label>
                    </div>
                    <div className="mt-3 flex items-center gap-2 font-mono text-[11px] font-black uppercase tracking-widest">
                      <span>Washi</span>
                      {['#FFD60A','#0A84FF','#FF3B30','#30D158','#FFFDF9'].map(c=>(
                        <button key={c} onClick={()=>setWashiColor(c)} className={`w-6 h-6 border-3 border-ink ${washiColor===c?'ring-2 ring-ink ring-offset-2':''}`} style={{background:c}} aria-label={c} />
                      ))}
                    </div>
                    <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-center mt-2 text-ink/60">All extras opt-in</p>
                  </div>

                  <div>
                    <p className="font-mono text-xs font-black uppercase tracking-widest text-center mb-2">Shots</p>
                    <div className="flex items-center justify-center gap-2" role="radiogroup" aria-label="Number of shots">
                      {[{count:1,label:'Single'},{count:3,label:'Burst ×3'}].map((option) => {
                        const active = option.count === burstCount;
                        return (
                          <button key={option.count} type="button" role="radio" aria-checked={active} onClick={() => setBurstCount(option.count)} className={`px-4 py-2 border-3 border-ink font-black uppercase text-xs tracking-widest ${active ? 'bg-brutal-yellow shadow-[4px_4px_0px_#0A0A0A]' : 'bg-paper hover:bg-ink hover:text-paper'}`}>{option.label}</button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <p className="font-mono text-xs font-black uppercase tracking-widest text-center mb-2">Countdown</p>
                    <div className="flex items-center justify-center gap-2" role="radiogroup" aria-label="Countdown length">
                      {[3,5,10].map((seconds) => {
                        const active = seconds === durationSec;
                        return (
                          <button key={seconds} type="button" role="radio" aria-checked={active} onClick={() => setDurationSec(seconds)} className={`px-4 py-2 border-3 border-ink font-black uppercase text-xs tracking-widest ${active ? 'bg-ink text-paper shadow-[4px_4px_0px_#0A0A0A]' : 'bg-paper hover:bg-brutal-yellow'}`}>{seconds}s</button>
                        );
                      })}
                    </div>
                  </div>

                  <button onClick={handleStartCapture} disabled={!localStream} className="w-full py-4 bg-brutal-yellow border-4 border-ink font-black uppercase tracking-widest text-sm shadow-brutal hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_#0A0A0A] active:scale-[0.97] disabled:opacity-50 disabled:shadow-brutal flex items-center justify-center gap-2" aria-disabled={!localStream}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /></svg>
                    Start Capture {promptEnabled ? '(extra: prompt)' : ''}
                  </button>
                  {promptEnabled && <p className="font-mono text-[11px] font-black uppercase tracking-widest text-center">Prompt will show before countdown — EXTRA</p>}
                </div>
              )}

              <div className="pt-4 border-t-4 border-ink flex items-center justify-center gap-4 font-mono text-xs font-black uppercase tracking-widest">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-brutal-yellow border-2 border-ink" /> A</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-ink border-2 border-ink" /> B</span>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="max-w-4xl w-full mx-auto px-4 pb-6 text-center">
        <p className="inline-block px-3 py-1 bg-ink text-paper font-mono text-xs font-black uppercase tracking-widest border-2 border-ink">©️ Mewn</p>
      </footer>

      {editingSrc && <PhotoEditor src={editingSrc} onClose={() => { setEditingSrc(null); setEditingTarget(null); }} onSave={(edited) => { if (editingTarget==='single') setEditedSingle(edited); else if (editingTarget==='burst') setEditedBurst((prev)=>({ ...prev, [selectedGalleryIndex]: edited })); else if (editingTarget==='collage') setEditedCollage(edited); }} />}
      {doodleTarget && <DoodleOverlay src={doodleTarget} onClose={()=>setDoodleTarget(null)} onSave={(url)=>{ setEditedSingle(url); setDoodleTarget(null); }} />}
      {stickerTarget && <StickerOverlay src={stickerTarget} onClose={()=>setStickerTarget(null)} onSave={(url)=>{ setEditedSingle(url); setStickerTarget(null); }} />}
    </div>
  );
};
