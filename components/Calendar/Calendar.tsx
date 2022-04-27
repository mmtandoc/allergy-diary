import React, { ReactElement, useEffect, useState } from "react"
import { DateTime } from "luxon"
import Month from "./Month"
import CalendarHeader from "./CalendarHeader"

type Props = {
  selectedDay: DateTime
  currentMonth?: DateTime
  onSelectedDayChange: (day: DateTime) => void
  style?: React.CSSProperties
  renderDayContent?: (date: DateTime) => ReactElement | void
}

const Calendar = (props: Props) => {
  //const { onDateChange } = props

  const { selectedDay, onSelectedDayChange } = props
  const [currentMonth, setCurrentMonth] = useState(
    props.currentMonth ?? selectedDay.startOf("month"),
  )

  const handleSelectedDayChange = (day: DateTime) => {
    onSelectedDayChange(day)
    setCurrentMonth(day)
  }

  const handleMonthChange = (month: DateTime) => {
    setCurrentMonth(month)
  }

  /*useEffect(() => {
    onDateChange?.(selectedDay)
  }, [selectedDay, onDateChange])*/

  return (
    <div className="calendar" style={props.style}>
      <CalendarHeader
        selectedDay={selectedDay}
        onSelectedDayChange={handleSelectedDayChange}
        currentMonth={currentMonth}
        onCurrentMonthChange={handleMonthChange}
      />
      <Month
        selectedDay={selectedDay}
        onSelectedDayChange={handleSelectedDayChange}
        currentMonth={currentMonth}
        renderDayContent={props.renderDayContent}
      />
      <style jsx>{`
        .calendar {
          display: flex;
          flex-direction: column;
        }
      `}</style>
    </div>
  )
}

Calendar.defaultProps = {
  selectedDay: DateTime.now(),
}

export default Calendar
