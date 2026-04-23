import type { ChangeEvent } from "react"
import type { FleetFiltersState, FuelType, Vehicle, VehicleStatus } from "../types/vehicle"
import { getSortedUnique } from "../lib/aggregates"

type FleetFiltersProps = {
  vehicles: Vehicle[]
  filters: FleetFiltersState
  onFiltersChange: (filters: FleetFiltersState) => void
  heading?: string
  description?: string
  idPrefix?: string
}

const STATUS_OPTIONS: { value: VehicleStatus | "all"; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "available", label: "Available" },
  { value: "on_rent", label: "On rent" },
  { value: "maintenance", label: "Maintenance" },
]

const FUEL_OPTIONS: { value: FuelType | "all"; label: string }[] = [
  { value: "all", label: "All fuel types" },
  { value: "diesel", label: "Diesel" },
  { value: "petrol", label: "Petrol" },
  { value: "hybrid", label: "Hybrid" },
  { value: "electric", label: "Electric" },
]

export const FleetFilters = ({
  vehicles,
  filters,
  onFiltersChange,
  heading = "Filters",
  description,
  idPrefix = "fleet-filters",
}: FleetFiltersProps) => {
  const branchOptions = getSortedUnique(vehicles.map((vehicle) => vehicle.branch))
  const headingId = `${idPrefix}-heading`
  const branchSelectId = `${idPrefix}-branch`
  const statusSelectId = `${idPrefix}-status`
  const fuelSelectId = `${idPrefix}-fuel`

  const handleBranchChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value
    onFiltersChange({
      ...filters,
      branch: value === "all" ? "all" : value,
    })
  }

  const handleStatusChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as FleetFiltersState["status"]
    onFiltersChange({ ...filters, status: value })
  }

  const handleFuelChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as FleetFiltersState["fuelType"]
    onFiltersChange({ ...filters, fuelType: value })
  }

  return (
    <section
      aria-labelledby={headingId}
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2
        id={headingId}
        className="text-lg font-semibold text-slate-800"
      >
        {heading}
      </h2>
      {description ? (
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      ) : null}
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <div>
          <label
            htmlFor={branchSelectId}
            className="block text-sm font-medium text-slate-700"
          >
            Branch
          </label>
          <select
            id={branchSelectId}
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
            value={filters.branch === "all" ? "all" : filters.branch}
            onChange={handleBranchChange}
            aria-label="Filter by branch"
          >
            <option value="all">All branches</option>
            {branchOptions.map((branch) => (
              <option key={branch} value={branch}>
                {branch}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor={statusSelectId}
            className="block text-sm font-medium text-slate-700"
          >
            Status
          </label>
          <select
            id={statusSelectId}
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
            value={filters.status}
            onChange={handleStatusChange}
            aria-label="Filter by vehicle status"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor={fuelSelectId}
            className="block text-sm font-medium text-slate-700"
          >
            Fuel type
          </label>
          <select
            id={fuelSelectId}
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
            value={filters.fuelType}
            onChange={handleFuelChange}
            aria-label="Filter by fuel type"
          >
            {FUEL_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  )
}
