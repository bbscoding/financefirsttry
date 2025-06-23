'use client'

import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { LoginForm } from "@/components/login-form"
import { useRouter } from 'next/navigation'

type LoginData = {
  email: string
  password: string
}

export default function Page() {
  const supabase = useSupabaseClient()
  const router = useRouter()

  async function handleLogin({ email, password }: LoginData) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("Login error:", error)
    } else {
      console.log("Login successful:", data.user)
      router.push('/dashboard') // Örnek yönlendirme
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm onSubmit={handleLogin} />
      </div>
    </div>
  )
}
