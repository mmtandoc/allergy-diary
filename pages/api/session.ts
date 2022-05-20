import { prisma } from "lib/prisma"
import axios from "axios"
import { NextApiRequest, NextApiResponse } from "next"
import crypto from "crypto"
import { getSession } from "next-auth/react"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { body, method } = req

  switch (method) {
    case "GET": {
      const session = await getSession({ req })
      res.send(JSON.stringify(session, null, 2))
      return
    }
    case "POST": {
      if (!("email" in body) || !("password" in body)) {
        res
          .status(400)
          .json({ error: { code: 400, message: "Missing arguments" } })
        return
      }

      const { email, password }: { email: string; password: string } = body

      let user = null
      try {
        user = await prisma.user.findUnique({
          where: {
            email: email as string,
          },
        })
      } catch (error) {
        //TODO: Expand error messages
        console.log(error)
        res
          .status(500)
          .json({ error: { code: 500, message: "Error with database" } })
        return
      }

      if (!user) {
        res
          .status(404)
          .json({
            error: { code: 404, message: `User ${email} does not exist` },
          })
        return
      }

      const isValidPassword = (
        password: string,
        salt: string,
        hash: string,
      ) => {
        const testHash = crypto
          .pbkdf2Sync(password, salt, 1000, 64, `sha512`)
          .toString(`hex`)
        return testHash === hash
      }

      const validPassword = isValidPassword(
        password as string,
        user.passwordSalt,
        user.passwordHash,
      )

      if (!validPassword) {
        res.status(400).json({ error: "Password is not valid" })
        return
      }
      console.log({
        id: user.id,
        name: user.name,
        email: user.email,
        mainMunicipalityId: user.mainMunicipalityId,
      })
      res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        mainMunicipalityId: user.mainMunicipalityId,
      })
      return
    }
    default:
      res
        .setHeader("Allow", ["POST", "GET"])
        .status(405)
        .json({ error: { code: 405, message: `Method ${method} Not Allowed` } })
      return
  }
}
