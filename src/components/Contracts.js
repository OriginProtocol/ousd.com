import React, { useEffect } from 'react'
import { ethers } from 'ethers'
import ContractStore from 'stores/ContractStore'
import addresses from 'constants/contractAddresses'
import ogvAbi from 'constants/mainnetAbi/ogv.json'
import veogvAbi from 'constants/mainnetAbi/veogv.json'
import ousdAbi from 'constants/mainnetAbi/ousd.json'
import vaultAbi from 'constants/mainnetAbi/vault.json'
import { useStoreState } from 'pullstate'

const getContract = (address, abi, provider) => {
  try {
    return new ethers.Contract(
      address,
      abi,
      provider
    )
  } catch (e) {
    console.error(
      `Error creating contract in [getContract] with address:${address} abi:${JSON.stringify(
        abi
      )}`
    )
    throw e
  }
}

const Contracts = () => {
  const refreshTvl = useStoreState(ContractStore, (s) => s.refreshTvl)

  useEffect(() => {
    const provider = new ethers.providers.StaticJsonRpcProvider(
      process.env.NEXT_PUBLIC_ETHEREUM_RPC_PROVIDER,
      { chainId: parseInt(process.env.NEXT_PUBLIC_ETHEREUM_RPC_CHAIN_ID) }
    )
  
    const ousd = getContract(addresses.mainnet.OUSDProxy, ousdAbi, provider)
    const vault = getContract(addresses.mainnet.Vault, vaultAbi, provider)
    const ogv = getContract(addresses.mainnet.OGV, ogvAbi, provider)
    const veogv = getContract(addresses.mainnet.veOGV, veogvAbi, provider)
  
    const contractsToExport = {
      ousd,
      vault,
      ogv,
      veogv,
    }
  
    ContractStore.update((s) => {
      s.contracts = contractsToExport
    })

    if (!refreshTvl) {
      return
    }

    const fetchTotalSupply = async () => {
      const ousdTvl = await vault?.totalValue().then((r) => Number(r) / 10 ** 18)
      ContractStore.update((s) => {
        s.ousdTvl = ousdTvl
      })
    }

    const tvlInterval = setInterval(() => {
      fetchTotalSupply()
    }, 12000)

    return () => {
      clearInterval(tvlInterval)
    }
  }, [refreshTvl])

  return ''
}

export default Contracts