import { Typography } from "@originprotocol/origin-storybook";
import React from "react";
import { Section } from "../../components";
import { DripperGraph } from "../components";

const DripperFunds = () => {
  return (
    <Section className="bg-origin-bg-black pt-20">
      <Typography.H5 className="text-center">Dripper funds</Typography.H5>
      <Typography.Body3 className="text-sm mt-3 text-center text-table-title">
        Historical view of funds held in the dripper
      </Typography.Body3>
      <DripperGraph className="mt-14" bgClassName="bg-origin-bg-grey" />
    </Section>
  );
};

export default DripperFunds;
