// ©️ Mewn — Neo-Brutalism FilterSelector (12 filters)
import React from 'react';
import { PhotoFilterId } from '../../types/room.types';
import { PHOTO_FILTERS } from './filters';

interface FilterSelectorProps {
  selected: PhotoFilterId;
  onSelect: (filter: PhotoFilterId) => void;
}

export const FilterSelector: React.FC<FilterSelectorProps> = ({ selected, onSelect }) => {
  return (
    <div className="bg-paper border-4 border-ink shadow-brutal p-3 sm:p-4">
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-ink text-paper font-mono text-[11px] font-black uppercase tracking-widest border-2 border-ink">
          ◆ 12 Film Presets
        </span>
        <span className="px-2 py-1 bg-brutal-yellow border-3 border-ink font-mono text-[10px] font-black uppercase tracking-widest">Live preview</span>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3" role="radiogroup" aria-label="Photo finish">
        {PHOTO_FILTERS.map((filter) => {
          const active = filter.id === selected;
          return (
            <button
              key={filter.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onSelect(filter.id)}
              title={`${filter.label} — ${filter.hint}`}
              className={`group flex flex-col items-center gap-1.5 p-2 border-3 transition-all active:scale-[0.97] ${
                active
                  ? 'bg-brutal-yellow border-ink shadow-[4px_4px_0px_#0A0A0A] scale-[1.02]'
                  : 'bg-paper border-ink/20 hover:border-ink hover:shadow-[3px_3px_0px_#0A0A0A] hover:-translate-y-0.5'
              }`}
            >
              <span
                className={`w-12 h-12 border-3 flex-shrink-0 ${active ? 'border-ink' : 'border-ink/30 group-hover:border-ink'}`}
                style={{ background: filter.swatch }}
                aria-hidden="true"
              />
              <span className={`font-mono text-[11px] font-black uppercase tracking-widest leading-none text-center ${active ? 'text-ink' : 'text-ink/70'}`}>{filter.label}</span>
              <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-ink/50 leading-none text-center hidden sm:block">{filter.hint}</span>
              {active && <span className="mt-0.5 px-1.5 py-0.5 bg-ink text-paper font-mono text-[9px] font-black uppercase">● Active</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};
