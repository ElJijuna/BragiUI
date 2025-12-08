import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ColorSchemeToggle } from './ColorSchemeToggle';

describe('ColorSchemeToggle', () => {
  it('renders the toggle button', () => {
    render(<ColorSchemeToggle />);
    const button = screen.getByTestId('color-scheme-toggle');
    expect(button).toBeInTheDocument();
  });

  it('displays light theme by default', () => {
    render(<ColorSchemeToggle />);
    const button = screen.getByTestId('color-scheme-toggle');
    expect(button).toHaveTextContent('Dark');
  });

  it('displays dark theme when defaultScheme is dark', () => {
    render(<ColorSchemeToggle defaultScheme="dark" />);
    const button = screen.getByTestId('color-scheme-toggle');
    expect(button).toHaveTextContent('Light');
  });

  it('toggles between light and dark themes', () => {
    render(<ColorSchemeToggle />);
    const button = screen.getByTestId('color-scheme-toggle');

    expect(button).toHaveTextContent('Dark');
    fireEvent.click(button);
    expect(button).toHaveTextContent('Light');
    fireEvent.click(button);
    expect(button).toHaveTextContent('Dark');
  });

  it('calls onToggle callback when clicked', () => {
    const mockOnToggle = jest.fn();
    render(<ColorSchemeToggle onToggle={mockOnToggle} />);
    const button = screen.getByTestId('color-scheme-toggle');

    fireEvent.click(button);
    expect(mockOnToggle).toHaveBeenCalledWith('dark');

    fireEvent.click(button);
    expect(mockOnToggle).toHaveBeenCalledWith('light');
  });
});
