const APP_STORE_URL = 'https://apps.apple.com/app/id6757924220'

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      textAlign: 'center',
      background: '#F0FDF9',
    }}>
      <div style={{ fontSize: '64px', marginBottom: '16px' }}>🍽️</div>
      <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#1F2937', marginBottom: '8px' }}>
        Receta no encontrada
      </h1>
      <p style={{ fontSize: '15px', color: '#6B7280', marginBottom: '28px', maxWidth: '280px' }}>
        Esta receta no existe o fue eliminada. Pero tenemos 95+ más en la app.
      </p>
      
        href={APP_STORE_URL}
        style={{
          background: '#10B981',
          color: 'white',
          padding: '14px 28px',
          borderRadius: '999px',
          fontSize: '15px',
          fontWeight: '700',
          textDecoration: 'none',
        }}
      >
        Ver recetas en La Mia Cucina
      </a>
    </div>
  )
}
