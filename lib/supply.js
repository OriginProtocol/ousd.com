export async function fetchSupply() {
  const endpoint = `${process.env.NEXT_PUBLIC_WEBSITE_API}/total-ousd`
  const response = await fetch(endpoint)
  if (!response.ok) {
    throw new Error('Failed to fetch supply')
  }
  const json = await response.json()
  return json
}