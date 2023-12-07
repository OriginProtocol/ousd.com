import React, { useState, useEffect } from 'react'
import { Section } from '../../components'
import { ChartButton } from '../components'
import { smSize } from '../../constants'
import { Chart } from 'react-chartjs-2'
import { ethers } from 'ethers'

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
  TooltipLabelStyle
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  TimeScale,
  LinearScale,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Filler,
  Legend
)

interface ProtocolRevenueProps {
  width: number
}

const ProtocolRevenue = ({ width }: ProtocolRevenueProps) => {
  const [rawData, setRawData] = useState(null)
  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_SUBSQUID_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `query ProtocolRevenue {
          currentOusd: ousdDailyStats(orderBy: blockNumber_DESC, limit: 1) {
            feesUSDAllTime
            feesETHAllTime
            id
          }
          currentOeth: oethDailyStats(orderBy: blockNumber_DESC, limit: 1) {
            feesUSDAllTime
            feesETHAllTime
            id
          }
          oethDailyStats(orderBy: blockNumber_DESC) {
            feesUSD
            feesETH
            id
          }
          ousdDailyStats(orderBy: blockNumber_DESC) {
            feesUSD
            feesETH
            id
          }
        }`,
        variables: null,
        operationName: 'ProtocolRevenue'
      })
    })
      .then((res) => res.json())
      .then((json) => {
        json.data.ousdDailyStats.reverse()
        setRawData(json.data)
      })
  }, [])

  const [chartType, setChartType] = useState('eth')
  const [chartTime, setChartTime] = useState('6m')
  const convertedData = getData(
    rawData,
    chartType === 'eth' ? 'feesETH' : 'feesUSD',
    chartTime
  )

  const allTimeField = chartType === 'eth' ? 'feesETHAllTime' : 'feesUSDAllTime'
  const oethRevenueRaw = rawData?.currentOeth?.[0]?.[allTimeField]
  const oethRevenue = oethRevenueRaw
    ? Number(ethers.utils.formatEther(oethRevenueRaw))
    : 0
  const ousdRevenueRaw = rawData?.currentOusd?.[0]?.[allTimeField]
  const ousdRevenue = oethRevenueRaw
    ? Number(ethers.utils.formatEther(ousdRevenueRaw))
    : 0
  const totalRevenue = oethRevenue + ousdRevenue
  const localFormatConfig = {
    minimumFractionDigits: chartType === 'usd' ? 2 : 0,
    maximumFractionDigits: chartType === 'usd' ? 2 : 4
  }

  return (
    <Section className="bg-origin-bg-black">
      <div className="text-5xl font-bold mt-20 mb-4">Protocol Revenue</div>
      <div className="text-gray-300 max-w-4xl">
        This chart displays the cumulative and daily revenue of Origin DeFi over
        time, derived from OUSD and OETH performance fees. Use the toggle to
        view the revenue in either ETH or USD
      </div>
      <div className="border-2 radius-2xl border-origin-border mt-8 grid grid-cols-1 sm:grid-cols-3 max-w-4xl">
        <div className="flex items-center justify-center py-6 border-b-2 sm:border-b-0 sm:border-r-2 border-origin-border">
          <div>
            <div className="text-gray-400">Total protocol revenue</div>
            <div className="text-2xl font-bold">
              {`${chartType === 'eth' ? 'Ξ ' : '$'}`}
              {totalRevenue.toLocaleString(undefined, localFormatConfig)}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center py-6 border-b-2 sm:border-b-0 sm:border-r-2 border-origin-border">
          <div>
            <div className="text-gray-400">OUSD protocol revenue</div>
            <div className="text-2xl font-bold">
              {`${chartType === 'eth' ? 'Ξ ' : '$'}`}
              {ousdRevenue.toLocaleString(undefined, localFormatConfig)}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center py-6">
          <div>
            <div className="text-gray-400">OETH protocol revenue</div>
            <div className="text-2xl font-bold">
              {`${chartType === 'eth' ? 'Ξ ' : '$'}`}
              {oethRevenue.toLocaleString(undefined, localFormatConfig)}
            </div>
          </div>
        </div>
      </div>
      <div className="text-2xl font-medium mt-20 mb-4">
        Daily Protocol Revenue
      </div>
      <div className="flex justify-between">
        <div className="flex">
          <ChartButton
            onClick={() => setChartType('eth')}
            selectCondition={chartType === 'eth'}
          >
            ETH
          </ChartButton>
          <ChartButton
            onClick={() => setChartType('usd')}
            selectCondition={chartType === 'usd'}
          >
            USD
          </ChartButton>
        </div>

        {width >= smSize && (
          <TimeButtons chartTime={chartTime} alterChartTime={setChartTime} />
        )}
      </div>

      <Chart
        className="my-6 border-2 border-origin-border rounded-lg !w-full !h-[120vw] sm:!h-[40vw] max-h-[30rem]"
        type="bar"
        data={{
          labels: convertedData.labels,
          datasets: [
            {
              backgroundColor: '#4AFFBE',
              label: '7 day MA',
              data: convertedData.totalMA,
              type: 'line',
              borderColor: '#4AFFBE',
              borderWidth: 2,
              tension: 0,
              borderJoinStyle: 'round',
              pointRadius: 0,
              pointHitRadius: 1
            },
            {
              backgroundColor: '#282A32',
              hoverBackgroundColor: '#6222FD',
              label: 'OUSD Revenue',
              data: convertedData.ousdData
            },
            {
              backgroundColor: '#4E5967',
              hoverBackgroundColor: '#4AD4FF',
              label: 'OETH Revenue',
              data: convertedData.oethData
            },
            {
              backgroundColor: '#4E5967',
              label: 'Sum',
              hidden: true,
              data: convertedData.oethData.map(
                (d, i) => d + convertedData.ousdData[i]
              )
            }
          ]
        }}
        options={{
          responsive: true,
          aspectRatio: 3,
          layout: {
            padding: {
              top: 30,
              right: 7,
              bottom: 7
            }
          },
          plugins: {
            title: {
              display: false
            },
            legend: {
              display: false,
              position: 'bottom'
            },
            // tooltip: {
            //   enabled: false,
            //   position: 'average',
            //   external: function (context) {
            //     const { tooltip } = context
            //     // Tooltip Element
            //     let tooltipEl = tooltipRef.current

            //     // Hide if no tooltip
            //     const tooltipModel = context.tooltip
            //     console.log({ tooltipModel })
            //     if (tooltipModel.opacity === 0) {
            //       setTooltipStyle({ opacity: 0 })
            //       return
            //     }

            //     function getBody(bodyItem) {
            //       return bodyItem.lines
            //     }

            //     // Set Text
            //     if (tooltipModel.body) {
            //       const titleLines = tooltipModel.title || []
            //       const bodyLines = tooltipModel.body.map(getBody)

            //       let innerHtml = '<thead>'

            //       titleLines.forEach(function (title) {
            //         innerHtml += '<tr><th>' + title + '</th></tr>'
            //       })
            //       innerHtml += '</thead><tbody>'

            //       bodyLines.forEach(function (body, i) {
            //         const colors = tooltipModel.labelColors[i]
            //         let style = 'background:' + colors.backgroundColor
            //         style += '; border-color:' + colors.borderColor
            //         style += '; border-width: 2px'
            //         const span =
            //           '<span style="' + style + '">' + body + '</span>'
            //         innerHtml += '<tr><td>' + span + '</td></tr>'
            //       })
            //       innerHtml += '</tbody>'

            //       let tableRoot = tooltipEl.querySelector('table')
            //       tableRoot.innerHTML = innerHtml
            //     }
            //     const { offsetLeft: positionX, offsetTop: positionY } =
            //       context.chart.canvas

            //     const position = context.chart.canvas.getBoundingClientRect()

            //     let left = 0
            //     tooltipEl.style.opacity = 1
            //     if (tooltip.caretX + 210 > position.width) {
            //       left = tooltip.caretX - 210
            //     } else {
            //       left = positionX + tooltip.caretX + 10
            //     }

            //     setTooltipStyle({
            //       opacity: 1,
            //       left,
            //       top: positionY + 200
            //     })
            //   }
            // }
            tooltip: {
              enabled: true,
              boxPadding: 5,
              padding: 10,
              cornerRadius: 10,
              usePointStyle: true,
              borderColor: '#ffffffcc',
              borderWidth: 1,
              callbacks: {
                title: (context) => context[0].label,
                labelColor: (context) => {
                  return {
                    backgroundColor:
                      context.dataset.hoverBackgroundColor ||
                      context.dataset.backgroundColor,
                    borderColor:
                      context.dataset.hoverBackgroundColor ||
                      context.dataset.backgroundColor
                  } as TooltipLabelStyle
                },
                afterTitle: (context) => {
                  return `${
                    chartType === 'eth' ? 'Ξ' : '$'
                  }${convertedData.total[context[0].dataIndex].toLocaleString(
                    undefined,
                    localFormatConfig
                  )}`
                },
                label: (context) =>
                  `${context.dataset.label}: ${
                    chartType === 'eth' ? 'Ξ' : '$'
                  }${(context.raw as number).toLocaleString(
                    undefined,
                    localFormatConfig
                  )}`
              }
            }
          },
          interaction: {
            mode: 'nearest',
            intersect: false,
            axis: 'x'
          },
          scales: {
            x: {
              stacked: true,
              border: {
                color: '#4d505e',
                width: 0.5
              },
              grid: {
                display: false
              },
              ticks: {
                color: '#828699',
                autoSkip: true,
                maxRotation: 0,
                minRotation: 0,
                maxTicksLimit: 10,
                padding: 10
              }
            },
            y: {
              stacked: true,
              border: {
                display: false,
                dash: [2, 4],
                dashOffset: 1
              },
              grid: {
                color: '#4d505e',
                lineWidth: 0.5
              },
              beginAtZero: true,
              position: 'right',
              ticks: {
                color: '#828699',
                padding: 10,
                callback: (value) => {
                  if (chartType === 'eth') {
                    return `Ξ ${value.toLocaleString(undefined, {
                      minimumFractionDigits: 1,
                      maximumFractionDigits: 1
                    })}`
                  }
                  return `$${value.toLocaleString()}`
                }
              }
            }
          }
        }}
      />

      {width < smSize && (
        <TimeButtons chartTime={chartTime} alterChartTime={setChartTime} />
      )}
    </Section>
  )
}

interface TimeButtonsProps {
  chartTime: string
  alterChartTime: (chartTime: string) => void
}

const TimeButtons = ({ chartTime, alterChartTime }: TimeButtonsProps) => {
  return (
    <div className="mt-8 sm:mt-0 flex">
      <ChartButton
        onClick={() => alterChartTime('1m')}
        selectCondition={chartTime === '1m'}
      >
        30 Days
      </ChartButton>
      <ChartButton
        onClick={() => alterChartTime('6m')}
        selectCondition={chartTime === '6m'}
      >
        6 Months
      </ChartButton>
      <ChartButton
        onClick={() => alterChartTime('1y')}
        selectCondition={chartTime === '1y'}
      >
        1 Year
      </ChartButton>
      <ChartButton
        onClick={() => alterChartTime('all')}
        selectCondition={chartTime === 'all'}
      >
        All Time
      </ChartButton>
    </div>
  )
}

export default ProtocolRevenue

function formatDate(dateString) {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ]

  const date = new Date(dateString)
  const day = date.getDate()
  const monthIndex = date.getMonth()

  const suffix = ['th', 'st', 'nd', 'rd'][
    day % 10 > 3 ? 0 : day === 11 || day === 12 || day === 13 ? 0 : day % 10
  ]

  return `${months[monthIndex]} ${day}${suffix}`
}

function movingAverage(fees, days) {
  // Calculate the 7-day average for each element
  return fees.map((_, index, array) => {
    // Determine the start index for the 7-day range
    const start = Math.max(0, index - days - 1)
    // Slice the array to get the last 7 days (or fewer, if less than 7 days are available)
    const lastSevenDays = array.slice(start, index + 1)
    // Calculate the average
    const average =
      lastSevenDays.reduce((sum, o) => sum + o, 0) / lastSevenDays.length
    // Return a new object with the original fee and the calculated average
    return average
  })
}

function getData(data, feesField, chartTime) {
  const labels = []
  const oethData = []
  const ousdData = []
  let total = []
  let totalMA = []
  for (const ousdRow of data?.ousdDailyStats || []) {
    const timestamp = new Date(ousdRow.id)
    if (
      chartTime === '1m' &&
      timestamp < new Date(Date.now() - 1000 * 60 * 60 * 24 * 30)
    ) {
      continue
    } else if (
      chartTime === '6m' &&
      timestamp < new Date(Date.now() - 1000 * 60 * 60 * 24 * 30 * 6)
    ) {
      continue
    } else if (
      chartTime === '1y' &&
      timestamp < new Date(Date.now() - 1000 * 60 * 60 * 24 * 365)
    ) {
      continue
    }

    labels.push(formatDate(ousdRow.id))

    const oethRow = data.oethDailyStats.find((d) => d.id === ousdRow.id)
    let oethNum = 0
    if (oethRow?.[feesField]) {
      oethNum = Number(ethers.utils.formatEther(oethRow[feesField]))
    }
    oethData.push(oethNum)

    let ousdNum = 0
    if (ousdRow[feesField]) {
      ousdNum = Number(ethers.utils.formatEther(ousdRow[feesField]))
    }
    ousdData.push(ousdNum)

    total.push(oethNum + ousdNum)
  }
  totalMA = movingAverage(total, 7)

  return { labels, oethData, ousdData, total, totalMA }
}
