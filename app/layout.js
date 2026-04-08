import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css'

export const metadata = {
  title: 'La Mia Cucina — Tu colección personal de recetas',
  description: 'App gratis para iPhone con recetas curadas de cocina italiana, colombiana, mexicana y más. Con Chef Mía, tu asistente IA personal.',
  icons: {
    icon: 'https://xyxdgyqduvjsepzyblju.supabase.co/storage/v1/object/public/Assets/icon.png',
    apple: 'https://xyxdgyqduvjsepzyblju.supabase.co/storage/v1/object/public/Assets/icon.png',
  },
  openGraph: {
    title: 'La Mia Cucina — Tu colección personal de recetas',
    description: 'App gratis para iPhone con recetas curadas de cocina italiana, colombiana, mexicana y más. Con Chef Mía, tu asistente IA personal.',
    url: 'https://lamiacucina.app',
    siteName: 'La Mia Cucina',
    locale: 'es_CO',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
