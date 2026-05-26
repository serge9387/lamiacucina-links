import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { DM_Sans } from 'next/font/google';
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700', '800'],
  display: 'swap',
});

export const metadata = {
  alternates: {
    canonical: 'https://lamiacucina.app',
  },
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
  other: {
    'apple-itunes-app': 'app-id=6757924220',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={dmSans.className}>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
