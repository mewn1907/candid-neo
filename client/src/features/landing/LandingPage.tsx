// ©️ Mewn — Neo-Brutalism for Candid
import React from 'react';
import { Link } from 'react-router-dom';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-paper flex flex-col overflow-hidden">
      {/* Top brutal rule */}
      <div className="h-[8px] w-full bg-ink" />

      {/* Header — stark, thick border */}
      <header className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-brutal-yellow border-4 border-ink shadow-brutal-sm flex items-center justify-center">
            <svg className="w-6 h-6 text-ink" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <span className="font-black text-xl sm:text-2xl tracking-tighter uppercase text-ink">CANDID</span>
          <span className="hidden sm:inline-flex px-2 py-1 bg-ink text-paper font-mono text-xs font-bold tracking-widest border-2 border-ink">2 ONLY</span>
        </div>
        <nav className="flex items-center gap-2 sm:gap-3">
          <Link to="/join" className="px-4 sm:px-5 py-2.5 bg-paper border-4 border-ink font-black uppercase text-xs tracking-widest shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#0A0A0A] transition-all active:scale-[0.97]">
            Enter Code
          </Link>
          <Link to="/create" className="px-5 sm:px-6 py-2.5 bg-brutal-yellow border-4 border-ink font-black uppercase text-xs tracking-widest shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#0A0A0A] transition-all active:scale-[0.97]">
            Start Booth →
          </Link>
        </nav>
      </header>

      {/* Hero — thick frame, grid, bold */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 pb-10">
        {/* Eyebrow — stark label */}
        <div className="mt-4 sm:mt-6 inline-flex items-center gap-2 px-3 py-2 bg-brutal-yellow border-3 border-ink font-mono text-[11px] font-black uppercase tracking-widest shadow-[4px_4px_0px_#0A0A0A]">
          <span className="w-2 h-2 bg-ink border border-ink" />
          Private · P2P · No storage
        </div>

        <div className="mt-6 grid lg:grid-cols-[1.1fr_0.9fr] gap-6 lg:gap-8 items-start">
          {/* Left: headline */}
          <div className="space-y-6">
            <h1 className="font-black text-[2.6rem] sm:text-[4rem] lg:text-[5rem] leading-[0.88] tracking-tighter uppercase">
              <span className="block text-ink">Miles</span>
              <span className="block text-ink">Apart.</span>
              <span className="inline-block bg-brutal-yellow border-4 border-ink px-2 sm:px-3 shadow-brutal text-ink">Frames</span>
              <span className="block text-ink mt-1">Together.</span>
            </h1>
            <p className="max-w-xl text-sm sm:text-base font-medium leading-relaxed border-l-4 border-ink pl-4">
              Browser photobooth for <span className="font-black underline decoration-4 decoration-brutal-yellow">EXACTLY 2</span> people. No accounts. Create a room, share the link, sync your countdown — and capture.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link to="/create" className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-8 py-4 bg-brutal-yellow border-4 border-ink font-black uppercase tracking-widest text-sm shadow-brutal hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_#0A0A0A] transition-all active:scale-[0.97]">
                Create a Room <span aria-hidden>→</span>
              </Link>
              <Link to="/join" className="flex-1 sm:flex-none inline-flex items-center justify-center px-8 py-4 bg-paper border-4 border-ink font-black uppercase tracking-widest text-sm shadow-brutal hover:bg-ink hover:text-paper transition-all active:scale-[0.97]">
                Join with Code
              </Link>
            </div>
            <div className="flex flex-wrap gap-2 pt-1 font-mono text-[11px] font-bold uppercase tracking-widest">
              <span className="px-2 py-1 bg-ink text-paper border-2 border-ink">10-char ID</span>
              <span className="px-2 py-1 bg-paper border-3 border-ink">WebRTC</span>
              <span className="px-2 py-1 bg-brutal-lime border-3 border-ink">12 filters</span>
              <span className="px-2 py-1 bg-brutal-cobalt text-white border-3 border-ink">Burst ×3 · Collage</span>
            </div>
          </div>

          {/* Right: brutal frame — fake viewfinders, no soft blur */}
          <div className="relative bg-paper border-4 border-ink shadow-brutal p-2 sm:p-3">
            {/* Lab label */}
            <div className="flex items-center justify-between px-2 py-2 bg-brutal-yellow border-3 border-ink font-mono text-[11px] font-black uppercase tracking-widest">
              <span>● REC · SYNC 00:03</span>
              <span className="px-2 py-0.5 bg-ink text-paper">STUN OK</span>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:gap-3">
              <div className="aspect-[4/3] bg-ink border-3 border-ink relative overflow-hidden flex flex-col">
                <div className="flex-1 bg-[#1A1A1A] flex items-center justify-center relative">
                  <span className="w-12 h-12 bg-brutal-yellow border-3 border-ink flex items-center justify-center font-mono font-black text-xs">YOU</span>
                  <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-brutal-yellow border-2 border-ink font-mono text-[9px] font-black">PARIS</span>
                  {/* crosshair */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute left-1/2 top-[12%] bottom-[12%] w-px bg-white/30 -translate-x-1/2" />
                    <div className="absolute top-1/2 left-[12%] right-[12%] h-px bg-white/30 -translate-y-1/2" />
                  </div>
                </div>
                <div className="px-2 py-1.5 bg-paper border-t-3 border-ink font-mono text-[10px] font-black uppercase text-center">A · Front</div>
              </div>
              <div className="aspect-[4/3] bg-ink border-3 border-ink relative overflow-hidden flex flex-col">
                <div className="flex-1 bg-[#222] flex items-center justify-center relative">
                  <span className="w-12 h-12 bg-brutal-cobalt border-3 border-ink flex items-center justify-center font-mono font-black text-xs text-white">THEM</span>
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-paper border-2 border-ink font-mono text-[9px] font-black">TOKYO</span>
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute left-1/2 top-[12%] bottom-[12%] w-px bg-white/30 -translate-x-1/2" />
                    <div className="absolute top-1/2 left-[12%] right-[12%] h-px bg-white/30 -translate-y-1/2" />
                  </div>
                </div>
                <div className="px-2 py-1.5 bg-brutal-lime border-t-3 border-ink font-mono text-[10px] font-black uppercase text-center">B · Remote</div>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 font-mono text-[10px] font-black uppercase tracking-widest text-center">
              <span className="py-2 bg-ink text-paper border-3 border-ink">3 / 5 / 10s</span>
              <span className="py-2 bg-paper border-3 border-ink">12 Filters</span>
              <span className="py-2 bg-brutal-red text-white border-3 border-ink">● Live</span>
            </div>
          </div>
        </div>

        {/* Feature grid — brutal cards */}
        <div className="mt-8 sm:mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-paper border-4 border-ink shadow-brutal p-5 sm:p-6">
            <div className="w-10 h-10 bg-brutal-yellow border-3 border-ink flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0" /></svg>
            </div>
            <h2 className="mt-4 font-black uppercase tracking-tight text-sm">Strictly 2 People</h2>
            <p className="mt-2 text-sm font-medium leading-relaxed">Room locks at 2. Third is rejected. Codes are 10-char nanoid — no guessing.</p>
            <div className="mt-3 inline-flex px-2 py-1 bg-ink text-paper font-mono text-[11px] font-bold uppercase">MAX 2</div>
          </div>
          <div className="bg-brutal-yellow border-4 border-ink shadow-brutal p-5 sm:p-6">
            <div className="w-10 h-10 bg-ink text-paper border-3 border-ink flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h2 className="mt-4 font-black uppercase tracking-tight text-sm">Synced Shutter</h2>
            <p className="mt-2 text-sm font-medium leading-relaxed">Server clock + targetTime. Both devices capture on the same frame. No drift.</p>
            <div className="mt-3 inline-flex px-2 py-1 bg-paper border-3 border-ink font-mono text-[11px] font-black">3·5·10s</div>
          </div>
          <div className="bg-paper border-4 border-ink shadow-brutal p-5 sm:p-6">
            <div className="w-10 h-10 bg-brutal-cobalt text-white border-3 border-ink flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 0012.586 8H7a2 2 0 00-2 2v8a4 4 0 004 4z" /></svg>
            </div>
            <h2 className="mt-4 font-black uppercase tracking-tight text-sm">Filters · Burst · Collage</h2>
            <p className="mt-2 text-sm font-medium leading-relaxed">12 looks, seasonal frames, burst ×3, strip/grid collage, polaroid export. All optional.</p>
            <div className="mt-3 inline-flex px-2 py-1 bg-brutal-lime border-3 border-ink font-mono text-[11px] font-black">EXTRA</div>
          </div>
        </div>

        {/* Bottom ticker */}
        <div className="mt-8 border-4 border-ink bg-ink text-paper overflow-hidden">
          <div className="py-2 font-mono text-xs font-black uppercase tracking-[0.14em] whitespace-nowrap flex gap-8">
            <span>WebRTC P2P</span><span>•</span><span>No Storage</span><span>•</span><span>©️ Mewn</span><span>•</span><span>Socket.IO Signaling</span><span>•</span><span>STUN stun:stun.l.google.com:19302</span>
          </div>
        </div>
      </main>

      <footer className="w-full border-t-4 border-ink bg-paper">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-xs font-bold uppercase tracking-widest">
          <span>©️ Mewn · All rights reserved</span>
          <span className="px-2 py-1 bg-brutal-lime border-3 border-ink">Encrypted WebRTC P2P</span>
        </div>
      </footer>
    </div>
  );
};
