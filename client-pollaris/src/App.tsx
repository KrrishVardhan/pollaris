// import { Button } from "@/components/ui/button"
import { type ChartConfig } from "@/components/evilcharts/ui/chart";
import { EvilBarChart } from "@/components/evilcharts/charts/bar-chart";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useState } from "react";
import { Button } from "./components/ui/button";
import { Vote } from "lucide-react";

export function App() {
  const data = [
    { option: "React", votes: 4821 },
    { option: "Vue", votes: 2934 },
    { option: "Angular", votes: 1876 },
    { option: "Svelte", votes: 3102 },
    { option: "Next.js", votes: 4455 },
    { option: "SolidJS", votes: 1243 },
  ]

  const chartConfig = {
    votes: {
      label: "Votes",
      colors: {
        light: ["var(--chart-1)"],
        dark: ["var(--chart-1)"],
      },
      icon: Vote
    },
  } satisfies ChartConfig;

  return (
    <div className="flex min-h-screen justify-center items-center flex-col gap-5">
      <Card className="w-2xl">
        <CardHeader>
          <CardTitle>Poll results</CardTitle>
          <CardDescription>Which framework you use?</CardDescription>
        </CardHeader>
        <CardContent>
          <EvilBarChart
            xDataKey="option"
            stackType="default"
            data={data}
            chartConfig={chartConfig}
            barVariant='gradient'
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default App
