import type { ChangeEvent } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import type { ChartDatum, ChartDimension } from "../types/vehicle"

type FleetChartProps = {
  data: ChartDatum[]
  dimension: ChartDimension
  onDimensionChange: (dimension: ChartDimension) => void
}

export const FleetChart = ({
  data,
  dimension,
  onDimensionChange,
}: FleetChartProps) => {
  const handleDimensionChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value as ChartDimension
    onDimensionChange(value)
  }

  return (
    <section
      aria-labelledby="chart-heading"
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 id="chart-heading" className="text-lg font-semibold text-slate-800">
          Distribution
        </h2>
        <fieldset
          className="flex flex-wrap gap-4"
          aria-label="Chart breakdown dimension"
        >
          <legend className="sr-only">Break down chart by</legend>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
            <input
              type="radio"
              name="chart-dimension"
              value="status"
              checked={dimension === "status"}
              onChange={handleDimensionChange}
              className="h-4 w-4 border-slate-300 text-sky-600 focus:ring-sky-500"
            />
            By status
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
            <input
              type="radio"
              name="chart-dimension"
              value="branch"
              checked={dimension === "branch"}
              onChange={handleDimensionChange}
              className="h-4 w-4 border-slate-300 text-sky-600 focus:ring-sky-500"
            />
            By branch
          </label>
        </fieldset>
      </div>

      <p className="mt-1 text-sm text-slate-500">
        Counts reflect the filtered fleet (same as the table below).
      </p>

      <div
        className="mt-6 h-72 w-full min-h-[18rem]"
        role="img"
        aria-label="Bar chart of vehicle counts for the selected breakdown"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: "#475569" }}
              interval={0}
              angle={dimension === "branch" ? -35 : 0}
              textAnchor={dimension === "branch" ? "end" : "middle"}
              height={dimension === "branch" ? 72 : 32}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 12, fill: "#475569" }}
            />
            <Tooltip
              cursor={{ fill: "#f1f5f9" }}
              contentStyle={{
                borderRadius: "0.5rem",
                borderColor: "#e2e8f0",
                fontSize: "0.875rem",
              }}
            />
            <Bar dataKey="count" name="Vehicles" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
