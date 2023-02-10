import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { Section } from "../../components";
import {
  TableData,
  TableHead,
  Gradient2Button,
  TitleWithInfo,
} from "../components";
import { smSize, lgSize } from "../../constants";
import { useViewWidth } from "../../hooks";
import { utils } from "ethers";
import { assetRootPath } from "../../utils/image";
import { Typography } from "@originprotocol/origin-storybook";
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
  mockData.push(Object.assign({ ...ex }, { date: ex.date + i * 86400000 }));
}

const highlightCss =
  "border border-[#8c66fc] bg-gradient-to-r from-gradient2-from to-gradient2-to";

const DailyYield = ({}: DailyYieldProps) => {
  const router = useRouter();
  const width = useViewWidth();
  const [days, seTableDataays] = useState(true);

  const routeToYieldOnDay = (date: number) => {
    router.push(`/proof-of-yield/${date}`);
  };

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
            <TableHead align="left" className="whitespace-nowrap pl-8">
              <Typography.Body2 className="text-xs md:text-base">
                Date
              </Typography.Body2>
            </TableHead>
            <TableHead className="sm:whitespace-nowrap pr-8 lg:pr-14 xl:pr-24">
              <TitleWithInfo
                textClassName="leading-4"
                title="Yield distributed"
              ></TitleWithInfo>
            </TableHead>
            <TableHead className="whitespace-nowrap pr-0 sm:pr-8 lg:pr-14 xl:pr-24">
              <TitleWithInfo title="APY"></TitleWithInfo>
            </TableHead>
            {width >= smSize && (
              <TableHead className="whitespace-nowrap pr-0 xl:pr-8">
                <TitleWithInfo title="Vault value"></TitleWithInfo>
              </TableHead>
            )}
            <TableHead></TableHead>
          </tr>
        </thead>

        {/* Table Body */}

        <tbody className="relative px-6">
          {mockData.map((item, i) => (
            <tr
              className="group border-t-2 hover:bg-hover-bg border-origin-bg-black"
              key={item.date}
            >
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
                className="whitespace-nowrap px-6"
                width="1%"
                align="center"
              >
                {width >= lgSize ? (
                  <Gradient2Button
                    onClick={() => routeToYieldOnDay(item.date)}
                    className="bg-origin-bg-grey w-full group-hover:bg-[#1b1a1abb]"
                  >
                    <span>Proof of yield</span>
                    <Image
                      src={assetRootPath("/images/arrow-right.svg")}
                      width="20"
                      height="20"
                      alt="arrow-right"
                      className="pl-3 inline translate-y-[-1px]"
                    />
                  </Gradient2Button>
                ) : (
                  <button
                    onClick={() => routeToYieldOnDay(item.date)}
                    className="w-3 mx-4 flex justify-center items-center"
                  >
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
