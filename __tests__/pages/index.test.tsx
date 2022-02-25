import singletonRouter, { useRouter } from "next/router"
import NextLink from "next/link"
import { render, act, fireEvent, screen, waitFor } from "@testing-library/react"
import mockRouter from "next-router-mock"
import Home from "pages/index"

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
