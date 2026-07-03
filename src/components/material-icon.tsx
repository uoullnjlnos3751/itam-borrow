'use client';

interface MaterialIconProps {
  icon: string;
  className?: string;
  size?: number;
  filled?: boolean;
}

export function MaterialIcon({ icon, className = '', size, filled }: MaterialIconProps) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{
        fontSize: size ? `${size}px` : undefined,
        fontVariationSettings: filled
          ? "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24"
          : undefined,
      }}
    >
      {icon}
    </span>
  );
}
