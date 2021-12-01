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

  if (method !== "GET") {
    res.setHeader("Allow", ["GET"])
    res.status(405).end(`Method ${method} Not Allowed`)
    return
  }

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
}
