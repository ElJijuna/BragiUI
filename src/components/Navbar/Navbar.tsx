import React, { useId, useState } from 'react';

export interface NavbarItem {
  id: string;
  label: string;
  href?: string;
  onSelect?: () => void;
  icon?: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
}

export interface NavbarSection {
  id: string;
  label: string;
  items: Array<NavbarItem & { icon: React.ReactNode }>;
}

export interface NavbarSearch {
  placeholder?: string;
  label?: string;
  onSubmit: (query: string) => void;
}

export interface NavbarProps {
  brand: React.ReactNode;
  topLeftItems?: NavbarItem[];
  topRightItems?: NavbarItem[];
  sidebarSections?: NavbarSection[];
  search?: NavbarSearch;
  children?: React.ReactNode;
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  className?: string;
  style?: React.CSSProperties;
  sidebarLabel?: string;
}

const iconButtonStyle: React.CSSProperties = {
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

function MenuItem({ item, iconOnly = false }: { item: NavbarItem; iconOnly?: boolean }) {
  const content = (
    <>
      {item.icon && <span aria-hidden="true" style={{ display: 'inline-flex', flexShrink: 0 }}>{item.icon}</span>}
      {!iconOnly && <span>{item.label}</span>}
    </>
  );
  const commonStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: iconOnly ? 'center' : 'flex-start',
    gap: 10,
    minHeight: 40,
    minWidth: iconOnly ? 40 : undefined,
    padding: iconOnly ? 8 : '8px 12px',
    borderRadius: 'var(--bragi-radius-sm, 6px)',
    color: item.active ? 'var(--bragi-nav-active-foreground, #1d4ed8)' : 'var(--bragi-foreground, #111827)',
    background: item.active ? 'var(--bragi-nav-active-background, #eff6ff)' : 'transparent',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
  };
  const accessibleName = iconOnly ? item.label : undefined;
  if (item.disabled) {
    return <span aria-disabled="true" aria-label={accessibleName} title={iconOnly ? item.label : undefined} style={{ ...commonStyle, opacity: 0.5, cursor: 'not-allowed' }}>{content}</span>;
  }
  if (item.href) {
    return <a href={item.href} onClick={item.onSelect} aria-current={item.active ? 'page' : undefined} aria-label={accessibleName} title={iconOnly ? item.label : undefined} style={commonStyle}>{content}</a>;
  }
  return <button type="button" onClick={item.onSelect} aria-current={item.active ? 'page' : undefined} aria-label={accessibleName} title={iconOnly ? item.label : undefined} style={{ ...commonStyle, border: 0, font: 'inherit', cursor: 'pointer' }}>{content}</button>;
}

export function Navbar({
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
}: NavbarProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
  const [query, setQuery] = useState('');
  const sidebarId = useId();
  const isCollapsed = collapsed ?? internalCollapsed;

  const changeCollapsed = (next: boolean) => {
    if (collapsed === undefined) setInternalCollapsed(next);
    onCollapsedChange?.(next);
  };

  return (
    <div className={className} style={{ color: 'var(--bragi-foreground, #111827)', fontFamily: 'var(--bragi-font-family, inherit)', ...style }}>
      <header style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--bragi-nav-gap, 12px)', minHeight: 'var(--bragi-navbar-height, 64px)', padding: '8px var(--bragi-nav-padding, 16px)', borderBottom: '1px solid var(--bragi-border, #d1d5db)', background: 'var(--bragi-nav-background, #fff)', boxSizing: 'border-box' }}>
        <button type="button" aria-label={isCollapsed ? 'Expandir menú lateral' : 'Contraer menú lateral'} aria-expanded={!isCollapsed} aria-controls={sidebarId} onClick={() => changeCollapsed(!isCollapsed)} style={iconButtonStyle}>
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
        <div data-testid="navbar-brand" style={{ display: 'inline-flex', alignItems: 'center', minHeight: 40, fontWeight: 700 }}>{brand}</div>
        {topLeftItems.length > 0 && <nav aria-label="Navegación principal" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 4 }}>{topLeftItems.map(item => <MenuItem key={item.id} item={item} />)}</nav>}
        {search && <form role="search" onSubmit={event => { event.preventDefault(); search.onSubmit(query.trim()); }} style={{ display: 'flex', alignItems: 'center', gap: 4, flex: '1 1 180px', maxWidth: 360 }}>
          <input type="search" aria-label={search.label ?? 'Buscar'} placeholder={search.placeholder ?? 'Buscar'} value={query} onChange={event => setQuery(event.target.value)} style={{ flex: 1, minWidth: 0, minHeight: 40, padding: '8px 12px', border: '1px solid var(--bragi-border, #d1d5db)', borderRadius: 'var(--bragi-radius-sm, 6px)', background: 'var(--bragi-surface, #fff)', color: 'var(--bragi-foreground, #111827)', font: 'inherit' }} />
          <button type="submit" aria-label="Enviar búsqueda" style={iconButtonStyle}>⌕</button>
        </form>}
        {topRightItems.length > 0 && <nav aria-label="Navegación secundaria" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 4, marginLeft: 'auto' }}>{topRightItems.map(item => <MenuItem key={item.id} item={item} />)}</nav>}
      </header>
      <div style={{ display: 'flex', alignItems: 'stretch', minWidth: 0 }}>
        <aside id={sidebarId} aria-label={sidebarLabel} data-collapsed={isCollapsed} style={{ flex: '0 0 auto', width: isCollapsed ? 'var(--bragi-sidebar-collapsed-width, 64px)' : 'var(--bragi-sidebar-width, 240px)', padding: '12px 8px', borderRight: '1px solid var(--bragi-border, #d1d5db)', background: 'var(--bragi-sidebar-background, #fff)', boxSizing: 'border-box' }}>
          <nav aria-label={sidebarLabel}>
            {sidebarSections.map((section, index) => (
              <section key={section.id} aria-label={section.label} style={{ borderTop: index ? '1px solid var(--bragi-border, #d1d5db)' : undefined, paddingTop: index ? 12 : 0, marginTop: index ? 12 : 0 }}>
                {!isCollapsed && <h2 style={{ margin: '8px 12px', color: 'var(--bragi-muted, #6b7280)', fontSize: 'var(--bragi-sidebar-heading-size, 12px)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{section.label}</h2>}
                <div style={{ display: 'grid', gap: 4 }}>{section.items.map(item => <MenuItem key={item.id} item={item} iconOnly={isCollapsed} />)}</div>
              </section>
            ))}
          </nav>
        </aside>
        {children !== undefined && <main style={{ flex: '1 1 0', minWidth: 0 }}>{children}</main>}
      </div>
    </div>
  );
}
