import singletonRouter, { useRouter } from "next/router"
import NextLink from "next/link"
import { render, act, fireEvent, screen, waitFor } from "@testing-library/react"
import mockRouter from "next-router-mock"
import Header from "components/Header"

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

    expect(calendarLink).toBeInTheDocument()
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
