/* eslint-disable @next/next/no-async-client-component */
'use client'
import '@/lib/dayjs'
import { queryClient } from '@/lib/react-query'
import { globalStyles } from '@/styles/global'
import { QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'
import { DefaultSeo } from 'next-seo'

globalStyles()

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <DefaultSeo
            openGraph={{
              type: 'website',
              locale: 'pt_BR',
              url: 'https://ignite-call.rocketseat.com.br',
              siteName: 'Ignite Call',
            }}
          />
          <SessionProvider>{children}</SessionProvider>
        </QueryClientProvider>
      </body>
    </html>
  )
}
