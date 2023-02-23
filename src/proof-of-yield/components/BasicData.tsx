import Image from "next/image";
import { assetRootPath } from "../../utils/image";
import { PropsWithChildren } from "react";
import { Typography } from "@originprotocol/origin-storybook";
import { twMerge } from "tailwind-merge";
import TitleWithInfo from "./TitleWithInfo";

interface BasicDataProps {
  title: string;
  info?: boolean;
  className?: string;
}

const BasicData = ({
  title,
  info = true,
  className,
  children,
}: PropsWithChildren<BasicDataProps>) => {
  return (
    <div
      className={twMerge(
        `flex justify-start items-center px-4 lg:px-8 py-4 lg:py-6 bg-origin-bg-grey mr-1`,
        className
      )}
    >
      <div>
        {info ? (
          <TitleWithInfo>{title}</TitleWithInfo>
        ) : (
          <Typography.Body2 className="text-xs md:text-base text-table-title">
            {title}
          </Typography.Body2>
        )}
        <Typography.H6 className="block font-normal text-center lg:text-left">
          {children}
        </Typography.H6>
      </div>
    </div>
  );
};

export default BasicData;
