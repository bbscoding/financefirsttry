"use client"

import { useSessionContext, useSupabaseClient } from "@supabase/auth-helpers-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

// import data from "./data.json"

export default function Page() {
  const { session, isLoading } = useSessionContext()
  const supabase = useSupabaseClient()
  const router = useRouter()
  const [transactions, setTransactions] = useState<any[]>([])

  useEffect(() => {
    if (!session && !isLoading) {
      router.push("/login")
    }
  }, [session, isLoading, router])

  useEffect(() => {
    const fetchTransactions = async () => {
      if (session) {
        const { data, error } = await supabase
          .from("transactions")
          .select("*")
          .eq("user_id", session.user.id)

        if (error) {
          console.error("Fetch error:", error.message)
        } else {
          setTransactions(data)
          console.log(data)
          console.log(transactions)
        }
      }
    }

    fetchTransactions()
  }, [session, supabase])

  if (isLoading || !session) {
    return <div>Loading...</div>
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards transactions={transactions} />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive transactions={transactions} />
              </div>
              <DataTable data={transactions} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
