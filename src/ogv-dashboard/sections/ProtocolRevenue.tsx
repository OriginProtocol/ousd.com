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
  Legend
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
  const [chartType, setChartType] = useState('eth')
  const [chartTime, setChartTime] = useState('6m')
  const convertedData = getData(
    rawData,
    chartType === 'eth' ? 'feesETH' : 'feesUSD',
    chartTime
  )

  return (
    <Section className="bg-origin-bg-black">
      <div className="mt-20">
        <div className="text-2xl font-medium mb-4">Daily Protocol Revenue</div>
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
      </div>

      <div id="ogv-price-chart" className="relative">
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
                label: 'OUSD Revenue',
                data: convertedData.ousdData
              },
              {
                backgroundColor: '#4E5967',
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
                usePointStyle: true,
                callbacks: {
                  title: (context) => context[0].label,
                  afterTitle: (context) => {
                    return `${
                      chartType === 'eth' ? 'Ξ' : '$'
                    }${convertedData.total[context[0].dataIndex].toLocaleString(
                      undefined,
                      { maximumFractionDigits: chartType === 'usd' ? 2 : 4 }
                    )}`
                  },
                  label: (context) =>
                    `${context.dataset.label}: ${
                      chartType === 'eth' ? 'Ξ' : '$'
                    }${(context.raw as number).toLocaleString(undefined, {
                      maximumFractionDigits: chartType === 'usd' ? 2 : 4
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
                  maxRotation: 45,
                  minRotation: 0,
                  padding: 20
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
      </div>

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
  for (const ousdRow of data.data.ousdDailyStats) {
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

    const oethRow = data.data.oethDailyStats.find((d) => d.id === ousdRow.id)
    let oethNum = 0
    if (oethRow) {
      oethNum = Number(ethers.utils.formatEther(oethRow[feesField]))
    }
    oethData.push(oethNum)

    const ousdNum = Number(ethers.utils.formatEther(ousdRow[feesField]))
    ousdData.push(ousdNum)

    total.push(oethNum + ousdNum)
  }
  totalMA = movingAverage(total, 7)

  return { labels, oethData, ousdData, total, totalMA }
}

const rawData = {
  data: {
    oethDailyStats: [
      {
        feesETH: '912867769429942709',
        feesUSD: '2073791380016507325173',
        id: '2023-12-06'
      },
      {
        feesETH: '995631302226164321',
        feesUSD: '2219653754453285821936',
        id: '2023-12-05'
      },
      {
        feesETH: '914878469924418456',
        feesUSD: '2062227559056631641669',
        id: '2023-12-04'
      },
      {
        feesETH: '971068012140632373',
        feesUSD: '2095934455791706599678',
        id: '2023-12-03'
      },
      {
        feesETH: '953555936741919694',
        feesUSD: '2005791458262360647842',
        id: '2023-12-02'
      },
      {
        feesETH: '992842116902388827',
        feesUSD: '2076787426451740852765',
        id: '2023-12-01'
      },
      {
        feesETH: '923907384586348619',
        feesUSD: '1879785940252860775275',
        id: '2023-11-30'
      },
      {
        feesETH: '1001374475844523867',
        feesUSD: '2066501457693689345992',
        id: '2023-11-29'
      },
      {
        feesETH: '882881635455976698',
        feesUSD: '1776372492564304907057',
        id: '2023-11-28'
      },
      {
        feesETH: '932155914473562166',
        feesUSD: '1908177251249438494022',
        id: '2023-11-27'
      },
      {
        feesETH: '846148690158949630',
        feesUSD: '1765947613420491910787',
        id: '2023-11-26'
      },
      {
        feesETH: '977438220011565752',
        feesUSD: '2037851854726667328783',
        id: '2023-11-25'
      },
      {
        feesETH: '885080694236194860',
        feesUSD: '1831735906673899765084',
        id: '2023-11-24'
      },
      {
        feesETH: '733360610718723245',
        feesUSD: '1511935675191364294828',
        id: '2023-11-23'
      },
      {
        feesETH: '1489527053077000213',
        feesUSD: '2968283679047080940495',
        id: '2023-11-22'
      },
      {
        feesETH: '718674424884699459',
        feesUSD: '1448843184786119824207',
        id: '2023-11-21'
      },
      {
        feesETH: '3096364694602300325',
        feesUSD: '6260799499166888254778',
        id: '2023-11-20'
      },
      {
        feesETH: '944761613345238843',
        feesUSD: '1855975941647837203138',
        id: '2023-11-19'
      },
      {
        feesETH: '959821804190793467',
        feesUSD: '1850363056269140779444',
        id: '2023-11-18'
      },
      {
        feesETH: '906248578259026107',
        feesUSD: '1798704069097862328227',
        id: '2023-11-17'
      },
      {
        feesETH: '999295141978429429',
        feesUSD: '2059625932145216755565',
        id: '2023-11-16'
      },
      {
        feesETH: '936965550211920963',
        feesUSD: '1856325517735359931105',
        id: '2023-11-15'
      },
      {
        feesETH: '918453880690448441',
        feesUSD: '1890242378232591222968',
        id: '2023-11-14'
      },
      {
        feesETH: '963271573261689514',
        feesUSD: '1965376300217967694595',
        id: '2023-11-13'
      },
      {
        feesETH: '913308040177425048',
        feesUSD: '1876206350711337583171',
        id: '2023-11-12'
      },
      {
        feesETH: '992487208944825725',
        feesUSD: '2043018990113821213744',
        id: '2023-11-11'
      },
      {
        feesETH: '589312624163361015',
        feesUSD: '1243194271041018221149',
        id: '2023-11-10'
      },
      {
        feesETH: '1394593149355061692',
        feesUSD: '2765478733301585210315',
        id: '2023-11-09'
      },
      {
        feesETH: '1107371340062602939',
        feesUSD: '2082013503250061588427',
        id: '2023-11-08'
      },
      {
        feesETH: '957807729954650527',
        feesUSD: '1814733788394662298243',
        id: '2023-11-07'
      },
      {
        feesETH: '945796294653284407',
        feesUSD: '1777728173393259904241',
        id: '2023-11-06'
      },
      {
        feesETH: '889674743002015373',
        feesUSD: '1671787809575087087404',
        id: '2023-11-05'
      },
      {
        feesETH: '1026342908678134331',
        feesUSD: '1881835716907166638059',
        id: '2023-11-04'
      },
      {
        feesETH: '1089845452440431958',
        feesUSD: '1957547789977366053852',
        id: '2023-11-03'
      },
      {
        feesETH: '847857011352995397',
        feesUSD: '1557577195956618225696',
        id: '2023-11-02'
      },
      {
        feesETH: '873789495813489854',
        feesUSD: '1575267703052559508791',
        id: '2023-11-01'
      },
      {
        feesETH: '849613838344117468',
        feesUSD: '1525369104850266501584',
        id: '2023-10-31'
      },
      {
        feesETH: '813316963206410851',
        feesUSD: '1452706735456883015051',
        id: '2023-10-30'
      },
      {
        feesETH: '829041808161111143',
        feesUSD: '1476000842418770478049',
        id: '2023-10-29'
      },
      {
        feesETH: '856653403599121721',
        feesUSD: '1530691242729059075562',
        id: '2023-10-28'
      },
      {
        feesETH: '802252050552810561',
        feesUSD: '1440214395940267267641',
        id: '2023-10-27'
      },
      {
        feesETH: '861344381300832787',
        feesUSD: '1559505837841757542311',
        id: '2023-10-26'
      },
      {
        feesETH: '711637608599015865',
        feesUSD: '1272650000961964032014',
        id: '2023-10-25'
      },
      {
        feesETH: '1012916700597375066',
        feesUSD: '1836667295985297435050',
        id: '2023-10-24'
      },
      {
        feesETH: '847838361762060037',
        feesUSD: '1431172153287501077455',
        id: '2023-10-23'
      },
      {
        feesETH: '885619331985372380',
        feesUSD: '1455772085654965614517',
        id: '2023-10-22'
      },
      {
        feesETH: '559743275941410489',
        feesUSD: '898108086247993129600',
        id: '2023-10-21'
      },
      {
        feesETH: '1167843252482958944',
        feesUSD: '1862820407303780820868',
        id: '2023-10-20'
      },
      {
        feesETH: '847379556296706874',
        feesUSD: '1316892602316456588645',
        id: '2023-10-19'
      },
      {
        feesETH: '1167696873291195938',
        feesUSD: '1833011307919499141115',
        id: '2023-10-18'
      },
      {
        feesETH: '651576697470068708',
        feesUSD: '1032511126536431996638',
        id: '2023-10-17'
      },
      {
        feesETH: '1029434659705362488',
        feesUSD: '1624791733814783960669',
        id: '2023-10-16'
      },
      {
        feesETH: '860265082434636172',
        feesUSD: '1336811764380836824623',
        id: '2023-10-15'
      },
      {
        feesETH: '723857132250433239',
        feesUSD: '1119361915603650392483',
        id: '2023-10-14'
      },
      {
        feesETH: '758305726180976200',
        feesUSD: '1168814087573976658985',
        id: '2023-10-13'
      },
      {
        feesETH: '915690799163881973',
        feesUSD: '1424128805245084593033',
        id: '2023-10-12'
      },
      {
        feesETH: '830492934632009039',
        feesUSD: '1293565043663607477855',
        id: '2023-10-11'
      },
      {
        feesETH: '811894787555703834',
        feesUSD: '1287800389137865932804',
        id: '2023-10-10'
      },
      {
        feesETH: '921966331610959409',
        feesUSD: '1494563443322864421625',
        id: '2023-10-09'
      },
      {
        feesETH: '1015917110649361692',
        feesUSD: '1656666294534179728207',
        id: '2023-10-08'
      },
      {
        feesETH: '883980848663078765',
        feesUSD: '1449831663974403289583',
        id: '2023-10-07'
      },
      {
        feesETH: '814896855844515633',
        feesUSD: '1321892774015934258311',
        id: '2023-10-06'
      },
      {
        feesETH: '1157289935243189854',
        feesUSD: '1894529693679194423058',
        id: '2023-10-05'
      },
      {
        feesETH: '1076629739585286642',
        feesUSD: '1766695571172476115189',
        id: '2023-10-04'
      },
      {
        feesETH: '1059356339554104723',
        feesUSD: '1768509239730293459377',
        id: '2023-10-03'
      },
      {
        feesETH: '1378142075077286819',
        feesUSD: '2373971752745859661441',
        id: '2023-10-02'
      },
      {
        feesETH: '1389223408709780095',
        feesUSD: '2331702141458073618516',
        id: '2023-10-01'
      },
      {
        feesETH: '1402641822530784237',
        feesUSD: '2346155073858197579683',
        id: '2023-09-30'
      },
      {
        feesETH: '1384576193500361581',
        feesUSD: '2295931450984501855719',
        id: '2023-09-29'
      },
      {
        feesETH: '1409609884608041154',
        feesUSD: '2274430639871020425111',
        id: '2023-09-28'
      },
      {
        feesETH: '1523312914050752804',
        feesUSD: '2426145310519240082755',
        id: '2023-09-27'
      },
      {
        feesETH: '1442684605515964960',
        feesUSD: '2292726960787883069760',
        id: '2023-09-26'
      },
      {
        feesETH: '1470313966566749187',
        feesUSD: '2321905112862544648618',
        id: '2023-09-25'
      },
      {
        feesETH: '1528314807635762970',
        feesUSD: '2433255497527889589063',
        id: '2023-09-24'
      },
      {
        feesETH: '1537825552421060155',
        feesUSD: '2452127016795682947987',
        id: '2023-09-23'
      },
      {
        feesETH: '1409877493804899530',
        feesUSD: '2244154271752892676429',
        id: '2023-09-22'
      },
      {
        feesETH: '1715716874119332407',
        feesUSD: '2774556233120093454978',
        id: '2023-09-21'
      },
      {
        feesETH: '1395224413380403073',
        feesUSD: '2279744398452565123774',
        id: '2023-09-20'
      },
      {
        feesETH: '1427445633051984213',
        feesUSD: '2336642854568115037628',
        id: '2023-09-19'
      },
      {
        feesETH: '1254011205476201360',
        feesUSD: '2045179415123191560037',
        id: '2023-09-18'
      },
      {
        feesETH: '1235212521934325047',
        feesUSD: '2014043503377282219154',
        id: '2023-09-17'
      },
      {
        feesETH: '1236442319862751041',
        feesUSD: '2022687174660835926343',
        id: '2023-09-16'
      },
      {
        feesETH: '1190995054063049444',
        feesUSD: '1941953165501424009925',
        id: '2023-09-15'
      },
      {
        feesETH: '1272974630124826011',
        feesUSD: '2061267240308081110898',
        id: '2023-09-14'
      },
      {
        feesETH: '1187017275594046369',
        feesUSD: '1884418674563963498590',
        id: '2023-09-13'
      },
      {
        feesETH: '1169686738516050895',
        feesUSD: '1846960976256417864719',
        id: '2023-09-12'
      },
      {
        feesETH: '1122419482446604004',
        feesUSD: '1811626174650413699012',
        id: '2023-09-11'
      },
      {
        feesETH: '1170186985499943826',
        feesUSD: '1903554871182613621192',
        id: '2023-09-10'
      },
      {
        feesETH: '1075158914745924959',
        feesUSD: '1757022225612286652370',
        id: '2023-09-09'
      },
      {
        feesETH: '1096400438804382339',
        feesUSD: '1802909917565538274428',
        id: '2023-09-08'
      },
      {
        feesETH: '1024040761640866261',
        feesUSD: '1676219860637789967170',
        id: '2023-09-07'
      },
      {
        feesETH: '1134137664080942260',
        feesUSD: '1848743969738842190530',
        id: '2023-09-06'
      },
      {
        feesETH: '1042472821754146249',
        feesUSD: '1690922191069877840265',
        id: '2023-09-05'
      },
      {
        feesETH: '1030738317644161562',
        feesUSD: '1687107324628375423873',
        id: '2023-09-04'
      },
      {
        feesETH: '1089262243180007575',
        feesUSD: '1782033029842492392700',
        id: '2023-09-03'
      },
      {
        feesETH: '1105886848623229298',
        feesUSD: '1803137447811689138096',
        id: '2023-09-02'
      },
      {
        feesETH: '886672659864057220',
        feesUSD: '1458394201328526779953',
        id: '2023-09-01'
      },
      {
        feesETH: '1128710981453424447',
        feesUSD: '1924588782541840169796',
        id: '2023-08-31'
      },
      {
        feesETH: '974568527545596500',
        feesUSD: '1673207467887208262955',
        id: '2023-08-30'
      },
      {
        feesETH: '993682623218608403',
        feesUSD: '1635960992948995137625',
        id: '2023-08-29'
      },
      {
        feesETH: '926510308229377488',
        feesUSD: '1521570818792777473442',
        id: '2023-08-28'
      },
      {
        feesETH: '956868106843106876',
        feesUSD: '1578196206022860295770',
        id: '2023-08-27'
      },
      {
        feesETH: '988832714543348663',
        feesUSD: '1633838405912829562388',
        id: '2023-08-26'
      },
      {
        feesETH: '991518394099834362',
        feesUSD: '1635152644445800839748',
        id: '2023-08-25'
      },
      {
        feesETH: '1108134743315091216',
        feesUSD: '1857148658559721680105',
        id: '2023-08-24'
      },
      {
        feesETH: '1060212363809758130',
        feesUSD: '1747803868511011620315',
        id: '2023-08-23'
      },
      {
        feesETH: '1101631396034198690',
        feesUSD: '1831724894862377720986',
        id: '2023-08-22'
      },
      {
        feesETH: '1078084505102868969',
        feesUSD: '1802544778428925343493',
        id: '2023-08-21'
      },
      {
        feesETH: '1136140889000907734',
        feesUSD: '1889649226917121343338',
        id: '2023-08-20'
      },
      {
        feesETH: '918753423840581644',
        feesUSD: '1521189231387089433787',
        id: '2023-08-19'
      },
      {
        feesETH: '1315248147046971881',
        feesUSD: '2216836566532062650505',
        id: '2023-08-18'
      },
      {
        feesETH: '1182927232468703586',
        feesUSD: '2129836823515251432521',
        id: '2023-08-17'
      },
      {
        feesETH: '1176470792821093296',
        feesUSD: '2144447431738432438082',
        id: '2023-08-16'
      },
      {
        feesETH: '1116723558736145331',
        feesUSD: '2054983302205955529423',
        id: '2023-08-15'
      },
      {
        feesETH: '1118467692453532665',
        feesUSD: '2065966413438618326828',
        id: '2023-08-14'
      },
      {
        feesETH: '1118540637563788879',
        feesUSD: '2066973614966876745281',
        id: '2023-08-13'
      },
      {
        feesETH: '1174720764561525007',
        feesUSD: '2170528091254074298935',
        id: '2023-08-12'
      },
      {
        feesETH: '1093948132602532314',
        feesUSD: '2021448446800751748068',
        id: '2023-08-11'
      },
      {
        feesETH: '1105214774020689532',
        feesUSD: '2043261091750087905614',
        id: '2023-08-10'
      },
      {
        feesETH: '1112950357941628330',
        feesUSD: '2066726555690444976243',
        id: '2023-08-09'
      },
      {
        feesETH: '1224633320795915058',
        feesUSD: '2243643193904772894822',
        id: '2023-08-08'
      },
      {
        feesETH: '1090320603115167184',
        feesUSD: '1994999698608397941262',
        id: '2023-08-07'
      },
      {
        feesETH: '1056205391957768023',
        feesUSD: '1934641390556667229570',
        id: '2023-08-06'
      },
      {
        feesETH: '1088911916608580070',
        feesUSD: '1992576005708115575093',
        id: '2023-08-05'
      },
      {
        feesETH: '947351060116420997',
        feesUSD: '1735575562665086759133',
        id: '2023-08-04'
      },
      {
        feesETH: '618581049177035355',
        feesUSD: '1133332872391620014302',
        id: '2023-08-03'
      },
      {
        feesETH: '641859806046586664',
        feesUSD: '1191201770096461074001',
        id: '2023-08-02'
      },
      {
        feesETH: '1010371254079388332',
        feesUSD: '1856321379978957949924',
        id: '2023-08-01'
      },
      {
        feesETH: '1073961154463269024',
        feesUSD: '2004183348013174121827',
        id: '2023-07-31'
      },
      {
        feesETH: '1311533883246711093',
        feesUSD: '2459340933555559144374',
        id: '2023-07-30'
      },
      {
        feesETH: '1036175715535322660',
        feesUSD: '1940644897367666866735',
        id: '2023-07-29'
      },
      {
        feesETH: '1025550803707718986',
        feesUSD: '1906980952970392222897',
        id: '2023-07-28'
      },
      {
        feesETH: '936644144183461231',
        feesUSD: '1755289859082690016118',
        id: '2023-07-27'
      },
      {
        feesETH: '1020977592690267185',
        feesUSD: '1893221704805674173699',
        id: '2023-07-26'
      },
      {
        feesETH: '1178208058492905039',
        feesUSD: '2181730931901942218718',
        id: '2023-07-25'
      },
      {
        feesETH: '1079364996785405188',
        feesUSD: '2019116671735535767870',
        id: '2023-07-24'
      },
      {
        feesETH: '991381227238259792',
        feesUSD: '1858398636425616084392',
        id: '2023-07-23'
      },
      {
        feesETH: '1218674362086420750',
        feesUSD: '2305870943487127762053',
        id: '2023-07-22'
      },
      {
        feesETH: '1003010402645550505',
        feesUSD: '1899078509459978700315',
        id: '2023-07-21'
      },
      {
        feesETH: '1173219782721945733',
        feesUSD: '2236355360986533192847',
        id: '2023-07-20'
      },
      {
        feesETH: '1093534728660350512',
        feesUSD: '2089719671778203016017',
        id: '2023-07-19'
      },
      {
        feesETH: '1215370145324419300',
        feesUSD: '2309708429031543586211',
        id: '2023-07-18'
      },
      {
        feesETH: '992999609299948933',
        feesUSD: '1916428093686552066493',
        id: '2023-07-17'
      },
      {
        feesETH: '1242218968842886817',
        feesUSD: '2394603436467972213697',
        id: '2023-07-16'
      },
      {
        feesETH: '1157685001592216547',
        feesUSD: '2238152828400088880731',
        id: '2023-07-15'
      },
      {
        feesETH: '1060579902726216080',
        feesUSD: '2127585034450455409906',
        id: '2023-07-14'
      },
      {
        feesETH: '1245516978488605161',
        feesUSD: '2347467508404012369403',
        id: '2023-07-13'
      },
      {
        feesETH: '1005424368624788168',
        feesUSD: '1898226116316765779344',
        id: '2023-07-12'
      },
      {
        feesETH: '1059466867615611507',
        feesUSD: '1995877237949499035604',
        id: '2023-07-11'
      },
      {
        feesETH: '1057718143166180410',
        feesUSD: '1963861926808860314151',
        id: '2023-07-10'
      },
      {
        feesETH: '999967574222518599',
        feesUSD: '1867367474510404866059',
        id: '2023-07-09'
      },
      {
        feesETH: '971754255729294077',
        feesUSD: '1804957185915772101927',
        id: '2023-07-08'
      },
      {
        feesETH: '940296968042066164',
        feesUSD: '1747092028154237315572',
        id: '2023-07-07'
      },
      {
        feesETH: '1386384160547801120',
        feesUSD: '2667167947954943943176',
        id: '2023-07-06'
      },
      {
        feesETH: '200856862814139132',
        feesUSD: '383797877874787354202',
        id: '2023-07-05'
      },
      {
        feesETH: '779767003922265845',
        feesUSD: '1523485311438707617944',
        id: '2023-07-04'
      },
      {
        feesETH: '800099068473698912',
        feesUSD: '1558897141906019587577',
        id: '2023-07-03'
      },
      {
        feesETH: '827695979540273203',
        feesUSD: '1584802226544608548506',
        id: '2023-07-02'
      },
      {
        feesETH: '740228512349885754',
        feesUSD: '1420983482209407397498',
        id: '2023-07-01'
      },
      {
        feesETH: '707653058898551245',
        feesUSD: '1331866025784266025648',
        id: '2023-06-30'
      },
      {
        feesETH: '718403778068323324',
        feesUSD: '1323096801819114029814',
        id: '2023-06-29'
      },
      {
        feesETH: '708908546372997773',
        feesUSD: '1321092967130979129605',
        id: '2023-06-28'
      },
      {
        feesETH: '657245425015253575',
        feesUSD: '1229309784457330037881',
        id: '2023-06-27'
      },
      {
        feesETH: '633952422714171071',
        feesUSD: '1199523329116611813006',
        id: '2023-06-26'
      },
      {
        feesETH: '614928258905583678',
        feesUSD: '1180025544321961803921',
        id: '2023-06-25'
      },
      {
        feesETH: '1212132630050244455',
        feesUSD: '2291352216829513124564',
        id: '2023-06-24'
      },
      {
        feesETH: '134138029340391047',
        feesUSD: '251452855134406213757',
        id: '2023-06-23'
      },
      {
        feesETH: '622528199275256184',
        feesUSD: '1187994027215588230105',
        id: '2023-06-22'
      },
      {
        feesETH: '682882727114616573',
        feesUSD: '1240230962995204655208',
        id: '2023-06-21'
      },
      {
        feesETH: '574160473753730072',
        feesUSD: '992560890139123861739',
        id: '2023-06-20'
      },
      {
        feesETH: '584787407922330950',
        feesUSD: '1008834408545206437868',
        id: '2023-06-19'
      },
      {
        feesETH: '530512536679959411',
        feesUSD: '916422441052852253066',
        id: '2023-06-18'
      },
      {
        feesETH: '543430100164826523',
        feesUSD: '948262969989265772141',
        id: '2023-06-17'
      },
      {
        feesETH: '583605770088165907',
        feesUSD: '977794868737439499896',
        id: '2023-06-16'
      },
      {
        feesETH: '462247354257527581',
        feesUSD: '756107242306123014793',
        id: '2023-06-15'
      },
      {
        feesETH: '932196407894094858',
        feesUSD: '1618711097458811909040',
        id: '2023-06-14'
      },
      {
        feesETH: '574031431780611585',
        feesUSD: '1003594378511288223314',
        id: '2023-06-13'
      },
      {
        feesETH: '381244127261176274',
        feesUSD: '663442494500020885797',
        id: '2023-06-12'
      },
      {
        feesETH: '454856784664943360',
        feesUSD: '798597251080159645883',
        id: '2023-06-11'
      },
      {
        feesETH: '455245042434069051',
        feesUSD: '795470240318832682233',
        id: '2023-06-10'
      },
      {
        feesETH: '453418814685103426',
        feesUSD: '834787312549248855773',
        id: '2023-06-09'
      },
      {
        feesETH: '332885689743162791',
        feesUSD: '612597865507981504186',
        id: '2023-06-08'
      },
      {
        feesETH: '867039669185880309',
        feesUSD: '1625949183427492175367',
        id: '2023-06-07'
      },
      {
        feesETH: '818807685055434467',
        feesUSD: '1518942539501799713560',
        id: '2023-06-06'
      },
      {
        feesETH: '415196750742762566',
        feesUSD: '774753699003889835652',
        id: '2023-06-05'
      },
      {
        feesETH: '231575109195570321',
        feesUSD: '439671896859815503326',
        id: '2023-06-04'
      },
      {
        feesETH: '204451106573670495',
        feesUSD: '389213571584296521331',
        id: '2023-06-03'
      },
      {
        feesETH: '219215456828332183',
        feesUSD: '413552863008581869344',
        id: '2023-06-02'
      },
      {
        feesETH: '165148936089741356',
        feesUSD: '307445409650750695165',
        id: '2023-06-01'
      },
      {
        feesETH: '217050043416695968',
        feesUSD: '405737003173079789645',
        id: '2023-05-31'
      },
      {
        feesETH: '1033666191654638280',
        feesUSD: '1970665792361344046758',
        id: '2023-05-30'
      },
      {
        feesETH: '156700868151182511',
        feesUSD: '297453084674966250951',
        id: '2023-05-29'
      },
      {
        feesETH: '207839543442832845',
        feesUSD: '384175954758352368850',
        id: '2023-05-28'
      },
      {
        feesETH: '565010280140569715',
        feesUSD: '1032693787887250175847',
        id: '2023-05-27'
      },
      {
        feesETH: '276862207899451283',
        feesUSD: '506146165697985012257',
        id: '2023-05-26'
      },
      {
        feesETH: '87755039836346993',
        feesUSD: '157249824248980781585',
        id: '2023-05-25'
      },
      {
        feesETH: '141493975184290019',
        feesUSD: '256786894987558192010',
        id: '2023-05-24'
      },
      {
        feesETH: '451945767293523691',
        feesUSD: '830769973390790333391',
        id: '2023-05-23'
      },
      {
        feesETH: '58459510030163141',
        feesUSD: '105660638564679562935',
        id: '2023-05-22'
      },
      {
        feesETH: '235691481381759625',
        feesUSD: '425994393462582795326',
        id: '2023-05-21'
      },
      {
        feesETH: '238595261282891430',
        feesUSD: '433287882994057619687',
        id: '2023-05-20'
      },
      {
        feesETH: '328784962322623745',
        feesUSD: '596015892980689841779',
        id: '2023-05-19'
      },
      {
        feesETH: '37945154933759671',
        feesUSD: '69065265148671004587',
        id: '2023-05-18'
      },
      {
        feesETH: '13860458242843891',
        feesUSD: '25318254564946595605',
        id: '2023-05-17'
      },
      {
        feesETH: '20728743150939160',
        feesUSD: '37649850898477465253',
        id: '2023-05-16'
      },
      {
        feesETH: '22277730134851482',
        feesUSD: '40783129622962076122',
        id: '2023-05-15'
      },
      {
        feesETH: '14335235343449142',
        feesUSD: '25907627304034108020',
        id: '2023-05-14'
      },
      {
        feesETH: '16292917981843280',
        feesUSD: '29300369052647862588',
        id: '2023-05-13'
      },
      {
        feesETH: '15650542443978778',
        feesUSD: '27487673716057686952',
        id: '2023-05-12'
      },
      {
        feesETH: '13863626385798475',
        feesUSD: '25341304896995615215',
        id: '2023-05-11'
      },
      {
        feesETH: '16031934532876208',
        feesUSD: '29529602096785260626',
        id: '2023-05-10'
      },
      {
        feesETH: '14325050433761990',
        feesUSD: '26356660293078685401',
        id: '2023-05-09'
      },
      {
        feesETH: '13345387710243669',
        feesUSD: '24844482268023151046',
        id: '2023-05-08'
      },
      {
        feesETH: '14765877038104990',
        feesUSD: '28137013333504156197',
        id: '2023-05-07'
      },
      {
        feesETH: '16810021906290085',
        feesUSD: '33014773758811336054',
        id: '2023-05-06'
      },
      {
        feesETH: '12624835920505397',
        feesUSD: '23969840726084091928',
        id: '2023-05-05'
      },
      {
        feesETH: '13394146212854063',
        feesUSD: '25462684946576320693',
        id: '2023-05-04'
      },
      {
        feesETH: '13108208874383481',
        feesUSD: '24478687403886805252',
        id: '2023-05-03'
      },
      {
        feesETH: '27716212421573810',
        feesUSD: '50695169816052224394',
        id: '2023-05-02'
      },
      {
        feesETH: '0',
        feesUSD: '0',
        id: '2023-05-01'
      },
      {
        feesETH: '1035381192721339',
        feesUSD: '1974649554163204818',
        id: '2023-04-30'
      },
      {
        feesETH: '35905236050654856',
        feesUSD: '68079302128997237106',
        id: '2023-04-29'
      },
      {
        feesETH: '278032220396340',
        feesUSD: '528817923047241323',
        id: '2023-04-28'
      },
      {
        feesETH: '0',
        feesUSD: '0',
        id: '2023-04-27'
      },
      {
        feesETH: '75022776608968',
        feesUSD: '146387264871515823',
        id: '2023-04-26'
      }
    ],
    ousdDailyStats: [
      {
        feesETH: '202655440375051106',
        feesUSD: '460378950201815788271',
        id: '2023-12-06'
      },
      {
        feesETH: '186150889724758324',
        feesUSD: '415003546341415052490',
        id: '2023-12-05'
      },
      {
        feesETH: '241604613895626330',
        feesUSD: '544600960182131310636',
        id: '2023-12-04'
      },
      {
        feesETH: '311586078477161984',
        feesUSD: '672521378173791817414',
        id: '2023-12-03'
      },
      {
        feesETH: '284572695428340722',
        feesUSD: '598594649512782216353',
        id: '2023-12-02'
      },
      {
        feesETH: '176742166027779287',
        feesUSD: '369702193210267602947',
        id: '2023-12-01'
      },
      {
        feesETH: '195005493253086634',
        feesUSD: '396759015681367535385',
        id: '2023-11-30'
      },
      {
        feesETH: '184551382601818493',
        feesUSD: '380852228976981761819',
        id: '2023-11-29'
      },
      {
        feesETH: '134835433053792658',
        feesUSD: '271291127463593348880',
        id: '2023-11-28'
      },
      {
        feesETH: '393994145353029778',
        feesUSD: '800873133267250061866',
        id: '2023-11-27'
      },
      {
        feesETH: '198471715220146023',
        feesUSD: '414218748904106290289',
        id: '2023-11-26'
      },
      {
        feesETH: '195850792298716750',
        feesUSD: '408327495451226175651',
        id: '2023-11-25'
      },
      {
        feesETH: '174266109015300081',
        feesUSD: '360655803791025075729',
        id: '2023-11-24'
      },
      {
        feesETH: '215154339461475037',
        feesUSD: '443573757234153175417',
        id: '2023-11-23'
      },
      {
        feesETH: '199262176186410250',
        feesUSD: '397567893927125731143',
        id: '2023-11-22'
      },
      {
        feesETH: '230765107251002355',
        feesUSD: '465221025474355792706',
        id: '2023-11-21'
      },
      {
        feesETH: '209648613347126033',
        feesUSD: '420783635362883189785',
        id: '2023-11-20'
      },
      {
        feesETH: '205146414935564487',
        feesUSD: '403008341212714047765',
        id: '2023-11-19'
      },
      {
        feesETH: '295858533274902820',
        feesUSD: '570361808268561860050',
        id: '2023-11-18'
      },
      {
        feesETH: '395166913685474199',
        feesUSD: '783706594673859379659',
        id: '2023-11-17'
      },
      {
        feesETH: '282944888747551057',
        feesUSD: '583171683471447160830',
        id: '2023-11-16'
      },
      {
        feesETH: '436802320728250880',
        feesUSD: '865917257491522252507',
        id: '2023-11-15'
      },
      {
        feesETH: '311738642012696720',
        feesUSD: '641579946967070738768',
        id: '2023-11-14'
      },
      {
        feesETH: '194217262682024489',
        feesUSD: '396264164503440901315',
        id: '2023-11-13'
      },
      {
        feesETH: '194563754036663949',
        feesUSD: '399691817966380987146',
        id: '2023-11-12'
      },
      {
        feesETH: '194498655558019193',
        feesUSD: '400372360747200910538',
        id: '2023-11-11'
      },
      {
        feesETH: '203887288398163441',
        feesUSD: '430113828351351963109',
        id: '2023-11-10'
      },
      {
        feesETH: '209753592778965393',
        feesUSD: '404317795235404896881',
        id: '2023-11-09'
      },
      {
        feesETH: '213973152272419587',
        feesUSD: '402299550518414218232',
        id: '2023-11-08'
      },
      {
        feesETH: '266962491782737110',
        feesUSD: '505806999589681220254',
        id: '2023-11-07'
      },
      {
        feesETH: '292204109356238821',
        feesUSD: '549229765987080050867',
        id: '2023-11-06'
      },
      {
        feesETH: '247172662620642862',
        feesUSD: '464462150330450003546',
        id: '2023-11-05'
      },
      {
        feesETH: '265799484382048361',
        feesUSD: '487352676202402950079',
        id: '2023-11-04'
      },
      {
        feesETH: '246763753128487622',
        feesUSD: '443229669400848940248',
        id: '2023-11-03'
      },
      {
        feesETH: '241742777051732204',
        feesUSD: '444099691081327647714',
        id: '2023-11-02'
      },
      {
        feesETH: '199094254552846212',
        feesUSD: '358927122107871152617',
        id: '2023-11-01'
      },
      {
        feesETH: '277234952405735789',
        feesUSD: '497738633834566711505',
        id: '2023-10-31'
      },
      {
        feesETH: '226544162599367951',
        feesUSD: '404642034747550940813',
        id: '2023-10-30'
      },
      {
        feesETH: '259795437990519382',
        feesUSD: '462531903163128551461',
        id: '2023-10-29'
      },
      {
        feesETH: '232712989674659471',
        feesUSD: '415817802004545031612',
        id: '2023-10-28'
      },
      {
        feesETH: '244502558251479553',
        feesUSD: '438934501937834881936',
        id: '2023-10-27'
      },
      {
        feesETH: '242652327331656338',
        feesUSD: '439333824257502299518',
        id: '2023-10-26'
      },
      {
        feesETH: '253278976325847555',
        feesUSD: '452948924522566216766',
        id: '2023-10-25'
      },
      {
        feesETH: '242954118290776382',
        feesUSD: '440004266812987013462',
        id: '2023-10-24'
      },
      {
        feesETH: '199232625242816648',
        feesUSD: '336309605856104374068',
        id: '2023-10-23'
      },
      {
        feesETH: '200571025949008537',
        feesUSD: '329696620457882082750',
        id: '2023-10-22'
      },
      {
        feesETH: '241574159290620095',
        feesUSD: '387605738581799942880',
        id: '2023-10-21'
      },
      {
        feesETH: '225641712042520324',
        feesUSD: '357251753425561154160',
        id: '2023-10-20'
      },
      {
        feesETH: '246975451166143598',
        feesUSD: '383342511850735733542',
        id: '2023-10-19'
      },
      {
        feesETH: '238772503887697879',
        feesUSD: '375585664021956977523',
        id: '2023-10-18'
      },
      {
        feesETH: '226682755220119221',
        feesUSD: '359209388345965455590',
        id: '2023-10-17'
      },
      {
        feesETH: '197216356951971658',
        feesUSD: '311127950827831757759',
        id: '2023-10-16'
      },
      {
        feesETH: '195442014018567446',
        feesUSD: '303620146073909107821',
        id: '2023-10-15'
      },
      {
        feesETH: '202854496488608428',
        feesUSD: '313691179739241699148',
        id: '2023-10-14'
      },
      {
        feesETH: '131066787912190473',
        feesUSD: '201730266931384680675',
        id: '2023-10-13'
      },
      {
        feesETH: '425070212115830189',
        feesUSD: '661148846857154887585',
        id: '2023-10-12'
      },
      {
        feesETH: '278283241644398421',
        feesUSD: '432824393281313676459',
        id: '2023-10-11'
      },
      {
        feesETH: '266281030936093795',
        feesUSD: '423091786492060395702',
        id: '2023-10-10'
      },
      {
        feesETH: '315175851343520705',
        feesUSD: '513525469869538591394',
        id: '2023-10-09'
      },
      {
        feesETH: '177034289779876724',
        feesUSD: '288455214043914477219',
        id: '2023-10-08'
      },
      {
        feesETH: '400008663919230971',
        feesUSD: '655967773077200881627',
        id: '2023-10-07'
      },
      {
        feesETH: '248532188462924595',
        feesUSD: '403158880394786146251',
        id: '2023-10-06'
      },
      {
        feesETH: '175370605793817298',
        feesUSD: '287443768925312661450',
        id: '2023-10-05'
      },
      {
        feesETH: '238313492592419277',
        feesUSD: '390820191661700236444',
        id: '2023-10-04'
      },
      {
        feesETH: '215539483800288223',
        feesUSD: '359461986627480379138',
        id: '2023-10-03'
      },
      {
        feesETH: '406166293686880421',
        feesUSD: '693649892812394681832',
        id: '2023-10-02'
      },
      {
        feesETH: '745508072743263167',
        feesUSD: '1251857155750487510867',
        id: '2023-10-01'
      },
      {
        feesETH: '180707166162335252',
        feesUSD: '302263220705437294968',
        id: '2023-09-30'
      },
      {
        feesETH: '415851356780215710',
        feesUSD: '692452878736252663506',
        id: '2023-09-29'
      },
      {
        feesETH: '205165237764914873',
        feesUSD: '331037763074922364394',
        id: '2023-09-28'
      },
      {
        feesETH: '200961339352469179',
        feesUSD: '320066485728889742047',
        id: '2023-09-27'
      },
      {
        feesETH: '198861642246486732',
        feesUSD: '315935468269838401129',
        id: '2023-09-26'
      },
      {
        feesETH: '207514451227360360',
        feesUSD: '327704746233735207946',
        id: '2023-09-25'
      },
      {
        feesETH: '211607820296480330',
        feesUSD: '336904340312468880107',
        id: '2023-09-24'
      },
      {
        feesETH: '203607377220799391',
        feesUSD: '324660459514416053851',
        id: '2023-09-23'
      },
      {
        feesETH: '208475633195434647',
        feesUSD: '331838393653133699187',
        id: '2023-09-22'
      },
      {
        feesETH: '215757354833856186',
        feesUSD: '349744398244519549337',
        id: '2023-09-21'
      },
      {
        feesETH: '192600673389766396',
        feesUSD: '314702281645639643563',
        id: '2023-09-20'
      },
      {
        feesETH: '258399749544142298',
        feesUSD: '422984886018788294497',
        id: '2023-09-19'
      },
      {
        feesETH: '281721986894735036',
        feesUSD: '459463205646492318029',
        id: '2023-09-18'
      },
      {
        feesETH: '243451710605161870',
        feesUSD: '396953825696791624504',
        id: '2023-09-17'
      },
      {
        feesETH: '204808685905939131',
        feesUSD: '335043580028448779120',
        id: '2023-09-16'
      },
      {
        feesETH: '205489257759909856',
        feesUSD: '335056399455265818633',
        id: '2023-09-15'
      },
      {
        feesETH: '210318101390524043',
        feesUSD: '340558092974382516878',
        id: '2023-09-14'
      },
      {
        feesETH: '208452719855194881',
        feesUSD: '330923741494996766751',
        id: '2023-09-13'
      },
      {
        feesETH: '201726041417615828',
        feesUSD: '318529837198722439614',
        id: '2023-09-12'
      },
      {
        feesETH: '197635073106809330',
        feesUSD: '319066192596660915410',
        id: '2023-09-11'
      },
      {
        feesETH: '197635727116910621',
        feesUSD: '321496013658349677105',
        id: '2023-09-10'
      },
      {
        feesETH: '197499291498478795',
        feesUSD: '322752887918443601716',
        id: '2023-09-09'
      },
      {
        feesETH: '196981267203468328',
        feesUSD: '323914025976711284240',
        id: '2023-09-08'
      },
      {
        feesETH: '197148212633375768',
        feesUSD: '322705659661232317174',
        id: '2023-09-07'
      },
      {
        feesETH: '198823963157001308',
        feesUSD: '324100516689877316794',
        id: '2023-09-06'
      },
      {
        feesETH: '201747169803490130',
        feesUSD: '327239961836355097062',
        id: '2023-09-05'
      },
      {
        feesETH: '207612976111196358',
        feesUSD: '339819881233925644252',
        id: '2023-09-04'
      },
      {
        feesETH: '199301833048876000',
        feesUSD: '326057798867961136585',
        id: '2023-09-03'
      },
      {
        feesETH: '231572157696347539',
        feesUSD: '377576087402317699499',
        id: '2023-09-02'
      },
      {
        feesETH: '201511635289499442',
        feesUSD: '331363717953699987554',
        id: '2023-09-01'
      },
      {
        feesETH: '199981304354846216',
        feesUSD: '341137619031429758102',
        id: '2023-08-31'
      },
      {
        feesETH: '158817439910359873',
        feesUSD: '272668898058899555729',
        id: '2023-08-30'
      },
      {
        feesETH: '279709006909725497',
        feesUSD: '460382707155178967540',
        id: '2023-08-29'
      },
      {
        feesETH: '202478111103165776',
        feesUSD: '332521702740285028193',
        id: '2023-08-28'
      },
      {
        feesETH: '191479466046464012',
        feesUSD: '315813814552564679827',
        id: '2023-08-27'
      },
      {
        feesETH: '148361268380625201',
        feesUSD: '245135840132623214129',
        id: '2023-08-26'
      },
      {
        feesETH: '1014989662974949939',
        feesUSD: '1683071440139359912217',
        id: '2023-08-25'
      },
      {
        feesETH: '300794937131961437',
        feesUSD: '504109195534299406965',
        id: '2023-08-24'
      },
      {
        feesETH: '239341620378263337',
        feesUSD: '394564546002488734378',
        id: '2023-08-23'
      },
      {
        feesETH: '180641522200148550',
        feesUSD: '300511707164885986220',
        id: '2023-08-22'
      },
      {
        feesETH: '508916125961954279',
        feesUSD: '849241712238348496604',
        id: '2023-08-21'
      },
      {
        feesETH: '210177592072875477',
        feesUSD: '349571015549897984692',
        id: '2023-08-20'
      },
      {
        feesETH: '214475398671197433',
        feesUSD: '355109062333888302492',
        id: '2023-08-19'
      },
      {
        feesETH: '220187071381809123',
        feesUSD: '371973976081068221519',
        id: '2023-08-18'
      },
      {
        feesETH: '198483770576035313',
        feesUSD: '357366059246740060363',
        id: '2023-08-17'
      },
      {
        feesETH: '161007280084122178',
        feesUSD: '293480849991736224290',
        id: '2023-08-16'
      },
      {
        feesETH: '260035558927222577',
        feesUSD: '478559800918736637667',
        id: '2023-08-15'
      },
      {
        feesETH: '203755234900509047',
        feesUSD: '376364444594126281289',
        id: '2023-08-14'
      },
      {
        feesETH: '236112872324952921',
        feesUSD: '436317699026727002696',
        id: '2023-08-13'
      },
      {
        feesETH: '656778374554297968',
        feesUSD: '1213527465167771420356',
        id: '2023-08-12'
      },
      {
        feesETH: '269585903780614262',
        feesUSD: '498153422667525589601',
        id: '2023-08-11'
      },
      {
        feesETH: '253289702754082699',
        feesUSD: '468268255857276490348',
        id: '2023-08-10'
      },
      {
        feesETH: '253951561870454711',
        feesUSD: '471582971362196989320',
        id: '2023-08-09'
      },
      {
        feesETH: '213449018167190769',
        feesUSD: '391058636674383752282',
        id: '2023-08-08'
      },
      {
        feesETH: '22508133342043511',
        feesUSD: '41183959200000000000',
        id: '2023-08-07'
      },
      {
        feesETH: '26235698552687596',
        feesUSD: '48055680000000000000',
        id: '2023-08-06'
      },
      {
        feesETH: '30628786019137344',
        feesUSD: '56048534400000000000',
        id: '2023-08-05'
      },
      {
        feesETH: '65789937104564925',
        feesUSD: '120529138473676080458',
        id: '2023-08-04'
      },
      {
        feesETH: '240863219496938808',
        feesUSD: '441526874460481049838',
        id: '2023-08-03'
      },
      {
        feesETH: '228659039826467786',
        feesUSD: '424679302709051890200',
        id: '2023-08-02'
      },
      {
        feesETH: '0',
        feesUSD: '0',
        id: '2023-08-01'
      },
      {
        feesETH: '28362326917306125',
        feesUSD: '52928640000000000000',
        id: '2023-07-31'
      },
      {
        feesETH: '344044149050433175',
        feesUSD: '645093486681378861648',
        id: '2023-07-30'
      },
      {
        feesETH: '209619577581321999',
        feesUSD: '392594767009564047230',
        id: '2023-07-29'
      },
      {
        feesETH: '191278861193687227',
        feesUSD: '355677304023825588601',
        id: '2023-07-28'
      },
      {
        feesETH: '191660935823628065',
        feesUSD: '359176426952195467103',
        id: '2023-07-27'
      },
      {
        feesETH: '198464133489942492',
        feesUSD: '367939918959034437468',
        id: '2023-07-26'
      },
      {
        feesETH: '208875150821923117',
        feesUSD: '386752444511664951190',
        id: '2023-07-25'
      },
      {
        feesETH: '210311664307688449',
        feesUSD: '393404281753019927426',
        id: '2023-07-24'
      },
      {
        feesETH: '178548386371623924',
        feesUSD: '334698770414859485702',
        id: '2023-07-23'
      },
      {
        feesETH: '242982969861297442',
        feesUSD: '459796673868533151350',
        id: '2023-07-22'
      },
      {
        feesETH: '289384523424710100',
        feesUSD: '547968925990853346076',
        id: '2023-07-21'
      },
      {
        feesETH: '186595900259129712',
        feesUSD: '355580677928230482584',
        id: '2023-07-20'
      },
      {
        feesETH: '202593995932943004',
        feesUSD: '387164424836606822665',
        id: '2023-07-19'
      },
      {
        feesETH: '186458097423128999',
        feesUSD: '354052229129960038168',
        id: '2023-07-18'
      },
      {
        feesETH: '189525015213693602',
        feesUSD: '365771607773292491944',
        id: '2023-07-17'
      },
      {
        feesETH: '167067952415436330',
        feesUSD: '322198432201389748643',
        id: '2023-07-16'
      },
      {
        feesETH: '312204376227057451',
        feesUSD: '603540133790821136381',
        id: '2023-07-15'
      },
      {
        feesETH: '225155209815057082',
        feesUSD: '451690621066280465517',
        id: '2023-07-14'
      },
      {
        feesETH: '190019410357152866',
        feesUSD: '355726921641687202344',
        id: '2023-07-13'
      },
      {
        feesETH: '188262899212662005',
        feesUSD: '355644165245564501426',
        id: '2023-07-12'
      },
      {
        feesETH: '188140655718858788',
        feesUSD: '354715094251471317096',
        id: '2023-07-11'
      },
      {
        feesETH: '191505201194460864',
        feesUSD: '355142565511103784146',
        id: '2023-07-10'
      },
      {
        feesETH: '192360240802611174',
        feesUSD: '359155805602555323568',
        id: '2023-07-09'
      },
      {
        feesETH: '196258060549155197',
        feesUSD: '364489763522873056344',
        id: '2023-07-08'
      },
      {
        feesETH: '160544221628491113',
        feesUSD: '298025534714507720436',
        id: '2023-07-07'
      },
      {
        feesETH: '0',
        feesUSD: '0',
        id: '2023-07-06'
      },
      {
        feesETH: '288880176684212804',
        feesUSD: '551983257434698947019',
        id: '2023-07-05'
      },
      {
        feesETH: '268395678720568281',
        feesUSD: '524304329007365739391',
        id: '2023-07-04'
      },
      {
        feesETH: '204783600164195739',
        feesUSD: '398571047981354751167',
        id: '2023-07-03'
      },
      {
        feesETH: '207574740916082908',
        feesUSD: '397452611566997170452',
        id: '2023-07-02'
      },
      {
        feesETH: '221100263987675272',
        feesUSD: '424382057700583794780',
        id: '2023-07-01'
      },
      {
        feesETH: '200209551425703238',
        feesUSD: '375394755858307569410',
        id: '2023-06-30'
      },
      {
        feesETH: '211857586852236254',
        feesUSD: '389591272190182815586',
        id: '2023-06-29'
      },
      {
        feesETH: '226019892048119045',
        feesUSD: '421569748623371499828',
        id: '2023-06-28'
      },
      {
        feesETH: '237416983853235975',
        feesUSD: '443536687485304586654',
        id: '2023-06-27'
      },
      {
        feesETH: '235713878613068025',
        feesUSD: '446106279993121240239',
        id: '2023-06-26'
      },
      {
        feesETH: '234296724781237472',
        feesUSD: '450259730848343113723',
        id: '2023-06-25'
      },
      {
        feesETH: '447378663909675112',
        feesUSD: '845919235973650541718',
        id: '2023-06-24'
      },
      {
        feesETH: '0',
        feesUSD: '0',
        id: '2023-06-23'
      },
      {
        feesETH: '355687692175016838',
        feesUSD: '681318156722458456231',
        id: '2023-06-22'
      },
      {
        feesETH: '682094174984033375',
        feesUSD: '1271326014173985481554',
        id: '2023-06-21'
      },
      {
        feesETH: '206861467628412480',
        feesUSD: '357568175026113256411',
        id: '2023-06-20'
      },
      {
        feesETH: '299347387486610177',
        feesUSD: '516254133283871531214',
        id: '2023-06-19'
      },
      {
        feesETH: '65128042352559572',
        feesUSD: '112440960000000000000',
        id: '2023-06-18'
      },
      {
        feesETH: '75051737544344202',
        feesUSD: '131171539200000000000',
        id: '2023-06-17'
      },
      {
        feesETH: '135528769050898591',
        feesUSD: '226463151933289509986',
        id: '2023-06-16'
      },
      {
        feesETH: '539004489945433891',
        feesUSD: '882556110098405053169',
        id: '2023-06-15'
      },
      {
        feesETH: '258179726430729065',
        feesUSD: '449202919923229596758',
        id: '2023-06-14'
      },
      {
        feesETH: '273031665958921797',
        feesUSD: '477425928715596839902',
        id: '2023-06-13'
      },
      {
        feesETH: '285405295873953499',
        feesUSD: '496652477937675815597',
        id: '2023-06-12'
      },
      {
        feesETH: '304583106610766395',
        feesUSD: '535302580320081549761',
        id: '2023-06-11'
      },
      {
        feesETH: '284241146115087155',
        feesUSD: '496788366296771912788',
        id: '2023-06-10'
      },
      {
        feesETH: '271106578649957056',
        feesUSD: '498447899850751552153',
        id: '2023-06-09'
      },
      {
        feesETH: '268374919824869421',
        feesUSD: '493944039937672169818',
        id: '2023-06-08'
      },
      {
        feesETH: '199043977735498683',
        feesUSD: '373724972596172327601',
        id: '2023-06-07'
      },
      {
        feesETH: '159891729641083181',
        feesUSD: '290582801056753005053',
        id: '2023-06-06'
      },
      {
        feesETH: '165385971854974538',
        feesUSD: '309477439931158716915',
        id: '2023-06-05'
      },
      {
        feesETH: '186524572581787173',
        feesUSD: '354133688258055309790',
        id: '2023-06-04'
      },
      {
        feesETH: '211331770449688739',
        feesUSD: '402312291405072452936',
        id: '2023-06-03'
      },
      {
        feesETH: '470959369322272818',
        feesUSD: '890254411611804292317',
        id: '2023-06-02'
      },
      {
        feesETH: '462581538789929754',
        feesUSD: '858523581101782229085',
        id: '2023-06-01'
      },
      {
        feesETH: '520632194348291552',
        feesUSD: '972723160310630522754',
        id: '2023-05-31'
      },
      {
        feesETH: '573395249000049294',
        feesUSD: '1090744447128029190951',
        id: '2023-05-30'
      },
      {
        feesETH: '622043568994733844',
        feesUSD: '1183686707440079033079',
        id: '2023-05-29'
      },
      {
        feesETH: '205660643565033996',
        feesUSD: '379847237052412566692',
        id: '2023-05-28'
      },
      {
        feesETH: '207425618731528927',
        feesUSD: '380294116729422393591',
        id: '2023-05-27'
      },
      {
        feesETH: '206107526931172837',
        feesUSD: '373034012992729718560',
        id: '2023-05-26'
      },
      {
        feesETH: '211922057221017830',
        feesUSD: '378258161344836311513',
        id: '2023-05-25'
      },
      {
        feesETH: '100480633670809362',
        feesUSD: '182856666766812293233',
        id: '2023-05-24'
      },
      {
        feesETH: '602308283562955980',
        feesUSD: '1116352780631090065401',
        id: '2023-05-23'
      },
      {
        feesETH: '232226358411305588',
        feesUSD: '420332030988047229132',
        id: '2023-05-22'
      },
      {
        feesETH: '141912014397017832',
        feesUSD: '257734924067287906676',
        id: '2023-05-21'
      },
      {
        feesETH: '0',
        feesUSD: '0',
        id: '2023-05-20'
      },
      {
        feesETH: '711921833777130256',
        feesUSD: '1289489047265284095420',
        id: '2023-05-19'
      },
      {
        feesETH: '230137379607450160',
        feesUSD: '418501027549384593072',
        id: '2023-05-18'
      },
      {
        feesETH: '221438407567460907',
        feesUSD: '402701244849957383394',
        id: '2023-05-17'
      },
      {
        feesETH: '241540333461836433',
        feesUSD: '438026917618858502116',
        id: '2023-05-16'
      },
      {
        feesETH: '226273017942415670',
        feesUSD: '414137707118326495439',
        id: '2023-05-15'
      },
      {
        feesETH: '232374095100522804',
        feesUSD: '419962512420672453616',
        id: '2023-05-14'
      },
      {
        feesETH: '246756961663868807',
        feesUSD: '443755382008218470835',
        id: '2023-05-13'
      },
      {
        feesETH: '261336860999060460',
        feesUSD: '458996382447089849451',
        id: '2023-05-12'
      },
      {
        feesETH: '256817188381264106',
        feesUSD: '470460787860316227126',
        id: '2023-05-11'
      },
      {
        feesETH: '267242586214750045',
        feesUSD: '492240485267351743533',
        id: '2023-05-10'
      },
      {
        feesETH: '302694059292875226',
        feesUSD: '556926799692961129792',
        id: '2023-05-09'
      },
      {
        feesETH: '288197499216158649',
        feesUSD: '536523764946034328518',
        id: '2023-05-08'
      },
      {
        feesETH: '288784999872819482',
        feesUSD: '550292229236952057653',
        id: '2023-05-07'
      },
      {
        feesETH: '298353752742032200',
        feesUSD: '585964831085958418879',
        id: '2023-05-06'
      },
      {
        feesETH: '326215078748261389',
        feesUSD: '619378177671748288892',
        id: '2023-05-05'
      },
      {
        feesETH: '174342710437442532',
        feesUSD: '331315564232366134069',
        id: '2023-05-04'
      },
      {
        feesETH: '191593842944078712',
        feesUSD: '357788454157362504098',
        id: '2023-05-03'
      },
      {
        feesETH: '209793319915039039',
        feesUSD: '383728765590199606630',
        id: '2023-05-02'
      },
      {
        feesETH: '175588557416642187',
        feesUSD: '324649195578778074155',
        id: '2023-05-01'
      },
      {
        feesETH: '179649160055921984',
        feesUSD: '342341029522192877942',
        id: '2023-04-30'
      },
      {
        feesETH: '203191481041707842',
        feesUSD: '385961066143026539904',
        id: '2023-04-29'
      },
      {
        feesETH: '221767913617797767',
        feesUSD: '424609674468759259319',
        id: '2023-04-28'
      },
      {
        feesETH: '150586968204163471',
        feesUSD: '282764679545367958603',
        id: '2023-04-27'
      },
      {
        feesETH: '157616203932063052',
        feesUSD: '294182763828999084048',
        id: '2023-04-26'
      },
      {
        feesETH: '173708717614530816',
        feesUSD: '317372775430452383098',
        id: '2023-04-25'
      },
      {
        feesETH: '186757949877537563',
        feesUSD: '344766538837965400788',
        id: '2023-04-24'
      },
      {
        feesETH: '192645541428173684',
        feesUSD: '359776067063676334096',
        id: '2023-04-23'
      },
      {
        feesETH: '152509729116563201',
        feesUSD: '283133047799245207516',
        id: '2023-04-22'
      },
      {
        feesETH: '142581485311529587',
        feesUSD: '271944241119827267394',
        id: '2023-04-21'
      },
      {
        feesETH: '145358475370578119',
        feesUSD: '284291302006690936273',
        id: '2023-04-20'
      },
      {
        feesETH: '142326243834947174',
        feesUSD: '295454286708299883489',
        id: '2023-04-19'
      },
      {
        feesETH: '148853367412860607',
        feesUSD: '313020953843331906179',
        id: '2023-04-18'
      },
      {
        feesETH: '146265382381572161',
        feesUSD: '306559077587360909667',
        id: '2023-04-17'
      },
      {
        feesETH: '123799829533533856',
        feesUSD: '259676758929714681434',
        id: '2023-04-16'
      },
      {
        feesETH: '189441162805784755',
        feesUSD: '395847844497030059535',
        id: '2023-04-15'
      },
      {
        feesETH: '139312053096666414',
        feesUSD: '295230102922455464653',
        id: '2023-04-14'
      },
      {
        feesETH: '50851362661424496',
        feesUSD: '97256257763079957941',
        id: '2023-04-13'
      },
      {
        feesETH: '222131120451081339',
        feesUSD: '416988924501023231109',
        id: '2023-04-12'
      },
      {
        feesETH: '125836780733973692',
        feesUSD: '241775240295413015272',
        id: '2023-04-11'
      },
      {
        feesETH: '135130714412833270',
        feesUSD: '251473852909685714260',
        id: '2023-04-10'
      },
      {
        feesETH: '143172317651697499',
        feesUSD: '263012980915623188048',
        id: '2023-04-09'
      },
      {
        feesETH: '153269404095264441',
        feesUSD: '287697400345098025511',
        id: '2023-04-08'
      },
      {
        feesETH: '164710159513734843',
        feesUSD: '307299849065605362646',
        id: '2023-04-07'
      },
      {
        feesETH: '131913017045003542',
        feesUSD: '249419755456794748892',
        id: '2023-04-06'
      },
      {
        feesETH: '148714065371494518',
        feesUSD: '284387638241629891731',
        id: '2023-04-05'
      },
      {
        feesETH: '151079566836776845',
        feesUSD: '274508551351086793590',
        id: '2023-04-04'
      },
      {
        feesETH: '165419778691914403',
        feesUSD: '295303953813681276454',
        id: '2023-04-03'
      },
      {
        feesETH: '148073402238442363',
        feesUSD: '270120724392997532395',
        id: '2023-04-02'
      },
      {
        feesETH: '222416981962796489',
        feesUSD: '405445964875937258715',
        id: '2023-04-01'
      },
      {
        feesETH: '132890270660810057',
        feesUSD: '238985365882531915778',
        id: '2023-03-31'
      },
      {
        feesETH: '136330603226406787',
        feesUSD: '244991547221982053684',
        id: '2023-03-30'
      },
      {
        feesETH: '146537613612869499',
        feesUSD: '264443795348723748464',
        id: '2023-03-29'
      },
      {
        feesETH: '173722207508992698',
        feesUSD: '301075456234047115575',
        id: '2023-03-28'
      },
      {
        feesETH: '133514160454486100',
        feesUSD: '234292293659989008842',
        id: '2023-03-27'
      },
      {
        feesETH: '150998178047138947',
        feesUSD: '264743381288141948162',
        id: '2023-03-26'
      },
      {
        feesETH: '156188972127152637',
        feesUSD: '273518127989069698482',
        id: '2023-03-25'
      },
      {
        feesETH: '97741243486324154',
        feesUSD: '177417950351505878895',
        id: '2023-03-24'
      },
      {
        feesETH: '258237090712149443',
        feesUSD: '457724576056048469676',
        id: '2023-03-23'
      },
      {
        feesETH: '139619328680061894',
        feesUSD: '251573087382169524891',
        id: '2023-03-22'
      },
      {
        feesETH: '173848964218801114',
        feesUSD: '303774987627722126876',
        id: '2023-03-21'
      },
      {
        feesETH: '152667069382025533',
        feesUSD: '269768500215768718756',
        id: '2023-03-20'
      },
      {
        feesETH: '122355083345760777',
        feesUSD: '217176161807924962575',
        id: '2023-03-19'
      },
      {
        feesETH: '176984061776528891',
        feesUSD: '321237346009135102192',
        id: '2023-03-18'
      },
      {
        feesETH: '128982894940602312',
        feesUSD: '222938702216475987403',
        id: '2023-03-17'
      },
      {
        feesETH: '340970786339626444',
        feesUSD: '564035358847503799882',
        id: '2023-03-16'
      },
      {
        feesETH: '340908887643355548',
        feesUSD: '583315561291039945404',
        id: '2023-03-15'
      },
      {
        feesETH: '250402878618564269',
        feesUSD: '420851402093887709593',
        id: '2023-03-14'
      },
      {
        feesETH: '1573351468719317313',
        feesUSD: '2565887918968470200952',
        id: '2023-03-13'
      },
      {
        feesETH: '2541617335824245075',
        feesUSD: '3752488776314869734081',
        id: '2023-03-12'
      },
      {
        feesETH: '3194436091847512737',
        feesUSD: '4625421539713470831919',
        id: '2023-03-11'
      },
      {
        feesETH: '378755433093916695',
        feesUSD: '536725774053882873350',
        id: '2023-03-10'
      },
      {
        feesETH: '215457066244621256',
        feesUSD: '331411319242019034509',
        id: '2023-03-09'
      },
      {
        feesETH: '224770526214386789',
        feesUSD: '349322617905564941469',
        id: '2023-03-08'
      },
      {
        feesETH: '228629895495642790',
        feesUSD: '359666095325453048052',
        id: '2023-03-07'
      },
      {
        feesETH: '199049057146866954',
        feesUSD: '310998163273998331683',
        id: '2023-03-06'
      },
      {
        feesETH: '185036839458730230',
        feesUSD: '290694111945973813003',
        id: '2023-03-05'
      },
      {
        feesETH: '198079192218791135',
        feesUSD: '311178449391876498526',
        id: '2023-03-04'
      },
      {
        feesETH: '200116923357679058',
        feesUSD: '313229744375079481218',
        id: '2023-03-03'
      },
      {
        feesETH: '206886888916092710',
        feesUSD: '340937437046298255028',
        id: '2023-03-02'
      },
      {
        feesETH: '162625235584988900',
        feesUSD: '269249389838470233636',
        id: '2023-03-01'
      },
      {
        feesETH: '317865156386774336',
        feesUSD: '516755154264592253520',
        id: '2023-02-28'
      },
      {
        feesETH: '216655167266968758',
        feesUSD: '354643796582037134680',
        id: '2023-02-27'
      },
      {
        feesETH: '216288688126182675',
        feesUSD: '345806603703680973245',
        id: '2023-02-26'
      },
      {
        feesETH: '164787172459284808',
        feesUSD: '263749015389932910225',
        id: '2023-02-25'
      },
      {
        feesETH: '268171795423295935',
        feesUSD: '440707130642894255267',
        id: '2023-02-24'
      },
      {
        feesETH: '207167474250633211',
        feesUSD: '345081341683819709878',
        id: '2023-02-23'
      },
      {
        feesETH: '211889992418757544',
        feesUSD: '346469802203607211641',
        id: '2023-02-22'
      },
      {
        feesETH: '197898936795618956',
        feesUSD: '337670997875628713141',
        id: '2023-02-21'
      },
      {
        feesETH: '185978296985392578',
        feesUSD: '315116813963245071759',
        id: '2023-02-20'
      },
      {
        feesETH: '173537702424784511',
        feesUSD: '294117229451900926190',
        id: '2023-02-19'
      },
      {
        feesETH: '169904413916444617',
        feesUSD: '288427915087327475864',
        id: '2023-02-18'
      },
      {
        feesETH: '68712558723365214',
        feesUSD: '113719303401034798248',
        id: '2023-02-17'
      },
      {
        feesETH: '217730435504565792',
        feesUSD: '368055579418437835319',
        id: '2023-02-16'
      },
      {
        feesETH: '216321541663441591',
        feesUSD: '335173035571371335232',
        id: '2023-02-15'
      },
      {
        feesETH: '273346525678622953',
        feesUSD: '411233447091947516733',
        id: '2023-02-14'
      },
      {
        feesETH: '193220774831040155',
        feesUSD: '293421204242920959031',
        id: '2023-02-13'
      },
      {
        feesETH: '165887298884582719',
        feesUSD: '254341339348174983758',
        id: '2023-02-12'
      },
      {
        feesETH: '145331463693250876',
        feesUSD: '220658931047190069590',
        id: '2023-02-11'
      },
      {
        feesETH: '237778506927970895',
        feesUSD: '366902404044100954719',
        id: '2023-02-10'
      },
      {
        feesETH: '190280846252644354',
        feesUSD: '311023557242259829105',
        id: '2023-02-09'
      },
      {
        feesETH: '168395189307975235',
        feesUSD: '281896072829390163349',
        id: '2023-02-08'
      },
      {
        feesETH: '184888757035542855',
        feesUSD: '302150235721675501965',
        id: '2023-02-07'
      },
      {
        feesETH: '187753270769120432',
        feesUSD: '305441683071283027154',
        id: '2023-02-06'
      },
      {
        feesETH: '174377210237800177',
        feesUSD: '290808873513579356792',
        id: '2023-02-05'
      },
      {
        feesETH: '72451836855794948',
        feesUSD: '119861420820752931111',
        id: '2023-02-04'
      },
      {
        feesETH: '250516581770731271',
        feesUSD: '412001567489379007088',
        id: '2023-02-03'
      },
      {
        feesETH: '152247806878164524',
        feesUSD: '253646368737090879409',
        id: '2023-02-02'
      },
      {
        feesETH: '167455379224763263',
        feesUSD: '264186221844247639027',
        id: '2023-02-01'
      },
      {
        feesETH: '122159031091613661',
        feesUSD: '191486724416726245951',
        id: '2023-01-31'
      },
      {
        feesETH: '247455268438068125',
        feesUSD: '398003078109778812425',
        id: '2023-01-30'
      },
      {
        feesETH: '194075785216204959',
        feesUSD: '309317986477587464508',
        id: '2023-01-29'
      },
      {
        feesETH: '198965949424851292',
        feesUSD: '317958820798416892200',
        id: '2023-01-28'
      },
      {
        feesETH: '211999797368191861',
        feesUSD: '335580510648346022971',
        id: '2023-01-27'
      },
      {
        feesETH: '198663504936613540',
        feesUSD: '320311128914450109441',
        id: '2023-01-26'
      },
      {
        feesETH: '200013709815421000',
        feesUSD: '311373342892254796388',
        id: '2023-01-25'
      },
      {
        feesETH: '155313471487855257',
        feesUSD: '254081679591967363833',
        id: '2023-01-24'
      },
      {
        feesETH: '124149594765518883',
        feesUSD: '203256118471693774589',
        id: '2023-01-23'
      },
      {
        feesETH: '135560025730012398',
        feesUSD: '220797458708529593660',
        id: '2023-01-22'
      },
      {
        feesETH: '86084401190932673',
        feesUSD: '142342666437036353166',
        id: '2023-01-21'
      },
      {
        feesETH: '218186143762151689',
        feesUSD: '342729253761845293376',
        id: '2023-01-20'
      },
      {
        feesETH: '185798088129948194',
        feesUSD: '284460699288079270499',
        id: '2023-01-19'
      },
      {
        feesETH: '240270919881912873',
        feesUSD: '379779120388102504613',
        id: '2023-01-18'
      },
      {
        feesETH: '124441472526377572',
        feesUSD: '194310381691037524902',
        id: '2023-01-17'
      },
      {
        feesETH: '191624962587230187',
        feesUSD: '300578293309988151833',
        id: '2023-01-16'
      },
      {
        feesETH: '138359559605776605',
        feesUSD: '211173740648477526281',
        id: '2023-01-15'
      },
      {
        feesETH: '152815450415397846',
        feesUSD: '237465826256253778907',
        id: '2023-01-14'
      },
      {
        feesETH: '176253808990907124',
        feesUSD: '248497340032482295514',
        id: '2023-01-13'
      },
      {
        feesETH: '187731470319263966',
        feesUSD: '262772310591951491881',
        id: '2023-01-12'
      },
      {
        feesETH: '111484561752730799',
        feesUSD: '148689961141688927686',
        id: '2023-01-11'
      },
      {
        feesETH: '259178678983841000',
        feesUSD: '344581319111942133226',
        id: '2023-01-10'
      },
      {
        feesETH: '154199211609260040',
        feesUSD: '201709530698189151756',
        id: '2023-01-09'
      },
      {
        feesETH: '170822444614651366',
        feesUSD: '215880280830657957374',
        id: '2023-01-08'
      },
      {
        feesETH: '114879517937663040',
        feesUSD: '145245287865766263641',
        id: '2023-01-07'
      },
      {
        feesETH: '240034704828930348',
        feesUSD: '299944433453525474074',
        id: '2023-01-06'
      },
      {
        feesETH: '206208624420979780',
        feesUSD: '257997920444308852804',
        id: '2023-01-05'
      },
      {
        feesETH: '161879369217273379',
        feesUSD: '202329785997285651931',
        id: '2023-01-04'
      },
      {
        feesETH: '168626801242781655',
        feesUSD: '205154738927993018191',
        id: '2023-01-03'
      },
      {
        feesETH: '151617259410996718',
        feesUSD: '182011235856727787115',
        id: '2023-01-02'
      },
      {
        feesETH: '161872772538967783',
        feesUSD: '193232414456883406562',
        id: '2023-01-01'
      },
      {
        feesETH: '76479276989455237',
        feesUSD: '91349728654189479422',
        id: '2022-12-31'
      },
      {
        feesETH: '275525818038484737',
        feesUSD: '329218411662621253300',
        id: '2022-12-30'
      },
      {
        feesETH: '212005655560437266',
        feesUSD: '252928187998866018094',
        id: '2022-12-29'
      },
      {
        feesETH: '117021135836225129',
        feesUSD: '139566427866432262687',
        id: '2022-12-28'
      },
      {
        feesETH: '280778042817148727',
        feesUSD: '342195900385402396079',
        id: '2022-12-27'
      },
      {
        feesETH: '169449224578218005',
        feesUSD: '206534881869406797709',
        id: '2022-12-26'
      },
      {
        feesETH: '169941742288532764',
        feesUSD: '207159816695113795666',
        id: '2022-12-25'
      },
      {
        feesETH: '171339725452453965',
        feesUSD: '208440851611630765516',
        id: '2022-12-24'
      },
      {
        feesETH: '179724223380459954',
        feesUSD: '219477424349983891923',
        id: '2022-12-23'
      },
      {
        feesETH: '182613276873136008',
        feesUSD: '221226864384736156348',
        id: '2022-12-22'
      },
      {
        feesETH: '187420498130314233',
        feesUSD: '227106788609408272515',
        id: '2022-12-21'
      },
      {
        feesETH: '175797496357144507',
        feesUSD: '212973340172540949013',
        id: '2022-12-20'
      },
      {
        feesETH: '165841899746516369',
        feesUSD: '195894194680436051634',
        id: '2022-12-19'
      },
      {
        feesETH: '181347438937917793',
        feesUSD: '214985575386512164942',
        id: '2022-12-18'
      },
      {
        feesETH: '176020125509729972',
        feesUSD: '207976579296021449255',
        id: '2022-12-17'
      },
      {
        feesETH: '159311013071302099',
        feesUSD: '202500228714932098240',
        id: '2022-12-16'
      },
      {
        feesETH: '146453260883522233',
        feesUSD: '188902375494441955384',
        id: '2022-12-15'
      },
      {
        feesETH: '165653937464142278',
        feesUSD: '219083859061464250258',
        id: '2022-12-14'
      },
      {
        feesETH: '182976114546180595',
        feesUSD: '231891119247811053835',
        id: '2022-12-13'
      },
      {
        feesETH: '165353510675993179',
        feesUSD: '206034021523672252301',
        id: '2022-12-12'
      },
      {
        feesETH: '173698677873066883',
        feesUSD: '221392860843453588116',
        id: '2022-12-11'
      },
      {
        feesETH: '169722684036220828',
        feesUSD: '214684768875979042519',
        id: '2022-12-10'
      },
      {
        feesETH: '96645851422723491',
        feesUSD: '123600724056486836240',
        id: '2022-12-09'
      },
      {
        feesETH: '215290752028313394',
        feesUSD: '267531576900169921527',
        id: '2022-12-08'
      },
      {
        feesETH: '213109815912831363',
        feesUSD: '266129632954225000779',
        id: '2022-12-07'
      },
      {
        feesETH: '190223026610230915',
        feesUSD: '239941178047064234101',
        id: '2022-12-06'
      },
      {
        feesETH: '183230894437509618',
        feesUSD: '237299427176341872647',
        id: '2022-12-05'
      },
      {
        feesETH: '187782221179488335',
        feesUSD: '235999062111745555620',
        id: '2022-12-04'
      },
      {
        feesETH: '183129364715386233',
        feesUSD: '235313908484682695040',
        id: '2022-12-03'
      },
      {
        feesETH: '216924993806095064',
        feesUSD: '275966663794023853257',
        id: '2022-12-02'
      },
      {
        feesETH: '174982153870714233',
        feesUSD: '224886335780927516825',
        id: '2022-12-01'
      },
      {
        feesETH: '330623947535365128',
        feesUSD: '421485208031265028178',
        id: '2022-11-30'
      },
      {
        feesETH: '266414625933673320',
        feesUSD: '320652664826040402658',
        id: '2022-11-29'
      },
      {
        feesETH: '251586184932422817',
        feesUSD: '294949579767375214453',
        id: '2022-11-28'
      },
      {
        feesETH: '248614935832606368',
        feesUSD: '302589238401865211563',
        id: '2022-11-27'
      },
      {
        feesETH: '230302183772388241',
        feesUSD: '279971637224700026000',
        id: '2022-11-26'
      },
      {
        feesETH: '239871760862808604',
        feesUSD: '283335955247976305881',
        id: '2022-11-25'
      },
      {
        feesETH: '350405100663783838',
        feesUSD: '423034014696237370351',
        id: '2022-11-24'
      },
      {
        feesETH: '259723894180362141',
        feesUSD: '301676745426733586870',
        id: '2022-11-23'
      },
      {
        feesETH: '772251830672200620',
        feesUSD: '839977841372224452463',
        id: '2022-11-22'
      },
      {
        feesETH: '1882053273950406396',
        feesUSD: '2113459681543699827540',
        id: '2022-11-21'
      },
      {
        feesETH: '242365327745518194',
        feesUSD: '295360943701037561153',
        id: '2022-11-20'
      },
      {
        feesETH: '244033118336689068',
        feesUSD: '294297790542592071659',
        id: '2022-11-19'
      },
      {
        feesETH: '238040160144356902',
        feesUSD: '289911491441413715256',
        id: '2022-11-18'
      },
      {
        feesETH: '227946442043029921',
        feesUSD: '274700536770475788257',
        id: '2022-11-17'
      },
      {
        feesETH: '224664689304834859',
        feesUSD: '280136647741091634305',
        id: '2022-11-16'
      },
      {
        feesETH: '209084845291000228',
        feesUSD: '262237327981086478921',
        id: '2022-11-15'
      },
      {
        feesETH: '154254090832591845',
        feesUSD: '190519227587334188249',
        id: '2022-11-14'
      },
      {
        feesETH: '166135360131848123',
        feesUSD: '207944984862629022459',
        id: '2022-11-13'
      },
      {
        feesETH: '163785826489183685',
        feesUSD: '207067868997215366488',
        id: '2022-11-12'
      },
      {
        feesETH: '372941316901371598',
        feesUSD: '470865461178678739364',
        id: '2022-11-11'
      },
      {
        feesETH: '3366057554264019845',
        feesUSD: '4039151298655067541560',
        id: '2022-11-10'
      },
      {
        feesETH: '101096316835959228',
        feesUSD: '131257392000799304110',
        id: '2022-11-09'
      },
      {
        feesETH: '141737174594063720',
        feesUSD: '204590595515151093311',
        id: '2022-11-08'
      },
      {
        feesETH: '181209614791953557',
        feesUSD: '287712611372465183516',
        id: '2022-11-07'
      },
      {
        feesETH: '130867091670191107',
        feesUSD: '211517326369620635466',
        id: '2022-11-06'
      },
      {
        feesETH: '135820018292587580',
        feesUSD: '224705916329674556614',
        id: '2022-11-05'
      },
      {
        feesETH: '118671975332486816',
        feesUSD: '187608525803128407585',
        id: '2022-11-04'
      },
      {
        feesETH: '124536673050789326',
        feesUSD: '192796625358380784193',
        id: '2022-11-03'
      },
      {
        feesETH: '132212643424962442',
        feesUSD: '209884927184259377800',
        id: '2022-11-02'
      },
      {
        feesETH: '132090904765166604',
        feesUSD: '210717738875594731516',
        id: '2022-11-01'
      },
      {
        feesETH: '102160436762027579',
        feesUSD: '162175044254821868203',
        id: '2022-10-31'
      },
      {
        feesETH: '694202745574054617',
        feesUSD: '1113577605422126650744',
        id: '2022-10-30'
      },
      {
        feesETH: '64763234520579992',
        feesUSD: '102760283733563226218',
        id: '2022-10-29'
      },
      {
        feesETH: '164759557437571626',
        feesUSD: '251172183129811471787',
        id: '2022-10-28'
      },
      {
        feesETH: '120539697930061868',
        feesUSD: '188467628655898245521',
        id: '2022-10-27'
      },
      {
        feesETH: '111648961138688764',
        feesUSD: '166621818612339460176',
        id: '2022-10-26'
      },
      {
        feesETH: '142361289844597935',
        feesUSD: '191362025632007263804',
        id: '2022-10-25'
      },
      {
        feesETH: '187568702259998554',
        feesUSD: '251661907321008758636',
        id: '2022-10-24'
      },
      {
        feesETH: '190006606391048588',
        feesUSD: '252943768078732635822',
        id: '2022-10-23'
      },
      {
        feesETH: '0',
        feesUSD: '0',
        id: '2022-10-22'
      },
      {
        feesETH: '138650116088436420',
        feesUSD: '178464883424391823335',
        id: '2022-10-21'
      },
      {
        feesETH: '147937441500781542',
        feesUSD: '191106051504574639380',
        id: '2022-10-20'
      },
      {
        feesETH: '154711299572826462',
        feesUSD: '200638895964015725925',
        id: '2022-10-19'
      },
      {
        feesETH: '124857409339249703',
        feesUSD: '166840143897265867209',
        id: '2022-10-18'
      },
      {
        feesETH: '143051161346891290',
        feesUSD: '186985774078618511128',
        id: '2022-10-17'
      },
      {
        feesETH: '146695671254254766',
        feesUSD: '188159301777319280392',
        id: '2022-10-16'
      },
      {
        feesETH: '216171664558597640',
        feesUSD: '279953281536766954837',
        id: '2022-10-15'
      },
      {
        feesETH: '114500595420900198',
        feesUSD: '151802927252400964163',
        id: '2022-10-14'
      },
      {
        feesETH: '80525126720597411',
        feesUSD: '103425667508668108826',
        id: '2022-10-13'
      },
      {
        feesETH: '310845244227480849',
        feesUSD: '403524349986970537384',
        id: '2022-10-12'
      },
      {
        feesETH: '153703154645394365',
        feesUSD: '196784400428429453245',
        id: '2022-10-11'
      },
      {
        feesETH: '157396363851756576',
        feesUSD: '206848330831313686635',
        id: '2022-10-10'
      },
      {
        feesETH: '167793154908407057',
        feesUSD: '221008753987608355438',
        id: '2022-10-09'
      },
      {
        feesETH: '92801682528159594',
        feesUSD: '123513622073449510364',
        id: '2022-10-08'
      },
      {
        feesETH: '143081211427306511',
        feesUSD: '191576684408993301494',
        id: '2022-10-07'
      },
      {
        feesETH: '69780937130180504',
        feesUSD: '95492240187596951282',
        id: '2022-10-06'
      },
      {
        feesETH: '71432874695865054',
        feesUSD: '97023716342233648911',
        id: '2022-10-05'
      },
      {
        feesETH: '78773049246257133',
        feesUSD: '105429849111190547926',
        id: '2022-10-04'
      },
      {
        feesETH: '82150095943085445',
        feesUSD: '106117586365633624287',
        id: '2022-10-03'
      },
      {
        feesETH: '86959274222569353',
        feesUSD: '114361880715585407678',
        id: '2022-10-02'
      },
      {
        feesETH: '86027332137517209',
        feesUSD: '114178270865492419324',
        id: '2022-10-01'
      },
      {
        feesETH: '85168182879008970',
        feesUSD: '113553366164639661683',
        id: '2022-09-30'
      },
      {
        feesETH: '88288075930165516',
        feesUSD: '117307351232042092917',
        id: '2022-09-29'
      },
      {
        feesETH: '90567554264078780',
        feesUSD: '116058412554012390741',
        id: '2022-09-28'
      },
      {
        feesETH: '74390395878775213',
        feesUSD: '103032280075920551434',
        id: '2022-09-27'
      },
      {
        feesETH: '69658816809789003',
        feesUSD: '89409281403286455378',
        id: '2022-09-26'
      },
      {
        feesETH: '66676806942159440',
        feesUSD: '88501459181768663178',
        id: '2022-09-25'
      },
      {
        feesETH: '66445897762112365',
        feesUSD: '87979095025439929789',
        id: '2022-09-24'
      },
      {
        feesETH: '63469715830456846',
        feesUSD: '85262042760844204099',
        id: '2022-09-23'
      },
      {
        feesETH: '84597303315380997',
        feesUSD: '107333674554422793820',
        id: '2022-09-22'
      },
      {
        feesETH: '83218862296017532',
        feesUSD: '110595371425538420323',
        id: '2022-09-21'
      },
      {
        feesETH: '81259016163137930',
        feesUSD: '110552858216819805773',
        id: '2022-09-20'
      },
      {
        feesETH: '84287491966952018',
        feesUSD: '109119429975335752781',
        id: '2022-09-19'
      },
      {
        feesETH: '76366621303039937',
        feesUSD: '111053272633598085882',
        id: '2022-09-18'
      },
      {
        feesETH: '992844255545965552',
        feesUSD: '1429118200752686294735',
        id: '2022-09-17'
      },
      {
        feesETH: '50176673802990450',
        feesUSD: '73779363862097108836',
        id: '2022-09-16'
      },
      {
        feesETH: '234716579673904446',
        feesUSD: '374576786012658728458',
        id: '2022-09-15'
      },
      {
        feesETH: '172227959354708364',
        feesUSD: '275964212472942229359',
        id: '2022-09-14'
      },
      {
        feesETH: '62033026715124644',
        feesUSD: '106090743279007620319',
        id: '2022-09-13'
      },
      {
        feesETH: '56592448360261008',
        feesUSD: '98267693257240817499',
        id: '2022-09-12'
      },
      {
        feesETH: '59336665583790108',
        feesUSD: '104135254732895803052',
        id: '2022-09-11'
      },
      {
        feesETH: '59442745675285912',
        feesUSD: '103056482604699939212',
        id: '2022-09-10'
      },
      {
        feesETH: '60597488485836039',
        feesUSD: '103664463211944248868',
        id: '2022-09-09'
      },
      {
        feesETH: '67265533866732899',
        feesUSD: '109344161232406331500',
        id: '2022-09-08'
      },
      {
        feesETH: '71550141808973881',
        feesUSD: '108720440478735812292',
        id: '2022-09-07'
      },
      {
        feesETH: '69365531952580284',
        feesUSD: '115454072347833202175',
        id: '2022-09-06'
      },
      {
        feesETH: '77915518453282158',
        feesUSD: '122197382686586958673',
        id: '2022-09-05'
      },
      {
        feesETH: '83932927932934788',
        feesUSD: '129915582500993112444',
        id: '2022-09-04'
      },
      {
        feesETH: '89075173149900380',
        feesUSD: '139364343655139638031',
        id: '2022-09-03'
      },
      {
        feesETH: '78767495631973593',
        feesUSD: '125116046095710050837',
        id: '2022-09-02'
      },
      {
        feesETH: '89580894891456298',
        feesUSD: '138846239486323788265',
        id: '2022-09-01'
      },
      {
        feesETH: '95947822616091365',
        feesUSD: '151931458156128356122',
        id: '2022-08-31'
      },
      {
        feesETH: '102288931851839147',
        feesUSD: '161573495319120259878',
        id: '2022-08-30'
      },
      {
        feesETH: '101257100722193197',
        feesUSD: '147098094873295210090',
        id: '2022-08-29'
      },
      {
        feesETH: '105723350639030403',
        feesUSD: '158017291565614012572',
        id: '2022-08-28'
      },
      {
        feesETH: '94718683300478406',
        feesUSD: '142008473021570068140',
        id: '2022-08-27'
      },
      {
        feesETH: '91498901256460996',
        feesUSD: '151765401006251594581',
        id: '2022-08-26'
      },
      {
        feesETH: '94757393355330004',
        feesUSD: '161321606966200915100',
        id: '2022-08-25'
      },
      {
        feesETH: '87937099242272097',
        feesUSD: '144630147123764918919',
        id: '2022-08-24'
      },
      {
        feesETH: '97223368275787663',
        feesUSD: '153070881470425291828',
        id: '2022-08-23'
      },
      {
        feesETH: '103560662174115482',
        feesUSD: '163925821459652224786',
        id: '2022-08-22'
      },
      {
        feesETH: '94642754177718329',
        feesUSD: '148513409855675603005',
        id: '2022-08-21'
      },
      {
        feesETH: '95406204301837032',
        feesUSD: '157409244737679719503',
        id: '2022-08-20'
      },
      {
        feesETH: '95556413773509461',
        feesUSD: '167622194349077092040',
        id: '2022-08-19'
      },
      {
        feesETH: '91666506399236278',
        feesUSD: '168674380389426023622',
        id: '2022-08-18'
      },
      {
        feesETH: '87317973651892436',
        feesUSD: '170505881028041508375',
        id: '2022-08-17'
      },
      {
        feesETH: '140494316740156514',
        feesUSD: '263644552259208267912',
        id: '2022-08-16'
      },
      {
        feesETH: '89678727614096778',
        feesUSD: '170404865926411271005',
        id: '2022-08-15'
      },
      {
        feesETH: '176131393802849513',
        feesUSD: '346774516780924429405',
        id: '2022-08-14'
      },
      {
        feesETH: '69199216241835981',
        feesUSD: '138602460853431528784',
        id: '2022-08-13'
      },
      {
        feesETH: '136003798793790198',
        feesUSD: '256489863896043022455',
        id: '2022-08-12'
      },
      {
        feesETH: '94660849989824551',
        feesUSD: '178277843470737860655',
        id: '2022-08-11'
      },
      {
        feesETH: '122618901257481736',
        feesUSD: '209468974366581037845',
        id: '2022-08-10'
      },
      {
        feesETH: '91442635046244383',
        feesUSD: '162263127036859734064',
        id: '2022-08-09'
      },
      {
        feesETH: '92785171538288685',
        feesUSD: '160999991663961779399',
        id: '2022-08-08'
      },
      {
        feesETH: '94903751550799894',
        feesUSD: '159737249422728841690',
        id: '2022-08-07'
      },
      {
        feesETH: '91515552043789410',
        feesUSD: '157609080622449868500',
        id: '2022-08-06'
      },
      {
        feesETH: '84824044394080042',
        feesUSD: '141082020161726986973',
        id: '2022-08-05'
      },
      {
        feesETH: '172800712039041275',
        feesUSD: '280024910171868634702',
        id: '2022-08-04'
      },
      {
        feesETH: '96707656603940658',
        feesUSD: '158230135947017176657',
        id: '2022-08-03'
      },
      {
        feesETH: '83657288311666698',
        feesUSD: '132719465399901453229',
        id: '2022-08-02'
      },
      {
        feesETH: '506748027848870388',
        feesUSD: '849534851150806747324',
        id: '2022-08-01'
      },
      {
        feesETH: '101614279369357908',
        feesUSD: '172887551061819238364',
        id: '2022-07-31'
      },
      {
        feesETH: '95338030715320605',
        feesUSD: '163551521002312906535',
        id: '2022-07-30'
      },
      {
        feesETH: '139084893489104578',
        feesUSD: '239736505193795550559',
        id: '2022-07-29'
      },
      {
        feesETH: '78190518339397738',
        feesUSD: '128033051437075154911',
        id: '2022-07-28'
      },
      {
        feesETH: '231227761211576674',
        feesUSD: '347618473120526077023',
        id: '2022-07-27'
      },
      {
        feesETH: '243268672907037764',
        feesUSD: '344053121628066867550',
        id: '2022-07-26'
      },
      {
        feesETH: '120752301168369885',
        feesUSD: '183286407555736429189',
        id: '2022-07-25'
      },
      {
        feesETH: '85629521701860925',
        feesUSD: '138064759315995463544',
        id: '2022-07-24'
      },
      {
        feesETH: '322627436570412077',
        feesUSD: '501951218137814978072',
        id: '2022-07-23'
      },
      {
        feesETH: '100951043465826372',
        feesUSD: '160791904547212084024',
        id: '2022-07-22'
      },
      {
        feesETH: '2333246992486908136',
        feesUSD: '3473782836483238040373',
        id: '2022-07-21'
      },
      {
        feesETH: '133425188182787249',
        feesUSD: '209581617093758555219',
        id: '2022-07-20'
      },
      {
        feesETH: '123100490108048243',
        feesUSD: '186223553194035865395',
        id: '2022-07-19'
      },
      {
        feesETH: '154298338762135137',
        feesUSD: '224921229644569664997',
        id: '2022-07-18'
      },
      {
        feesETH: '101423108776204615',
        feesUSD: '138977461971846783932',
        id: '2022-07-17'
      },
      {
        feesETH: '257361376785240126',
        feesUSD: '324867695414567695919',
        id: '2022-07-16'
      },
      {
        feesETH: '142835617415333296',
        feesUSD: '170884961785269372735',
        id: '2022-07-15'
      },
      {
        feesETH: '171126354171058559',
        feesUSD: '188616506793731935486',
        id: '2022-07-14'
      },
      {
        feesETH: '198864100432255447',
        feesUSD: '210426059231386778756',
        id: '2022-07-13'
      },
      {
        feesETH: '192089414519473468',
        feesUSD: '207062779978577044607',
        id: '2022-07-12'
      },
      {
        feesETH: '196471632390380999',
        feesUSD: '223971570304430237300',
        id: '2022-07-11'
      },
      {
        feesETH: '183000093737836056',
        feesUSD: '217521231420541449802',
        id: '2022-07-10'
      },
      {
        feesETH: '164210219307314726',
        feesUSD: '199968601570309612766',
        id: '2022-07-09'
      },
      {
        feesETH: '171625539177230928',
        feesUSD: '213574253462929712248',
        id: '2022-07-08'
      },
      {
        feesETH: '170877548507279422',
        feesUSD: '199480741351912924595',
        id: '2022-07-07'
      },
      {
        feesETH: '182443218029713671',
        feesUSD: '206235421861266622885',
        id: '2022-07-06'
      },
      {
        feesETH: '175087776561978245',
        feesUSD: '204039415855384157905',
        id: '2022-07-05'
      },
      {
        feesETH: '212826467632797690',
        feesUSD: '222859741286617822500',
        id: '2022-07-04'
      },
      {
        feesETH: '178790092029657716',
        feesUSD: '189961790930130878498',
        id: '2022-07-03'
      },
      {
        feesETH: '298930950548924688',
        feesUSD: '313207892747141331615',
        id: '2022-07-02'
      },
      {
        feesETH: '260007641334322881',
        feesUSD: '273830937788774232170',
        id: '2022-07-01'
      },
      {
        feesETH: '208250538976502884',
        feesUSD: '220839284057632484251',
        id: '2022-06-30'
      },
      {
        feesETH: '206164804269683608',
        feesUSD: '230801071925951519291',
        id: '2022-06-29'
      },
      {
        feesETH: '203865423878281386',
        feesUSD: '244147192982391005679',
        id: '2022-06-28'
      },
      {
        feesETH: '211939032398858253',
        feesUSD: '258432097936195788537',
        id: '2022-06-27'
      },
      {
        feesETH: '73160627319114652',
        feesUSD: '91339579995368261506',
        id: '2022-06-26'
      },
      {
        feesETH: '340568367250928708',
        feesUSD: '416195634050833745145',
        id: '2022-06-25'
      },
      {
        feesETH: '177605987163790135',
        feesUSD: '201380662056910694425',
        id: '2022-06-24'
      },
      {
        feesETH: '189376359763829716',
        feesUSD: '208661501360379315297',
        id: '2022-06-23'
      },
      {
        feesETH: '205484375624869837',
        feesUSD: '221857576159035091320',
        id: '2022-06-22'
      },
      {
        feesETH: '207911148952599205',
        feesUSD: '240363532392525272265',
        id: '2022-06-21'
      },
      {
        feesETH: '235474548418518189',
        feesUSD: '254851237142723681265',
        id: '2022-06-20'
      },
      {
        feesETH: '133821291604335052',
        feesUSD: '127999100568034010240',
        id: '2022-06-19'
      },
      {
        feesETH: '1743595934683759129',
        feesUSD: '1629188497403475602668',
        id: '2022-06-18'
      },
      {
        feesETH: '492860749226900098',
        feesUSD: '539899429182353101173',
        id: '2022-06-17'
      },
      {
        feesETH: '161714513483886434',
        feesUSD: '189957144691279780785',
        id: '2022-06-16'
      },
      {
        feesETH: '167534638757220320',
        feesUSD: '189469949009703176713',
        id: '2022-06-15'
      },
      {
        feesETH: '127071318240292032',
        feesUSD: '155790695154722040215',
        id: '2022-06-14'
      },
      {
        feesETH: '1068330153980325997',
        feesUSD: '1321797324620957176287',
        id: '2022-06-13'
      },
      {
        feesETH: '164852639766361612',
        feesUSD: '241101931237496848955',
        id: '2022-06-12'
      },
      {
        feesETH: '150633432698676234',
        feesUSD: '250715046074980181492',
        id: '2022-06-11'
      },
      {
        feesETH: '143994817819772185',
        feesUSD: '257793922342738143624',
        id: '2022-06-10'
      },
      {
        feesETH: '168356376200490287',
        feesUSD: '302266122696671652928',
        id: '2022-06-09'
      },
      {
        feesETH: '171228400456147899',
        feesUSD: '308712820034402733309',
        id: '2022-06-08'
      },
      {
        feesETH: '180048467459097287',
        feesUSD: '315941581581003724469',
        id: '2022-06-07'
      },
      {
        feesETH: '88082761140171799',
        feesUSD: '166039970760984456192',
        id: '2022-06-06'
      },
      {
        feesETH: '257217463497797718',
        feesUSD: '462711577098351165589',
        id: '2022-06-05'
      },
      {
        feesETH: '187405885956843622',
        feesUSD: '331642022072922326196',
        id: '2022-06-04'
      },
      {
        feesETH: '191112198341005287',
        feesUSD: '347471479957657829323',
        id: '2022-06-03'
      },
      {
        feesETH: '196547751577387788',
        feesUSD: '358099425293904784987',
        id: '2022-06-02'
      },
      {
        feesETH: '178820559593958335',
        feesUSD: '346263724854739034559',
        id: '2022-06-01'
      },
      {
        feesETH: '187174508847414330',
        feesUSD: '367706874848760840671',
        id: '2022-05-31'
      },
      {
        feesETH: '198449109330297982',
        feesUSD: '378591407394341575215',
        id: '2022-05-30'
      },
      {
        feesETH: '226317861271943751',
        feesUSD: '403053442444749365476',
        id: '2022-05-29'
      },
      {
        feesETH: '128592668585484901',
        feesUSD: '227074900270826796536',
        id: '2022-05-28'
      },
      {
        feesETH: '147971750821154606',
        feesUSD: '260792872394138949333',
        id: '2022-05-27'
      },
      {
        feesETH: '137161215269301473',
        feesUSD: '263111558608566591463',
        id: '2022-05-26'
      },
      {
        feesETH: '143561889057784323',
        feesUSD: '285034148683199161756',
        id: '2022-05-25'
      },
      {
        feesETH: '143413059603365829',
        feesUSD: '283709509619349194613',
        id: '2022-05-24'
      },
      {
        feesETH: '147695844336287517',
        feesUSD: '303483943983760227328',
        id: '2022-05-23'
      },
      {
        feesETH: '168030333954919385',
        feesUSD: '331581034957385122439',
        id: '2022-05-22'
      },
      {
        feesETH: '179919849641087045',
        feesUSD: '354068929909746676156',
        id: '2022-05-21'
      },
      {
        feesETH: '175265843323160562',
        feesUSD: '351369457377405833257',
        id: '2022-05-20'
      },
      {
        feesETH: '190160409850252932',
        feesUSD: '372976475126830126221',
        id: '2022-05-19'
      },
      {
        feesETH: '196276211911922311',
        feesUSD: '398943177283696814115',
        id: '2022-05-18'
      },
      {
        feesETH: '241134625519369742',
        feesUSD: '493857123031559340520',
        id: '2022-05-17'
      },
      {
        feesETH: '256776105777508952',
        feesUSD: '515383383250650680305',
        id: '2022-05-16'
      },
      {
        feesETH: '394851224133207930',
        feesUSD: '806703168378399696507',
        id: '2022-05-15'
      },
      {
        feesETH: '217984796923639932',
        feesUSD: '444824163426526096653',
        id: '2022-05-14'
      },
      {
        feesETH: '238280876039447139',
        feesUSD: '498307264826254224299',
        id: '2022-05-13'
      },
      {
        feesETH: '3100147393781056385',
        feesUSD: '5873607657240771018627',
        id: '2022-05-12'
      },
      {
        feesETH: '3896088224320672486',
        feesUSD: '8451917009799294048257',
        id: '2022-05-11'
      },
      {
        feesETH: '648497283940041140',
        feesUSD: '1563003925565679471351',
        id: '2022-05-10'
      },
      {
        feesETH: '251771152388119235',
        feesUSD: '618042789459307337265',
        id: '2022-05-09'
      },
      {
        feesETH: '255431531403302391',
        feesUSD: '654913321638820192026',
        id: '2022-05-08'
      },
      {
        feesETH: '253683584698400578',
        feesUSD: '677341263569165283302',
        id: '2022-05-07'
      },
      {
        feesETH: '258593476157134595',
        feesUSD: '709678665305651343610',
        id: '2022-05-06'
      },
      {
        feesETH: '252989782061668228',
        feesUSD: '741255001645046677194',
        id: '2022-05-05'
      },
      {
        feesETH: '270504166078658130',
        feesUSD: '760893936969029426483',
        id: '2022-05-04'
      },
      {
        feesETH: '180555127297084427',
        feesUSD: '512772950421173833241',
        id: '2022-05-03'
      },
      {
        feesETH: '185315359695268559',
        feesUSD: '529757312453670327097',
        id: '2022-05-02'
      },
      {
        feesETH: '193944375498344583',
        feesUSD: '538602768142236908024',
        id: '2022-05-01'
      },
      {
        feesETH: '192899045017666029',
        feesUSD: '545932227484201826191',
        id: '2022-04-30'
      },
      {
        feesETH: '187765787822080919',
        feesUSD: '548600201836485936669',
        id: '2022-04-29'
      },
      {
        feesETH: '191481384602426797',
        feesUSD: '553212697882563308060',
        id: '2022-04-28'
      },
      {
        feesETH: '191448130869880305',
        feesUSD: '544664658210901849019',
        id: '2022-04-27'
      },
      {
        feesETH: '63226026663199633',
        feesUSD: '189437439535646595436',
        id: '2022-04-26'
      },
      {
        feesETH: '315671387739355187',
        feesUSD: '913897063817455452639',
        id: '2022-04-25'
      },
      {
        feesETH: '202710422477670833',
        feesUSD: '598728968939712259323',
        id: '2022-04-24'
      },
      {
        feesETH: '205041693994522998',
        feesUSD: '605846945330316828620',
        id: '2022-04-23'
      },
      {
        feesETH: '206835396191084673',
        feesUSD: '623221157191769024652',
        id: '2022-04-22'
      },
      {
        feesETH: '79571252390220630',
        feesUSD: '244942999822260177514',
        id: '2022-04-21'
      },
      {
        feesETH: '1315521596097034256',
        feesUSD: '4059465632836473650976',
        id: '2022-04-20'
      },
      {
        feesETH: '235227373780640967',
        feesUSD: '717139542120777057920',
        id: '2022-04-19'
      },
      {
        feesETH: '834067619679188440',
        feesUSD: '2435866583602762781816',
        id: '2022-04-18'
      },
      {
        feesETH: '242602342800504590',
        feesUSD: '738496402620185894588',
        id: '2022-04-17'
      },
      {
        feesETH: '247047382237825939',
        feesUSD: '750358788990277834098',
        id: '2022-04-16'
      },
      {
        feesETH: '252173824387323398',
        feesUSD: '762313905908147012878',
        id: '2022-04-15'
      },
      {
        feesETH: '249990604439543077',
        feesUSD: '777050795591520539085',
        id: '2022-04-14'
      },
      {
        feesETH: '264958195042136673',
        feesUSD: '807415258125641613425',
        id: '2022-04-13'
      },
      {
        feesETH: '274948019181994916',
        feesUSD: '826419025897363028434',
        id: '2022-04-12'
      },
      {
        feesETH: '262879123471085489',
        feesUSD: '835634127366347316843',
        id: '2022-04-11'
      },
      {
        feesETH: '216824247726116018',
        feesUSD: '705088118075696653507',
        id: '2022-04-10'
      },
      {
        feesETH: '298799951563257567',
        feesUSD: '958513478791799423142',
        id: '2022-04-09'
      },
      {
        feesETH: '248826494738248307',
        feesUSD: '813219726633437884393',
        id: '2022-04-08'
      },
      {
        feesETH: '269145339903796597',
        feesUSD: '865465306811317528102',
        id: '2022-04-07'
      },
      {
        feesETH: '274052035484018932',
        feesUSD: '923286275210172432451',
        id: '2022-04-06'
      },
      {
        feesETH: '277065754443290007',
        feesUSD: '974582889868583477364',
        id: '2022-04-05'
      },
      {
        feesETH: '693404047399613450',
        feesUSD: '2428969829637640881355',
        id: '2022-04-04'
      },
      {
        feesETH: '231853442238904339',
        feesUSD: '811758042880856915085',
        id: '2022-04-03'
      },
      {
        feesETH: '3511608162752750446',
        feesUSD: '12220699348495028847831',
        id: '2022-04-02'
      },
      {
        feesETH: '434536686507250647',
        feesUSD: '1417574160661302288339',
        id: '2022-04-01'
      },
      {
        feesETH: '337420473576710514',
        feesUSD: '1148725054686542900863',
        id: '2022-03-31'
      },
      {
        feesETH: '345602941924201085',
        feesUSD: '1176003866661994484465',
        id: '2022-03-30'
      },
      {
        feesETH: '287106450093818877',
        feesUSD: '980950865906549082325',
        id: '2022-03-29'
      },
      {
        feesETH: '472153448802136993',
        feesUSD: '1570897903649243908502',
        id: '2022-03-28'
      },
      {
        feesETH: '238032733220805278',
        feesUSD: '750081607943404968833',
        id: '2022-03-27'
      },
      {
        feesETH: '499597296561864749',
        feesUSD: '1558871157620274689378',
        id: '2022-03-26'
      },
      {
        feesETH: '469685230031225433',
        feesUSD: '1474630857231308418597',
        id: '2022-03-25'
      },
      {
        feesETH: '680889746082079715',
        feesUSD: '2084170756796394326441',
        id: '2022-03-24'
      },
      {
        feesETH: '365903551400729395',
        feesUSD: '1082169600515258981575',
        id: '2022-03-23'
      },
      {
        feesETH: '318641670666425839',
        feesUSD: '949963541124028726010',
        id: '2022-03-22'
      },
      {
        feesETH: '624728107204032248',
        feesUSD: '1801058608785019500463',
        id: '2022-03-21'
      },
      {
        feesETH: '378502177972662221',
        feesUSD: '1107910277242534716141',
        id: '2022-03-20'
      },
      {
        feesETH: '372504139313559243',
        feesUSD: '1094328862292522175404',
        id: '2022-03-19'
      },
      {
        feesETH: '404773030648024220',
        feesUSD: '1132843175078436748431',
        id: '2022-03-18'
      },
      {
        feesETH: '404692323296708202',
        feesUSD: '1114461470053459666226',
        id: '2022-03-17'
      },
      {
        feesETH: '628178845200368839',
        feesUSD: '1660524006091010279505',
        id: '2022-03-16'
      },
      {
        feesETH: '499793624917047753',
        feesUSD: '1272471322962473878271',
        id: '2022-03-15'
      },
      {
        feesETH: '455942932154972876',
        feesUSD: '1173705632490293115612',
        id: '2022-03-14'
      },
      {
        feesETH: '441486396820855074',
        feesUSD: '1142468407592047245929',
        id: '2022-03-13'
      },
      {
        feesETH: '379602827165969961',
        feesUSD: '982465823414593433693',
        id: '2022-03-12'
      },
      {
        feesETH: '679511168148414445',
        feesUSD: '1765992024479829777923',
        id: '2022-03-11'
      },
      {
        feesETH: '510241301792214053',
        feesUSD: '1321659274642808420554',
        id: '2022-03-10'
      },
      {
        feesETH: '475213941825940121',
        feesUSD: '1292375902675041320188',
        id: '2022-03-09'
      },
      {
        feesETH: '586231828574960239',
        feesUSD: '1485505005943076131495',
        id: '2022-03-08'
      },
      {
        feesETH: '1060428782738184591',
        feesUSD: '2687643572664096098381',
        id: '2022-03-07'
      },
      {
        feesETH: '592213806426105850',
        feesUSD: '1568303415199116174449',
        id: '2022-03-06'
      },
      {
        feesETH: '619343072447546687',
        feesUSD: '1625032353487872999265',
        id: '2022-03-05'
      },
      {
        feesETH: '853948660551840359',
        feesUSD: '2377318372869769410645',
        id: '2022-03-04'
      },
      {
        feesETH: '579614786616857602',
        feesUSD: '1687363283716159878575',
        id: '2022-03-03'
      },
      {
        feesETH: '457671369381396811',
        feesUSD: '1362483089934724495355',
        id: '2022-03-02'
      },
      {
        feesETH: '1008082473516537423',
        feesUSD: '2960920046847233191648',
        id: '2022-03-01'
      },
      {
        feesETH: '1354170078024253369',
        feesUSD: '3558892869922693268483',
        id: '2022-02-28'
      },
      {
        feesETH: '1440060911721065656',
        feesUSD: '3861904513070157618381',
        id: '2022-02-27'
      },
      {
        feesETH: '1033693906193985096',
        feesUSD: '2897959001301389115663',
        id: '2022-02-26'
      },
      {
        feesETH: '442302657457400510',
        feesUSD: '1163393102936775137104',
        id: '2022-02-25'
      },
      {
        feesETH: '717867938968755468',
        feesUSD: '1743190342289808715183',
        id: '2022-02-24'
      },
      {
        feesETH: '466525866601241246',
        feesUSD: '1248961972097475194965',
        id: '2022-02-23'
      },
      {
        feesETH: '855584795547965521',
        feesUSD: '2225058367382502675515',
        id: '2022-02-22'
      },
      {
        feesETH: '1321409807683477426',
        feesUSD: '3537609841261104300812',
        id: '2022-02-21'
      },
      {
        feesETH: '408977842724944157',
        feesUSD: '1087094195515850174970',
        id: '2022-02-20'
      },
      {
        feesETH: '10976032763004800',
        feesUSD: '30987864517931552057',
        id: '2022-02-19'
      },
      {
        feesETH: '1952889260258021974',
        feesUSD: '5544181991362930446817',
        id: '2022-02-18'
      },
      {
        feesETH: '647833758895375439',
        feesUSD: '2031036171448009909508',
        id: '2022-02-17'
      },
      {
        feesETH: '1467397054259823974',
        feesUSD: '4600202465588451632441',
        id: '2022-02-16'
      },
      {
        feesETH: '38771155547813745',
        feesUSD: '117701431696826091190',
        id: '2022-02-15'
      },
      {
        feesETH: '892413690291455338',
        feesUSD: '2629575041113382158459',
        id: '2022-02-14'
      },
      {
        feesETH: '322644522634948827',
        feesUSD: '943967532763522483587',
        id: '2022-02-13'
      },
      {
        feesETH: '47513299334805017',
        feesUSD: '138045794370687375702',
        id: '2022-02-12'
      },
      {
        feesETH: '699884944236073965',
        feesUSD: '2149903200888162508025',
        id: '2022-02-11'
      },
      {
        feesETH: '96872441394710385',
        feesUSD: '308891341528829325184',
        id: '2022-02-10'
      },
      {
        feesETH: '1222171407691888009',
        feesUSD: '3842949482565529819166',
        id: '2022-02-09'
      },
      {
        feesETH: '99235762569535150',
        feesUSD: '315805078096574550004',
        id: '2022-02-08'
      },
      {
        feesETH: '45650066466239502',
        feesUSD: '141050448101705512232',
        id: '2022-02-07'
      },
      {
        feesETH: '3776960252503102363',
        feesUSD: '11362047068372452762010',
        id: '2022-02-06'
      },
      {
        feesETH: '33930120309418411',
        feesUSD: '102383376743899976579',
        id: '2022-02-05'
      },
      {
        feesETH: '2554451496373718344',
        feesUSD: '7417622319422344528175',
        id: '2022-02-04'
      },
      {
        feesETH: '103531525400534071',
        feesUSD: '274782309461231359620',
        id: '2022-02-03'
      },
      {
        feesETH: '1144930632669804453',
        feesUSD: '3150612984570324446477',
        id: '2022-02-02'
      },
      {
        feesETH: '94341096455746810',
        feesUSD: '258134804697135091721',
        id: '2022-02-01'
      },
      {
        feesETH: '100764615696964160',
        feesUSD: '253272447211365247478',
        id: '2022-01-31'
      },
      {
        feesETH: '795564393800450690',
        feesUSD: '2072347387332579966331',
        id: '2022-01-30'
      },
      {
        feesETH: '639274617714910084',
        feesUSD: '1625259824347501653247',
        id: '2022-01-29'
      },
      {
        feesETH: '985604861746535914',
        feesUSD: '2405634174357440844680',
        id: '2022-01-28'
      },
      {
        feesETH: '276601276589155683',
        feesUSD: '692981137473948814071',
        id: '2022-01-27'
      },
      {
        feesETH: '979467452938844083',
        feesUSD: '2404158916015032633189',
        id: '2022-01-26'
      },
      {
        feesETH: '503899391785056948',
        feesUSD: '1223466192787376831346',
        id: '2022-01-25'
      },
      {
        feesETH: '2801699870954361250',
        feesUSD: '6824436166434237913675',
        id: '2022-01-24'
      },
      {
        feesETH: '595311571537188898',
        feesUSD: '1461768460188596356800',
        id: '2022-01-23'
      },
      {
        feesETH: '605601612041909031',
        feesUSD: '1471233130335375721267',
        id: '2022-01-22'
      },
      {
        feesETH: '1309862963458663109',
        feesUSD: '3731454682291381122153',
        id: '2022-01-21'
      },
      {
        feesETH: '960763287326508139',
        feesUSD: '3040963464192386171293',
        id: '2022-01-20'
      },
      {
        feesETH: '963362402282265194',
        feesUSD: '2994749141082917749005',
        id: '2022-01-19'
      },
      {
        feesETH: '124927954346008873',
        feesUSD: '400580981451224894665',
        id: '2022-01-18'
      },
      {
        feesETH: '64871260325369583',
        feesUSD: '212578475823615624712',
        id: '2022-01-17'
      },
      {
        feesETH: '2322155252078967841',
        feesUSD: '7805613586586318135596',
        id: '2022-01-16'
      },
      {
        feesETH: '2026298920266310998',
        feesUSD: '6756579551556666370943',
        id: '2022-01-15'
      },
      {
        feesETH: '2771522462857727956',
        feesUSD: '9133702019747659663345',
        id: '2022-01-14'
      },
      {
        feesETH: '116263648956577974',
        feesUSD: '388156885509237271620',
        id: '2022-01-13'
      },
      {
        feesETH: '972708370905395395',
        feesUSD: '3149574478005122498334',
        id: '2022-01-12'
      },
      {
        feesETH: '130722101258728337',
        feesUSD: '405899670535115356722',
        id: '2022-01-11'
      },
      {
        feesETH: '150443800137685347',
        feesUSD: '475489215690253411735',
        id: '2022-01-10'
      },
      {
        feesETH: '858947141385857619',
        feesUSD: '2695782218068600525004',
        id: '2022-01-09'
      },
      {
        feesETH: '61673032581910313',
        feesUSD: '198183221251340473469',
        id: '2022-01-08'
      },
      {
        feesETH: '2219103178902725599',
        feesUSD: '7093518648585085569476',
        id: '2022-01-07'
      },
      {
        feesETH: '4723040926381062298',
        feesUSD: '16013748870652458727377',
        id: '2022-01-06'
      },
      {
        feesETH: '2088789946624726324',
        feesUSD: '7745969906173511160794',
        id: '2022-01-05'
      },
      {
        feesETH: '3999131703038358601',
        feesUSD: '15095257608201954455517',
        id: '2022-01-04'
      },
      {
        feesETH: '188321858651652198',
        feesUSD: '716888585766417456557',
        id: '2022-01-03'
      },
      {
        feesETH: '5903857172891929202',
        feesUSD: '21990841270185389689786',
        id: '2022-01-02'
      },
      {
        feesETH: '210849101846455164',
        feesUSD: '783713878140554537309',
        id: '2022-01-01'
      },
      {
        feesETH: '219983841727539364',
        feesUSD: '823496518192229713109',
        id: '2021-12-31'
      },
      {
        feesETH: '225528343762130230',
        feesUSD: '834093046915332242398',
        id: '2021-12-30'
      },
      {
        feesETH: '199966036745338237',
        feesUSD: '759457009936222451143',
        id: '2021-12-29'
      },
      {
        feesETH: '124589527200211239',
        feesUSD: '488736751331244078100',
        id: '2021-12-28'
      },
      {
        feesETH: '196533764586365163',
        feesUSD: '800187732494041257034',
        id: '2021-12-27'
      },
      {
        feesETH: '376478203920458524',
        feesUSD: '1515601089777434728199',
        id: '2021-12-26'
      },
      {
        feesETH: '485088691305838957',
        feesUSD: '1981733271646667865627',
        id: '2021-12-25'
      },
      {
        feesETH: '300203608261219700',
        feesUSD: '1229790358184321458338',
        id: '2021-12-24'
      },
      {
        feesETH: '296609999753053289',
        feesUSD: '1172626273227445564295',
        id: '2021-12-23'
      },
      {
        feesETH: '288824349029335807',
        feesUSD: '1168797046190974384227',
        id: '2021-12-22'
      },
      {
        feesETH: '911003130145608973',
        feesUSD: '3652750170909445950195',
        id: '2021-12-21'
      },
      {
        feesETH: '0',
        feesUSD: '0',
        id: '2021-12-20'
      },
      {
        feesETH: '0',
        feesUSD: '0',
        id: '2021-12-19'
      },
      {
        feesETH: '434883719324461574',
        feesUSD: '1693658264220172006077',
        id: '2021-12-18'
      },
      {
        feesETH: '423827876265117168',
        feesUSD: '1670589006808677839786',
        id: '2021-12-17'
      },
      {
        feesETH: '424847412488727826',
        feesUSD: '1705518070358076153890',
        id: '2021-12-16'
      },
      {
        feesETH: '445160888460556437',
        feesUSD: '1716468920331323274903',
        id: '2021-12-15'
      },
      {
        feesETH: '483234813514588058',
        feesUSD: '1799296264536988424531',
        id: '2021-12-14'
      },
      {
        feesETH: '228922480871357681',
        feesUSD: '925267678943241424851',
        id: '2021-12-13'
      },
      {
        feesETH: '695891329359370277',
        feesUSD: '2839514079005675323241',
        id: '2021-12-12'
      },
      {
        feesETH: '488696122924306723',
        feesUSD: '1948401166196766167645',
        id: '2021-12-11'
      },
      {
        feesETH: '687640306666564126',
        feesUSD: '2789989805669151112837',
        id: '2021-12-10'
      },
      {
        feesETH: '269420153706691956',
        feesUSD: '1180682332613666002100',
        id: '2021-12-09'
      },
      {
        feesETH: '389465944385246165',
        feesUSD: '1710874185965194429682',
        id: '2021-12-08'
      },
      {
        feesETH: '695786204366530649',
        feesUSD: '3028425868167654116208',
        id: '2021-12-07'
      },
      {
        feesETH: '472862546915903604',
        feesUSD: '1960822593450459433273',
        id: '2021-12-06'
      },
      {
        feesETH: '683903158983288334',
        feesUSD: '2891453117412115876944',
        id: '2021-12-05'
      },
      {
        feesETH: '427979179647983678',
        feesUSD: '1676121443919603734250',
        id: '2021-12-04'
      },
      {
        feesETH: '391788974667011851',
        feesUSD: '1797617672044675139276',
        id: '2021-12-03'
      },
      {
        feesETH: '165520582240584325',
        feesUSD: '749545665586380115271',
        id: '2021-12-02'
      },
      {
        feesETH: '366487783125348728',
        feesUSD: '1711946144377320570580',
        id: '2021-12-01'
      },
      {
        feesETH: '479045014703083017',
        feesUSD: '2182220727615738011731',
        id: '2021-11-30'
      },
      {
        feesETH: '423528988145577120',
        feesUSD: '1847922783422934086524',
        id: '2021-11-29'
      },
      {
        feesETH: '585009217699440153',
        feesUSD: '2386142260371621586665',
        id: '2021-11-28'
      },
      {
        feesETH: '302326027620824713',
        feesUSD: '1240637987994555588433',
        id: '2021-11-27'
      },
      {
        feesETH: '237297099947461541',
        feesUSD: '1061536976037858922824',
        id: '2021-11-26'
      },
      {
        feesETH: '191671168922163641',
        feesUSD: '827499891280374555716',
        id: '2021-11-25'
      },
      {
        feesETH: '380895289177247246',
        feesUSD: '1628358690864367170791',
        id: '2021-11-24'
      },
      {
        feesETH: '462104666361773024',
        feesUSD: '1943398557575359253958',
        id: '2021-11-23'
      },
      {
        feesETH: '248523020734335211',
        feesUSD: '1037901130250920259342',
        id: '2021-11-22'
      },
      {
        feesETH: '49179599428124655',
        feesUSD: '215528784531327114371',
        id: '2021-11-21'
      },
      {
        feesETH: '231334968701348914',
        feesUSD: '1002335457325599713573',
        id: '2021-11-20'
      },
      {
        feesETH: '193199787806513694',
        feesUSD: '806076194100212440446',
        id: '2021-11-19'
      },
      {
        feesETH: '351978671908102012',
        feesUSD: '1484346015214434202045',
        id: '2021-11-18'
      },
      {
        feesETH: '139063065794165301',
        feesUSD: '578721837432753838777',
        id: '2021-11-17'
      },
      {
        feesETH: '123058527748750241',
        feesUSD: '535604257495803080915',
        id: '2021-11-16'
      },
      {
        feesETH: '163057349016875451',
        feesUSD: '766528062943799342493',
        id: '2021-11-15'
      },
      {
        feesETH: '57221900670880040',
        feesUSD: '265566118253218193788',
        id: '2021-11-14'
      },
      {
        feesETH: '147281620061430096',
        feesUSD: '687702768053291985642',
        id: '2021-11-13'
      },
      {
        feesETH: '60517483180388974',
        feesUSD: '284438207361271426041',
        id: '2021-11-12'
      },
      {
        feesETH: '155671620098402941',
        feesUSD: '726589995874332018869',
        id: '2021-11-11'
      },
      {
        feesETH: '91331605468969651',
        feesUSD: '432405832828618058401',
        id: '2021-11-10'
      },
      {
        feesETH: '75471658981379437',
        feesUSD: '363022986760843407177',
        id: '2021-11-09'
      },
      {
        feesETH: '498653437091822051',
        feesUSD: '2369640865207714017491',
        id: '2021-11-08'
      },
      {
        feesETH: '194975670048269027',
        feesUSD: '887246705187306071597',
        id: '2021-11-07'
      },
      {
        feesETH: '89247965313233276',
        feesUSD: '401032271902150567325',
        id: '2021-11-06'
      },
      {
        feesETH: '61097015387975347',
        feesUSD: '277415903929726598232',
        id: '2021-11-05'
      },
      {
        feesETH: '85411063234124304',
        feesUSD: '390564188823571718766',
        id: '2021-11-04'
      },
      {
        feesETH: '121969950522828726',
        feesUSD: '556664001214262419854',
        id: '2021-11-03'
      },
      {
        feesETH: '149931987298399791',
        feesUSD: '649586521808820576191',
        id: '2021-11-02'
      }
    ]
  }
}

rawData.data.ousdDailyStats.reverse()
