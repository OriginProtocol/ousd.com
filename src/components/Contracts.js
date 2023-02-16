import React, { useEffect } from 'react'
import ContractStore from '../stores/ContractStore'
import { useStoreState } from 'pullstate'
import { setupContracts, fetchTvl } from '../utils/contracts'

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

    const tvlInterval = setInterval(() => {
      fetchTvl(contractsToExport.vault, contractsToExport.dripper)
    }, 12000)

    return () => {
      clearInterval(tvlInterval)
    }
  }, [refreshTvl])

  return ''
}

export default Contracts