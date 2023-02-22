import React from "react";
import Gradient2Button from "./Gradient2Button";
import { Typography } from "@originprotocol/origin-storybook";
import { commify } from "ethers/lib/utils";
import { twMerge } from "tailwind-merge";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  Tooltip,
  TimeScale,
  BarElement,
  ChartData,
} from "chart.js";
import { barOptions } from "../chart-configs";
import { tailwindConfig } from "../../utils";

ChartJS.register(CategoryScale, TimeScale, BarElement, Tooltip);

const colors = tailwindConfig.theme.colors;

interface DripperGraphProps {
  setTime?: boolean;
  extraData?: {
    title: string;
    value: string;
  }[];
  className?: string;
  bgClassName?: string;
}

enum ChartTime {
  SEVEN_DAY = 7,
  THIRTY_DAY = 30,
  ONE_YEAR = 365,
}

const dataX = [];
const dataY = [];

for (let i = 0; i < 30; i++) {
  dataX.push(i);
  dataY.push(((Math.random() * 100000) % 8) + 20);
}

const DripperGraph = ({
  setTime = true,
  extraData,
  className,
  bgClassName,
}: DripperGraphProps) => {
  const [chartTime, setChartTime] = React.useState<ChartTime>(
    ChartTime.SEVEN_DAY
  );

  const chartData: ChartData<"bar"> = {
    labels: dataX,
    datasets: [
      {
        label: "Yield Earned",
        data: dataY,
        backgroundColor: colors["origin-bg-black"],
        borderColor: colors["origin-blue"],
        borderWidth: 2,
        borderRadius: 100,
        borderSkipped: false,
        hoverBackgroundColor: colors["origin-blue"],
      },
    ],
  };

  if (bgClassName)
    chartData.datasets[0].backgroundColor = colors[bgClassName.substring(3)];

  return (
    <div
      className={twMerge(
        "bg-origin-bg-black rounded-lg w-[825px] relative mx-auto",
        className,
        bgClassName
      )}
    >
      {/* Yield In/Out Basic Data */}
      <div className="p-6 flex justify-between">
        <div>
          <Typography.Body>Yield earned</Typography.Body>
          <Typography.Body3 className="text-sm mt-2">
            Jan 29 2024
          </Typography.Body3>
          <Typography.H7 className="inline mr-2">
            ${commify(2500.36)}
          </Typography.H7>
          {extraData?.map((data, i) => (
            // Static Array
            <div key={i} className="inline mr-3">
              <Typography.Body3 className="text-sm inline mr-1">
                {data.value}
              </Typography.Body3>
              <Typography.Body3 className="text-sm text-table-title inline">
                {data.title}
              </Typography.Body3>
            </div>
          ))}
        </div>
        {setTime && (
          <div className="p-2 flex">
            <Gradient2Button
              onClick={() => setChartTime(ChartTime.SEVEN_DAY)}
              outerDivClassName={`rounded-lg ${
                chartTime === ChartTime.SEVEN_DAY
                  ? "bg-gradient2"
                  : twMerge("bg-origin-bg-black", bgClassName)
              } mr-2`}
              className={`rounded-lg px-7 py-3 ${
                chartTime === ChartTime.SEVEN_DAY
                  ? "bg-[#1b1a1abb]"
                  : twMerge("bg-origin-bg-black", bgClassName)
              }`}
            >
              7D
            </Gradient2Button>

            <Gradient2Button
              onClick={() => setChartTime(ChartTime.THIRTY_DAY)}
              outerDivClassName={`rounded-lg ${
                chartTime === ChartTime.THIRTY_DAY
                  ? "bg-gradient2"
                  : twMerge("bg-origin-bg-black", bgClassName)
              } mr-2`}
              className={`rounded-lg px-7 py-3 ${
                chartTime === ChartTime.THIRTY_DAY
                  ? "bg-[#1b1a1abb]"
                  : twMerge("bg-origin-bg-black", bgClassName)
              }`}
            >
              30D
            </Gradient2Button>
            <Gradient2Button
              onClick={() => setChartTime(ChartTime.ONE_YEAR)}
              outerDivClassName={`rounded-lg ${
                chartTime === ChartTime.ONE_YEAR
                  ? "bg-gradient2"
                  : twMerge("bg-origin-bg-black", bgClassName)
              } mr-2`}
              className={`rounded-lg px-7 py-3 ${
                chartTime === ChartTime.ONE_YEAR
                  ? "bg-[#1b1a1abb]"
                  : twMerge("bg-origin-bg-black", bgClassName)
              }`}
            >
              365D
            </Gradient2Button>
          </div>
        )}
      </div>

      {/* Yield In/Out Chart */}
      <div className="h-[215px]">
        <Bar data={chartData} options={barOptions} />
      </div>
    </div>
  );
};

export default DripperGraph;
