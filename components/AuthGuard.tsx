import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/router"
import React, { useEffect } from "react"

const AuthGuard = ({ children }: { children: JSX.Element }) => {
  const { data: session, status } = useSession({ required: true })
  const router = useRouter()

  const isUser = !!session?.user

  const isLoading = status == "loading"
  useEffect(() => {
    if (isLoading) {
      return
    }
    //auth is initialized and there is no user
    if (!isUser) {
      signIn(undefined, { callbackUrl: router.route })
    }
  }, [isLoading, isUser, router.route])

  if (isUser) {
    return children
  }

  return <div>Loading...</div>
}

export default AuthGuard
