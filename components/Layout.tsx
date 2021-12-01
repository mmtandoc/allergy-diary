import React, { ReactNode } from "react"
import Header from "./Header"

type Props = {
  children: ReactNode
}

const Layout = (props: Props) => (
  <React.Fragment>
    <Header />
    <div className="layout">{props.children}</div>
    <style jsx global>{`
      html {
        box-sizing: border-box;
        font-size: 62.5%;
      }

      *,
      *:before,
      *:after {
        box-sizing: inherit;
      }

      body {
        margin: 0;
        padding: 0;
        font-size: 1.6rem;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
          Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
          "Segoe UI Symbol";
        background: rgba(0, 0, 0, 0.05);
        min-height: 100vh;
      }

      #__next {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
      }

      input,
      textarea {
        font-size: 1.6rem;
        font-family: inherit;
      }

      button {
        cursor: pointer;
      }
    `}</style>
    <style jsx global>{`
      .layout {
        padding: 0 2rem;
        display: flex;
        flex-grow: 1;
        flex-shrink: 1;
        align-items: stretch;
      }
      .page {
        display: flex;
        flex-direction: column;
        align-self: stretch;
        width: 100%;
      }
    `}</style>
  </React.Fragment>
)

export default Layout
