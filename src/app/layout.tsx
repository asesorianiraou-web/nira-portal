import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'NIRA LEGAL GROUP | Asesoría jurídica con compromiso social',
  description:
    'NIRA LEGAL GROUP es una asesoría jurídica centrada en justicia, ética y compromiso social. Orientación y acompañamiento en laboral, extranjería, micropréstamos y más.',
  keywords: [
    'NIRA LEGAL GROUP',
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
    title: 'NIRA LEGAL GROUP',
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
