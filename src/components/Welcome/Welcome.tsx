import React from 'react';

interface WelcomeProps {
  title?: string;
  message?: string;
}

export const Welcome: React.FC<WelcomeProps> = ({
  title = 'Welcome to BragiUI',
  message = 'A modern React component library',
}) => {
  return (
    <div
      style={{
        padding: '32px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '8px',
        color: 'white',
      }}
      data-testid="welcome-component"
    >
      <h1 style={{ margin: '0 0 16px 0', fontSize: '28px' }}>{title}</h1>
      <p style={{ margin: 0, fontSize: '16px', opacity: 0.9 }}>{message}</p>
    </div>
  );
};
