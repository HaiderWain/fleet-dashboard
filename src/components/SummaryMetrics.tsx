import type { Vehicle } from "../types/vehicle"
import { getBranchCounts, getStatusCounts } from "../lib/aggregates"

type SummaryMetricsProps = {
  vehicles: Vehicle[]
}

export const SummaryMetrics = ({ vehicles }: SummaryMetricsProps) => {
  const total = vehicles.length
  const statusCounts = getStatusCounts(vehicles)
  const branchRows = getBranchCounts(vehicles)

  return (
    <section
      aria-labelledby="summary-heading"
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2
        id="summary-heading"
        className="text-lg font-semibold text-slate-800"
      >
        Fleet overview
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        Summary metrics for the full fleet (not affected by filters).
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-500">Total vehicles</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-slate-900">
            {total}
          </p>
        </div>
        <div className="rounded-lg bg-emerald-50 p-4">
          <p className="text-sm font-medium text-emerald-800">Available</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-emerald-900">
            {statusCounts.available}
          </p>
        </div>
        <div className="rounded-lg bg-sky-50 p-4">
          <p className="text-sm font-medium text-sky-800">On rent</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-sky-900">
            {statusCounts.on_rent}
          </p>
        </div>
        <div className="rounded-lg bg-amber-50 p-4">
          <p className="text-sm font-medium text-amber-800">Maintenance</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-amber-900">
            {statusCounts.maintenance}
          </p>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-sm font-semibold text-slate-700">By branch</h3>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {branchRows.map((row) => (
            <li
              key={row.name}
              className="flex items-center justify-between rounded-md border border-slate-100 bg-slate-50 px-3 py-2 text-sm"
            >
              <span className="font-medium text-slate-700">{row.name}</span>
              <span className="tabular-nums text-slate-600">{row.count}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
