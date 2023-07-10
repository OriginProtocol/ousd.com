import { useEffect, useMemo, useState } from "react";
import { SECONDS_IN_A_MONTH } from "../constants";
import { getRewardsApy } from "./../utils/math";
import { ethers } from "ethers";
import { useStoreState } from "pullstate";
import ContractStore from "../stores/ContractStore";
import useOgv from "./useOgv";

const useStakingAPY = (amountStaked, duration) => {
  const { veogv } = useStoreState(ContractStore, (s) => s.contracts);

  const [loading, setLoading] = useState(true);
  const [veOgvReceived, setVeOGVReceived] = useState(0);

  const { totalVeSupply } = useOgv();

  useEffect(() => {
    if (!veogv) return;

    let done = false;

    async function go() {
      try {
        const [val] = await veogv.previewPoints(
          ethers.utils.parseEther(amountStaked.toString()),
          duration * SECONDS_IN_A_MONTH
        );

        if (!done) {
          setVeOGVReceived(parseFloat(ethers.utils.formatEther(val)));
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to fetch APY", err);
      }
    }

    go();

    return () => {
      done = true;
    };
  }, [amountStaked, duration, veogv]);

  const stakingAPY = useMemo(() => {
    if (!veOgvReceived || !totalVeSupply || !amountStaked) {
      return 0;
    }

    return getRewardsApy(veOgvReceived, amountStaked, parseFloat(totalVeSupply));
  }, [veOgvReceived, amountStaked, totalVeSupply]);

  return {
    loading,
    veOgvReceived,
    stakingAPY,
  };
};

export default useStakingAPY;
