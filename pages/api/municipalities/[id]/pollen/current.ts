import { NextApiRequest, NextApiResponse } from "next"
import { DateTime } from "luxon"
import { prisma } from "lib/prisma"

export default async function currentPollenHandler(
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

  //TODO: Handle different timezones?
  //const offset = new Date().getTimezoneOffset()
  const current = await prisma.forecast.findFirst({
    where: {
      municipalityId: parseInt(id as string),
      date: {
        gte: DateTime.now().startOf("day").toJSDate(),
        lt: DateTime.now().startOf("day").plus({ days: 1 }).toJSDate(),
      },
    },
    include: {
      pollenLevels: true,
      municipality: true,
    },
  })

  res.status(200).json({ current: current })
}
