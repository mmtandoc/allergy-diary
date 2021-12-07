import React from "react"
import Layout from "components/Layout"
import Link from "next/link"
import SplitView from "components/SplitView"

const Debug = () => {
  return (
    <Layout>
      <div className="page">
        <h1 style={{ marginTop: "0px" }}>Debug Page</h1>
        <SplitView />
      </div>
    </Layout>
  )
}

export default Debug
