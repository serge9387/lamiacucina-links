export default function NotFound() {
  const url = 'https://apps.apple.com/app/id6757924220'
  const wrap = { minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'24px', textAlign:'center', background:'#F0FDF9' }
  const h1 = { fontSize:'22px', fontWeight:'800', color:'#1F2937', marginBottom:'8px' }
  const p = { fontSize:'15px', color:'#6B7280', marginBottom:'28px', maxWidth:'280px' }
  const a = { background:'#10B981', color:'white', padding:'14px 28px', borderRadius:'999px', fontSize:'15px', fontWeight:'700', textDecoration:'none' }
  return (
    <div style={wrap}>
      <div style={{fontSize:'64px', marginBottom:'16px'}}>🍽️</div>
      <h1 style={h1}>Receta no encontrada</h1>
      <p style={p}>Esta receta no existe o fue eliminada. Pero tenemos 95+ más en la app.</p>
      <a href={url} style={a}>Ver recetas en La Mia Cucina</a>
    </div>
  )
}
