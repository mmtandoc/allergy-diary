import { verifyAuth } from "middleware/verifyAuth"
import { NextRequest, NextFetchEvent } from "next/server"

export async function middleware(req: NextRequest, event: NextFetchEvent) {
  return await verifyAuth(req, event)
}
