import React, { useState } from "react"
import { DateTime } from "luxon"

type Props = {
  selectedDay: DateTime
  setSelectedDay: React.Dispatch<React.SetStateAction<DateTime>>
  currentMonth: DateTime
  setCurrentMonth: React.Dispatch<React.SetStateAction<DateTime>>
}

const CalendarHeader = (props: Props) => {
  const onTodayClick = () => {
    const today = DateTime.now()
    props.setSelectedDay(today)
    props.setCurrentMonth(today)
  }

  return (
    <div className="calendar-header">
      <div className="calendar-month-control">
        <button
          onClick={() =>
            props.setCurrentMonth(props.currentMonth.minus({ months: 1 }))
          }
        >
          &lt;
        </button>
        <button
          onClick={() =>
            props.setCurrentMonth(props.currentMonth.plus({ months: 1 }))
          }
        >
          &gt;
        </button>
      </div>
      <div className="month-label">
        {props.currentMonth.monthLong} {props.currentMonth.year}
      </div>
      <button className="today-button" onClick={onTodayClick}>
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
