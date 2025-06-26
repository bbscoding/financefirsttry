"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import router from "next/router"
import { useSupabaseClient } from "@supabase/auth-helpers-react"

type RegisterFormProps = {
    className?: string
    onSubmit: (data: { email: string; password: string, passwordAgain: string }) => void
    errorMessage?: string
}


export function RegisterForm({ className, onSubmit, errorMessage }: RegisterFormProps) {
    const supabase = useSupabaseClient()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordAgain, setPasswordAgain] = useState("")
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        onSubmit({ email, password, passwordAgain })
    }
    const goSignupPage = () => {
        router.push('/login')
    }

    const handleGoogle = () => {
        supabase.auth.signInWithOAuth({
            provider: 'google',
        })
    }

    return (
        <div className={cn("flex flex-col gap-6", className)}>
            <Card>
                <CardHeader>
                    <CardTitle>Create your account</CardTitle>
                    <CardDescription>
                        Enter your email to cretea your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid gap-3">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid gap-3">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Enter Your Password Again</Label>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    value={passwordAgain}
                                    onChange={(e) => setPasswordAgain(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-3">
                                <Button type="submit" className="w-full">
                                    Register
                                </Button>
                                <Button variant="outline" className="w-full" onClick={handleGoogle}>
                                    Login with Google
                                </Button>

                                {/* <Button variant="outline" className="w-full">
                                    Login with Google
                                </Button> */}
                            </div>
                        </div>
                        {errorMessage && (
                            <p className="text-sm text-red-500 text-center mt-4">{errorMessage}</p>
                        )}
                        <div className="mt-4 text-center text-sm">
                            Already Have Account?{" "}
                            <a onClick={goSignupPage} className="underline underline-offset-4">
                                Login
                            </a>
                        </div>
                    </form>

                </CardContent>
            </Card>
        </div>
    )
}
