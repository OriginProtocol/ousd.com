import React, { useEffect, useState } from "react";
import { Typography } from "@originprotocol/origin-storybook";
import { twMerge } from "tailwind-merge";
import { Section } from "../../components";
import { RangeInput, RangeOutput } from "../components";
import { commify } from "ethers/lib/utils";
import { useBlockTimestamp, useViewWidth } from "../../hooks";
import { mdSize } from "../../constants";
import { providers } from "ethers";
import { SECONDS_IN_A_MONTH } from "../constants";
import { veOgvToOgv } from "../utils";

interface CalculatorProps {
  sectionOverrideCss?: string;
}

const lockupDurationInputMarkers = [
  {
    label: "1 month",
    value: 1,
  },
  {
    label: "12 months",
    value: 12,
  },
  {
    label: "24 months",
    value: 24,
  },
  {
    label: "36 months",
    value: 36,
  },
  {
    label: "48 months",
    value: 48,
  },
];

const lockupDurationInputMarkersSmall = [
  {
    label: "1M",
    value: 1,
  },
  {
    label: "12M",
    value: 12,
  },
  {
    label: "24M",
    value: 24,
  },
  {
    label: "36M",
    value: 36,
  },
  {
    label: "48M",
    value: 48,
  },
];

const Calculator = ({ sectionOverrideCss }: CalculatorProps) => {
  const width = useViewWidth();

  const [lockupDuration, setLockupDuration] = useState(1);
  const [snapshotReq, setSnapshotReq] = useState(0);
  const [onChainReq, setOnChainReq] = useState(0);
  const blockTimestamp = useBlockTimestamp();

  useEffect(() => {
    const snapshotReq = veOgvToOgv(blockTimestamp, 10_000, lockupDuration);
    const onChainReq = veOgvToOgv(blockTimestamp, 1_000_000, lockupDuration);
    setSnapshotReq(snapshotReq);
    setOnChainReq(onChainReq);
  }, [lockupDuration, blockTimestamp]);

  return (
    <Section
      className={twMerge("py-20", sectionOverrideCss)}
      innerDivClassName="bg-origin-bg-black px-6 py-10 lg:py-16 lg:px-20 rounded-lg"
    >
      <Typography.H6>OGV to veOGV calculator</Typography.H6>
      <Typography.Body2 className="mt-8">
        Select your staking period to see how much OGV is needed for Snapshot
        and on-chain proposals
      </Typography.Body2>

      <RangeInput
        label="Length of stake"
        markers={
          width >= mdSize
            ? lockupDurationInputMarkers
            : lockupDurationInputMarkersSmall
        }
        min={1}
        max={48}
        value={lockupDuration}
        onChange={(e) => setLockupDuration(parseInt(e.target.value))}
        onMarkerClick={(markerValue) =>
          markerValue && setLockupDuration(parseInt(markerValue))
        }
      />
      <div className="flex flex-col lg:flex-row w-full">
        <RangeOutput
          title="Snapshot proposal (10,000 veOGV)"
          value={commify(snapshotReq.toFixed(2))}
          className="w-full lg:w-1/2 mr-6"
        />
        <RangeOutput
          title="On-chain proposal (1,000,000 veOGV)"
          value={commify(onChainReq.toFixed(2))}
          className="w-full lg:w-1/2"
        />
      </div>
    </Section>
  );
};

export default Calculator;
