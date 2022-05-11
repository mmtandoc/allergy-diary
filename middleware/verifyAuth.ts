/* eslint-disable @next/next/no-server-import-in-page */
import { getToken } from "next-auth/jwt"
import { NextResponse, NextRequest, NextFetchEvent } from "next/server"

export async function verifyAuth(req: NextRequest, event: NextFetchEvent) {
  // 'secret' should be the same 'process.env.SECRET' use in NextAuth function
  const session = await getToken({ req })
  console.log("session in middleware: ", session)

  if (!session)
    return new NextResponse(
      JSON.stringify({ error: { code: "401", message: "Not authorized" } }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )

  return NextResponse.next()
}
