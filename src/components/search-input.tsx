'use client';

import { MaterialIcon } from './material-icon';

interface SearchInputProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}

export function SearchInput({ placeholder = 'ค้นหา...', value, onChange }: SearchInputProps) {
  return (
    <div className="relative mb-stack-md">
      <MaterialIcon
        icon="search"
        size={20}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
      />
      <input
        type="text"
        className="w-full pl-10 pr-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-body-md"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
