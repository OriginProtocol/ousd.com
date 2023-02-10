import Image from "next/image";
import { assetRootPath } from "../../utils/image";
import { PropsWithChildren } from "react";
import { Typography } from "@originprotocol/origin-storybook";
import { twMerge } from "tailwind-merge";
import TitleWithInfo from "./TitleWithInfo";

interface BasicDataProps {
  title: string;
  className?: string;
}

const BasicData = ({
  title,
  className,
  children,
}: PropsWithChildren<BasicDataProps>) => {
  return (
    <div
      className={twMerge(
        `flex justify-start items-center px-8 py-6 bg-origin-bg-grey mr-1`,
        className
      )}
    >
      <div>
        <TitleWithInfo {...{ title }}></TitleWithInfo>
        <Typography.H6 className="block font-normal">{children}</Typography.H6>
      </div>
    </div>
  );
};

export default BasicData;
