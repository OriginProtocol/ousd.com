import { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

interface TableDataProps {
  align?: "left" | "right" | "center" | "justify" | "char";
  className?: string;
  width?: string;
}

const TableData = ({
  align,
  className,
  width,
  children,
}: PropsWithChildren<TableDataProps>) => {
  return (
    <td
      align={`${align || "right"}`}
      className={twMerge(`text-table-data py-9`, className)}
      width={width || "auto"}
    >
      {children}
    </td>
  );
};

export default TableData;
