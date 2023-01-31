import { ChartData } from "chart.js";

export const get24HData = (rawData24H: {
  prices: number[];
  market_caps: number[];
  total_volumes: number[];
}) => {
  const labels = rawData24H.prices.map((price: any) => price[0]);

  const prices = rawData24H.prices.map((price: any) => price[1]);
  const marketCaps = rawData24H.market_caps.map((price: any) => price[1]);

  const priceData24H: ChartData<"line"> = {
    labels,
    datasets: [
      {
        label: "Price",
        data: prices,
        fill: false,
        tension: 0.4,
        pointRadius: 0,
        pointHitRadius: 7,
        pointHoverRadius: 7,
        pointHoverBorderWidth: 2,
        pointHoverBorderColor: "#000",
        pointHoverBackgroundColor: "#8C66FC",
      },
    ],
  };

  const marketCapData24H: ChartData<"line"> = {
    labels,
    datasets: [
      {
        label: "Market Cap",
        data: marketCaps,
        fill: false,
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };

  return { priceData24H, marketCapData24H };
};

export default get24HData;
