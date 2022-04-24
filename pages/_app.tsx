import axios from "axios"
import { UserProvider } from "contexts/UserContext"
import { AppProps } from "next/app"
import React from "react"
import { SWRConfig } from "swr"

const fetcher = (url: string) => axios(url).then((res) => res.data)

const multiFetcher = (...urls: string[]) => {
  if (urls.length > 1) {
    return Promise.all(urls.map(fetcher))
  }
  return fetcher(urls[0])
}

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <SWRConfig value={{ fetcher: multiFetcher }}>
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </SWRConfig>
  )
}

export default App
