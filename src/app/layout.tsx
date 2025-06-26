"use client"
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import SupabaseProvider from '@/components/supabase-provider'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { useState } from 'react'


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [supabase] = useState(() => createPagesBrowserClient())

  return (
    <html lang="tr">
      <body>
        <SessionContextProvider supabaseClient={supabase}>
          {children}
        </SessionContextProvider>
      </body>
    </html>
  )
}
