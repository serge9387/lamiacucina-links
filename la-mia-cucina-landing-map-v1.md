# La Mia Cucina — Landing Page Map v1

> Documento generado el 2026-05-15. Basado en lectura directa del código fuente. No contiene suposiciones.

---

## Tabla de contenidos

1. [Estructura de carpetas](#1-estructura-de-carpetas)
2. [Páginas y rutas](#2-páginas-y-rutas)
3. [Componentes y lógica por archivo](#3-componentes-y-lógica-por-archivo)
4. [Stack técnico](#4-stack-técnico)
5. [Estilos y design system](#5-estilos-y-design-system)
6. [Integraciones externas](#6-integraciones-externas)
7. [Variables de entorno](#7-variables-de-entorno)
8. [Archivos de configuración](#8-archivos-de-configuración)
9. [Assets públicos](#9-assets-públicos)
10. [SEO y metadatos](#10-seo-y-metadatos)
11. [Lógica de negocio relevante](#11-lógica-de-negocio-relevante)

---

## 1. Estructura de carpetas

```
lamiacucina-links/
├── app/
│   ├── globals.css                        # Reset global + fuente base + color de fondo
│   ├── layout.js                          # Root layout: metadata, Analytics, SpeedInsights
│   ├── page.js                            # Landing page principal (/)
│   ├── not-found.js                       # Página 404 personalizada
│   ├── sitemap.js                         # Generador de sitemap.xml
│   └── recipe/
│       └── [id]/
│           └── page.js                    # Página dinámica de receta individual
├── lib/
│   └── supabase.js                        # Cliente Supabase (singleton)
├── public/
│   ├── .well-known/
│   │   └── apple-app-site-association     # Config Universal Links iOS
│   ├── images/
│   │   ├── chef-mia.png                   # Avatar de Chef Mía
│   │   └── F5D5CD95-35FA-42D7-B390-7A3F46D7A29C_1_201_a.jpeg  # Mockup de pantalla del iPhone
│   └── robots.txt                         # Directivas para crawlers
├── jsconfig.json                          # Opciones del compilador JS
├── next.config.mjs                        # Configuración de Next.js
├── package.json                           # Dependencias y scripts
├── package-lock.json                      # Versiones bloqueadas
├── vercel.json                            # Configuración de Vercel (redirects, headers)
└── README.md                              # README mínimo (sin contenido significativo)
```

---

## 2. Páginas y rutas

| Ruta | Archivo | Tipo | Propósito |
|------|---------|------|-----------|
| `/` | `app/page.js` | Server Component | Landing page completa de la app |
| `/recipe/[id]` | `app/recipe/[id]/page.js` | Server Component dinámico | Detalle de una receta (deep link desde iOS) |
| `/sitemap.xml` | `app/sitemap.js` | Generado automáticamente | SEO sitemap |
| `404` | `app/not-found.js` | Catch-all | Error 404 personalizado |

### Nota sobre el routing

El proyecto usa el **App Router** de Next.js 15. No hay Pages Router. Todas las páginas son Server Components por defecto — no hay `"use client"` en ningún archivo.

---

## 3. Componentes y lógica por archivo

### `app/layout.js` — Root Layout

```js
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
```

**Responsabilidades:**
- Define el `metadata` global del sitio (título, descripción, OG, Twitter Card, Apple App meta)
- Envuelve toda la app en `<html lang="es">`
- Inyecta `<Analytics />` y `<SpeedInsights />` de Vercel en todas las páginas

**Metadata declarada aquí:**
- `metadataBase`: `https://lamiacucina.app`
- `title`: `La Mia Cucina — Tu colección personal de recetas`
- `description`: `App gratis para iPhone con recetas curadas de cocina italiana, colombiana, mexicana y más. Con Chef Mía, tu asistente IA personal.`
- `canonical`: `https://lamiacucina.app`
- `openGraph`: tipo `website`, locale `es_CO`, siteName `La Mia Cucina`
- `twitter`: card `summary_large_image`
- `icons`: PNG alojada en Supabase Storage
- Apple meta: `app-id=6757924220`

---

### `app/page.js` — Landing Page (`/`)

Página de más de 600 líneas. No usa componentes React importados — todo el HTML está en un único Server Component con un `<style>` inline al inicio.

#### Secciones en orden de renderizado

| # | Sección | Descripción |
|---|---------|-------------|
| 1 | `<style>` | Todas las clases CSS del landing (no hay Tailwind ni CSS modules) |
| 2 | Google Fonts | `<link>` a DM Sans en 4 pesos desde `fonts.googleapis.com` |
| 3 | **Hero** | Título, subtítulo, botón App Store, mockup iPhone |
| 4 | **Recetas destacadas** | Grid de 4 recetas fetched desde Supabase |
| 5 | **Chef Mía** | Sección de feature AI con mockup de chat |
| 6 | **Herramientas** | Tabs interactivas: conversor de medidas + calculadora de porciones |
| 7 | **Features** | 4 ítems de beneficios de la app |
| 8 | **CTA** | Botón de descarga con degradado |
| 9 | **FAQ** | 5 preguntas con respuestas en `<details>/<summary>` |
| 10 | **Footer** | Copyright + ubicación |
| 11 | JSON-LD | Schemas: `MobileApplication` + `FAQPage` |
| 12 | `<script>` | JavaScript inline para las herramientas interactivas |

#### Fetching de recetas destacadas

```js
const FEATURED_RECIPE_TITLES = [
  "Guacamole clásico",
  "Salteado de lomo",
  "Huevos al ajo",
  "Wrap Keto de pollo",
];

// Query Supabase: recipes donde title IN (...) AND is_published = true
// Fallback: si no hay resultados, trae las últimas 4 publicadas por created_at DESC
```

Campos seleccionados: `id, title, image_url, difficulty, total_time, prep_time, cook_time`

#### Helpers inline

```js
getDifficultyLabel(d)  // normaliza a "Fácil", "Medio", "Difícil"
getDifficultyStyle(d)  // retorna { background, color } por nivel
```

#### JavaScript interactivo (inline `<script>`)

Todo el JS está en un `<script>` al final del `<body>`. No hay React state.

**Conversor de medidas:**
- Soporta líquidos, harina, azúcar, mantequilla, arroz
- Tabla de lookup en gramos por ingrediente y unidad
- Unidades: `g`, `kg`, `ml`, `l`, `taza`, `tbsp`, `tsp`, `oz`
- Escucha eventos `change` e `input`

**Calculadora de porciones:**
- Input: porciones originales + porciones deseadas
- Output: factor de escala (ej: `Factor: 2×`)
- Escucha evento `input`

**Tab switching:**
- Dos paneles: `conversor` / `calculadora`
- Botones con clase `.tab-btn`, panel activo con clase `.active`
- Escucha `click`

---

### `app/recipe/[id]/page.js` — Receta dinámica (`/recipe/[id]`)

Server Component con generación de metadata dinámica.

#### Funciones exportadas

```js
export async function generateMetadata({ params })
export default async function RecipePage({ params })
```

#### `getRecipe(id)` — helper interno

```js
const { data, error } = await supabase
  .from("recipes")
  .select("*")
  .eq("id", id)
  .single();
```

Retorna `null` en error o si no hay datos.

#### Secciones renderizadas

| Sección | Detalle |
|---------|---------|
| Header sticky | Logo texto + botón App Store |
| Imagen hero | `next/image` con `priority`, aspect ratio 16:9, fallback emoji 🍽️ |
| Badge de dificultad | `DifficultyBadge(difficulty)` — colores hardcodeados por nivel |
| Badge de categoría | `CategoryBadge(category)` — fondo gris suave |
| Título (h1) | Nombre de la receta |
| Descripción | Texto libre |
| Grid de stats | 3 columnas: tiempo total, porciones, calorías (con emojis) |
| Ingredientes | Soporta formato JSON agrupado o array plano |
| Instrucciones | Lista numerada con círculos verdes |
| CTA final | Tarjeta con degradado + botón App Store |

#### Procesamiento de ingredientes

```js
// Si ingredients es un objeto → iterar por categorías
Object.entries(ingredients).map(([category, items]) => { ... })

// Si ingredients es un array → renderizar directo
ingredients.map((ing) => `${ing.amount} ${ing.unit} ${ing.name}`)
```

#### Metadata dinámica

```js
title: `${recipe.title} — La Mia Cucina`
description: recipe.description || `Receta de ${recipe.title} | ${recipe.total_time} | ${recipe.difficulty}`
openGraph.images: [{ url: recipe.image_url, width: 1200, height: 630 }]
```

---

### `app/not-found.js` — 404

Página mínima con emoji 🍽️, texto "Receta no encontrada" y enlace al App Store. Todo con estilos inline.

---

### `app/sitemap.js` — Sitemap

```js
export default function sitemap() {
  return [
    {
      url: "https://lamiacucina.app",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
```

Solo exporta la home. Las rutas `/recipe/[id]` **no están incluidas** en el sitemap.

---

### `app/globals.css` — Estilos base

```css
*, *::before, *::after { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
html {
  font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background-color: #F0FDF9;
}
body {
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
}
```

Todo lo demás está en estilos inline dentro de cada página.

---

### `lib/supabase.js` — Cliente Supabase

```js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

Singleton exportado. Usado directamente en los Server Components (no hay contexto React ni provider).

---

## 4. Stack técnico

### Dependencias de producción

| Paquete | Versión | Uso |
|---------|---------|-----|
| `next` | 15.2.6 | Framework (App Router) |
| `react` | ^18 | UI library |
| `react-dom` | ^18 | Rendering |
| `@supabase/supabase-js` | ^2.43.4 | Cliente de base de datos |
| `@vercel/analytics` | ^1.3.1 | Analytics web |
| `@vercel/speed-insights` | ^2.0.0 | Monitoreo Core Web Vitals |

### Sin dependencias de desarrollo relevantes

No hay TypeScript, no hay Tailwind, no hay ESLint configurado, no hay Prettier, no hay testing.

### Lenguaje

JavaScript puro (`.js`). No hay TypeScript en ningún archivo. `jsconfig.json` configura `jsx: "react-jsx"` (runtime automático de JSX).

---

## 5. Estilos y design system

### Paleta de colores

| Token (informal) | Valor | Dónde se usa |
|-----------------|-------|--------------|
| Verde primario | `#10B981` | Botones principales, badges "Fácil", iconos, círculos numerados |
| Rosa/fucsia | `#EC4899` | Botón App Store, sección Chef Mía, highlights |
| Verde fondo | `#F0FDF9` | Background global (`globals.css`) |
| Blanco | `#FFFFFF` | Cards, secciones alternadas |
| Gris texto | `#1F2937` | Body text principal |
| Gris suave | `#6B7280` | Texto secundario |
| Verde borde | `#D1FAE5` | Bordes de cards y separadores |
| Amarillo | `#F59E0B` / `#FEF3C7` | Badge dificultad "Medio" |
| Rojo | `#EF4444` / `#FEE2E2` | Badge dificultad "Difícil" |

### Tipografía

- **Fuente principal:** DM Sans (Google Fonts)
- **Pesos usados:** 400, 500, 700, 800
- **Fallback:** `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
- **Importación:** `<link>` en `page.js` con `display=swap`

### Espaciado (valores usados en el código)

- **Padding de secciones:** 48px–64px vertical, 24px–32px horizontal
- **Gap en grids:** 12px–20px
- **Padding interno de cards:** 16px–24px

### Border radius

- Botones pill: `999px`
- Cards grandes: `20px–24px`
- Badges: `8px–12px`
- Teléfono mockup: `34px`

### Arquitectura CSS

- **No hay Tailwind, CSS Modules, CSS-in-JS ni styled-components**
- `globals.css`: solo reset y base
- `page.js`: bloque `<style>` con todas las clases del landing
- `recipe/[id]/page.js`: estilos inline en JSX (`style={{ }}`)
- No se usan CSS custom properties (`--var`)
- Colores hardcodeados en cada lugar

### Interactividad visual

- Hover en recipe cards: `transform: translateY(-2px)` + `box-shadow`
- Transición en tabs: `background-color` con `transition: all 0.2s`
- Focus en inputs: `border-color: #10B981`
- Elementos `<details>/<summary>` para FAQ (comportamiento nativo del navegador)

---

## 6. Integraciones externas

### Supabase

| Parámetro | Valor |
|-----------|-------|
| URL | `https://xyxdgyqduvjsepzyblju.supabase.co` |
| Tabla principal | `recipes` |
| Auth | Anon key (solo lectura pública) |
| Storage | `https://xyxdgyqduvjsepzyblju.supabase.co/storage/v1/object/public/Assets/*` |

**Schema inferido de la tabla `recipes`:**

| Campo | Tipo inferido | Uso |
|-------|---------------|-----|
| `id` | UUID/string | Clave primaria, URL de receta |
| `title` | text | Nombre de la receta |
| `description` | text | Descripción larga |
| `image_url` | text | URL imagen (Supabase Storage) |
| `difficulty` | text | "fácil" / "medio" / "difícil" |
| `category` | text | Categoría de la receta |
| `total_time` | text/int | Tiempo total de preparación |
| `prep_time` | text/int | Tiempo de preparación |
| `cook_time` | text/int | Tiempo de cocción |
| `servings` | int | Porciones |
| `calories` | int | Calorías |
| `ingredients` | JSON | Array plano u objeto agrupado por categoría |
| `instructions` | JSON/text | Pasos numerados |
| `is_published` | boolean | Filtro de visibilidad |
| `created_at` | timestamp | Ordenamiento fallback |

### Vercel

- **Hosting:** Deploy automático desde git
- **Analytics:** `<Analytics />` en todas las páginas (no configurable por usuario)
- **SpeedInsights:** `<SpeedInsights />` en todas las páginas
- **Redirects:** `www.lamiacucina.app` → `lamiacucina.app` (301 permanente)
- **Headers custom:** `Content-Type: application/json` para `.well-known/apple-app-site-association`

### Apple App Store / Universal Links

- **App ID:** `6757924220`
- **Bundle ID:** `com.sardilav.lamiacucinapreview-io03r3`
- **Team ID:** `S92R2GX5Z7`
- **Deep link path:** `/recipe/*` → abre la app en la receta correspondiente
- **Configurado en:** `public/.well-known/apple-app-site-association`
- **Link de descarga:** `https://apps.apple.com/app/id6757924220`

### Google Fonts

- **Fuente:** DM Sans
- **URL:** `https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700;9..40,800&display=swap`
- **Importación:** `<link rel="preconnect">` + `<link rel="stylesheet">` en `page.js`

---

## 7. Variables de entorno

| Variable | Prefijo | Valor en código | Descripción |
|----------|---------|-----------------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `NEXT_PUBLIC_` | `https://xyxdgyqduvjsepzyblju.supabase.co` | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `NEXT_PUBLIC_` | (desde env) | Clave anónima pública |

No hay archivo `.env` en el repositorio. Las variables se gestionan en el dashboard de Vercel.

---

## 8. Archivos de configuración

### `next.config.mjs`

```js
images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "xyxdgyqduvjsepzyblju.supabase.co",
      pathname: "/storage/v1/object/public/**",
    },
  ],
},
```

Solo permite imágenes remotas desde Supabase Storage. Ningún otro dominio está habilitado para `next/image`.

### `jsconfig.json`

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "baseUrl": "."
  }
}
```

### `vercel.json`

```json
{
  "redirects": [
    {
      "source": "/:path*",
      "has": [{ "type": "host", "value": "www.lamiacucina.app" }],
      "destination": "https://lamiacucina.app/:path*",
      "permanent": true
    }
  ],
  "headers": [
    {
      "source": "/.well-known/apple-app-site-association",
      "headers": [{ "key": "Content-Type", "value": "application/json" }]
    }
  ]
}
```

### `robots.txt`

```
User-agent: *
Allow: /
Sitemap: https://lamiacucina.app/sitemap.xml
```

---

## 9. Assets públicos

| Archivo | Dimensiones usadas | Dónde |
|---------|-------------------|-------|
| `public/images/chef-mia.png` | 36×36, 28×28, 32×32 px | Sección Chef Mía, mockup de chat |
| `public/images/F5D5CD95-...jpeg` | 220×450 px (desktop) | Mockup iPhone en Hero |

Las imágenes de recetas vienen de Supabase Storage, no de `public/`.

---

## 10. SEO y metadatos

### Metadata estática (`layout.js`)

```
title:       "La Mia Cucina — Tu colección personal de recetas"
description: "App gratis para iPhone con recetas curadas de cocina italiana,
              colombiana, mexicana y más. Con Chef Mía, tu asistente IA personal."
canonical:   https://lamiacucina.app
og:type:     website
og:locale:   es_CO
twitter:card: summary_large_image
apple:       app-id=6757924220
```

### Metadata de la landing (`page.js`)

```
title:       "La Mia Cucina — Recetas para hacer en casa"
description: "Tu colección personal de recetas para hacer en casa.
              Italianas, mexicanas, colombianas y más."
```

### Metadata dinámica de recetas (`recipe/[id]/page.js`)

```
title:       "{recipe.title} — La Mia Cucina"
description: recipe.description || "Receta de {title} | {time} | {difficulty}"
og:image:    recipe.image_url  (1200×630)
```

### JSON-LD schemas (en `page.js`)

**MobileApplication:**
```json
{
  "@type": "MobileApplication",
  "name": "La Mia Cucina",
  "operatingSystem": "iOS",
  "applicationCategory": "FoodApplication",
  "offers": { "price": "0" },
  "downloadUrl": "https://apps.apple.com/app/id6757924220"
}
```

**FAQPage:** 5 preguntas y respuestas sobre la app (en español).

---

## 11. Lógica de negocio relevante

### Flujo de datos en la landing

```
Build time (Server Component)
  └── Supabase query: recipes WHERE title IN [...] AND is_published = true
        ├── Resultado: renderiza grid de recetas reales
        └── Sin resultado: query fallback → últimas 4 publicadas (ORDER BY created_at DESC)
```

### Flujo de datos en receta dinámica

```
Request time (Server Component)
  └── params.id → getRecipe(id) → Supabase query SELECT * FROM recipes WHERE id = ?
        ├── Resultado: renderiza página completa
        └── null: renderiza 404 implícito (not-found)
```

### Deep linking iOS

```
Usuario abre enlace lamiacucina.app/recipe/[id]
  ├── iOS con app instalada: apple-app-site-association → abre app en receta
  └── iOS sin app / web: renderiza recipe/[id]/page.js con CTA de descarga
```

### Herramienta de conversión (JS inline)

La tabla de conversión a gramos está hardcodeada en el `<script>`:

```js
const gramsTable = {
  liquidos: { taza: 240, tbsp: 15, tsp: 5, oz: 30, ml: 1, l: 1000, g: 1, kg: 1000 },
  harina:   { taza: 120, tbsp: 8,  tsp: 2.6, oz: 28.35, ml: 1, l: 1000, g: 1, kg: 1000 },
  azucar:   { taza: 200, tbsp: 12, tsp: 4, oz: 28.35, ml: 1, l: 1000, g: 1, kg: 1000 },
  mantequilla: { taza: 227, tbsp: 14, tsp: 4.7, oz: 28.35, g: 1, kg: 1000 },
  arroz:    { taza: 185, tbsp: 12, tsp: 4, oz: 28.35, g: 1, kg: 1000 },
};
```

La conversión siempre pasa por gramos como unidad intermedia.

---

*Fin del documento — la-mia-cucina-landing-map-v1.md*
