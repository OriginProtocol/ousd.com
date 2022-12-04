import { ethers } from 'ethers'
import ContractStore from 'stores/ContractStore'
import addresses from 'constants/contractAddresses'
import ogvAbi from 'constants/mainnetAbi/ogv.json'
import veogvAbi from 'constants/mainnetAbi/veogv.json'

/* fetchId - used to prevent race conditions.
 * Sometimes "setupContracts" is called twice with very little time in between and it can happen
 * that the call issued first (for example with not yet signed in account) finishes after the second
 * call. We must make sure that previous calls to setupContracts don't override later calls Stores
 */
export async function setupContracts(account, library, chainId, fetchId) {
  /* Using StaticJsonRpcProvider instead of JsonRpcProvider so it doesn't constantly query
   * the network for the current chainId. In case chainId changes, we rerun setupContracts
   * anyway. And StaticJsonRpcProvider also prevents "detected network changed" errors when
   * running node in forked mode.
   */
  const jsonRpcProvider = new ethers.providers.StaticJsonRpcProvider(
    process.env.ETHEREUM_RPC_PROVIDER,
    { chainId: parseInt(process.env.NEXT_PUBLIC_ETHEREUM_RPC_CHAIN_ID) }
  )

  let provider = jsonRpcProvider

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

  //const ousd = getContract(ousdProxy.address, network.contracts['OUSD'].abi)
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
    //ousd,
    ogv,
    veogv,
  }

  ContractStore.update((s) => {
    s.contracts = contractsToExport
    s.ogv = ogv
    s.veogv = veogv
    //s.ousd = ousd
  })

  return contractsToExport
}