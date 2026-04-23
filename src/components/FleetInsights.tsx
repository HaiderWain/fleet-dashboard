import { useMemo } from "react"
import type { Vehicle } from "../types/vehicle"
import { getFleetInsightLines } from "../lib/insights"

type FleetInsightsProps = {
  vehicles: Vehicle[]
}

export const FleetInsights = ({ vehicles }: FleetInsightsProps) => {
  const lines = useMemo(() => getFleetInsightLines(vehicles), [vehicles])

  return (
    <section
      aria-labelledby="insights-heading"
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2
        id="insights-heading"
        className="text-lg font-semibold text-slate-800"
      >
        Insights
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        These notes are computed from the same filtered set as the chart and
        table below (summary cards above still show the full fleet).
      </p>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-700">
        {lines.map((line) => (
          <li key={line.id}>{line.text}</li>
        ))}
      </ul>
    </section>
  )
}
