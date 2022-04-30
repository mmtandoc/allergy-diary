import axios from "axios"
import AllergyRater from "components/AllergyRater"
import { useUser } from "contexts/UserContext"
import { SearchFuzzyResponse } from "types/azureMaps/search/SearchFuzzyResponse"
import { DateTime } from "luxon"
import React, { ChangeEvent, useState } from "react"
import { EntryWithMunicipality, MunicipalityWithParents } from "types/types"
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

  const municipalitySearch = async (query: string) => {
    if (!query) {
      return
    }

    const typeahead = false

    const response = await axios.get<SearchFuzzyResponse>(
      `https://atlas.microsoft.com/search/fuzzy/json?subscription-key=qjFcJQnRe5T3_7UOMUUUbk1AAoZws3qxNM0amzfr6sw&api-version=1.0&query=${query}&typeahead=${typeahead}&limit=10&idxSet=Geo`,
    )

    const municipalities = response.data.results.filter(
      (i) => i?.entityType === "Municipality",
    )
    console.log(municipalities)
  }

  const handleMunicipalityChange = (item: MunicipalityWithParents) => {
    setMunicipality(item)
    mutateEntrySet("municipalityId", item.id)
    mutateEntrySet("municipality", item)
  }

  return (
    <div className="entry-container">
      <div className="form-input-group" style={{ flexDirection: "row" }}>
        <label htmlFor="is-editing-checkbox">IS EDITING</label>
        <input
          id="is-editing-checkbox"
          name="isEditing"
          checked={isEditing}
          onChange={(e) => isEditing && setIsEditing(e.target.checked)}
          type="checkbox"
        />
      </div>
      <input name="date" type="hidden" value={props.date.toFormat("y-MM-dd")} />

      <div className="form-input-group">
        <label htmlFor="municipality-autocomplete">Location</label>
        <MunicipalityAutocomplete
          municipality={municipality}
          onMunicipalityChange={handleMunicipalityChange}
          readOnly={!isEditing}
        />
      </div>
      <div className="form-input-group">
        <label htmlFor="allergy-rater">Allergy Severity</label>
        <AllergyRater
          id="allergy-rater"
          value={entryData?.rating}
          disabled={!isEditing}
          onChange={(val) => mutateEntrySet("rating", val)}
        />
      </div>
      <div className="form-input-group">
        <label htmlFor="notes-textarea">Notes</label>
        <textarea
          id="notes-textarea"
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
