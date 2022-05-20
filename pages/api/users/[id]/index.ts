import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "lib/prisma"

export default async function municipalityHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const {
    query: { id },
    method,
  } = req

  //TODO: Implement other User methods
  switch (method) {
    case "GET": {
      const user = await prisma.user
        .findUnique({
          where: { id: parseInt(id as string) },
          include: {
            mainMunicipality: {
              include: {
                country: true,
                subdivision: true,
              },
            },
          },
        })
        .catch((reason) => {
          //TODO: HANDLE ERROR
          console.log(reason)
          res.status(404).json({ error: reason })
          return
        })

      res.status(200).json({ user })
      return
    }
    case "PATCH": {
      //TODO: Implement PATCH method
    }

    default:
      res
        .setHeader("Allow", ["GET", "PATCH"])
        .status(405)
        .json({ error: { code: 405, message: `Method ${method} Not Allowed` } })
      break
  }
}
