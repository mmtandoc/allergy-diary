import React, { ReactElement, useState } from "react"
import { DateTime, Interval } from "luxon"
import Day from "./Day"

type Props = {
  selectedDay: DateTime
  setSelectedDay: React.Dispatch<React.SetStateAction<DateTime>>
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
  const days: ReactElement[] = []

  //const startDate = props.date.startOf("month").startOf("week")
  const startDate = props.currentMonth.startOf("month").startOf("week")
  //const endDate = props.currentMonth.endOf("month").endOf("week")
  const endDate = startDate.plus({ weeks: 6 })

  startDate
    .until(endDate)
    .splitBy({ days: 1 })
    .map((value: Interval, index: number) => {
      const cellDate = value.start

      days.push(
        <Day
          date={cellDate}
          selectedDay={props.selectedDay}
          setSelectedDay={props.setSelectedDay}
          key={index}
          currentMonth={cellDate.hasSame(props.currentMonth, "month")}
          renderDayContent={props.renderDayContent}
        />,
      )
    })

  return (
    <div className="calendar-month">
      {dayLabels}
      {days}
      <style jsx>{`
        .calendar-month {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          grid-template-rows: auto repeat(6, 1fr);
          flex-grow: 1;
        }
        .calendar-month > * {
          align-items: left;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
      `}</style>
    </div>
  )
}

Month.defaultProps = { onChange: () => null }

export default Month
