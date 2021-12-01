import Slider from "rc-slider"
import "rc-slider/assets/index.css"
import React, { useEffect, useState } from "react"

type Props = {
  value: number
  onChange?: (value: number) => void
  disabled?: boolean
}

const AllergyRater = (props: Props) => {
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
    <div className="allergy-rater">
      <Slider
        className="allergy-slider"
        value={props.value}
        onChange={props.onChange}
        disabled={props.disabled}
        max={10}
        trackStyle={{
          backgroundColor: calculateSeverityColor(props.value, 10),
          border: "0.1rem solid #999",
          height: "1rem",
        }}
        railStyle={{
          border: "0.1rem solid #999",
          height: "1rem",
        }}
        handleStyle={{
          border: "0.1rem solid #999",
          cursor: "default",
          height: "2rem",
          width: "2rem",
        }}
      />
      <span>{props.value}</span>
      <input type="hidden" name="allergy_severity" value={props.value} />
      <style jsx>{`
        .allergy-rater {
          display: flex;
          flex-direction: row;
          align-items: center;
        }
        .allergy-rater :global(.allergy-slider) {
          width: 90%;
          margin: 0 0.75rem;
          height: 2rem;
        }
        .allergy-rater :global(.rc-slider-rail),
        .allergy-rater :global(.rc-slider-track) {
          height: 1rem;
          border: 0.1rem solid #999;
        }
        .allergy-rater :global(.rc-slider-handle) {
          border: 0.1rem solid #999;
          cursor: default;
          height: 2rem;
          width: 2rem;
        }

        .allergy-rater :global(.rc-slider-disabled) {
          background-color: transparent !important;
        }

        .allergy-rater
          :global(:not(.rc-slider-disabled) .rc-slider-handle:hover) {
          background-color: #ccc;
        }

        .allergy-rater :global(.rc-slider-disabled .rc-slider-handle) {
          height: 0 !important;
          width: 0 !important;
        }
      `}</style>
      <style jsx>{`
        input {
          accent-color: ${calculateSeverityColor(props.value, 10)};
        }
        .allergy-rater :global(.rc-slider-track) {
          background-color: ${calculateSeverityColor(props.value, 10)};
        }
      `}</style>
    </div>
  )
}

AllergyRater.defaultProps = {
  value: 2,
  disabled: false,
}

export default AllergyRater
