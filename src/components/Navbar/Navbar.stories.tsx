import type { Meta, StoryObj } from '@storybook/react';
import type { CSSProperties } from 'react';
import { useState } from 'react';
import { Navbar, type NavbarProps } from './Navbar';

const sections = [
  {
    id: 'workspace',
    label: 'Espacio de trabajo',
    items: [
      { id: 'home', label: 'Inicio', icon: '⌂', active: true },
      { id: 'projects', label: 'Proyectos', icon: '▦' },
    ],
  },
  {
    id: 'account',
    label: 'Cuenta',
    items: [
      { id: 'settings', label: 'Configuración', icon: '⚙' },
      { id: 'help', label: 'Ayuda', icon: '?' },
    ],
  },
];

const InteractiveNavbar = (args: NavbarProps) => {
  const [activeId, setActiveId] = useState(
    () =>
      args.sidebarSections?.flatMap((section) => section.items).find((item) => item.active)?.id ??
      'home',
  );
  const activeItem = args.sidebarSections
    ?.flatMap((section) => section.items)
    .find((item) => item.id === activeId);

  return (
    <Navbar
      {...args}
      sidebarSections={args.sidebarSections?.map((section) => ({
        ...section,
        items: section.items.map((item) => ({
          ...item,
          active: item.id === activeId,
          onSelect: () => {
            item.onSelect?.();
            setActiveId(item.id);
          },
        })),
      }))}
    >
      <div style={{ padding: 24 }}>
        <h1>{activeItem?.label ?? 'Contenido'}</h1>
        <p>Sección seleccionada: {activeItem?.label ?? 'ninguna'}</p>
      </div>
    </Navbar>
  );
};

const meta = {
  title: 'Components/Navbar',
  component: Navbar,
  render: (args) => <InteractiveNavbar {...args} />,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  args: {
    brand: <a href="#inicio">BragiUI</a>,
    topLeftItems: [
      { id: 'menu1', label: 'Panel', href: '#panel' },
      { id: 'menu2', label: 'Informes', href: '#informes' },
    ],
    topRightItems: [
      { id: 'profile', label: 'Perfil', href: '#perfil' },
      { id: 'logout', label: 'Salir', onSelect: () => {} },
    ],
    sidebarSections: sections,
    search: { placeholder: 'Buscar en BragiUI', onSubmit: () => {} },
  },
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Collapsed: Story = { args: { defaultCollapsed: true } };

const greenWorkspaceStyle = {
  '--bragi-workspace-background': 'green',
} as CSSProperties;

export const OnGreenBackground: Story = {
  args: {
    style: greenWorkspaceStyle,
  },
  render: (args) => (
    <div style={{ background: 'green', minHeight: '100dvh' }}>
      <InteractiveNavbar {...args} />
    </div>
  ),
};

export const WithSidebarFooter: Story = {
  args: {
    sidebarFooter: (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px' }}>
        <span
          aria-hidden="true"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 32,
            flexShrink: 0,
            borderRadius: '50%',
            background: 'var(--bragi-nav-active-background, #eff6ff)',
            color: 'var(--bragi-nav-active-foreground, #1d4ed8)',
            fontWeight: 700,
          }}
        >
          AB
        </span>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden' }}>Ana Bravo</div>
          <div
            style={{
              fontSize: 12,
              color: 'var(--bragi-muted, #6b7280)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            ana@bragiui.dev
          </div>
        </div>
      </div>
    ),
  },
};

export const WithBreadcrumbAndSticky: Story = {
  args: {
    topLeftItems: (
      <nav aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <a href="#inicio">Inicio</a>
        <span aria-hidden="true">/</span>
        <a href="#proyectos">Proyectos</a>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Detalle</span>
      </nav>
    ),
    sticky: true,
    sidebarSections: [{ ...sections[0], label: '' }, sections[1]],
  },
  render: (args) => (
    <Navbar {...args}>
      <div style={{ padding: 24, display: 'grid', gap: 12 }}>
        <h1>Contenido con scroll</h1>
        <p>
          En esta historia <code>topLeftItems</code> recibe un breadcrumb (ReactNode) en lugar de
          una lista de <code>NavbarItem</code>, el navbar y el sidebar son sticky (permanecen fijos
          al hacer scroll) y la sección "Espacio de trabajo" no muestra encabezado porque su{' '}
          <code>label</code> está vacío.
        </p>
        {Array.from({ length: 30 }, (_, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static demo content
          <p key={index}>Línea de contenido {index + 1} para forzar scroll vertical.</p>
        ))}
      </div>
    </Navbar>
  ),
};
