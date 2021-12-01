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

  return (
    <span className="pollen-measure">
      {props.pollenData?.type?.[0] ?? ""}
      <style jsx>{`
        .pollen-measure {
          text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
          font-weight: bolder;
          color: ${calculateSeverityColor(props?.pollenData?.categoryValue ?? 0, 6)};
        }
      `}</style>
    </span>
  )
}

const MiniPollenConditions = (props: Props) => {
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
          display: flex;
          flex-direction: row;
        }
      `}</style>
    </div>
  )
}

export default React.memo(MiniPollenConditions)
