import React from "react";
import Image from "next/image";
import { assetRootPath } from "../../utils/image";
import { twMerge } from "tailwind-merge";
import { Typography } from "@originprotocol/origin-storybook";

interface TitleWithInfoProps {
  title: string;
  className?: string;
  textClassName?: string;
}

const TitleWithInfo = ({
  title,
  className,
  textClassName,
}: TitleWithInfoProps) => {
  return (
    <div
      className={twMerge(
        `text-base font-normal text-table-title w-fit flex items-center`,
        className
      )}
    >
      <Typography.Body2 className={twMerge(`pr-2`, textClassName)}>
        {title}
      </Typography.Body2>
      <Image
        src={assetRootPath("/images/info.svg")}
        width="16"
        height="16"
        alt="info"
        className="inline"
      />
    </div>
  );
};

export default TitleWithInfo;
