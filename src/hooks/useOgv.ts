import { useEffect, useState } from "react";
import addresses from "../constants/contractAddresses";
import { useStoreState } from "pullstate";
import ContractStore from "../stores/ContractStore";

export const useOgv = () => {
  const { ogv, veogv } = useStoreState(ContractStore, (s) => s.contracts || {});
  const [totalStaked, setTotalStaked] = useState();
  const [totalSupply, setTotalSupply] = useState();
  const [totalVeSupply, setTotalVeSupply] = useState();
  const [optionalLockupBalance, setOptionalLockupBalance] = useState();
  const [mandatoryLockupBalance, setMandatoryLockupBalance] = useState();

  const burnBlock = 15724869;

  useEffect(() => {
    if (!(ogv && veogv)) {
      return;
    }
    const fetchStakedOgv = async () => {
      const staked = await ogv
        .balanceOf(addresses.mainnet.veOGV)
        .then((r) => Number(r) / 10 ** 18);
      const supply = await ogv.totalSupply().then((r) => Number(r) / 10 ** 18);
      const optional = await ogv
        .balanceOf(addresses.mainnet.optionalLockupDistributor)
        .then((r) => Number(r) / 10 ** 18);
      const mandatory = await ogv
        .balanceOf(addresses.mainnet.mandatoryLockupDistributor)
        .then((r) => Number(r) / 10 ** 18);
      const totalVe = await veogv
        .totalSupply()
        .then((r) => Number(r) / 10 ** 18);
      setTotalStaked(staked);
      setTotalSupply(supply);
      setOptionalLockupBalance(optional);
      setMandatoryLockupBalance(mandatory);
      setTotalVeSupply(totalVe);

      const burnedOptional = await ogv
        .balanceOf(addresses.mainnet.optionalLockupDistributor, {
          blockTag: burnBlock,
        })
        .then((r) => Number(r) / 10 ** 18);
      const burnedMandatory = await ogv
        .balanceOf(addresses.mainnet.mandatoryLockupDistributor, {
          blockTag: burnBlock,
        })
        .then((r) => Number(r) / 10 ** 18);
      setOptionalLockupBalance(burnedOptional);
      setMandatoryLockupBalance(burnedMandatory);
    };
    fetchStakedOgv();
  }, [ogv, veogv]);

  return {
    totalStaked,
    totalSupply,
    totalVeSupply,
    optionalLockupBalance,
    mandatoryLockupBalance,
  };
};

export default useOgv;
