export async function fetchAllocation() {
  const endpoint = `${process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT}/api/v2/ousd/strategies?structured=true`;
  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error("Failed to fetch allocation");
  }
  return response.json();
}
