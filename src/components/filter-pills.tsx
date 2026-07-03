'use client';

interface FilterPillsProps {
  options: { label: string; value: string }[];
  selected: string;
  onSelect: (value: string) => void;
}

export function FilterPills({ options, selected, onSelect }: FilterPillsProps) {
  return (
    <div className="flex gap-stack-sm overflow-x-auto hide-scrollbar pb-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onSelect(opt.value)}
          className={`px-4 py-2 rounded-full border border-outline-variant text-label-md font-label-md whitespace-nowrap transition-colors ${
            selected === opt.value
              ? 'bg-primary text-on-primary border-primary'
              : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-low'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
