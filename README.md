# BreveMente — Frontend

SPA dedicada a salud mental. React 19 + Vite 7 + React Router 7. **Versión 2**
con paleta azul neural restaurada y logos BreveMente originales.

## Levantar en local

```bash
cp .env.example .env   # ya viene configurado para brevemente
npm install
npm run dev            # http://localhost:5175
```

El proxy de Vite enruta `/api → http://127.0.0.1:4002` (Brevemente_Api).

## Variables clave

| Variable | Valor |
|---|---|
| `VITE_BRAND` | `brevemente` |
| `VITE_API_BASE_URL` | `/api` (dev) / FQDN del backend (prod) |

## Stack

- **UI**: React 19 + Vite 7 + React Router 7
- **Estilos**: CSS custom properties · paleta `--bm-blue-neural` `#304768` + `--bm-blue-conciencia` `#75AFBC`
- **Tipografía**: Inclusive Sans
- **Animación**: Framer Motion
- **Iconos**: Lucide React

## Brand

Editable en [`src/config/brand.js`](src/config/brand.js).
Logos en [`src/assets/brand/`](src/assets/brand/).

## Deploy

- Producción: cualquier host estático (Vercel, Firebase, Cloudflare Pages)
- Build: `npm run build` → `dist/`
