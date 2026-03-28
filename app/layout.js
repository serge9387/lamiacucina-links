import { Analytics } from '@vercel/analytics/next';
import './globals.css'

export const metadata = {
  title: 'La Mia Cucina — Recetas',
  description: 'Tu colección personal de recetas para hacer en casa.',
  icons: {
    icon: 'https://xyxdgyqduvjsepzyblju.supabase.co/storage/v1/object/public/Assets/icon.png',
    apple: 'https://xyxdgyqduvjsepzyblju.supabase.co/storage/v1/object/public/Assets/icon.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
