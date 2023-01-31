import React, { useState, useEffect } from "react";
import { Section, ChartButton } from "../components";
import { ChartTime, ChartType } from "../types";
import { gradientStart, gradientEnd, smSize } from "../constants";
import { fetchOGVPriceData } from "../utils";
import { useChartGradient } from "../../../src/hooks";
import { ChartData, TimeScaleOptions } from "chart.js";
import { Line } from "react-chartjs-2";
import { lineOptions } from "../chart-configs";

export interface OgvPriceChartProps {
  priceData24H: ChartData<"line">;
  marketCapData24H: ChartData<"line">;
  width: number;
}

const ogvPriceCache = {}; //on client

const OgvPriceChart = ({
  priceData24H,
  marketCapData24H,
  width,
}: OgvPriceChartProps) => {
  const { chartRef, chartData: chartPriceData24H } = useChartGradient(
    priceData24H,
    gradientStart,
    gradientEnd
  );
  const [chartType, setChartType] = useState<ChartType>(ChartType.Price);
  const [chartTime, setChartTime] = useState<ChartTime>(ChartTime.ONE_DAY);

  const alterChartType = (type: ChartType) => {
    const { current: chart } = chartRef;

    if (!chart) return;

    const { labels, prices, marketCaps } = ogvPriceCache[chartTime];

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

  useEffect(() => {
    ogvPriceCache[ChartTime.ONE_DAY] = {
      labels: priceData24H.labels,
      prices: priceData24H.datasets[0].data,
      marketCaps: marketCapData24H.datasets[0].data,
    };
  }, [priceData24H, marketCapData24H]);

  return (
    <Section className="bg-origin-bg-black">
      <div className="mt-20">
        <div className="flex justify-between">
          <div className="flex">
            <ChartButton
              onClick={() => alterChartType(ChartType.Price)}
              selectCondition={chartType === ChartType.Price}
            >
              Price
            </ChartButton>
            <ChartButton
              onClick={() => alterChartType(ChartType.Market_Cap)}
              className={`w-28 md:w-32 `}
              selectCondition={chartType === ChartType.Market_Cap}
            >
              Market Cap
            </ChartButton>
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
        <TimeButtons chartTime={chartTime} alterChartTime={alterChartTime} />
      )}
    </Section>
  );
};

interface TimeButtonsProps {
  chartTime: ChartTime;
  alterChartTime: (chartTime: ChartTime) => void;
}

const TimeButtons = ({ chartTime, alterChartTime }: TimeButtonsProps) => {
  return (
    <div className="mt-8 sm:mt-0 flex">
      <ChartButton
        onClick={() => alterChartTime(ChartTime.ONE_DAY)}
        selectCondition={chartTime === ChartTime.ONE_DAY}
      >
        24H
      </ChartButton>
      <ChartButton
        onClick={() => alterChartTime(ChartTime.SEVEN_DAY)}
        selectCondition={chartTime === ChartTime.SEVEN_DAY}
      >
        7D
      </ChartButton>
      <ChartButton
        onClick={() => alterChartTime(ChartTime.THIRTY_DAY)}
        selectCondition={chartTime === ChartTime.THIRTY_DAY}
      >
        30D
      </ChartButton>
      <ChartButton
        onClick={() => alterChartTime(ChartTime.ONE_YEAR)}
        selectCondition={chartTime === ChartTime.ONE_YEAR}
      >
        365D
      </ChartButton>
    </div>
  );
};

const getOGVData = async (days: number) => {
  let labels;
  let prices;
  let marketCaps;

  if (ogvPriceCache[days]) return ogvPriceCache[days];

  const rawData = await fetchOGVPriceData(days);
  labels = rawData.prices.map((price: any) => price[0]);

  prices = rawData.prices.map((price: any) => price[1]);
  marketCaps = rawData.market_caps.map((price: any) => price[1]);

  ogvPriceCache[days] = { labels, prices, marketCaps };

  return { labels, prices, marketCaps };
};
export default OgvPriceChart;
