// ©️ Mewn — Neo-Brutalism
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useRoomContext } from './hooks/use-room-context';

export const CreateRoomPage: React.FC = () => {
  const navigate = useNavigate();
  const { createRoom, error, isConnected, apiUrl } = useRoomContext();
  const [attempt, setAttempt] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    if (!isConnected && attempt === 0) return;
    startedRef.current = true;
    let mounted = true;
    createRoom().then((result) => {
      if (mounted && result.success && result.roomId) {
        navigate(`/room/${result.roomId}`, { replace: true });
      }
    });
    return () => { mounted = false; };
  }, [createRoom, navigate, attempt, isConnected]);

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
        <div className="w-full max-w-md bg-paper border-4 border-ink shadow-brutal p-6 sm:p-8 text-center">
          <div className="inline-flex px-3 py-1 bg-brutal-yellow border-3 border-ink font-mono text-xs font-black uppercase tracking-widest">
            Step 1 · Create
          </div>
          <div className="w-16 h-16 border-4 border-ink border-t-transparent rounded-none mx-auto my-6 animate-spin bg-paper shadow-brutal-sm" aria-label="Creating room" />
          <h2 className="font-black uppercase tracking-tighter text-xl sm:text-2xl">Lighting the Booth…</h2>
          <p className="mt-2 font-mono text-xs font-bold uppercase tracking-widest text-ink/70">
            {isConnected ? 'Generating 10-char room ID' : `Connecting → ${apiUrl}`}
          </p>

          {error && (
            <div className="mt-6 flex items-start gap-3 p-3 bg-brutal-red border-4 border-ink text-left shadow-brutal-sm" role="alert">
              <div className="w-8 h-8 bg-paper border-3 border-ink flex items-center justify-center flex-shrink-0 font-black">!</div>
              <div className="min-w-0 flex-1">
                <p className="font-black uppercase text-xs tracking-widest text-white">Error</p>
                <p className="font-mono text-xs font-bold mt-1 text-white break-words">{error}</p>
              </div>
            </div>
          )}

          {error && (
            <button onClick={() => { startedRef.current = false; setAttempt((a) => a + 1); }} className="mt-4 w-full py-3 bg-brutal-yellow border-4 border-ink font-black uppercase tracking-widest text-sm shadow-brutal-sm active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#0A0A0A]">
              Try again
            </button>
          )}

          <div className="mt-6 pt-4 border-t-4 border-ink flex items-center justify-center gap-2 font-mono text-[11px] font-black uppercase tracking-widest">
            <span className="w-2 h-2 bg-brutal-lime border-2 border-ink" />
            P2P · No images stored
          </div>
        </div>
      </div>

      <footer className="border-t-4 border-ink bg-paper py-3 text-center font-mono text-xs font-black uppercase tracking-widest">©️ Mewn</footer>
    </div>
  );
};
