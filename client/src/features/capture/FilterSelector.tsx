// ©️ Mewn — Neo-Brutalism FilterSelector (11 presets + None) — Live Filter Preview
import React from 'react';
import { PhotoFilterId } from '../../types/room.types';
import { normalizeFilterId, PHOTO_FILTERS } from './filters';

interface FilterSelectorProps {
  selected: PhotoFilterId;
  onSelect: (filter: PhotoFilterId) => void;
}

export const FilterSelector: React.FC<FilterSelectorProps> = ({ selected, onSelect }) => {
  const activeId = normalizeFilterId(selected);
  return (
    <div className="bg-paper border-4 border-ink shadow-brutal p-3 sm:p-4">
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-ink text-paper font-mono text-[11px] font-black uppercase tracking-widest border-2 border-ink">
          ◆ 12 Looks · None default
        </span>
        <span className="px-2 py-1 bg-brutal-lime border-3 border-ink font-mono text-[10px] font-black uppercase tracking-widest" aria-hidden="true">● Live preview</span>
      </div>
      <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-ink/60 mb-3">
        Tap to preview instantly on your camera — <span className="text-ink font-black">None</span> is default (no filter). What you see is what you capture.
      </p>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3" role="radiogroup" aria-label="Photo finish — live preview, None is no filter">
        {PHOTO_FILTERS.map((filter) => {
          const active = normalizeFilterId(filter.id) === activeId;
          const isNone = filter.id === 'natural';
          return (
            <button
              key={filter.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onSelect(filter.id)}
              title={`${filter.label} — ${filter.hint}${isNone ? ' (default)' : ''}`}
              className={`group flex flex-col items-center gap-1.5 p-2 border-3 transition-all active:scale-[0.97] ${
                active
                  ? 'bg-brutal-yellow border-ink shadow-[4px_4px_0px_#0A0A0A] scale-[1.02]'
                  : 'bg-paper border-ink/20 hover:border-ink hover:shadow-[3px_3px_0px_#0A0A0A] hover:-translate-y-0.5'
              }`}
            >
              <span
                className={`w-12 h-12 border-3 flex-shrink-0 flex items-center justify-center font-black text-[14px] ${active ? 'border-ink' : 'border-ink/30 group-hover:border-ink'}`}
                style={{ background: filter.swatch }}
                aria-hidden="true"
              >
                {isNone ? '∅' : ''}
              </span>
              <span className={`font-mono text-[11px] font-black uppercase tracking-widest leading-none text-center ${active ? 'text-ink' : 'text-ink/70'}`}>{filter.label}</span>
              <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-ink/50 leading-none text-center hidden sm:block">{filter.hint}</span>
              {active && <span className="mt-0.5 px-1.5 py-0.5 bg-ink text-paper font-mono text-[9px] font-black uppercase">● {isNone ? 'None · Live' : 'Live'}</span>}
              {isNone && !active && <span className="mt-0.5 px-1 py-0.5 bg-paper border border-ink/20 font-mono text-[8px] font-black uppercase tracking-widest">Default</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};
