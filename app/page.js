import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://xyxdgyqduvjsepzyblju.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

const STATIC_CARDS = [
  { title: 'Guacamole', diff: 'Fácil', time: 10, bg: '#d4f0e4', emoji: '🥑' },
  { title: 'Salteado de lomo con papa criolla', diff: 'Fácil', time: 30, bg: '#fee2e2', emoji: '🥩' },
  { title: 'Huevos al ajo', diff: 'Fácil', time: 15, bg: '#fef9c3', emoji: '🍳' },
  { title: 'Wrap Keto Fácil', diff: 'Fácil', time: 10, bg: '#fce7f3', emoji: '🥓' },
];

const FEATURED_RECIPE_TITLES = STATIC_CARDS.map(r => r.title);

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
      .in('title', FEATURED_RECIPE_TITLES)
      .limit(4);
    recipes = data || [];
  } catch (e) {}

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
  const CHEF_MIA_URL = '/images/chef-mia.png';

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700;9..40,800&display=swap" />
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif; background: #F0FDF9; color: #1F2937; }
        a { text-decoration: none; }

        /* HERO */
        .hero { background: #10B981; padding: 64px 48px; display: flex; align-items: center; justify-content: center; gap: 56px; }
        .hero-left { flex: 1; max-width: 500px; }
        .hero-right { flex-shrink: 0; }
        .hero-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.2); color: white; padding: 6px 14px; border-radius: 999px; font-size: 12px; font-weight: 600; margin-bottom: 20px; }
        .hero-headline { font-size: 44px; font-weight: 800; color: white; line-height: 1.1; margin-bottom: 16px; letter-spacing: -0.5px; }
        .hero-headline span { color: rgba(255,255,255,0.75); }
        .hero-sub { font-size: 16px; color: rgba(255,255,255,0.85); line-height: 1.65; margin-bottom: 32px; max-width: 420px; }
        .btn-hero { display: inline-flex; align-items: center; gap: 10px; background: #EC4899; color: white; padding: 16px 28px; border-radius: 999px; font-size: 16px; font-weight: 700; box-shadow: 0 4px 24px rgba(236,72,153,0.5); margin-bottom: 12px; }
        .hero-note { font-size: 12px; color: rgba(255,255,255,0.6); }
        .phone-frame { width: 220px; height: 450px; background: #111; border-radius: 40px; padding: 8px; box-shadow: 0 24px 64px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.08); }
        .phone-screen { width: 100%; height: 100%; border-radius: 34px; overflow: hidden; }
        .phone-screen img { width: 100%; height: 100%; object-fit: cover; display: block; }

        /* RECIPES */
        .section { padding: 28px 24px; max-width: 600px; margin: 0 auto; }
        .recipes-wrap { background: #F0FDF9; border-bottom: 1px solid #D1FAE5; }
        .section-header { margin-bottom: 16px; }
        .section-header h2 { font-size: 18px; font-weight: 700; color: #111827; margin-bottom: 3px; }
        .section-header p { font-size: 13px; color: #6B7280; }
        .recipe-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
        .recipe-card { background: white; border-radius: 14px; overflow: hidden; border: 1px solid #D1FAE5; display: block; color: inherit; transition: transform 0.15s; }
        .recipe-card:hover { transform: translateY(-2px); }
        .recipe-img { width: 100%; height: 110px; object-fit: cover; display: block; }
        .recipe-placeholder { width: 100%; height: 110px; display: flex; align-items: center; justify-content: center; font-size: 28px; }
        .recipe-info { padding: 10px 12px 12px; }
        .recipe-title { font-size: 13px; font-weight: 600; color: #111827; margin-bottom: 6px; line-height: 1.35; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .recipe-meta { display: flex; align-items: center; gap: 6px; }
        .badge { font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 999px; }
        .recipe-time { font-size: 10px; color: #6B7280; }

        /* CHEF MÍA */
        .chef-mia { background: #FDF2F8; padding: 64px 48px; display: flex; align-items: center; justify-content: center; gap: 56px; border-top: 2px solid #FCE7F3; }
        .chef-mia-left { flex: 1; max-width: 460px; }
        .chef-mia-right { flex: 1; max-width: 380px; }
        .chef-eyebrow { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
        .chef-avatar-sm { width: 32px; height: 32px; border-radius: 50%; border: 2px solid #EC4899; overflow: hidden; flex-shrink: 0; }
        .chef-avatar-sm img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .chef-eyebrow-text { font-size: 13px; font-weight: 600; color: #EC4899; }
        .chef-title { font-size: 36px; font-weight: 800; color: #1F2937; line-height: 1.15; margin-bottom: 16px; letter-spacing: -0.3px; }
        .chef-desc { font-size: 15px; color: #6B7280; line-height: 1.65; margin-bottom: 28px; }
        .chef-chips { display: flex; flex-wrap: wrap; gap: 8px; }
        .chef-chip { background: white; color: #EC4899; font-size: 12px; font-weight: 600; padding: 7px 14px; border-radius: 999px; border: 1.5px solid #F9A8D4; }

        /* Chat — replica UI de la app */
        .chat { display: flex; flex-direction: column; gap: 12px; background: white; border-radius: 20px; padding: 16px; border: 1px solid #FCE7F3; }
        .chat-header { display: flex; align-items: center; gap: 10px; padding-bottom: 12px; border-bottom: 1px solid #F3F4F6; margin-bottom: 4px; }
        .chat-header-avatar { width: 36px; height: 36px; border-radius: 50%; overflow: hidden; flex-shrink: 0; }
        .chat-header-avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .chat-header-name { font-size: 14px; font-weight: 700; color: #1F2937; }
        .chat-header-status { font-size: 11px; color: #10B981; font-weight: 600; }
        .chat-bubble-wrap { display: flex; align-items: flex-end; gap: 8px; }
        .chat-bubble-wrap.user { flex-direction: row-reverse; }
        .bubble-text { padding: 12px 16px; border-radius: 18px; font-size: 14px; line-height: 1.5; max-width: 280px; }
        .bubble-user { background: #EC4899; color: white; border-bottom-right-radius: 4px; }
        .bubble-mia { background: #F0FDF9; color: #1F2937; border-bottom-left-radius: 4px; border: 1px solid #D1FAE5; }
        .chat-avatar { width: 28px; height: 28px; border-radius: 50%; overflow: hidden; flex-shrink: 0; }
        .chat-avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }

        /* TOOLS */
        .tools-wrap { background: #F0FDF9; border-top: 1px solid #D1FAE5; border-bottom: 1px solid #D1FAE5; }
        .tools-label { display: inline-flex; align-items: center; gap: 6px; background: #D1FAE5; color: #065F46; font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 99px; margin-bottom: 14px; }
        .tool-tabs { display: flex; background: #E8F8F2; border-radius: 12px; padding: 4px; gap: 4px; margin-bottom: 20px; }
        .tab-btn { flex: 1; padding: 9px 8px; border-radius: 9px; border: none; background: transparent; font-size: 13px; font-weight: 600; color: #6B7280; cursor: pointer; font-family: inherit; transition: all 0.15s; }
        .tab-btn.active { background: white; color: #10B981; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
        .tool-panel { display: none; }
        .tool-panel.active { display: block; }
        .tool-card { background: white; border-radius: 16px; padding: 20px; border: 1px solid #D1FAE5; }
        .tool-row { display: flex; gap: 8px; margin-bottom: 14px; align-items: center; }
        .tool-label { font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px; display: block; }
        .tool-input { width: 100%; padding: 10px 12px; border: 1.5px solid #E5E7EB; border-radius: 10px; font-size: 14px; font-family: inherit; color: #1F2937; outline: none; background: white; }
        .tool-input:focus { border-color: #10B981; }
        .tool-select { width: 100%; padding: 10px 12px; border: 1.5px solid #E5E7EB; border-radius: 10px; font-size: 13px; font-family: inherit; color: #1F2937; outline: none; background: white; }
        .tool-select:focus { border-color: #10B981; }
        .result-box { background: #D1FAE5; border-radius: 12px; padding: 16px; text-align: center; margin-top: 4px; }
        .result-num { font-size: 28px; font-weight: 800; color: #065F46; }
        .result-unit { font-size: 14px; color: #10B981; font-weight: 600; margin-left: 4px; }
        .result-hint { font-size: 12px; color: #6B7280; margin-top: 4px; }
        .or-arrow { font-size: 18px; color: #9CA3AF; flex-shrink: 0; margin-top: 20px; }

        /* FEATURES */
        .features-wrap { background: #F0FDF9; border-top: 1px solid #D1FAE5; border-bottom: 1px solid #D1FAE5; }
        .features-inner { max-width: 600px; margin: 0 auto; padding: 32px 24px; }
        .feature-list { margin-top: 20px; }
        .feature-item { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 20px; }
        .feature-item:last-child { margin-bottom: 0; }
        .feature-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .feature-text h3 { font-size: 14px; font-weight: 700; margin-bottom: 3px; color: #1F2937; }
        .feature-text p { font-size: 13px; color: #6B7280; line-height: 1.55; }

        /* CTA */
        .cta { background: #EC4899; padding: 64px 24px; text-align: center; }
        .cta h2 { font-size: 36px; font-weight: 800; color: white; margin-bottom: 12px; letter-spacing: -0.3px; }
        .cta-sub { font-size: 16px; color: rgba(255,255,255,0.85); margin-bottom: 32px; }
        .btn-download { display: inline-flex; align-items: center; justify-content: center; gap: 10px; background: white; color: #EC4899; padding: 16px 32px; border-radius: 999px; font-size: 16px; font-weight: 700; box-shadow: 0 4px 24px rgba(0,0,0,0.15); }
        .cta-note { font-size: 12px; color: rgba(255,255,255,0.7); margin-top: 14px; }

        /* FAQ */
        .faq { background: #F0FDF9; padding: 48px 24px; border-top: 1px solid #D1FAE5; }
        .faq-inner { max-width: 600px; margin: 0 auto; }
        .faq h2 { font-size: 22px; font-weight: 700; color: #111827; margin-bottom: 24px; }
        .faq details { border-bottom: 1px solid #E5E7EB; }
        .faq details:first-of-type { border-top: 1px solid #E5E7EB; }
        .faq summary { padding: 16px 0; font-size: 15px; font-weight: 600; color: #111827; cursor: pointer; list-style: none; display: flex; justify-content: space-between; align-items: center; gap: 12px; }
        .faq summary::-webkit-details-marker { display: none; }
        .faq summary::after { content: '+'; font-size: 20px; font-weight: 300; color: #10B981; flex-shrink: 0; line-height: 1; }
        .faq details[open] summary::after { content: '−'; }
        .faq-answer { font-size: 14px; color: #6B7280; line-height: 1.65; padding-bottom: 16px; }

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
        }
      `}</style>

      {/* HERO */}
      <section className="hero">
        <div className="hero-left">
          <div className="hero-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
            Disponible gratis en App Store
          </div>
          <h1 className="hero-headline">
            Recetas para cocinar hoy, <span>no para guardar y olvidar.</span>
          </h1>
          <p className="hero-sub">
            Deja de cocinar siempre lo mismo. Encuentra la receta perfecta, compártela con quien vas a cocinar y ejecuta el paso a paso sin perder el hilo.
          </p>
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
              <img src="/images/F5D5CD95-35FA-42D7-B390-7A3F46D7A29C_1_201_a.jpeg" alt="La Mia Cucina app screenshot" fetchpriority="high" />
            </div>
          </div>
        </div>
      </section>

      {/* RECIPES */}
      <div className="recipes-wrap">
        <div className="section">
          <div className="section-header">
            <h2>Listas para cocinar ahora</h2>
            <p>Las más preparadas esta semana</p>
          </div>
          <div className="recipe-grid">
            {(() => {
              const dbByTitle = Object.fromEntries((recipes || []).map(r => [r.title, r]));
              return STATIC_CARDS.map((s, i) => {
                const db = dbByTitle[s.title];
                const diffStyle = getDifficultyStyle(db ? db.difficulty : s.diff);
                const time = db ? (db.total_time || (db.prep_time + db.cook_time)) : s.time;
                return (
                  <a key={i} href={db ? `/recipe/${db.id}` : APP_STORE_URL} className="recipe-card">
                    {db?.image_url ? (
                      <img className="recipe-img" src={db.image_url} alt={db.title} width={300} height={110} />
                    ) : (
                      <div className="recipe-placeholder" style={{ background: s.bg }}>{s.emoji}</div>
                    )}
                    <div className="recipe-info">
                      <p className="recipe-title">{s.title}</p>
                      <div className="recipe-meta">
                        <span className="badge" style={diffStyle}>{getDifficultyLabel(db ? db.difficulty : s.diff)}</span>
                        <span className="recipe-time">{time} min</span>
                      </div>
                    </div>
                  </a>
                );
              });
            })()}
          </div>
        </div>
      </div>

      {/* CHEF MÍA */}
      <section className="chef-mia">
        <div className="chef-mia-left">
          <div className="chef-eyebrow">
            <div className="chef-avatar-sm">
              <img src={CHEF_MIA_URL} alt="Chef Mía" />
            </div>
            <span className="chef-eyebrow-text">Chef Mía · IA sin costo</span>
          </div>
          <h2 className="chef-title">Dile qué tienes en la nevera. Ella sabe qué cocinar.</h2>
          <p className="chef-desc">
            Tu asistente personal de cocina. Te sugiere recetas reales de la app con lo que ya tienes, y si tienes dudas mientras cocinas, también te las resuelve.
          </p>
          <div className="chef-chips">
            <span className="chef-chip">¿Qué hago con pollo y papa?</span>
            <span className="chef-chip">Algo rápido para cenar</span>
            <span className="chef-chip">La nevera está casi vacía</span>
          </div>
        </div>
        <div className="chef-mia-right">
          <div className="chat">
            <div className="chat-header">
              <div className="chat-header-avatar">
                <img src={CHEF_MIA_URL} alt="Chef Mía" />
              </div>
              <div>
                <div className="chat-header-name">Chef Mía</div>
                <div className="chat-header-status">En línea</div>
              </div>
            </div>
            <div className="chat-bubble-wrap">
              <div className="chat-avatar"><img src={CHEF_MIA_URL} alt="Chef Mía" /></div>
              <div className="bubble-text bubble-mia">¡Hola! Cuéntame qué tienes en la nevera o qué se te antoja, y te digo qué cocinar.</div>
            </div>
            <div className="chat-bubble-wrap user">
              <div className="bubble-text bubble-user">Tengo pollo, papa y cebolla. ¿Qué cocino?</div>
            </div>
            <div className="chat-bubble-wrap">
              <div className="chat-avatar"><img src={CHEF_MIA_URL} alt="Chef Mía" /></div>
              <div className="bubble-text bubble-mia">¡Perfecto para un <strong>Ajiaco</strong>! Lo tienes en la app con el paso a paso completo.</div>
            </div>
            <div className="chat-bubble-wrap user">
              <div className="bubble-text bubble-user">¿Cuánto tiempo dejo hervir el pollo?</div>
            </div>
            <div className="chat-bubble-wrap">
              <div className="chat-avatar"><img src={CHEF_MIA_URL} alt="Chef Mía" /></div>
              <div className="bubble-text bubble-mia">Unos 25-30 minutos a fuego medio, hasta que puedas deshebrar fácilmente.</div>
            </div>
          </div>
        </div>
      </section>

      {/* TOOLS — conversor de medidas + calculadora de porciones */}
      <div className="tools-wrap">
        <div className="section">
          <div className="tools-label">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#065F46" strokeWidth="2.5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
            Herramientas gratis
          </div>
          <div className="section-header">
            <h2>Calcula sin adivinar</h2>
            <p>Herramientas de cocina que siempre necesitas</p>
          </div>
          <div className="tool-tabs" role="tablist">
            <button className="tab-btn active" id="tab-conversor" role="tab">Conversor de medidas</button>
            <button className="tab-btn" id="tab-porciones" role="tab">Calculadora de porciones</button>
          </div>
          <div className="tool-panel active" id="panel-conversor">
            <div className="tool-card">
              <label className="tool-label" htmlFor="conv-ingr">¿Qué vas a medir?</label>
              <select className="tool-select" id="conv-ingr" style={{ marginBottom: 14 }}>
                <option value="liquido">Líquidos (agua, leche, aceite…)</option>
                <option value="harina">Harina de trigo</option>
                <option value="azucar">Azúcar blanca</option>
                <option value="mantequilla">Mantequilla</option>
                <option value="arroz">Arroz</option>
              </select>
              <div className="tool-row">
                <div style={{ flex: 1 }}>
                  <label className="tool-label" htmlFor="conv-amt">Cantidad</label>
                  <input className="tool-input" type="number" id="conv-amt" defaultValue="1" min="0.25" step="0.25" />
                </div>
                <div className="or-arrow">→</div>
                <div style={{ flex: 1 }}>
                  <label className="tool-label" htmlFor="conv-from">Unidad</label>
                  <select className="tool-select" id="conv-from">
                    <option value="taza">Taza (240 ml)</option>
                    <option value="cucharada">Cucharada</option>
                    <option value="cucharadita">Cucharadita</option>
                    <option value="oz">Oz fluida</option>
                  </select>
                </div>
              </div>
              <div className="result-box">
                <div><span className="result-num" id="conv-result">240</span><span className="result-unit" id="conv-unit">ml</span></div>
                <div className="result-hint" id="conv-hint">1 taza de líquido</div>
              </div>
            </div>
          </div>
          <div className="tool-panel" id="panel-porciones">
            <div className="tool-card">
              <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 16, lineHeight: 1.5 }}>
                Ajusta las cantidades de cualquier receta al número de personas que necesitas.
              </p>
              <div className="tool-row">
                <div style={{ flex: 1 }}>
                  <label className="tool-label" htmlFor="por-orig">Receta para</label>
                  <input className="tool-input" type="number" id="por-orig" defaultValue="4" min="1" step="1" />
                  <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>porciones originales</div>
                </div>
                <div className="or-arrow">→</div>
                <div style={{ flex: 1 }}>
                  <label className="tool-label" htmlFor="por-want">Quiero hacer</label>
                  <input className="tool-input" type="number" id="por-want" defaultValue="6" min="1" step="1" />
                  <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>porciones deseadas</div>
                </div>
              </div>
              <div className="result-box">
                <div><span className="result-num" id="por-result">1.50</span><span className="result-unit">×</span></div>
                <div className="result-hint" id="por-hint">Multiplica cada ingrediente por 1.50</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <div className="features-wrap">
        <div className="features-inner">
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1F2937', marginBottom: 3 }}>¿Por qué La Mia Cucina?</h2>
          <p style={{ fontSize: 13, color: '#6B7280' }}>Lo que ninguna otra app de recetas hace igual</p>
          <div className="feature-list">

            <div className="feature-item">
              <div className="feature-icon" style={{ background: '#D1FAE5' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" width="22" height="22"><path d="M5 13l4 4L19 7"/></svg>
              </div>
              <div className="feature-text">
                <h3>Nunca más pierdas una receta</h3>
                <p>Guarda lo que ves antes de que desaparezca. Sin capturas de pantalla, sin links rotos.</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon" style={{ background: '#FCE7F3' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#EC4899" strokeWidth="2" width="22" height="22"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/></svg>
              </div>
              <div className="feature-text">
                <h3>Instrucciones que sí se entienden</h3>
                <p>Cantidades exactas en español real. El paso activo siempre resaltado para que no pierdas el hilo.</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon" style={{ background: '#FEF9C3' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#B45309" strokeWidth="2" width="22" height="22"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
              </div>
              <div className="feature-text">
                <h3>Cocina y comparte</h3>
                <p>Manda la receta a quien vas a cocinar con un tap. Para la cena del fin de semana, para los amigos, para quien quieras impresionar.</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon" style={{ background: '#DBEAFE' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" width="22" height="22"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 3"/></svg>
              </div>
              <div className="feature-text">
                <h3>Para cocinar, no solo para inspirarte</h3>
                <p>Cada receta está lista para ejecutar cuando quieras. Gratis, sin registro.</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="cta">
        <h2>La receta perfecta, cuando la necesites.</h2>
        <p className="cta-sub">Descárgala gratis. Ingredientes exactos, paso a paso claro y Chef Mía para cuando tengas dudas.</p>
        <a href={APP_STORE_URL} className="btn-download">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
          Descargar gratis en App Store
        </a>
        <p className="cta-note">iPhone · iOS 16 o superior</p>
      </div>

      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
        {
          "@context": "https://schema.org",
          "@type": "MobileApplication",
          "name": "La Mia Cucina",
          "operatingSystem": "iOS",
          "applicationCategory": "FoodAndDrinkApplication",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
          "downloadUrl": "https://apps.apple.com/app/id6757924220"
        },
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            { "@type": "Question", "name": "¿La Mia Cucina es gratis?", "acceptedAnswer": { "@type": "Answer", "text": "Gratis para descargar y usar." } },
            { "@type": "Question", "name": "¿Qué tipo de recetas tiene?", "acceptedAnswer": { "@type": "Answer", "text": "Hay de todo: colombiana, italiana, mexicana, asiática, saludable, postres, casera rápida y más." } },
            { "@type": "Question", "name": "¿Quién es Chef Mía?", "acceptedAnswer": { "@type": "Answer", "text": "Tu asistente de cocina con IA, sin costo adicional. Dile qué tienes en la nevera y te sugiere recetas reales de la app. Y si tienes dudas mientras cocinas, también te las resuelve." } },
            { "@type": "Question", "name": "¿En qué idioma está la app?", "acceptedAnswer": { "@type": "Answer", "text": "Toda la app está en español latinoamericano." } },
            { "@type": "Question", "name": "¿Está disponible para Android?", "acceptedAnswer": { "@type": "Answer", "text": "Por ahora solo para iPhone. Android está en desarrollo." } }
          ]
        }
      ]) }} />

      {/* FAQ */}
      <section className="faq">
        <div className="faq-inner">
          <h2>Preguntas frecuentes</h2>
          <details>
            <summary>¿La Mia Cucina es gratis?</summary>
            <p className="faq-answer">Gratis para descargar y usar.</p>
          </details>
          <details>
            <summary>¿Qué tipo de recetas tiene?</summary>
            <p className="faq-answer">Hay de todo: colombiana, italiana, mexicana, asiática, saludable, postres, casera rápida y más. La variedad es parte del chiste. Siempre encuentras algo nuevo.</p>
          </details>
          <details>
            <summary>¿Quién es Chef Mía?</summary>
            <p className="faq-answer">Tu asistente de cocina con IA, sin costo adicional. Dile qué tienes en la nevera y te sugiere recetas reales de la app. Y si tienes dudas mientras cocinas, tiempos, cantidades o sustituciones, también te las resuelve.</p>
          </details>
          <details>
            <summary>¿En qué idioma está la app?</summary>
            <p className="faq-answer">Toda la app está en español latinoamericano. Recetas, instrucciones y Chef Mía.</p>
          </details>
          <details>
            <summary>¿Está disponible para Android?</summary>
            <p className="faq-answer">Por ahora solo para iPhone. Android está en desarrollo.</p>
          </details>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <p>© 2026 <span>La Mia Cucina</span> · Hecho con amor en Colombia</p>
      </footer>

      {/* Script herramientas interactivas */}
      <script dangerouslySetInnerHTML={{ __html: `
        const grams = {
          liquido: { taza: 240, cucharada: 15, cucharadita: 5, oz: 29.57 },
          harina: { taza: 125, cucharada: 7.8, cucharadita: 2.6, oz: 28.35 },
          azucar: { taza: 200, cucharada: 12.5, cucharadita: 4.2, oz: 28.35 },
          mantequilla: { taza: 227, cucharada: 14.2, cucharadita: 4.7, oz: 28.35 },
          arroz: { taza: 185, cucharada: 11.6, cucharadita: 3.9, oz: 28.35 }
        };
        const ingrLabels = { liquido: 'líquido', harina: 'harina', azucar: 'azúcar', mantequilla: 'mantequilla', arroz: 'arroz' };
        const unitLabels = { taza: 'taza', cucharada: 'cucharada', cucharadita: 'cucharadita', oz: 'oz' };

        function calcConv() {
          const ingr = document.getElementById('conv-ingr').value;
          const amt = parseFloat(document.getElementById('conv-amt').value) || 0;
          const from = document.getElementById('conv-from').value;
          const result = amt * grams[ingr][from];
          const unit = ingr === 'liquido' ? 'ml' : 'g';
          document.getElementById('conv-result').textContent = result % 1 === 0 ? result : result.toFixed(1);
          document.getElementById('conv-unit').textContent = unit;
          document.getElementById('conv-hint').textContent = amt + ' ' + unitLabels[from] + (amt !== 1 ? 's' : '') + ' de ' + ingrLabels[ingr];
        }

        function calcPor() {
          const orig = parseFloat(document.getElementById('por-orig').value) || 1;
          const want = parseFloat(document.getElementById('por-want').value) || 1;
          const f = want / orig;
          const d = f % 1 === 0 ? f.toFixed(0) : f.toFixed(2);
          document.getElementById('por-result').textContent = d;
          document.getElementById('por-hint').textContent = 'Multiplica cada ingrediente por ' + d;
        }

        document.getElementById('tab-conversor').addEventListener('click', function() {
          document.getElementById('tab-conversor').classList.add('active');
          document.getElementById('tab-porciones').classList.remove('active');
          document.getElementById('panel-conversor').classList.add('active');
          document.getElementById('panel-porciones').classList.remove('active');
        });
        document.getElementById('tab-porciones').addEventListener('click', function() {
          document.getElementById('tab-porciones').classList.add('active');
          document.getElementById('tab-conversor').classList.remove('active');
          document.getElementById('panel-porciones').classList.add('active');
          document.getElementById('panel-conversor').classList.remove('active');
        });

        document.getElementById('conv-ingr').addEventListener('change', calcConv);
        document.getElementById('conv-amt').addEventListener('input', calcConv);
        document.getElementById('conv-from').addEventListener('change', calcConv);
        document.getElementById('por-orig').addEventListener('input', calcPor);
        document.getElementById('por-want').addEventListener('input', calcPor);

        calcConv();
      `}} />
    </>
  );
}
