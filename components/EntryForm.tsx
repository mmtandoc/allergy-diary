import axios from "axios"
import AllergyRater from "components/AllergyRater"
import { useUser } from "contexts/UserContext"
import { SearchFuzzyResponse } from "types/azureMaps/search/SearchFuzzyResponse"
import { DateTime } from "luxon"
import React, { ChangeEvent, useState } from "react"
import { EntryWithMunicipality } from "types/types"
import MunicipalityAutocomplete from "./MunicipalityAutocomplete"

type Props = {
  date: DateTime
  alreadyExists: boolean
  entryData?: EntryWithMunicipality
  onSave?: (entryData: EntryWithMunicipality) => void
}

const EntryForm = (props: Props) => {
  const { user } = useUser()

  const [isEditing, setIsEditing] = useState(props.entryData == undefined)

  const defaultEntryData: EntryWithMunicipality = {
    date: props.date.toJSDate(),
    userId: user.id,
    rating: 0,
    notes: null,
    municipalityId: user.mainMunicipalityId,
    municipality: user.mainMunicipality,
  }

  const [entryData, setEntryData] = useState(
    props.entryData ?? defaultEntryData,
  )

  const [municipalitySearchQuery, setMunicipalitySearchQuery] = useState(
    `${entryData.municipality?.name}, ${entryData.municipality?.subdivision?.abbreviation}, ${entryData.municipality?.country.name}`,
  )

  const [municipality, setMunicipality] = useState(entryData.municipality)

  const mutateEntrySet = (name: string, value: unknown) => {
    if (!isEditing) return
    setEntryData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    mutateEntrySet(name, value)
  }

  const onSaveEditClick = () => {
    if (
      JSON.stringify(entryData) !== JSON.stringify(props.entryData) &&
      isEditing
    ) {
      props.onSave?.(entryData)
    }
    setIsEditing(!isEditing)
  }

  const onSearchClick = async () => {
    if (!municipalitySearchQuery) {
      return
    }

    const typeahead = false

    const response = await axios.get<SearchFuzzyResponse>(
      `https://atlas.microsoft.com/search/fuzzy/json?subscription-key=Fg6JeHgHsf2jtBliDtBgcyCqc8etrmx2XtVgfXTojZI&api-version=1.0&query=${municipalitySearchQuery}&typeahead=${typeahead}&limit=10&idxSet=Geo`,
    )

    const municipalities = response.data.results.filter(
      (i) => i?.entityType === "Municipality",
    )
    console.log(municipalities)
  }

  return (
    <div className="entry-container">
      <div className="form-input-group" style={{ flexDirection: "row" }}>
        <label>IS EDITING</label>
        <input
          name="isEditing"
          checked={isEditing}
          onChange={(e) => isEditing && setIsEditing(e.target.checked)}
          type="checkbox"
        />
      </div>
      <input name="date" type="hidden" value={props.date.toFormat("y-MM-dd")} />
      <div className="form-input-group">
        <label>Location</label>
        <div style={{ display: "flex", flexDirection: "row" }}>
          {/* <input
            name="location"
            type="text"
            width="50"
            value={locationSearchText}
            onChange={(e) => setLocationSearchText(e.target.value)}
            readOnly={!isEditing}
          /> */}
          <MunicipalityAutocomplete
            width="50"
            municipality={municipality ?? undefined}
            onChange={(e) => setMunicipalitySearchQuery(e.target.value)}
            readOnly={!isEditing}
          />
          <button onClick={onSearchClick} disabled={!isEditing}>
            Search
          </button>
        </div>
      </div>
      <div className="form-input-group">
        <label>Allergy Severity</label>
        <AllergyRater
          value={entryData?.rating}
          disabled={!isEditing}
          onChange={(val) => mutateEntrySet("rating", val)}
        />
      </div>
      <div className="form-input-group">
        <label>Notes</label>
        <textarea
          name="notes"
          placeholder="Add any notes here."
          value={entryData?.notes ?? ""}
          readOnly={!isEditing}
          onChange={handleChange}
        ></textarea>
      </div>
      <input
        className="save-edit-button"
        type="button"
        value={isEditing ? "Save" : "Edit"}
        onClick={onSaveEditClick}
      />
      <style jsx>{`
        .entry-container {
          display: flex;
          flex-direction: column;
          row-gap: 1.6rem;
        }
        .form-input-group {
          display: flex;
          flex-direction: column;
        }
        input[type="button"] {
          align-self: center;
        }
        textarea {
          resize: block;
        }

        input[type="text"]:read-only,
        textarea:read-only,
        :global(.location-autocomplete input[type="text"]:read-only) {
          border-color: transparent;
          box-shadow: none;
          background-color: white;
          outline: none;
          resize: none;
        }
      `}</style>
    </div>
  )
}

EntryForm.defaultProps = {
  alreadyExists: false,
}

export default EntryForm
