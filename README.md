# BragiUI

Componentes React de presentación. Compatible con React 18 y 19. La aplicación proporciona los datos a `CVESummary`; la librería no realiza peticiones de red.

## Instalación

```sh
npm install @pilmee/bragiui
```

Importa solo el componente que necesites:

```tsx
import { CVESummary } from '@pilmee/bragiui/cve-summary'
import type { CVEData } from '@pilmee/bragiui'

function Vista({ data }: { data: CVEData }) {
  return <CVESummary data={data} />
}
```

## Navbar

`Navbar` recibe el contenido de la barra y las secciones del menú lateral. El lateral inicia expandido y el botón hamburguesa alterna entre expandido y compacto, mostrando solo iconos en este último estado. Los enlaces usan `href` y las acciones usan `onSelect`, así que puedes conectarlos al router de tu aplicación.

```tsx
import { Navbar } from '@pilmee/bragiui/navbar'

<Navbar
  brand={<a href="/">Mi aplicación</a>}
  topLeftItems={[{ id: 'projects', label: 'Proyectos', href: '/projects' }]}
  topRightItems={[{ id: 'profile', label: 'Perfil', href: '/profile' }]}
  search={{ placeholder: 'Buscar', onSubmit: query => console.log(query) }}
  sidebarSections={[
    { id: 'general', label: 'General', items: [
      { id: 'home', label: 'Inicio', href: '/', icon: '⌂' },
    ] },
    { id: 'admin', label: 'Administración', items: [
      { id: 'settings', label: 'Ajustes', href: '/settings', icon: '⚙' },
    ] },
  ]}
>
  <div>Contenido de la página</div>
</Navbar>
```

El estado también puede ser controlado desde la aplicación mediante `collapsed`/`onCollapsedChange`; `defaultCollapsed` cambia el estado inicial. El sidebar ocupa por defecto todo el alto disponible bajo la barra superior; `--bragi-layout-min-height` permite ajustar el alto mínimo del conjunto (por defecto `100dvh`). El elemento activo del lateral usa `--bragi-workspace-background`, el mismo fondo del área de trabajo, y cubre la línea divisoria a su altura. Sus esquinas izquierdas usan `--bragi-sidebar-active-radius` (8 px por defecto); el lado derecho es recto y se integra sin bordes con el área de trabajo. El ancho, los textos y el estado activo tienen transiciones; se desactivan si el usuario prefiere reducir el movimiento. Puedes ajustar su duración con `--bragi-motion-duration` (220 ms por defecto) y `--bragi-motion-fast` (160 ms). Los demás tokens de diseño son `--bragi-nav-background`, `--bragi-sidebar-background`, `--bragi-nav-active-background`, `--bragi-nav-active-foreground`, `--bragi-foreground`, `--bragi-border`, `--bragi-surface`, `--bragi-muted`, `--bragi-font-family`, `--bragi-navbar-height`, `--bragi-sidebar-width`, `--bragi-sidebar-collapsed-width`, `--bragi-nav-gap`, `--bragi-nav-padding` y `--bragi-radius-sm`.

También puedes importar desde `@pilmee/bragiui`. El paquete publica módulos ESM separados y marca sus módulos como libres de efectos secundarios para que el bundler elimine componentes sin uso. React y React DOM son dependencias `peer`.

## Tokens y estilos

Los componentes usan propiedades CSS personalizadas con valores por defecto. Defínelas en un ancestro, independientemente de si tu aplicación usa CSS, styled-components, Emotion o StyleX:

```css
.myTheme {
  --bragi-border: #ccd2dc;
  --bragi-surface: #f8faff;
  --bragi-info: #2653b6;
  --bragi-space-lg: 2rem;
  --bragi-radius-lg: 12px;
}
```

```tsx
<div className="myTheme"><CVESummary data={data} /></div>
```

`Welcome`, `ColorSchemeToggle` y `CVESummary` aceptan `className` y `style` para integrarse con wrappers y sistemas de estilos. Otros tokens disponibles: `--bragi-muted`, `--bragi-critical`, `--bragi-high`, `--bragi-medium`, `--bragi-low`, `--bragi-error-foreground`, `--bragi-error-background`, `--bragi-error-border`, `--bragi-info-background`, `--bragi-success-background`, `--bragi-skeleton`, `--bragi-toggle-padding`, `--bragi-radius-sm`, `--bragi-toggle-light-background`, `--bragi-toggle-light-foreground`, `--bragi-toggle-dark-background`, `--bragi-toggle-dark-foreground`, `--bragi-welcome-background` y `--bragi-welcome-foreground`.

La librería se compila con TypeScript 6, pero sus declaraciones usan sintaxis compatible con TypeScript 5.

## Desarrollo

```sh
npm install
npm run lint
npm test -- --runInBand
npm run build
npm run build-storybook
```
