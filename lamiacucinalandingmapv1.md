# lamiacucinalandingmapv1.md
# Mapa técnico del sitio web — La Mia Cucina
**Fecha:** 2026-05-26  
**Repositorio:** serge9387/lamiacucina-links  
**Commit base:** 6a396ef71efe7196da6562d49ff626f91cbd3144

---

## 1. Estructura de carpetas

```
lamiacucina-links/
├── app/
│   ├── layout.js               # Root layout (metadata global, fuente, analytics)
│   ├── page.js                 # Home / landing page principal
│   ├── globals.css             # Reset CSS global mínimo
│   ├── sitemap.js              # Generador de sitemap.xml
│   ├── not-found.js            # Página 404 personalizada
│   └── recipe/
│       └── [id]/
│           └── page.js         # Página de detalle de receta (dinámica)
├── lib/
│   └── supabase.js             # (importado en recipe/[id]/page.js — cliente Supabase compartido)
├── public/
│   ├── robots.txt
│   └── images/
│       ├── chef-mia.png        # Avatar de Chef Mía (IA)
│       └── F5D5CD95-35FA-42D7-B390-7A3F46D7A29C_1_201_a.jpeg  # Screenshot app (hero)
├── next.config.mjs
├── vercel.json
└── package.json
```

> Nota: `lib/supabase.js` no estaba en la lista de archivos solicitados pero es referenciado explícitamente en `app/recipe/[id]/page.js`.

---

## 2. Páginas y rutas

| Ruta | Archivo | Tipo | Descripción |
|---|---|---|---|
| `/` | `app/page.js` | Server Component (async) | Landing page completa de la app |
| `/recipe/[id]` | `app/recipe/[id]/page.js` | Server Component (async + dynamic) | Detalle de receta individual |
| `/sitemap.xml` | `app/sitemap.js` | Sitemap automático Next.js | Solo indexa `/` |
| `/not-found` / 404 | `app/not-found.js` | Client Component | Página de error 404 |

### Ruta dinámica `/recipe/[id]`

El parámetro `[id]` corresponde al `id` UUID de la tabla `recipes` en Supabase. Si el registro no existe, llama a `notFound()` de Next.js para servir la página 404.

---

## 3. Componentes y lógica por archivo

### `app/layout.js`

Root layout que envuelve toda la aplicación.

```js
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { DM_Sans } from 'next/font/google';
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700', '800'],
  display: 'swap',
});

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={dmSans.className}>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
```

**Responsabilidades:**
- Aplica la fuente `DM Sans` (Google Fonts) globalmente vía `next/font/google`
- Inyecta `@vercel/analytics` y `@vercel/speed-insights` en todas las páginas
- Define `metadata` global con canonical, OG, Twitter Card y Smart App Banner de iOS

---

### `app/page.js`

Página principal (Server Component async). Contiene toda la landing page en un solo archivo.

**Estructura de secciones:**

1. `HERO` — Headline + CTA App Store + mockup de teléfono
2. `RECIPES` — Grid 2×2 con recetas destacadas (datos de Supabase con fallback estático)
3. `CHEF MÍA` — Sección IA con chat simulado
4. `TOOLS` — Herramientas interactivas (conversor de medidas + calculadora de porciones)
5. `FEATURES` — Lista de beneficios de la app
6. `CTA` — Bloque de descarga final
7. `FAQ` — Preguntas frecuentes con `<details>` nativo + JSON-LD FAQPage
8. `FOOTER`

**Lógica de carga de recetas:**

```js
// Intento 1: recetas específicas por título (las 4 destacadas)
const { data } = await supabase
  .from('recipes')
  .select('id, title, image_url, difficulty, total_time, prep_time, cook_time')
  .eq('is_published', true)
  .in('title', FEATURED_RECIPE_TITLES)
  .limit(4);

// Intento 2 (fallback): las 4 más recientes si el intento 1 falla o retorna vacío
const { data } = await supabase
  .from('recipes')
  .select('id, title, image_url, difficulty, total_time, prep_time, cook_time')
  .eq('is_published', true)
  .order('created_at', { ascending: false })
  .limit(4);
```

**Recetas estáticas (fallback visual):**

```js
const STATIC_CARDS = [
  { title: 'Guacamole', diff: 'Fácil', time: 10, bg: '#d4f0e4', emoji: '🥑' },
  { title: 'Salteado de lomo con papa criolla', diff: 'Fácil', time: 30, bg: '#fee2e2', emoji: '🥩' },
  { title: 'Huevos al ajo', diff: 'Fácil', time: 15, bg: '#fef9c3', emoji: '🍳' },
  { title: 'Wrap Keto Fácil', diff: 'Fácil', time: 10, bg: '#fce7f3', emoji: '🥓' },
];
```

**Helpers de dificultad:**

```js
const getDifficultyLabel = (d) => {
  const l = d?.toLowerCase() || '';
  if (l.includes('fácil') || l === 'easy') return 'Fácil';
  if (l.includes('medio') || l === 'medium') return 'Medio';
  if (l.includes('difícil') || l === 'hard') return 'Difícil';
  return d || 'Fácil';
};

const getDifficultyStyle = (d) => {
  // Fácil   → bg #DCFCE7 / text #15803D
  // Medio   → bg #FEF3C7 / text #B45309
  // Difícil → bg #FEE2E2 / text #DC2626
};
```

**Herramientas interactivas (client-side JS inline):**
- Conversor de medidas: convierte taza / cucharada / cucharadita / oz → ml o gramos según el ingrediente seleccionado
- Calculadora de porciones: calcula el multiplicador `want / orig` para ajustar cantidades
- Tabs con `classList.add/remove('active')` sin React — JavaScript vanilla inyectado via `dangerouslySetInnerHTML`

---

### `app/recipe/[id]/page.js`

Página de detalle de receta. Server Component async con metadata dinámica.

**Función `generateMetadata`:**

```js
export async function generateMetadata({ params }) {
  const recipe = await getRecipe(params.id)
  if (!recipe) return { title: 'La Mia Cucina' }
  return {
    title: `${recipe.title} — La Mia Cucina`,
    description: recipe.description || `${recipe.title}. ${recipe.total_time} min · ${recipe.difficulty}`,
    openGraph: {
      title: recipe.title,
      images: recipe.image_url ? [{ url: recipe.image_url, width: 1200, height: 630 }] : [],
    },
  }
}
```

**Lógica de parseo de ingredientes (multi-formato):**

```js
// Soporta: array de strings, array de objetos {amount, unit, name}, o objeto categorizado
if (Array.isArray(raw)) {
  ingredientGroups = [{ category: null, items: raw.map(item => {
    if (typeof item === 'string') return item
    const amount = item.amount || item.quantity || ''
    const unit = item.unit || ''
    const name = item.name || item.ingredient || ''
    return [amount, unit, name].filter(Boolean).join(' ')
  }) }]
} else if (raw && typeof raw === 'object') {
  // Objeto con categorías: { "Salsa": [...], "Base": [...] }
  ingredientGroups = keys.map(key => ({ category: ..., items: [...] }))
}
```

**Parseo de instrucciones:**

```js
const steps = Array.isArray(recipe.instructions)
  ? recipe.instructions
  : (recipe.instructions ? recipe.instructions.split('\n').filter(Boolean) : [])
```

**Componentes internos (sin estado, solo presentación):**
- `DifficultyBadge({ difficulty })` — badge coloreado: Fácil (verde), Intermedio (amarillo), Difícil (rojo)
- `CategoryBadge({ category })` — badge azul para la categoría culinaria

**UI fija:**
- Sticky header verde con logo y botón "Descargar gratis" → App Store
- Imagen hero 16:9 con `next/image` + `fill`
- Grid 3 columnas con métricas: tiempo, porciones, calorías
- CTA final con gradiente verde → App Store

---

### `app/not-found.js`

```js
export default function NotFound() {
  const url = 'https://apps.apple.com/app/id6757924220'
  return (
    <div style={wrap}>
      <div style={{fontSize:'64px', marginBottom:'16px'}}>🍽️</div>
      <h1 style={h1}>Receta no encontrada</h1>
      <p style={p}>Esta receta no existe o fue eliminada. Pero tenemos 95+ más en la app.</p>
      <a href={url} style={a}>Ver recetas en La Mia Cucina</a>
    </div>
  )
}
```

Todos los estilos son inline objects. Fondo `#F0FDF9`, botón verde `#10B981` → redirige al App Store.

---

### `app/sitemap.js`

```js
export default function sitemap() {
  return [{
    url: 'https://lamiacucina.app',
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 1
  }]
}
```

Solo registra la home. Las páginas `/recipe/[id]` no están en el sitemap (rutas dinámicas no generadas estáticamente).

---

## 4. Stack técnico

| Tecnología | Versión | Uso |
|---|---|---|
| Next.js | 15.2.6 | Framework principal (App Router) |
| React | ^18 | UI |
| React DOM | ^18 | Rendering |
| @supabase/supabase-js | ^2.43.4 | Base de datos / backend |
| @vercel/analytics | ^1.3.1 | Analytics de producción |
| @vercel/speed-insights | ^2.0.0 | Métricas de rendimiento |

**Scripts disponibles:** `next dev`, `next build`, `next start`

**Paradigma de renderizado:** Server Components (RSC) por defecto. No se usa `'use client'` en ninguno de los archivos leídos. El JavaScript interactivo de las herramientas se inyecta como scripts inline via `dangerouslySetInnerHTML`.

---

## 5. Estilos y design system

### `app/globals.css`

Reset mínimo global:

```css
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
html {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: #F0FDF9;
  color: #1F2937;
  -webkit-font-smoothing: antialiased;
}
body { min-height: 100vh; }
```

### Estilos en `page.js`

Todo el CSS de la landing está inyectado via `<style>{`...`}</style>` directamente en el JSX del Server Component. No usa CSS Modules, Tailwind ni ninguna librería de estilos.

### Paleta de colores

| Token visual | Hex | Uso |
|---|---|---|
| Verde primario | `#10B981` | Hero bg, badges, botones secundarios, sticky header |
| Verde claro bg | `#F0FDF9` | Background general de la página |
| Verde borde | `#D1FAE5` | Bordes de tarjetas, separadores |
| Verde oscuro | `#065F46` | Texto sobre verde claro |
| Rosa acción | `#EC4899` | CTA principal, botón descargar, Chef Mía |
| Rosa claro bg | `#FDF2F8` | Sección Chef Mía |
| Rosa borde | `#FCE7F3` | Bordes sección Chef Mía |
| Gris texto | `#1F2937` | Texto principal |
| Gris secundario | `#6B7280` | Texto secundario / descriptivo |
| Blanco | `#FFFFFF` | Cards de receta |
| Negro app | `#111827` | Footer |

### Tipografía

- **Fuente principal:** `DM Sans` (Google Fonts, pesos 400/500/700/800, `display: swap`)
- **Fallback:** `-apple-system, BlinkMacSystemFont, sans-serif`
- Aplicada globalmente via `next/font/google` en `layout.js`

### Responsive

Breakpoint único en `page.js`:

```css
@media (max-width: 720px) {
  .hero { flex-direction: column; padding: 40px 24px; text-align: center; gap: 36px; }
  .hero-headline { font-size: 30px; }
  .chef-mia { flex-direction: column; padding: 40px 24px; gap: 36px; }
  .chef-title { font-size: 26px; }
}
```

---

## 6. Integraciones externas

### Supabase

- **URL:** `https://xyxdgyqduvjsepzyblju.supabase.co`
- **Tabla consultada:** `recipes`
- **Campos usados en home:** `id, title, image_url, difficulty, total_time, prep_time, cook_time`
- **Campos usados en detalle:** `*` (todos)
- **Filtros home:** `is_published = true`, `.in('title', FEATURED_RECIPE_TITLES)`, fallback a `.order('created_at', { ascending: false })`
- **Filtro detalle:** `id = params.id` con `.single()`
- **Assets:** Icono de la app servido desde Supabase Storage: `https://xyxdgyqduvjsepzyblju.supabase.co/storage/v1/object/public/Assets/icon.png`

En `page.js` el cliente se instancia directamente:

```js
const supabase = createClient(
  'https://xyxdgyqduvjsepzyblju.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);
```

En `recipe/[id]/page.js` se importa desde un módulo compartido:

```js
import { supabase } from '../../../lib/supabase'
```

### App Store

- **URL:** `https://apps.apple.com/app/id6757924220`
- Referenciada en: hero CTA, recipe sticky header, recipe CTA footer, not-found, layout metadata (`apple-itunes-app`)

### Vercel Analytics

- `@vercel/analytics/next` → componente `<Analytics />`
- `@vercel/speed-insights/next` → componente `<SpeedInsights />`
- Ambos inyectados en el body via `layout.js`

---

## 7. Variables de entorno

| Variable | Requerida | Uso | Dónde se usa |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Sí (en producción) | Clave anon pública de Supabase | `app/page.js` |

> En `page.js` hay fallback a string vacío: `process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''`, lo que permite que el build no falle si no está definida, pero la consulta a Supabase retornará error.
> En `lib/supabase.js` (no leído) probablemente se define también con esta variable.

---

## 8. Archivos de configuración

### `next.config.mjs`

```js
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'xyxdgyqduvjsepzyblju.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};
```

Solo autoriza imágenes remotas desde el bucket de Supabase para `next/image`. Sin otras configuraciones.

### `vercel.json`

```json
{
  "redirects": [
    {
      "source": "/(.*)",
      "has": [{ "type": "host", "value": "www.lamiacucina.app" }],
      "destination": "https://lamiacucina.app/$1",
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

**Dos funciones:**
1. **Redirect 301** de `www.lamiacucina.app` → `lamiacucina.app` (canonical sin www)
2. **Header Content-Type** para el archivo AASA (Universal Links de iOS) en `/.well-known/apple-app-site-association`

### `package.json`

```json
{
  "name": "lamiacucina-links",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

Sin script de `lint` ni `test`. Sin `devDependencies` declaradas.

---

## 9. Assets públicos

### `public/robots.txt`

```
User-agent: *
Allow: /
Sitemap: https://lamiacucina.app/sitemap.xml
```

Permite todo. Apunta al sitemap generado automáticamente por Next.js.

### `public/images/` (inferido del código)

| Archivo | Uso |
|---|---|
| `chef-mia.png` | Avatar de Chef Mía — eyebrow, chat header, burbujas de chat |
| `F5D5CD95-35FA-42D7-B390-7A3F46D7A29C_1_201_a.jpeg` | Screenshot de la app en el mockup de teléfono del hero |

Ambos referenciados con rutas relativas `/images/...` desde `page.js`.

---

## 10. SEO y metadatos

### Metadata global (`app/layout.js`)

```js
export const metadata = {
  alternates: { canonical: 'https://lamiacucina.app' },
  title: 'La Mia Cucina — Tu colección personal de recetas',
  description: 'App gratis para iPhone con recetas curadas de cocina italiana, colombiana, mexicana y más. Con Chef Mía, tu asistente IA personal.',
  icons: {
    icon: 'https://xyxdgyqduvjsepzyblju.supabase.co/storage/v1/object/public/Assets/icon.png',
    apple: 'https://xyxdgyqduvjsepzyblju.supabase.co/storage/v1/object/public/Assets/icon.png',
  },
  openGraph: {
    title: 'La Mia Cucina — Tu colección personal de recetas',
    description: 'App gratis para iPhone con recetas curadas...',
    url: 'https://lamiacucina.app',
    siteName: 'La Mia Cucina',
    locale: 'es_CO',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
  other: { 'apple-itunes-app': 'app-id=6757924220' },
}
```

### Metadata de la home (`app/page.js`)

```js
export const metadata = {
  title: 'La Mia Cucina — Recetas para hacer en casa',
  description: 'Tu colección personal de recetas para hacer en casa. Italianas, mexicanas, colombianas y más.',
  openGraph: {
    title: 'La Mia Cucina — Recetas para hacer en casa',
    description: 'Tu colección personal de recetas para hacer en casa.',
    url: 'https://lamiacucina.app',
    siteName: 'La Mia Cucina',
  },
}
```

Sobreescribe el title y description del layout para la home específicamente.

### Metadata dinámica en `/recipe/[id]`

Generada por `generateMetadata()` con datos reales de Supabase:
- `title`: `{recipe.title} — La Mia Cucina`
- `description`: `recipe.description` o fallback con tiempo y dificultad
- OG image: `recipe.image_url` con dimensiones 1200×630

### JSON-LD (structured data)

Dos schemas inyectados via `dangerouslySetInnerHTML` en `page.js`:

**MobileApplication:**

```json
{
  "@type": "MobileApplication",
  "name": "La Mia Cucina",
  "operatingSystem": "iOS",
  "applicationCategory": "FoodAndDrinkApplication",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "downloadUrl": "https://apps.apple.com/app/id6757924220"
}
```

**FAQPage** con 5 preguntas:
- ¿La Mia Cucina es gratis?
- ¿Qué tipo de recetas tiene?
- ¿Quién es Chef Mía?
- ¿En qué idioma está la app?
- ¿Está disponible para Android?

### Sitemap

```js
// app/sitemap.js
export default function sitemap() {
  return [{
    url: 'https://lamiacucina.app',
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 1
  }]
}
```

Solo la home. Accesible en `/sitemap.xml` generado automáticamente por Next.js App Router.

---

## 11. Lógica de negocio relevante

### Estrategia de datos: híbrido estático + dinámico

La home implementa un patrón de "datos optimistas": define 4 recetas en `STATIC_CARDS` con toda la información visual necesaria (título, color de fondo, emoji, dificultad, tiempo). En el render se cruzan contra los datos de Supabase por título (`dbByTitle[s.title]`). Si existe el registro en DB, se usa la imagen real y el ID para el enlace; si no, se usa el color/emoji de fallback y el enlace va al App Store.

```js
const dbByTitle = Object.fromEntries((recipes || []).map(r => [r.title, r]));
return STATIC_CARDS.map((s, i) => {
  const db = dbByTitle[s.title];
  // Si hay DB: enlaza a /recipe/${db.id}, usa db.image_url
  // Si no:     enlaza al App Store, usa placeholder de color + emoji
  return (
    <a key={i} href={db ? `/recipe/${db.id}` : APP_STORE_URL} ...>
  );
});
```

### Parseo de ingredientes multi-formato

La tabla `recipes` en Supabase almacena `ingredients` en JSON con al menos 3 formatos posibles:
1. `string[]` — lista simple de strings
2. `object[]` — array de objetos `{amount, quantity, unit, name, ingredient}`
3. `object` — objeto categorizado `{ "Salsa": [...], "Base": [...] }`

El código en `recipe/[id]/page.js` normaliza los tres formatos hacia `ingredientGroups[]` antes de renderizar.

### Deep link / Universal Links iOS

- `vercel.json` configura el Content-Type correcto para `/.well-known/apple-app-site-association`
- `layout.js` inyecta `apple-itunes-app: app-id=6757924220` en el `<head>` (Smart App Banner nativo de iOS)
- Estas dos piezas juntas habilitan que Safari en iOS muestre el Smart App Banner y soporte Universal Links

### Manejo de errores silencioso en home

```js
try {
  const { data } = await supabase.from('recipes')...
  recipes = data || [];
} catch (e) {}  // Error swallowed — la página siempre renderiza con datos estáticos
```

La landing nunca lanza error al usuario: si Supabase falla, muestra las tarjetas estáticas con emoji/color y enlaza al App Store.

### Herramientas de cocina sin estado React

Las dos herramientas interactivas (conversor de medidas y calculadora de porciones) funcionan con JavaScript vanilla inyectado en un `<script>` via `dangerouslySetInnerHTML`. Los tabs se manejan con `classList.add/remove('active')` sobre los paneles del DOM. Esto evita hidratación de React.

### Normalización de dificultad bilingüe

```js
// Acepta tanto español como inglés desde Supabase
if (l.includes('fácil') || l === 'easy') return 'Fácil';
if (l.includes('medio') || l === 'medium') return 'Medio';
if (l.includes('difícil') || l === 'hard') return 'Difícil';
```

Sugiere que la tabla `recipes` puede tener valores históricos en inglés ('easy', 'medium', 'hard') que se normalizan al español en el frontend.
