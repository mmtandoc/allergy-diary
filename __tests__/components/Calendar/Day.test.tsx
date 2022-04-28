import { fireEvent, render, screen } from "@testing-library/react"
import Day from "components/Calendar/Day"
import { DateTime } from "luxon"
import mockRouter from "next-router-mock"
import React from "react"

jest.mock("next/dist/client/router", () => require("next-router-mock"))

describe("Day", () => {
  beforeEach(() => {
    mockRouter.setCurrentUrl("/calendar")
  })

  it("displays day of the month", () => {
    render(
      <Day
        date={DateTime.fromISO("2022-03-25T12:00:00")}
        selectedDay={DateTime.fromISO("2022-03-25T12:00:00")}
        onSelectedDayChange={() => undefined}
      />,
    )

    const dayText = screen.getByText("25")
    expect(dayText).toBeInTheDocument()
  })

  it("shows if day is selected", () => {
    render(
      <Day
        date={DateTime.fromISO("2022-03-25T12:00:00")}
        selectedDay={DateTime.fromISO("2022-03-25T12:00:00")}
        onSelectedDayChange={() => undefined}
      />,
    )

    const day = screen.getByRole("gridcell")

    expect(day).toHaveAttribute("aria-selected", "true")
    expect(day).toHaveClass("selected")
  })

  it("shows if day is not selected", () => {
    render(
      <Day
        date={DateTime.fromISO("2022-03-25T12:00:00")}
        selectedDay={DateTime.fromISO("2022-03-27T12:00:00")}
        onSelectedDayChange={() => undefined}
      />,
    )

    const day = screen.getByRole("gridcell")

    expect(day).toHaveAttribute("aria-selected", "false")
    expect(day).not.toHaveClass("selected")
  })

  it("handles clicks", () => {
    const selectedDay = DateTime.fromISO("2022-03-27T12:00:00")
    const setSelectedDay = jest.fn()
    render(
      <Day
        date={DateTime.fromISO("2022-03-25T12:00:00")}
        selectedDay={selectedDay}
        onSelectedDayChange={setSelectedDay}
      />,
    )

    const day = screen.getByRole("gridcell")

    fireEvent.click(day)

    expect(setSelectedDay).toHaveBeenCalled()
  })
})
