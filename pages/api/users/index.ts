import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "lib/prisma"
import crypto from "crypto"

export default async function municipalityHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { query, method } = req

  //TODO: Implement other User methods

  switch (method) {
    case "POST": {
      const { name, email, password1, password2, mainMunicipalityId } = query

      if (password1 !== password2) {
        res
          .status(400)
          .json({ error: { code: 400, message: "Passwords do not match." } })
        return
      }

      const emailExists =
        (await prisma.user.count({
          where: {
            email: email as string,
          },
        })) > 0

      if (emailExists) {
        res
          .status(400)
          .json({
            error: {
              code: 400,
              message: "The given email has already been used.",
            },
          })
        return
      }

      //TODO: Handle database errors
      const passwordSalt = crypto.randomBytes(16).toString("hex")
      const passwordHash = crypto
        .pbkdf2Sync(password1 as string, passwordSalt, 1000, 64, `sha512`)
        .toString(`hex`)

      let user
      try {
        user = await prisma.user.create({
          data: {
            email: email as string,
            name: name as string,
            passwordHash: passwordHash,
            passwordSalt: passwordSalt,
            mainMunicipalityId: parseInt(mainMunicipalityId as string),
          },
        })
      } catch (error) {
        res
          .status(500)
          .json({ error: { code: 500, message: "Error with database" } })
        return
      }

      res.status(201).json(user)
      return
    }

    default:
      res
        .status(405)
        .setHeader("Allow", ["POST"])
        .send(`Method ${method} Not Allowed`)
      break
  }
}
