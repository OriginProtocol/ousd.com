import React, { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

interface SectionProps {
  className?: string;
  innerDivClassName?: string;
}

const Section = ({
  className,
  innerDivClassName,
  children,
}: PropsWithChildren<SectionProps>) => {
  return (
    <section
      className={twMerge(
        "px-4 sm:px-8 md:px-16 lg:px-[8.375rem] bg-origin-bg-black",
        className
      )}
    >
      <div className={twMerge("max-w-[89.5rem] mx-auto", innerDivClassName)}>
        {children}
      </div>
    </section>
  );
};

export default Section;
