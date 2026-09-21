import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Navbar } from './Navbar';

const sections = [
  { id: 'main', label: 'Principal', items: [{ id: 'home', label: 'Inicio', href: '/inicio', icon: '⌂', active: true }] },
  { id: 'admin', label: 'Administración', items: [{ id: 'settings', label: 'Ajustes', href: '/ajustes', icon: '⚙' }] },
];

describe('Navbar', () => {
  it('starts expanded and toggles the sidebar from the hamburger button', () => {
    render(<Navbar brand="BragiUI" sidebarSections={sections} />);
    const sidebar = screen.getByRole('complementary', { name: 'Menú lateral' });
    expect(sidebar).toHaveAttribute('data-collapsed', 'false');
    expect(screen.getByRole('heading', { name: 'Principal' })).toBeInTheDocument();

    const toggle = screen.getByRole('button', { name: 'Contraer menú lateral' });
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(toggle).toHaveAttribute('aria-controls', sidebar.id);
    fireEvent.click(toggle);

    expect(sidebar).toHaveAttribute('data-collapsed', 'true');
    expect(screen.queryByRole('heading', { name: 'Principal' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Inicio' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Ajustes' })).toHaveAttribute('title', 'Ajustes');
    fireEvent.click(screen.getByRole('button', { name: 'Expandir menú lateral' }));
    expect(sidebar).toHaveAttribute('data-collapsed', 'false');
  });

  it('renders both top menus and submits the search query', () => {
    const onSubmit = jest.fn();
    render(<Navbar brand="BragiUI" topLeftItems={[{ id: 'one', label: 'Menú 1', href: '/one' }]} topRightItems={[{ id: 'four', label: 'Menú 4', href: '/four' }]} search={{ onSubmit }} />);
    expect(screen.getByRole('navigation', { name: 'Navegación principal' })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Navegación secundaria' })).toBeInTheDocument();
    fireEvent.change(screen.getByRole('searchbox', { name: 'Buscar' }), { target: { value: '  CVE  ' } });
    fireEvent.click(screen.getByRole('button', { name: 'Enviar búsqueda' }));
    expect(onSubmit).toHaveBeenCalledWith('CVE');
  });

  it('supports controlled collapsed state', () => {
    const onCollapsedChange = jest.fn();
    render(<Navbar brand="BragiUI" collapsed={false} onCollapsedChange={onCollapsedChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Contraer menú lateral' }));
    expect(onCollapsedChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole('complementary', { name: 'Menú lateral' })).toHaveAttribute('data-collapsed', 'false');
  });
});
