import axios from "axios"
import Calendar from "components/Calendar"
import EntryForm from "components/EntryForm"
import Layout from "components/Layout"
import MiniPollenConditions from "components/MiniPollenConditions"
import PollenConditions from "components/PollenConditions"
import { useUser } from "contexts/UserContext"
import { DateTime } from "luxon"
import React, { useState } from "react"
import useSwr, { useSWRConfig } from "swr"
import { ForecastWithPollen, EntryWithMunicipality } from "types/types"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleDates = (body: any) => {
  if (body === null || body === undefined || typeof body !== "object")
    return body

  const isIsoDateString = (value: unknown): boolean => {
    return (
      value !== null &&
      typeof value === "string" &&
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d*)?(?:[-+]\d{2}:?\d{2}|Z)?$/.test(
        value,
      )
    )
  }

  for (const key of Object.keys(body)) {
    const value = body[key]
    if (isIsoDateString(value)) {
      body[key] = new Date(value)
    } else if (typeof value === "object") handleDates(value)
  }
}

axios.interceptors.response.use((originalResponse) => {
  handleDates(originalResponse.data)
  return originalResponse
})

const CalendarPage = () => {
  const { user } = useUser()
  const [selectedDay, setSelectedDay] = useState(DateTime.now())
  const [selectedMunicipality, setSelectedMunicipality] = useState(
    user.mainMunicipalityId,
  )
  //const [forecastData, setForecastData] = useState(props.forecastData)
  //const [forecasts, setForecasts] = useState(props.forecasts)

  const { mutate } = useSWRConfig()
  const { data: forecastData, error: forecastError } = useSwr(
    `/api/municipalities/${selectedMunicipality}/pollen`,
  )

  const { data: entriesData, error: entriesError } = useSwr(
    `/api/users/${user.id}/entries`,
  )

  if (forecastError || entriesError) return <div>Failed to load...</div>
  if (!forecastData || !entriesData) return <div>Loading...</div>

  const forecasts: ForecastWithPollen[] = forecastData
  const entries: EntryWithMunicipality[] = entriesData

  const getForecastByDate = (
    date: DateTime,
  ): ForecastWithPollen | undefined => {
    return forecasts.find((f) =>
      date.hasSame(DateTime.fromJSDate(f.date, { zone: "UTC" }), "day"),
    )
  }

  const getEntryByDate = (
    date: DateTime,
  ): EntryWithMunicipality | undefined => {
    return entries.find((e) =>
      date.hasSame(DateTime.fromJSDate(e.date, { zone: "UTC" }), "day"),
    )
  }

  const selectedEntry = getEntryByDate(selectedDay)

  const renderDayContent = (date: DateTime): JSX.Element | undefined => {
    const dateForecast = getForecastByDate(date)
    const dateEntry = getEntryByDate(date)

    if (!dateForecast) return

    return (
      <div>
        {dateForecast && (
          <MiniPollenConditions key={date.toISO()} forecast={dateForecast} />
        )}
        <p>Rating: {dateEntry?.rating ?? "N/A"}</p>
        <style jsx>{`
          :global(.diff-month .pollen-conditions) {
            opacity: 30%;
          }
        `}</style>
      </div>
    )
  }

  const onEntrySave = async (newEntry: EntryWithMunicipality) => {
    mutate(
      `/api/users/${user.id}/entries`,
      async (entries: EntryWithMunicipality[]) => {
        const updatedEntry = await axios.put(
          `/api/users/${user.id}/entries/${selectedDay.toUTC()}`,
          newEntry,
        )

        return [
          ...entries.filter(
            (entry) =>
              !selectedDay.hasSame(
                DateTime.fromJSDate(entry.date, { zone: "UTC" }),
                "day",
              ),
          ),
          updatedEntry,
        ]
      },
    )
  }

  return (
    <Layout>
      <div className="page">
        <h1 style={{ marginTop: "0px" }}>Home Page</h1>
        <div id="content">
          <Calendar
            selectedDay={selectedDay}
            onDateChange={setSelectedDay}
            style={{ flex: "3" }}
            renderDayContent={renderDayContent}
          />
          <div className="conditions-panel">
            <p className="date-label">{selectedDay.toLocaleString()}</p>
            <PollenConditions forecast={getForecastByDate(selectedDay)} />
            <EntryForm
              key={selectedDay.toISO()}
              date={selectedDay}
              alreadyExists={selectedEntry !== undefined}
              entryData={selectedEntry}
              onSave={onEntrySave}
            />
          </div>
          <style jsx>{`
            #content {
              display: flex;
              margin: 1rem;
              flex-direction: column;
              flex: 1;
            }
            .conditions-panel {
              padding: 1em;
              margin-top: 1rem;
              border-top: 1px solid lightgray;
              row-gap: 1.6rem;
            }
            .conditions-panel > .date-label {
              margin-top: 0;
            }
            @media only screen and (min-width: 768px) {
              #content {
                flex-direction: row;
              }
              .conditions-panel {
                padding: 2em;
                margin-left: 1rem;
                border-top: none;
                border-left: 1px solid lightgray;
              }
            }
          `}</style>
        </div>
      </div>
    </Layout>
  )
}

export default CalendarPage
