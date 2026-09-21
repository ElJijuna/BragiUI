import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Navbar, type NavbarProps } from './Navbar';

const sections = [
  {
    id: 'workspace', label: 'Espacio de trabajo', items: [
      { id: 'home', label: 'Inicio', icon: '⌂', active: true },
      { id: 'projects', label: 'Proyectos', icon: '▦' },
    ],
  },
  {
    id: 'account', label: 'Cuenta', items: [
      { id: 'settings', label: 'Configuración', icon: '⚙' },
      { id: 'help', label: 'Ayuda', icon: '?' },
    ],
  },
];

function InteractiveNavbar(args: NavbarProps) {
  const [activeId, setActiveId] = useState(
    () => args.sidebarSections?.flatMap(section => section.items).find(item => item.active)?.id ?? 'home',
  );
  const activeItem = args.sidebarSections?.flatMap(section => section.items).find(item => item.id === activeId);

  return (
    <Navbar
      {...args}
      sidebarSections={args.sidebarSections?.map(section => ({
        ...section,
        items: section.items.map(item => ({
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
}

const meta = {
  title: 'Components/Navbar',
  component: Navbar,
  render: args => <InteractiveNavbar {...args} />,
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
