import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Typography } from "@originprotocol/origin-storybook";
import { assetRootPath } from "../utils/image";
import { PieChart } from "react-minimal-pie-chart";
import { formatCurrency, rounded } from "../utils/math";
import { tokenColors, strategyMapping } from "../utils/constants";

const Collateral = ({ collateral, strategies }) => {
  const [open, setOpen] = useState()

  const total = collateral?.reduce((t, s) => {
    return {
      total: Number(t.total) + Number(s.name === "ousd" ? 0 : s.total),
    };
  }).total

  const strategiesSorted = strategies && Object.keys(strategies).sort((a, b) => strategies[a].total - strategies[b].total).reverse()
  
  const chartData = collateral?.map((token) => {
    return {
      title: token.name.toUpperCase(),
      value: total
        ? (token.name === "ousd" ? 0 : Number(token.total) / 3 / total) * 100
        : 0,
      color: tokenColors[token.name] || "#ff0000",
    }
  })

  const tokenNames = {
    dai: "Dai",
    usdc: "USD Coin",
    usdt: "Tether",
    ousd: "Origin Dollar",
  }

  return (
    <>
      <section className="bg-[#1e1f25]">
        <div className="px-[16px] md:px-[64px] lg:px-[134px] py-14 md:py-[120px] text-center">
          <Typography.H6
            className="text-[32px] md:text-[56px] leading-[36px] md:leading-[64px]"
            style={{ fontWeight: 500 }}
          >
            Always 100% collateralized
          </Typography.H6>
          <Typography.Body3 className="md:max-w-[943px] mt-[16px] mx-auto leading-[28px] text-[#b5beca]">
            OUSD is backed 1:1 by the most trusted collateral in crypto.
            Reserves are verifiable on-chain. You can redeem OUSD immediately at
            any time.
          </Typography.Body3>
          <div className="max-w-[1432px] mx-auto mt-20 mb-10 md:mb-20 py-6 xl:py-20 rounded-xl bg-[#141519]">
            <div className="flex flex-col md:flex-row justify-between px-6 xl:px-[132px]">
              <div className="relative w-full sm:w-1/2 mx-auto my-auto rounded-full p-4 bg-[#1e1f25]">
                <PieChart data={chartData} lineWidth={6} startAngle={270} />
                <div className="absolute left-1/2 bottom-1/2 -translate-x-1/2 translate-y-[16px] md:translate-y-[20px]">
                  <Typography.H6 className="text-[16px] md:text-[24px] leading-[32px]">
                    Total
                  </Typography.H6>
                  <Typography.H6 className="md:mt-3 text-[24px] md:text-[40px] leading-[32px] md:leading-[40px]">{`$${formatCurrency(
                    total,
                    0
                  )}`}</Typography.H6>
                </div>
              </div>
              <div className="md:w-1/2 md:ml-10 xl:ml-32 mt-6 md:my-auto pl-0 md:py-10 text-left">
                <div className="flex flex-col justify-between space-y-2">
                  {collateral?.map((token, i) => {
                    if (token.name === "ousd") return;
                    return (
                      <div
                        className="flex flex-row md:my-0 px-4 py-[13.5px] md:p-6 rounded-[8px] bg-[#1e1f25] w-full md:max-w-[351px] space-x-3 md:space-x-[22px]"
                        key={i}
                      >
                        <div className="relative w-12 md:w-[48px]">
                          <Image
                            src={assetRootPath(
                              `/images/${token.name}-logo.svg`
                            )}
                            fill
                            sizes="(max-width: 768px) 48px, 24px"
                            alt={token.name}
                          />
                        </div>
                        <div>
                          <div className="flex flex-row space-x-2">
                            <Typography.H7
                              className="text-[14px] md:text-[20px]"
                              style={{ fontWeight: 700 }}
                            >
                              {`${tokenNames[token.name]}`}
                            </Typography.H7>
                            <Typography.H7
                              className="text-[14px] md:text-[20px]"
                              style={{ fontWeight: 400 }}
                            >
                              {`(${token.name.toUpperCase()})`}
                            </Typography.H7>
                          </div>
                          <div className="flex flex-row space-x-2">
                            <Typography.Body
                              className="text-[12px] md:text-[16px]"
                              style={{ fontWeight: 700 }}
                            >
                              {`${formatCurrency(
                                (token.total / total) * 100,
                                2
                              )}%`}
                            </Typography.Body>
                            <Typography.Body
                              className="text-[12px] md:text-[16px] text-[#b5beca]"
                              style={{ fontWeight: 400 }}
                            >
                              {`$${formatCurrency(token.total, 0)}`}
                            </Typography.Body>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div
              className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 mt-6 md:mt-20 px-6 md:px-20 text-left ${
                open ? "" : "hidden"
              }`}
            >
              {strategies && strategiesSorted?.map((strategy, i) => {
                const tokens = ["DAI", "USDC", "USDT", "OUSD"]
                return (
                  <div
                    className="p-4 md:p-6 rounded-[7px] bg-[#1e1f25]"
                    key={i}
                  >
                    <Link
                      href={`https://etherscan.io/address/${
                        strategyMapping[strategy]?.address
                      }`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-row space-x-1"
                    >
                      <Typography.Body
                        className="text-[16px] leading-[28px]"
                        style={{ fontWeight: 500 }}
                      >
                        {strategyMapping[strategy]?.name}
                      </Typography.Body>
                      <Image
                        src={assetRootPath("/images/link.svg")}
                        width="12"
                        height="12"
                        className="mt-1"
                        alt="External link"
                      />
                    </Link>
                    <Typography.Body3 className="mt-2 md:mt-4 text-[12px] leading-[20px] text-[#b5beca]">
                      Collateral
                    </Typography.Body3>
                    <div className="grid grid-cols-2 gap-x-12 gap-y-1 md:gap-y-3 mt-2">
                      {tokens.map((token, i) => {
                        if (token === "OUSD" && (!strategies[strategy].holdings.OUSD || rounded(strategies[strategy].holdings.OUSD) === "0")) return
                        return (
                          <div className="flex flex-row space-x-2" key={i}>
                            <Image
                              src={assetRootPath(`/images/${token}-logo.svg`)}
                              width="28"
                              height="28"
                              alt={token}
                            />
                            <div className="flex flex-col">
                              <Typography.Body3 className="text-[14px] leading-[27px]">
                                {token.toUpperCase()}
                              </Typography.Body3>
                              <Link
                                href={
                                  strategyMapping[strategy]?.token
                                    ? `https://etherscan.io/token/${
                                        strategyMapping[strategy]?.token
                                      }?a=${
                                        strategyMapping[strategy]?.address
                                      }`
                                    : `https://etherscan.io/address/${
                                        strategyMapping[strategy]?.address
                                      }#tokentxns`
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-row space-x-1"
                              >
                                <Typography.Body3 className="text-[12px] leading-[19px] text-[#b5beca]">
                                  {`$${rounded(strategies[strategy].holdings[token], 2)}`}
                                </Typography.Body3>
                                <Image
                                  src={assetRootPath("/images/link.svg")}
                                  width="12"
                                  height="12"
                                  className="shrink-0"
                                  alt="External link"
                                />
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            <div
              className="flex flex-row justify-between items-center w-min mt-6 md:mt-20 mx-auto px-6 py-1.5 rounded-full whitespace-nowrap gradient2 space-x-2 cursor-pointer hover:opacity-90"
              onClick={(e) => {
                e.preventDefault();
                setOpen(!open);
              }}
            >
              <Typography.Body3
                className="text-[16px] leading-[28px]"
                style={{ fontWeight: 500 }}
              >
                {open ? "Hide contracts" : "View contracts"}
              </Typography.Body3>
              <div className="w-3.5">
                <Image
                  src={assetRootPath(`/images/caret-white.svg`)}
                  width="14"
                  height="8"
                  className={`${open ? "rotate-180" : ""}`}
                  alt="arrow"
                />
              </div>
            </div>
          </div>
          <Link
            href="https://docs.ousd.com/how-it-works"
            target="_blank"
            rel="noopener noreferrer"
            className="bttn gradient2"
          >
            <Typography.H7 className="font-normal">
              See how it works
            </Typography.H7>
          </Link>
        </div>
      </section>
    </>
  );
};

export default Collateral;
