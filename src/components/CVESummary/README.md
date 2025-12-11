# CVESummary Component

Una librería de componentes React que busca y muestra información detallada sobre vulnerabilidades CVE desde el repositorio oficial de CVE Project en GitHub.

## ✨ Características

- 📊 Consulta datos de CVE desde el repositorio oficial de CVE Project
- ⚡ Basado en React Query para manejo eficiente de caché y estado
- 🎨 Interfaz moderna con **Ant Design 6.1.0**
- 🔒 Muestra información de seguridad incluyendo puntuaciones CVSS
- 📱 Fully responsive design
- ⌨️ TypeScript completo
- 🏗️ Arquitectura modular de 5 capas

## 📦 Instalación

```bash
npm install bragiui @tanstack/react-query antd
```

## 🚀 Uso Básico

```tsx
import { CVESummary } from 'bragiui';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider>
        <CVESummary cve="CVE-2025-36000" />
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default App;
```

## 📋 Props

### CVESummary

| Prop | Type | Requerido | Descripción |
|------|------|-----------|-------------|
| `cve` | `string` | Sí | ID del CVE a buscar (formato: `CVE-YYYY-XXXXX`) |

## 📝 Formato de CVE

El componente acepta CVEs en el formato estándar:
- **Formato válido**: `CVE-2025-36000`
- **Patrón**: `CVE-YYYY-XXXXX` (donde X son números)

## 🎨 Estilos con Ant Design

El componente está completamente estilizado con Ant Design 6.1.0 incluyendo:

- **Cards**: Para contener secciones de información
- **Tags**: Para mostrar severidad CVSS con colores
- **Dividers**: Para separar secciones
- **Typography**: Para jerarquía de texto
- **Buttons**: Para referencias y enlaces
- **Row/Col Grid**: Para layout responsive
- **Alert**: Para mostrar errores
- **Empty**: Para estados vacíos
- **Skeleton**: Para estados de carga

## 🔴 Severidad CVSS

La severidad se muestra con colores usando tags de Ant Design:

- 🔴 **CRITICAL** (9.0-10.0)
- 🟠 **HIGH** (7.0-8.9)
- 🟡 **MEDIUM** (4.0-6.9)
- 🟢 **LOW** (0.1-3.9)
- 🔵 **INFO/NONE**

## 📚 Componentes Incluidos

### CVESummary
- Componente principal
- Muestra toda la información de una vulnerabilidad CVE

### CVESummarySkeleton
- Componente de carga
- Utiliza Ant Design Skeleton para animación fluida
- Se muestra mientras se cargan los datos

## 🧪 Testing

El componente incluye tests unitarios con Jest y React Testing Library:

```bash
npm test
```
- **Formato inválido**: `2025-36000` o `CVE-25-36000`

## Información Mostrada

El componente muestra la siguiente información cuando está disponible:

1. **ID del CVE** - Identificador único
2. **Título** - Nombre de la vulnerabilidad
3. **Descripción** - Detalles técnicos
4. **Puntuación CVSS** - Severidad de la vulnerabilidad (CRITICAL, HIGH, MEDIUM, LOW)
5. **Fecha de Publicación** - Cuándo se publicó
6. **Fecha de Actualización** - Última actualización
7. **Productos Afectados** - Lista de productos y versiones vulnerables
8. **Referencias** - Enlaces a información adicional

## Estados del Componente

El componente maneja automáticamente varios estados:

- **Vacío** - Cuando no se proporciona un CVE ID
- **Cargando** - Mientras se consultan los datos
- **Error** - Si no se puede obtener la información o el CVE no existe
- **Datos** - Cuando la información se carga correctamente

## Ejemplo Completo

```tsx
import React, { useState } from 'react';
import { CVESummary } from 'bragiui';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function CVELookup() {
  const [cveId, setCveId] = useState('CVE-2025-36000');

  return (
    <QueryClientProvider client={queryClient}>
      <div style={{ padding: '20px', maxWidth: '800px' }}>
        <h1>Buscador de CVE</h1>
        
        <input
          type="text"
          value={cveId}
          onChange={(e) => setCveId(e.target.value)}
          placeholder="Ingresa CVE ID (ej: CVE-2025-36000)"
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '20px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        />

        <CVESummary cve={cveId} />
      </div>
    </QueryClientProvider>
  );
}

export default CVELookup;
```

## Dependencias

El componente requiere las siguientes dependencias:

- `react` >= 19.2.0
- `react-dom` >= 19.2.0
- `@tanstack/react-query` >= 5.0.0

## Fuente de Datos

Los datos provienen del repositorio oficial de CVE Project en GitHub:
```
https://raw.githubusercontent.com/CVEProject/cvelistV5/refs/heads/main/cves/{YEAR}/{XXXxx}/{CVE-ID}.json
```

## Notas Técnicas

- El componente utiliza React Query para caché inteligente de datos
- Las consultas se realizan bajo demanda solo cuando se proporciona un CVE válido
- Los datos se cachean automáticamente por React Query
- El componente es completamente tipado con TypeScript

## Tratamiento de Errores

El componente muestra mensajes de error claros para:

- Formato de CVE inválido
- CVE no encontrado (404)
- Fallos de conexión
- Otros errores de red

## Licencia

MIT
