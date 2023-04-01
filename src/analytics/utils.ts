import { isMobile } from "react-device-detect";
import { ChartOptions } from "chart.js";

export const backingTokens = {
  DAI: {
    label: "DAI (DAI)",
    logoSrc: "/images/dai-logo.svg",
    color: "#FBC247",
  },
  USDC: {
    label: "USD Coin (USDC)",
    logoSrc: "/images/usdc-logo.svg",
    color: "#0274F1",
  },
  USDT: {
    label: "Tether (USDT)",
    logoSrc: "/images/usdt-logo.svg",
    color: "#02F1C6",
  },
};

export const durationOptions = [
  {
    value: "1w",
    label: "1W",
  },
  {
    value: "1m",
    label: "1M",
  },
  {
    value: "6m",
    label: "6M",
  },
  {
    value: "12m",
    label: "1YR",
  },
  {
    value: "all",
    label: "All",
  },
];

export const typeOptions = [
  {
    value: "",
    label: "All",
  },
  {
    value: "_7_day",
    label: "7-Day",
  },
  {
    value: "_14_day",
    label: "14-Day",
  },
  {
    value: "_30_day",
    label: "30-Day",
  },
  {
    value: "total",
    label: "Current",
  },
];

export const createGradient =
  (colors) =>
  ({ chart }) => {
    const { ctx, chartArea } = chart;
    if (!chartArea) {
      return;
    }
    const gradient = ctx.createLinearGradient(
      0,
      chartArea.top,
      chartArea.right,
      0
    );
    colors.forEach((color, index) => {
      gradient.addColorStop(index, color);
    });
    return gradient;
  };

export const borderFormatting = {
  borderColor: createGradient(["#FEDBA8", "#CF75D5"]),
  borderWidth: 2,
  tension: 0,
  borderJoinStyle: "round",
  pointRadius: 0,
  pointHitRadius: 1,
};

export const chartOptions: ChartOptions<"line"> = {
  responsive: true,
  aspectRatio: isMobile ? 1 : 3,
  plugins: {
    title: {
      display: false,
    },
    legend: {
      display: false,
      position: "bottom",
    },
    tooltip: {
      enabled: true,
    },
  },
  interaction: {
    mode: "nearest",
    intersect: false,
    axis: "x",
  },
  scales: {
    x: {
      border: {
        color: "#4d505e",
        width: 0.5,
      },
      grid: {
        display: false,
      },
      ticks: {
        color: "#828699",
        autoSkip: false,
        maxRotation: 90,
        minRotation: 0,
        padding: 20,
        callback: function (val, index) {
          return (isMobile ? (index + 22) % 28 === 0 : (index + 8) % 14 === 0)
            ? this.getLabelForValue(Number(val))
            : null;
        },
      },
    },
    y: {
      border: {
        display: false,
        dash: [2, 4],
        dashOffset: 1,
      },
      grid: {
        color: "#4d505e",
        lineWidth: 0.5,
      },
      beginAtZero: true,
      position: "right",
      ticks: {
        color: "#828699",
        callback: function (val) {
          return val === 0 ? null : this.getLabelForValue(Number(val));
        },
      },
    },
  },
};

const sumHoldings = (holdings) =>
  Object.keys(backingTokens).reduce((acc, token) => {
    acc += Number(holdings[token]);
    return acc;
  }, 0);

export const aggregateCollateral = ({ collateral, allocation }) => {
  const { holdings: ousdHoldings } =
    allocation?.strategies?.ousd_metastrat || {};

  const ousdMetastrat3crvTotal = sumHoldings(ousdHoldings);

  const { holdings: lusdHoldings } =
    allocation?.strategies?.lusd_metastrat || {};

  const lusdMetastrat3crvTotal = sumHoldings(lusdHoldings);

  const aggregateTotal = collateral?.reduce((t, s) => ({
    total: Number(t?.total || 0) + Number(s?.total || 0),
  })).total;

  return collateral.reduce((acc, token) => {
    const { name } = token;
    const normalizedTokenName = name?.toUpperCase();

    if (!Object.keys(backingTokens).includes(normalizedTokenName)) {
      return acc;
    }

    const extra = ousdMetastrat3crvTotal
      ? (ousdHoldings[normalizedTokenName] * ousdHoldings.OUSD) /
        ousdMetastrat3crvTotal
      : lusdMetastrat3crvTotal
      ? (lusdHoldings[normalizedTokenName] * lusdHoldings.LUSD) /
        ousdMetastrat3crvTotal
      : 0;

    const localTotal = Number(token?.total || 0) + extra;

    acc[normalizedTokenName] = {
      total: localTotal,
      percentage: localTotal / aggregateTotal,
      // Add in meta information
      ...backingTokens[normalizedTokenName],
    };

    return acc;
  }, {});
};

export const sumOfDifferences = (data) => {
  return data
    .sort((a, b) => b - a)
    .reduce((acc, curr, index, array) => {
      const next = array[index + 1];
      if (!isNaN(curr - next)) {
        acc += curr - next;
      }
      return acc;
    }, 0);
};
