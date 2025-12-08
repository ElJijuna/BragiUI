import React, { useState } from 'react';

interface ColorSchemeToggleProps {
  onToggle?: (scheme: 'light' | 'dark') => void;
  defaultScheme?: 'light' | 'dark';
}

export const ColorSchemeToggle: React.FC<ColorSchemeToggleProps> = ({
  onToggle,
  defaultScheme = 'light',
}) => {
  const [scheme, setScheme] = useState<'light' | 'dark'>(defaultScheme);

  const handleToggle = () => {
    const newScheme = scheme === 'light' ? 'dark' : 'light';
    setScheme(newScheme);
    onToggle?.(newScheme);
  };

  return (
    <button
      onClick={handleToggle}
      data-testid="color-scheme-toggle"
      style={{
        padding: '8px 16px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        background: scheme === 'light' ? '#fff' : '#333',
        color: scheme === 'light' ? '#000' : '#fff',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 500,
      }}
    >
      {scheme === 'light' ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
};
