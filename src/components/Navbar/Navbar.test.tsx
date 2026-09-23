import { fireEvent, render, screen } from '@testing-library/react';
import { Navbar } from './Navbar';

const sections = [
  {
    id: 'main',
    label: 'Principal',
    items: [{ id: 'home', label: 'Inicio', href: '/inicio', icon: '⌂', active: true }],
  },
  {
    id: 'admin',
    label: 'Administración',
    items: [{ id: 'settings', label: 'Ajustes', href: '/ajustes', icon: '⚙' }],
  },
];

describe('Navbar', () => {
  it('starts expanded and toggles the sidebar from the hamburger button', () => {
    render(<Navbar brand="BragiUI" sidebarSections={sections} />);
    const sidebar = screen.getByRole('complementary', { name: 'Menú lateral' });
    expect(sidebar).toHaveAttribute('data-collapsed', 'false');
    expect(sidebar.style.transition).toContain('width');
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
    render(
      <Navbar
        brand="BragiUI"
        topLeftItems={[{ id: 'one', label: 'Menú 1', href: '/one' }]}
        topRightItems={[{ id: 'four', label: 'Menú 4', href: '/four' }]}
        search={{ onSubmit }}
      />,
    );
    expect(screen.getByRole('navigation', { name: 'Navegación principal' })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Navegación secundaria' })).toBeInTheDocument();
    fireEvent.change(screen.getByRole('searchbox', { name: 'Buscar' }), {
      target: { value: '  CVE  ' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Enviar búsqueda' }));
    expect(onSubmit).toHaveBeenCalledWith('CVE');
  });

  it('supports controlled collapsed state', () => {
    const onCollapsedChange = jest.fn();
    render(<Navbar brand="BragiUI" collapsed={false} onCollapsedChange={onCollapsedChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Contraer menú lateral' }));
    expect(onCollapsedChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole('complementary', { name: 'Menú lateral' })).toHaveAttribute(
      'data-collapsed',
      'false',
    );
  });

  it('fills the viewport below the top bar by default', () => {
    const { container } = render(<Navbar brand="BragiUI" />);
    const layout = container.firstElementChild as HTMLElement;
    const sidebar = screen.getByRole('complementary', { name: 'Menú lateral' });

    expect(layout.style.minHeight).toContain('100dvh');
    expect(layout.style.flexDirection).toBe('column');
    expect(sidebar.parentElement).toHaveStyle({ flex: '1 1 auto' });
  });

  it('renders a ReactNode passed as topLeftItems instead of a NavbarItem list', () => {
    render(
      <Navbar
        brand="BragiUI"
        topLeftItems={
          <nav aria-label="Breadcrumb">
            <span>Inicio / Detalle</span>
          </nav>
        }
      />,
    );
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
    expect(screen.getByText('Inicio / Detalle')).toBeInTheDocument();
    expect(
      screen.queryByRole('navigation', { name: 'Navegación principal' }),
    ).not.toBeInTheDocument();
  });

  it('makes the navbar and sidebar sticky when sticky is set', () => {
    render(<Navbar brand="BragiUI" sticky />);
    const header = screen.getByRole('banner');
    const sidebar = screen.getByRole('complementary', { name: 'Menú lateral' });

    expect(header.style.position).toBe('sticky');
    expect(header.style.top).toBe('0px');
    // jsdom's CSSOM rejects `top: var(...)` as an invalid length and silently drops it
    // (real browsers accept it), so position/overflow are what this environment can assert.
    expect(sidebar.style.position).toBe('sticky');
    expect(sidebar.style.overflowY).toBe('auto');
  });

  it('renders a custom ReactNode at the bottom of the sidebar', () => {
    render(
      <Navbar
        brand="BragiUI"
        sidebarSections={sections}
        sidebarFooter={<button type="button">Cerrar sesión</button>}
      />,
    );
    const sidebar = screen.getByRole('complementary', { name: 'Menú lateral' });
    const footerButton = screen.getByRole('button', { name: 'Cerrar sesión' });
    expect(sidebar).toContainElement(footerButton);
  });

  it('does not render a sidebar section heading when its label is empty', () => {
    render(
      <Navbar
        brand="BragiUI"
        sidebarSections={[
          { id: 'unlabeled', label: '', items: [{ id: 'home', label: 'Inicio', icon: '⌂' }] },
          ...sections,
        ]}
      />,
    );
    expect(screen.queryByRole('heading', { name: '' })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Principal' })).toBeInTheDocument();
  });

  it('disables transitions when reduced motion is requested', () => {
    const descriptor = Object.getOwnPropertyDescriptor(window, 'matchMedia');
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: () => ({ matches: true, addEventListener: () => {}, removeEventListener: () => {} }),
    });
    try {
      render(<Navbar brand="BragiUI" sidebarSections={sections} />);
      expect(screen.getByRole('complementary', { name: 'Menú lateral' }).style.transition).toBe(
        'none',
      );
      expect(screen.getByRole('link', { name: 'Inicio' }).style.transition).toBe('none');
    } finally {
      if (descriptor) {
        Object.defineProperty(window, 'matchMedia', descriptor);
      } else {
        delete (window as { matchMedia?: unknown }).matchMedia;
      }
    }
  });
});
