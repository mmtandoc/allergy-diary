import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "lib/prisma"
import { EntryWithMunicipality } from "types/types"

export default async function entryHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const {
    query: { id, date },
    method,
    body,
  } = req

  switch (method) {
    case "GET": {
      const entry = await prisma.entry
        .findUnique({
          where: {
            userId_date: {
              userId: parseInt(id as string),
              date: new Date(date as string),
            },
          },
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
      res.status(200).json(entry)
      break
    }
    case "PUT": {
      const entryData: EntryWithMunicipality = body as EntryWithMunicipality
      console.log(entryData)
      const newEntry = await prisma.entry.upsert({
        create: {
          userId: parseInt(id as string),
          date: new Date(date as string),
          rating: entryData.rating,
          notes: entryData?.notes,
          municipalityId: entryData.municipalityId,
        },
        update: {
          rating: entryData.rating,
          notes: entryData?.notes,
          municipalityId: entryData.municipalityId,
        },
        where: {
          userId_date: {
            userId: parseInt(id as string),
            date: new Date(date as string),
          },
        },
      })
      res.status(200).json(newEntry)
      break
    }
    case "PATCH":
      break
    default:
      res.setHeader("Allow", ["GET", "PUT", "PATCH"])
      res.status(405).end(`Method ${method} Not Allowed...`)
      break
  }
}
