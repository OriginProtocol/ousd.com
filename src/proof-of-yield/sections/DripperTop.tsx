import React from "react";
import Image from "next/image";
import { Section } from "../../components";
import { assetRootPath } from "../../utils/image";
import { Typography } from "@originprotocol/origin-storybook";
import { Gradient2Button } from "../components";

const DripperTop = () => {
  return (
    <Section className="mt-10">
      {/* Back button */}
      <div className="cursor-pointer">
        <Image
          src={assetRootPath("/images/arrow-left.svg")}
          width="12"
          height="12"
          alt="left-arrow"
          className="inline"
        />
        <Typography.Body2 className="inline ml-3">Back</Typography.Body2>
      </div>

      {/* Title */}
      <Typography.H3 className="mt-14">OUSD yield dripper</Typography.H3>

      <Gradient2Button outerDivClassName="mt-12">
        <a
          target="_blank"
          href="https://etherscan.io/token/0x9c354503C38481a7A7a51629142963F98eCC12D0"
          rel="noreferrer noopener"
        >
          View dripper contract
          <Image
            src={assetRootPath("/images/ext-link.svg")}
            width="12"
            height="12"
            alt="ext-link"
            className="inline ml-3"
          />
        </a>
      </Gradient2Button>
    </Section>
  );
};

export default DripperTop;
