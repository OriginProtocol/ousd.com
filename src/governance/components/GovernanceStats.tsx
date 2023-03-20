import { Typography } from "@originprotocol/origin-storybook";
import React from "react";
import { twMerge } from "tailwind-merge";

interface GovernanceStatsProps {
  title: string;
  value: string;
  className?: string;
}

const GovernanceStats = ({ title, value, className }: GovernanceStatsProps) => {
  return (
    <div
      className={twMerge(
        "flex-1 border-t-2 border-origin-bg-grey py-6 px-20 border-l-2",
        className
      )}
    >
      <Typography.H6>{value}</Typography.H6>
      <Typography.Body2 className="text-table-title">{title}</Typography.Body2>
    </div>
  );
};

export default GovernanceStats;
