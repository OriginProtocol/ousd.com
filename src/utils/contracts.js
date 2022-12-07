import { ethers } from 'ethers'
import ContractStore from 'stores/ContractStore'
import addresses from 'constants/contractAddresses'
import ogvAbi from 'constants/mainnetAbi/ogv.json'
import veogvAbi from 'constants/mainnetAbi/veogv.json'
import ousdAbi from 'constants/mainnetAbi/ousd.json'

export async function setupContracts() {

  const provider = new ethers.providers.StaticJsonRpcProvider(
    process.env.NEXT_PUBLIC_ETHEREUM_RPC_PROVIDER,
    { chainId: parseInt(process.env.NEXT_PUBLIC_ETHEREUM_RPC_CHAIN_ID) }
  )

  const getContract = (address, abi, overrideProvider) => {
    try {
      return new ethers.Contract(
        address,
        abi,
        overrideProvider ? overrideProvider : provider
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

  const ousd = getContract(addresses.mainnet.OUSDProxy, ousdAbi)
  const ogv = getContract(addresses.mainnet.OGV, ogvAbi)
  const veogv = getContract(addresses.mainnet.veOGV, veogvAbi)

  const fetchCreditsPerToken = async () => {
    try {
      const response = await fetch(process.env.CREDITS_ANALYTICS_ENDPOINT)
      if (response.ok) {
        const json = await response.json()
        ContractStore.update((s) => {
          s.currentCreditsPerToken = parseFloat(json.current_credits_per_token)
          s.nextCreditsPerToken = parseFloat(json.next_credits_per_token)
        })
      }
    } catch (err) {
      console.error('Failed to fetch credits per token', err)
    }
  }

  const callWithDelay = () => {
    setTimeout(async () => {
      Promise.all([
        fetchCreditsPerToken(),
      ])
    }, 2)
  }

  callWithDelay()

  const contractsToExport = {
    ousd,
    ogv,
    veogv,
  }

  ContractStore.update((s) => {
    s.contracts = contractsToExport
    s.ogv = ogv
    s.veogv = veogv
    s.ousd = ousd
  })

  return contractsToExport
}