import React, { ReactElement, useEffect, useState } from "react"
import { DateTime } from "luxon"
import Month from "./Month"
import CalendarHeader from "./CalendarHeader"

type Props = {
  selectedDay: DateTime
  currentMonth?: DateTime
  onDateChange?: (date: DateTime) => void
  style?: React.CSSProperties
  renderDayContent?: (date: DateTime) => ReactElement | void
}

const Calendar = (props: Props) => {
  const { onDateChange } = props

  const [selectedDay, setSelectedDay] = useState(props.selectedDay)
  const [currentMonth, setCurrentMonth] = useState(
    props.currentMonth ?? selectedDay.startOf("month"),
  )

  useEffect(() => {
    onDateChange?.(selectedDay)
  }, [selectedDay, onDateChange])

  return (
    <div className="calendar" style={props.style}>
      <CalendarHeader
        selectedDay={selectedDay}
        setSelectedDay={setSelectedDay}
        currentMonth={currentMonth}
        setCurrentMonth={setCurrentMonth}
      />
      <Month
        selectedDay={selectedDay}
        setSelectedDay={setSelectedDay}
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
