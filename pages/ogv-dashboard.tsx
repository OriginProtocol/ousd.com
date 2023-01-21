import "chartjs-adapter-date-fns";
import React, { useState, useRef, useEffect } from "react";
import { Typography, Header, Button } from "@originprotocol/origin-storybook";
import { GetServerSideProps } from "next";
import { fetchAPI } from "../lib/api";
import transformLinks from "../src/utils/transformLinks";
import Head from "next/head";
import Image from "next/image";
import { assetRootPath } from "../src/utils/image";
import Footer from "../src/components/Footer";
import { enUS } from "date-fns/locale";
import { format } from "date-fns";
import {
  Chart as ChartJS,
  CategoryScale,
  PointElement,
  LineElement,
  LinearScale,
  Title,
  Tooltip,
  ChartOptions,
  ChartData,
  TimeScale,
  TimeScaleOptions,
  TooltipModel,
  ArcElement,
  RadialLinearScale,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";
import { useChartGradient, useViewWidth } from "../src/hooks";
import ogvAbi from "../src/constants/mainnetAbi/ogv.json";
import { ChartLine, DistributionLegend } from "../src/plugins";
import { BigNumber, ethers, providers, utils } from "ethers";
const { formatEther, commify } = utils;
import Link from "next/link";
import { shortenAddress } from "../src/utils/shortenAddress";

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

interface Link {
  href: string;
  label: string;
  isButton: boolean;
  highlightText: null;
  order: number;
  target: "_blank" | "_self" | "_parent" | "_top";
  links: any[];
}

interface DashProps {
  navLinks: Link[];
  priceData24H: ChartData<"line">;
  marketCapData24H: ChartData<"line">;
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

const buttonCSS = "w-16 md:w-24 lg:w-26 text-sm py-4 mr-2 lg:mr-4 rounded-full";

const lineOptions: ChartOptions<"line"> = {
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: false,
      callbacks: {
        title: (context) => [
          format(context[0].parsed.x, "MM/dd/yyyy"),
          format(context[0].parsed.x, "HH:mm"),
        ],
        label: (context) => {
          return context.dataset.label === "Price"
            ? "$" + (context.raw as number).toPrecision(4)
            : context.formattedValue;
        },
      },
      external: (context) => {
        if ("ontouchstart" in window) return;

        // Tooltip Element
        let tooltipEl = document.getElementById("ogv-price-tooltip");

        // Create element on first render
        if (!tooltipEl) {
          tooltipEl = document.createElement("div");
          tooltipEl.id = "ogv-price-tooltip";
          tooltipEl.innerHTML = "<table></table>";
          document.body.appendChild(tooltipEl);
        }

        // Hide if no tooltip
        const tooltipModel: TooltipModel<"line"> = context.tooltip;
        if (tooltipModel.opacity === 0) {
          tooltipEl.style.opacity = "0";
          return;
        }

        // Set caret Position
        tooltipEl.classList.remove("above", "below", "no-transform");
        if (tooltipModel.yAlign) {
          tooltipEl.classList.add(tooltipModel.yAlign);
        } else {
          tooltipEl.classList.add("no-transform");
        }

        function getBody(bodyItem) {
          return bodyItem.lines;
        }

        // Set Text
        if (tooltipModel.body) {
          const titleLines = tooltipModel.title || [];
          const bodyLines = tooltipModel.body.map(getBody);

          let innerHtml =
            '<div style="background-image: -webkit-linear-gradient(left, #8c66fc -28.99%, #0274f1 144.97%); color: gray; padding: 2px; border-radius: 0.5rem; min-width: 8rem; width: fit-content">';

          innerHtml +=
            '<div style="width: full; background: #141519; border-radius: 0.5rem 0.5rem 0 0; padding: .5rem;" class="flex justify-between"> ';

          titleLines.forEach((title) => {
            innerHtml +=
              '<div style="font-family: Sailec; font-style: normal; font-weight: 400; font-size: 0.75rem; line-height: 1rem">' +
              title +
              "</div>";
          });
          innerHtml += "</div>";

          bodyLines.forEach((body) => {
            innerHtml +=
              '<div style="background: #141519; border-radius: 0 0 0.5rem 0.5rem; padding: .5rem; color: white; font-weight: 600;">' +
              body +
              "</div>";
          });

          innerHtml += "</div>";
          tooltipEl.innerHTML = innerHtml;
        }

        const position = context.chart.canvas.getBoundingClientRect();

        // Display, position, and set styles for font
        tooltipEl.style.opacity = "1";
        tooltipEl.style.position = "absolute";
        tooltipEl.style.left =
          position.left + window.pageXOffset + tooltipModel.caretX + "px";
        tooltipEl.style.top =
          position.top + window.pageYOffset + tooltipModel.caretY + "px";

        tooltipEl.style.marginLeft = "0.5rem";
        tooltipEl.style.pointerEvents = "none";
      },
    },
  },
  interaction: {
    mode: "index",
    intersect: false,
  },
  hover: {
    mode: "index",
    intersect: false,
  },
  borderColor: "#FFF",
  scales: {
    x: {
      type: "time",
      border: {
        color: "#8493A6",
      },
      time: {
        displayFormats: {
          hour: "HH:mm",
          day: "HH:mm",
          month: "MM/yy",
        },
      },
      adapters: {
        date: {
          locale: enUS,
        },
      },
      ticks: {
        autoSkip: true,
        maxTicksLimit: 6,
        align: "start",
        maxRotation: 0,
      },
      grid: {
        display: false,
      },
    },
    y: {
      border: {
        display: false,
      },
      position: "right",
      ticks: {
        padding: 10,
        count: 2,
        font: {
          size: 18,
        },
      },
      grid: {
        display: false,
      },
    },
    // Hacky but the second (invisible) y-axis allows for adding padding to the left xD
    y1: {
      type: "time",
      display: true,
      position: "left",
      border: {
        display: false,
      },
      ticks: {
        maxTicksLimit: 1,
        autoSkip: true,
        callback: () => "  ", // The padding
      },
    },
    x1: {
      type: "time",
      display: true,
      position: "top",
      border: {
        display: false,
      },
      ticks: {
        maxTicksLimit: 1,
        autoSkip: true,
        callback: () => "  ", // The padding
      },
    },
  },
};

const doughnutOptions: ChartOptions<"doughnut"> = {
  maintainAspectRatio: false,
  cutout: "80%",
  plugins: {
    tooltip: {
      enabled: false,
    },
    //@ts-ignore
    distributionLegend: {
      containerId: "legend-container",
    },
  },
};

enum ChartType {
  Price,
  Market_Cap,
}

enum ChartTime {
  ONE_DAY = 1,
  SEVEN_DAY = 7,
  THIRTY_DAY = 30,
  ONE_YEAR = 365,
}

const nonCirculating = [
  {
    address: "0xbe2AB3d3d8F6a32b96414ebbd865dBD276d3d899",
    internalLabel: "5 of 8",
    publicLabel: "Foundation Reserves",
  },
  {
    address: "0xcaa5eF7AbC36D5E5a3E4d7930DCfF3226617A167",
    internalLabel: "Old T3 Team Hot Wallet",
    publicLabel: "Team Distribution",
  },
  {
    address: "0x2EaE0CaE2323167ABF78462e0C0686865c67a655",
    internalLabel: "New T3 Team Hot Wallet",
    publicLabel: "Team Distribution",
  },
  {
    address: "0x3Da5045699802Ea1fCc60130dEDEa67139C5b8C0",
    internalLabel: "Old T3 Investor Hot Wallet",
    publicLabel: "Investor Distribution",
  },
  {
    address: "0xFE730B3cf80cA7B31905f70241F7C786BAF443E3",
    internalLabel: "New T3 Investor Hot Wallet",
    publicLabel: "Investor Distribution",
  },
  {
    address: "0x12D7EF3C933D091210cD931224Ead45D9cFdDdE0",
    internalLabel: "Lukewarm",
    publicLabel: "Distribution Staging",
  },
  {
    address: "0x0C4576Ca1c365868E162554AF8e385dc3e7C66D9",
    internalLabel: "Staked OGV",
    publicLabel: "Staked OGV",
  },
  {
    address: "0x7aE2334f12a449895AD21d4c255D9DE194fe986f",
    internalLabel: "OGV Claims",
    publicLabel: "OGV Claims",
  },
  {
    address: "0xD667091c2d1DCc8620f4eaEA254CdFB0a176718D",
    internalLabel: "veOGV Claims",
    publicLabel: "veOGV Claims",
  },
  {
    address: "0x8ac3b96d118288427055ae7f62e407fC7c482F57",
    internalLabel: "Custodian for Brave Endeavors",
    publicLabel: "Custodian",
  },
  {
    address: "0xA2Cc2eAE69cBf04a3D5660bc3E689B035324Fc3F",
    internalLabel: "Custodian for Limitless Alpha",
    publicLabel: "Custodian",
  },
];

const doughnutData: ChartData<"doughnut"> = {
  labels: [
    "Airdrop to OGN holders",
    "Future liquidity mining",
    "DAO reserve",
    "Airdrop to OUSD holders",
    "Early contributors",
    "Future contributors",
    "Prelaunch liquidity mining campaign",
  ],
  datasets: [
    {
      label: "4000000000",
      data: [
        1000000000, 1000000000, 750000000, 400000000, 400000000, 400000000,
        50000000,
      ],
      backgroundColor: [
        "#6222FD",
        "#5BC0EB",
        "#EF767A",
        "#66FE90",
        "#FFDC86",
        "#54414E",
        "#FF57F2",
      ],
      borderWidth: 0,
    },
  ],
};

const gradientStart = "#8C66FC";
const gradientEnd = "#0274F1";

// Should implement some sort of (background) refreshing mechanism, at least for
// the 24H data
const data_cache = {};

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
  const { chartRef, chartData: chartPriceData24H } = useChartGradient(
    priceData24H,
    gradientStart,
    gradientEnd
  );

  const width = useViewWidth();
  const smSize = 640;

  const [chartType, setChartType] = useState<ChartType>(ChartType.Price);
  const [chartTime, setChartTime] = useState<ChartTime>(ChartTime.ONE_DAY);

  const [totalSupplyHover, setTotalSupplyHover] = useState<boolean>(false);
  const [circSupplyHover, setCircSupplyHover] = useState<boolean>(false);

  const alterChartType = (type: ChartType) => {
    const { current: chart } = chartRef;

    if (!chart) return;

    const { labels, prices, marketCaps } = data_cache[chartTime];

    const newData = chartType === ChartType.Price ? marketCaps : prices;
    chart.data.datasets[0].data = newData;
    chart.data.labels = labels;
    // change label on chart
    chart.data.datasets[0].label =
      type === ChartType.Price ? "Price" : "Market Cap";

    chart.update();

    setChartType(type);
  };

  const alterChartTime = async (time: ChartTime) => {
    const { current: chart } = chartRef;

    if (!chart) return;

    const { labels, prices, marketCaps } = await getOGVData(time);

    const newData = chartType === ChartType.Price ? prices : marketCaps;
    chart.data.datasets[0].data = newData;
    chart.data.labels = labels;

    let { displayFormats } = (chart.options.scales.x as TimeScaleOptions).time;
    if (time === ChartTime.ONE_DAY) displayFormats.hour = "HH:mm";
    else {
      displayFormats.hour = "MM/dd";
      displayFormats.day = "MM/dd";
    }

    chart.update();

    setChartTime(time);
  };

  const calcualteCirculatingSupply = () => {
    const total = BigNumber.from(totalSupply);
    const nonCirculatingBalances = nonCirculatingSupply.map((e) =>
      BigNumber.from(e.balance)
    );
    const nonCirculatingTotal = nonCirculatingBalances.reduce((a, b) =>
      a.add(b)
    );
    return total.sub(nonCirculatingTotal);
  };

  useEffect(() => {
    data_cache[ChartTime.ONE_DAY] = {
      labels: priceData24H.labels,
      prices: priceData24H.datasets[0].data,
      marketCaps: marketCapData24H.datasets[0].data,
    };
  }, [priceData24H, marketCapData24H]);

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <Header mappedLinks={navLinks} webProperty="ousd" />

      {/* General OGV Price Stats */}
      <section className="bg-[#141519] px-8 md:px-16 lg:px-[8.375rem]">
        <div className="max-w-[89.5rem] mx-auto">
          <div className="flex">
            <Image
              src={assetRootPath("/images/ogv.svg")}
              width="100"
              height="100"
              className="ogv-logo"
              alt="OGV logo"
            />
            <h1 className="font-sansSailec font-bold text-3xl md:text-6xl w-1/2 ml-6 sm:ml-12">
              Origin Dollar Governance (OGV)
            </h1>
          </div>
          <ul className="list-disc text-white py-8 text-base md:text-2xl ml-6">
            <li className=" text-white py-1.5">
              OGV is the
              <span className="text-gradient2 font-bold px-1">governance</span>
              and value accrual token for OUSD.
            </li>
            <li>
              Stake to earn
              <span className="text-gradient2 font-bold px-1">115% APY</span>
            </li>
          </ul>

          <Button
            target="_blank"
            rel="noopener noreferrer"
            href="https://app.uniswap.org/#/swap?outputCurrency=0x9c354503C38481a7A7a51629142963F98eCC12D0&chain=mainnet"
            className="sm:mr-6 mb-3 block sm:inline text-center"
          >
            Buy OGV
          </Button>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://governance.ousd.com/stake"
          >
            <button className="rounded-full w-full sm:w-fit border-gradient1 text-base p-[1px] cursor-pointer text-center">
              <span className="block px-12 py-4 bg-[#141519] rounded-full">
                Stake OGV
              </span>
            </button>
          </a>

          <div className="border-2 border-gray-700 w-full mt-20 rounded-lg grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
            <div className="sm:border-r-2 border-b-2 xl:border-b-0 flex justify-center items-center border-gray-700 h-fit">
              <div className="py-8">
                <div className="text-lg text-[#b5beca] text-center sm:text-left">
                  Current Price
                </div>
                <div className="flex items-center">
                  <div className="text-2xl font-bold mr-1 text-center sm:text-left">
                    {`${currentPrice.toPrecision(4)}`}
                  </div>
                  <div
                    className={`${
                      change24H < 0 ? "bg-red-500" : "bg-green-500"
                    } px-1 py-1 rounded text-black font-bold text-xs h-fit`}
                  >
                    <Image
                      className={`${
                        change24H < 0 ? "rotate-180" : ""
                      } inline mr-1`}
                      src={assetRootPath("/images/polygon-1.svg")}
                      alt="Polygon"
                      width="10"
                      height="10"
                    />
                    {`${change24H.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })}%`}
                  </div>
                </div>
              </div>
            </div>
            <div className="xl:border-r-2 border-b-2 xl:border-b-0 flex justify-center items-center border-gray-700">
              <div className="py-8">
                <div className="text-lg text-[#b5beca] text-center sm:text-left">
                  Market Cap
                </div>
                <div className="text-2xl font-bold text-center sm:text-left">
                  $
                  {`${currentMarketCap.toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}`}
                </div>
              </div>
            </div>
            <div className="sm:border-r-2 border-b-2 sm:border-b-0 flex justify-center items-center border-gray-700">
              <div className="py-8">
                <div className="text-lg text-[#b5beca] text-center sm:text-left">
                  Circulating Supply
                  <div
                    className="relative hidden sm:inline"
                    onMouseOver={() => setCircSupplyHover(true)}
                    onMouseOut={() => setCircSupplyHover(false)}
                  >
                    {
                      <div
                        className={`${
                          circSupplyHover ? "visible" : "invisible"
                        } right-0 pl-2 top-0 translate-x-full translate-y-[-25%] absolute h-fit z-10`}
                      >
                        <div className="relative bg-[#272727] w-fit h-fit text-xs py-4 rounded-sm">
                          <span className="text-base text-white font-bold whitespace-nowrap mx-5 xl:mx-8 overflow-hidden">
                            Wallets excluded from circulating supply
                          </span>
                          <span className="block mt-2 mb-6 mx-8">
                            Circulating supply is calculated as the total supply
                            minus the OGN balances of the following wallets:
                          </span>
                          {nonCirculatingSupply
                            .filter((e) => e.balance !== "0")
                            .map((e, i) => (
                              <div
                                key={e.address}
                                className={`flex justify-between items-center py-3 px-8 ${
                                  i === 0 && "border-t-2"
                                } border-b-2 border-black`}
                              >
                                <div className="flex flex-col">
                                  <div className="text-[#fafbfb] text-base">
                                    {e.publicLabel}
                                  </div>
                                  <div className="mt-1 text-gradient2">
                                    {shortenAddress(e.address)}
                                  </div>
                                </div>
                                <div>
                                  <span className="text-base">
                                    {
                                      commify(formatEther(e.balance)).split(
                                        "."
                                      )[0]
                                    }
                                  </span>
                                  <span className="text-xs">{" OGV"}</span>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    }
                    <Image
                      className="ml-2 cursor-pointer inline"
                      src={assetRootPath("/images/info.svg")}
                      alt="Info"
                      width="20"
                      height="20"
                    />
                  </div>
                </div>
                <div className="text-2xl font-bold text-center sm:text-left">
                  {
                    commify(formatEther(calcualteCirculatingSupply())).split(
                      "."
                    )[0]
                  }
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <div className="py-8">
                <div className="text-lg text-[#b5beca] text-center sm:text-left">
                  Total Supply
                  <div
                    className="relative hidden sm:inline"
                    onMouseOver={() => setTotalSupplyHover(true)}
                    onMouseOut={() => setTotalSupplyHover(false)}
                  >
                    {
                      <div
                        className={`${
                          totalSupplyHover ? "visible" : "invisible"
                        } absolute h-fit left-0 top-0 translate-y-[-100%]`}
                      >
                        <div className="relative left-[-85%] xl:left-[-0.5rem] bg-[#272727] w-60 h-16 rounded-sm text-xs text-center p-2">
                          {`Total supply changes over time due to inflation and
                        tokens being burned. `}
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://docs.ousd.com/governance/ogv-staking#staking-rewards"
                            className="text-blue-700 cursor-pointer"
                          >
                            Learn more
                          </a>
                        </div>
                        <div className="relative left-2 triangle-down"></div>
                      </div>
                    }
                    <Image
                      className="ml-2 cursor-pointer inline"
                      src={assetRootPath("/images/info.svg")}
                      alt="Info"
                      width="20"
                      height="20"
                    />
                  </div>
                </div>
                <div className="text-2xl font-bold text-center sm:text-left">
                  {commify(formatEther(totalSupply)).split(".")[0]}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-20">
            <div className="flex justify-between">
              <div>
                <button
                  onClick={() => alterChartType(ChartType.Price)}
                  className={`${buttonCSS} ${
                    chartType === ChartType.Price
                      ? "bg-blue-700"
                      : "bg-zinc-800"
                  }`}
                >
                  Price
                </button>
                <button
                  onClick={() => alterChartType(ChartType.Market_Cap)}
                  className={`w-20 ${buttonCSS} ${
                    chartType === ChartType.Market_Cap
                      ? "bg-blue-700"
                      : "bg-zinc-800"
                  }`}
                >
                  Mkt Cap
                </button>
              </div>

              {width >= smSize && (
                <TimeButtons
                  chartTime={chartTime}
                  alterChartTime={alterChartTime}
                />
              )}
            </div>
          </div>

          <Line
            className="mt-10 mb-10 border-2 border-gray-700 rounded-lg"
            ref={chartRef}
            data={chartPriceData24H}
            options={lineOptions}
          />

          {width < smSize && (
            <TimeButtons
              chartTime={chartTime}
              alterChartTime={alterChartTime}
            />
          )}
        </div>
      </section>

      {/* OGV Staking */}
      <section className="bg-[#141519] px-8 md:px-16 lg:px-[8.375rem]">
        <div className="relative max-w-[89.5rem] h-fit mx-auto gradient3 rounded-lg overflow-hidden">
          <Image
            src={assetRootPath("/images/splines2.png")}
            width="500"
            height="500"
            className="absolute bottom-0 right-0 translate-x-1/3 sm:translate-x-0"
            alt="Splines"
          />
          <div className="flex justify-between items-center p-14 h-full">
            <div className="z-10 w-full">
              <h4 className="font-sansSailec font-bold text-3xl md:text-4xl lg:text-5xl">
                Stake OGV
              </h4>
              <h4 className="font-sansSailec font-bold text-3xl md:text-4xl lg:text-5xl text-gradient1">
                Earn 105% APY
              </h4>
              <p className="font-sansInter font-normal text-base md:text-lg mt-4 mb-8">
                Fees and voting rights accrue to OGV stakers. <br /> Control the
                future of OUSD and profit from its growth.
              </p>

              {width < smSize && <StakeBannerButtons />}
            </div>
            {width >= smSize && <StakeBannerButtons />}
          </div>
        </div>
      </section>

      {/* OGV Allocation Distribution */}
      <section className="bg-[#141519] px-8 md:px-16 lg:px-[8.375rem]">
        <div className="max-w-[89.5rem] mx-auto">
          <Typography.H3 className="mt-20">OGV Allocation</Typography.H3>
          <Typography.Body3 className="text-[#b5beca] mt-4">
            Initial allocation at launch
          </Typography.Body3>
          <div className="flex flex-col xl:flex-row items-center my-28 relative">
            <div className="h-80 w-80 sm:h-120 sm:w-120 mb-4 xl:mr-28">
              <Doughnut options={doughnutOptions} data={doughnutData} />
            </div>
            <div className="h-80 w-80 sm:h-120 sm:w-120 xl:mr-10 absolute flex justify-center items-center">
              <p className="font-bold text-xl sm:text-3xl">
                {utils.commify(doughnutData.datasets[0].label)}
              </p>
            </div>
            <div
              id="legend-container"
              className="inline-block w-80 sm:w-120"
            ></div>
          </div>
        </div>
      </section>

      {/* Listed on top exchanges */}
      <section className="bg-[#1e1f25] px-8 md:px-16 lg:px-[8.375rem]">
        <div className="w-full max-w-[89.5rem] flex flex-col items-center mx-auto">
          <Typography.H3 className="mt-28">
            Listed on top exchanges
          </Typography.H3>
          <div className="my-12 grid grid-cols-2 md:grid-cols-3 gap-3 w-full">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.kucoin.com/trade/OGV-USDT"
            >
              <div className="bg-[#141519] relative cursor-pointer flex justify-center items-center h-52 rounded-tl-3xl">
                <Image
                  src={assetRootPath("/images/kucoin.svg")}
                  width="200"
                  height="200"
                  className="mx-8 w-28 md:w-36 lg:w-48"
                  alt="Kucoin logo"
                />
              </div>
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.huobi.com/en-in/exchange/ogv_usdt"
            >
              <div className="bg-[#141519] cursor-pointer flex justify-center items-center h-52 rounded-tr-3xl md:rounded-none">
                <Image
                  src={assetRootPath("/images/huobi.svg")}
                  width="200"
                  height="200"
                  className="mx-8 w-28 md:w-36 lg:w-48"
                  alt="Huobi logo"
                />
              </div>
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.mexc.com/exchange/OGV_USDT"
            >
              <div className="bg-[#141519] cursor-pointer flex justify-center items-center h-52 rounded-none md:rounded-tr-3xl">
                <Image
                  src={assetRootPath("/images/mexc-global.svg")}
                  width="200"
                  height="200"
                  className="mx-8 w-28 md:w-36 lg:w-48"
                  alt="MEXC global logo"
                />
              </div>
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.gate.io/trade/OGV_USDT"
            >
              <div className="bg-[#141519] cursor-pointer flex justify-center items-center h-52 rounded-none md:rounded-bl-3xl">
                <Image
                  src={assetRootPath("/images/gate.io.svg")}
                  width="200"
                  height="200"
                  className="mx-8 w-28 md:w-36 lg:w-48"
                  alt="Gate.io logo"
                />
              </div>
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.uniswap.org/#/swap?outputCurrency=0x9c354503C38481a7A7a51629142963F98eCC12D0&chain=mainnet"
            >
              <div className="bg-[#141519] cursor-pointer flex justify-center items-center h-52 rounded-bl-3xl md:rounded-none">
                <Image
                  src={assetRootPath("/images/uniswap.svg")}
                  width="200"
                  height="200"
                  className="mx-8 w-28 md:w-36 lg:w-48"
                  alt="Uniswap logo"
                />
              </div>
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.bitget.com/spot/OGVUSDT_SPBL"
            >
              <div className="bg-[#141519] cursor-pointer flex justify-center items-center h-52 rounded-br-3xl">
                <Image
                  src={assetRootPath("/images/bitget.svg")}
                  width="200"
                  height="200"
                  className="mx-8 w-28 md:w-36 lg:w-48"
                  alt="Bitget logo"
                />
              </div>
            </a>
          </div>
          <div className="mb-28">
            <Button
              className="mb-4 md:mr-6 block md:inline"
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.coingecko.com/coins/origin-dollar-governance#markets"
            >
              View all on CoinGecko{" "}
              <Image
                src={assetRootPath("/images/coingecko-mono.svg")}
                width="25"
                height="25"
                className="inline ml-2 mr-2"
                alt="Kucoin logo"
              />
            </Button>
            <Button
              className="block md:inline"
              target="_blank"
              rel="noopener noreferrer"
              href="https://coinmarketcap.com/currencies/origin-dollar-governance/markets "
            >
              View all on CoinMarketCap
              <Image
                src={assetRootPath("/images/coinmarketcap.svg")}
                width="25"
                height="25"
                className="inline ml-2 mr-2"
                alt="Kucoin logo"
              />
            </Button>
          </div>
        </div>
      </section>

      {/* Always takes up width of full screen */}
      <Footer locale={null} />
    </>
  );
};

interface TimeButtonsProps {
  chartTime: ChartTime;
  alterChartTime: (chartTime: ChartTime) => void;
}

const StakeBannerButtons = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full md:w-fit z-10 sm:ml-12">
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://governance.ousd.com/stake"
        className="w-full flex justify-center"
      >
        <button className="rounded-full w-full sm:w-fit border-gradient1 text-sm sm:text-base p-[1px] cursor-pointer text-center mb-2">
          <span className="block px-12 md:px-16 py-4 bg-transparent rounded-full whitespace-nowrap">
            Stake OGV
          </span>
        </button>
      </a>
      <Button
        target="_blank"
        rel="noopener noreferrer"
        href="https://app.uniswap.org/#/swap?outputCurrency=0x9c354503C38481a7A7a51629142963F98eCC12D0&chain=mainnet"
        className="block sm:inline text-center text-sm sm:text-base w-full sm:w-[11rem] md:w-[13rem]"
      >
        Buy OGV
      </Button>
    </div>
  );
};

const TimeButtons = ({ chartTime, alterChartTime }: TimeButtonsProps) => {
  return (
    <div className="mb-24 sm:mb-0">
      <button
        onClick={() => alterChartTime(ChartTime.ONE_DAY)}
        className={`${buttonCSS} ${
          chartTime === ChartTime.ONE_DAY ? "bg-blue-700" : "bg-zinc-800"
        }`}
      >
        24H
      </button>
      <button
        onClick={() => alterChartTime(ChartTime.SEVEN_DAY)}
        className={`${buttonCSS} ${
          chartTime === ChartTime.SEVEN_DAY ? "bg-blue-700" : "bg-zinc-800"
        }`}
      >
        7D
      </button>
      <button
        onClick={() => alterChartTime(ChartTime.THIRTY_DAY)}
        className={`${buttonCSS} ${
          chartTime === ChartTime.THIRTY_DAY ? "bg-blue-700" : "bg-zinc-800"
        }`}
      >
        30D
      </button>
      <button
        onClick={() => alterChartTime(ChartTime.ONE_YEAR)}
        className={`${buttonCSS} ${
          chartTime === ChartTime.ONE_YEAR ? "bg-blue-700" : "bg-zinc-800"
        }`}
      >
        365D
      </button>
    </div>
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
    process.env.ETHEREUM_RPC_PROVIDER
  );
  const OGV = new ethers.Contract(
    "0x9c354503c38481a7a7a51629142963f98ecc12d0",
    ogvAbi,
    provider
  );

  let [navRes, rawData24H, currentPriceData, ...nonCirculatingBalances] =
    await Promise.all([
      navResPromise,
      rawData24HPromise,
      currentPriceDataPromise,
      ...nonCirculating.map((e) => OGV.balanceOf(e.address)),
    ]);

  const nonCirculatingSupply = nonCirculating.map((e, i) => ({
    ...e,
    balance: nonCirculatingBalances[i].toString(),
  }));

  currentPriceData = await currentPriceData.json();

  const { priceData24H, marketCapData24H } = get24HData(rawData24H);

  const navLinks: Link[] = transformLinks(navRes.data) as Link[];

  const totalSupply = ((await OGV.totalSupply()) as BigNumber).toString();

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
      totalSupply,
      doughnutData,
      nonCirculatingSupply,
    },
  };
};

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
        fill: false,
        tension: 0.2,
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
        tension: 0.2,
        pointRadius: 0,
      },
    ],
  };

  return { priceData24H, marketCapData24H };
};

const getOGVData = async (days: number) => {
  let labels;
  let prices;
  let marketCaps;

  if (data_cache[days]) return data_cache[days];

  const rawData = await fetchOGVPriceData(days);
  labels = rawData.prices.map((price: any) => price[0]);

  prices = rawData.prices.map((price: any) => price[1]);
  marketCaps = rawData.market_caps.map((price: any) => price[1]);

  data_cache[days] = { labels, prices, marketCaps };

  return { labels, prices, marketCaps };
};

const fetchOGVPriceData = async (
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

export default OgvDashboard;
