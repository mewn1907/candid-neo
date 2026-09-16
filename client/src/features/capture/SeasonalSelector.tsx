// ©️ Mewn — Neo-Brutalism Seasonal frame selector (6 seasonal)
import React from 'react';
import { SEASONAL_FRAMES, SeasonalFrameId } from './seasonal';

export const SeasonalSelector: React.FC<{
  selected: SeasonalFrameId;
  onSelect: (id: SeasonalFrameId) => void;
}> = ({ selected, onSelect }) => {
  return (
    <div className="bg-paper border-4 border-ink shadow-brutal p-3 sm:p-4">
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-brutal-cobalt text-white border-3 border-ink font-mono text-[11px] font-black uppercase tracking-widest">
          ◈ Seasonal Frame <span className="bg-white text-ink px-1">EXTRA</span>
        </span>
        <span className="px-2 py-1 bg-paper border-3 border-ink font-mono text-[10px] font-black uppercase">Choosable</span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2" role="radiogroup" aria-label="Seasonal frame">
        {SEASONAL_FRAMES.map(f => {
          const active = f.id === selected;
          return (
            <button
              key={f.id}
              onClick={() => onSelect(f.id)}
              role="radio"
              aria-checked={active}
              className={`flex-shrink-0 flex flex-col items-center gap-1.5 p-2 border-3 min-w-[72px] transition-all active:scale-[0.97] ${
                active ? 'bg-brutal-yellow border-ink shadow-[4px_4px_0px_#0A0A0A]' : 'bg-paper border-ink/20 hover:border-ink hover:shadow-[3px_3px_0px_#0A0A0A]'
              }`}
            >
              <span className="w-9 h-9 border-3 border-ink flex items-center justify-center text-sm font-black" style={{ background: f.bg, color: f.accent }}>{f.emoji}</span>
              <span className={`font-mono text-[11px] font-black uppercase tracking-widest ${active ? 'text-ink' : 'text-ink/70'}`}>{f.label}</span>
              {active && <span className="px-1 py-0.5 bg-ink text-paper font-mono text-[9px] font-black uppercase">●</span>}
            </button>
          );
        })}
      </div>
      <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-center border-t-3 border-ink pt-2 mt-1">
        {SEASONAL_FRAMES.find(f=>f.id===selected)?.hint} — polaroid & collage
      </p>
    </div>
  );
};
