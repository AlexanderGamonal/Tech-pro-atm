# TECH PRO ATM

Catálogo técnico de campo para cajeros automáticos NCR. PWA instalable, funciona offline.

## Dispositivos soportados

| Dispositivo | Errores | Partes | LEDs | Diagnóstico |
|------------|---------|--------|------|-------------|
| NCR S2 Dispenser | ✅ | ✅ | ✅ | ✅ |
| NCR BRM Reciclador | ✅ | ✅ | ✅ | ✅ |

## Funcionalidades

- Búsqueda y decodificación de M-Status / M-Data
- Catálogo de partes con imágenes de referencia
- Referencia de LEDs e indicadores por módulo
- Modo árbol por componente estructural
- Favoritos persistentes
- Tema claro / oscuro
- Instalable como app (PWA)

## Stack

- React 19 + Vite 8
- vite-plugin-pwa (Workbox)
- Sin dependencias de UI — estilos propios

## Setup local

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # producción en dist/
npm run preview  # preview del build
```

## Estructura

```
src/
├── views/          # Vistas por sección (lazy-loaded)
├── data/
│   └── devices/
│       └── ncr/
│           ├── brm/   # Datos BRM: errores, partes, LEDs, comandos
│           └── s2/    # Datos S2: errores, partes, árbol
├── components/     # UI reutilizable
├── hooks/          # useFavorites
└── theme.js        # Variables de color y tipografía
```
