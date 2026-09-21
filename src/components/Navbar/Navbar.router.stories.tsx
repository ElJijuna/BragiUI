import type { Meta, StoryObj } from '@storybook/react';
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
  useNavigate,
  useRouterState,
} from '@tanstack/react-router';
import type { NavbarSection } from './Navbar';
import { Navbar } from './Navbar';

const HomePage = () => (
  <div style={{ padding: 24 }}>
    <h1>Inicio</h1>
    <p>Ruta actual: /</p>
    <p>
      Este contenido lo renderiza la ruta índice de TanStack Router dentro del &lt;Outlet /&gt;.
    </p>
  </div>
);

const ProjectsPage = () => (
  <div style={{ padding: 24 }}>
    <h1>Proyectos</h1>
    <p>Ruta actual: /projects</p>
    <ul>
      <li>Proyecto A</li>
      <li>Proyecto B</li>
      <li>Proyecto C</li>
    </ul>
  </div>
);

const SettingsPage = () => (
  <div style={{ padding: 24 }}>
    <h1>Configuración</h1>
    <p>Ruta actual: /settings</p>
    <p>Navegar aquí no recarga la página: el Navbar y su sidebar permanecen montados.</p>
  </div>
);

const AdminUsersPage = () => (
  <div style={{ padding: 24 }}>
    <h1>Usuarios</h1>
    <p>Ruta actual: /admin/users</p>
    <p>Este sidebar pertenece al área "Administración", distinta de "Espacio de trabajo".</p>
  </div>
);

const AdminReportsPage = () => (
  <div style={{ padding: 24 }}>
    <h1>Reportes</h1>
    <p>Ruta actual: /admin/reports</p>
  </div>
);

const RootLayout = () => {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const isAdminArea = pathname.startsWith('/admin');

  const workspaceSidebar: NavbarSection[] = [
    {
      id: 'workspace',
      label: 'Espacio de trabajo',
      items: [
        {
          id: 'home',
          label: 'Inicio',
          icon: '⌂',
          active: pathname === '/',
          onSelect: () => {
            void navigate({ to: '/' });
          },
        },
        {
          id: 'projects',
          label: 'Proyectos',
          icon: '▦',
          active: pathname === '/projects',
          onSelect: () => {
            void navigate({ to: '/projects' });
          },
        },
      ],
    },
    {
      id: 'account',
      label: 'Cuenta',
      items: [
        {
          id: 'settings',
          label: 'Configuración',
          icon: '⚙',
          active: pathname === '/settings',
          onSelect: () => {
            void navigate({ to: '/settings' });
          },
        },
      ],
    },
  ];

  const adminSidebar: NavbarSection[] = [
    {
      id: 'admin',
      label: 'Administración',
      items: [
        {
          id: 'admin-users',
          label: 'Usuarios',
          icon: '☺',
          active: pathname === '/admin/users',
          onSelect: () => {
            void navigate({ to: '/admin/users' });
          },
        },
        {
          id: 'admin-reports',
          label: 'Reportes',
          icon: '▤',
          active: pathname === '/admin/reports',
          onSelect: () => {
            void navigate({ to: '/admin/reports' });
          },
        },
      ],
    },
  ];

  return (
    <Navbar
      brand={<span>BragiUI</span>}
      topLeftItems={[
        {
          id: 'area-workspace',
          label: 'Espacio de trabajo',
          active: !isAdminArea,
          onSelect: () => {
            void navigate({ to: '/' });
          },
        },
        {
          id: 'area-admin',
          label: 'Administración',
          active: isAdminArea,
          onSelect: () => {
            void navigate({ to: '/admin/users' });
          },
        },
      ]}
      sidebarSections={isAdminArea ? adminSidebar : workspaceSidebar}
    >
      <Outlet />
    </Navbar>
  );
};

const rootRoute = createRootRoute({ component: RootLayout });
const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: HomePage });
const projectsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/projects',
  component: ProjectsPage,
});
const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: SettingsPage,
});
const adminUsersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/users',
  component: AdminUsersPage,
});
const adminReportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/reports',
  component: AdminReportsPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  projectsRoute,
  settingsRoute,
  adminUsersRoute,
  adminReportsRoute,
]);

const createDemoRouter = () =>
  createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: ['/'] }),
  });

const RouterDemo = () => <RouterProvider router={createDemoRouter()} />;

const meta = {
  title: 'Components/Navbar',
  component: Navbar,
  parameters: { layout: 'fullscreen' },
  args: {
    brand: <span>BragiUI</span>,
  },
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithTanStackRouterOutlet: Story = {
  name: 'With TanStack Router (Outlet)',
  render: () => <RouterDemo />,
};
