import { ChartData } from "chart.js";
import { BigNumber } from "ethers";
import { GetBlockByNumberResponse, GetStorageAtResponse } from "../types";

/* First `days` elements of rawStakingData are the staking balances, next `days`
 * elements are the total supplies, and final `days` elements are the timestamps
 * of the blocks those metric were measured in... all over the last `days` days.
 */
export const getStakingChartData = (rawStakingData: any[], days: number) => {
  const fullData = rawStakingData
    .slice(0, days)
    .map((d: GetStorageAtResponse, i: number) =>
      // Maintains two decimals of precision in the percentage
      {
        const amount = BigNumber.from(d.result);
        const percentage =
          amount
            .mul(10000)
            .div(
              BigNumber.from(
                // Getting total supplies
                (rawStakingData[i + days] as GetStorageAtResponse).result
              )
            )
            .toNumber() / 100;

        const time =
          BigNumber.from(
            rawStakingData[i + days * 2].result.timestamp
          ).toNumber() * 1000;

        return {
          time,
          amount: amount.div(BigNumber.from("1000000000000000000")).toNumber(),
          percentage,
        };
      }
    );

  const stakingData: ChartData<"line"> = {
    datasets: [
      {
        label: "Amount Staked",
        //@ts-ignore
        data: JSON.stringify(fullData),
        fill: false,
        tension: 0.4,
        pointRadius: 0,
        pointHitRadius: 7,
        pointHoverRadius: 7,
        pointHoverBorderWidth: 2,
        pointHoverBorderColor: "#000",
        pointHoverBackgroundColor: "#CF75D5",
        parsing: {
          xAxisKey: "time",
          yAxisKey: "amount",
        },
      },
    ],
  };

  return stakingData;
};

export default getStakingChartData;
