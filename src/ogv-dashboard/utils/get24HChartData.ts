import { ChartData } from "chart.js";
import {
  priceGradientStart,
  fill,
  tension,
  pointRadius,
  pointHitRadius,
  pointHoverRadius,
  pointHoverBorderWidth,
  pointHoverBorderColor,
} from "../constants";

const get24HData = (rawData24H: {
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
        fill,
        tension,
        pointRadius,
        pointHitRadius,
        pointHoverRadius,
        pointHoverBorderWidth,
        pointHoverBorderColor,
        pointHoverBackgroundColor: priceGradientStart,
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
        tension,
        pointRadius,
      },
    ],
  };

  return { priceData24H, marketCapData24H };
};

export default get24HData;
