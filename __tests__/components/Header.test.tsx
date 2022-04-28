import { act, render, screen } from "@testing-library/react"
import Header from "components/Header"
import mockRouter from "next-router-mock"

jest.mock("next/dist/client/router", () => require("next-router-mock"))

describe("Home", () => {
  beforeEach(() => {
    mockRouter.setCurrentUrl("/")
  })

  it("renders links", () => {
    render(<Header />)

    const homeLink = screen.getByRole("link", {
      name: /Home/i,
    })

    const calendarLink = screen.getByRole("link", {
      name: /Calendar/i,
    })

    expect(homeLink).toBeInTheDocument()
    expect(homeLink).toHaveAttribute("href", "/")

    expect(calendarLink).toBeInTheDocument()
    expect(calendarLink).toHaveAttribute("href", "/calendar")
  })

  it("detects link of current page", () => {
    render(<Header />)

    const homeLink = screen.getByRole("link", {
      name: /Home/i,
    })

    const calendarLink = screen.getByRole("link", {
      name: /Calendar/i,
    })

    expect(homeLink).toBeInTheDocument()
    expect(calendarLink).toBeInTheDocument()

    expect(homeLink).toHaveAttribute("data-active", "true")
    expect(calendarLink).toHaveAttribute("data-active", "false")

    act(() => {
      mockRouter.setCurrentUrl("/calendar")
    })

    expect(homeLink).toHaveAttribute("data-active", "false")
    expect(calendarLink).toHaveAttribute("data-active", "true")
  })
})
