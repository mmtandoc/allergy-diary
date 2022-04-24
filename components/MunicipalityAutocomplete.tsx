import React, { useState } from "react"
import { MunicipalityWithParents } from "types/types"
import AutocompleteInput from "./AutocompleteInput"

type Props = {
  municipality: MunicipalityWithParents
  onMunicipalityChange: (item: MunicipalityWithParents) => void
  readOnly?: boolean
}

const MunicipalityAutocomplete = (props: Props) => {
  const municipality = props.municipality

  const [municipalitySearchQuery, setMunicipalitySearchQuery] = useState(
    `${municipality?.name}, ${municipality?.subdivision?.abbreviation}, ${municipality?.country.name}`,
  )

  const handleMunicipalityQueryChange = (query: string) => {
    setMunicipalitySearchQuery(query)
  }

  const renderMunicipalitySuggestion = (item: MunicipalityWithParents) => (
    <div>
      {[item.name, item.subdivision?.abbreviation, item.country.name].join(
        ", ",
      )}
    </div>
  )

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

  return (
    <AutocompleteInput
      name="municipality"
      id="municipality-autocomplete"
      width="50"
      defaultItem={municipality ?? undefined}
      items={getMunicipalities(municipalitySearchQuery)}
      getItemValue={getMunicipalityValue}
      renderSuggestion={renderMunicipalitySuggestion}
      onChange={props.onMunicipalityChange}
      onQueryChange={handleMunicipalityQueryChange}
      readOnly={props.readOnly}
    />
  )
}

MunicipalityAutocomplete.defaultProps = {
  readOnly: false,
}

export default MunicipalityAutocomplete
