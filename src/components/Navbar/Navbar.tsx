import type { CSSProperties, ReactNode } from 'react';
import { useEffect, useId, useState } from 'react';

export interface NavbarItem {
  id: string;
  label: string;
  href?: string;
  onSelect?: () => void;
  icon?: ReactNode;
  active?: boolean;
  disabled?: boolean;
}

export interface NavbarSection {
  id: string;
  label: string;
  items: Array<NavbarItem & { icon: ReactNode }>;
}

export interface NavbarSearch {
  placeholder?: string;
  label?: string;
  onSubmit: (query: string) => void;
}

export interface NavbarProps {
  brand: ReactNode;
  topLeftItems?: NavbarItem[] | ReactNode;
  topRightItems?: NavbarItem[];
  sidebarSections?: NavbarSection[];
  search?: NavbarSearch;
  children?: ReactNode;
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  className?: string;
  style?: CSSProperties;
  sidebarLabel?: string;
  sticky?: boolean;
}

function isNavbarItemArray(value: NavbarItem[] | ReactNode): value is NavbarItem[] {
  return (
    Array.isArray(value) &&
    (value.length === 0 || (typeof value[0] === 'object' && value[0] !== null && 'id' in value[0]))
  );
}

const iconButtonStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 40,
  minHeight: 40,
  padding: 8,
  border: '1px solid var(--bragi-border, #d1d5db)',
  borderRadius: 'var(--bragi-radius-sm, 6px)',
  background: 'var(--bragi-surface, #fff)',
  color: 'var(--bragi-foreground, #111827)',
  cursor: 'pointer',
};

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') {
      return;
    }
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return reduced;
}

const MenuItem = ({
  item,
  iconOnly = false,
  inSidebar = false,
  reducedMotion = false,
}: {
  item: NavbarItem;
  iconOnly?: boolean;
  inSidebar?: boolean;
  reducedMotion?: boolean;
}) => {
  const integrated = item.active && inSidebar;
  const content = (
    <>
      {item.icon && (
        <span aria-hidden="true" style={{ display: 'inline-flex', flexShrink: 0 }}>
          {item.icon}
        </span>
      )}
      <span
        aria-hidden={iconOnly || undefined}
        style={{
          display: 'inline-block',
          overflow: 'hidden',
          maxWidth: iconOnly ? 0 : 180,
          opacity: iconOnly ? 0 : 1,
          whiteSpace: 'nowrap',
          transition: reducedMotion
            ? 'none'
            : 'max-width var(--bragi-motion-duration, 220ms) ease, opacity var(--bragi-motion-fast, 160ms) ease',
        }}
      >
        {item.label}
      </span>
    </>
  );
  const commonStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: iconOnly ? 0 : 10,
    minHeight: 40,
    minWidth: iconOnly ? 40 : undefined,
    padding: '8px 12px',
    borderRadius: integrated
      ? 'var(--bragi-sidebar-active-radius, 8px) 0 0 var(--bragi-sidebar-active-radius, 8px)'
      : 'var(--bragi-radius-sm, 6px)',
    color: item.active
      ? 'var(--bragi-nav-active-foreground, #1d4ed8)'
      : 'var(--bragi-foreground, #111827)',
    background: integrated
      ? 'var(--bragi-workspace-background, #fff)'
      : item.active
        ? 'var(--bragi-nav-active-background, #eff6ff)'
        : 'transparent',
    marginRight: integrated ? -9 : undefined,
    position: integrated ? 'relative' : undefined,
    zIndex: integrated ? 1 : undefined,
    boxShadow: integrated ? '1px 0 0 var(--bragi-workspace-background, #fff)' : undefined,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    borderTop: integrated ? '1px solid var(--bragi-border, #d1d5db)' : 0,
    borderBottom: integrated ? '1px solid var(--bragi-border, #d1d5db)' : 0,
    borderLeft: integrated ? '1px solid var(--bragi-border, #d1d5db)' : 0,
    borderRight: 0,
    overflow: integrated ? 'visible' : 'hidden',
    transition: reducedMotion
      ? 'none'
      : 'background-color var(--bragi-motion-fast, 160ms) ease, color var(--bragi-motion-fast, 160ms) ease, gap var(--bragi-motion-duration, 220ms) ease',
  };
  const accessibleName = iconOnly ? item.label : undefined;
  if (item.disabled) {
    return (
      <button
        type="button"
        disabled
        aria-label={accessibleName}
        title={iconOnly ? item.label : undefined}
        style={{ ...commonStyle, font: 'inherit', opacity: 0.5, cursor: 'not-allowed' }}
      >
        {content}
      </button>
    );
  }
  if (item.href) {
    return (
      <a
        href={item.href}
        onClick={item.onSelect}
        aria-current={item.active ? 'page' : undefined}
        aria-label={accessibleName}
        title={iconOnly ? item.label : undefined}
        style={commonStyle}
      >
        {content}
      </a>
    );
  }
  return (
    <button
      type="button"
      onClick={item.onSelect}
      aria-current={item.active ? 'page' : undefined}
      aria-label={accessibleName}
      title={iconOnly ? item.label : undefined}
      style={{ ...commonStyle, font: 'inherit', cursor: 'pointer' }}
    >
      {content}
    </button>
  );
};

const SidebarSectionHeading = ({
  label,
  isCollapsed,
  reducedMotion,
}: {
  label: string;
  isCollapsed: boolean;
  reducedMotion: boolean;
}) => (
  <>
    {/* biome-ignore lint/a11y/useHeadingContent: aria-hidden only applies while collapsed to icon-only mode; the label text is present and exposed otherwise */}
    <h2
      aria-hidden={isCollapsed || undefined}
      style={{
        margin: isCollapsed ? '0 12px' : '8px 12px',
        maxHeight: isCollapsed ? 0 : 24,
        opacity: isCollapsed ? 0 : 1,
        overflow: 'hidden',
        color: 'var(--bragi-muted, #6b7280)',
        fontSize: 'var(--bragi-sidebar-heading-size, 12px)',
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        transition: reducedMotion
          ? 'none'
          : 'max-height var(--bragi-motion-duration, 220ms) ease, opacity var(--bragi-motion-fast, 160ms) ease, margin var(--bragi-motion-duration, 220ms) ease',
      }}
    >
      {label}
    </h2>
  </>
);

export const Navbar = ({
  brand,
  topLeftItems = [],
  topRightItems = [],
  sidebarSections = [],
  search,
  children,
  collapsed,
  defaultCollapsed = false,
  onCollapsedChange,
  className,
  style,
  sidebarLabel = 'Menú lateral',
  sticky = false,
}: NavbarProps) => {
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
  const [query, setQuery] = useState('');
  const reducedMotion = useReducedMotion();
  const sidebarId = useId();
  const isCollapsed = collapsed ?? internalCollapsed;

  const changeCollapsed = (next: boolean) => {
    if (collapsed === undefined) {
      setInternalCollapsed(next);
    }
    onCollapsedChange?.(next);
  };

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: 'var(--bragi-layout-min-height, 100dvh)',
        color: 'var(--bragi-foreground, #111827)',
        fontFamily: 'var(--bragi-font-family, inherit)',
        ...style,
      }}
    >
      <header
        style={{
          display: 'flex',
          flex: '0 0 auto',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--bragi-nav-gap, 12px)',
          minHeight: 'var(--bragi-navbar-height, 64px)',
          padding: '8px var(--bragi-nav-padding, 16px)',
          borderBottom: '1px solid var(--bragi-border, #d1d5db)',
          background: 'var(--bragi-nav-background, #fff)',
          boxSizing: 'border-box',
          position: sticky ? 'sticky' : undefined,
          top: sticky ? 0 : undefined,
          zIndex: sticky ? 10 : undefined,
        }}
      >
        <button
          type="button"
          aria-label={isCollapsed ? 'Expandir menú lateral' : 'Contraer menú lateral'}
          aria-expanded={!isCollapsed}
          aria-controls={sidebarId}
          onClick={() => changeCollapsed(!isCollapsed)}
          style={iconButtonStyle}
        >
          <svg
            aria-hidden="true"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div
          data-testid="navbar-brand"
          style={{ display: 'inline-flex', alignItems: 'center', minHeight: 40, fontWeight: 700 }}
        >
          {brand}
        </div>
        {isNavbarItemArray(topLeftItems)
          ? topLeftItems.length > 0 && (
              <nav
                aria-label="Navegación principal"
                style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 4 }}
              >
                {topLeftItems.map((item) => (
                  <MenuItem key={item.id} item={item} reducedMotion={reducedMotion} />
                ))}
              </nav>
            )
          : topLeftItems}
        {search && (
          // biome-ignore lint/a11y/useSemanticElements: <search> is a valid alternative, but React's DOM tag whitelist doesn't recognize it yet and logs a false "unrecognized tag" warning in React 18/19, which this library's consumers would see
          <form
            role="search"
            onSubmit={(event) => {
              event.preventDefault();
              search.onSubmit(query.trim());
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              flex: '1 1 180px',
              maxWidth: 360,
            }}
          >
            <input
              type="search"
              aria-label={search.label ?? 'Buscar'}
              placeholder={search.placeholder ?? 'Buscar'}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              style={{
                flex: 1,
                minWidth: 0,
                minHeight: 40,
                padding: '8px 12px',
                border: '1px solid var(--bragi-border, #d1d5db)',
                borderRadius: 'var(--bragi-radius-sm, 6px)',
                background: 'var(--bragi-surface, #fff)',
                color: 'var(--bragi-foreground, #111827)',
                font: 'inherit',
              }}
            />
            <button type="submit" aria-label="Enviar búsqueda" style={iconButtonStyle}>
              ⌕
            </button>
          </form>
        )}
        {topRightItems.length > 0 && (
          <nav
            aria-label="Navegación secundaria"
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 4,
              marginLeft: 'auto',
            }}
          >
            {topRightItems.map((item) => (
              <MenuItem key={item.id} item={item} reducedMotion={reducedMotion} />
            ))}
          </nav>
        )}
      </header>
      <div style={{ display: 'flex', flex: '1 1 auto', alignItems: 'stretch', minWidth: 0 }}>
        <aside
          id={sidebarId}
          aria-label={sidebarLabel}
          data-collapsed={isCollapsed}
          style={{
            flex: '0 0 auto',
            width: isCollapsed
              ? 'var(--bragi-sidebar-collapsed-width, 64px)'
              : 'var(--bragi-sidebar-width, 240px)',
            padding: '12px 8px',
            borderRight: '1px solid var(--bragi-border, #d1d5db)',
            background: 'var(--bragi-sidebar-background, #f3f4f6)',
            boxSizing: 'border-box',
            position: sticky ? 'sticky' : undefined,
            top: sticky ? 'var(--bragi-navbar-height, 64px)' : undefined,
            height: sticky ? 'calc(100dvh - var(--bragi-navbar-height, 64px))' : undefined,
            overflowY: sticky ? 'auto' : undefined,
            transition: reducedMotion ? 'none' : 'width var(--bragi-motion-duration, 220ms) ease',
          }}
        >
          <nav aria-label={sidebarLabel}>
            {sidebarSections.map((section, index) => (
              <section
                key={section.id}
                aria-label={section.label || undefined}
                style={{
                  borderTop: index ? '1px solid var(--bragi-border, #d1d5db)' : undefined,
                  paddingTop: index ? 12 : 0,
                  marginTop: index ? 12 : 0,
                }}
              >
                {section.label && (
                  <SidebarSectionHeading
                    label={section.label}
                    isCollapsed={isCollapsed}
                    reducedMotion={reducedMotion}
                  />
                )}
                <div style={{ display: 'grid', gap: 4 }}>
                  {section.items.map((item) => (
                    <MenuItem
                      key={item.id}
                      item={item}
                      iconOnly={isCollapsed}
                      inSidebar
                      reducedMotion={reducedMotion}
                    />
                  ))}
                </div>
              </section>
            ))}
          </nav>
        </aside>
        <main
          style={{
            flex: '1 1 0',
            minWidth: 0,
            background: 'var(--bragi-workspace-background, #fff)',
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};
