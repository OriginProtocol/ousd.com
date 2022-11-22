import { Store } from 'pullstate'

const ContractStore = new Store({
  contracts: {},
  apy: {},
  ogv: {
    price: 0,
    circulating: 0,
    total: 0,
  },
})

export default ContractStore
