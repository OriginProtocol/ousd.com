import "chartjs-adapter-date-fns";
import { Header } from "@originprotocol/origin-storybook";
import { GetServerSideProps } from "next";
import { fetchAPI } from "../../lib/api";
import transformLinks from "../../src/utils/transformLinks";
import Head from "next/head";
import Footer from "../../src/components/Footer";
import {
  Chart as ChartJS,
  CategoryScale,
  PointElement,
  LineElement,
  LinearScale,
  Title,
  Tooltip,
  TimeScale,
  ArcElement,
  RadialLinearScale,
} from "chart.js";
import { useViewWidth, useOgv } from "../../src/hooks";
import ogvAbi from "../../src/constants/mainnetAbi/ogv.json";
import { ChartLine, DistributionLegend } from "../../src/plugins";
import { BigNumber, ethers, providers } from "ethers";
import { getRewardsApy } from "../../src/utils/math";
import {
  Link,
  DashProps,
  GetStorageAtResponse,
  GetBlockByNumberResponse,
} from "./types";
import { doughnutData, nonCirculatingSupply as nonCirculating } from "./data";
import { fetchOGVPriceData, get24HData, fetchOGVStakingData } from "./utils";
import {
  Heading,
  OgvPriceStats,
  OgvPriceChart,
  StakingBanner,
  AllocationDistribution,
  TopExchanges,
  OgvStakingStats,
} from "./sections";

ChartJS.register(
  CategoryScale,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  ArcElement,
  ChartLine,
  DistributionLegend("distributionLegend"),
  RadialLinearScale
);

const ogvStakingCache = {}; //on server

// Dependency flow: constants -> types, chart-configs, data, utils -> components -> sections -> index.tsx (this file)

const OgvDashboard = ({
  navLinks,
  priceData24H,
  marketCapData24H,
  currentPrice,
  currentMarketCap,
  change24H,
  totalSupply,
  doughnutData,
  nonCirculatingSupply,
}: DashProps) => {
  const width = useViewWidth();

  const { totalVeSupply } = useOgv();
  const stakingApy =
    getRewardsApy(100 * 1.8 ** (48 / 12), 100, parseFloat(totalVeSupply)) || 0;

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <Header mappedLinks={navLinks} webProperty="ousd" />

      {/* Heading */}
      <Heading stakingApy={stakingApy} />

      {/* General OGV Price Stats */}
      <OgvPriceStats
        {...{
          currentPrice,
          currentMarketCap,
          change24H,
          totalSupply,
          nonCirculatingSupply,
        }}
      />

      {/* OGV Price Chart */}
      <OgvPriceChart {...{ priceData24H, marketCapData24H, width }} />

      {/* OGV Staking Banner*/}
      <StakingBanner {...{ stakingApy, width }} />

      {/* OGV Staking Stats */}
      <OgvStakingStats />

      {/* OGV Allocation Distribution */}
      <AllocationDistribution doughnutData={doughnutData} />

      {/* Listed on top exchanges */}
      <TopExchanges />

      {/* Always takes up width of full screen */}
      <Footer locale={null} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (): Promise<{
  props: DashProps;
}> => {
  const navResPromise = fetchAPI("/ousd-nav-links", {
    populate: {
      links: {
        populate: "*",
      },
    },
  });

  const rawData24HPromise = fetchOGVPriceData(1);

  const currentPriceDataPromise = fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=origin-dollar-governance&vs_currencies=usd&include_market_cap=true&include_24hr_change=true&precision=full"
  );

  const provider = new providers.JsonRpcProvider(
    process.env.NEXT_PUBLIC_ETHEREUM_RPC_PROVIDER
  );
  const OGV = new ethers.Contract(
    "0x9c354503c38481a7a7a51629142963f98ecc12d0",
    ogvAbi,
    provider
  );

  const days = 90;
  const ethBlocksPerDay = 5760;
  const currentBlock = await provider.getBlockNumber();
  const ogvContractAddress = "0x9c354503C38481a7A7a51629142963F98eCC12D0";

  // The slot number of OGVStaking.sol's OGV balance
  // slither-read-storage 0x7DFAFe7d547Fc9083719D633B9c5f6f542C42c77
  // --variable-name _balances --key 0x0C4576Ca1c365868E162554AF8e385dc3e7C66D9
  // --storage-address 0x9c354503C38481a7A7a51629142963F98eCC12D0 --rpc-url
  // [YOUR_RPC_URL]
  const stakingContractOgvBalanceSlot = BigNumber.from(
    "53374832710725341261650961104440469343146346525711704527343957115373724579195"
  );

  // The slot number of OGV's total supply
  // slither-read-storage 0x7DFAFe7d547Fc9083719D633B9c5f6f542C42c77
  // --variable-name _totalSupply --key 0x0C4576Ca1c365868E162554AF8e385dc3e7C66D9
  // --storage-address 0x9c354503C38481a7A7a51629142963F98eCC12D0 --rpc-url
  // [YOUR_RPC_URL]
  const ogvTotalSupplySlot = BigNumber.from("53");

  const rawStakingDataPromise = fetchOGVStakingData(
    days,
    ethBlocksPerDay,
    currentBlock,
    ogvContractAddress,
    stakingContractOgvBalanceSlot,
    ogvTotalSupplySlot
  );

  const totalSupplyPromise: Promise<BigNumber> = OGV.totalSupply();

  let [
    navRes,
    rawData24H,
    currentPriceData,
    totalSupply,
    rawStakingData,
    ...nonCirculatingBalances
  ] = await Promise.all([
    navResPromise,
    rawData24HPromise,
    currentPriceDataPromise,
    totalSupplyPromise,
    rawStakingDataPromise,
    ...nonCirculating.map((e) => OGV.balanceOf(e.address)),
  ]);

  const nonCirculatingSupply = nonCirculating.map((e, i) => ({
    ...e,
    balance: nonCirculatingBalances[i].toString(),
  }));

  currentPriceData = await currentPriceData.json();

  const { priceData24H, marketCapData24H } = get24HData(rawData24H);

  const navLinks: Link[] = transformLinks(navRes.data) as Link[];

  // First 90 element of rawStakingData are the staking balances, next 90 are
  // the total supplies, and final 90 are the timestamps of the blocks those
  // metric were measured in... all over the last 90 days
  const percentStakedData = rawStakingData
    .slice(0, days)
    .map((d: GetStorageAtResponse, i: number) =>
      // Maintains two decimals of precision in the percentage
      (
        BigNumber.from(d.result)
          .mul(10000)
          .div(
            BigNumber.from(
              // Getting total supplies
              (rawStakingData[i + 90] as GetStorageAtResponse).result
            )
          )
          .toNumber() / 100
      ).toString()
    );
  console.log(percentStakedData);

  // const stakedDataTimes = rawStakingData.slice(days, days * 2).map((d : GetBlockByNumberResponse) => )

  const {
    usd: currentPrice,
    usd_market_cap: currentMarketCap,
    usd_24h_change: change24H,
  } = currentPriceData["origin-dollar-governance"];

  return {
    props: {
      navLinks,
      priceData24H,
      marketCapData24H,
      currentPrice,
      currentMarketCap,
      change24H,
      totalSupply: totalSupply.toString(),
      doughnutData,
      nonCirculatingSupply,
    },
  };
};

export default OgvDashboard;
