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

export function App() {
  const data = [
    { option: "React", votes: 186 },
    { option: "Vue", votes: 305 },
    { option: "Angular", votes: 237 },
    { option: "Svelte", votes: 73 },
    { option: "Next.js", votes: 209 },
    { option: "SolidJS", votes: 214 },
  ]

  const chartConfig = {
    votes: {
      label: "Votes",
      colors: {
        light: ["var(--chart-1)"],
        dark: ["var(--chart-1)"],
      },
    },
  } satisfies ChartConfig;
  return (
    <div className="flex min-h-screen justify-center items-center">
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
            barVariant='hatched'
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default App
