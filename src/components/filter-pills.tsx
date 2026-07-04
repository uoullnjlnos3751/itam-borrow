'use client';

interface FilterPillsProps {
  options: { label: string; value: string }[];
  selected: string;
  onSelect: (value: string) => void;
}

export function FilterPills({ options, selected, onSelect }: FilterPillsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onSelect(opt.value)}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-all cursor-pointer ${
            selected === opt.value
              ? 'bg-sky-500 text-white border-sky-500 shadow-sm shadow-sky-500/10'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
