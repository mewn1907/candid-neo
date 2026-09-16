// ©️ Mewn — Neo-Brutalism RemoteVideo
import React from 'react';

interface RemoteVideoProps {
  stream: MediaStream | null;
  participantLabel: string;
  connectionState: string;
  className?: string;
  filterStyle?: string;
  filterId?: string;
}

export const RemoteVideo: React.FC<RemoteVideoProps> = ({
  stream,
  participantLabel,
  connectionState,
  className = '',
  filterStyle,
  filterId,
}) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(() => {});
    } else if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, [stream]);

  const isConnected = connectionState === 'connected';
  const [showGrid, setShowGrid] = React.useState(false);

  return (
    <div className={`relative w-full aspect-video bg-ink border-4 border-ink shadow-brutal overflow-hidden ${className}`}>
      <video ref={videoRef} className="w-full h-full object-cover" style={{ filter: filterStyle || undefined, transition: 'filter 220ms ease' }} autoPlay playsInline muted />
      {stream && filterId && filterId !== 'natural' && filterId !== 'none' && (
        <div className="absolute top-2 right-2 px-2 py-1 bg-ink text-paper border-2 border-paper font-mono text-[10px] font-black uppercase tracking-widest" aria-live="polite">
          {filterId} · Live
        </div>
      )}
      {showGrid && stream && (
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
      {!stream && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-paper">
          <div className="w-16 h-16 bg-ink text-paper border-4 border-ink shadow-brutal-sm flex items-center justify-center">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
          </div>
          <p className="mt-3 font-black uppercase tracking-tighter text-sm">{participantLabel}</p>
          <p className="mt-1 font-mono text-xs font-bold uppercase tracking-widest text-ink/60">Waiting for connection…</p>
        </div>
      )}
      <div className="absolute bottom-0 inset-x-0 bg-paper border-t-4 border-ink flex items-center justify-between px-2 py-2">
        <span className="px-2 py-1 bg-ink text-paper border-2 border-ink font-mono text-[11px] font-black uppercase tracking-widest flex items-center gap-1.5">
          <span className={`w-2 h-2 border border-ink ${isConnected ? 'bg-brutal-lime' : 'bg-brutal-yellow animate-pulse'}`} />{participantLabel}
        </span>
        <div className="flex items-center gap-1.5">
          {stream && (
            <button onClick={() => setShowGrid(v=>!v)} className={`w-8 h-8 border-3 border-ink font-black text-xs flex items-center justify-center ${showGrid ? 'bg-brutal-yellow' : 'bg-paper'}`} aria-pressed={showGrid} aria-label="Toggle grid">#</button>
          )}
          {isConnected && <span className="px-2 py-1 bg-brutal-lime border-3 border-ink font-mono text-[10px] font-black uppercase">Live</span>}
        </div>
      </div>
    </div>
  );
};
