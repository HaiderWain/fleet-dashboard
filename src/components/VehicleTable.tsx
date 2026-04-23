import { useEffect, useMemo, useState } from "react"
import type { Vehicle, VehicleStatus } from "../types/vehicle"

type VehicleTableProps = {
  vehicles: Vehicle[]
}

type SortKey =
  | "vehicle_id"
  | "vehicle"
  | "branch"
  | "status"
  | "fuel_type"
  | "mileage"
  | "daily_rate"
  | "last_service_date"

type SortDirection = "asc" | "desc"

type SortState = {
  key: SortKey
  direction: SortDirection
}

const formatStatusLabel = (status: VehicleStatus) => {
  if (status === "on_rent") {
    return "On rent"
  }
  if (status === "maintenance") {
    return "Maintenance"
  }
  return "Available"
}

const formatFuelLabel = (fuel: Vehicle["fuel_type"]) =>
  fuel.charAt(0).toUpperCase() + fuel.slice(1)

const STATUS_BADGE_CLASS_BY_STATUS: Record<VehicleStatus, string> = {
  available:
    "inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800",
  on_rent:
    "inline-flex rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-800",
  maintenance:
    "inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-900",
}

const compareStrings = (a: string, b: string) => a.localeCompare(b, undefined, { sensitivity: "base" })

const compareVehicles = (a: Vehicle, b: Vehicle, key: SortKey, direction: SortDirection) => {
  const factor = direction === "asc" ? 1 : -1
  if (key === "vehicle_id") {
    return factor * compareStrings(a.vehicle_id, b.vehicle_id)
  }
  if (key === "vehicle") {
    const byMake = compareStrings(a.make, b.make)
    if (byMake !== 0) {
      return factor * byMake
    }
    const byModel = compareStrings(a.model, b.model)
    if (byModel !== 0) {
      return factor * byModel
    }
    return factor * (a.year - b.year)
  }
  if (key === "branch") {
    return factor * compareStrings(a.branch, b.branch)
  }
  if (key === "status") {
    return factor * compareStrings(a.status, b.status)
  }
  if (key === "fuel_type") {
    return factor * compareStrings(a.fuel_type, b.fuel_type)
  }
  if (key === "mileage") {
    return factor * (a.mileage - b.mileage)
  }
  if (key === "daily_rate") {
    return factor * (a.daily_rate - b.daily_rate)
  }
  return factor * compareStrings(a.last_service_date, b.last_service_date)
}

const sortVehicles = (vehicles: Vehicle[], sort: SortState): Vehicle[] => {
  const copy = [...vehicles]
  copy.sort((a, b) => compareVehicles(a, b, sort.key, sort.direction))
  return copy
}

const SORT_KEY_LABELS: Record<SortKey, string> = {
  vehicle_id: "ID",
  vehicle: "Vehicle",
  branch: "Branch",
  status: "Status",
  fuel_type: "Fuel",
  mileage: "Mileage",
  daily_rate: "Daily rate",
  last_service_date: "Last service",
}

type SortableColumnHeaderProps = {
  sortKey: SortKey
  activeSort: SortState
  onSortChange: (next: SortState) => void
  align?: "left" | "right"
}

const PAGE_SIZE_OPTIONS = [20, 25, 50, 100] as const

const SortableColumnHeader = ({
  sortKey,
  activeSort,
  onSortChange,
  align = "left",
}: SortableColumnHeaderProps) => {
  const isActive = activeSort.key === sortKey
  const ariaSort = isActive
    ? activeSort.direction === "asc"
      ? "ascending"
      : "descending"
    : "none"

  const handleClick = () => {
    if (activeSort.key === sortKey) {
      onSortChange({
        key: sortKey,
        direction: activeSort.direction === "asc" ? "desc" : "asc",
      })
      return
    }
    onSortChange({ key: sortKey, direction: "asc" })
  }

  const label = SORT_KEY_LABELS[sortKey]
  const alignClass = align === "right" ? "text-right" : "text-left"
  const buttonAlignClass = align === "right" ? "justify-end" : "justify-start"

  return (
    <th scope="col" className={`px-3 py-3 ${alignClass}`} aria-sort={ariaSort}>
      <button
        type="button"
        onClick={handleClick}
        className={`inline-flex w-full cursor-pointer items-center gap-1 rounded px-1 py-0.5 font-semibold uppercase tracking-wide text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/40 ${buttonAlignClass}`}
        aria-label={`Sort by ${label}${isActive ? `, currently ${activeSort.direction === "asc" ? "ascending" : "descending"}` : ""}`}
        title={`Sort by ${label}`}
      >
        <span>{label}</span>
        <span
          className={`tabular-nums ${isActive ? "text-sky-600" : "text-slate-400"}`}
          aria-hidden="true"
        >
          {isActive ? (activeSort.direction === "asc" ? "↑" : "↓") : "↕"}
        </span>
      </button>
    </th>
  )
}

export const VehicleTable = ({ vehicles }: VehicleTableProps) => {
  const [sort, setSort] = useState<SortState>({
    key: "vehicle_id",
    direction: "asc",
  })
  const [rowsPerPage, setRowsPerPage] = useState<(typeof PAGE_SIZE_OPTIONS)[number]>(
    25,
  )
  const [currentPage, setCurrentPage] = useState(1)

  const sortedVehicles = useMemo(
    () => (vehicles.length === 0 ? vehicles : sortVehicles(vehicles, sort)),
    [vehicles, sort],
  )
  const totalRows = sortedVehicles.length
  const totalPages = Math.max(1, Math.ceil(totalRows / rowsPerPage))
  const pageStartIndex = (currentPage - 1) * rowsPerPage
  const pageEndIndex = pageStartIndex + rowsPerPage
  const paginatedVehicles = sortedVehicles.slice(pageStartIndex, pageEndIndex)
  const showingFrom = totalRows === 0 ? 0 : pageStartIndex + 1
  const showingTo = Math.min(pageEndIndex, totalRows)

  useEffect(() => {
    setCurrentPage(1)
  }, [vehicles, rowsPerPage])

  useEffect(() => {
    if (currentPage <= totalPages) {
      return
    }
    setCurrentPage(totalPages)
  }, [currentPage, totalPages])

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const nextPageSize = Number(event.target.value)
    if (!PAGE_SIZE_OPTIONS.includes(nextPageSize as (typeof PAGE_SIZE_OPTIONS)[number])) {
      return
    }
    setRowsPerPage(nextPageSize as (typeof PAGE_SIZE_OPTIONS)[number])
  }

  const handlePreviousPage = () => {
    if (currentPage === 1) {
      return
    }
    setCurrentPage((previous) => previous - 1)
  }

  const handleNextPage = () => {
    if (currentPage >= totalPages) {
      return
    }
    setCurrentPage((previous) => previous + 1)
  }

  return (
    <section
      aria-labelledby="table-heading"
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
        <h2
          id="table-heading"
          className="text-lg font-semibold text-slate-800"
        >
          Vehicles
        </h2>
        <p className="text-sm text-slate-500" aria-live="polite">
          Showing {showingFrom}-{showingTo} of {totalRows}{" "}
          {vehicles.length === 1 ? "vehicle" : "vehicles"}
          . Column headers sort the list.
        </p>
      </div>
      <p className="mt-1 text-xs text-slate-500">
        Tip: click any column header to sort, then click again to reverse the order.
      </p>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <label
          htmlFor="rows-per-page"
          className="flex items-center gap-2 text-sm text-slate-600"
        >
          Rows per page
          <select
            id="rows-per-page"
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40"
          >
            {PAGE_SIZE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <button
            type="button"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Go to previous page"
          >
            Previous
          </button>
          <span aria-live="polite">
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Go to next page"
          >
            Next
          </button>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-600">
            <tr>
              <SortableColumnHeader
                sortKey="vehicle_id"
                activeSort={sort}
                onSortChange={setSort}
              />
              <SortableColumnHeader
                sortKey="vehicle"
                activeSort={sort}
                onSortChange={setSort}
              />
              <SortableColumnHeader
                sortKey="branch"
                activeSort={sort}
                onSortChange={setSort}
              />
              <SortableColumnHeader
                sortKey="status"
                activeSort={sort}
                onSortChange={setSort}
              />
              <SortableColumnHeader
                sortKey="fuel_type"
                activeSort={sort}
                onSortChange={setSort}
              />
              <SortableColumnHeader
                sortKey="mileage"
                activeSort={sort}
                onSortChange={setSort}
                align="right"
              />
              <SortableColumnHeader
                sortKey="daily_rate"
                activeSort={sort}
                onSortChange={setSort}
                align="right"
              />
              <SortableColumnHeader
                sortKey="last_service_date"
                activeSort={sort}
                onSortChange={setSort}
              />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800">
            {vehicles.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-3 py-8 text-center text-slate-500"
                >
                  No vehicles match the current filters.
                </td>
              </tr>
            ) : (
              paginatedVehicles.map((vehicle) => (
                <tr key={vehicle.vehicle_id} className="hover:bg-slate-50/80">
                  <td className="whitespace-nowrap px-3 py-3 font-mono text-xs text-slate-600">
                    {vehicle.vehicle_id}
                  </td>
                  <td className="max-w-[14rem] px-3 py-3">
                    <span className="font-medium text-slate-900">
                      {vehicle.make} {vehicle.model}
                    </span>
                    <span className="block text-xs text-slate-500">
                      {vehicle.year}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {vehicle.branch}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <span className={STATUS_BADGE_CLASS_BY_STATUS[vehicle.status]}>
                      {formatStatusLabel(vehicle.status)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatFuelLabel(vehicle.fuel_type)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-right tabular-nums">
                    {vehicle.mileage.toLocaleString()}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-right tabular-nums">
                    £{vehicle.daily_rate.toFixed(2)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-slate-600">
                    {vehicle.last_service_date}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
