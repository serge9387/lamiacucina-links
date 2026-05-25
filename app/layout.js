import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Script from 'next/script';
import './globals.css'

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
    <html lang="es">
      <body>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XEB795BV7P"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XEB795BV7P');
  `}
        </Script>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
