'use client'

import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { RegisterForm } from "@/components/register-form"
import { useRouter } from 'next/navigation'
import { useState } from "react"

type RegisterData = {
    email: string
    password: string
    passwordAgain: string
}

export default function Page() {
    const supabase = useSupabaseClient()
    const router = useRouter()
    const [errorMessage, setErrorMessage] = useState('')



    async function handleRegister({ email, password, passwordAgain }: RegisterData) {
        if (password !== passwordAgain) {
            setErrorMessage("Passwords don't match up, please check your password")
            return
        }
        else {
            const { data, error } = await supabase.auth.signUp({ email, password })

            if (error) {
                console.error("Login error:", error)
                setErrorMessage(error.message)
            } else {
                setErrorMessage("")
                console.log("Register successful:", data.user)
                router.push('/login') // Örnek yönlendirme
            }
        }
    }

    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <RegisterForm onSubmit={handleRegister} errorMessage={errorMessage} />
            </div>
        </div>
    )
}
