import { Store } from 'pullstate'

const ContractStore = new Store({
  contracts: {},
  apy: {},
  ogvStats: {
    price: 0,
    circulating: 0,
    total: 0,
  },
  refreshTvl: false,
})

export default ContractStore
