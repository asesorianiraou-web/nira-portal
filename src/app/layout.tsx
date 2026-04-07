import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'NIRA Legal Group | Asesoría jurídica con compromiso social',
  description:
    'NIRA Legal Group es una asesoría jurídica centrada en justicia, ética y compromiso social. Orientación y acompañamiento en laboral, extranjería, micropréstamos y más.',
  keywords: [
    'NIRA Legal Group',
    'asesoría jurídica',
    'despacho jurídico',
    'laboral',
    'extranjería',
    'micropréstamos',
    'justicia social',
    'orientación legal',
    'abogado accesible',
    'asesoría legal'
  ],
  openGraph: {
    title: 'NIRA Legal Group',
    description:
      'Justicia, ética y compromiso social. Acompañamiento jurídico real para quienes más lo necesitan.',
    images: ['/images/nira_logo.png'],
    type: 'website'
  },
  icons: {
    icon: '/images/nira_logo.png',
    shortcut: '/images/nira_logo.png',
    apple: '/images/nira_logo.png'
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}