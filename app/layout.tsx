import './globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'Powerflex French Quarter Scavenger Hunt',
  description: 'Mobile-first scavenger hunt app for live events'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
