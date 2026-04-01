import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://xyxdgyqduvjsepzyblju.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

const FEATURED_RECIPE_IDS = [
  // Reemplaza con los UUIDs reales de las 4 recetas que quieres destacar
  // Ejemplo: 'f03f7aa7-bc26-4a82-ad7c-885a558bcf9a'
];

const getDifficultyLabel = (d) => {
  const l = d?.toLowerCase() || '';
  if (l.includes('fácil') || l === 'easy') return 'Fácil';
  if (l.includes('medio') || l === 'medium') return 'Medio';
  if (l.includes('difícil') || l === 'hard') return 'Difícil';
  return d || 'Fácil';
};

const getDifficultyStyle = (d) => {
  const l = d?.toLowerCase() || '';
  if (l.includes('fácil') || l === 'easy') return { background: '#DCFCE7', color: '#15803D' };
  if (l.includes('medio') || l === 'medium') return { background: '#FEF3C7', color: '#B45309' };
  if (l.includes('difícil') || l === 'hard') return { background: '#FEE2E2', color: '#DC2626' };
  return { background: '#F3F4F6', color: '#6B7280' };
};

export const metadata = {
  title: 'La Mia Cucina — Recetas para hacer en casa',
  description: 'Tu colección personal de recetas para hacer en casa. Italianas, mexicanas, colombianas y más.',
  openGraph: {
    title: 'La Mia Cucina — Recetas para hacer en casa',
    description: 'Tu colección personal de recetas para hacer en casa.',
    url: 'https://lamiacucina.app',
    siteName: 'La Mia Cucina',
  },
};

export default async function HomePage() {
  let recipes = [];

  try {
    const { data } = await supabase
      .from('recipes')
      .select('id, title, image_url, difficulty, total_time, prep_time, cook_time')
      .eq('is_published', true)
      .in('id', FEATURED_RECIPE_IDS.length > 0 ? FEATURED_RECIPE_IDS : ['00000000-0000-0000-0000-000000000000'])
      .limit(4);
    recipes = data || [];
  } catch (e) {
    // fallback to empty
  }

  // Si no hay IDs configurados, cargamos las 4 más recientes
  if (recipes.length === 0) {
    try {
      const { data } = await supabase
        .from('recipes')
        .select('id, title, image_url, difficulty, total_time, prep_time, cook_time')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(4);
      recipes = data || [];
    } catch (e) {}
  }

  const APP_STORE_URL = 'https://apps.apple.com/app/id6757924220';
  const ICON_URL = 'https://xyxdgyqduvjsepzyblju.supabase.co/storage/v1/object/public/Assets/icon.png';
  const CHEF_MIA_URL = '/images/chef-mia.png';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif; background: #F0FDF9; color: #111827; }
        a { text-decoration: none; }
        .header { background: #10B981; padding: 14px 28px; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 16px; position: sticky; top: 0; z-index: 100; }
        .header-left { display: flex; align-items: center; gap: 10px; }
        .app-icon { width: 40px; height: 40px; border-radius: 10px; overflow: hidden; flex-shrink: 0; box-shadow: 0 2px 8px rgba(0,0,0,0.2); }
        .app-icon img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .app-name { font-size: 14px; font-weight: 700; color: white; line-height: 1.2; }
        .app-sub { font-size: 11px; color: rgba(255,255,255,0.75); margin-top: 1px; }
        .header-center { text-align: center; }
        .header-center p { font-size: 14px; font-weight: 600; color: rgba(255,255,255,0.96); line-height: 1.5; max-width: 360px; }
        .header-right { display: flex; justify-content: flex-end; }
        .btn-header { display: inline-flex; align-items: center; gap: 7px; background: #EC4899; color: white; padding: 10px 18px; border-radius: 999px; font-size: 13px; font-weight: 600; white-space: nowrap; box-shadow: 0 2px 12px rgba(236,72,153,0.4); }
        .stats { display: flex; background: white; border-bottom: 1px solid #F3F4F6; }
        .stat { flex: 1; padding: 16px 8px; text-align: center; border-right: 1px solid #F3F4F6; }
        .stat:last-child { border-right: none; }
        .stat-value { font-size: 14px; font-weight: 700; color: #10B981; display: block; }
        .stat-label { font-size: 12px; color: #6B7280; margin-top: 2px; display: block; }
        .section { padding: 28px 24px; max-width: 600px; margin: 0 auto; }
        .section-header { margin-bottom: 16px; }
        .section-header h2 { font-size: 18px; font-weight: 700; color: #111827; margin-bottom: 3px; }
        .section-header p { font-size: 13px; color: #6B7280; }
        .recipe-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
        .recipe-card { background: white; border-radius: 14px; overflow: hidden; border: 1px solid #F3F4F6; display: block; color: inherit; transition: transform 0.15s; }
        .recipe-card:hover { transform: translateY(-2px); }
        .recipe-img { width: 100%; height: 110px; object-fit: cover; display: block; }
        .recipe-placeholder { width: 100%; height: 110px; display: flex; align-items: center; justify-content: center; font-size: 28px; }
        .recipe-info { padding: 10px 12px 12px; }
        .recipe-title { font-size: 13px; font-weight: 600; color: #111827; margin-bottom: 6px; line-height: 1.35; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .recipe-meta { display: flex; align-items: center; gap: 6px; }
        .badge { font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 999px; }
        .recipe-time { font-size: 10px; color: #6B7280; }
        .features { background: white; border-top: 1px solid #F3F4F6; border-bottom: 1px solid #F3F4F6; padding: 28px 24px; }
        .features-inner { max-width: 600px; margin: 0 auto; text-align: center; }
        .features h2 { font-size: 18px; font-weight: 700; margin-bottom: 20px; color: #111827; }
        .feature-list { text-align: left; }
        .feature-item { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 18px; }
        .feature-item:last-child { margin-bottom: 0; }
        .feature-icon { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden; }
        .feature-icon img { width: 100%; height: 100%; object-fit: cover; }
        .feature-text h3 { font-size: 14px; font-weight: 600; margin-bottom: 2px; color: #111827; }
        .feature-text p { font-size: 13px; color: #6B7280; line-height: 1.5; }
        .cta { padding: 32px 24px 44px; text-align: center; max-width: 600px; margin: 0 auto; }
        .cta h2 { font-size: 22px; font-weight: 700; margin-bottom: 20px; }
        .btn-download { display: flex; align-items: center; justify-content: center; gap: 10px; background: #EC4899; color: white; padding: 16px 32px; border-radius: 999px; font-size: 16px; font-weight: 600; width: 100%; box-shadow: 0 4px 20px rgba(236,72,153,0.35); }
        .cta-note { font-size: 12px; color: #6B7280; margin-top: 10px; }
        footer { background: #111827; padding: 16px 24px; text-align: center; }
        footer p { font-size: 11px; color: rgba(255,255,255,0.4); }
        footer span { color: #10B981; }
        @media (max-width: 600px) {
          .header { grid-template-columns: auto 1fr; grid-template-rows: auto auto; gap: 10px; padding: 12px 16px; }
          .header-center { grid-column: 1 / -1; grid-row: 2; text-align: left; }
          .header-center p { font-size: 12px; }
          .header-right { grid-row: 1; }
          .btn-header { font-size: 12px; padding: 8px 14px; }
        }
      `}</style>

      {/* HEADER */}
      <header className="header">
        <div className="header-left">
          <div className="app-icon">
            <img src={ICON_URL} alt="La Mia Cucina" />
          </div>
          <div>
            <p className="app-name">La Mia Cucina</p>
            <p className="app-sub">Descubre nuevas recetas cada día</p>
          </div>
        </div>

        <div className="header-center">
          <p>Tu colección personal de recetas para hacer en casa. Italianas, mexicanas, colombianas y más.</p>
        </div>

        <div className="header-right">
          <a href={APP_STORE_URL} className="btn-header">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
            Descargar gratis
          </a>
        </div>
      </header>

      {/* STATS */}
      <div className="stats">
        <div className="stat">
          <span className="stat-value">Variedad</span>
          <span className="stat-label">de recetas</span>
        </div>
        <div className="stat">
          <span className="stat-value">Fáciles</span>
          <span className="stat-label">de seguir</span>
        </div>
        <div className="stat">
          <span className="stat-value">Gratis</span>
          <span className="stat-label">en App Store</span>
        </div>
      </div>

      {/* RECIPES */}
      <div className="section">
        <div className="section-header">
          <h2>Recetas destacadas</h2>
          <p>Una muestra de lo que te espera en la app</p>
        </div>
        <div className="recipe-grid">
          {recipes.length > 0 ? recipes.map((recipe) => {
            const diffStyle = getDifficultyStyle(recipe.difficulty);
            const time = recipe.total_time || (recipe.prep_time + recipe.cook_time);
            return (
              <a key={recipe.id} href={`/recipe/${recipe.id}`} className="recipe-card">
                {recipe.image_url ? (
                  <img className="recipe-img" src={recipe.image_url} alt={recipe.title} />
                ) : (
                  <div className="recipe-placeholder" style={{ background: '#d4f0e4' }}>🍽️</div>
                )}
                <div className="recipe-info">
                  <p className="recipe-title">{recipe.title}</p>
                  <div className="recipe-meta">
                    <span className="badge" style={diffStyle}>{getDifficultyLabel(recipe.difficulty)}</span>
                    <span className="recipe-time">{time} min</span>
                  </div>
                </div>
              </a>
            );
          }) : (
            // Fallback si no hay recetas
            [
              { title: 'Espaguetis a la Carrettiera', diff: 'Fácil', time: 35, bg: '#d4f0e4', emoji: '🍝' },
              { title: 'Tacos de Pollo al Pastor', diff: 'Medio', time: 40, bg: '#fde8d0', emoji: '🌮' },
              { title: 'Bandeja Paisa Colombiana', diff: 'Difícil', time: 90, bg: '#fce4ec', emoji: '🫘' },
              { title: 'Bowl Griego de Pollo', diff: 'Fácil', time: 30, bg: '#e0d4f5', emoji: '🥗' },
            ].map((r, i) => {
              const diffStyle = getDifficultyStyle(r.diff);
              return (
                <a key={i} href={APP_STORE_URL} className="recipe-card">
                  <div className="recipe-placeholder" style={{ background: r.bg }}>{r.emoji}</div>
                  <div className="recipe-info">
                    <p className="recipe-title">{r.title}</p>
                    <div className="recipe-meta">
                      <span className="badge" style={diffStyle}>{r.diff}</span>
                      <span className="recipe-time">{r.time} min</span>
                    </div>
                  </div>
                </a>
              );
            })
          )}
        </div>
      </div>

      {/* FEATURES */}
      <div className="features">
        <div className="features-inner">
          <h2>¿Por qué La Mia Cucina?</h2>
          <div className="feature-list">

            <div className="feature-item">
              <div className="feature-icon" style={{ background: '#D1FAE5' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" width="20" height="20"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/></svg>
              </div>
              <div className="feature-text">
                <h3>Instrucciones claras paso a paso</h3>
                <p>Pasos cortos y simples que cualquiera puede seguir sin confundirse.</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon" style={{ background: '#D1FAE5' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.8" width="20" height="20">
                  <ellipse cx="12" cy="15" rx="5" ry="6"/>
                  <path d="M12 9 C10 6 8 5 9 3"/>
                  <path d="M12 9 C12 5 12 4 12 2"/>
                  <path d="M12 9 C14 6 16 5 15 3"/>
                  <line x1="9" y1="12" x2="15" y2="12"/>
                  <line x1="8" y1="15" x2="16" y2="15"/>
                  <line x1="9" y1="18" x2="15" y2="18"/>
                </svg>
              </div>
              <div className="feature-text">
                <h3>Ingredientes organizados por categoría</h3>
                <p>Sabe exactamente qué comprar antes de empezar a cocinar.</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon" style={{ background: '#D1FAE5' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" width="20" height="20"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              </div>
              <div className="feature-text">
                <h3>Guarda y comparte tus favoritas</h3>
                <p>Accede rápido a lo que más te gusta y comparte con quien quieras.</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon" style={{ background: '#FCE7F3', overflow: 'hidden' }}>
                <img src={CHEF_MIA_URL} alt="Chef Mía" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div className="feature-text">
                <h3>Chef Mía — tu asistente IA</h3>
                <p>Pregúntale qué cocinar según los ingredientes que tienes en casa.</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon" style={{ background: '#FEF3C7' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" width="20" height="20"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </div>
              <div className="feature-text">
                <h3>Recomendaciones personalizadas</h3>
                <p>Recetas que coinciden con tus gustos y lo que cocinas seguido.</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="cta">
        <h2>Empieza a cocinar hoy</h2>
        <a href={APP_STORE_URL} className="btn-download">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
          Descargar gratis en App Store
        </a>
        <p className="cta-note">Disponible para iPhone · iOS 16 o superior</p>
      </div>

      {/* FOOTER */}
      <footer>
        <p>© 2026 <span>La Mia Cucina</span> · Hecho con amor en Colombia</p>
      </footer>
    </>
  );
}
