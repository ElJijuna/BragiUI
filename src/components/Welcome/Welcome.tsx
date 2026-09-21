import type { CSSProperties, FC } from 'react';

export interface WelcomeProps {
  title?: string;
  message?: string;
  className?: string;
  style?: CSSProperties;
}

export const Welcome: FC<WelcomeProps> = ({
  title = 'Welcome to BragiUI',
  message = 'A modern React component library',
  className,
  style,
}) => {
  return (
    <div
      className={className}
      style={{
        padding: 'var(--bragi-space-lg, 32px)',
        textAlign: 'center',
        background:
          'var(--bragi-welcome-background, linear-gradient(135deg, #667eea 0%, #764ba2 100%))',
        borderRadius: 'var(--bragi-radius-lg, 8px)',
        color: 'var(--bragi-welcome-foreground, white)',
        ...style,
      }}
      data-testid="welcome-component"
    >
      <h1 style={{ margin: '0 0 16px 0', fontSize: '28px' }}>{title}</h1>
      <p style={{ margin: 0, fontSize: '16px', opacity: 0.9 }}>{message}</p>
    </div>
  );
};
