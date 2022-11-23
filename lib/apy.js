export async function fetchApy() {
  const apyDayOptions = [7, 30, 365]
  const dayResults = await Promise.all(
    apyDayOptions.map(async (days) => {
      let endpoint, varName
      if (apyDayOptions.includes(days)) {
        endpoint = `${process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT}/api/v1/apr/trailing/${days}`
        varName = `apy${days}`
      } else {
        throw new Error(`Unexpected days param: ${days}`)
      }
      const response = await fetch(endpoint)
      if (!response.ok) {
        throw new Error(`Failed to fetch ${days} day APY`, err)
      }
      const json = await response.json()
      return json.apy / 100
    })
  )
  const apy = {}
  apyDayOptions.map((days, i) => {
    apy[`apy${days}`] = dayResults[i] || 0
  })
  return apy
}
