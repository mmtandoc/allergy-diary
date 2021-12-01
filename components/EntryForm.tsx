import axios from "axios"
import AllergyRater from "components/AllergyRater"
import { useUser } from "contexts/UserContext"
import { SearchFuzzyResponse } from "interfaces/azureMaps/search/SearchFuzzyResponse"
import { DateTime } from "luxon"
import React, { ChangeEvent, useState } from "react"
import { EntryWithMunicipality } from "types/types"

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

  const [locationSearchText, setLocationSearchText] = useState(
    entryData.municipality?.freeformAddress,
  )

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
        <div>
          <input
            name="location"
            type="text"
            width="50"
            value={locationSearchText}
            onChange={(e) => setLocationSearchText(e.target.value)}
            readOnly={!isEditing}
          />
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
        textarea:read-only {
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
