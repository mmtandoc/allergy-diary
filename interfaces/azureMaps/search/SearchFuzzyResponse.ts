export interface SearchFuzzyResponse {
  summary: Summary
  results: SearchFuzzyResults[]
}

export interface SearchFuzzyResults {
  type: string
  id: string
  score: number
  dist: number
  entityType?: string
  address: SearchResultAddress
  position: CoordinateAbbreviated
  viewport: SearchResultViewport
  boundingBox?: SearchResultViewport
  dataSources?: DataSources
  info?: string
  poi?: Poi
  entryPoints?: EntryPoint[]
  addressRanges?: AddressRanges
}

export interface SearchResultAddress {
  municipalitySubdivision?: string
  countrySecondarySubdivision?: string
  countrySubdivision: string
  countrySubdivisionName: string
  countryCode: string
  country: string
  countryCodeISO3: string
  freeformAddress: string
  municipality?: string
  postalCode?: string
  postalName?: string
  streetNumber?: string
  streetName?: string
  extendedPostalCode?: string
  localName?: string
}

export interface AddressRanges {
  rangeLeft?: string
  from: CoordinateAbbreviated
  to: CoordinateAbbreviated
  rangeRight?: string
}

export interface CoordinateAbbreviated {
  lat: number
  lon: number
}

export interface SearchResultViewport {
  topLeftPoint: CoordinateAbbreviated
  btmRightPoint: CoordinateAbbreviated
}

export interface DataSources {
  geometry?: DataSourcesGeometry
  poiDetails?: PoiDetail[]
}

export interface DataSourcesGeometry {
  id: string
}

export interface PoiDetail {
  id: string
  sourceName: string
}

export interface EntryPoint {
  type: string
  position: CoordinateAbbreviated
}

export interface Poi {
  name: string
  phone: string
  categorySet: PoiCategorySet[]
  url?: string
  categories: string[]
  classifications: PoiClassification[]
}

export interface PoiCategorySet {
  id: number
}

export interface PoiClassification {
  code: string
  names: Name[]
}

export interface Name {
  nameLocale: string
  name: string
}

export interface Summary {
  query: string
  queryType: string
  queryTime: number
  numResults: number
  offset: number
  totalResults: number
  fuzzyLevel: number
  geoBias: CoordinateAbbreviated
}
