import React from "react";
import Image from "next/image";
import moment from "moment";
import { utils } from "ethers";
import { assetRootPath } from "../../utils/image";
import { Section } from "../../components";
import {
  BasicData,
  Gradient2Button,
  TableData,
  TableHead,
  TitleWithInfo,
} from "../components";
import { Typography } from "@originprotocol/origin-storybook";
import { shortenAddress } from "../../utils";
const { commify } = utils;

const e = {
  block: 16188461,
  date: 1675886432000,
  action: "Rebase",
  yieldDistributed: 1873.92,
  fees: 208.21,
  transactionHash:
    "0xd9973207c58e3a041786faba972417f853776b88e0453ea113eaa79e44ef4b07",
};

const mockData = [];
for (let i = 0; i < 5; i++) {
  mockData.push(
    Object.assign(
      { ...e },
      { block: e.block + i * 100, date: e.date + i * 1500 }
    )
  );
}

interface DayBasicDataProps {
  timestamp: number;
}

const DayBasicData = ({ timestamp }: DayBasicDataProps) => {
  return (
    <Section className="mb-20">
      <Gradient2Button className="flex justify-center items-center">
        <Image
          src={assetRootPath("/images/arrow-left.svg")}
          width="20"
          height="20"
          alt="arrow-left"
          className="pr-3 inline"
        />
        Back to list
      </Gradient2Button>

      {/* Date UTC */}
      <Typography.Body className="mt-20">
        {moment(timestamp).format("MMM D, YYYY")} UTC
      </Typography.Body>

      <TitleWithInfo
        className="mt-10 mb-4"
        title="Yield distributed"
      ></TitleWithInfo>

      <div className="w-fit flex justify-center items-center">
        <Typography.H2 className="font-bold inline">
          ${commify(1873.92)}
        </Typography.H2>
        <Image
          src={assetRootPath("/images/ousd-logo.svg")}
          width="64"
          height="64"
          alt="ousd-logo"
          className="inline ml-4"
        />
      </div>

      <div className="w-full mt-14 flex">
        <div className="w-2/3 mr-4">
          {/* Basic Stats section */}
          <div className="flex">
            <BasicData className="flex-1 rounded-l-lg" title="Distribution APY">
              {commify(3.08)}%
            </BasicData>
            <BasicData className="flex-1" title="OUSD vault value">
              ${commify(49063918)}
            </BasicData>
            <BasicData className="flex-1 rounded-r-lg" title="Fees generated">
              ${commify(208.21)}
            </BasicData>
          </div>

          {/* Yield distribution events */}
          <div className="text-blurry mt-14">
            <Typography.Body>Yield distribution events</Typography.Body>
            <Typography.Body3 className="mt-3 text-sm text-table-title">
              Sorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
              vulputate libero et velit interdum, ac aliquet odio mattis.
            </Typography.Body3>
            <table className="relative w-full bg-origin-bg-grey rounded-lg mt-6">
              <thead>
                <tr>
                  <TableHead align="left" className="pl-8">
                    Block / Date
                  </TableHead>
                  <TableHead align="left">Action</TableHead>
                  <TableHead className="pr-6">Amount</TableHead>
                  <TableHead className="pr-6">
                    <TitleWithInfo title="Fees"></TitleWithInfo>
                  </TableHead>
                  <TableHead className="pr-8">Transaction</TableHead>
                </tr>
              </thead>
              <tbody>
                {mockData.map((item, i) => (
                  <tr
                    className="group border-t-2 hover:bg-hover-bg border-origin-bg-black"
                    key={item.date}
                  >
                    <TableData align="left" className="pl-8">
                      <Typography.Body2>{item.block}</Typography.Body2>
                      <Typography.Body3 className="text-sm text-table-title">
                        {moment
                          .utc(item.date)
                          .format(moment.localeData().longDateFormat("L"))}
                        , {moment.utc(item.date).format("LTS")}
                      </Typography.Body3>
                    </TableData>
                    <TableData
                      align="left"
                      className="whitespace-nowrap"
                      width="1%"
                    >
                      <Typography.Body2>{item.action}</Typography.Body2>
                      <Typography.Body3 className="text-sm text-table-title text-left w-full">
                        (yield distribution)
                      </Typography.Body3>
                    </TableData>
                    <TableData className="whitespace-nowrap pr-6">
                      <Typography.Body2 className="">
                        ${commify(item.yieldDistributed)}
                      </Typography.Body2>
                    </TableData>

                    <TableData className="whitespace-nowrap pr-6" width="1%">
                      <Typography.Body2 className="text-right w-full">
                        ${item.fees}
                      </Typography.Body2>
                    </TableData>
                    <TableData className="whitespace-nowrap pr-12" width="1%">
                      {shortenAddress(item.transactionHash)}
                      <a
                        href={`https://etherscan.io/tx/${e.transactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block ml-2"
                      >
                        <Image
                          src={assetRootPath("/images/ext-link.svg")}
                          width="16"
                          height="16"
                          alt="ext-link"
                        />
                      </a>
                    </TableData>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Yield boost multiplier */}
        <div className="min-w-[33%] w-fit h-min rounded-lg bg-origin-bg-grey text-blurry">
          <div className="flex justify-center items-center w-fit m-8">
            <Typography.Body className="inline mr-2">
              Yield boost multiplier
            </Typography.Body>
            <Image
              src={assetRootPath("/images/info-white.svg")}
              width="16"
              height="16"
              alt="info"
              className="inline ml-1"
            />
          </div>
          <div className="border-2 mx-8 border-origin-bg-black px-6 py-4 mt-6 rounded-t-lg flex justify-between items-center">
            <div>
              <Typography.Body className="inline mr-1">{1.16}%</Typography.Body>
              <Typography.Body2 className="inline">APY</Typography.Body2>
            </div>
            <div>
              <Typography.Body3 className="text-table-title text-sm">
                Raw yield generated
              </Typography.Body3>
            </div>
          </div>
          <div className="border-2 mx-8 border-t-0 border-origin-bg-black px-6 py-4 flex justify-between items-center">
            <div>
              <Typography.Body className="inline mr-3">x</Typography.Body>
              <Typography.Body className="inline mr-1">2.63</Typography.Body>
              <Typography.Body2 className="inline">Boost</Typography.Body2>
            </div>
            <div className="max-w-[50%]">
              <Typography.Body3 className="text-table-title text-sm text-right">
                OUSD total supply ÷ Rebasing OUSD supply
              </Typography.Body3>
            </div>
          </div>
          <div className="border-2 mx-8 border-t-0 border-origin-bg-black px-6 py-4 flex justify-between items-center">
            <div>
              <Typography.Body className="inline mr-3">=</Typography.Body>
              <Typography.Body className="inline mr-1">{3.08}%</Typography.Body>
              <Typography.Body2 className="inline">APY</Typography.Body2>
            </div>
            <div>
              <Typography.Body3 className="text-table-title text-sm text-right">
                Distributed APY
              </Typography.Body3>
            </div>
          </div>
          <div className="mt-8 flex border-t-2 border-origin-bg-black">
            <div className="w-1/2 py-6 justify-center items-center flex-col border-r-2 border-origin-bg-black px-8">
              <TitleWithInfo
                textClassName="text-sm"
                title="Non-Rebasing supply"
              />
              <Typography.Body className="text-left w-full inline">
                {" "}
                {commify(30397664)}
              </Typography.Body>
              <Image
                src={assetRootPath("/images/ousd-logo.svg")}
                width="24"
                height="24"
                alt="ousd-logo"
                className="inline mb-2 ml-1"
              />
            </div>

            <div className="flex justify-center items-center my-6">
              <div className="w-1/2 whitespace-nowrap">
                <TitleWithInfo
                  textClassName="text-sm"
                  title="Rebasing supply"
                />
                <Typography.Body className="text-left w-full inline">
                  {" "}
                  {commify(18666254)}
                </Typography.Body>
                <Image
                  src={assetRootPath("/images/ousd-logo.svg")}
                  width="24"
                  height="24"
                  alt="ousd-logo"
                  className="inline mb-2 ml-1"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default DayBasicData;
