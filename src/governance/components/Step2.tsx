import { Typography } from "@originprotocol/origin-storybook";
import React from "react";
import { Gradient2Button } from "../../components";

interface Step2Props {
  stakingApy: number;
  className?: string;
}

const Step2 = ({ stakingApy, className }: Step2Props) => {
  return (
    <div className={className}>
      <Typography.Body2 className="font-medium text-blurry">
        If you haven't already, transfer your OGV to a web3 wallet (eg. Metamask
        or WalletConnect) and connect to the OUSD governance
        <span className="ml-1 text-[#ffcf88]">staking page.</span>
      </Typography.Body2>

      <Typography.Body2 className="font-normal mt-4 text-white-grey">
        By selecting the amount of OGV you wish to stake and for how long, you
        will see the amount of votiing power you will be given in veOGV and the
        variable rewards APY you will recieve on your staked OGV.
        <br />
        <br />
        The longer you lock up your OGV the more voting power and higher APY you
        will be given.
      </Typography.Body2>

      <Gradient2Button
        outerDivClassName="mt-10"
        className="bg-transparent hover:bg-transparent py-3 px-8 lg:px-10"
      >
        <Typography.Body2>Stake OGV</Typography.Body2>
      </Gradient2Button>

      <div className="bg-gradient-to-r from-gradient1-fromt to-gradient1-tot mt-10 p-6 lg:p-10 rounded-lg">
        <Typography.H6 className="text-gradient1">
          Earn {stakingApy.toFixed(2)}% APY
        </Typography.H6>
        <Typography.Body3 className="text-blurry leading-[23px] mt-3 text-sm font-medium">
          Rewards accrue in OGV and can be collected at anytime from the OUSD
          governance staking page. Accrued rewards will automatically be
          collected when staking more OGV.
        </Typography.Body3>
      </div>
    </div>
  );
};

export default Step2;
