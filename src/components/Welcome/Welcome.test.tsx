import React from 'react';
import { render, screen } from '@testing-library/react';
import { Welcome } from './Welcome';

describe('Welcome', () => {
  it('renders the component', () => {
    render(<Welcome />);
    const component = screen.getByTestId('welcome-component');
    expect(component).toBeInTheDocument();
  });

  it('displays default title and message', () => {
    render(<Welcome />);
    expect(screen.getByText('Welcome to BragiUI')).toBeInTheDocument();
    expect(screen.getByText('A modern React component library')).toBeInTheDocument();
  });

  it('displays custom title and message', () => {
    render(
      <Welcome
        title="Custom Title"
        message="Custom Message"
      />
    );
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('Custom Message')).toBeInTheDocument();
  });
});
