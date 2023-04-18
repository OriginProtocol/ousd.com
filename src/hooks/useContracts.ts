import { useEffect } from "react";
import ContractStore from "../stores/ContractStore";
import { useStoreState } from "pullstate";
import { setupContracts } from "../utils/contracts";

const Contracts = () => {
  const refreshTvl = useStoreState(ContractStore, (s) => s.refreshTvl);

  useEffect(() => {
    const contractsToExport = setupContracts();

    ContractStore.update((s) => {
      //@ts-expect-error
      s.contracts = contractsToExport;
    });
  }, [refreshTvl]);

  return "";
};

export default Contracts;
