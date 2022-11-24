export async function fetchAllocation() {
  const endpoint = `${process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT}/api/v1/strategies`
  const response = await fetch(endpoint)
  if (!response.ok) {
    throw new Error('Failed to fetch allocation')
  }
  const json = await response.json()
  return json
}