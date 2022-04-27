import React, { ReactElement, useState } from "react"
import { DateTime, Interval } from "luxon"
import Day from "./Day"

type Props = {
  selectedDay: DateTime
  onSelectedDayChange: (day: DateTime) => void
  currentMonth: DateTime
  renderDayContent?: (date: DateTime) => ReactElement | void
}

const Month = (props: Props) => {
  const dayLabels = []

  const weekDate = props.selectedDay.set({ weekday: 1 })
  for (let i = 0; i < 7; i++) {
    dayLabels.push(
      <div key={i} className="calendar-day-label">
        {weekDate.plus({ days: i }).weekdayShort}
      </div>,
    )
  }

  const weeks: ReactElement[] = []

  //const startDate = props.date.startOf("month").startOf("week")
  const startDate = props.currentMonth.startOf("month").startOf("week")
  //const endDate = props.currentMonth.endOf("month").endOf("week")
  const endDate = startDate.plus({ weeks: 6 })

  startDate
    .until(endDate)
    .splitBy({ weeks: 1 })
    .map((weekValue: Interval, weekIndex: number) => {
      const days: ReactElement[] = []
      const weekStart = weekValue.start
      weekStart
        .until(weekStart.endOf("week"))
        .splitBy({ days: 1 })
        .map((dayValue: Interval, dayIndex: number) => {
          const cellDate = dayValue.start

          days.push(
            <Day
              date={cellDate}
              selectedDay={props.selectedDay}
              onSelectedDayChange={props.onSelectedDayChange}
              key={dayIndex}
              currentMonth={cellDate.hasSame(props.currentMonth, "month")}
              renderDayContent={props.renderDayContent}
            />,
          )
        })
      weeks.push(
        <div className="calendar-week" role="row" key={weekIndex}>
          {days}
        </div>,
      )
    })

  return (
    <div className="calendar-month" role="grid">
      <div className="calendar-day-labels" role="row">
        {dayLabels}
      </div>

      {weeks}
      <style jsx>{`
        .calendar-month {
          flex-grow: 1;
        }
        .calendar-month {
          align-items: left;
          display: flex;
          flex-direction: column;
          flex: 1 1 0%;
        }

        .calendar-month > :global(.calendar-week),
        .calendar-day-labels {
          display: flex;
          flex-direction: row;
          flex: 1 0;
        }

        .calendar-day-labels {
          flex-basis: 0;
          flex-grow: 0;
        }

        :global(.calendar-day),
        :global(.calendar-day-label) {
          width: 100%;
        }
      `}</style>
      <style jsx>{`
        .calendar-month > .calendar-day-labels {
          flex-basis: 5%;
        }
        .calendar-month > :global(.calendar-week) {
          flex-basis: ${(100 - 5) / weeks.length}%;
        }
      `}</style>
    </div>
  )
}

Month.defaultProps = { onChange: () => null }

export default Month
