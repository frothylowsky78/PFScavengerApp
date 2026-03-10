import './globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'Powerflex French Quarter Scavenger Hunt',
  description: 'Mobile-first scavenger hunt app for live events'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="relative pb-12">
        {children}
        <a
          href="sms:+18587751225"
          className="fixed bottom-2 left-1/2 z-50 -translate-x-1/2 text-xs text-slate-300 underline underline-offset-2 hover:text-white"
        >
          text Alicia (858) 775-1225 for help
        </a>
      </body>
    </html>
  )
}
