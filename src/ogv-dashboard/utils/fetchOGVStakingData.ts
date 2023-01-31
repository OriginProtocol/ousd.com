import { BigNumber } from "ethers";

const fetchOGVStakingData = async (
  days: number,
  ethBlocksPerDay: number,
  currentBlock: number,
  ogvContractAddress: string,
  stakingContractOgvBalanceSlot: BigNumber,
  ogvTotalSupplySlot: BigNumber
) => {
  const reqs = [];
  for (let i = 0; i < days; i++) {
    reqs.push({
      method: "eth_getStorageAt",
      params: [
        ogvContractAddress,
        stakingContractOgvBalanceSlot.toHexString(),
        "0x" + (currentBlock - i * ethBlocksPerDay).toString(16),
      ],
      id: i,
      jsonrpc: "2.0",
    });
  }

  for (let i = 0; i < days; i++) {
    reqs.push({
      method: "eth_getStorageAt",
      params: [
        ogvContractAddress,
        ogvTotalSupplySlot.toHexString(),
        "0x" + (currentBlock - i * ethBlocksPerDay).toString(16),
      ],
      id: i + days,
      jsonrpc: "2.0",
    });
  }

  for (let i = 0; i < days; i++) {
    reqs.push({
      method: "eth_getBlockByNumber",
      params: ["0x" + (currentBlock - i * ethBlocksPerDay).toString(16), true],
      id: i + days * 2,
      jsonrpc: "2.0",
    });
  }

  const res = await fetch(process.env.NEXT_PUBLIC_ETHEREUM_RPC_PROVIDER, {
    method: "POST",
    body: JSON.stringify(reqs),
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json();
  return data;
};

export default fetchOGVStakingData;
