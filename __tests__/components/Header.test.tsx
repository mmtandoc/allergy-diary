import { act, render, screen } from "@testing-library/react"
import Header from "components/Header"
import mockRouter from "next-router-mock"
jest.mock("next/dist/client/router", () => require("next-router-mock"))

jest.mock("next-auth/react", () => {
  const originalModule = jest.requireActual("next-auth/react")
  const mockSession = {
    expires: new Date(Date.now() + 2 * 86400).toISOString(),
    user: { email: "email@example.com", name: "John Doe" },
  }
  return {
    __esModule: true,
    ...originalModule,
    useSession: jest.fn(() => {
      return { data: mockSession, status: "authenticated" }
    }),
  }
})

describe("Header", () => {
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
