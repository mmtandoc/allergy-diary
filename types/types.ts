import { Prisma } from "@prisma/client"

const forecastWithPollen = Prisma.validator<Prisma.ForecastArgs>()({
  include: { pollenLevels: true, municipality: true },
})
export type ForecastWithPollen = Prisma.ForecastGetPayload<
  typeof forecastWithPollen
>

const entryWithMunicipality = Prisma.validator<Prisma.EntryArgs>()({
  include: { municipality: { include: { subdivision: true, country: true } } },
})
export type EntryWithMunicipality = Prisma.EntryGetPayload<
  typeof entryWithMunicipality
>
