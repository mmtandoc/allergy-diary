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

  const municipality = await prisma.municipality.findUnique({
    where: { id: parseInt(id as string) },
    include: {
      subdivision: true,
      country: true,
    },
  })

  res.status(200).json({ municipality: municipality })
}
