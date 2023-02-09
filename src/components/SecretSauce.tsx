import { Typography } from "@originprotocol/origin-storybook";
import Image from "next/image";
import React from "react";
import { useViewWidth } from "../hooks";
import { assetRootPath } from "../utils/image";
import { mdSize, lgSize, xl2Size } from "../constants";

function SecretSauce() {
  const width = useViewWidth();

  return (
    <section className="px-4 sm:px-8 md:px-16 lg:px-[8.375rem] bg-origin-bg-dgrey">
      <Typography.H3 className="pt-14 md:pt-[120px] mb-4 md:mb-20 w-full text-center">
        Not-so-secret sauce
      </Typography.H3>
      <div className="relative max-w-[89.5rem]  h-fit mx-auto flex flex-col lg:flex-row justify-center items-center">
        <div className="lg:w-3/5 xl:w-1/3 mb-12 lg:mb-0 lg:mr-24">
          <p className="font-sansInter font-normal text-base xl:text-lg mb-6">
            Multiple factors contribute to OUSD outperforming its underlying
            strategies, but there&apos;s one big one. While 100% of the
            collateral is used to generate yield, only some of the OUSD in
            circulation is receiving that yield.
          </p>
          <p className="font-sansInter font-normal text-sm xl:text-base leading-7 text-subheading">
            By default, OUSD does not grow when it&apos;s held by smart
            contracts. This means that the yield that would go to these smart
            contracts becomes a bonus for all other OUSD holders. OUSD is
            different from most other ERC-20 tokens because your balance
            increases without receiving a transfer. Many smart contracts, such
            as AMMs, are not set up to properly account for these increases. So
            OUSD is designed to allocate this yield to regular wallets instead
            of letting it go to waste. Any smart contract can opt in to receive
            yield, but the reality is that much of OUSD&apos;s supply is held in
            AMMs where liquidity providers are motivated to forego their yield
            in exchange for other incentives. <br />
            <br /> Additional sources of OUSD’s above-market yield include exit
            fees, smart rebalancing, and automated compounding. As the protocol
            grows, OUSD holders enjoy greater economies of scale with the cost
            of funds management spread out over a larger pool of users.
          </p>
        </div>
        <div
          className={`relative ${
            (width < xl2Size && width >= lgSize) || width < mdSize
              ? "w-[455px]"
              : "w-[768px]"
          } h-fit px-4 max-w-[100vw]`}
        >
          <Image
            src={
              (width < xl2Size && width >= lgSize) || width < mdSize
                ? assetRootPath("/images/secret-sauce-mobile.png")
                : assetRootPath("/images/secret-sauce.png")
            }
            width="1536"
            height="1232"
            className="w-full"
            alt="Secret Sauce"
          />
        </div>
      </div>
    </section>
  );
}

export default SecretSauce;
