import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "lib/prisma"
import axios from "axios"

type MunicipalitiesQuery = {
  name?: string
  country?: string
}

export default async function municipalitiesHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { query, method }: { query?: MunicipalitiesQuery; method?: string } =
    req

  console.log(query)

  switch (method) {
    case "GET": {
      const municipalities = await prisma.municipality.findMany({
        where: {
          name: { contains: query.name },
          OR: [
            { country: { name: { contains: query.country } } },
            { country: { code: { contains: query.country } } },
            { country: { codeISO3: { contains: query.country } } },
          ],
        },
        orderBy: { id: "asc" },
        include: {
          subdivision: true,
          country: true,
        },
      })

      res.status(200).json(municipalities)
      break
    }
    case "POST": {
      const results = await axios.get(
        `https://atlas.microsoft.com/search/fuzzy/json?api-version=1.0&subscription-key=${process.env.AZURE_MAPS_API_KEY}&idxSet=Geo&query=${query.name},${query.country}`,
      )

      type Geo = {
        type: string
        position: {
          lat: number
          lon: number
        }
        entityType: string
        address: {
          countrySecondarySubdivision?: string
          countrySubdivision: string
          countrySubdivisionName?: string
          countryCode: string
          country: string
          countryCodeISO3: string
          freeformAddress: string
          municipality?: string
          postalName?: string
          localName?: string
        }
      }

      const cities: Geo[] = results.data?.results?.filter(
        (i: { entityType: string }) => i?.entityType === "Municipality",
      )

      const city = cities?.[0]

      if (!city) {
        //!: HANDLE ERROR
      }

      //TODO: Handle secondary/tertiary subdivisions

      const hasAbbr = city.address.countrySubdivisionName !== undefined

      const subdivisionData = {
        countryCode: city.address.countryCode,
        name:
          city.address?.countrySubdivisionName ??
          city.address.countrySubdivision,
        abbreviation: hasAbbr ? city.address.countrySubdivision : null,
      }

      const subdivision = await prisma.subdivision.findFirst({
        where: subdivisionData,
      })

      const municipality = await prisma.municipality.create({
        data: {
          name: city.address.municipality ?? "UNKNOWN",
          localName: city.address.localName,
          latitude: city.position.lat,
          longitude: city.position.lon,
          freeformAddress: city.address.freeformAddress,
          subdivision:
            subdivision?.id == null
              ? { create: subdivisionData }
              : { connect: { id: subdivision.id } },
          country: {
            connectOrCreate: {
              where: {
                code: city.address.countryCode,
              },
              create: {
                code: city.address.countryCode,
                name: city.address.country,
                codeISO3: city.address.countryCodeISO3,
              },
            },
          },
        },
      })

      res.status(201).json(municipality)
      break
    }
    default:
      res
        .setHeader("Allow", ["GET", "POST"])
        .status(405)
        .json({ error: { code: 405, message: `Method ${method} Not Allowed` } })
      break
  }

  return
}
