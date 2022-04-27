import React, { useState } from "react"
import { DateTime } from "luxon"

type Props = {
  selectedDay: DateTime
  onSelectedDayChange: (day: DateTime) => void
  currentMonth: DateTime
  onCurrentMonthChange: (day: DateTime) => void
}

const CalendarHeader = (props: Props) => {
  const handleTodayClick = () => {
    const today = DateTime.now()
    props.onSelectedDayChange(today)
    props.onCurrentMonthChange(today)
  }

  return (
    <div className="calendar-header">
      <div className="calendar-month-control">
        <button
          onClick={() =>
            props.onCurrentMonthChange(props.currentMonth.minus({ months: 1 }))
          }
        >
          &lt;
        </button>
        <button
          onClick={() =>
            props.onCurrentMonthChange(props.currentMonth.plus({ months: 1 }))
          }
        >
          &gt;
        </button>
      </div>
      <div className="month-label">
        {props.currentMonth.monthLong} {props.currentMonth.year}
      </div>
      <button className="today-button" onClick={handleTodayClick}>
        Today
      </button>
      <style jsx>{`
        .calendar-header {
          display: flex;
          align-items: center;
        }

        .calendar-header .month-label {
          font-weight: bold;
          font-size: 3rem;
          padding: 0.5rem;
        }

        .calendar-header .today-button {
          margin-left: auto;
          margin-right: 2rem;
        }
      `}</style>
    </div>
  )
}

export default CalendarHeader
