# CVESummary - Arquitectura y Diseño

## Visión General

El componente `CVESummary` es un componente React que realiza consultas a la API GitHub del CVE Project para mostrar información detallada sobre vulnerabilidades CVE específicas.

## Flujo de Datos

```
┌─────────────────────────────────────────────────────────────────┐
│                      CVESummary Component                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    Props: { cve: string }
                              │
                              ▼
                    useQuery Hook (React Query)
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
            Parse CVE ID         Construct URL
           (CVE-YYYY-XXXXX)   (GitHub Raw URL)
                    │                   │
                    └─────────┬─────────┘
                              │
                              ▼
                        Fetch Data
                    (fetch API)
                              │
                    ┌─────────┼─────────┐
                    │         │         │
                   ✓         ✗         ✗
                Error      Success    Network
                  │          │         Error
                  │          │         │
                  ▼          ▼         ▼
              Error UI    Success UI  Error UI
```

## Estructura de Componentes

```
CVESummary
├── Estado: Vacío
├── Estado: Cargando
├── Estado: Error
│   ├── Error de formato
│   ├── Error de red
│   └── CVE no encontrado
└── Estado: Éxito (Datos Cargados)
    ├── Encabezado (CVE ID)
    ├── Título
    ├── Descripción
    ├── CVSS Score (con color)
    ├── Fechas (Published/Updated)
    ├── Productos Afectados
    └── Referencias
```

## Flujo de Estados

```
                        ┌─────────────┐
                        │   START     │
                        └──────┬──────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
            CVE proporcionado?        No CVE
                    │                     │
                   Sí                     │
                    │                     │
                    ▼                     ▼
              Query Enabled           EMPTY STATE
                    │              "Please provide..."
                    │
                    ▼
               LOADING STATE
            "Loading CVE data..."
                    │
         ┌──────────┼──────────┐
         │          │          │
        ✓          ✗          ✗
      Success    Error       Network
        │         Format      Error
        │         Invalid      │
        │          │           │
        ▼          ▼           ▼
    SUCCESS    ERROR         ERROR
    STATE      STATE         STATE
   (Display) (Invalid CVE) (Network/404)
```

## Interfaz de Datos

### Input Props
```typescript
interface CVESummaryProps {
  cve: string;  // Formato: "CVE-YYYY-XXXXX"
}
```

### Output Data
```typescript
interface CVEData {
  data: {
    cveMetadata: {
      cveId: string;
      assignerOrgName: string;
      assignerShortName: string;
      dateReserved: string;
      datePublished: string;
      dateUpdated: string;
    };
    containers: {
      cna?: {
        title?: string;
        description?: string;
        affected?: Array<{
          product: string;
          vendor?: string;
          versions?: Array<{
            version: string;
            lessThan?: string;
            lessThanOrEqual?: string;
            status: string;
          }>;
        }>;
        references?: Array<{
          url: string;
          name?: string;
        }>;
        credits?: Array<{
          lang: string;
          value: string;
        }>;
      };
      adp?: Array<{
        providerMetadata: {
          orgId: string;
          shortName: string;
        };
        impacts?: Array<{
          cvssV3_1?: {
            baseScore: number;
            baseSeverity: string;
          };
        }>;
      }>;
    };
  };
}
```

## Lógica de Construcción de URL

```
Input:  CVE-2025-36000
         ↓
Parse:  year = 2025, number = 36000
         ↓
Extract: numberPrefix = "36xxx"
         ↓
Output: https://raw.githubusercontent.com/CVEProject/cvelistV5/
        refs/heads/main/cves/2025/36xxx/CVE-2025-36000.json
```

## Integración de React Query

### Configuración
```typescript
useQuery({
  queryKey: ['cve', cve],      // Cache key basado en CVE ID
  queryFn: () => fetchCVEData(cve),  // Función de fetch
  enabled: Boolean(cve),         // Solo ejecutar si cve no está vacío
})
```

### Ventajas de React Query
- ✓ Caché automático
- ✓ Manejo de errores robusto
- ✓ Estados de carga automáticos
- ✓ Retry automático en errores
- ✓ Sincronización con el servidor
- ✓ DevTools para debugging

## Manejo de Errores

```
Fetch Request
    │
    ├─→ Invalid Format (RegExp fail)
    │   └─→ Error: "Invalid CVE format. Use CVE-YYYY-XXXXX"
    │
    ├─→ Network Error
    │   └─→ Error: "Failed to fetch CVE data: {statusText}"
    │
    ├─→ 404 Not Found
    │   └─→ Error: "Failed to fetch CVE data: Not Found"
    │
    ├─→ 500 Server Error
    │   └─→ Error: "Failed to fetch CVE data: Internal Server Error"
    │
    └─→ Success
        └─→ Parse JSON y mostrar datos
```

## Validación de CVE

```typescript
// Regex para validar formato CVE
const match = cveId.match(/CVE-(\d{4})-(\d+)/);

// Valida:
✓ CVE-2025-36000     // Correcto
✓ CVE-1999-1234      // Correcto
✓ CVE-2024-50582     // Correcto

// No valida:
✗ 2025-36000         // Falta "CVE-"
✗ CVE-25-36000       // Año incorrecto (debe ser 4 dígitos)
✗ CVE-2025-ABC       // Número inválido (debe ser numérico)
✗ INVALID-CVE        // Formato completamente inválido
```

## Mapa de Colores CVSS

```
Severidad     Color       Rango
─────────────────────────────────
CRITICAL      Rojo        9.0-10.0
#d32f2f
─────────────────────────────────
HIGH          Naranja     7.0-8.9
#f57c00
─────────────────────────────────
MEDIUM        Amarillo    4.0-6.9
#fbc02d
─────────────────────────────────
LOW           Verde       0.1-3.9
#388e3c
```

## Flujo de Rendering

```
Componente Montado
    │
    ▼
Verificar prop 'cve'
    │
    ├─→ Vacío → Mostrar EMPTY STATE
    │
    └─→ Válido → useQuery Hook
         │
         ▼
      Loading... → Mostrar LOADING STATE
         │
         ├─→ Error → Mostrar ERROR STATE
         │   │
         │   ├─→ Formato inválido
         │   ├─→ CVE no encontrado (404)
         │   └─→ Error de red
         │
         └─→ Success → Mostrar SUCCESS STATE
             │
             ├─→ Metadatos CVE
             ├─→ Información CNA
             ├─→ Datos CVSS (si disponible)
             ├─→ Productos afectados
             └─→ Referencias
```

## Performance Considerations

### Caché de React Query
- **staleTime**: Datos frescos sin refetch inmediato
- **gcTime**: Mantener datos en caché cuando no se usan
- **retry**: Reintentar automáticamente en fallos

### Optimizaciones Implementadas
1. **Caché por CVE ID**: No refetch si el mismo CVE se consulta nuevamente
2. **Lazy Query**: Solo consulta si se proporciona un CVE válido
3. **No re-renders innecesarios**: Solo actualiza cuando hay cambio en datos
4. **Fetch eficiente**: Una sola solicitud por CVE (gracias a React Query)

## Dependencias

```
CVESummary
├── react (^19.2.0)
│   └── React Core Library
├── @tanstack/react-query (^5.90.12)
│   └── Query Management & Caching
└── GitHub API (externa)
    └── https://raw.githubusercontent.com/CVEProject/cvelistV5
```

## Casos de Uso

### 1. Búsqueda Manual
```
Usuario ingresa CVE → Fetch → Display
```

### 2. Monitoreo Automático
```
App monitorea vulnerabilidades → CVESummary actualiza → Display
```

### 3. Análisis de Riesgos
```
Escanea productos → Obtiene CVEs → CVESummary muestra severidad
```

## Extensiones Futuras Posibles

1. **Caché Local**: Almacenar CVEs consultados en localStorage
2. **Comparación**: Ver múltiples CVEs lado a lado
3. **Historial**: Guardar búsquedas recientes
4. **Filtros**: Filtrar por severidad, fecha, etc.
5. **Notificaciones**: Alertas sobre nuevos CVEs
6. **Export**: Descargar información como PDF/CSV
7. **Traducciones**: Soporte multiidioma
8. **Gráficos**: Visualizar tendencias de vulnerabilidades

## Testing Strategy

```
Unit Tests
├── Componente renderiza correctamente
├── Estados se muestran apropiadamente
├── Errores se manejan correctamente
└── Datos se muestran correctamente

Integration Tests
├── React Query integra correctamente
├── Fetch API funciona
└── Estados transicionan correctamente

E2E Tests
├── Usuario puede cambiar CVE
├── Datos se cargan y muestran
└── Navegación funciona

Storybook
├── Visualización de estados
├── Documentación de interacciones
└── Pruebas manuales
```

---

Esta arquitectura garantiza:
- ✓ Mantenibilidad
- ✓ Escalabilidad
- ✓ Testabilidad
- ✓ Rendimiento
- ✓ Confiabilidad
