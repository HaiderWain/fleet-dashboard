import type { ChartDatum, ChartDimension, FleetFiltersState, Vehicle } from "../types/vehicle"

export const filterVehicles = (
  vehicles: Vehicle[],
  filters: FleetFiltersState,
): Vehicle[] =>
  vehicles.filter((vehicle) => {
    if (filters.branch !== "all" && vehicle.branch !== filters.branch) {
      return false
    }
    if (filters.status !== "all" && vehicle.status !== filters.status) {
      return false
    }
    if (filters.fuelType !== "all" && vehicle.fuel_type !== filters.fuelType) {
      return false
    }
    return true
  })

export const getStatusCounts = (vehicles: Vehicle[]) => {
  const counts = {
    available: 0,
    on_rent: 0,
    maintenance: 0,
  }
  for (const vehicle of vehicles) {
    counts[vehicle.status] += 1
  }
  return counts
}

export const getBranchCounts = (vehicles: Vehicle[]): ChartDatum[] => {
  const map = new Map<string, number>()
  for (const vehicle of vehicles) {
    map.set(vehicle.branch, (map.get(vehicle.branch) ?? 0) + 1)
  }
  return [...map.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
}

export const getChartData = (
  vehicles: Vehicle[],
  dimension: ChartDimension,
): ChartDatum[] => {
  if (dimension === "branch") {
    return getBranchCounts(vehicles)
  }

  const statusCounts = getStatusCounts(vehicles)
  return [
    { name: "Available", count: statusCounts.available },
    { name: "On rent", count: statusCounts.on_rent },
    { name: "Maintenance", count: statusCounts.maintenance },
  ]
}

export const getSortedUnique = (values: string[]): string[] =>
  [...new Set(values)].sort((a, b) => a.localeCompare(b))
