import { useMemo, useState } from "react";
import { formatCurrency, formatPercentage } from "../../utils/math";

const mockData = [
  {
    label: "DAI (DAI)",
    percentage: 0.296,
    percentageDisplay: `${formatCurrency(0.296 * 100, 2)}%`,
    total: 14380104,
    totalDisplay: `$${formatCurrency(14380104, 0)}`,
    color: "#FBC247",
  },
  {
    label: "Tether (USDT)",
    percentage: 0.4349,
    percentageDisplay: `${formatCurrency(0.4349 * 100, 2)}%`,
    total: 23705812,
    totalDisplay: `$${formatCurrency(23705812, 0)}`,
    color: "#02F1C6",
  },
  {
    label: "USD Coin (USDC)",
    percentage: 0.3011,
    percentageDisplay: `${formatCurrency(0.3011 * 100, 2)}%`,
    total: 16411187,
    totalDisplay: `$${formatCurrency(16411187, 0)}`,
    color: "#0274F1",
  },
];

export const useCollateralChart = () => {};
