import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "lib/prisma"

export default async function entriesHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const {
    query: { id },
    method,
  } = req

  if (method !== "GET") {
    res
      .setHeader("Allow", ["GET"])
      .status(405)
      .json({ error: { code: 405, message: `Method ${method} Not Allowed` } })
    return
  }

  const entries = await prisma.entry
    .findMany({
      where: { userId: parseInt(id as string) },
      include: {
        municipality: {
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

  res.status(200).json(entries)
}
