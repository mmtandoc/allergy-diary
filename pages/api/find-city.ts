import axios from "axios"
import { NextApiRequest, NextApiResponse } from "next"
import { SearchFuzzyResponse } from "interfaces/azureMaps/search/SearchFuzzyResponse"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { locationQuery },
    method,
  } = req

  if (method !== "GET") {
    res.setHeader("Allow", ["GET"])
    res.status(405).end(`Method ${method} Not Allowed`)
    return
  }

  const results = await axios(
    `https://atlas.microsoft.com/search/fuzzy/json?api-version=1.0&subscription-key=Fg6JeHgHsf2jtBliDtBgcyCqc8etrmx2XtVgfXTojZI&idxSet=Geo&query=${locationQuery}`
  )
  const data: SearchFuzzyResponse = results.data
  const municipalities = data.results.filter(
    (i) => (i?.entityType ?? "") === "Municipality"
  )
  res.status(200).json({ data: municipalities })
}
