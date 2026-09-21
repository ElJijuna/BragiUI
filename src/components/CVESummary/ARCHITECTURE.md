# CVESummary - Arquitectura

`CVESummary` sigue un modelo presentacional: recibe datos y estados desde el consumidor y sólo renderiza la interfaz.

```text
Aplicación consumidora
  ├─ obtiene datos con la estrategia elegida
  ├─ gestiona caché, errores y cancelación
  └─ entrega data/loading/error
          |
          v
      CVESummary
          |
          └─ renderiza empty, loading, error o contenido
```

## Contrato

```tsx
interface CVESummaryProps {
  data?: CVEData | null;
  loading?: boolean;
  error?: Error | null;
}
```

No hay imports de `fetch`, React Query ni clientes HTTP en el árbol del componente. Esta separación permite usar la librería con cualquier arquitectura de datos y evita duplicar providers o caches dentro del bundle de UI.
