import type { FuelType, Vehicle, VehicleStatus } from "../types/vehicle"

const EXPECTED_HEADER =
  "vehicle_id,make,model,year,fuel_type,mileage,branch,status,daily_rate,last_service_date"

const isVehicleStatus = (value: string): value is VehicleStatus =>
  value === "available" || value === "on_rent" || value === "maintenance"

const isFuelType = (value: string): value is FuelType =>
  value === "diesel" ||
  value === "petrol" ||
  value === "hybrid" ||
  value === "electric"

const parseRow = (line: string, rowIndex: number): Vehicle | null => {
  const parts = line.split(",")
  if (parts.length !== 10) {
    console.warn(`Skipping row ${rowIndex}: expected 10 columns`)
    return null
  }

  const [
    vehicle_id,
    make,
    model,
    yearRaw,
    fuelRaw,
    mileageRaw,
    branch,
    statusRaw,
    dailyRateRaw,
    last_service_date,
  ] = parts

  const year = Number.parseInt(yearRaw, 10)
  const mileage = Number.parseInt(mileageRaw, 10)
  const daily_rate = Number.parseFloat(dailyRateRaw)
  const status = statusRaw.trim().toLowerCase()
  const fuel_type = fuelRaw.trim().toLowerCase()

  if (
    !vehicle_id ||
    Number.isNaN(year) ||
    Number.isNaN(mileage) ||
    Number.isNaN(daily_rate) ||
    !isVehicleStatus(status) ||
    !isFuelType(fuel_type)
  ) {
    console.warn(`Skipping row ${rowIndex}: invalid values`)
    return null
  }

  return {
    vehicle_id: vehicle_id.trim(),
    make: make.trim(),
    model: model.trim(),
    year,
    fuel_type,
    mileage,
    branch: branch.trim(),
    status,
    daily_rate,
    last_service_date: last_service_date.trim(),
  }
}

export const parseFleetCsv = (text: string): Vehicle[] => {
  const lines = text
    .trim()
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length === 0) {
    return []
  }

  const header = lines[0]
  if (header !== EXPECTED_HEADER) {
    console.warn("CSV header does not match expected fleet schema")
  }

  const vehicles: Vehicle[] = []
  for (let i = 1; i < lines.length; i++) {
    const vehicle = parseRow(lines[i], i + 1)
    if (vehicle) {
      vehicles.push(vehicle)
    }
  }

  return vehicles
}
