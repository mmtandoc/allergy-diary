import React, { ReactElement, useState } from "react"
import { DateTime } from "luxon"

type Props = {
  date: DateTime
  selectedDay: DateTime
  onSelectedDayChange: (day: DateTime) => void
  hover: boolean
  currentMonth: boolean
  renderDayContent?: (date: DateTime) => ReactElement | void
}

const Day = (props: Props) => {
  //const [hover, setHover] = useState(props.hover)

  let className = "calendar-day"
  if (props.currentMonth) {
    className += " curr-month"
  }

  if (props.date.hasSame(DateTime.now(), "day")) {
    className += " today"
  }

  const isSelected = props.selectedDay.hasSame(props.date, "day")
  if (isSelected) {
    className += " selected"
  }

  //const toggleHover = () => setHover(!hover)
  //onMouseEnter={toggleHover}
  //onMouseLeave={toggleHover}
  return (
    /*
  hidden={!props.currentMonth}
  aria-hidden={!props.currentMonth}

*/
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <div
      className={className}
      style={{ gridColumn: props.date.weekday.toString() }}
      title={props.date.toLocaleString(DateTime.DATE_FULL)}
      onClick={() => props.onSelectedDayChange(props.date)}
      aria-selected={isSelected}
      role="gridcell"
      tabIndex={0}
    >
      <div aria-label="day" className="date-label">
        {props.date.day}
      </div>
      {props.renderDayContent?.(props.date)}
      <style jsx>{`
        .calendar-day .date-label {
          font-size: 0.8em;
          margin-left: 5%;
        }
        .calendar-day:not(.curr-month) {
          opacity: 20%;
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
