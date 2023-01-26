import "chartjs-adapter-date-fns";
import React, { useState, useEffect } from "react";
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
import { useChartGradient, useViewWidth, useOgv } from "../src/hooks";
import ogvAbi from "../src/constants/mainnetAbi/ogv.json";
import { ChartLine, DistributionLegend } from "../src/plugins";
import { BigNumber, ethers, providers, utils } from "ethers";
const { formatEther, commify } = utils;
import Link from "next/link";
import { shortenAddress } from "../src/utils/shortenAddress";
import { getRewardsApy } from "../src/utils/math";

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

const smSize = 640;

const buttonCSS =
  "w-20 md:w-24 h-10 sm:h-14 lg:w-26 text-sm py-4 mr-2 rounded-full flex items-center justify-center";
const sectionCSS = "px-4 sm:px-8 md:px-16 lg:px-[8.375rem]";

const lineOptions: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
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
        const chart = document.getElementById("ogv-price-chart");
        // Tooltip Element
        let tooltipEl = document.getElementById("ogv-price-tooltip");

        // Create element on first render
        if (!tooltipEl) {
          tooltipEl = document.createElement("div");
          tooltipEl.id = "ogv-price-tooltip";
          tooltipEl.innerHTML = "<table></table>";
          chart.appendChild(tooltipEl);
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
            '<div style="width: full; background: #141519; border-radius: 0.5rem 0.5rem 0 0; padding: .5rem .5rem 0 .5rem;" class="flex justify-between"> ';

          titleLines.forEach((title) => {
            innerHtml +=
              '<div style="font-family: Sailec; font-style: normal; font-weight: 400; font-size: 0.75rem; line-height: 1rem">' +
              title +
              "</div>";
          });
          innerHtml += "</div>";

          bodyLines.forEach((body) => {
            if (body[0].charAt(0) !== "$") body[0] = "$" + body[0];
            innerHtml +=
              '<div style="background: #141519; border-radius: 0 0 0.5rem 0.5rem; padding: .5rem; color: white; font-weight: 600;">' +
              body +
              "</div>";
          });

          innerHtml += "</div>";
          tooltipEl.innerHTML = innerHtml;
        }

        const position = context.chart.canvas.getBoundingClientRect();
        const width = tooltipModel.chart.width;

        // Display, position, and set styles for font
        tooltipEl.style.opacity = "1";
        tooltipEl.style.position = "absolute";
        if (tooltipModel.caretX <= width / 2)
          tooltipEl.style.left = tooltipModel.caretX + "px";
        else {
          tooltipEl.style.left = "auto";
          tooltipEl.style.right = width - tooltipModel.caretX + "px";
        }
        tooltipEl.style.top = tooltipModel.caretY + "px";

        tooltipEl.style.marginLeft = "0.5rem";
        tooltipEl.style.marginRight = "0.5rem";
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
        maxTicksLimit: 5,
        align: "start",
        maxRotation: 0,
        padding: 8,
        color: "#b5beca",
        font: () => {
          if (window.innerWidth < smSize)
            return {
              size: 12,
            };
          return {
            size: 16,
          };
        },
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
        count: 4,
        callback: function (val) {
          if (typeof val === "string") val = parseFloat(val);
          return "$" + commify(parseFloat(val.toPrecision(3)));
        },
        color: "#b5beca",
        font: () => {
          if (window.innerWidth < smSize)
            return {
              size: 12,
            };
          return {
            size: 18,
          };
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

  const [chartType, setChartType] = useState<ChartType>(ChartType.Price);
  const [chartTime, setChartTime] = useState<ChartTime>(ChartTime.ONE_DAY);

  const { totalVeSupply } = useOgv();
  const stakingApy =
    getRewardsApy(100 * 1.8 ** (48 / 12), 100, parseFloat(totalVeSupply)) || 0;

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

      {/* Heading */}
      <section className={`${sectionCSS} bg-origin-bg-black px-[24px] sm:px-0`}>
        <div className="max-w-[89.5rem] mx-auto">
          <div className="flex flex-col md:flex-row relative">
            <div className="relative w-[106px] h-[106px] lg:w-[120px] lg:h-[120px] xl:w-[160px] xl:h-[160px]">
              <div className="absolute w-full h-full z-10 rounded-full shadow-[0px_0px_50px_5px_#fafbfb1a]">
                <Image
                  src={assetRootPath("/images/ogv.svg")}
                  width="160"
                  height="160"
                  className="ogv-logo absolute z-10"
                  alt="OGV logo"
                />
              </div>
            </div>
            <h1 className="flex items-center font-sansSailec font-bold text-5xl lg:text-6xl xl:text-7xl mt-6 md:mt-0 md:ml-6 lg:ml-12">
              Origin Dollar <br /> Governance (OGV)
            </h1>
          </div>
          <div className="text-white py-8 text-base md:text-xl lg:text-2xl leading-6 lg:leading-8">
            <div className=" text-white mb-2 sm:mb-0 py-1.5">
              OGV is the
              <span className="text-gradient2 font-bold px-1">governance</span>
              and value accrual token for OUSD.
            </div>
            <div>
              Stake to earn
              <span className="text-gradient2 font-bold px-1">
                {stakingApy.toFixed(2)}% APY
              </span>
            </div>
          </div>

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
            className="box-border"
          >
            <button className="rounded-full w-full sm:w-fit box-border bg-gradient1 text-base p-[1px] cursor-pointer text-center">
              <div className="w-full sm:w-auto sm:px-12 py-[0.85rem] bg-origin-bg-black rounded-full box-border">
                Stake OGV
              </div>
            </button>
          </a>
        </div>
      </section>

      {/* General OGV Price Stats */}
      <section className={`${sectionCSS} bg-origin-bg-black`}>
        <div className="max-w-[89.5rem] mx-auto">
          <div className="border-2 border-gray-700 w-full mt-20 rounded-lg grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
            <div className="sm:border-r-2 border-b-2 xl:border-b-0 flex justify-center items-center border-gray-700 h-fit">
              <div className="py-8">
                <div className="text-base sm:text-xl text-subheading text-center sm:text-left">
                  Current Price
                </div>
                <div className="flex items-center">
                  <div className="text-lg md:text-[26px] 2xl:text-3x; font-bold mr-1 text-center sm:text-left">
                    {`$${currentPrice.toPrecision(4)}`}
                  </div>
                  <div
                    className={`${
                      change24H < 0 ? "bg-red-500" : "bg-[#66fe90]"
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
                <div className="text-base sm:text-xl text-subheading text-center sm:text-left">
                  Market Cap
                </div>
                <div className="text-lg md:text-[26px] 2xl:text-3x; font-bold text-center sm:text-left">
                  $
                  {`${currentMarketCap.toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}`}
                </div>
              </div>
            </div>
            <div className="sm:border-r-2 border-b-2 sm:border-b-0 flex justify-center items-center border-gray-700">
              <div className="py-8">
                <div className="text-base sm:text-xl relative text-subheading text-center sm:text-left">
                  Circulating Supply
                  <div className="sm:relative inline group">
                    <div
                      className={`
                         group-hover:visible group-active:visible invisible
                         sm:right-0 pl-0 sm:pl-2 left-1/2 sm:left-auto top-0 translate-x-[-50%] sm:translate-x-full translate-y-[-99.5%] sm:translate-y-[-25%] absolute h-fit z-10`}
                    >
                      <div className="relative bg-tooltip w-fit h-fit text-xs py-4 rounded-sm">
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
                                <div className="text-[#fafbfb] text-sm sm:text-base w-fit">
                                  {e.publicLabel}
                                </div>
                                <a
                                  href={`https://etherscan.io/address/${e.address}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <div className="mt-1 text-gradient2 w-fit">
                                    {shortenAddress(e.address)}
                                  </div>
                                </a>
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

                    <Image
                      className="ml-2 cursor-pointer inline"
                      src={assetRootPath("/images/info.svg")}
                      alt="Info"
                      width="20"
                      height="20"
                    />
                  </div>
                </div>
                <div className="text-lg md:text-[26px] 2xl:text-3x; font-bold text-center sm:text-left">
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
                <div className="text-base sm:text-xl relative text-subheading text-center sm:text-left">
                  Total Supply
                  <div className="sm:relative inline group">
                    <div
                      tabIndex={0}
                      className={`invisible group-hover:visible group-active:visible absolute h-fit left-1/2 translate-x-[-50%] sm:left-0 sm:translate-x-0 top-0 translate-y-[-95%]`}
                    >
                      <div className="relative sm:left-[-85%] xl:left-[-0.5rem] bg-tooltip w-60 h-16 rounded-sm text-xs text-center p-2 shadow-tooltip">
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
                      <div className="relative left-[50%] translate-x-[-50%] sm:left-2 sm:translate-x-0 triangle-down"></div>
                    </div>
                    <Image
                      className="ml-2 cursor-pointer inline"
                      src={assetRootPath("/images/info.svg")}
                      alt="Info"
                      width="20"
                      height="20"
                    />
                  </div>
                </div>
                <div className="text-lg md:text-[26px] 2xl:text-3x; font-bold text-center sm:text-left">
                  {commify(formatEther(totalSupply)).split(".")[0]}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OGV Price Chart */}
      <section className={`${sectionCSS} bg-origin-bg-black`}>
        <div className="max-w-[89.5rem] mx-auto">
          <div className="mt-20">
            <div className="flex justify-between">
              <div className="flex">
                <button
                  onClick={() => alterChartType(ChartType.Price)}
                  className={`${buttonCSS} ${
                    chartType === ChartType.Price
                      ? "bg-origin-blue/50 border border-origin-blue font-bold"
                      : "bg-origin-bg-grey border-2 border-origin-border"
                  }`}
                >
                  Price
                </button>
                <button
                  onClick={() => alterChartType(ChartType.Market_Cap)}
                  className={`w-28 md:w-32 ${buttonCSS} ${
                    chartType === ChartType.Market_Cap
                      ? "bg-origin-blue/50 border border-origin-blue font-bold"
                      : "bg-origin-bg-grey border-2 border-origin-border"
                  }`}
                >
                  Market Cap
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

          <div id="ogv-price-chart" className="relative">
            <Line
              className="my-6 border-2 border-origin-border rounded-lg !w-full !h-[120vw] !sm:h-[40vw] max-h-[30rem]"
              ref={chartRef}
              data={chartPriceData24H}
              options={lineOptions}
            />
          </div>

          {width < smSize && (
            <TimeButtons
              chartTime={chartTime}
              alterChartTime={alterChartTime}
            />
          )}
        </div>
      </section>

      {/* OGV Staking */}
      <section className={`${sectionCSS} bg-origin-bg-black`}>
        <div className="relative max-w-[89.5rem] h-fit mx-auto gradient3 rounded-2xl sm:rounded-lg overflow-hidden mt-28">
          <Image
            src={assetRootPath("/images/splines2.png")}
            width="500"
            height="500"
            className="absolute bottom-0 right-0 translate-x-1/3 sm:translate-x-0"
            alt="Splines"
          />
          <div className="flex justify-between items-center p-10 sm:p-14 h-full">
            <div className="z-10 w-full">
              <h4 className="font-sansSailec font-bold text-3xl md:text-4xl lg:text-5xl">
                Stake OGV
              </h4>
              <h4 className="font-sansSailec font-bold text-3xl md:text-4xl lg:text-5xl text-gradient1">
                Earn {stakingApy.toFixed(2)}% APY
              </h4>
              <p className="font-sansInter font-normal text-base md:text-lg mt-4 mb-1">
                Fees and voting rights accrue to OGV stakers.{" "}
              </p>
              <p className="font-sansInter font-normal text-base md:text-lg mb-8">
                Control the future of OUSD and profit from its growth.
              </p>

              {width < smSize && <StakeBannerButtons />}
            </div>
            {width >= smSize && <StakeBannerButtons />}
          </div>
        </div>
      </section>

      {/* OGV Allocation Distribution */}
      <section className={`${sectionCSS} bg-origin-bg-black`}>
        <div className="max-w-[89.5rem] mx-auto">
          <Typography.H1 className="text-3xl md:text-8xl mt-20 px-[24px] sm:px-0">
            OGV allocation
          </Typography.H1>
          <Typography.Body className="text-subheading mt-4 px-[24px] sm:px-0">
            Initial allocation at launch
          </Typography.Body>
          <div className="flex flex-col xl:flex-row items-center my-14 sm:my-28 relative">
            <div className="relative h-80 w-80 sm:h-120 sm:w-120 mb-4 xl:mr-28">
              <Doughnut options={doughnutOptions} data={doughnutData} />
              <p className="absolute font-bold text-xl sm:text-3xl top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]">
                {utils.commify(doughnutData.datasets[0].label)}
              </p>
            </div>
            <div className="h-80 w-80 sm:h-120 sm:w-120 xl:mr-10 absolute flex justify-center items-center"></div>
            <div id="legend-container" className="inline-block w-80 sm:w-120" />
          </div>
        </div>
      </section>

      {/* Listed on top exchanges */}
      <section className={`${sectionCSS} bg-origin-bg-grey`}>
        <div className="w-full max-w-[89.5rem] flex flex-col items-center mx-auto">
          <Typography.H3 className="md:text-6xl mt-28 px-[24px] sm:px-0 text-center">
            Listed on top exchanges
          </Typography.H3>
          <div className="my-12 grid grid-cols-2 md:grid-cols-3 gap-0.5 md:gap-3 w-full">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.kucoin.com/trade/OGV-USDT"
            >
              <div className="bg-origin-bg-black relative cursor-pointer flex justify-center items-center h-[88px] md:h-52 rounded-tl-lg md:rounded-tl-3xl hover:bg-hover">
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
              <div className="bg-origin-bg-black cursor-pointer flex justify-center items-center h-[88px] md:h-52 rounded-tr-lg md:rounded-none hover:bg-hover">
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
              <div className="bg-origin-bg-black cursor-pointer flex justify-center items-center h-[88px] md:h-52 rounded-none md:rounded-tr-3xl hover:bg-hover">
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
              <div className="bg-origin-bg-black cursor-pointer flex justify-center items-center h-[88px] md:h-52 rounded-none md:rounded-bl-3xl hover:bg-hover">
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
              <div className="bg-origin-bg-black cursor-pointer flex justify-center items-center h-[88px] md:h-52 rounded-bl-lg md:rounded-none hover:bg-hover">
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
              <div className="bg-origin-bg-black cursor-pointer flex justify-center items-center h-[88px] md:h-52 rounded-br-lg hover:bg-hover">
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
          <div className="mb-28 flex flex-col md:flex-row w-full md:w-auto">
            <Button
              className="mb-4 md:mr-6 flex items-center justify-center"
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
                alt="CoinGecko logo"
              />
            </Button>
            <Button
              className="mb-4 flex items-center justify-center"
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
                alt="CoinMarketCap logo"
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
        <button className="rounded-full w-full sm:w-fit bg-gradient1 text-sm sm:text-base p-[1px] cursor-pointer text-center mb-2">
          <span className="block px-12 md:px-16 py-4 bg-[#4c2d87] rounded-full whitespace-nowrap">
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
    <div className="mt-8 sm:mt-0 flex">
      <button
        onClick={() => alterChartTime(ChartTime.ONE_DAY)}
        className={`${buttonCSS} ${
          chartTime === ChartTime.ONE_DAY
            ? "bg-origin-blue/50 border border-origin-blue font-bold"
            : "bg-origin-bg-grey border-2 border-origin-border"
        }`}
      >
        24H
      </button>
      <button
        onClick={() => alterChartTime(ChartTime.SEVEN_DAY)}
        className={`${buttonCSS} ${
          chartTime === ChartTime.SEVEN_DAY
            ? "bg-origin-blue/50 border border-origin-blue font-bold"
            : "bg-origin-bg-grey border-2 border-origin-border"
        }`}
      >
        7D
      </button>
      <button
        onClick={() => alterChartTime(ChartTime.THIRTY_DAY)}
        className={`${buttonCSS} ${
          chartTime === ChartTime.THIRTY_DAY
            ? "bg-origin-blue/50 border border-origin-blue font-bold"
            : "bg-origin-bg-grey border-2 border-origin-border"
        }`}
      >
        30D
      </button>
      <button
        onClick={() => alterChartTime(ChartTime.ONE_YEAR)}
        className={`${buttonCSS} ${
          chartTime === ChartTime.ONE_YEAR
            ? "bg-origin-blue/50 border border-origin-blue font-bold"
            : "bg-origin-bg-grey border-2 border-origin-border"
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
