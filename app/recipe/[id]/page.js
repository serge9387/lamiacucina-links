import { supabase } from '../../../lib/supabase'
import { notFound } from 'next/navigation'
import Image from 'next/image'

const APP_STORE_URL = 'https://apps.apple.com/app/id6757924220'

export async function generateMetadata({ params }) {
  const recipe = await getRecipe(params.id)
  if (!recipe) return { title: 'La Mia Cucina' }
  return {
    title: `${recipe.title} — La Mia Cucina`,
    description: recipe.description || `${recipe.title}. ${recipe.total_time} min · ${recipe.difficulty}`,
    openGraph: {
      title: recipe.title,
      description: recipe.description || `Receta completa en La Mia Cucina`,
      images: recipe.image_url ? [{ url: recipe.image_url, width: 1200, height: 630 }] : [],
      siteName: 'La Mia Cucina',
    },
  }
}

async function getRecipe(id) {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('id', id)
    .single()
  if (error || !data) return null
  return data
}

function DifficultyBadge({ difficulty }) {
  const colors = {
    'Fácil': { bg: '#D1FAE5', text: '#065F46' },
    'Intermedio': { bg: '#FEF3C7', text: '#92400E' },
    'Difícil': { bg: '#FEE2E2', text: '#991B1B' },
  }
  const color = colors[difficulty] || colors['Fácil']
  return (
    <span style={{ background: color.bg, color: color.text, padding: '4px 10px', borderRadius: '999px', fontSize: '13px', fontWeight: '600' }}>
      {difficulty}
    </span>
  )
}

function CategoryBadge({ category }) {
  return (
    <span style={{ background: '#DBEAFE', color: '#1E40AF', padding: '4px 10px', borderRadius: '999px', fontSize: '13px', fontWeight: '600' }}>
      {category}
    </span>
  )
}

export default async function RecipePage({ params }) {
  const recipe = await getRecipe(params.id)
  if (!recipe) notFound()

  let ingredients = []
  if (recipe.ingredients) {
    const raw = typeof recipe.ingredients === 'string' ? JSON.parse(recipe.ingredients) : recipe.ingredients
    if (Array.isArray(raw)) {
      ingredients = raw.map(item => {
        if (typeof item === 'string') return item
        const amount = item.amount || item.quantity || ''
        const unit = item.unit || ''
        const name = item.name || item.ingredient || ''
        return [amount, unit, name].filter(Boolean).join(' ')
      })
    }
  }

  const steps = Array.isArray(recipe.instructions)
    ? recipe.instructions
    : (recipe.instructions ? recipe.instructions.split('\n').filter(Boolean) : [])

  return (
    <>
      <div style={{ position: 'sticky', top: 0, zIndex: 50, background: '#10B981', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', boxShadow: '0 2px 8px rgba(16,185,129,0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}><img src="https://xyxdgyqduvjsepzyblju.supabase.co/storage/v1/object/public/Assets/icon.png" style={{width:'100%',height:'100%',objectFit:'cover'}} alt="La Mia Cucina"/></div>
          <div>
            <p style={{ color: 'white', fontSize: '13px', fontWeight: '700', lineHeight: 1.2 }}>La Mia Cucina</p>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '11px' }}>Descubre nuevas recetas cada día</p>
          </div>
        </div>
        <a href={APP_STORE_URL} style={{ background: '#EC4899', color: 'white', padding: '8px 16px', borderRadius: '999px', fontSize: '13px', fontWeight: '700', textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0 }}>
          Descargar gratis
        </a>
      </div>

      <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#E5E7EB' }}>
        {recipe.image_url ? (
          <Image src={recipe.image_url} alt={recipe.title} fill style={{ objectFit: 'cover' }} priority />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px' }}>🍽️</div>
        )}
      </div>

      <div style={{ background: 'white', borderRadius: '24px 24px 0 0', marginTop: '-20px', padding: '24px 20px 40px', maxWidth: '640px', margin: '-20px auto 0' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
          {recipe.difficulty && <DifficultyBadge difficulty={recipe.difficulty} />}
          {recipe.category && <CategoryBadge category={recipe.category} />}
        </div>

        <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#1F2937', lineHeight: 1.2, marginBottom: '8px' }}>{recipe.title}</h1>

        {recipe.description && (
          <p style={{ fontSize: '15px', color: '#6B7280', lineHeight: 1.5, marginBottom: '20px' }}>{recipe.description}</p>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '28px' }}>
          {recipe.total_time && (
            <div style={{ background: '#F0FDF9', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>⏱</div>
              <div style={{ fontSize: '15px', fontWeight: '700', color: '#1F2937' }}>{recipe.total_time} min</div>
              <div style={{ fontSize: '11px', color: '#6B7280' }}>Tiempo</div>
            </div>
          )}
          {recipe.servings && (
            <div style={{ background: '#F0FDF9', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>👥</div>
              <div style={{ fontSize: '15px', fontWeight: '700', color: '#1F2937' }}>{recipe.servings}</div>
              <div style={{ fontSize: '11px', color: '#6B7280' }}>Porciones</div>
            </div>
          )}
          {recipe.calories && (
            <div style={{ background: '#F0FDF9', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>🔥</div>
              <div style={{ fontSize: '15px', fontWeight: '700', color: '#1F2937' }}>{recipe.calories}</div>
              <div style={{ fontSize: '11px', color: '#6B7280' }}>Calorías</div>
            </div>
          )}
        </div>

        {ingredients.length > 0 && (
          <section style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1F2937', marginBottom: '14px', paddingBottom: '8px', borderBottom: '2px solid #D1FAE5' }}>Ingredientes</h2>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {ingredients.map((ingredient, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '15px', color: '#374151', lineHeight: 1.4 }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', flexShrink: 0, marginTop: '7px' }} />
                  {ingredient}
                </li>
              ))}
            </ul>
          </section>
        )}

        {steps.length > 0 && (
          <section style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1F2937', marginBottom: '14px', paddingBottom: '8px', borderBottom: '2px solid #D1FAE5' }}>Instrucciones</h2>
            <ol style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {steps.map((step, i) => (
                <li key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#10B981', color: 'white', fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                    {i + 1}
                  </span>
                  <p style={{ fontSize: '15px', color: '#374151', lineHeight: 1.6 }}>{step}</p>
                </li>
              ))}
            </ol>
          </section>
        )}

        <div style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', borderRadius: '20px', padding: '24px', textAlign: 'center' }}>
          <p style={{ color: 'white', fontSize: '17px', fontWeight: '700', marginBottom: '6px' }}>¿Te gustó esta receta?</p>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px', marginBottom: '18px', lineHeight: 1.4 }}>Descure nuevas recetas cada semana. Descárgala gratis.</p>
          <a href={APP_STORE_URL} style={{ display: 'inline-block', background: '#EC4899', color: 'white', padding: '14px 32px', borderRadius: '999px', fontSize: '15px', fontWeight: '700', textDecoration: 'none' }}>
            Descargar gratis en el App Store
          </a>
        </div>
      </div>
    </>
  )
}
