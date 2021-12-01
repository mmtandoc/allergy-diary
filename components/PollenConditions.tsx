import React from "react"
import { PollenLevel } from "@prisma/client"
import { ForecastWithPollen } from "types/types"

type Props = {
  forecast?: ForecastWithPollen
  style?: React.CSSProperties
}

const PollenMeasurement = (props: { pollenName: string; pollenData?: PollenLevel }) => {
  const calculateSeverityColor = (severity: number, maxSeverity: number) => {
    if (severity === 0) {
      return "transparent"
    }
    const x = (severity - 1) / maxSeverity
    const r =
      40 +
      1329.583 * x -
      2859.375 * x ** 2 +
      2395.833 * x ** 3 -
      390.625 * x ** 4 -
      260.4167 * x ** 5
    const g =
      200 +
      129.1667 * x +
      764.5833 * x ** 2 -
      3723.958 * x ** 3 +
      4322.917 * x ** 4 -
      1692.708 * x ** 5
    return `rgba(${Math.round(r)},${Math.round(g)},0,1)`
  }
  const categoryNames = [
    "Unavailable",
    "Low",
    "Moderate",
    "High",
    "Very High",
    "Extreme",
    "Hazardous",
  ]
  return (
    <div className="pollen-measure">
      <label className="pollen-name">{props.pollenName}: </label>
      <span className="pollen-category">
        {categoryNames?.[props.pollenData?.categoryValue ?? 0]}
      </span>
      <span className="pollen-value">{props.pollenData?.value ?? "?"} PPM</span>
      <style jsx>{`
        .pollen-measure > * {
          background-color: inherit;
          white-space: nowrap;
        }

        .pollen-measure label {
          font-weight: bold;
        }

        .pollen-measure .pollen-value {
          text-align: right;
        }
      `}</style>
      <style jsx>{`
        .pollen-measure {
          background-color: ${calculateSeverityColor(
            props?.pollenData?.categoryValue ?? 0,
            6,
          )};
        }
      `}</style>
    </div>
  )
}

const PollenConditions = (props: Props) => {
  const getPollenData = (pollenName: string): PollenLevel | undefined => {
    return (
      props.forecast?.pollenLevels?.find(
        (e) => e.type.toUpperCase() === pollenName.toUpperCase(),
      ) ?? undefined
    )
  }

  return (
    <div className="pollen-conditions">
      <PollenMeasurement pollenName="Grass" pollenData={getPollenData("GRASS")} />
      <PollenMeasurement pollenName="Mold" pollenData={getPollenData("MOLD")} />
      <PollenMeasurement pollenName="Ragweed" pollenData={getPollenData("RAGWEED")} />
      <PollenMeasurement pollenName="Tree" pollenData={getPollenData("TREE")} />
      <style jsx>{`
        .pollen-conditions {
          display: grid;
          grid-template-columns: 1fr 1fr min-content;
        }
        .pollen-conditions :global(.pollen-measure) {
          display: contents;
        }
      `}</style>
    </div>
  )
}

export default PollenConditions
