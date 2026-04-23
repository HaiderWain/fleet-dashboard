import { useMemo, useState } from "react"
import { FleetChart } from "./components/FleetChart"
import { FleetFilters } from "./components/FleetFilters"
import { FleetInsights } from "./components/FleetInsights"
import { SummaryMetrics } from "./components/SummaryMetrics"
import { VehicleTable } from "./components/VehicleTable"
import { useFleetData } from "./hooks/useFleetData"
import { filterVehicles, getChartData } from "./lib/aggregates"
import type { ChartDimension, FleetFiltersState } from "./types/vehicle"

const DEFAULT_FILTERS: FleetFiltersState = {
  branch: "all",
  status: "all",
  fuelType: "all",
}

const App = () => {
  const fleetState = useFleetData()
  const [filters, setFilters] = useState<FleetFiltersState>(DEFAULT_FILTERS)
  const [chartDimension, setChartDimension] = useState<ChartDimension>("status")

  const filteredVehicles = useMemo(() => {
    if (fleetState.status !== "ready") {
      return []
    }
    return filterVehicles(fleetState.vehicles, filters)
  }, [fleetState, filters])

  const chartData = useMemo(
    () => getChartData(filteredVehicles, chartDimension),
    [filteredVehicles, chartDimension],
  )

  if (fleetState.status === "loading" || fleetState.status === "idle") {
    return (
      <div className="min-h-screen bg-slate-100 px-4 py-16 text-center text-slate-600">
        <p className="text-lg font-medium text-slate-800">Loading fleet data…</p>
        <p className="mt-2 text-sm">Fetching CSV from the server.</p>
      </div>
    )
  }

  if (fleetState.status === "error") {
    return (
      <div className="min-h-screen bg-slate-100 px-4 py-16 text-center">
        <p className="text-lg font-semibold text-red-700">Something went wrong</p>
        <p className="mt-2 text-sm text-slate-600">{fleetState.message}</p>
      </div>
    )
  }

  const { vehicles } = fleetState

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Fleet dashboard
          </h1>
          <p className="max-w-2xl text-sm text-slate-600 sm:text-base">
            Live view of the rental fleet: totals, filters, a distribution chart,
            plain-language insights for your current filters, and a sortable vehicle
            table.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
        <SummaryMetrics vehicles={vehicles} />
        <FleetFilters
          vehicles={vehicles}
          filters={filters}
          onFiltersChange={setFilters}
          heading="Dashboard filters"
          description="These controls update the chart, insights, and table."
          idPrefix="dashboard-filters"
        />
        <FleetChart
          data={chartData}
          dimension={chartDimension}
          onDimensionChange={setChartDimension}
        />
        <FleetInsights vehicles={filteredVehicles} />
        <VehicleTable vehicles={filteredVehicles} />
      </main>
    </div>
  )
}

export default App
