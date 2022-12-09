import React, { useEffect } from 'react'
import { ethers } from 'ethers'
import ContractStore from 'stores/ContractStore'
import { useStoreState } from 'pullstate'
import { setupContracts } from 'utils/contracts'

const Contracts = () => {
  const refreshTvl = useStoreState(ContractStore, (s) => s.refreshTvl)

  useEffect(() => {
    const contractsToExport = setupContracts()

    ContractStore.update((s) => {
      s.contracts = contractsToExport
    })

    if (!refreshTvl) {
      return
    }

    const fetchTvl = async () => {
      const tvl = await contractsToExport.vault?.totalValue().then((r) => Number(r) / 10 ** 18)
      const rewards = await contractsToExport.dripper?.availableFunds().then((r) => Number(r) / 10 ** 6)
      ContractStore.update((s) => {
        s.ousdTvl = tvl + rewards
      })
    }

    const tvlInterval = setInterval(() => {
      fetchTvl()
    }, 12000)

    return () => {
      clearInterval(tvlInterval)
    }
  }, [refreshTvl])

  return ''
}

export default Contracts