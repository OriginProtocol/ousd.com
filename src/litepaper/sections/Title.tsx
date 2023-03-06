import { Typography } from "@originprotocol/origin-storybook";
import React from "react";
import { Section } from "../../components";

const Title = () => {
  return (
    <Section innerDivClassName="flex items-center flex-col">
      <Typography.H4 className="w-[763px] mb-6">
        OUSD/OGV litepaper
      </Typography.H4>
      <Typography.Body2 className="w-[763px] text-table-title">
        Last updated at
      </Typography.Body2>
    </Section>
  );
};

export default Title;
