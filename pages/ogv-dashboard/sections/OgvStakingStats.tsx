import React from "react";
import { Section } from "../components";
import { Typography } from "@originprotocol/origin-storybook";

export const OgvStakingStats = () => {
  return (
    <Section className="bg-origin-bg-black">
      <Typography.H1 className="text-3xl md:text-8xl mt-20 px-[24px] sm:px-0">
        OGV allocation
      </Typography.H1>
    </Section>
  );
};

export default OgvStakingStats;
