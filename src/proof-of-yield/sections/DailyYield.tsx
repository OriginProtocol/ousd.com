import React, { useState } from "react";
import Image from "next/image";
import { Section } from "../../components";
import { TableData, TableHead } from "../components";
import { smSize, lgSize } from "../../constants";
import { useViewWidth } from "../../hooks";
import { utils } from "ethers";
import { assetRootPath } from "../../utils/image";
const { commify } = utils;

interface DailyYieldProps {}

const ex = {
  date: 1675886432000,
  yieldDistributed: 1873.92,
  apy: 3.08,
  vaultValue: 49063918,
};

const mockData = [];

for (let i = 0; i < 20; i++) {
  mockData.push(ex);
}

const highlightCss =
  "border border-[#8c66fc] bg-gradient-to-r from-gradient2-from to-gradient2-to";

const DailyYield = ({}: DailyYieldProps) => {
  const width = useViewWidth();
  const [days, seTableDataays] = useState(true);

  return (
    <Section className="mt-10 md:mt-28">
      {/* Buttons */}
      {/* <div className="mb-3 sm:mb-6 bg-tooltip w-fit p-2 rounded-[100px]">
        <button
          className={twMerge(
            `rounded-[100px] border border-tooltip px-12 py-3`,
            ` ${days ? highlightCss : ""}`
          )}
          onClick={() => seTableDataays(true)}
        >
          Days
        </button>
        <button
          className={twMerge(
            `rounded-[100px] border border-tooltip px-12 py-3`,
            ` ${!days ? highlightCss : ""}`
          )}
          onClick={() => seTableDataays(false)}
        >
          Blocks
        </button>
      </div> */}

      {/* Main Table */}
      <table className="relative w-full bg-origin-bg-grey rounded-lg">
        {/* Table Head */}

        <thead>
          <tr>
            <TableHead align="left" className="pl-8">
              Date
            </TableHead>
            <TableHead className="whitespace-nowrap pr-8 lg:pr-14 xl:pr-24">
              <span className="pr-2">Yield distributed</span>
              <Image
                src={assetRootPath("/images/info.svg")}
                width="16"
                height="16"
                alt="info"
                className="mr-3 inline mb-[4px]"
              />
            </TableHead>
            <TableHead className="whitespace-nowrap pr-0 sm:pr-8 lg:pr-14 xl:pr-24">
              <span className="pr-2">APY</span>
              <Image
                src={assetRootPath("/images/info.svg")}
                width="16"
                height="16"
                alt="info"
                className="mr-3 inline mb-[4px]"
              />
            </TableHead>
            {width >= smSize && (
              <TableHead className="whitespace-nowrap pr-0 xl:pr-8">
                <span className="pr-2">Vault value</span>
                <Image
                  src={assetRootPath("/images/info.svg")}
                  width="16"
                  height="16"
                  alt="info"
                  className="mr-3 inline mb-[4px]"
                />
              </TableHead>
            )}
            <TableHead></TableHead>
          </tr>
        </thead>

        {/* Table Body */}

        <tbody className="relative px-6">
          {mockData.map((item, i) => (
            <tr className="border-t-2 border-black" key={item.date}>
              <TableData align="left" className="pl-8">
                {new Date(item.date).toLocaleDateString(undefined, {
                  month: "short",
                  year: "numeric",
                  day: "numeric",
                })}
              </TableData>
              <TableData
                className="whitespace-nowrap pr-8 lg:pr-14 xl:pr-24"
                width="1%"
              >
                ${commify(item.yieldDistributed)}
              </TableData>
              <TableData
                className="whitespace-nowrap pr-0 sm:pr-8 lg:pr-14 xl:pr-24"
                width="1%"
              >
                {item.apy}%
              </TableData>
              {width >= smSize && (
                <TableData
                  className="whitespace-nowrap pr-0 xl:pr-8"
                  width="1%"
                >
                  ${commify(item.vaultValue)}
                </TableData>
              )}
              <TableData
                className="whitespace-nowrap"
                width="1%"
                align="center"
              >
                {width >= lgSize ? (
                  <button className="rounded-[100px] px-6 py-2 text-origin-white mx-4 lg:mx-6 xl:mx-8">
                    <span>Proof of yield</span>
                    <Image
                      src={assetRootPath("/images/arrow-right.svg")}
                      width="20"
                      height="20"
                      alt="arrow-right"
                      className="pl-3 inline"
                    />
                  </button>
                ) : (
                  <button className="w-3 mx-4 translate-y-1/4">
                    <Image
                      width="1000"
                      height="1000"
                      src={assetRootPath("/images/arrow.svg")}
                      alt="arrow"
                    />
                  </button>
                )}
              </TableData>
            </tr>
          ))}
        </tbody>
      </table>
    </Section>
  );
};

export default DailyYield;
