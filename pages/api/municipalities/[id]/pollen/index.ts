import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "lib/prisma"

export default async function pollenForecastHandler(
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

  //TODO: Handle different timezones?
  const offset = new Date().getTimezoneOffset()
  const forecasts = await prisma.forecast
    .findMany({
      where: {
        municipalityId: parseInt(id as string),
      },
      include: {
        pollenLevels: true,
        municipality: true,
      },
      orderBy: [{ date: "asc" }],
    })
    .catch((reason) => {
      console.log(reason)
      res.status(404).json({ error: reason })
      return
    })

  res.status(200).json(forecasts)
}
