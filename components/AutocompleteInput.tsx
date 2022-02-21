import React, { ChangeEventHandler, useState, useEffect } from "react"

type Props<T> = {
  name: string
  defaultItem?: T
  getItemValue: (item: T) => string
  renderSuggestion: (item: T) => JSX.Element
  getSuggestions: (query: string) => T[]
  onChange: (val: T) => void
  width?: string | number
  readOnly: boolean
}

// const getSuggestions = <T,>(
//   items: T[],
//   getItemValue: (item: T) => string,
//   onClick?: (item: T) => void,
//   selectedIndex?: number,
// ) => {
//   /*return items.map((e, i) => (
//     <li key={i} className={i === selectedIndex ? "selected" : undefined}>
//       {getItemValue(e)}
//     </li>
//   ))*/
//   return items.map((e, i) => (
//     <SuggestionItem
//       key={i}
//       index={i}
//       item={e}
//       getItemValue={getItemValue}
//       onClick={onClick}
//       isSelected={i === selectedIndex}
//     />
//   ))
// }

const SuggestionItem = <T,>(props: {
  index: number
  item: T
  getItemValue: (item: T) => string
  renderSuggestion: (item: T) => JSX.Element
  onClick?: (item: T) => void
  isSelected?: boolean
}) => {
  const handleClick = () => {
    props.onClick?.(props.item)
  }
  return (
    <li
      className={props.isSelected ? "selected" : undefined}
      onClick={handleClick}
    >
      {props.renderSuggestion(props.item)}
      {}
    </li>
  )
}

SuggestionItem.defaultProps = {
  onClick: () => undefined,
}

const SuggestionsList = (props: {
  selectedIndex?: number
  suggestions?: JSX.Element[]
}) => {
  return (
    <ul className="suggestions-list">
      {props.suggestions}
      <style jsx>{`
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

        .suggestions-list > :global(li) {
          padding-left: 1rem;
          cursor: default;
        }

        .suggestions-list > :global(li.selected) {
          background-color: lightblue;
        }

        .suggestions-list > :global(li:hover) {
          background-color: lightgray;
        }
      `}</style>
    </ul>
  )
}

const AutocompleteInput = <T,>(props: Props<T>) => {
  const [inputQuery, setInputQuery] = useState(
    props.defaultItem == null
      ? undefined
      : props.getItemValue(props.defaultItem),
  )

  const [selectedIndex, setSelectedIndex] = useState<number | undefined>()

  console.log(`selectedIndex = ${selectedIndex}`)

  const [suggestionsVisible, setSuggestionsVisible] = useState<boolean>(false)

  const handleSuggestionClick = (item: T) => {
    setInputQuery(props.getItemValue(item))
    setSuggestionsVisible(false)
    props.onChange(item)
  }

  const suggestions: T[] =
    suggestionsVisible && inputQuery ? props.getSuggestions(inputQuery) : []

  const suggestionItems = suggestions.map((e, i) => (
    <SuggestionItem
      key={i}
      index={i}
      item={e}
      getItemValue={props.getItemValue}
      onClick={handleSuggestionClick}
      renderSuggestion={props.renderSuggestion}
      isSelected={i === selectedIndex}
    />
  ))

  if (selectedIndex !== undefined) {
    //setInputQuery(props.getItemValue(props.items[selectedIndex]))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log(selectedIndex)
    switch (e.key) {
      case "ArrowUp":
        setSuggestionsVisible(true)
        let prevIndex: number | undefined
        if (selectedIndex === undefined) {
          prevIndex = suggestions.length - 1
        } else if (selectedIndex === 0) {
          prevIndex = undefined
        } else {
          prevIndex = selectedIndex - 1
        }
        setSelectedIndex(prevIndex)
        break
      case "ArrowDown":
        setSuggestionsVisible(true)
        let nextIndex: number | undefined
        if ((selectedIndex ?? -1) < suggestions.length - 1) {
          nextIndex = (selectedIndex ?? -1) + 1
        } else {
          nextIndex = undefined
        }

        console.log(`nextIndex = ${nextIndex}`)
        setSelectedIndex(nextIndex)
        break
      case "Enter":
        if (selectedIndex === undefined) {
        } else {
          setInputQuery(props.getItemValue(suggestions[selectedIndex]))
          setSuggestionsVisible(false)
        }
        break
      default:
        return
    }
    console.log(selectedIndex)
  }

  const handleInputQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedIndex(undefined)
    setSuggestionsVisible(true)
    setInputQuery(e.target.value)
  }

  return (
    <div className="autocomplete">
      <div style={{ display: "flex", flex: "100%" }}>
        <input
          name={props.name}
          type="text"
          maxLength={500}
          value={inputQuery}
          onChange={handleInputQueryChange}
          onKeyDown={handleKeyDown}
          readOnly={props.readOnly}
          onFocus={() => console.log("onFocus")}
          onBlur={() => setSuggestionsVisible(false)}
        />
      </div>
      {suggestions.length !== 0 && (
        <SuggestionsList
          suggestions={suggestionItems}
          selectedIndex={selectedIndex}
        ></SuggestionsList>
      )}
      <style jsx>{`
        .autocomplete {
          position: relative;
        }
        input {
          display: flex;
          flex: 100%;
          width: auto;
        }
      `}</style>
    </div>
  )
}

AutocompleteInput.defaultProps = {
  readOnly: false,
  width: 50,
  onChange: () => undefined,
}

export default AutocompleteInput
