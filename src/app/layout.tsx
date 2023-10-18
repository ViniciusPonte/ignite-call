/* eslint-disable @next/next/no-async-client-component */
'use client'
import { globalStyles } from '@/styles/global'
import { SessionProvider } from 'next-auth/react'

globalStyles()

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}
