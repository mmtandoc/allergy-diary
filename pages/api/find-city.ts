import axios from "axios"
import { NextApiRequest, NextApiResponse } from "next"
import { SearchFuzzyResponse } from "types/azureMaps/search/SearchFuzzyResponse"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
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

  const response = await axios.get<SearchFuzzyResponse>(
    `https://atlas.microsoft.com/search/fuzzy/json?api-version=1.0&subscription-key=Fg6JeHgHsf2jtBliDtBgcyCqc8etrmx2XtVgfXTojZI&idxSet=Geo&query=${locationQuery}&typeahead=true`,
  )

  const municipalities = response.data.results.filter(
    (i) => (i?.entityType ?? "") === "Municipality",
  )
  res.status(200).json({ results: municipalities })
}
