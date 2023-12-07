import React from 'react'
import { last } from 'lodash'
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  LineElement,
  TimeScale,
  Title,
  Tooltip,
  Filler,
  Legend,
  PointElement
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { Typography } from '@originprotocol/origin-storybook'
import { useProtocolRevenueChart } from '../hooks/useProtocolRevenueChart'
import LayoutBox from '../../components/LayoutBox'
import DurationFilter from './DurationFilter'
import MovingAverageFilter from './MovingAverageFilter'
// import Tooltip2 from "../proof-of-yield/Tooltip";

ChartJS.register(
  CategoryScale,
  TimeScale,
  LinearScale,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  PointElement
)

const ProtocolChart = () => {
  const [{ data, filter, chartOptions, isFetching }, { onChangeFilter }] =
    useProtocolRevenueChart()

  return data ? (
    <LayoutBox
      loadingClassName="flex items-center justify-center h-[350px] w-full"
      isLoading={isFetching}
    >
      <div className="flex flex-col sm:flex-row items-start gap-2 justify-between w-full p-4 md:p-6">
        <div className="flex flex-col w-full h-full">
          <div className="flex items-center gap-2">
            <Typography.Caption className="text-subheading text-base">
              Daily Protocol Revenue From OUSD
            </Typography.Caption>
            {/* <Tooltip2 info="20% of OETH's yield is collected as a performance fee." /> */}
          </div>
          <div className="flex flex-col space-y-2">
            <Typography.H4 className="mt-3">
              {`$${Number(last(data?.datasets?.[1]?.data)).toLocaleString(
                undefined,
                { minimumFractionDigits: 2, maximumFractionDigits: 2 }
              )}`}
            </Typography.H4>
            <div className="flex flex-col">
              <div className="flex flex-row items-center space-x-2">
                <div
                  className="w-[6px] h-[6px] rounded-full"
                  style={{
                    backgroundColor: data?.datasets?.[0]?.backgroundColor
                  }}
                />
                <Typography.Caption className="text-subheading text-xs">
                  Moving average
                </Typography.Caption>
                <Typography.Caption className="text-xs">
                  {`$${Number(last(data?.datasets?.[0]?.data)).toLocaleString(
                    undefined,
                    { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                  )}`}
                </Typography.Caption>
              </div>
            </div>
            <Typography.Caption className="text-subheading">
              {last(data?.labels)}
            </Typography.Caption>
          </div>
        </div>
        <div className="flex sm:flex-col items-center sm:items-end gap-2">
          <DurationFilter
            value={filter?.duration}
            onChange={(duration) => {
              onChangeFilter({
                duration: duration || 'all'
              })
            }}
          />
          <div className="flex justify-end">
            <MovingAverageFilter
              value={filter?.typeOf}
              onChange={(typeOf) => {
                onChangeFilter({
                  typeOf: typeOf
                })
              }}
            />
          </div>
        </div>
      </div>
      <div className="sm:mr-6">
        {/* @ts-ignore */}
        <Bar options={chartOptions} data={data} />
      </div>
    </LayoutBox>
  ) : null
}

export default ProtocolChart
