import axios from "axios"
import { UserProvider } from "contexts/UserContext"
import { AppProps } from "next/app"
import React from "react"
import { SWRConfig } from "swr"

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <SWRConfig
      value={{ fetcher: (url: string) => axios(url).then((res) => res.data) }}
    >
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </SWRConfig>
  )
}

export default App
