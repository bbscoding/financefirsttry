import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import { type SupabaseClient } from '@supabase/supabase-js'
import { useState } from 'react'

export function useSupabaseBrowser(): SupabaseClient {
  const [supabaseClient] = useState(() => createPagesBrowserClient())
  return supabaseClient
}
