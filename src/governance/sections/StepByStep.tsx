import React from "react";
import { Section } from "../../components";

interface StepByStepProps {
  sectionOverrideCss?: string;
}

const StepByStep = ({ sectionOverrideCss }: StepByStepProps) => {
  return <Section className={sectionOverrideCss}></Section>;
};

export default StepByStep;
