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
      description: recipe.description || 'Receta completa en La Mia Cucina',
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
      {/* Banner descarga */}
      <div style={{ position: 'sticky', top: 0, zIndex: 50, background: '#10B981', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', boxShadow: '0 2px 8px rgba(16,185,129,0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', background: 'white', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
            🍴
          </div>
          <div>
            <p style={{ color: 'white', fontSize: '13px', fontWeight: '700', lineHeight: 1.2 }}>La Mia Cucina</p>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '11px' }}>95+ recetas · Gratis</p>
          </div>
        </div>
        <a href={APP_STORE_URL} style={{ background: 'white', color: '#10B981', padding: '8px 16px', borderRadius: '999px', fontSize: '13px', fontWeight: '700', textDecoration: 'none', whiteSpace: 'nowrap' }}>
          Descargar gratis
        </a>
      </div>

      {/* Foto hero */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#E5E7EB' }}>
        {recipe.image_url ? (
          <Image src={recipe.image_url} alt={recipe.title} fill style={{ objectFit: 'cover' }} priority />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px' }}>🍽️</div>
        )}
      </div>

      {/* Contenido */}
      <div style={{ background: 'white', borderRadius: '24px 24px 0 0', marginTop: '-20px', padding: '24px 20px 40px', maxWidth: '640px', margin: '-20px auto 0' }}>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
          {recipe.difficulty && <DifficultyBadge difficulty={recipe.difficulty} />}
          {recipe.category && <CategoryBadge category={recipe.category} />}
        </div>

        <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#1F2937', lineHeight: 1.2, marginBottom: '8px' }}>
          {recipe.title}
        </h1>

        {recipe.description && (
          <p style={{ fontSize: '15px', color: '#6B7280', lineHeight: 1.5, marginBottom: '20px' }}>
            {recipe.description}
