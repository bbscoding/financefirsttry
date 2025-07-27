'use client'

import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { LoginForm } from "@/components/login-form"
import { useRouter } from 'next/navigation'
import { useState } from "react"

type LoginData = {
  email: string
  password: string
}

export default function Page() {
  const supabase = useSupabaseClient()
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState('')


  async function handleLogin({ email, password }: LoginData) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      // setErrorMessage("Login Failed: Your user ID or password is incorrect")
      console.error("Login error:", error)
      setErrorMessage(error.message)
    } else {
      setErrorMessage("")
      router.push('/dashboard')
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm onSubmit={handleLogin} errorMessage={errorMessage} />
      </div>
    </div>
  )
}
