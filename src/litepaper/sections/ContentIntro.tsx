import React from "react";
import { Section } from "../../components";
import { assetRootPath } from "../../utils/image";
import { TableOfContents } from "../components";

const sectionTitles = [
  "Executive Summary",
  "Obtaining OUSD",
  {
    title: "OUSD yield-earning strategies",
    subtitles: ["Lending", "Market making", "Rewards tokens"],
  },
  "Yield boost",
];

const ContentIntro = () => {
  return (
    <Section className="mt-12 relative" innerDivClassName="flex justify-center">
      <div className="relative z-20 w-[793px]">
        <TableOfContents
          className="fixed translate-x-[-100%]"
          sectionTitles={sectionTitles}
        />
        <img
          src={assetRootPath("/images/litepaper-bg.svg")}
          alt="litepaper-bg"
          className="w-full z-20"
        />
      </div>
      <div className="z-10 bg-origin-bg-grey absolute bottom-0 left-0 w-full h-1/2" />
    </Section>
  );
};

export default ContentIntro;
