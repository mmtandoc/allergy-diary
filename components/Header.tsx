/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { signIn, signOut, useSession } from "next-auth/react"

const UserInfo = () => {
  const { data: session, status } = useSession()
  if (session && status === "authenticated") {
    return (
      <div className="user-info">
        <p>Signed in as {session?.user?.email ?? "ERROR"}</p>
        <button
          onClick={(e) => {
            e.preventDefault()
            signOut()
          }}
        >
          Sign out
        </button>
        <style jsx>
          {`
            div.user-info: {
              display: flex;
              flex-direction: row;
            }
          `}
        </style>
      </div>
    )
  }

  return (
    <button
      onClick={(e) => {
        e.preventDefault()
        signIn()
      }}
    >
      Sign in
    </button>
  )
}

const Header = () => {
  const router = useRouter()
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname

  const left = (
    <div className="left">
      <Link href="/">
        <a className="bold" data-active={isActive("/")}>
          Home
        </a>
      </Link>
      <Link href="/calendar">
        <a className="bold" data-active={isActive("/calendar")}>
          Calendar
        </a>
      </Link>
      <style jsx>{`
        .bold {
          font-weight: bold;
        }

        a {
          text-decoration: none;
          color: #000;
          display: inline-block;
        }

        .left a[data-active="true"] {
          color: gray;
        }

        a + a {
          margin-left: 1rem;
        }
      `}</style>
    </div>
  )

  const right = (
    <div className="right">
      <UserInfo />
      <style jsx>{`
        div.right {
          margin-left: auto;
        }
      `}</style>
    </div>
  )

  return (
    <nav>
      {left}
      {right}
      <style jsx>{`
        nav {
          display: flex;
          padding: 2rem;
          align-items: center;
          flex-grow: 0;
          flex-shrink: 0;
        }
      `}</style>
    </nav>
  )
}

export default Header
