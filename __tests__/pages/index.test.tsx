import singletonRouter, { useRouter } from "next/router"
import NextLink from "next/link"
import { render, act, fireEvent, screen, waitFor } from "@testing-library/react"
import mockRouter from "next-router-mock"
import Home from "pages/index"
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
jest.mock("next/dist/client/router", () => require("next-router-mock"))

describe("Home", () => {
  beforeEach(() => {
    mockRouter.setCurrentUrl("/")
  })
  it("renders a heading", () => {
    render(<Home />)

    const heading = screen.getByRole("heading", {
      name: /Home Page/i,
    })

    expect(heading).toBeInTheDocument()
  })
})
