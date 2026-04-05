import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://xyxdgyqduvjsepzyblju.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

const FEATURED_RECIPE_IDS = [
  '1373c327-2f9d-4eb2-8f4b-c2471a24dcbc',
  '14853726-4175-4115-b8bf-1e57ed1ba6bf',
  '6acc3f28-d3a7-422a-93e8-6f0600a320df',
  'c148147b-7bb3-4b3b-8a9b-4ab74942718f'
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
        .hero { background: #10B981; padding: 64px 48px; display: flex; align-items: center; justify-content: center; gap: 56px; }
        .hero-left { flex: 1; max-width: 500px; }
        .hero-right { flex-shrink: 0; }
        .hero-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.2); color: white; padding: 6px 14px; border-radius: 999px; font-size: 12px; font-weight: 600; margin-bottom: 20px; }
        .hero-headline { font-size: 44px; font-weight: 800; color: white; line-height: 1.1; margin-bottom: 16px; letter-spacing: -0.5px; }
        .hero-sub { font-size: 16px; color: rgba(255,255,255,0.85); line-height: 1.65; margin-bottom: 32px; max-width: 420px; }
        .btn-hero { display: inline-flex; align-items: center; gap: 10px; background: #EC4899; color: white; padding: 16px 28px; border-radius: 999px; font-size: 16px; font-weight: 700; box-shadow: 0 4px 24px rgba(236,72,153,0.5); margin-bottom: 12px; }
        .hero-note { font-size: 12px; color: rgba(255,255,255,0.6); }
        .phone-frame { width: 220px; height: 450px; background: #111; border-radius: 40px; padding: 8px; box-shadow: 0 24px 64px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.08); }
        .phone-screen { width: 100%; height: 100%; border-radius: 34px; overflow: hidden; }
        .phone-screen img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .stats { display: flex; background: white; border-bottom: 1px solid #F3F4F6; }
        .stat { flex: 1; padding: 18px 8px; text-align: center; border-right: 1px solid #E5E7EB; }
        .stat:last-child { border-right: none; }
        .stat-value { font-size: 15px; font-weight: 700; color: #111827; display: block; }
        .stat-value-pink { font-size: 15px; font-weight: 700; color: #EC4899; display: block; }
        .stat-label { font-size: 11px; color: #6B7280; margin-top: 3px; display: block; }
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
        .chef-mia { background: #1F2937; padding: 64px 48px; display: flex; align-items: center; justify-content: center; gap: 56px; }
        .chef-mia-left { flex: 1; max-width: 460px; }
        .chef-mia-right { flex: 1; max-width: 380px; }
        .chef-eyebrow { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
        .chef-avatar-sm { width: 32px; height: 32px; border-radius: 50%; border: 2px solid #EC4899; overflow: hidden; flex-shrink: 0; }
        .chef-avatar-sm img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .chef-eyebrow-text { font-size: 13px; font-weight: 600; color: #EC4899; }
        .chef-title { font-size: 36px; font-weight: 800; color: white; line-height: 1.15; margin-bottom: 16px; letter-spacing: -0.3px; }
        .chef-desc { font-size: 15px; color: rgba(255,255,255,0.7); line-height: 1.65; margin-bottom: 28px; }
        .chef-chips { display: flex; flex-wrap: wrap; gap: 8px; }
        .chef-chip { background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.85); font-size: 12px; font-weight: 500; padding: 7px 14px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.15); }
        .chat { display: flex; flex-direction: column; gap: 12px; }
        .chat-bubble-wrap { display: flex; align-items: flex-end; gap: 8px; }
        .chat-bubble-wrap.user { flex-direction: row-reverse; }
        .bubble-text { padding: 12px 16px; border-radius: 18px; font-size: 14px; line-height: 1.5; max-width: 280px; }
        .bubble-user { background: #EC4899; color: white; border-bottom-right-radius: 4px; }
        .bubble-mia { background: rgba(255,255,255,0.12); color: white; border-bottom-left-radius: 4px; border: 1px solid rgba(255,255,255,0.15); }
        .chat-avatar { width: 28px; height: 28px; border-radius: 50%; overflow: hidden; flex-shrink: 0; background: #374151; }
        .chat-avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .feature-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; text-align: left; }
        .feature-col { display: flex; flex-direction: column; gap: 12px; }
        .feature-icon-circle { width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .feature-col h3 { font-size: 15px; font-weight: 700; color: #111827; }
        .feature-col p { font-size: 13px; color: #6B7280; line-height: 1.6; }
        .cta { padding: 32px 24px 44px; text-align: center; max-width: 600px; margin: 0 auto; }
        .cta h2 { font-size: 22px; font-weight: 700; margin-bottom: 20px; }
        .btn-download { display: flex; align-items: center; justify-content: center; gap: 10px; background: #EC4899; color: white; padding: 16px 32px; border-radius: 999px; font-size: 16px; font-weight: 600; width: 100%; box-shadow: 0 4px 20px rgba(236,72,153,0.35); }
        .cta-note { font-size: 12px; color: #6B7280; margin-top: 10px; }
        footer { background: #111827; padding: 16px 24px; text-align: center; }
        footer p { font-size: 11px; color: rgba(255,255,255,0.4); }
        footer span { color: #10B981; }
        @media (max-width: 720px) {
          .hero { flex-direction: column; padding: 40px 24px; text-align: center; gap: 36px; }
          .hero-headline { font-size: 30px; }
          .hero-sub { font-size: 15px; margin-left: auto; margin-right: auto; }
          .hero-badge { margin-left: auto; margin-right: auto; }
          .hero-right { order: 2; }
          .hero-left { order: 1; }
          .chef-mia { flex-direction: column; padding: 40px 24px; gap: 36px; }
          .chef-title { font-size: 26px; }
          .feature-grid { grid-template-columns: 1fr; gap: 20px; }
        }
      `}</style>

      {/* HERO */}
      <section className="hero">
        <div className="hero-left">
          <div className="hero-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
            Disponible gratis en App Store
          </div>
          <h1 className="hero-headline">Deja de buscar.<br/>Empieza a cocinar.</h1>
          <p className="hero-sub">Tu colección personal de recetas curadas, con una IA que te dice qué cocinar con lo que tienes en casa.</p>
          <div>
            <a href={APP_STORE_URL} className="btn-hero">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
              Descargar gratis
            </a>
            <p className="hero-note">iPhone · iOS 16 o superior · Sin tarjeta</p>
          </div>
        </div>
        <div className="hero-right">
          <div className="phone-frame">
            <div className="phone-screen">
              <img src="/images/F5D5CD95-35FA-42D7-B390-7A3F46D7A29C_1_201_a.jpeg" alt="La Mia Cucina app screenshot" />
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="stats">
        <div className="stat">
          <span className="stat-value">8+</span>
          <span className="stat-label">cocinas del mundo</span>
        </div>
        <div className="stat">
          <span className="stat-value">15'</span>
          <span className="stat-label">receta más rápida</span>
        </div>
        <div className="stat">
          <span className="stat-value">Gratis</span>
          <span className="stat-label">para descargar</span>
        </div>
        <div className="stat">
          <span className="stat-value-pink">Chef Mía</span>
          <span className="stat-label">IA incluida</span>
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

      {/* CHEF MÍA */}
      <section className="chef-mia">
        <div className="chef-mia-left">
          <div className="chef-eyebrow">
            <div className="chef-avatar-sm">
              <img src={CHEF_MIA_URL} alt="Chef Mía" />
            </div>
            <span className="chef-eyebrow-text">Inteligencia artificial</span>
          </div>
          <h2 className="chef-title">Chef Mía sabe qué hay en tu nevera</h2>
          <p className="chef-desc">Dile qué ingredientes tienes y te sugiere recetas reales de la app. Sin desperdicio, sin excusas para no cocinar.</p>
          <div className="chef-chips">
            <span className="chef-chip">¿Qué hago con pollo y papa?</span>
            <span className="chef-chip">Algo rápido para cenar</span>
            <span className="chef-chip">Receta sin gluten</span>
          </div>
        </div>
        <div className="chef-mia-right">
          <div className="chat">
            <div className="chat-bubble-wrap user">
              <div className="bubble-text bubble-user">Tengo pollo, papa y cebolla. ¿Qué cocino?</div>
            </div>
            <div className="chat-bubble-wrap">
              <div className="chat-avatar"><img src={CHEF_MIA_URL} alt="Chef Mía" /></div>
              <div className="bubble-text bubble-mia">¡Perfecto para un Ajiaco! Lo tienes en la app, con paso a paso.</div>
            </div>
            <div className="chat-bubble-wrap user">
              <div className="bubble-text bubble-user">Sí, y algo más rápido para mañana?</div>
            </div>
            <div className="chat-bubble-wrap">
              <div className="chat-avatar"><img src={CHEF_MIA_URL} alt="Chef Mía" /></div>
              <div className="bubble-text bubble-mia">Con esos ingredientes, Pollo al ajillo en 25 min. Te lo muestro.</div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <div className="features">
        <div className="features-inner">
          <h2>¿Por qué La Mia Cucina?</h2>
          <div className="feature-grid">

            <div className="feature-col">
              <div className="feature-icon-circle" style={{ background: '#D1FAE5' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" width="22" height="22"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/></svg>
              </div>
              <h3>Pasos que no confunden</h3>
              <p>Instrucciones cortas en español real, con el paso activo siempre resaltado.</p>
            </div>

            <div className="feature-col">
              <div className="feature-icon-circle" style={{ background: '#FCE7F3' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#EC4899" strokeWidth="2" width="22" height="22"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              </div>
              <h3>Guarda tus favoritas</h3>
              <p>Acceso rápido a lo que más usas. Disponibles sin internet.</p>
            </div>

            <div className="feature-col">
              <div className="feature-icon-circle" style={{ background: '#DBEAFE' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" width="22" height="22"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </div>
              <h3>Busca por ingrediente</h3>
              <p>Escribe lo que tienes y ve qué puedes cocinar hoy.</p>
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
