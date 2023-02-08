import React from "react";
import { Section } from "../../components";

interface DailyYieldProps {}

const DailyYield = ({}: DailyYieldProps) => {
  return (
    <Section className="mt-28">
      {/* Buttons */}
      <div className="mb-12 sm:mb-10">
        <button className="bg-gradient2">Days</button>
      </div>
    </Section>
  );
};

export default DailyYield;
