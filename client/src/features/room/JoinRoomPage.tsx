// ©️ Mewn — Neo-Brutalism
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useRoomContext } from './hooks/use-room-context';

export const JoinRoomPage: React.FC = () => {
  const navigate = useNavigate();
  const { roomId: linkRoomId } = useParams<{ roomId?: string }>();
  const { joinRoom, loading, error } = useRoomContext();
  const [roomId, setRoomId] = useState(linkRoomId ?? '');

  function extractRoomId(raw: string): string {
    const trimmed = raw.trim();
    if (!trimmed) return '';
    const m = trimmed.match(/[A-Za-z0-9_-]{10}/g);
    if (m) return m[m.length - 1];
    const noQuery = trimmed.split('?')[0].split('#')[0];
    const segs = noQuery.split('/');
    return (segs[segs.length - 1] || trimmed).trim();
  }

  const join = async (id: string) => {
    const extracted = extractRoomId(id);
    if (!extracted) return;
    try {
      const result = await joinRoom(extracted);
      if (result.success && result.room) navigate(`/room/${result.room.id}`, { replace: true });
    } catch (err) { console.error('Failed to join room:', err); }
  };

  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); await join(roomId); };

  const autoJoinedRef = useRef(false);
  useEffect(() => {
    if (linkRoomId && !autoJoinedRef.current) { autoJoinedRef.current = true; void join(linkRoomId); }
  }, [linkRoomId]);

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <div className="h-[8px] w-full bg-ink" />
      <div className="max-w-md w-full mx-auto px-4 pt-6">
        <Link to="/" className="inline-flex items-center gap-2 px-3 py-2 bg-paper border-3 border-ink font-black uppercase text-xs tracking-widest shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#0A0A0A] transition-all">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-paper border-4 border-ink shadow-brutal p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-ink text-paper border-4 border-ink shadow-brutal-sm mx-auto flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0" /></svg>
            </div>
            <h1 className="mt-4 font-black uppercase tracking-tighter text-2xl sm:text-3xl">Join the Booth</h1>
            <p className="mt-2 font-mono text-xs font-bold uppercase tracking-widest text-ink/60">Paste code · Paste full link · Auto-extract</p>
          </div>

          {error && (
            <div className="p-3 bg-brutal-red border-4 border-ink font-mono text-xs font-black uppercase tracking-widest text-white text-center mb-4 shadow-brutal-sm" role="alert">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="roomId" className="block font-black uppercase tracking-widest text-xs mb-2">10-Character Room Code</label>
              <div className="relative">
                <input
                  id="roomId"
                  type="text"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  onPaste={(e) => { const pasted = e.clipboardData.getData('text'); const extracted = extractRoomId(pasted); if (extracted !== pasted) { e.preventDefault(); setRoomId(extracted); } }}
                  placeholder="k9XzL2qM7p"
                  className="w-full px-4 py-4 bg-paper border-4 border-ink font-mono font-black tracking-widest text-center text-lg uppercase placeholder:text-ink/30 focus:outline-none focus:bg-brutal-yellow/20"
                  maxLength={200}
                  required
                  autoFocus={!linkRoomId}
                  autoComplete="off"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck={false}
                />
              </div>
              <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-ink/50 mt-2 text-center">Paste full invite link — we extract automatically</p>
            </div>

            <button type="submit" disabled={loading || !roomId.trim()} className="w-full py-4 bg-brutal-yellow border-4 border-ink font-black uppercase tracking-widest text-sm shadow-brutal hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_#0A0A0A] active:scale-[0.97] disabled:opacity-50 disabled:translate-x-0 disabled:shadow-brutal transition-all flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <span className="w-5 h-5 border-3 border-ink border-t-transparent animate-spin" />
                  Connecting…
                </>
              ) : (
                'Step Inside →'
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t-4 border-ink flex items-center justify-center gap-2 font-mono text-[11px] font-black uppercase tracking-widest">
            <span className="px-2 py-1 bg-ink text-paper border-2 border-ink">STUN: stun.l.google.com:19302</span>
          </div>
        </div>
      </div>

      <footer className="border-t-4 border-ink bg-paper py-3 text-center font-mono text-xs font-black uppercase tracking-widest">©️ Mewn</footer>
    </div>
  );
};
