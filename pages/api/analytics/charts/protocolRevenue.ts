import { ethers } from 'ethers'
const formatEther = ethers.utils.formatEther

export const getProtocolRevenue = async () => {
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_SUBSQUID_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `query DailyFees {
          ousdDailyStats(orderBy: blockNumber_DESC) {
            id
            timestamp
            feesUSD
          }
        }`,
        variables: null,
        operationName: 'DailyFees'
      })
    })

    const json = await res.json()
    const dailyStats = json.data.ousdDailyStats.reverse()
    const today = dailyStats[dailyStats.length - 1]

    return {
      labels: dailyStats.map((d) => new Date(d.timestamp)),
      datasets: [
        {
          id: '_7_day',
          label: '7-day trailing avg',
          data: movingAverage(dailyStats, 7),
          type: 'line',
          backgroundColor: '#D72FC6'
        },
        {
          id: '_30_day',
          label: '30-day trailing avg',
          data: movingAverage(dailyStats, 30),
          type: 'line',
          backgroundColor: '#D72FC6'
        },
        {
          id: 'revenue_daily',
          label: 'Fees Collected',
          data: dailyStats.map((d) => formatEther(d.feesUSD)),
          backgroundColor: '#4B3C6D'
        }
      ],
      aggregations: {
        dailyRevenue: formatEther(today.feesUSD),
        weeklyRevenue: dailyStats
          .slice(dailyStats.length - 7, dailyStats.length)
          .reduce((m, o) => {
            return m + Number(formatEther(o.feesUSD))
          }, 0),
        allTimeRevenue: dailyStats.reduce((m, o) => {
          return m + Number(formatEther(o.feesUSD))
        }, 0)
      }
    }
  } catch (e) {
    console.error(e)
    throw e
  }
}

const getHandler = async (req, res) => {
  try {
    const data = await getProtocolRevenue()
    return res.json(data)
  } catch (error) {
    return res.status(500).json({
      error
    })
  }
}

const handler = async (req, res) => {
  const { method } = req
  switch (method) {
    case 'GET':
      return getHandler(req, res)
    default:
      res.setHeader('Allow', ['GET', 'OPTIONS'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

export default handler

interface FeeRecord {
  feesUSD: bigint
  fees7day?: number
  fees30day?: number
}

function movingAverage(fees: FeeRecord[], days: number): number[] {
  // Calculate the 7-day average for each element
  return fees.map((_, index, array) => {
    // Determine the start index for the 7-day range
    const start = Math.max(0, index - days - 1)
    // Slice the array to get the last 7 days (or fewer, if less than 7 days are available)
    const lastSevenDays = array.slice(start, index + 1)
    // Calculate the average
    const average =
      lastSevenDays.reduce(
        (sum, record) => sum + Number(formatEther(record.feesUSD)),
        0
      ) / lastSevenDays.length
    // Return a new object with the original fee and the calculated average
    return average
  })
}
