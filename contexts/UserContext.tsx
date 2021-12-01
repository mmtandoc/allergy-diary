import { Prisma } from "@prisma/client"
import React, { useState } from "react"

/*
type User = {
  id: number
  name: string
  defaultLocation: string
}

const userWithMunicipality = Prisma.validator<Prisma.UserArgs>()({
  include: {
    mainMunicipality: { include: { subdivision: true, country: true } },
  },
})

type UserWithMunicipality = Prisma.UserGetPayload<typeof userWithMunicipality>
*/

const userInfo = Prisma.validator<Prisma.UserArgs>()({
  select: {
    id: true,
    email: true,
    name: true,
    mainMunicipalityId: true,
    mainMunicipality: {
      include: {
        subdivision: true,
        country: true,
      },
    },
  },
})

type UserInfo = Prisma.UserGetPayload<typeof userInfo>

const UserContext = React.createContext<
  | {
      user: UserInfo
      setUser: React.Dispatch<React.SetStateAction<UserInfo>>
    }
  | undefined
>(undefined)

function useUser(): {
  user: UserInfo
  setUser: React.Dispatch<React.SetStateAction<UserInfo>>
} {
  const context = React.useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserInfo>({
    id: 1,
    name: "Michael Tandoc",
    email: "michael.tandoc@outlook.com",
    mainMunicipalityId: 2,
    mainMunicipality: {
      id: 2,
      name: "Midland",
      localName: null,
      freeformAddress: "Midland, TX",
      latitude: 31.99743,
      longitude: -102.07804,
      countryCode: "US",
      country: {
        code: "US",
        name: "United States",
        codeISO3: "USA",
      },
      subdivisionId: 2,
      subdivision: {
        id: 2,
        name: "Texas",
        abbreviation: "TX",
        countryCode: "US",
        parentSubdivisionId: null,
      },
    },
  })
  //? Maybe memoize? const value = React.useMemo(() => {user, setUser}, [user])
  const value = { user, setUser }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export { UserProvider, useUser }
