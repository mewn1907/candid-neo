// ©️ Mewn — Neo-Brutalism InvitePanel
import React, { useState } from 'react';
import QRCode from 'react-qr-code';

export function buildInviteLink(roomId: string): string {
  return `${window.location.origin}/join/${roomId}`;
}

export const InvitePanel: React.FC<{ roomId: string | null }> = ({ roomId }) => {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  if (!roomId) return null;
  const inviteLink = buildInviteLink(roomId);

  const handleCopy = async () => {
    let ok = false;
    try {
      if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(inviteLink); ok = true; }
      else throw new Error('clipboard unavailable');
    } catch {
      try {
        const ta = document.createElement('textarea'); ta.value = inviteLink; ta.setAttribute('readonly',''); ta.style.position='fixed'; ta.style.opacity='0'; document.body.appendChild(ta); ta.select(); ta.setSelectionRange(0, ta.value.length); ok = document.execCommand('copy'); document.body.removeChild(ta);
      } catch { ok = false; }
    }
    setCopied(ok); setTimeout(()=>setCopied(false),2400);
  };
  const canShare = typeof (navigator as unknown as { share?: unknown }).share === 'function';
  const handleNativeShare = async () => {
    const nav = navigator as unknown as { share: (d: ShareData) => Promise<void> };
    if (nav.share) { try { await nav.share({ title:'Join me in Candid', text:'Miles apart. Frames together.', url: inviteLink }); } catch {} } else handleCopy();
  };

  return (
    <div className="mt-6 max-w-lg w-full mx-auto bg-paper border-4 border-ink shadow-brutal p-5 sm:p-6">
      <div className="inline-flex px-3 py-1 bg-brutal-yellow border-3 border-ink font-mono text-xs font-black uppercase tracking-widest">
        Waiting for +1
      </div>
      <h2 className="mt-3 font-black uppercase tracking-tighter text-xl sm:text-2xl">Invite Your Partner</h2>
      <p className="mt-1 font-mono text-xs font-bold uppercase tracking-widest text-ink/60">Share code or link — camera unlocks when 2 join</p>

      <div className="mt-4 p-3 bg-paper border-4 border-ink shadow-brutal-sm flex items-center gap-3">
        <div className="min-w-0 flex-1 text-left">
          <span className="block font-mono text-[10px] font-black uppercase tracking-widest">Private Room Code</span>
          <span className="block font-mono text-2xl sm:text-3xl font-black tracking-widest select-all break-all">{roomId}</span>
          <code className="block font-mono text-[11px] font-bold truncate mt-1 select-all border-t-2 border-ink pt-1">{inviteLink}</code>
        </div>
        <button onClick={handleCopy} className={`px-4 py-3 border-4 border-ink font-black uppercase text-xs tracking-widest flex items-center gap-1.5 shadow-[4px_4px_0px_#0A0A0A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#0A0A0A] transition-all ${copied ? 'bg-brutal-lime' : 'bg-brutal-yellow'}`} aria-live="polite">
          {copied ? 'Copied!' : 'Copy Link'}
        </button>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2">
        <button onClick={()=>setShowQR(!showQR)} className={`px-4 py-2 border-3 border-ink font-black uppercase text-xs tracking-widest shadow-[4px_4px_0px_#0A0A0A] active:translate-x-[1px] active:translate-y-[1px] ${showQR ? 'bg-ink text-paper' : 'bg-paper'}`}>
          {showQR ? 'Hide QR' : 'Show QR'}
        </button>
        {canShare && <button onClick={handleNativeShare} className="px-4 py-2 bg-brutal-cobalt text-white border-3 border-ink font-black uppercase text-xs tracking-widest shadow-[4px_4px_0px_#0A0A0A] active:translate-x-[1px] active:translate-y-[1px]">Share</button>}
      </div>

      {showQR && (
        <div className="mt-4 p-3 bg-paper border-4 border-ink shadow-brutal-sm inline-block">
          <div className="p-2 bg-white border-3 border-ink">
            <QRCode value={inviteLink} size={160} bgColor="#FFFFFF" fgColor="#0A0A0A" aria-label={`QR code for ${inviteLink}`} />
          </div>
          <p className="font-mono text-[11px] font-black uppercase tracking-widest text-center mt-2">Scan to join</p>
        </div>
      )}
    </div>
  );
};
