import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "lib/prisma"
import { PollenType } from "@prisma/client"
import axios from "axios"

export default async function getForecastHandler(
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
    select: { latitude: true, longitude: true },
  })

  if (!municipality) {
    res.status(404).end(`Municipality ${id} Not Found`)
    return
  }

  const { latitude: lat, longitude: lon } = municipality

  const results = await axios(
    `https://atlas.microsoft.com/weather/forecast/daily/json?api-version=1.0&query=${lat},${lon}&duration=15&subscription-key=${process.env.AZURE_API_KEY}`,
  )
  const data = results.data

  const pollenTypes = ["Grass", "Mold", "Ragweed", "Tree"]

  const municipalityId = parseInt(id as string)

  /*const forecastData = data.forecasts.map(
    (val: {
      date: Date
      airAndPollen: { name: string; value: number; categoryValue: number }[]
    }) => {
      return {
        date: val.date,
        municipalityId: parseInt(id as string),
        pollenLevels: {
          createMany: {
            data: val.airAndPollen
              .filter((p) => pollenTypes.includes(p.name))
              .map((p) => {
                return {
                  type: <keyof typeof PollenType>p.name.toUpperCase(),
                  value: p.value,
                  categoryValue: p.categoryValue,
                }
              }),
          },
        },
      }
    },
  )*/

  /*
  const createdData = forecastData.map(async (val: any) => {
    return await prisma.forecast
      .upsert({
        where: {
          municipalityId_date: {
            date: val.date,
          municipalityId: val.municipalityId
          }
        },
        create: {},
        update: {}
        data: val,
        include: { pollenLevels: true },
      })
      .catch((reason) => {
        console.log(reason)
      })
  })

  const createdData = forecastData.map(async (val: any) => {
    return await prisma.forecast
      .create({
        data: val,
        include: { pollenLevels: true },
      })
      .catch((reason) => {
        console.log(reason)
      })
  })

  */

  /*
  const createdData = forecastData.map(async (val: any) => {
    return await prisma.forecast
      .upsert({
        where: {
          municipalityId_date: {
            date: val.date,
            municipalityId: val.municipalityId,
          },
        },
        create: {
          date: val.date,
          municipalityId: val.municipalityId,
          pollenLevels: {
            createMany: {
              data: val.airAndPollen
            }
          }
        },
        update: {
          dateRetrieved: new Date(),
        },
        include: { pollenLevels: true },
      })
      .catch((reason) => {
        console.log(reason)
      })
  })*/

  const createdData = data.forecasts.map(
    async (forecast: {
      date: Date
      airAndPollen: { name: string; value: number; categoryValue: number }[]
    }) => {
      const pollenData = forecast.airAndPollen
        .filter((p) => pollenTypes.includes(p.name))
        .map((p) => {
          return {
            type: <keyof typeof PollenType>p.name.toUpperCase(),
            value: p.value,
            categoryValue: p.categoryValue,
          }
        })

      return await prisma.forecast
        .upsert({
          where: {
            municipalityId_date: {
              date: forecast.date,
              municipalityId,
            },
          },
          create: {
            date: forecast.date,
            municipalityId,
            pollenLevels: {
              createMany: {
                data: pollenData,
              },
            },
          },
          update: {
            dateRetrieved: new Date(),
            pollenLevels: {
              updateMany: pollenData.map((p) => {
                return {
                  where: {
                    type: p.type,
                  },
                  data: p,
                }
              }),
            },
          },
          include: { pollenLevels: true },
        })
        .catch((reason) => {
          console.log(reason)
        })
    },
  )

  res.status(200).json({
    createdData: createdData,
    debug: data.forecasts,
  })
}
