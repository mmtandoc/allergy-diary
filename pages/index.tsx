import React from "react"
import Layout from "components/Layout"
import Link from "next/link"
import { DateTime } from "luxon"

const Home = () => {
  return (
    <Layout>
      <div className="page">
        <h1 style={{ marginTop: "0px" }}>Home Page</h1>
        <Link href="/calendar">
          <a>View Calendar</a>
        </Link>
      </div>
    </Layout>
  )
}

export default Home
