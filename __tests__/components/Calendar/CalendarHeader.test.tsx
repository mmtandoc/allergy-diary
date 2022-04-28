import { render, screen } from "@testing-library/react"
import CalendarHeader from "components/Calendar/CalendarHeader"
import { DateTime } from "luxon"

describe("CalendarHeader", () => {
  it.each([
    [DateTime.local(2022, 3, 25, 12), "March 2022"],
    [DateTime.local(2020, 1, 1, 0), "January 2020"],
  ])(
    "displays current month and year (%s => %s)",
    (selectedDay, currentMonthText) => {
      const setSelectedDay = jest.fn()
      const setCurrentMonth = jest.fn()
      render(
        <CalendarHeader
          selectedDay={selectedDay}
          onSelectedDayChange={setSelectedDay}
          currentMonth={selectedDay.startOf("month")}
          onCurrentMonthChange={setCurrentMonth}
        />,
      )

      expect(screen.getByText(currentMonthText)).toBeInTheDocument()
    },
  )
})
