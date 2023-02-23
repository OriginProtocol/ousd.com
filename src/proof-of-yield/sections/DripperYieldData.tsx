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
          extraData={[
            { title: "APY", value: "4.37%" },
            { title: "Supply", value: commify("57615375") },
          ]}
        />
        {/* <Image
          src={assetRootPath("/images/dripper-arrow-left.svg")}
          width={400}
          height={400}
          alt="dripper-arrow-left"
          className="absolute top-0 right-0 -translate-x-[20%] translate-y-[68%]"
        /> */}
      </div>

      <div className="flex justify-center mt-3">
        <button className="py-4 px-16 bg-origin-bg-black rounded-lg">
          OUSD Dripper
        </button>
      </div>

      <div className="relative pb-20">
        <DripperGraph
          className="mt-3"
          graphId={2}
          extraData={[
            { title: "APY", value: "4.37%" },
            { title: "Supply", value: commify("57615375") },
          ]}
          setTime={false}
        />
        {/* <Image
          src={assetRootPath("/images/dripper-arrow-right.svg")}
          width={400}
          height={400}
          alt="dripper-arrow-right"
          className="absolute bottom-0 left-0 translate-x-[20%] -translate-y-[66%]"
        /> */}
      </div>
    </Section>
  );
};

export default DripperYieldData;
