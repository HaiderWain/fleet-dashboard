export type VehicleStatus = "available" | "on_rent" | "maintenance"

export type FuelType = "diesel" | "petrol" | "hybrid" | "electric"

export type Vehicle = {
  vehicle_id: string
  make: string
  model: string
  year: number
  fuel_type: FuelType
  mileage: number
  branch: string
  status: VehicleStatus
  daily_rate: number
  last_service_date: string
}

export type FleetFiltersState = {
  branch: string
  status: VehicleStatus | "all"
  fuelType: FuelType | "all"
}

export type ChartDimension = "status" | "branch"

export type ChartDatum = {
  name: string
  count: number
}
