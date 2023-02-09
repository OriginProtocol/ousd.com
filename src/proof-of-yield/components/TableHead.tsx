import { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

interface TableHeadProps {
  align?: "left" | "right" | "center" | "justify" | "char";
  className?: string;
}

const TableHead = ({
  align,
  className,
  children,
}: PropsWithChildren<TableHeadProps>) => {
  return (
    <th
      align={`${align || "right"}`}
      className={twMerge(
        `text-base font-normal py-6 text-table-title w-fit`,
        className
      )}
    >
      {children}
    </th>
  );
};

export default TableHead;
