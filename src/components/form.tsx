"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react"
import { useEffect } from "react"



const formSchema = z.object({
    title: z.string().min(2, {
        message: "Title must be at least 2 characters.",
    }),
    amount: z.coerce.number().min(1, {
        message: "Amount must be at least 1.",
    }),
    type: z.enum(['income', 'expense', 'investment', 'transfer', 'subscription', 'refund'], {
        required_error: "Type is required",
    }),
    category: z.string().min(2, {
        message: "Category must be at least 2 characters.",
    }),
})

export function MainForm({
    open,
    setOpen,
    initialValues,
    onSubmitSuccess,
}: {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    initialValues?: Partial<z.infer<typeof formSchema>> & { id?: number }
    onSubmitSuccess?: () => void
}) {
    const supabase = useSupabaseClient()
    const user = useUser()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: initialValues?.title || "",
            amount: initialValues?.amount || 0,
            type: initialValues?.type || "income",
            category: initialValues?.category || "Work",
        },
    })
    useEffect(() => {
        if (initialValues) {
            form.reset(initialValues)
        }
    }, [initialValues, form])

    const onSubmit = async (values: z.infer<typeof formSchema>): Promise<void> => {
        if (!user) return

        const payload = {
            title: values.title,
            amount: values.amount,
            type: values.type.toLowerCase(),
            category: values.category,
            user_id: user.id,
        }

        let error
        if (initialValues?.id) {
            // Update
            const res = await supabase
                .from("transactions")
                .update(payload)
                .eq("id", initialValues.id)
            error = res.error
        } else {
            // Create
            const res = await supabase
                .from("transactions")
                .insert([payload])
            error = res.error
        }

        if (error) {
            console.error("Supabase error:", error.message)
        } else {
            onSubmitSuccess?.()
            setOpen(false)
        }
    }



    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <DialogHeader>
                            <DialogTitle>Quick Create</DialogTitle>
                            <DialogDescription>
                                Fill out the transaction details.
                            </DialogDescription>
                        </DialogHeader>

                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Salary" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Amount</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="0" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Type</FormLabel>
                                    <FormControl>
                                        <select {...field} className="w-full border rounded px-2 py-1">
                                            <option value="income">Income</option>
                                            <option value="expense">Expense</option>
                                            <option value="investment">Investment</option>
                                            <option value="transfer">Transfer</option>
                                            <option value="subscription">Subscription</option>
                                            <option value="refund">Refund</option>
                                        </select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Work" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="submit">Save</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>

    )
}
