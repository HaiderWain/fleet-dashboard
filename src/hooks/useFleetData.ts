import { useEffect, useState } from "react"
import { parseFleetCsv } from "../lib/parseFleetCsv"
import type { Vehicle } from "../types/vehicle"

const CSV_URL = "/fleet_sample_data.csv"

type FleetLoadState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; vehicles: Vehicle[] }

export const useFleetData = () => {
  const [state, setState] = useState<FleetLoadState>({ status: "idle" })

  useEffect(() => {
    const controller = new AbortController()

    const load = async () => {
      setState({ status: "loading" })
      try {
        const response = await fetch(CSV_URL, { signal: controller.signal })
        if (!response.ok) {
          setState({
            status: "error",
            message: `Could not load fleet data (${response.status})`,
          })
          return
        }
        const text = await response.text()
        const vehicles = parseFleetCsv(text)
        setState({ status: "ready", vehicles })
      } catch (error) {
        if (controller.signal.aborted) {
          return
        }
        const message =
          error instanceof Error ? error.message : "Failed to load fleet data"
        setState({ status: "error", message })
      }
    }

    void load()

    return () => controller.abort()
  }, [])

  return state
}
