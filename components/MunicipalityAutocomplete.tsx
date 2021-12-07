import React, { ChangeEventHandler } from "react"
import { MunicipalityWithParents } from "types/types"

type Props = {
  municipality?: MunicipalityWithParents
  onChange: ChangeEventHandler<HTMLInputElement>
  width?: string | number
  readOnly: boolean
}

const getSuggestions = () => {
  const suggestions = []

  for (let i = 0; i < 4; i++) {
    suggestions.push(<li key={i}>Suggestion {i + 1}</li>)
  }
  return suggestions
}

const MunicipalityAutocomplete = (props: Props) => {
  const suggestionsVisible = true

  let suggestions = []

  if (suggestionsVisible) {
    suggestions = getSuggestions()
  }

  return (
    <div className="municipality-autocomplete">
      <div style={{ display: "flex", flex: "100%" }}>
        <input
          name="municipality"
          type="text"
          maxLength={500}
          value={`${props.municipality?.name}, ${props.municipality?.subdivision?.abbreviation}, ${props.municipality?.country.name}`}
          onChange={props.onChange}
          readOnly={props.readOnly}
        />
      </div>
      {suggestions.length !== 0 && (
        <ul className="suggestions-list">
          <li>Suggestion 1</li>
          <li>Suggestion 2</li>
          <li>Suggestion 3</li>
          <li>Suggestion 4</li>
        </ul>
      )}
      <style jsx>{`
        .municipality-autocomplete {
          position: relative;
        }
        input {
          display: flex;
          flex: 100%;
          width: auto;
        }
        .suggestions-list {
          position: absolute;
          background-color: white;
          width: 100%;
          z-index: 1;
          margin: -1px 0 0 0;
          list-style-type: none;
          padding-left: 0;
          border: black solid 1px;
        }

        .suggestions-list > li {
          padding-left: 1rem;
          cursor: default;
        }

        .suggestions-list > li:hover {
          background-color: lightgray;
        }
      `}</style>
    </div>
  )
}

MunicipalityAutocomplete.defaultProps = {
  readOnly: false,
  width: 50,
  onChange: () => undefined,
}

export default MunicipalityAutocomplete
