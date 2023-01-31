import { ChartData } from "chart.js";
import Link from "./Link";

interface DashProps {
  navLinks: Link[];
  priceData24H: ChartData<"line">;
  marketCapData24H: ChartData<"line">;
  stakingData: ChartData<"line">;
  currentPrice: number;
  currentMarketCap: number;
  change24H: number;
  totalSupply: string;
  doughnutData: ChartData<"doughnut">;
  nonCirculatingSupply: {
    address: string;
    internalLabel: string;
    publicLabel: string;
    balance: string;
  }[];
}

export default DashProps;
