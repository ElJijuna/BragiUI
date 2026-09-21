import React, { useState } from 'react';

interface ColorSchemeToggleProps {
  onToggle?: (scheme: 'light' | 'dark') => void;
  className?: string;
  style?: React.CSSProperties;
  defaultScheme?: 'light' | 'dark';
}

export const ColorSchemeToggle: React.FC<ColorSchemeToggleProps> = ({
  onToggle,
  defaultScheme = 'light',
  className,
  style,
}) => {
  const [scheme, setScheme] = useState<'light' | 'dark'>(defaultScheme);

  const handleToggle = () => {
    const newScheme = scheme === 'light' ? 'dark' : 'light';
    setScheme(newScheme);
    onToggle?.(newScheme);
  };

  return (
    <button
      type="button"
      className={className}
      onClick={handleToggle}
      data-testid="color-scheme-toggle"
      style={{
        padding: 'var(--bragi-toggle-padding, 8px 16px)',
        borderRadius: 'var(--bragi-radius-sm, 4px)',
        border: '1px solid var(--bragi-border, #ccc)',
        background: scheme === 'light' ? 'var(--bragi-toggle-light-background, #fff)' : 'var(--bragi-toggle-dark-background, #333)',
        color: scheme === 'light' ? 'var(--bragi-toggle-light-foreground, #000)' : 'var(--bragi-toggle-dark-foreground, #fff)',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 500,
        ...style,
      }}
    >
      {scheme === 'light' ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
};
