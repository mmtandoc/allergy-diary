import React, { ReactElement, useState } from "react"
import { DateTime } from "luxon"

type Props = {
  date: DateTime
  selectedDay: DateTime
  setSelectedDay: React.Dispatch<React.SetStateAction<DateTime>>
  hover: boolean
  currentMonth: boolean
  renderDayContent?: (date: DateTime) => ReactElement | void
}

const Day = (props: Props) => {
  //const [hover, setHover] = useState(props.hover)

  let className = "calendar-day"
  if (!props.currentMonth) {
    className += " diff-month"
  }

  if (props.date.hasSame(DateTime.now(), "day")) {
    className += " today"
  }

  if (props.selectedDay.hasSame(props.date, "day")) {
    className += " selected"
  }

  //const toggleHover = () => setHover(!hover)
  //onMouseEnter={toggleHover}
  //onMouseLeave={toggleHover}
  return (
    <div
      className={className}
      style={{ gridColumn: props.date.weekday.toString() }}
      onClick={() => props.setSelectedDay(props.date)}
    >
      <div className="date-label">{props.date.day}</div>
      {props.renderDayContent?.(props.date)}
      <style jsx>{`
        .calendar-day .date-label {
          font-size: 0.8em;
          margin-left: 5%;
        }
        .calendar-day.diff-month {
          color: rgb(179, 179, 179);
        }
        .calendar-day.today {
          background-color: rgb(206, 229, 236) !important;
        }
        .calendar-day.selected {
          background-color: lightblue !important;
        }
        .calendar-day:hover {
          background-color: #eaeaea;
        }
      `}</style>
    </div>
  )
}

Day.defaultProps = {
  hover: false,
  currentMonth: true,
  onChange: () => null,
}

export default React.memo(Day)
