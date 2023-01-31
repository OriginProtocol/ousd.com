export const fetchOGVPriceData = async (
  days: number
): Promise<{
  prices: number[];
  market_caps: number[];
  total_volumes: number[];
}> => {
  return await (
    await fetch(
      `https://api.coingecko.com/api/v3/coins/origin-dollar-governance/market_chart?vs_currency=usd&days=${days}`
    )
  ).json();
};

export default fetchOGVPriceData;
