import { setupContracts } from 'utils/contracts'

export async function fetchInitialTvl() {
  const { vault, dripper } = setupContracts()
  const tvl = await vault.totalValue().then((r) => Number(r) / 10 ** 18)
  const rewards = await dripper.availableFunds().then((r) => Number(r) / 10 ** 6)
  return tvl + rewards
}

