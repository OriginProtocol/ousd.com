import { Contract } from "ethers";
import { Store } from "pullstate";

interface Contracts {
  ousd: Contract;
  vault: Contract;
  dripper: Contract;
  ogv: Contract;
  veogv: Contract;
}

interface IContractStore {
  refreshTvl: boolean;
  contracts: Contracts;
}

const ContractStore = new Store({
  contracts: {},
  apy: {},
  ogvStats: {
    price: 0,
    circulating: 0,
    total: 0,
  },
  refreshTvl: false,
});

export default ContractStore;
