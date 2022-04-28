import { render, screen } from "@testing-library/react"
import Month from "components/Calendar"
import { DateTime } from "luxon"

describe("Month", () => {
  it.each([
    [DateTime.local(2022, 3, 25), 31],
    [DateTime.local(2020, 2, 25), 29],
  ])("renders month days", (selectedDay, daysInMonth) => {
    render(
      <Month selectedDay={selectedDay} onSelectedDayChange={() => undefined} />,
    )

    const days = screen.getAllByRole("gridcell", {
      hidden: false,
    })
    expect(days.filter((v) => v.classList.contains("curr-month"))).toHaveLength(
      daysInMonth,
    )
  })
})
