"use client"
import { useSessionContext } from "@supabase/auth-helpers-react"
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

import data from "./data.json"

export default function Page() {
  const { session, isLoading } = useSessionContext()
  const router = useRouter()
  const [userEmail, setUserEmail] = useState("")

  useEffect(() => {
    if (!session) {
      router.push("/login")
    } else {
      router.push("/dashboard")
    }
  }, [session, isLoading])
  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!session) {
    return null // Ya da bir loader dönebilirsin
  }
  else {
    // setUserEmail(session.user.email)
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
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              <DataTable data={data} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
