import axios from "axios"
import { UserProvider } from "contexts/UserContext"
import { AppProps } from "next/app"
import React from "react"
import { SWRConfig } from "swr"
import { SessionProvider } from "next-auth/react"
import AuthGuard from "components/AuthGuard"
import { NextComponentType } from "next"

type AppPropsWithAuth = AppProps & {
  Component: NextComponentType & { requireAuth?: boolean } // add auth type
}

const fetcher = (url: string) => axios(url).then((res) => res.data)

const multiFetcher = (...urls: string[]) => {
  if (urls.length > 1) {
    return Promise.all(urls.map(fetcher))
  }
  return fetcher(urls[0])
}

const App = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithAuth) => {
  return (
    <SessionProvider session={session}>
      <SWRConfig value={{ fetcher: multiFetcher }}>
        <UserProvider>
          {Component.requireAuth ? (
            <AuthGuard>
              <Component {...pageProps} />
            </AuthGuard>
          ) : (
            // public page
            <Component {...pageProps} />
          )}
        </UserProvider>
      </SWRConfig>
    </SessionProvider>
  )
}

export default App
