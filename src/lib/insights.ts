import type { Vehicle } from "../types/vehicle"
import { getStatusCounts } from "./aggregates"

export type FleetInsightLine = {
  id: string
  text: string
}

const getMaintenanceLeader = (
  vehicles: Vehicle[],
): { branch: string; count: number } | null => {
  const map = new Map<string, number>()
  for (const vehicle of vehicles) {
    if (vehicle.status !== "maintenance") {
      continue
    }
    map.set(vehicle.branch, (map.get(vehicle.branch) ?? 0) + 1)
  }
  let best: { branch: string; count: number } | null = null
  for (const [branch, count] of map) {
    if (!best || count > best.count) {
      best = { branch, count }
    }
  }
  return best
}

const getHighestAverageMileageBranch = (
  vehicles: Vehicle[],
): { branch: string; average: number } | null => {
  const map = new Map<string, { sum: number; n: number }>()
  for (const vehicle of vehicles) {
    const current = map.get(vehicle.branch) ?? { sum: 0, n: 0 }
    current.sum += vehicle.mileage
    current.n += 1
    map.set(vehicle.branch, current)
  }
  let best: { branch: string; average: number } | null = null
  for (const [branch, { sum, n }] of map) {
    if (n === 0) {
      continue
    }
    const average = sum / n
    if (!best || average > best.average) {
      best = { branch, average }
    }
  }
  return best
}

export const getFleetInsightLines = (vehicles: Vehicle[]): FleetInsightLine[] => {
  if (vehicles.length === 0) {
    return [
      {
        id: "empty",
        text: "No vehicles match the current filters. Adjust filters to see insights for a subset of the fleet.",
      },
    ]
  }

  const total = vehicles.length
  const statusCounts = getStatusCounts(vehicles)
  const onRentPct = Math.round((statusCounts.on_rent / total) * 100)
  const availablePct = Math.round((statusCounts.available / total) * 100)

  const lines: FleetInsightLine[] = [
    {
      id: "utilization",
      text: `About ${onRentPct}% of vehicles in this view are on rent, which is a simple utilization signal for how busy the fleet is right now.`,
    },
    {
      id: "availability",
      text: `${statusCounts.available} vehicle${statusCounts.available === 1 ? " is" : "s are"} available (${availablePct}% of this view) — the pool you can rent out without waiting for returns or workshop work.`,
    },
  ]

  const maintenanceLeader = getMaintenanceLeader(vehicles)
  if (maintenanceLeader) {
    lines.push({
      id: "maintenance-branch",
      text: `The branch with the most vehicles in maintenance in this view is ${maintenanceLeader.branch} (${maintenanceLeader.count} vehicle${maintenanceLeader.count === 1 ? "" : "s"}).`,
    })
  } else {
    lines.push({
      id: "maintenance-none",
      text: "No vehicles in this view are in maintenance.",
    })
  }

  const mileageLeader = getHighestAverageMileageBranch(vehicles)
  if (mileageLeader) {
    const rounded = Math.round(mileageLeader.average)
    lines.push({
      id: "mileage-branch",
      text: `Highest average mileage in this view is ${mileageLeader.branch} (about ${rounded.toLocaleString()} miles per vehicle).`,
    })
  }

  return lines
}
