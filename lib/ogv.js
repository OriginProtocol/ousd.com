export async function fetchOgvStats() {
  const endpoints = [`${process.env.NEXT_PUBLIC_COINGECKO_API}/simple/price?ids=origin-protocol%2Corigin-dollar-governance&vs_currencies=usd`, `${process.env.NEXT_PUBLIC_WEBSITE_API}/circulating-ogv`, `${process.env.NEXT_PUBLIC_WEBSITE_API}/total-ogv`]
  const ogvStats = await Promise.all(endpoints.map(async (endpoint) => {
    const response = await fetch(endpoint)
    if (!response.ok) {
      throw new Error(`Failed to fetch price`, err)
    }
    return await response.json()
  }))
  return ogvStats
}