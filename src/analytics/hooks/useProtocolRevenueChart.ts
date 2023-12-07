import { useQuery } from 'react-query'
import { useMemo, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { barFormatting, filterByDuration, formatDisplay } from '../utils'

export const useProtocolRevenueChart = () => {
  const { data, isFetching } = useQuery(
    `/api/analytics/charts/protocolRevenue`,
    {
      initialData: {
        labels: [],
        datasets: [],
        error: null
      },
      refetchOnWindowFocus: false,
      keepPreviousData: true
    }
  )

  const [chartState, setChartState] = useState({
    duration: '6m',
    typeOf: '_7_day'
  })

  const barsToShow = ['revenue_daily', 'yield_daily']

  const baseData = useMemo(() => {
    if (data?.error) {
      return null
    }
    return {
      labels: data?.labels,
      datasets: data?.datasets?.reduce((acc, dataset) => {
        if (
          barsToShow.includes(dataset.id) ||
          !chartState?.typeOf ||
          dataset.id === chartState?.typeOf
        ) {
          acc.push({
            ...barFormatting,
            ...dataset,
            ...(dataset.type === 'line'
              ? {
                  type: 'line',
                  borderColor: '#D72FC6',
                  borderWidth: 2,
                  tension: 0,
                  borderJoinStyle: 'round',
                  pointRadius: 0,
                  pointHitRadius: 1
                }
              : {})
          })
        }
        return acc
      }, [])
    }
  }, [JSON.stringify(data), JSON.stringify(chartState?.typeOf)])

  const chartData = useMemo(() => {
    return baseData
      ? formatDisplay(filterByDuration(baseData, chartState?.duration))
      : null
  }, [JSON.stringify(baseData), chartState?.duration, chartState?.typeOf])

  const onChangeFilter = (value) => {
    setChartState((prev) => ({
      ...prev,
      ...value
    }))
  }

  return [
    {
      data: chartData,
      // @ts-ignore
      aggregations: data?.aggregations || {},
      filter: chartState,
      isFetching,
      chartOptions: {
        responsive: true,
        aspectRatio: isMobile ? 1 : 3,
        plugins: {
          title: {
            display: false
          },
          legend: {
            display: false,
            position: 'bottom'
          },
          tooltip: {
            enabled: true,
            boxPadding: 5,
            padding: 10,
            cornerRadius: 10,
            usePointStyle: true,
            borderColor: '#ffffffcc',
            borderWidth: 1,
            callbacks: {
              label: (context) =>
                `${context.dataset.label}: $${Number(
                  context.raw
                ).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}`
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
              callback: function (val) {
                return val === 0 ? null : this.getLabelForValue(val)
              }
            }
          }
        }
      }
    },
    { onChangeFilter }
  ]
}
