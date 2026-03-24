import './globals.css'

export const metadata = {
  title: 'La Mia Cucina — Recetas',
  description: 'Tu colección personal de recetas para hacer en casa.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
