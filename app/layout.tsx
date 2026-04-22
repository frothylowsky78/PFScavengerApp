import './globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'WorkMoney Park City Scavenger Hunt',
  description: 'Mobile-first scavenger hunt app for the WorkMoney Park City event'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="relative pb-16">
        {children}
        <a
          href="tel:+16192049010"
          className="fixed bottom-2 left-1/2 z-50 -translate-x-1/2 rounded-full bg-slate-900/80 px-3 py-1 text-xs text-slate-200 underline underline-offset-2 hover:text-white"
        >
          Need help? Carl Moczydlowsky · 619.204.9010
        </a>
      </body>
    </html>
  )
}
