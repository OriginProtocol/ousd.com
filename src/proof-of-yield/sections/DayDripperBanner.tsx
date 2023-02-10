import React from "react";
import { Section } from "../../components";
import { Typography } from "@originprotocol/origin-storybook";

interface DayDripperBannerProps {}

const DayDripperBanner = ({}: DayDripperBannerProps) => {
  return (
    <Section innerDivClassName="border-t-2 border-origin-bg-grey">
      <div className="w-full mt-20 bg-origin-bg-grey py-10 px-12 flex rounded-lg items-center">
        <div>
          <Typography.Body className="mb-4">
            Introducing the OUSD Dripper
          </Typography.Body>
          <Typography.Body3 className="text-sm text-table-title mr-[104px]">
            Yield that is harvested is converted to USDT and placed into the
            dripper. The dripper releases this yield to users steadily over
            time. The reason for the dripper is that it smooths out the yield to
            be a more consistant APY. Irregular events such as reward token
            harvests or redemption fees can cause yields to spike. Using the
            dripper assures our users experience a smooth and predictable APY.
          </Typography.Body3>
        </div>
        <button className="whitespace-nowrap rounded-full h-14 bg-gradient2">
          <span className="px-10">View Dripper details</span>
        </button>
      </div>
    </Section>
  );
};

export default DayDripperBanner;
