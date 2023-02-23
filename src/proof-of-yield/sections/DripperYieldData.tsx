import { Typography } from "@originprotocol/origin-storybook";
import { commify } from "ethers/lib/utils";
import Image from "next/image";
import React from "react";
import { Section } from "../../components";
import { assetRootPath } from "../../utils/image";
import { DripperGraph } from "../components";

const DripperYieldData = () => {
  return (
    <Section className="bg-origin-bg-grey mt-20">
      <Typography.H5 className="pt-20 text-center">
        Yield in, Yield out
      </Typography.H5>
      <Typography.Body3 className="text-center text-sm text-table-title mt-3">
        View the amount of yield the protocol earns vs what is distributed after
        it&apos;s processed by the dripper
      </Typography.Body3>

      <div className="relative">
        <DripperGraph
          className="mt-14 mb-3"
          graphId={1}
          title="Yield earned"
          extraData={[
            { title: "APY", value: "4.37%" },
            { title: "Supply", value: commify("57615375") },
          ]}
        />
      </div>

      <div className="flex justify-center">
        <Image
          src={assetRootPath("/images/blue-down-arrow.svg")}
          width={24}
          height={24}
          alt="arrow down"
        />
      </div>

      <div className="flex justify-center mt-3">
        <button className="py-4 px-16 bg-origin-bg-black rounded-lg">
          OUSD Dripper
        </button>
      </div>

      <div className="flex justify-center mt-3">
        <Image
          src={assetRootPath("/images/blue-down-arrow.svg")}
          width={24}
          height={24}
          alt="arrow down"
        />
      </div>

      <div className="relative pb-20">
        <DripperGraph
          className="mt-3"
          graphId={2}
          title="Yield distributed"
          extraData={[
            { title: "APY", value: "4.37%" },
            { title: "Supply", value: commify("57615375") },
          ]}
          setTime={false}
        />
      </div>
    </Section>
  );
};

export default DripperYieldData;
