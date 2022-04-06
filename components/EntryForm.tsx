import axios from "axios"
import AllergyRater from "components/AllergyRater"
import { useUser } from "contexts/UserContext"
import { SearchFuzzyResponse } from "types/azureMaps/search/SearchFuzzyResponse"
import { DateTime } from "luxon"
import React, { ChangeEvent, useState } from "react"
import { EntryWithMunicipality, MunicipalityWithParents } from "types/types"
import AutocompleteInput from "components/AutocompleteInput"

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

  const [municipalityInputVisible, setMunicipalityInputVisible] =
    useState(false)

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

  const handleLocationEditClick = () => {
    setMunicipalityInputVisible(!municipalityInputVisible)
  }

  const getMunicipalityValue = (item: MunicipalityWithParents): string =>
    [item.name, item.subdivision?.abbreviation, item.country.name].join(", ")

  /*
  TODO: Implement getting municipalities from database
  https://stackoverflow.com/questions/56796489/how-can-i-match-up-user-inputs-to-ambiguous-city-names
  */
  const getMunicipalities = (query: string): MunicipalityWithParents[] => {
    const allMunicipalities: MunicipalityWithParents[] = JSON.parse(
      '[{"id":1,"name":"Midland","localName":null,"subdivisionId":1,"countryCode":"US","freeformAddress":"Midland, TX","latitude":31.99743,"longitude":-102.07804,"subdivision":{"id":1,"name":"Texas","abbreviation":"TX","countryCode":"US","parentSubdivisionId":null},"country":{"code":"US","name":"United States","codeISO3":"USA"}},{"id":2,"name":"Milton","localName":null,"subdivisionId":2,"countryCode":"CA","freeformAddress":"Milton ON","latitude":43.51349,"longitude":-79.8828,"subdivision":{"id":2,"name":"Ontario","abbreviation":"ON","countryCode":"CA","parentSubdivisionId":null},"country":{"code":"CA","name":"Canada","codeISO3":"CAN"}},{"id":3,"name":"Austin","localName":null,"subdivisionId":1,"countryCode":"US","freeformAddress":"Austin, TX","latitude":30.26498,"longitude":-97.7466,"subdivision":{"id":1,"name":"Texas","abbreviation":"TX","countryCode":"US","parentSubdivisionId":null},"country":{"code":"US","name":"United States","codeISO3":"USA"}}]',
    )

    const matches = allMunicipalities.filter((m) => {
      return getMunicipalityValue(m).includes(query)
    })

    return matches
  }

  const renderMunicipalitySuggestion = (item: MunicipalityWithParents) => (
    <div>
      {[item.name, item.subdivision?.abbreviation, item.country.name].join(
        ", ",
      )}
    </div>
  )

  const handleMunicipalityChange = (item: MunicipalityWithParents) => {
    setMunicipality(item)
  }

  const handleMunicipalityQueryChange = (query: string) => {
    setMunicipalitySearchQuery(query)
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
        <div style={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
          <span>
            {municipality === null ? "N/A" : getMunicipalityValue(municipality)}
          </span>
          <button onClick={handleLocationEditClick} disabled={!isEditing}>
            Edit
          </button>
        </div>
        {municipalityInputVisible && (
          <AutocompleteInput
            name="municipality"
            id="municipality-autocomplete"
            width="50"
            defaultItem={municipality ?? undefined}
            items={getMunicipalities(municipalitySearchQuery)}
            getItemValue={getMunicipalityValue}
            renderSuggestion={renderMunicipalitySuggestion}
            onChange={handleMunicipalityChange}
            onQueryChange={handleMunicipalityQueryChange}
            readOnly={!isEditing}
          />
        )}
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
