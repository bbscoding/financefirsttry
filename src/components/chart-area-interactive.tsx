"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

export const description = "Income vs Expense Chart"

const chartConfig = {
  income: {
    label: "Income",
    color: "#22c55e",
  },
  expense: {
    label: "Expense",
    color: "#ef4444",
  },
} satisfies ChartConfig


type Transaction = {
  created_at: string
  amount: number
  type: string
}

type ChartAreaInteractiveProps = {
  transactions: Transaction[]
}

function generateDateRange(days: number): string[] {
  const today = new Date()
  const dates: string[] = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    dates.push(d.toISOString().split("T")[0])
  }
  return dates
}

export function ChartAreaInteractive({ transactions }: ChartAreaInteractiveProps) {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")

  const dayCount = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90
  const dates = React.useMemo(() => generateDateRange(dayCount), [timeRange])

  const dailyData = React.useMemo(() => {
    const initial = dates.reduce((acc, date) => {
      acc[date] = { date, income: 0, expense: 0 }
      return acc
    }, {} as Record<string, { date: string; income: number; expense: number }>)

    transactions.forEach((tx) => {
      const date = new Date(tx.created_at).toISOString().split("T")[0]
      if (!initial[date]) return

      const type = tx.type.toLowerCase()
      const isIncome = type === "income" || type === "investment" || type === "refund"

      if (isIncome) initial[date].income += tx.amount
      else initial[date].expense += tx.amount
    })

    return Object.values(initial)
  }, [transactions, dates])

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Income vs Expense</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">Daily summary</span>
          <span className="@[540px]/card:hidden">Tap to filter</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40 @[767px]/card:hidden" size="sm">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <AreaChart data={dailyData}>
            <defs>
              <linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              interval="preserveStartEnd"
              minTickGap={24}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              defaultIndex={isMobile ? -1 : 10}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="income"
              type="natural"
              fill="url(#fillIncome)"
              stroke="#22c55e"
              stackId="income"
            />
            <Area
              dataKey="expense"
              type="natural"
              fill="url(#fillExpense)"
              stroke="#ef4444"
              stackId="expense"
            />


          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
