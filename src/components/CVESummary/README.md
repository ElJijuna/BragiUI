# CVESummary

`CVESummary` es un componente presentacional. No realiza solicitudes HTTP, no conoce el origen de los datos y no depende de React Query.

## Uso

La aplicación obtiene los datos y entrega el resultado al componente:

```tsx
import { CVESummary, type CVEData } from 'bragiui';

function CveView({ data, isLoading, error }: {
  data: CVEData | null;
  isLoading: boolean;
  error: Error | null;
}) {
  return <CVESummary data={data} loading={isLoading} error={error} />;
}
```

El consumidor puede usar `fetch`, React Query, SWR, Redux, Server Components o cualquier otra estrategia de datos.

## Props

| Prop | Tipo | Descripción |
| --- | --- | --- |
| `data` | `CVEData \| null` | Datos CVE ya cargados. |
| `loading` | `boolean` | Muestra el skeleton mientras el consumidor carga datos. |
| `error` | `Error \| null` | Muestra el estado de error proporcionado por el consumidor. |

## Estados

- Sin `data`: estado vacío.
- `loading={true}`: estado de carga.
- `error`: estado de error.
- `data`: contenido del CVE.

La librería sólo renderiza la interfaz; el almacenamiento, caché, validación y recuperación de datos pertenecen a la aplicación consumidora.
