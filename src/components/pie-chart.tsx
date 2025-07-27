"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Pie, PieChart, Label } from "recharts"
import { useEffect, useMemo, useState } from "react"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A donut chart with text"

type Transaction = {
    id: number;
    title: string;
    category: string;
    amount: number;
    type: "income" | "expense" | "investment" | "transfer" | "subscription" | "refund";
    status: "completed" | "pending" | "cancelled";
    created_at: string;
    user_id?: string | undefined;
}

interface DataForPieChartProps {
    data: Transaction[]
}

export function ChartPieDonutText({ data }: DataForPieChartProps) {
    const [localData, setLocalData] = useState<Transaction[]>(data)
    const [chartData, setChartData] = useState<
        { browser: string; visitors: number; fill: string }[]
    >([])

    const chartConfig = useMemo(() => {
        const config: ChartConfig = {}
        chartData.forEach((item) => {
            config[item.browser] = {
                label: item.browser,
                color: item.fill,
            }
        })
        return config
    }, [chartData])

    // PieChart datasını oluştur (type bazlı)
    const [totalTransactions, setTotalTransactions] = useState(0)

        useEffect(() => {
            setLocalData(data)

            const typeMap: { [type: string]: number } = {}

            data.forEach((tx) => {
                if (!typeMap[tx.type]) {
                    typeMap[tx.type] = 0
                }
                typeMap[tx.type] += tx.amount
            })

            const typeColors: { [type in Transaction["type"]]: string } = {
                income: "#4caf50",        // yeşil
                expense: "#f44336",       // kırmızı
                investment: "#2196f3",    // mavi
                transfer: "#9c27b0",      // mor
                subscription: "#ff9800",  // turuncu
                refund: "#00bcd4",        // camgöbeği
            }


            const transformed = Object.entries(typeMap).map(([type, total]) => ({
                browser: type,
                visitors: total,
                fill: typeColors[type as Transaction["type"]] || "gray",
            }))

            setChartData(transformed)
            setTotalTransactions(localData.length)
        }, [data])

    const totalVisitors = useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.visitors, 0)
    }, [chartData])

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Spending Breakdown by Type</CardTitle>
                <CardDescription>January - June 2024</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="visitors"
                            nameKey="browser"
                            innerRadius={60}
                            strokeWidth={5}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    fill="#000"
                                                    className="text-3xl font-bold"
                                                >
                                                    {totalTransactions}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    fill="#666"
                                                    className="text-sm"
                                                >
                                                    Total Transactions
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />

                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 leading-none font-medium">
                    Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-muted-foreground leading-none">
                    Categorized by transaction types
                </div>
            </CardFooter>
        </Card>
    )
}
