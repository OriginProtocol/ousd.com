import { Typography } from "@originprotocol/origin-storybook";
import React, { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

interface TitleWithSubtitles {
  title: string;
  subtitles: string[];
}

interface TableOfContentsProps {
  className?: string;
  sectionTitles: (string | TitleWithSubtitles)[];
}
const TableOfContents = ({
  className,
  sectionTitles,
}: TableOfContentsProps) => {
  return (
    <div
      className={twMerge(
        "text-table-title bg-origin-bg-grey px-8 rounded-lg",
        className
      )}
    >
      {sectionTitles.map((t, i) =>
        typeof t === "string" ? (
          //   key={i} ok since array will be reordered
          <Title title={t} i={i} key={i} />
        ) : (
          <>
            <Title title={t.title} i={i} key={i}>
              {t.subtitles.map((st) => (
                <div>
                  <Typography.Body3
                    as="span"
                    className="text-sm mr-4 invisible"
                  >{`0${i + 1}`}</Typography.Body3>{" "}
                  <Typography.Body3 className="text-xs inline">{`- ${st}`}</Typography.Body3>
                </div>
              ))}
            </Title>
          </>
        )
      )}
    </div>
  );
};

interface TitleProps {
  title: string;
  i: number;
}

const Title = ({ title, i, children }: PropsWithChildren<TitleProps>) => {
  return (
    <div className="my-4">
      <Typography.Body3 as="span" className="text-sm mr-4">{`0${
        i + 1
      }`}</Typography.Body3>{" "}
      <Typography.Body3
        as="span"
        className="text-sm"
      >{`${title}`}</Typography.Body3>
      {children}
    </div>
  );
};

export default TableOfContents;
