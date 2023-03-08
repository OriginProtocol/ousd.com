import { Typography } from "@originprotocol/origin-storybook";
import React, {
  ForwardedRef,
  forwardRef,
  PropsWithChildren,
  RefObject,
  useEffect,
  useRef,
} from "react";
import { twMerge } from "tailwind-merge";
import { useIntersectionObserver, useRefs } from "../../hooks";
import { LitePaperData } from "../types";

interface TableOfContentsProps {
  className?: string;
  data: LitePaperData[];
  headingRefs: RefObject<HTMLDivElement>[];
}
const TableOfContents = ({
  className,
  data,
  headingRefs,
}: TableOfContentsProps) => {
  const activeId = useIntersectionObserver(headingRefs);

  return (
    <div
      className={twMerge(
        `bg-origin-bg-grey px-8 rounded-lg pointer-events-none w-fit mx-auto`,
        className
      )}
    >
      <div className="z-10 bg-origin-bg-grey absolute bottom-0 h-1/2" />
      {data.map((t, i) => (
        //   key={i} ok since array will not be reordered
        <Title
          {...{
            key: i,
            sectionNumber: t.sectionNumber,
            i,
            activeId,
            title: t.title,
            subtitle: t.isSubtitle ? true : false,
            className: "cursor-pointer pointer-events-auto",
            onClick: () =>
              headingRefs[i].current?.scrollIntoView({ behavior: "smooth" }),
          }}
        />
      ))}
    </div>
  );
};

interface TitleProps {
  title: string;
  i: number;
  sectionNumber: number;
  activeId: number;
  key: number;
  subtitle: boolean;
  onClick?: () => void;
  className?: string;
}

const Title = ({
  title,
  i,
  sectionNumber,
  activeId,
  subtitle,
  onClick,
  className,
  children,
}: PropsWithChildren<TitleProps>) => {
  console.log(activeId, i, title);

  return (
    <button
      className={twMerge(
        `${
          activeId === i
            ? "text-origin-white font-bold"
            : "text-subheading font-normal"
        } my-4 block`,
        className
      )}
      onClick={onClick}
    >
      <Typography.Body3
        as="span"
        className={`text-sm mr-4 ${subtitle ? "invisible" : "visible"}`}
      >{`0${sectionNumber}`}</Typography.Body3>{" "}
      <Typography.Body3
        as="span"
        className={`${subtitle ? "text-xs" : "text-sm"}`}
      >{`${subtitle ? "-" : ""}${title}`}</Typography.Body3>
      {children}
    </button>
  );
};
export default TableOfContents;
