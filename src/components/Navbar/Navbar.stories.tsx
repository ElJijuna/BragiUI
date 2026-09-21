import type { Meta, StoryObj } from '@storybook/react';
import { Navbar } from './Navbar';

const sections = [
  {
    id: 'workspace', label: 'Espacio de trabajo', items: [
      { id: 'home', label: 'Inicio', href: '#inicio', icon: '⌂', active: true },
      { id: 'projects', label: 'Proyectos', href: '#proyectos', icon: '▦' },
    ],
  },
  {
    id: 'account', label: 'Cuenta', items: [
      { id: 'settings', label: 'Configuración', href: '#configuracion', icon: '⚙' },
      { id: 'help', label: 'Ayuda', href: '#ayuda', icon: '?' },
    ],
  },
];

const meta = {
  title: 'Components/Navbar',
  component: Navbar,
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
    children: <div style={{ padding: 24 }}>Contenido de la aplicación</div>,
  },
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Collapsed: Story = { args: { defaultCollapsed: true } };
